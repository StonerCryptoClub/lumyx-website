# FAQ page rebuild — complete build guide

Target file: `faq.html` (full replacement)
New assets: `css/faq.css`, `js/faq.js`
Live URL: `https://lumyx.co/faq` (unchanged)

Read this whole document before writing code. Sections 0, 2, and 3 contain
decisions that are easy to get wrong and expensive to undo.

---

## 0. Binding constraints — read first

### 0.1 Do not invent or repeat unverifiable claims

The current `faq.html` contains claims that must **not** be carried over:

| Current claim | Problem |
|---|---|
| "average 312% revenue increase" | No source. Specific percentage presented as typical result. |
| "400% Avg Traffic Increase" (was on the deleted SEO page) | Same. |
| "if you don't see measurable improvements in your marketing ROI within 90 days, we'll refund every penny" | A money-back guarantee is a contractual promise. Do not publish unless the business confirms it is real and honored. |
| "Our clients see..." + any hard number | Only publish numbers the business has confirmed. |

The site's existing brand-level figures (`$2M+ generated`, `4.8x avg ROAS`,
`98% retention`, `20+ businesses`) are already published sitewide and may be
reused **as-is, unchanged**. Do not invent new figures, do not restate these
with different numbers, and do not attribute them to a specific service.

Where an answer needs a number and none is confirmed, describe the *mechanism*
instead ("speed-to-lead decays sharply after the first few minutes") rather
than inventing a statistic.

### 0.2 Do not copy the other pages

`ppc-management.html`, `lead-follow-up-automation.html`, and
`web-development.html` each have a distinct structure. This page must not
reuse any of their signature sections:

- ❌ `.page-hero` / `.page-hero__solo` (PPC + follow-up hero)
- ❌ `.wd-hero` / `.wd-gauge` (web dev hero + live vitals)
- ❌ `.desk` scroll-audit terminal
- ❌ `.buildsheet` carousel
- ❌ `.tl` timeline
- ❌ `.audit-panel`
- ❌ `.wd-pin` anatomy, `.wd-tab` router, `.wd-spec` sheet, `.wd-rail`
- ❌ `.faq-layout` / `.faq-item` (the small FAQ block used *inside* service
  pages — this page is the real thing and needs its own component)

Shared **primitives** are fine and expected: `.container`, `.btn`,
`.btn-primary`, `.btn-secondary`, `.kicker`, `.sec-head`, `.chip`,
`.mono-tag`, `.status-chip`, `.data-label`, plus the site header, mobile
drawer, and footer (site chrome must stay identical sitewide).

All new styling goes in a page-scoped `css/faq.css` using its own `faq` cascade
layer, exactly as `css/webdev.css` does.

### 0.3 Remove the legacy stack

The current file is a v1-era page. Delete all of it:

- `css/main.css`, `css/mobile-fixes.css` — old design system
- Font Awesome CDN link — the site uses an inline SVG sprite, no icon font
- All `<style>` blocks inside the HTML (~450 lines of inline CSS)
- All inline `style="color: #FFA500;"` attributes — use tokens/classes

---

## 1. What this page is, and why it looks different

**Visitor mode: Read**, not Persuade.

Every other page on this site is built to move someone toward booking. This
one is built so a skeptical buyer can *find a specific answer fast* and leave
satisfied. That difference is the entire design rationale, and it is why the
page legitimately looks and behaves unlike the service pages without being
"off-brand."

Practical consequences:

- Findability outranks persuasion. 41 questions is a reference document, not a
  pitch. Search and filtering are the primary interface.
- Scanning beats scrolling. Nobody reads an FAQ top to bottom.
- Every answer must be independently useful. People arrive by deep link from
  search, land mid-page, and read exactly one answer.
- The CTA is present but quiet, and sits at the end rather than interrupting.

**Who arrives:** founders and operators ($20k–$500k/mo) doing late-stage
diligence before booking, plus organic search traffic landing on one specific
question. They are skeptical and looking for reasons to disqualify.

---

## 2. SEO reality check — this changed in 2026

**Google deprecated FAQ rich results on 7 May 2026.** This is recent and most
FAQ advice online predates it.

- 7 May 2026: FAQ rich results stopped appearing in Google Search
- June 2026: FAQ filter, the Search Console FAQ report, and Rich Results Test
  support all removed
- August 2026: FAQ rich result data removed from the Search Console API

