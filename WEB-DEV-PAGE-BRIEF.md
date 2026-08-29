# Web Development service page — design brief

Status: **plan only, not built.** Hand this to an implementer.
Target file: `web-development.html` at repo root.
Live URL: `https://lumyx.co/web-development`

---

## 0. The binding constraint, read this first

**There is no showable client web work.** No portfolio, no before/afters, no
web-specific conversion metrics.

The implementer **must not** invent any of the following:

- Fake or composite case studies ("a client saw +38%…")
- Screenshots of sites Lumyx did not build, including stock mockups presented
  as work
- Web-development-specific performance numbers
- Client names or logos
- Testimonials attributed to web projects

The site's existing brand-level proof (`$2M+ generated`, `4.8x avg ROAS`,
`98% retention`, `20+ businesses`) is already published sitewide and may be
reused **as agency-level credibility only**. It must never be reframed as
web-development results.

This constraint is the reason for the page's structure. A portfolio-led page is
the normal answer here and it is unavailable, so this page instead makes
**diagnostic rigor and falsifiable build standards** the proof. That is honest,
and for this brand it is actually stronger than a gallery.

---

## 1. Job and audience

**Visitor mode:** Persuade.

Who arrives: founders and owner-operators ($20k–$500k/mo) who already have a
site and suspect it is the weak link — usually because they are spending on
traffic that does not convert. Plus a smaller set actively shopping for a
rebuild. They are skeptical and have been burned by agencies that delivered a
pretty site that did not sell.

They arrive from: the homepage services grid, internal links from
`/ppc-management` and `/lead-follow-up-automation`, and eventually organic
search for redesign/CRO terms.

**Primary action:** book the free Growth Audit (same single conversion goal as
the rest of the site). Secondary: understand which of the three offers fits.

---

## 2. Positioning — the wedge

Two competitors define the space this page must sit between:

1. **Lumyx Group** (`lumyxgroup.com`) — shares the brand name, currently
   outranks Lumyx Consulting, headline "Custom Website & Software Development
   Company." A generalist dev shop selling **technical deliverables**.
2. **Generic conversion agencies** — all claim "we design for outcomes, not
   aesthetics." Per research this claim is fully saturated and now reads as
   table stakes rather than differentiation.

**Lumyx's actual, defensible wedge:** it is a performance-marketing firm that
also builds. The same team buying the traffic owns the page it lands on, and is
accountable for the CPA on the other side. A dev shop cannot claim this. Most
CRO agencies cannot either.

Positioning line to build the page around (not necessarily verbatim copy):

> Most agencies hand off a site and leave. We're the ones running traffic into
> it afterward — so it gets built to the number it has to hit.

This doubles as brand-collision defense: someone searching "Lumyx" plus web
development lands on an offer framed unmistakably differently from Lumyx Group.

**Anti-goals.** Do not write "we design for outcomes, not just aesthetics" —
it is the saturated claim. Do not lead with technology names. Do not describe
the team as "passionate" or "creative."

---

## 3. The three offers

Equal-weight entry points, not a good/better/best ladder:

1. **Revamp** — keep the business, rebuild the site around how it actually
   converts. For sites with traffic that underperform.
2. **Bespoke build** — ground-up build for businesses with no site, or one
   past saving.
3. **Ecommerce product page redesign** — the product page specifically, as a
   conversion surface. **Platforms: Shopify and custom/headless.** Name both
   explicitly; "Shopify product page redesign" is a real commercial search term
   and should appear in an H2 or H3.

---

## 4. Page structure

Reuse existing components — class names below already exist in
`css/sections.css`. Do not invent new section systems.

| # | Section | Component | Purpose |
|---|---|---|---|
| 1 | Hero | `.page-hero` + `.page-hero__grid` | Wedge headline, sub, primary CTA. Match `/ppc-management` hero structure exactly. |
| 2 | The teardown | `.desk` scroll-audit (readout bars + findings) | 4 failure patterns found in real audits. **This replaces the portfolio as proof.** |
| 3 | Three ways in | `.services__grid` or `.case-cards` | The three offers above. |
| 4 | What we build to | `.ledger` or `.split-cols` | Falsifiable technical standards. See §5. |
| 5 | Build sequence | `.buildsheet` (carousel) | Stages: Audit → Wireframe → Build → Instrument → Optimize. Encodes the project→retainer transition. |
| 6 | Ecommerce | `.section--sunken` + `.pillars` | Product-page anatomy. Shopify + headless named. |
| 7 | Where this fits | `.split-cols` | Project first, then ongoing optimization — links to `/ppc-management` and `/lead-follow-up-automation`. |
| 8 | CTA | Match the CTA block on `/ppc-management` | Free Growth Audit, `data-scroll-target="#calendly-container"`. |
| 9 | FAQ | `.faq-layout` + `FAQPage` schema | See §7. |

**Section 2 — the teardown.** The `.desk` component on `/ppc-management` is a
sticky, scroll-driven state machine (`js/scenes.js` → `initDeskScene`) with four
labeled readout bars and a findings line. Reuse it with web-specific states.
Four failure patterns, framed as *what we find in audits* — never as a specific
client:

