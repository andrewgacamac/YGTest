# YardGuard — Maintenance & Update Guide

Practical guide for whoever maintains this site: how it's built, what was done,
and **what to update whenever you change something**. Keep this file current.

---

## 1. How the site is built (architecture)

| Piece | What it is | Where |
|---|---|---|
| **Website** | Vite multi-page **static site** (one `.html` per page) | this repo, built with `npm run build` → `dist/` |
| **Hosting** | **DigitalOcean App Platform** (static site), fronted by **Cloudflare** | auto-deploys from GitHub `main` |
| **Quote-form backend** | A **DigitalOcean serverless Function** that emails each lead | `functions/` — deployed separately with `doctl` |
| **Email delivery** | **Resend** (transactional email API) | key lives in `functions/.env` (never committed) |

**Two separate deploy paths — this is the #1 thing to remember:**
- **Site content/CSS/JS** → `git push` → App Platform auto-rebuilds ygtoronto.com.
- **The email function** → `cd functions && doctl serverless deploy .` (a git push does **NOT** deploy it).

**Repos:**
- `origin` → `andrewgacamac/YardGuard` = **production** (ygtoronto.com)
- `ygtest` → `andrewgacamac/YGTest` = test (coral-app-3vq9c.ondigitalocean.app)

---

## 2. What was done (change log)

- **Replaced Supabase** with a standalone DigitalOcean serverless Function that emails
  quote-form leads via **Resend** (Supabase's free tier paused after ~1 week and
  dropped leads). No database; leads go straight to an inbox.
- **Quote form** (`quote.html` + `src/js/quote-logic.js`) now POSTs JSON to the
  function URL (`window.QUOTE_ENDPOINT` in `quote.html`).
- **Email recipients**: supports multiple `TO` (comma-separated), optional **CC**
  (visible) and **BCC** (blind) copies.
- **Mobile fixes**: products page overflow, home hero headline, before/after slider
  handle position, and the internal strategy deck.
- **Contact email** changed sitewide to `contact@yardguardlandscaping.com`.
- **AI/SEO**: added `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`.
  (Every page already has JSON-LD schema.)

---

## 3. What to update — by type of change

### ▸ Editing page content, text, styles, or images
1. Edit the `.html` / `assets/css/style.css` / `assets/js/main.js`.
2. `npm run build` (optional local check) → **commit & push to `main`**.
3. App Platform auto-deploys. **Hard-refresh** to see it (Cloudflare caches HTML).

### ▸ Adding a NEW page
When you add `newpage.html`, also update:
- [ ] **`public/sitemap.xml`** — add a `<url>` entry.
- [ ] **`public/llms.txt`** — add it under the right section with a one-line description.
- [ ] **Nav + footer links** on the other pages (they're copied per-page).
- [ ] `vite.config.js` picks up new `.html` files automatically (no change needed).

### ▸ Changing contact info (phone / email / address)
Contact details appear on **every page's footer** and in **JSON-LD schema**. Update:
- [ ] All pages' footer (search/replace across `*.html`, skip `*_backup.html`).
- [ ] JSON-LD schema blocks (`telephone`, `email`, `address`) on each page.
- [ ] **`public/llms.txt`** contact section.
- [ ] If the **email that RECEIVES leads** changes → see next section.

### ▸ Changing WHO gets quote-form leads, or the sender
These control the actual lead emails and live in the **function**, not the site:
- **Recipient(s) / sender / API key** → edit `functions/.env`:
  - `LEAD_NOTIFY_EMAIL` — who receives leads (comma-separate for multiple)
  - `LEAD_BCC_EMAIL` — blind copy
  - `FROM_EMAIL` — the "From" address (domain must be verified in Resend)
  - `RESEND_API_KEY` — the Resend key
- **CC (visible copy)** → edit `functions/project.yml` (`LEAD_CC_EMAIL`) — it can't be
  empty in `.env`, so it lives here.
- **After ANY of these:** `cd functions && doctl serverless deploy .`
- `.env` is **gitignored** — these values are NOT on GitHub (only on the machine that
  deploys + on the live function). Keep a safe copy of `functions/.env`.

### ▸ Changing the email body / subject / validation
- Edit `functions/packages/api/quote/index.js`.
- Test locally: `cd functions && node --env-file=.env test-local.mjs`.
- Deploy: `doctl serverless deploy .`

### ▸ Changing the quote form fields
- Edit the fields in `quote.html` AND the JSON payload in `src/js/quote-logic.js`
  (the `payload` object), AND `functions/.../index.js` if the backend must handle
  the new field. Then push the site + redeploy the function.

---

## 4. Deploy commands (copy-paste)

**Deploy the site (content/CSS/JS):**
```bash
git add -A && git commit -m "..." && git push origin main
# optional: also push to test repo →  git push ygtest main
```

**Deploy the email function (after editing anything in functions/):**
```bash
cd functions
doctl serverless deploy .
# get the public URL (only needed if it changed):
doctl serverless functions get api/quote --url
```

**Run everything locally to test:**
```bash
# terminal 1 — the function wrapper
cd functions && node --env-file=.env dev-server.mjs
# terminal 2 — the site (Vite proxies /api to the wrapper)
npm run dev
# open http://localhost:5173/quote.html
```

---

## 5. Gotchas (read before debugging)

- **Cloudflare hides emails**: raw page HTML shows `[email protected]` + a `data-cfemail`
  value, not the real address. This is normal (anti-spam). Don't "fix" it — visitors
  see the real email. To confirm the value, decode `data-cfemail` (first hex byte is
  the XOR key).
- **Cloudflare caches HTML**: after a site deploy, a page may serve a stale copy for a
  few minutes. Hard-refresh or use a private tab. Brand-new files (robots.txt, etc.)
  appear immediately.
- **Two deploy paths**: pushing to GitHub does NOT deploy the function. Use `doctl`.
- **Secrets**: only `functions/.env` holds the Resend key; it's gitignored. Never put
  the key in the site, `project.yml`, or any committed file.

---

## 6. Outstanding / TODO

- [x] **Sending domain verified** — `contact.ygtoronto.com` is verified in Resend.
      Live function sends FROM `quotes@contact.ygtoronto.com` TO
      `contact@yardguardlandscaping.com`, BCC `goldenorchard1@icloud.com` (safety net).
- [ ] **Confirm `contact@yardguardlandscaping.com` actually receives** — after a test
      submission, check that inbox. If the lead only shows up in the BCC
      (`goldenorchard1@icloud.com`) and not there, that mailbox needs email hosting/MX
      set up on `yardguardlandscaping.com`, or change the recipient.
- [ ] Once confirmed receiving, optionally drop the BCC safety net (`LEAD_BCC_EMAIL`).
- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster Tools.