**What this means for the build:**

1. **Do not build this page expecting SERP accordions.** They no longer render
   for a marketing agency. Any guide telling you otherwise is out of date.
2. **Still include `FAQPage` JSON-LD.** It remains a valid Schema.org type,
   Google has confirmed unused structured data causes no harm, and it helps
   non-Google consumers parse the page. Just do not expect a visual payoff.
3. **Schema is not an AI shortcut.** Google's current guidance is explicit that
   *no* special markup is required for AI Overviews or AI Mode. Do not let
   anyone claim the schema is what gets you cited.
4. **Structured data must match the visible text.** This is a hard rule. Every
   `Question`/`acceptedAnswer` pair in the JSON-LD must correspond word-for-word
   to a question and answer actually rendered on the page. Mismatches are a
   spam signal. Practically: write the visible content first, then generate the
   schema from it.

**So what actually makes this page rank in 2026?**

- **Page-level relevance for long-tail question queries.** Each question is a
  real search query. The page ranks as a page.
- **Genuinely quotable answers.** AI answer engines and featured snippets favor
  a direct, self-contained first sentence. Every answer must lead with a
  complete answer, then elaborate. Never open with "It depends" or a preamble.
- **Deep-linkable anchors.** Every question needs a stable `id` so it can be
  linked, shared, and surfaced individually.
- **Internal linking.** Each answer that touches a service links to that
  service page once, with descriptive anchor text. This is the page's biggest
  SEO contribution to the rest of the site.
- **Semantic HTML.** Real heading hierarchy, real `<details>`/`<summary>` or
  properly-ARIA'd buttons. Content must be in the DOM and readable with JS off.

**Critical: content must not be hidden from crawlers.** Answers live inside
collapsed accordions. Use `<details>`/`<summary>` (natively crawlable and
readable without JS) rather than `display:none` toggled by script. Do not
lazy-render answers into the DOM on click.

---

## 3. Content — the questions

The current page has 41 questions across 7 categories. Keep the strong ones,
cut the weak ones, rewrite for 2026. **You are authorized to improve wording,
merge overlapping questions, and add new ones.**

### 3.1 Answer-writing rules (apply to every answer)

1. **First sentence is a complete answer.** A reader who stops there has been
   answered. Detail follows.
2. **2–5 sentences.** Long enough to be substantive, short enough to scan.
3. **Answer the real question underneath.** "How much does it cost?" is really
   "am I going to get an evasive non-answer?" So give a real range or a real
   reason there isn't one.
4. **No hedging openers.** Never start with "It depends," "Great question," or
   "At Lumyx, we believe."
5. **Say the uncomfortable thing when it's true.** "If your unit economics
   don't support paid acquisition, we'll tell you in the audit instead of
   taking the retainer" is worth more than three paragraphs of reassurance.
   This is the established brand voice on the other pages — match it.
6. **One internal link maximum per answer**, only where genuinely relevant.

### 3.2 Category structure (7 → 6)

Reorganize. "Social Media & Web Development" is two unrelated things bolted
together, and SEO no longer has a page.

| # | Category | Slug | Notes |
|---|---|---|---|
| 1 | Getting started | `getting-started` | Move to first. It's what most visitors want. |
| 2 | Pricing & contracts | `pricing` | Second. It's the #1 unspoken question. |
| 3 | Paid media & PPC | `paid-media` | Links to `/ppc-management` |
| 4 | Lead follow-up & AI | `follow-up` | Links to `/lead-follow-up-automation` |
| 5 | Websites & conversion | `websites` | Links to `/web-development`. Absorbs the old web dev questions + SEO/organic questions. |
| 6 | Working together | `working-together` | Reporting, team fit, communication, offboarding. |

### 3.3 Questions to CUT

- "Do you work with businesses outside of Tampa?" — weak, and see §9.1 on the
  location conflict.
- "What payment methods do you accept?" — nobody chooses an agency on this.
- "Do you write content for my website?" — fold into a websites/SEO answer.
- "What's the difference between local SEO and regular SEO?" — generic SEO
  education, not a question about *this business*.
- "Do you offer month-to-month services or require annual contracts?" —
  duplicate of "Do you require long-term contracts?" Merge.
- Any question whose honest answer is just "yes."

### 3.4 Questions to KEEP (rewrite the answers, keep the intent)

