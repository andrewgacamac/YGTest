# YardGuard email endpoint

A small, standalone backend that receives the quote form and emails the lead
(with any yard photos attached) to the owner via [Resend](https://resend.com).
It is fully decoupled from the static website — the site stays static; this only
handles form submissions.

## What it exposes

`POST /api/quote` — accepts `multipart/form-data` from the quote form, validates
it, and emails the lead. Photos are optional. `GET /health` returns `200`.

## Run locally

```bash
cd server
npm install
cp .env.example .env      # fill in RESEND_API_KEY and LEAD_NOTIFY_EMAIL
npm start                 # listens on :3000
```

The Vite dev server proxies `/api` to `http://localhost:3000` (see
`vite.config.js`), so with both running you can submit the form at
`http://localhost:5173/quote.html` end to end.

## One-time Resend setup

1. Create a free Resend account.
2. Add and verify the `ygtoronto.com` domain (adds SPF/DKIM DNS records so mail
   lands in the inbox, not spam).
3. Create an API key → put it in `.env` as `RESEND_API_KEY`.

## Deploy on a DigitalOcean Droplet ($0 — runs on the server you already have)

Set up the backend **before** serving the updated static site, or the form will
POST to `/api/quote` and 404. Templates live in `server/deploy/`.

```bash
# 1. Pull the latest code on the Droplet (however you deploy the site), then:
cd /var/www/yardguard/server        # adjust to your repo path
npm install --omit=dev

# 2. Create the server env file (never committed):
cp .env.example .env && nano .env    # set RESEND_API_KEY + LEAD_NOTIFY_EMAIL

# 3. Run it persistently with systemd:
which node                           # put this path in the .service ExecStart
sudo cp deploy/yardguard-email.service /etc/systemd/system/
sudo nano /etc/systemd/system/yardguard-email.service   # fix paths/node path
sudo systemctl daemon-reload
sudo systemctl enable --now yardguard-email
systemctl status yardguard-email     # should be "active (running)"
curl -s http://127.0.0.1:3000/health # {"ok":true,...}

# 4. Route /api to it in nginx: paste deploy/nginx-api.conf into the
#    server{} block for ygtoronto.com, then:
sudo nginx -t && sudo systemctl reload nginx
```

Now `https://ygtoronto.com/api/quote` reaches the backend same-origin. Only then
serve the updated static site so the form points at a live endpoint.

**App Platform note:** if you later move to App Platform, add `server/` as a
**Service** component (`npm start`), set the same env vars in the dashboard, and
route `/api` to it. Note an always-on Service is ~$5/mo; a Droplet is $0 extra.

## Config (env vars)

See `.env.example`. `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` are required; the
rest have sensible defaults. These are **server-side only** — never expose them
to the browser.
