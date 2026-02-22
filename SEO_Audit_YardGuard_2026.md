# YardGuard SEO Audit Report
**Domain:** ygtoronto.com
**Business:** Yard Guard Landscaping — Artificial Turf Installation, GTA West End
**Audit Date:** February 2026
**Prepared for:** Michael Kasowski

---

## Executive Summary

YardGuard has a well-designed, professional website with strong on-page structure, good product schema markup, and a smart content strategy around the artificial turf value proposition. However, there is **one critical technical issue that must be fixed immediately**: every page on the site has canonical tags and schema markup pointing to `ygtoronto.com` instead of `ygtoronto.com`. This tells Google your content "belongs" to a different domain, which can prevent proper indexation and split your ranking authority. Additionally, Google Analytics is not connected (placeholder tracking ID), meaning you currently have zero visibility into your traffic.

Beyond those urgent fixes, the biggest growth opportunity is **content expansion**: competitors like Creative Grass dominate local search with dozens of location-specific pages, while Echoing Green earns traffic through an active blog. YardGuard currently has only one location landing page and no blog — a gap that represents significant untapped search potential.

**Top 3 priorities:**
1. Fix canonical URLs across all pages (30-minute fix, maximum impact)
2. Add Google Analytics + Google Business Profile (essential foundation)
3. Build location landing pages for Etobicoke, Oakville, and Brampton

---

## Keyword Opportunity Table

| Keyword | Est. Difficulty | Opportunity | Current Ranking | Intent | Recommended Content |
|---------|----------------|-------------|-----------------|--------|---------------------|
| artificial turf Mississauga | Medium | **High** | Not ranked | Transactional | Location landing page ✓ exists |
| artificial grass Etobicoke | Low-Medium | **High** | Not ranked | Transactional | New location page needed |
| artificial turf installation GTA | High | **High** | Not ranked | Transactional | Homepage optimization |
| pet turf Mississauga | Low | **High** | Not ranked | Transactional | Pets page + location combo |
| artificial grass Oakville | Low-Medium | **High** | Not ranked | Transactional | New location page needed |
| backyard putting green Toronto | Low | **High** | Not ranked | Transactional | Dedicated product page |
| artificial turf cost Toronto | Medium | **High** | Not ranked | Commercial | Pricing page optimization |
| artificial turf near me | High | **High** | Not ranked | Transactional | Google Business Profile |
| artificial grass installation Brampton | Low | **High** | Not ranked | Transactional | New location page needed |
| synthetic turf GTA | High | Medium | Not ranked | Transactional | Homepage + blog |
| how much does artificial grass cost Canada | Medium | **High** | Not ranked | Commercial | Blog post / FAQ |
| best artificial turf for dogs | Low | Medium | Not ranked | Commercial | Pet Yard page expansion |
| artificial grass vs real grass | Low | Medium | Not ranked | Informational | Blog post |
| artificial turf maintenance | Low | Medium | Not ranked | Informational | Blog post |
| lawn replacement Mississauga | Low | **High** | Not ranked | Transactional | Location page addition |
| putting green installation cost | Low | **High** | Not ranked | Commercial | Pricing page expansion |
| artificial turf Etobicoke cost | Low | **High** | Not ranked | Commercial | Etobicoke location page |
| no mow lawn GTA | Low | Medium | Not ranked | Informational | Blog post / FAQ |
| dog friendly backyard ideas | Low | Medium | Not ranked | Informational | Blog post |
| artificial turf Port Credit | Very Low | **High** | Not ranked | Hyper-local | Neighbourhood section |
| artificial turf Lorne Park Mississauga | Very Low | **High** | Not ranked | Hyper-local | Neighbourhood section |
| artificial turf Long Branch | Very Low | **High** | Not ranked | Hyper-local | Neighbourhood section |
| artificial turf Mimico | Very Low | **High** | Not ranked | Hyper-local | Neighbourhood section |
| pet turf installation Toronto west | Very Low | **High** | Not ranked | Transactional | Location page |

---

## On-Page SEO Issues