Getting started: how do I get started; what's in the free Growth Audit; what
do you need from me; do you work with startups; what makes a good fit.

Pricing: what does it cost; do you require long-term contracts; how do you
measure and report results; what if I'm not satisfied.

Paid media: what platforms; how fast will I see results; do you manage the
budget or do I; can you take over existing campaigns; what ad spend do you
work with.

Follow-up & AI: what are AI booking agents; why does response speed matter;
will it sound robotic; what does it integrate with; how long to deploy; will
it replace my sales team.

Websites: do you build new sites or redesign; how long does a build take; what
platforms; do you do ecommerce/Shopify; do you do maintenance; how long does
SEO/organic take.

Working together: can you work with my in-house team; how often do we talk;
who owns the accounts and data.

### 3.5 NEW questions to ADD (2026 buyer concerns)

These reflect what this ICP is actually worried about now. Add at least these
six:

1. **"Can't I just do this with AI myself?"** (Getting started)
   The single most common 2026 objection to hiring any agency. Answer it
   directly and without defensiveness. AI makes execution cheap; it doesn't
   tell you which thing to execute, and it doesn't own the outcome.

2. **"How do I show up in ChatGPT and Google's AI answers?"** (Websites)
   High-intent, high-volume 2026 question. Honest answer: there is no special
   markup or trick — Google has said outright that no schema is required for
   AI Overviews. What works is being genuinely citable: clear entity
   definition, direct answers, and ranking well conventionally.

3. **"My ads work but my site doesn't convert. Where do I start?"**
   (Getting started) — routes to the audit, links `/web-development`.

4. **"Ad costs keep going up. Is paid media still worth it?"** (Paid media)
   Real, current pain. Honest answer about efficiency and the post-click
   system mattering more as click costs rise.

5. **"My tracking and attribution are a mess. Can you fix that first?"**
   (Working together) — post-cookie/iOS reality. This is a genuine
   differentiator since tracking work is already part of every engagement.

6. **"Do I have to switch platforms or rebuild everything to work with you?"**
   (Getting started) — a real adoption blocker.

Optionally also: "What happens if we stop working together?" (offboarding /
account ownership — builds trust, and the honest answer is strong).

---

## 4. Page structure

Nine blocks, top to bottom. Nothing here mirrors another page's sequence.

### Block 1 — Masthead (`.faq-mast`)
Compact. This is a reference page; do not build a marketing hero.
- Kicker: `Answers`
- `<h1>`: direct and query-shaped, e.g. "Questions founders actually ask before hiring an agency"
- One-sentence sub.
- **The search field is the hero element**, not a CTA button. Full-width,
  prominent, autofocused on desktop only (never autofocus on mobile — it
  forces the keyboard open).
- Live result count beneath: "41 answers" → "6 answers matching 'pricing'"

### Block 2 — Category rail (`.faq-rail`)
Sticky on desktop (`position: sticky; top: 96px`), horizontally scrollable
chip row on mobile.
- "All" + the 6 categories, each with a count.
- Clicking filters. Active state uses `--accent-fill`.
- Rail and search combine (AND), never conflict.

### Block 3 — The index (`.faq-index`)
The main content. Grouped by category with a sticky category heading.
- Each item is a `<details>` with `<summary>` as the question.
- Question is `<h3>` inside the summary for hierarchy.
- Every item has `id="q-<slug>"` for deep linking.
- A small "copy link" affordance per question (optional but recommended for a
  reference page).
- First item of the first category may be `open` by default. Nothing else.

### Block 4 — Empty state (`.faq-empty`)
Shown when search returns nothing. **Do not skip this.** Must offer: clear the
search, browse all, or contact directly. Name what was searched.

### Block 5 — "Still stuck" close (`.faq-close`)
Quiet, single block at the end. Not an amber drench (that's `web-development`'s
close). A restrained bordered panel: one line, one primary CTA to the Growth
Audit, one secondary mailto.

### Block 6 — Site chrome
Header, mobile drawer, footer copied verbatim from `web-development.html`
(current canonical version, includes the Web Development nav entry and the
corrected footer copy).

---

## 5. Interaction spec

Reference patterns (from 21st.dev — for *behavior* inspiration only; these are
React/shadcn and this site is vanilla HTML/CSS/JS, so **do not run
`npx shadcn add`**):
- Searchable FAQ Accordion — live keyword filter over an accordion
- FAQ Tabbed Explorer — category sidebar + accordion

