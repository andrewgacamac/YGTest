# YardGuard quote email — DigitalOcean Function

A serverless DigitalOcean Function that receives the quote form (JSON) and emails
the lead to the owner via [Resend](https://resend.com). No server to manage, free
tier, holds the Resend key safely (never exposed to the browser). The static site
stays static and just POSTs to this function's URL.

## Layout

```
functions/
  project.yml                     # DO Functions project (env, runtime, web:true)
  packages/api/quote/index.js     # the handler (main)
  test-local.mjs                  # local test harness (no doctl needed)
  .env.example                    # template for deploy-time env values
```

## Test locally (no deploy)

```bash
cd functions
cp .env.example .env       # fill in RESEND_API_KEY + LEAD_NOTIFY_EMAIL
node --env-file=.env test-local.mjs
```

## One-time Resend setup

1. Free Resend account.
2. Verify the `ygtoronto.com` domain (SPF/DKIM DNS records) so mail lands in the
   inbox, then set `FROM_EMAIL` to e.g. `quotes@ygtoronto.com`. Until verified,
   `onboarding@resend.dev` works but only delivers to the Resend account's email.
3. Create an API key → put it in `functions/.env`.

## Deploy to DigitalOcean

```bash
# one-time: install doctl and connect the serverless namespace
doctl serverless install
doctl serverless connect

# deploy (reads functions/.env to fill the ${...} vars in project.yml)
cd functions
doctl serverless deploy .

# get the public URL of the function:
doctl serverless functions get api/quote --url
```

Take that URL and point the form at it — set `window.QUOTE_ENDPOINT` to it in
`quote.html`, e.g.:

```html
<script>window.QUOTE_ENDPOINT = "https://faas-xxx.doserverless.co/api/v1/web/fn-.../api/quote";</script>
```

(The function URL is public, not a secret — the Resend key stays inside the
function via the env vars, never in the page.)

## Config (env vars)

`RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` are required; `FROM_EMAIL` and
`ALLOWED_ORIGIN` are optional. Set them in `functions/.env` (gitignored) — they're
injected at deploy time and never committed.