| Page | Issue | Severity | Recommended Fix |
|------|-------|----------|-----------------|
| ALL pages | Canonical tag points to `ygtoronto.com` not `ygtoronto.com` | **Critical** | Update all canonical tags to `https://ygtoronto.com/[page]` |
| ALL pages | Schema markup (Organization + LocalBusiness) URL is `ygtoronto.com` | **Critical** | Update `"url"` in all JSON-LD blocks to `https://ygtoronto.com` |
| ALL pages | GA4 tracking ID is placeholder `G-XXXXXXXXXX` | **Critical** | Replace with real GA4 Measurement ID from Google Analytics |
| Homepage | H1 "Your Weekends Back. Your Lawn Handled. Permanently." contains no keywords | **High** | Add a keyword-rich subheading or revise H1 to include "artificial turf GTA" |
| Homepage | Title "YardGuard \| Premium Artificial Turf Installation in the GTA" — "GTA" is broad, no city | **High** | Revise to "Artificial Turf Installation in Mississauga & Etobicoke \| YardGuard" |
| Products page | H1 "The Smart Investment for Your Home" — no keyword | **High** | Revise to include "Artificial Turf Cost" or "Artificial Turf Packages" |
| Products page | CSS classes named `auto-style-1` through `auto-style-60` (Wix export artifacts) | Medium | Clean up class names — doesn't affect rankings but harms maintainability |
| About page | H1 "About Yard Guard" — no keyword | Medium | Revise to "About Yard Guard \| Artificial Turf Experts in Mississauga" |
| About page | Team member photos are placeholder icons, not real photos | Medium | Add real photos of Michael and team — builds trust and supports E-E-A-T |
| About page | Story section references visualization service but no dedicated page exists | Medium | Create a "3D Design Visualization" landing page |
| All pages | Internal links use relative paths (e.g. `href="index.html"`) | Low | Fine for current setup but ensure these resolve correctly on the live domain |
| FAQ page | Good keyword in title but FAQ content could be expanded significantly | Medium | Add 15+ more questions targeting long-tail keywords |
| All pages | No XML sitemap referenced in header | Medium | Create and submit sitemap.xml to Google Search Console |

---

## Content Gap Analysis

### 1. Location Landing Pages — HIGH priority
**Gap:** Competitors like Creative Grass have dozens of city + service combo pages. YardGuard has only one (`artificial-turf-mississauga.html`).
**Why it matters:** Local search ("artificial turf Etobicoke") is where purchase-intent is highest and competition is most specific. These pages rank faster than the homepage.
**Recommended format:** Dedicated landing page per city, each ~800–1,000 words.
**Priority:** High | **Effort:** Moderate (half day per page)

Pages to create:
- `artificial-turf-etobicoke.html`
- `artificial-turf-oakville.html`
- `artificial-turf-brampton.html`
- `artificial-turf-toronto-west.html`

### 2. "Cost of Artificial Turf in GTA" — HIGH priority
**Gap:** No competitors fully own this keyword. Homeowners always search cost before contacting anyone.
**Why it matters:** Commercial intent, high conversion probability. Your pricing page exists but doesn't target this query directly.
**Recommended format:** Long-form blog post (1,200–1,500 words) with cost calculator or table.
**Priority:** High | **Effort:** Moderate (half day)

### 3. Blog / Content Section — HIGH priority
**Gap:** Zero blog content. Echoing Green regularly publishes articles like "Pros and Cons of Artificial Grass on Your Toronto Lawn" — they earn long-tail traffic and topical authority that reinforces all their rankings.
**Why it matters:** A well-maintained blog can generate 40–70% more keyword rankings within 3–6 months.
**Recommended format:** Monthly blog posts targeting informational + commercial queries.
**Priority:** High | **Effort:** Ongoing

Suggested first 5 blog posts:
- "How Much Does Artificial Turf Cost in Toronto? (2026 Guide)"
- "Natural Grass vs Artificial Turf: The True 15-Year Cost in Mississauga"
- "Best Artificial Turf for Dogs in Canada: What to Look For"
- "How to Build a Backyard Putting Green in Toronto"
- "Why Etobicoke Homeowners Are Switching to Artificial Grass in 2026"

### 4. Pet Turf Dedicated Page — MEDIUM priority
**Gap:** The Pet Yard product exists but pets.html is underutilized. Competitors have extensive pet turf content.
**Why it matters:** "Pet turf" and "dog-friendly lawn" queries are high volume and high conversion.
**Recommended format:** Dedicated pet turf landing page with expanded content.
**Priority:** Medium | **Effort:** Moderate

