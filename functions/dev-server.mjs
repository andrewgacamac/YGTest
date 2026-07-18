// Local dev wrapper for the DigitalOcean Function — lets you test the exact same
// handler in the browser without deploying. Simulates how DO invokes the function
// (JSON body merged into args) and serves it at http://localhost:3000/api/quote.
//
// Run:  node --env-file=.env dev-server.mjs
// (Vite proxies /api -> here, so the form at :5173/quote.html works end to end.)

import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { main } = require('./packages/api/quote/index.js');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = (req.url || '').split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'yardguard-function-dev' }));
    return;
  }

  if (url === '/api/quote') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      const args = { __ow_method: (req.method || 'post').toLowerCase() };
      if (body) {
        try { Object.assign(args, JSON.parse(body)); }
        catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
      }
      const r = await main(args);
      res.writeHead(r.statusCode || 200, r.headers || { 'Content-Type': 'application/json' });
      res.end(typeof r.body === 'string' ? r.body : JSON.stringify(r.body || {}));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`YardGuard function dev server on :${PORT} — simulates the DO Function at /api/quote`);
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_NOTIFY_EMAIL) {
    console.warn('WARNING: RESEND_API_KEY / LEAD_NOTIFY_EMAIL not set — submissions will return a config error.');
  }
});
