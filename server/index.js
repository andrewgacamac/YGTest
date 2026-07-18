// Standalone email endpoint for the Yard Guard quote form.
//
// The website stays a plain static site; this small service does one thing:
// receive a quote submission (POST /api/quote) and email it to the owner via
// Resend, with any yard photos attached. No database, nothing to pause.
//
// Required env vars:
//   RESEND_API_KEY     - Resend API key (server-side only, never exposed)
//   LEAD_NOTIFY_EMAIL  - inbox that should receive the leads (Michael's email)
// Optional env vars:
//   FROM_EMAIL         - verified sender, e.g. "YardGuard <quotes@ygtoronto.com>"
//   ALLOWED_ORIGIN     - CORS origin for the site (default "*")
//   PORT               - listen port (default 3000)

import http from 'node:http';
import Busboy from 'busboy';

const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || 'YardGuard Quotes <quotes@ygtoronto.com>';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// Attachment limits (photos are optional; these only apply when present).
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per photo
const MAX_TOTAL_BYTES = 18 * 1024 * 1024; // ~18 MB total, safely under email caps

// Very light in-memory rate limit: max submissions per IP per window.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map(); // ip -> number[] (timestamps)

// Human-readable labels for the lead fields, in the order they appear in the email.
const FIELD_LABELS = [
  ['package', 'Package interest'],
  ['project_type', 'Project areas'],
  ['size', 'Approximate size'],
  ['timeline', 'Timeline'],
  ['address', 'Street address'],
  ['city', 'City'],
  ['postalCode', 'Postal code'],
  ['howHeard', 'Heard about us via'],
  ['message', 'Message'],
  ['casl-optin', 'Opted in to marketing'],
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

// Parse a multipart/form-data body into { fields, projectTypes, files }.
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    let bb;
    try {
      bb = Busboy({ headers: req.headers, limits: { files: MAX_FILES, fileSize: MAX_FILE_BYTES } });
    } catch (err) {
      reject(Object.assign(err, { statusCode: 400 }));
      return;
    }

    const fields = {};
    const projectTypes = [];
    const files = [];
    let totalBytes = 0;
    let done = false;

    const fail = (statusCode, message) => {
      if (done) return;
      done = true;
      reject(Object.assign(new Error(message), { statusCode }));
    };

    bb.on('field', (name, val) => {
      // project_type is a set of checkboxes -> collect all values.
      if (name === 'project_type') projectTypes.push(val);
      else fields[name] = val;
    });

    bb.on('file', (name, stream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      let fileBytes = 0;
      let tooBig = false;

      stream.on('data', (chunk) => {
        fileBytes += chunk.length;
        totalBytes += chunk.length;
        chunks.push(chunk);
      });
      stream.on('limit', () => { tooBig = true; });
      stream.on('close', () => {
        if (done) return;
        if (tooBig) {
          return fail(413, `The photo "${filename}" is larger than ${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB. Please attach a smaller image.`);
        }
        if (fileBytes === 0) return; // empty file input, nothing attached
        if (!/^image\//i.test(mimeType)) {
          return fail(415, 'Only image files can be attached.');
        }
        files.push({ filename: filename || 'photo', mimeType, content: Buffer.concat(chunks) });
      });
    });

    bb.on('filesLimit', () => fail(413, `Please attach at most ${MAX_FILES} photos.`));
    bb.on('error', (err) => fail(400, err.message || 'Could not read the submission.'));
    bb.on('close', () => {
      if (done) return;
      if (totalBytes > MAX_TOTAL_BYTES) {
        return fail(413, 'The attached photos are too large in total. Please attach fewer or smaller images.');
      }
      done = true;
      resolve({ fields, projectTypes, files });
    });

    req.pipe(bb);
  });
}

function buildEmailHtml(fields, projectTypes) {
  const rows = [];
  // Contact block first.
  rows.push(['Name', `${fields.firstName || ''} ${fields.lastName || ''}`.trim()]);
  rows.push(['Email', fields.email || '']);
  rows.push(['Phone', fields.phone || '']);

  for (const [key, label] of FIELD_LABELS) {
    let value;
    if (key === 'project_type') value = projectTypes.join(', ');
    else if (key === 'casl-optin') value = fields[key] ? 'Yes' : 'No';
    else value = fields[key];
    if (value === undefined || value === null || String(value).trim() === '') continue;
    rows.push([label, value]);
  }

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111827">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`
    )
    .join('');

  return `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:24px;margin:0">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:#166534;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">New Quote Request — YardGuard</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table>
      <div style="padding:14px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb">Reply directly to this email to reach the customer. Sent automatically from the ygtoronto.com quote form.</div>
    </div>
  </body></html>`;
}

async function sendEmail({ subject, html, attachments, replyTo }) {
  const body = {
    from: FROM_EMAIL,
    to: [LEAD_NOTIFY_EMAIL],
    subject,
    html,
    attachments,
  };
  // Let Michael reply straight to the customer.
  if (replyTo && /.+@.+\..+/.test(replyTo)) body.reply_to = replyTo;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Resend responded ${resp.status}: ${text}`);
  }
  return resp.json();
}

async function handleQuote(req, res) {
  if (!RESEND_API_KEY || !LEAD_NOTIFY_EMAIL) {
    console.error('Missing RESEND_API_KEY or LEAD_NOTIFY_EMAIL env var.');
    return json(res, 500, { error: 'The quote form is not configured. Please call us instead.' });
  }

  if (rateLimited(clientIp(req))) {
    return json(res, 429, { error: 'Too many requests. Please try again in a few minutes.' });
  }

  let parsed;
  try {
    parsed = await parseMultipart(req);
  } catch (err) {
    return json(res, err.statusCode || 400, { error: err.message || 'Invalid submission.' });
  }

  const { fields, projectTypes, files } = parsed;

  // Honeypot: real users never fill this. Pretend success so bots don't retry.
  if (fields._gotcha && String(fields._gotcha).trim() !== '') {
    return json(res, 200, { ok: true });
  }

  const required = ['firstName', 'lastName', 'email', 'phone'];
  const missing = required.filter((k) => !fields[k] || !String(fields[k]).trim());
  if (missing.length) {
    return json(res, 400, { error: `Please fill in: ${missing.join(', ')}.` });
  }

  const subject = `New Quote Request — ${fields.firstName} ${fields.lastName}${fields.package ? ` (${fields.package})` : ''}`;
  const html = buildEmailHtml(fields, projectTypes);
  const attachments = files.map((f) => ({ filename: f.filename, content: f.content.toString('base64') }));

  try {
    await sendEmail({ subject, html, attachments, replyTo: fields.email });
  } catch (err) {
    console.error('Email send failed:', err.message);
    return json(res, 502, { error: 'We could not send your request right now. Please try again or call us at (647) 216-7787.' });
  }

  return json(res, 200, { ok: true });
}

const server = http.createServer((req, res) => {
  const url = (req.url || '').split('?')[0];

  if (req.method === 'OPTIONS') {
    return json(res, 204, {});
  }
  if (req.method === 'GET' && (url === '/' || url === '/health')) {
    return json(res, 200, { ok: true, service: 'yardguard-email-endpoint' });
  }
  if (req.method === 'POST' && (url === '/api/quote' || url === '/quote')) {
    return handleQuote(req, res);
  }
  return json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`YardGuard email endpoint listening on :${PORT}`);
  if (!RESEND_API_KEY || !LEAD_NOTIFY_EMAIL) {
    console.warn('WARNING: RESEND_API_KEY and/or LEAD_NOTIFY_EMAIL are not set — submissions will return a config error.');
  }
});