### 5. Putting Green / Golfer's Green Dedicated Page — MEDIUM priority
**Gap:** Golfer's Green package exists but lives only on the pricing page. No dedicated SEO page for putting green searches.
**Why it matters:** "Backyard putting green installation Toronto" is a low-competition, high-value keyword.
**Recommended format:** Dedicated landing page with gallery, specs, and pricing.
**Priority:** Medium | **Effort:** Moderate

### 6. Neighbourhood-Level Pages — MEDIUM priority
**Gap:** Competitors target hyper-local searches. No one fully owns "artificial turf Port Credit" or "artificial turf Long Branch."
**Why it matters:** Very low competition, fast ranking, targets your exact service footprint.
**Recommended format:** Add a neighbourhood grid to location pages, or create separate short pages.
**Priority:** Medium | **Effort:** Quick win

---

## Technical SEO Checklist

| Check | Status | Details |
|-------|--------|---------|
| HTTPS / SSL | ✅ Pass | Site serves over HTTPS |
| Mobile responsive design | ✅ Pass | Responsive CSS with media queries, mobile sticky CTA |
| Viewport meta tag | ✅ Pass | Correctly set on all pages |
| Title tags present | ✅ Pass | All key pages have unique, descriptive titles |
| Meta descriptions | ✅ Pass | Present and appropriately sized on all checked pages |
| Schema markup (JSON-LD) | ✅ Pass | Organization, LocalBusiness, FAQPage, Product, BreadcrumbList all implemented |
| Image alt text | ✅ Pass | All images checked have descriptive alt attributes |
| Image formats | ✅ Pass | WebP format used with responsive srcset — excellent |
| Canonical tags | ❌ **Fail** | All pages canonical to wrong domain (ygtoronto.com) |
| Schema URL accuracy | ❌ **Fail** | All schema JSON-LD URLs point to ygtoronto.com |
| Google Analytics | ❌ **Fail** | Placeholder ID `G-XXXXXXXXXX` — no data being collected |
| Google Search Console | ⚠️ Warning | Cannot verify — submit sitemap once canonical is fixed |
| XML Sitemap | ⚠️ Warning | sitemap.md exists but no sitemap.xml for Google to crawl |
| Robots.txt | ⚠️ Warning | Not confirmed — should be present and allow indexing |
| Google Business Profile | ⚠️ Warning | Cannot verify from source code — critical for local SEO |
| Internal linking | ⚠️ Warning | Basic navigation links present; no contextual internal links between pages |
| H1 keyword relevance | ⚠️ Warning | Most H1s use brand messaging rather than target keywords |
| Blog / content section | ❌ **Fail** | No blog or content hub exists |
| Location-specific pages | ⚠️ Warning | Only 1 of 4+ needed location pages exists |
| Page speed (est.) | ✅ Pass | WebP images, lazy loading, minimal external scripts — likely fast |
| Structured data for Products | ✅ Pass | Product schema with pricing on products.html — excellent |
| FAQPage schema | ✅ Pass | Implemented on homepage — may appear in Google People Also Ask |
| Social OG tags | ✅ Pass | Open Graph tags present on all pages (but point to wrong URL) |
| Skip navigation link | ✅ Pass | Accessibility skip link present |
| ARIA labels | ✅ Pass | Navigation and header use proper roles and labels |

---

## Competitor SEO Comparison

| Dimension | YardGuard (ygtoronto.com) | SynTurf (synturf.ca) | Echoing Green (echoinggreen.ca) | Creative Grass |
|-----------|--------------------------|---------------------|-------------------------------|----------------|
| Domain Age | New (2026) | 25+ years | 20+ years | Established |
| Blog / Content | ❌ None | Moderate | ✅ Active blog | Resource section |
| Location pages | 1 (Mississauga) | Multiple | Multiple cities | Dozens of pages |
| Pet turf focus | ✅ Yes | Yes | Yes | Yes |
| Putting green focus | ✅ Yes | Yes | Yes | Limited |
| BBB Accreditation | ❌ Not listed | Unknown | ✅ Yes | Unknown |
| Physical showroom | ❌ No | No | No | No |
| Product schema | ✅ Yes | Unknown | Unknown | Unknown |
| FAQPage schema | ✅ Yes | Unknown | Unknown | Unknown |
| Pricing transparency | ✅ Yes (unique) | No | No | No |
| Testimonials | ✅ 3 on homepage | Yes | Yes | Yes |
| Before/after gallery | ✅ Yes | Yes | Yes | Yes |
| PFAS-free messaging | ✅ Yes (unique) | Unknown | Unknown | Unknown |

