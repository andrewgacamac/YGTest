# Website Modification Checklist

Modifications derived from Phase 1 (Consumer Intelligence), Phase 2 (Website Strategy & SEO Blueprint), and Phase 3 (Website Page Blueprint). Each item references the current gap and how to verify the fix.

---

## Structural & Semantic HTML

### 1. Add semantic `<main>` landmark to index.html **[COMPLETED]**
The homepage body content (between `</header>` and `<footer>`) is not wrapped in a `<main>` element. Phase 3 requires ARIA landmarks for navigation, main, and footer on every page.
**Verify:** Run an accessibility audit (axe DevTools or Lighthouse). Confirm `<main>` is present and contains page content. Screen reader should announce "main" landmark.

### 2. Add semantic `<main>` landmark to products.html **[COMPLETED]**
Same issue as index.html. All content between header and footer needs a `<main>` wrapper.
**Verify:** Inspect DOM. Confirm `<main>` wraps all content sections between `</header>` and `<footer>`.

### 3. Add `role="navigation"` and `aria-label` to `<nav>` elements **[COMPLETED]**
The `<nav>` in the header has no `aria-label`. Screen readers cannot distinguish between header nav and footer nav.
**Verify:** Inspect all `<nav>` elements across all pages. Each should have `aria-label="Main navigation"` or `aria-label="Footer navigation"` as appropriate.

### 4. Add skip-to-content link on all pages **[COMPLETED]**
Phase 3 AODA requirements: "Full site usable without a mouse. No keyboard traps." A skip link is essential for keyboard-only users.
**Verify:** Tab from the top of each page. The first focusable element should be "Skip to main content" which jumps focus to `<main>`.

### 5. Fix stray `</nav>` closing tag in index.html footer **[COMPLETED]**
Line 387 of index.html has a `</nav>` tag inside a `<div class="footer__column">` that has no matching `<nav>`. This is invalid HTML.
**Verify:** Run W3C HTML Validator on index.html. Confirm zero validation errors.

### 6. Add `<header>`, `<nav>`, `<main>`, `<footer>` ARIA landmarks to all pages **[COMPLETED]**
Phase 3 specifies: "ARIA landmarks for navigation, main, footer" on every page. Currently none of the pages use ARIA landmark roles.
**Verify:** Run Lighthouse accessibility audit on each page. "Landmarks" section should show no errors.

---

## Trust Bar & Warranty Alignment

### 7. Update warranty from "10-Year" to "15-Year" across entire site **[COMPLETED]**
Phase 1 Section 6 states: "15-year warranty has become the industry standard since 2017." The trust bar on index.html says "10-Year Warranty." Package cards on products.html all say "10-year manufacturer warranty." The comparison table says "10 Years." Phase 2 and 3 consistently specify a 15-year warranty as the standard positioning.
**Verify:** Search all HTML files for "10-year" and "10 Year". Every instance should now read "15-year" / "15 Year." Check trust bar on index.html, package cards on products.html, comparison table on products.html, and quote.html trust badges.

### 8. Add "PFAS-Free" trust badge to trust bar **[COMPLETED]**
Phase 2 Section 5.6 specifies 4 recommended badges: 15-Year Warranty, PFAS-Free Guarantee, Google Review score, Price-Lock Guarantee. Currently the trust bar shows: rating, years, projects, warranty. PFAS-Free is missing.
**Verify:** Load index.html. Trust bar should display a PFAS-Free badge/icon alongside the existing badges.

### 9. Add "Price-Lock Guarantee" messaging to pricing page and quote page **[COMPLETED]**
Phase 1 Section 6 identifies the Price-Lock Guarantee as "the most powerful trust signal a turf company can deploy." Phase 3 Page 3 (Pricing) specifies a dedicated Price-Lock section. Neither products.html nor quote.html mentions this.
**Verify:** Load products.html. A visible "Price-Lock Guarantee" section should appear with the text: "The price we quote is the price you pay. If we encounter unexpected conditions, we absorb the cost. Not you."

---

## Schema Markup (JSON-LD)

### 10. Add Organization schema to every page **[COMPLETED]**
Phase 3 technical standards: "Organization: Company name, logo, contact, social profiles — on every page." Currently zero JSON-LD exists on any page.
**Verify:** View page source on each HTML file. A `<script type="application/ld+json">` block with `"@type": "Organization"` should be present. Validate at https://validator.schema.org.

