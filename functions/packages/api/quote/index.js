// DigitalOcean Function: emails a YardGuard quote-form lead via Resend.
//
// Runs on DO's free serverless Functions tier — no server to manage, holds the
// Resend key safely (never exposed to the browser), wakes on each submission.
// The static site POSTs JSON here; this validates it and sends the email.
//
// Env vars (set at deploy time, never committed):
//   RESEND_API_KEY     - Resend API key
//   LEAD_NOTIFY_EMAIL  - inbox that receives leads (Michael)
//   FROM_EMAIL         - verified sender, e.g. "YardGuard <quotes@ygtoronto.com>"
//   ALLOWED_ORIGIN     - site origin for CORS (default "*")

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

// Lead fields in the order they appear in the email, with human labels.
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

function buildEmailHtml(fields, projectTypes) {
  const rows = [];
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

function response(statusCode, obj) {
  // NOTE: DigitalOcean's web-function platform adds permissive CORS headers
  // (Access-Control-Allow-Origin: * etc.) automatically. We must NOT add our
  // own, or the response ends up with duplicate ACAO headers and browsers
  // reject it as invalid. So only set Content-Type here.
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}

// Split a comma/semicolon-separated list of addresses into a clean array.
// Lets LEAD_NOTIFY_EMAIL / LEAD_CC_EMAIL / LEAD_BCC_EMAIL each hold one or more
// recipients, e.g. "michael@ygtoronto.com, andrew@me.com".
function parseRecipients(value) {
  return String(value || '')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main(args) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  const method = String(args.__ow_method || 'post').toLowerCase();

  // CORS preflight
  if (method === 'options') return response(204, {}, origin);
  if (method !== 'post') return response(405, { error: 'Method not allowed' }, origin);

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'YardGuard Quotes <onboarding@resend.dev>';
  const LEAD_CC_EMAIL = process.env.LEAD_CC_EMAIL;   // optional, visible copy
  const LEAD_BCC_EMAIL = process.env.LEAD_BCC_EMAIL; // optional, blind copy
  if (!RESEND_API_KEY || !LEAD_NOTIFY_EMAIL) {
    return response(500, { error: 'The quote form is not configured. Please call us instead.' }, origin);
  }

  // For a JSON web request, DO merges the body fields into args.
  // Honeypot: real users never fill this. Pretend success so bots don't retry.
  if (args._gotcha && String(args._gotcha).trim() !== '') {
    return response(200, { ok: true }, origin);
  }

  const required = ['firstName', 'lastName', 'email', 'phone'];
  const missing = required.filter((k) => !args[k] || !String(args[k]).trim());
  if (missing.length) {
    return response(400, { error: `Please fill in: ${missing.join(', ')}.` }, origin);
  }

  const projectTypes = Array.isArray(args.project_type)
    ? args.project_type
    : args.project_type
    ? [args.project_type]
    : [];

  const subject = `New Quote Request — ${args.firstName} ${args.lastName}${args.package ? ` (${args.package})` : ''}`;
  const emailBody = {
    from: FROM_EMAIL,
    to: parseRecipients(LEAD_NOTIFY_EMAIL),
    subject,
    html: buildEmailHtml(args, projectTypes),
  };
  // Optional CC (visible) and BCC (blind) copies.
  const cc = parseRecipients(LEAD_CC_EMAIL);
  const bcc = parseRecipients(LEAD_BCC_EMAIL);
  if (cc.length) emailBody.cc = cc;
  if (bcc.length) emailBody.bcc = bcc;
  // Let the owner reply straight to the customer.
  if (args.email && /.+@.+\..+/.test(args.email)) emailBody.reply_to = args.email;

  try {
    const r = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailBody),
    });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      throw new Error(`Resend responded ${r.status}: ${text}`);
    }
  } catch (err) {
    console.error('Email send failed:', err.message);
    return response(502, { error: 'We could not send your request right now. Please try again or call us at (647) 216-7787.' }, origin);
  }

  return response(200, { ok: true }, origin);
}

exports.main = main;