**Winner:** Established competitors win on domain authority and content depth today. YardGuard wins on pricing transparency, product clarity, and PFAS-free messaging — these are genuine differentiators to amplify.

---

## Prioritized Action Plan

### Quick Wins — Do This Week

**1. Fix all canonical tags** (30 minutes, Critical impact)
- Every HTML page has `<link rel="canonical" href="https://ygtoronto.com/...">`
- Change all of them to `https://ygtoronto.com/[filename]`
- Also update the `og:url` meta tags on every page

**2. Fix schema markup URLs** (30 minutes, Critical impact)
- In every page's JSON-LD `@graph`, change `"url": "https://ygtoronto.com"` to `"url": "https://ygtoronto.com"`
- Update image URLs in schema if they reference the old domain

**3. Connect Google Analytics** (15 minutes, Critical impact)
- Go to Google Analytics → Create property → Copy real Measurement ID (format: G-XXXXXXXXXX)
- Replace placeholder `G-XXXXXXXXXX` in every HTML file with your real ID

**4. Set up Google Business Profile** (45 minutes, Critical impact)
- Go to google.com/business and create/claim listing for Yard Guard Landscaping
- Add: address, phone, service area (Mississauga, Etobicoke, Oakville), photos, hours
- This is the #1 driver of local map pack rankings — essential for "near me" searches

**5. Submit to Google Search Console** (20 minutes, High impact)
- Go to search.google.com/search-console → Add property → Verify ownership
- Submit sitemap.xml once it's created
- This tells Google your site exists and lets you monitor indexation

**6. Create sitemap.xml** (15 minutes, High impact)
- Create a simple XML sitemap listing all your pages
- Submit it via Google Search Console

**7. Revise homepage title tag** (10 minutes, High impact)
- Change: `YardGuard | Premium Artificial Turf Installation in the GTA`
- To: `Artificial Turf Installation Mississauga & Etobicoke | YardGuard`

---

### Strategic Investments — Plan for This Quarter

**8. Add location landing pages for Etobicoke, Oakville, Brampton** (High impact)
- Model after `artificial-turf-mississauga.html` which already exists
- Each page: ~800 words, mentions local landmarks, includes local reviews, strong CTA
- Effort: Half day per page

**9. Write "Cost of Artificial Turf in the GTA" blog post** (High impact)
- 1,200–1,500 words, targeting "how much does artificial turf cost Toronto/GTA"
- Include your real pricing tiers, cost-per-sq-ft breakdown, financing options
- This single article can rank for dozens of cost-related queries
- Effort: Half day

**10. Launch a blog section** (High impact, ongoing)
- Add a simple blog section to the site
- Commit to 1–2 posts per month
- Start with the 5 post ideas listed in the content gap section
- Effort: Ongoing

**11. Add real team photos** (Medium impact)
- About page currently shows placeholder icons for Michael, Sarah, and David
- Add real photos — Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trust) rewards real people
- Effort: Quick win once photos are taken

**12. Expand FAQ page** (Medium impact)
- Current FAQ has ~3 questions on homepage + a dedicated FAQ page
- Expand to 20–25 questions targeting long-tail searches
- Each answer should be 80–150 words for best FAQ schema performance
- Effort: Half day

**13. Build neighbourhood-level content** (Medium impact)
- Add a section to location pages listing specific neighbourhoods served
- Port Credit, Lorne Park, Clarkson, Long Branch, Mimico, Swansea, Bloor West Village
- Each neighbourhood mention = a hyper-local keyword signal
- Effort: Quick win

**14. Get more Google reviews** (High impact)
- Currently showing 4.9 stars (127 reviews) in schema — verify this is real and live on Google
- Implement a post-installation review request process (text or email with Google review link)
- Reviews are the #1 local ranking factor alongside proximity and relevance
- Effort: Process setup (quick), ongoing

---

## Next Steps

Would you like me to:
- **Draft new title tags and meta descriptions** for all pages, optimized for the right keywords?
- **Write the Etobicoke location landing page** from scratch?
- **Create a content calendar** for the first 3 months of blogging?
- **Write the "Cost of Artificial Turf in GTA" blog post** — your highest-value quick win?
- **Dive deeper into any section** of this audit?