### 5.1 Search (`js/faq.js`)
- Filters on question text **and** answer text.
- Debounce ~120ms.
- Case- and punctuation-insensitive.
- Hides non-matching `<details>`; hides a category heading when all its items
  are hidden.
- Updates the live count and announces it via `aria-live="polite"`.
- Escape clears. A visible clear button appears when non-empty.
- **No results library.** Plain string matching is correct here; do not add
  Fuse.js or similar for 41 items.

### 5.2 Category filter
- Buttons with `aria-pressed`.
- Combines with search.
- Updates `?c=<slug>` in the URL via `history.replaceState` so a filtered view
  is shareable. Read it back on load.

### 5.3 Deep linking
- On load, if `location.hash` matches a question id: open that `<details>`,
  clear any filter that would hide it, and scroll it into view below the
  sticky header.
- Opening an item updates the hash via `replaceState` (never `pushState` —
  don't pollute back-button history).

### 5.4 Accessibility (non-negotiable)
- `<details>`/`<summary>` gives keyboard and screen-reader behavior for free.
  Do not rebuild it with divs and click handlers.
- Summary must be focusable with a visible focus ring (`:focus-visible`).
- Search input needs a real `<label>` (visually hidden is fine).
- Category buttons: `aria-pressed`, ≥44px touch target.
- Result count region: `aria-live="polite"`.
- All content present in DOM with JS disabled; filtering is progressive
  enhancement only.

### 5.5 Motion
- Chevron rotate on open, `--dur-fast`.
- Do not animate `height` on the panel (layout thrash, and it fights
  `<details>`). A short opacity/translate fade on the panel content is enough.
- Full `prefers-reduced-motion: reduce` path: all transitions off.

---

## 6. Visual spec

Same tokens as the rest of the site (`css/tokens.css`). Ground `--bg`, amber
as the single accent, Montserrat 800 display / Spline Sans Mono for labels /
system sans body.

**The bespoke idea: this page reads like a technical index, not a landing
page.** Denser, more typographic, more utilitarian than the service pages.

Specific direction:
- **Hairline rules, not cards.** Questions separated by 1px `--border`, no
  boxed cards. This alone makes it read differently from every other page.
- **Numbered questions** in `--font-mono` (`Q·01`, `Q·02`) in a narrow left
  gutter, tabular-nums. Reinforces "reference document."
- **Sticky category headings** in mono uppercase with a hairline underline.
- **Generous line-height on answers** (`--lh-body`), max-width `~68ch`.
- **No decorative illustration, no instrument grid, no drench band.** The
  restraint is the point.
- Amber used only for: active category chip, focus rings, links, the open
  question's number, and the primary CTA.

Layout:
- Desktop ≥980px: two columns, sticky category rail left (~220px), index right.
- 640–980px: rail becomes a horizontal scrolling chip row above the index.
- <640px: single column, chips scroll horizontally, question numbers move
  inline above the question text.

---

## 7. Technical requirements

### 7.1 Head
```
<title>Marketing Agency FAQ | Lumyx Consulting</title>
```
(≤60 chars. Do not keyword-stuff with a year — the current
"Frequently Asked Questions 2026 | Marketing, AI & Growth | Lumyx" is 63 chars
and dates the page.)

- Meta description ≤155 chars, mentioning pricing, timelines, and process.
- `<meta name="robots" content="index, follow" />` — **verify this ships.**
  Five pages shipped with `noindex` earlier in this project's history.
- `<link rel="canonical" href="https://lumyx.co/faq" />` — clean URL, no `.html`.
- OG tags matching title/description.

### 7.2 Structured data
Two blocks:

1. **`FAQPage`** — every visible question, verbatim (see §2 point 4). Include
   `"@id": "https://lumyx.co/faq#faq"`.
2. **`BreadcrumbList`** — Home → FAQ.

Also reference the Organization entity by `@id`:
`"publisher": { "@id": "https://lumyx.co/#organization" }`
so this page reinforces the same entity as the rest of the site.

**No `aggregateRating`.** Self-serving review markup about your own business
violates Google's structured data policy.

### 7.3 Assets
```
css/tokens.css, base.css, components.css, sections.css, motion.css   (existing)
css/faq.css?v=<new>                                                  (new)
js/utm-tracking.js, google-conversion-events.js, analytics.js,
   meridian.js, meta-pixel-events.js                                 (existing)
js/faq.js?v=<new>                                                    (new)
```
Do **not** load `scenes.js` (service-page scroll scenes, unused here) or
`webdev.js`.

`css/faq.css` must open with:
```css
@layer tokens, base, components, sections, motion, faq;
@layer faq { /* ... */ }
```

### 7.4 Routing
Redirects already exist in `netlify.toml` (`/faq.html` → `/faq` 301,
`/faq` → `/faq.html` 200). **No change needed.** Verify, don't duplicate.

`sitemap.xml` already contains `/faq` at priority 0.7. Consider raising to 0.8
given the page's expanded internal-linking role. Update `lastmod`.

### 7.5 Quality bar
- No horizontal overflow at 320px.
- Touch targets ≥44px for controls, ≥24px for links.
- Zero console errors.
- Test with JS disabled: all 41 answers must be readable.
- Verify at 375 / 768 / 1440 / 1920.

---

## 8. Copy rules

House style, enforced across the whole page:

- **No em dashes in prose.** Use periods, commas, colons, or parentheses. The
  only permitted em dashes are label separators matching the sitewide
  convention (`Q·01 —`, `S·06 —`).
- **Banned words/phrases:** leverage, seamless, robust, elevate, unlock,
  cutting-edge, dive into, delve, comprehensive, streamline, empower, harness,
  foster, holistic, "in today's fast-paced," "when it comes to," "at the end
  of the day," "it's not just X, it's Y," "we're passionate about."
- **No exclamation marks.** The current page has "Yes!" — cut it.
- Contractions are fine and preferred. This should read like a person talking.
- Second person ("you"), active voice.
- Vary sentence length. Three medium sentences in a row is the AI cadence tell.

---

## 9. Open decisions — escalate, do not guess

### 9.1 Tampa vs nationwide (blocking)
The current FAQ is heavily Tampa-branded ("other digital marketing agencies in
Tampa," "based in the Tampa Bay area"). But the site's phone number is a **248
(Michigan)** area code, the Google Business Profile says **Tampa Bay**, and
the pages built this session deliberately say only `areaServed: United States`
with no city.

**Do not resolve this by guessing.** Ask the business owner which is correct,
then apply it consistently. If Tampa is right, local SEO signals (city in
title/H1, LocalBusiness schema with a real address) are a genuine ranking
opportunity being left on the table. If not, strip the city references.

### 9.2 The 90-day money-back guarantee
Confirm it is real before republishing. See §0.1.

### 9.3 Pricing specificity
The current page states figures for PPC management, AI agents, SEO, and
websites. Confirm each is current. Ranges are fine and build trust; stale or
invented numbers are worse than "quoted after the audit."

### 9.4 SEO as an offer
`seo-services.html` was deleted this session (broken layout in production).
SEO still appears in the homepage `hasOfferCatalog`. Decide whether SEO
questions point to a future page, fold into `/web-development`, or stay
unlinked. Do not link to the deleted page.

---

## 10. Definition of done

- [ ] Old v1 markup, inline `<style>`, `main.css`, `mobile-fixes.css`, and
      Font Awesome all gone
- [ ] `css/faq.css` + `js/faq.js` created; no other page's signature
      components reused (§0.2)
- [ ] All questions rendered as `<details>`/`<summary>`, readable with JS off
- [ ] Search filters question + answer text, debounced, with live count and
      a real empty state
- [ ] Category filter works, combines with search, syncs to `?c=`
- [ ] Every question has a stable `id`; deep links open and scroll correctly
- [ ] `FAQPage` JSON-LD matches visible text **verbatim**; `BreadcrumbList`
      present; no `aggregateRating`; Organization referenced by `@id`
- [ ] `robots` is `index, follow`; canonical is `https://lumyx.co/faq`
- [ ] Title ≤60 chars; description ≤155
- [ ] No unverified claims (§0.1); no banned words or prose em dashes (§8)
- [ ] Keyboard: tab to every summary, visible focus, Enter/Space toggles
- [ ] `prefers-reduced-motion` path verified
- [ ] No horizontal overflow at 320px; verified 375/768/1440/1920
- [ ] Zero console errors
- [ ] `sitemap.xml` lastmod updated
- [ ] Open decisions in §9 raised with the owner, not guessed