### 11. Add LocalBusiness schema to every page **[COMPLETED]**
Phase 3 requires LocalBusiness schema with name, address, phone, hours, service area on every page.
**Verify:** Search page source for `"@type": "LocalBusiness"`. Confirm it includes `name`, `address`, `telephone`, `areaServed`, and `openingHours`. Test with Google Rich Results Test.

### 12. Add FAQPage schema (JSON-LD) to faq.html **[COMPLETED]**
Phase 3 Page 13 marks this as "critical — every Q&A pair in schema." This targets featured snippets and voice search. Currently no schema exists.
**Verify:** Paste faq.html URL into Google Rich Results Test. FAQPage schema should validate with all Q&A pairs visible.

### 13. Add FAQPage schema to the homepage objection accordion **[COMPLETED]**
Phase 3 Page 1 specifies: "Organization, WebSite, LocalBusiness, AggregateRating, FAQPage (for accordion section)" on the homepage.
**Verify:** View index.html source. JSON-LD block should contain `"@type": "FAQPage"` with the 3+ accordion Q&A pairs.

### 14. Add Product schema to each package card on products.html **[COMPLETED]**
Phase 3 Page 3: "Product (for each tier), FAQPage (for cost FAQs), Offer (for financing)."
**Verify:** Google Rich Results Test on products.html should show Product rich results for Easy Lawn, Pet Yard, Golfer's Green.

### 15. Add AggregateRating schema **[COMPLETED]**
Phase 3 Page 1: homepage should include AggregateRating. Trust bar shows "4.9/5 Google Rating" but this is not in structured data.
**Verify:** JSON-LD on index.html includes `"@type": "AggregateRating"` with `"ratingValue": "4.9"` and `"reviewCount"`.

### 16. Add BreadcrumbList schema to all pages except homepage **[COMPLETED]**
Phase 3 technical standards: "BreadcrumbList: Breadcrumb navigation — on every page except homepage."
**Verify:** Pages with visible breadcrumbs (products.html, quote.html) should have matching `"@type": "BreadcrumbList"` JSON-LD. Validate with Rich Results Test.

---



### 17. Add descriptive alt text to all images **[COMPLETED]**
Phase 3: "Every image must have descriptive alt text. Decorative images marked with empty alt=''." Several images use generic alt text (e.g., `alt="Mowing"`, `alt="Water Bills"`).
**Verify:** Run axe DevTools on each page. Zero "Images must have alternate text" or "Images must have non-empty alt" errors.

### 18. Add ARIA expanded/collapsed states to all accordion elements **[COMPLETED]**
Phase 3 Page 1: "Accordion cards fully keyboard-navigable with ARIA expanded/collapsed states." Currently accordion buttons have no `aria-expanded` attribute.
**Verify:** Inspect accordion buttons on index.html, faq.html. Each should have `aria-expanded="true"` or `aria-expanded="false"`. Toggling should update the attribute. `aria-controls` should reference the content panel ID.