1. The page does not repeat the promise the ad made
2. It is slow where it matters (LCP on the hero, not the homepage average)
3. The form asks for more than the offer justifies
4. Nothing is instrumented, so nobody can tell which of the above is costing most

**Section 4 — build standards.** This is the honest substitute for portfolio
proof and should be the most concrete block on the page. Commitments a client
could actually hold Lumyx to and verify:

- Core Web Vitals targets stated as numbers (LCP, INP, CLS)
- WCAG 2.1 AA — matches the standard already in `PRODUCT.md`
- Conversion tracking wired and verified before launch (GA4 + ads platforms)
- No layout shift on load
- Mobile built first, not adapted after

State these as commitments, not achievements. Do not attach past results.

---

## 5. Voice and copy direction

Follow `PRODUCT.md`: engineered, direct, revenue-obsessed; a senior operator
showing numbers, not a studio showing moodboards. Specific over superlative.

Because there are no results to cite, the specificity must come from **naming
the failure modes precisely** and **stating the standards numerically**. That is
where this page earns credibility.

Headline direction (implementer may refine, keep the angle):

> H1: The site is where the spend either converts or leaks
> Sub: We rebuild and build sites for businesses already buying traffic — then
> keep optimizing them, because we're the ones running the traffic.

---

## 6. Visual direction

Established world, no new visual language. Ground `--bg`, amber accent as the
signature, `--console` reserved for the form card / footer punctuation only.
Montserrat 800 display, Spline Sans Mono for telemetry labels, system sans body.

Reuse the instrument-grid backdrop treatment used on other pages. Motion:
scroll-bound reveals matching `css/motion.css`, all gated behind
`prefers-reduced-motion`.

**Imagery.** The brand register bans colored placeholder blocks where imagery
belongs. Since there is no client work to show, this page must not leave
image-shaped holes. Resolve it by making the teardown readouts, the standards
block, and the build sequence the visual interest — typographic and diagrammatic,
consistent with how `/ppc-management` already works without photography. Do not
add stock photos.

---

## 7. Technical requirements

**SEO**

- `<title>`: `Conversion-Focused Web Development | Lumyx Consulting` (53 chars)
- Meta description ≤ 155 chars, must contain "website redesign" and "Shopify"
- `<link rel="canonical" href="https://lumyx.co/web-development" />` — clean URL,
  not `.html`, matching every other page's convention
- `<meta name="robots" content="index, follow" />` — **verify this.** Five pages
  shipped with `noindex` earlier in this project's history; do not repeat it.

**Schema.** Add a `Service` JSON-LD node following the exact pattern in
`ppc-management.html`, including `"provider": { "@id": "https://lumyx.co/#organization" }`
so it reinforces the existing entity graph rather than creating a new one. Add a
second `FAQPage` node matching `lead-follow-up-automation.html`.
**No `aggregateRating`** — self-serving review markup is a Google policy
violation.

**Routing.** Add to `netlify.toml`, following the existing pattern:

```toml
[[redirects]]
  from = "/web-development.html"
  to = "/web-development"
  status = 301

[[redirects]]
  from = "/web-development"
  to = "/web-development.html"
  status = 200
```

**Also update:**

- `sitemap.xml` — add `/web-development`, priority `0.9`, matching the other
  service pages
- `serve.json` — add the local-dev rewrite
- Homepage services grid — link the new page
- Header nav Services dropdown and footer Quick links — on **all** pages sharing
  that markup (`index.html`, `ppc-management.html`, `blog.html`,
  `blog-post.html`, `lead-follow-up-automation.html`)
- Homepage `hasOfferCatalog` — the "Web Development & Landing Pages" offer
  already exists in the schema but has no `url`; add it now that the page exists

**Quality bar.** No horizontal overflow at 320px. Touch targets ≥ 44px for
controls, ≥ 24px for links. Verify the marquee/scroll components behave at
375 / 1440 / 1920. Zero console errors.

---

## 8. Open decisions the implementer must not invent

Escalate rather than guessing:

- **Pricing.** Sold as project-then-retainer, but no figures were provided. Do
  not publish prices or ranges. Keep the CTA on the Growth Audit.
- **Timelines.** Do not state build durations without confirmation.
- **Tech stack claims.** Shopify and custom/headless are confirmed. Do not add
  frameworks, CMSs, or platforms beyond those.
- **Team size / location.** Unconfirmed; the phone area code (248, Michigan) and
  the Google Business Profile (Tampa Bay) currently disagree. Say nothing about
  location on this page.

---

## 9. Definition of done

- [ ] Page renders at `/web-development` with no console errors
- [ ] Both JSON-LD blocks parse; `Service` references `#organization` by `@id`
- [ ] `robots` is `index, follow`; canonical is the clean URL
- [ ] Redirects, sitemap entry, and `serve.json` rewrite all added
- [ ] Nav + footer links updated across all five pages that share the markup
- [ ] No invented proof anywhere on the page (see §0)
- [ ] No horizontal overflow at 320 / 375 / 1440 / 1920
- [ ] Reduced-motion path verified