### 19. Ensure minimum colour contrast ratio of 4.5:1 for body text **[COMPLETED]**
Phase 3: "Minimum 4.5:1 for body text, 3:1 for large text." The `--medium-text: #616161` on white (#FFFFFF) gives approximately 5.9:1 (passes), but `--light-text: #9E9E9E` on white gives approximately 2.8:1 (fails).
**Verify:** Run WebAIM Contrast Checker on all text colour / background colour combinations. No body text should fall below 4.5:1.

### 20. Add visible focus indicators to all interactive elements **[COMPLETED]**
Phase 3: "Clear focus indicators on all interactive elements." Currently `:focus` styles exist on form inputs but not on nav links, buttons, or accordion headers.
**Verify:** Tab through every page using keyboard only. Every focusable element (links, buttons, inputs) should have a clearly visible focus ring/outline.

### 21. Ensure all form fields have associated `<label>` elements **[COMPLETED]**
Phase 3: "Every form input has a visible, associated label." The quote form uses labels but some lack explicit `for` attributes matching input `id` on radio/checkbox groups.
**Verify:** Run axe DevTools on quote.html. Zero "Form elements must have labels" errors.

### 22. Set minimum touch target size to 44x44px on mobile **[COMPLETED]**
Phase 3: "Touch targets: Minimum 44x44px for all buttons and links on mobile." Some nav links and footer links may be smaller.
**Verify:** Use Chrome DevTools mobile viewport. Inspect clickable elements. All buttons and links should be at least 44x44px.

### 23. Add an Accessibility Statement page **[COMPLETED]**
Phase 2 Section 9.1: "Include an Accessibility Statement page on the website." This page does not exist.
**Verify:** A new page (e.g., accessibility-statement.html) is linked from the footer. It describes the company's commitment to AODA/WCAG 2.0 Level AA compliance.

---

## Content & Messaging Gaps

### 24. Expand problem carousel from 5 cards to at least 8 trigger moments **[COMPLETED]**
Phase 1 identifies 14 trigger moments. The homepage carousel has only 5 (mud, dog spots, mowing, water bills, weeding). At minimum, add: Physical strain/aging, New build failure, Work-from-home window.
**Verify:** Count the problem cards in the carousel section of index.html. Should be 8+. Each card should link to a relevant page (not `href="#"`).

### 25. Fix problem card links (currently all point to `#`) **[COMPLETED]**
All 5 problem cards in index.html link to `href="#"`. Phase 3 Page 1 specifies each card should link to the relevant page: mud → gallery/products, dog damage → /pets, mowing → cost/ROI page, water bills → pricing, etc.
**Verify:** Click each problem card. It should navigate to the appropriate page.

### 26. Add "What's Included" itemised list to pricing page **[COMPLETED]**
Phase 3 Page 3: "Itemised list of everything in the price: consultation, ground prep, drainage base, weed barrier, turf, infill, edging, cleanup, warranty, follow-up call. 'No surprise add-ons. Ever.'" This section does not exist on products.html.
**Verify:** Load products.html. A clearly labelled "What's Included in Every Installation" section appears with all line items.

### 27. Add monthly financing framing to pricing page **[COMPLETED]**
Phase 2 Section 3.4: "Always use monthly framing ($89/month), not lifetime totals." Phase 3 Page 3 specifies a Financing Section with monthly payment examples. products.html has no financing information.
**Verify:** Pricing page shows monthly payment examples (e.g., "$10,000 project = ~$89/month") and links to financing details.

### 28. Add "Environmental Truth" content or link **[COMPLETED]**
Phase 2 Gap Analysis: "Comprehensive environmental truth page with material safety data — radical honesty as brand identity." Phase 3 dedicates an entire page (Page 10, /environment). Currently zero environmental messaging exists anywhere on the site.
**Verify:** At minimum, add an "Environmental Commitment" section to the FAQ or products page. Ideally, a dedicated environment.html page exists and is linked from the nav/footer.

### 29. Add winter performance FAQ **[COMPLETED]**
Phase 1 Objection #7: "What happens in winter? Won't it look weird under snow?" Phase 3 Page 13 includes this as a required FAQ. The current FAQ page does not address winter.
**Verify:** Load faq.html. A question about winter/snow performance is visible with an answer referencing GTA freeze-thaw cycles.

### 30. Add drainage FAQ **[COMPLETED]**
Phase 1 Objection #6: "What about drainage? We get heavy rain." Not addressed on the FAQ page.
**Verify:** faq.html includes a drainage question with the answer mentioning "30+ inches of rain per hour" drainage capacity.

### 31. Add bylaw FAQ **[COMPLETED]**
Phase 1 Objection #9: "Is it even allowed? What about city bylaws?" Phase 3 Page 13: "Do I need a permit? Are there HOA restrictions?" Not on the current FAQ.
**Verify:** faq.html includes a bylaw question mentioning Toronto front-yard restrictions and Vaughan turf-friendly bylaws.

### 32. Add environmental/safety FAQ **[COMPLETED]**
Phase 1 Objection #3 (environment) and #10 (microplastics/kids). Neither addressed on current FAQ.
**Verify:** faq.html includes questions about environmental impact and child safety, mentioning PFAS-free materials and the 2026 Canadian PFAS regulations.

### 33. Capitalise "does it look fake?" in homepage accordion **[COMPLETED]**
The homepage objection accordion has an uncapitalised question: "does it look fake?" All other questions are capitalised.
**Verify:** View index.html. All accordion header text should use sentence case or title case consistently.

### 34. Use Canadian spelling throughout (colour, neighbour, metre, odour) **[COMPLETED]**
Phase 1 Truth #5: "Language that sounds Canadian (colour, not color; metre, not meter; neighbour, not neighbor)." products.html uses "Odor-control infill" and quote.html uses "neighbor's yard."
**Verify:** Search all HTML files for American spellings: "color" (not in CSS variable names), "neighbor", "odor", "meter" (in non-technical contexts). Replace with Canadian equivalents.

### 35. Add cost anchoring — show natural lawn cost BEFORE turf cost on homepage **[COMPLETED]**
Phase 2 Section 3.4: "First number shown is always the natural lawn's 10-year cost ($18,000–$37,500), then the turf cost. This sequencing is mandatory." The homepage objection answer for "Is it worth the investment?" discusses savings but does not lead with the natural lawn cost number.
**Verify:** The homepage FAQ answer about cost should start with the natural grass cost ($18,000–$37,500 over 15 years) before mentioning the turf cost.

### 36. Expand service area list from 5 to 15+ cities **[COMPLETED]**
Phase 2 Section 2.1 and Phase 3 Page 12 specify 15+ cities: Toronto, Brampton, Mississauga, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Ajax, Whitby, Milton, Newmarket, Aurora, Scarborough, Etobicoke, North York. Currently the service map section only lists 5.
**Verify:** The service area section on index.html displays all 15+ city names.

---

## Quote Form & Conversion

### 37. Add CASL-compliant email opt-in checkbox to quote form **[COMPLETED]**
Phase 2 Section 9.2: "Quote form opt-in checkbox must be unchecked by default. State clearly what the subscriber will receive. Link to privacy policy." Phase 3 Page 15: "CASL compliance: Include clear opt-in checkbox (unchecked by default)." The current form has no opt-in checkbox. Penalties: up to $10M per violation.
**Verify:** Load quote.html. An unchecked checkbox appears near the submit button with text like: "Yes, send me helpful turf tips and updates. You can unsubscribe anytime." Links to privacy.html.

### 38. Reduce quote form fields to max 6 visible per step **[COMPLETED]**
Phase 2 Section 5.3: "Maximum 6 fields." Step 2 of the current form has 7 visible fields (first name, last name, email, phone, address, city, postal code). Phase 3 recommends name, phone/email (their choice), city, approximate size, priority, and optional text.
**Verify:** Count visible required fields per step. No step should have more than 6 fields.

### 39. Add "What happens next" expectation text near submit button **[COMPLETED]**
Phase 3 Page 15: "'Within 24 hours, a real person will contact you. No robots. No call centres.'" The current form lacks this reassurance near the submit button.
**Verify:** A visible "We respond within 24 hours" message appears near the submit button on the final step.

### 40. Add link to gallery on the thank-you/success state **[COMPLETED]**
Phase 3 Page 15: "After submission, show: link to gallery ('while you wait, see our latest projects'), downloadable buyer's guide." Current success state has next steps but no gallery link.
**Verify:** After form submission, the success message includes a "View Our Gallery" link and optionally a downloadable guide link.

---

## Performance & Technical

### 41. Add `loading="lazy"` to all below-fold images **[COMPLETED]**
Phase 3 technical standards: "All images below the fold must use native lazy loading (loading='lazy')." No images on any page use lazy loading. Gallery page is especially impacted.
**Verify:** Inspect `<img>` tags on index.html and gallery.html. All images except the hero (above fold) should have `loading="lazy"`.

### 42. Convert all image assets to WebP **[COMPLETED]**
Phase 3 technical standards: "Use next-gen formats (WebP) for all images." Current images are PNG/JPG. This reduces load time significantly. `cwebp` tool is required.
**Verify:** All images in `images/` folder are `.webp` or the HTML serves `.webp` with fallback. Start with the hero images.
 files exist in WebP format. `<picture>` element or `srcset` is used to serve WebP to supported browsers with JPEG fallback.

### 43. Add responsive `srcset` for hero and gallery images **[COMPLETED]**
Phase 3: "Use srcset for all hero and gallery images with breakpoints at 640px, 1024px, 1440px." Currently no `srcset` attributes exist.
**Verify:** Inspect hero `<img>` tags. Each should have `srcset` with at least 3 size variants and a `sizes` attribute.

### 44. Self-host the logo image (currently on Wix CDN) **[COMPLETED]**
The logo is loaded from `static.wixstatic.com`. This creates a dependency on Wix, adds a DNS lookup, and the company is moving off Wix. Download and serve locally.
**Verify:** Logo `<img src>` points to a local path (e.g., `images/logo.png`), not a wixstatic.com URL.

### 45. Pin Lucide Icons version instead of using `@latest` **[COMPLETED]**
All pages load `https://unpkg.com/lucide@latest`. Using `@latest` in production means any breaking change to Lucide could break the site without warning.
**Verify:** The `<script src>` tag references a specific version number (e.g., `lucide@0.263.1`), not `@latest`.

---

## Navigation & Footer Fixes

### 46. Fix broken footer link to deleted packages.html **[COMPLETED]**
index.html footer links "Easy Lawn", "Pet Yard", "Golfer's Green" to `packages.html` which was deleted (see git status: `D packages.html`). These should point to `products.html`.
**Verify:** Click each footer service link on index.html. All three should navigate to products.html (not a 404).

### 47. Update copyright year from 2025 to 2026 **[COMPLETED]**
products.html and quote.html footer copyright says "2025". Current date is February 2026.
**Verify:** Search all HTML files for "2025" in copyright text. All should read "2026."

### 48. Make footer phone number a clickable `tel:` link **[COMPLETED]**
index.html footer phone "(647) 216-7787" is plain text, not a link. Phase 2: "Phone number must be a click-to-call link on mobile. 61% of callers speak directly with a person."
**Verify:** Inspect the footer phone number on index.html. It should be wrapped in `<a href="tel:+16472167787">`.

### 49. Make footer email a clickable `mailto:` link **[COMPLETED]**
Same issue. `info@yardguardlandscaping.com` is plain text in the footer.
**Verify:** Footer email should be wrapped in `<a href="mailto:info@yardguardlandscaping.com">`.

### 50. Add mobile hamburger menu **[COMPLETED]**
On screens under 1023px, the navigation is `display: none` with no hamburger toggle. Mobile users can only use the header CTA button or mobile sticky bar. Phase 3: mobile-first design is mandatory.
**Verify:** Resize browser to 768px width. A hamburger icon is visible in the header. Tapping it reveals the full navigation menu.

### 51. Standardise navigation order across all pages **[COMPLETED]**
index.html nav order: Home, How It Works, Pricing & Products, Gallery, FAQ, Contact. products.html nav order: Home, Pricing & Products, Gallery, How It Works, FAQ. These should be consistent.
**Verify:** Compare the `<nav>` link order on every HTML page. All should match the same sequence.

---

## SEO & Meta

### 52. Add canonical `<link>` tags to all pages **[COMPLETED]**
No pages have `<link rel="canonical">`. This prevents duplicate content issues if the site is accessible at multiple URLs.
**Verify:** View page source. Each page has `<link rel="canonical" href="https://www.yardguardlandscaping.com/[page].html">`.

### 53. Add Open Graph meta tags for social sharing **[COMPLETED]**
No pages have `og:title`, `og:description`, `og:image` meta tags. When pages are shared on Facebook/Instagram, they will show no preview.
**Verify:** View page source. Each page has `og:title`, `og:description`, `og:image`, and `og:url` meta tags. Test by pasting URL into Facebook Sharing Debugger.

### 54. Add `hreflang` attribute to `<html>` tag for future multilingual support **[COMPLETED]**
Phase 2 Section 4.6: "Use hreflang tags to signal language variants to Google." While full multilingual content is a future phase, the English pages should have `<link rel="alternate" hreflang="en" href="...">` as a foundation.
**Verify:** View page source. `<link rel="alternate" hreflang="en-CA">` is present.

---

## Content Pages to Create

### 55. Create partner-share page (/share or partner-comparison.html update) **[COMPLETED]**
Phase 3 Page 17: "The spouse-veto killer. Designed to be texted to a hesitant partner. Must be scannable in under 90 seconds on a phone." partner-comparison.html exists but needs to match Phase 3 specs: what it is (1 paragraph), what it costs (1 line), what it saves (bullet list), 3 photos, quick objection answers.
**Verify:** Load the partner/share page. Time yourself reading it on a phone. It should be fully digestible in under 90 seconds. Contains: cost, savings, photos, and objection answers.

### 56. Create a dedicated Pet Owners page (/pets) **[COMPLETED]**
Phase 3 Page 6: Dedicated landing page for the largest buyer segment. Currently no pet-specific landing page exists. The pet problem is only addressed in the problem carousel card and a package card.
**Verify:** A pets.html page exists and is linked from the navigation or problem carousel. Contains: smell FAQ, pet-safe commitment, pet owner testimonials, and before/after pet yard photos.

### 57. Create a Warranty page (/warranty) **[COMPLETED]**
Phase 3 Page 19: Dedicated warranty page with coverage details, claims process (5-day inspection), freeze-thaw specific coverage, and warranty comparison table. Currently warranty is only mentioned as a line item on package cards.
**Verify:** warranty.html exists, is linked from footer, and contains: what's covered, what's not, claims process, and freeze-thaw commitment.

### 58. Create GTA Bylaw Guide page (/bylaws) **[COMPLETED]**
Phase 2 Gap Analysis: "No competitor addresses municipal bylaws." Phase 3 Page specifies URL `/bylaws`. Currently no bylaw content exists. This is a competitive differentiator.
**Verify:** A bylaws.html page exists covering Toronto (front-yard restrictions), Vaughan (turf-friendly bylaws), and guidance for other GTA municipalities.

---

## Inline Style Cleanup

### 59. Move inline styles on products.html to CSS classes **[COMPLETED]**
products.html uses extensive inline `style=""` attributes (the cost comparison section is entirely inline-styled). This makes maintenance difficult and increases page weight.
**Verify:** Search products.html for `style=`. The count should be significantly reduced (ideally zero outside of icon sizing). All layout styles should be in CSS classes.

---

## Voice Search & Featured Snippets

### 60. Rewrite FAQ questions in conversational voice-search format **[COMPLETED]**
Phase 2 Section 4.1: "Every FAQ answer should be structured as a direct, complete answer to a spoken question." Current FAQ questions are short labels. Rewrite to natural language (e.g., "How much does artificial turf cost in the GTA?" instead of "Is it worth the investment?").
**Verify:** Read each FAQ question aloud. It should sound like a natural spoken question. Each answer should begin with a complete, self-contained sentence suitable for a featured snippet.

---

## Gallery Enhancements

### 61. Add city filter to gallery page **[COMPLETED]**
Phase 3 Page 5: "Filter buttons by city (Brampton, Mississauga, Vaughan, Markham, Oakville, Toronto, Other GTA) AND by project type AND by problem solved." The current gallery only filters by package type (Easy Lawn, Pet Yard, etc.).
**Verify:** Load gallery.html. City filter buttons are visible. Clicking "Brampton" shows only Brampton projects.

### 62. Add problem/solution framing to gallery project cards **[COMPLETED]**
Phase 3 Page 5: "Each project card uses a Problem-Solution-Result format." Current cards show location, title, and package type but do not frame the problem that was solved.
**Verify:** Each gallery card displays the problem that was solved (e.g., "Problem: 2 Labs destroying the backyard") alongside the solution and result.

---

## Conversion Tracking Setup

### 63. Add Google Analytics 4 event tracking for micro-conversions **[COMPLETED]**
Phase 3 Conversion Tracking Framework defines micro-conversions: problem carousel card click, accordion expand, video play, chat widget open, calculator interaction, gallery filter click. Currently no analytics events are configured.
**Verify:** Open browser DevTools Network tab. Clicking a problem card, expanding an accordion, or interacting with the slider should fire GA4 events.

### 64. Add GA4 macro-conversion tracking for quote form submission and phone clicks **[COMPLETED]**
Phase 3: Macro-conversions include quote form submission, phone click-to-call, and sample request. These are the primary business KPIs.
**Verify:** Submit the quote form. Check GA4 real-time events for a `generate_lead` or `form_submission` event. Click the phone number and verify a `click_to_call` event fires.

---

## Quick Wins

### 65. Add `rel="noopener noreferrer"` to all external `target="_blank"` links **[COMPLETED]**
Security best practice. Footer social links and other external links use `target="_blank"` without `rel="noopener"`.
**Verify:** Search all HTML files for `target="_blank"`. Each should also contain `rel="noopener noreferrer"`.

### 66. Add `<meta name="robots" content="index, follow">` to all public pages **[COMPLETED]**
Ensures search engines index all pages. Currently no robots meta tag exists.
**Verify:** View page source on each page. Meta robots tag is present.

### 67. Preload hero image for faster LCP **[COMPLETED]**
Phase 3: LCP target is under 2.0 seconds. The hero before/after images are the LCP element on index.html. Adding `<link rel="preload">` will improve load time.
**Verify:** Add `<link rel="preload" as="image" href="images/hero-after.jpg">` to `<head>`. Run Lighthouse. LCP should improve.

### 68. Add `font-display: swap` to Google Fonts link **[COMPLETED]**
Prevents invisible text during font loading. Current Google Fonts URL includes `display=swap` which is correct — verify this is present on all pages.
**Verify:** Check all Google Fonts `<link>` tags. Each URL should contain `&display=swap`.
