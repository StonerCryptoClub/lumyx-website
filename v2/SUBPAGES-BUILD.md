# MERIDIAN — Phase 2: **Distinct Subpages + Blog**
## The Complete Design & Build Contract (supersedes the current subpage layouts)

> **What this is.** The self-contained implementation contract for rebuilding `meridian/ppc-management.html` and `meridian/ai-lead-generation.html` as **distinct page-worlds**, and adding `meridian/blog.html` + `meridian/blog-post.html` with live Contentful content. Written so a cheaper coding model can execute it flawlessly with zero design decisions of its own. Where a choice could exist, this document has made it.
>
> **Read alongside** `MERIDIAN-BUILD.md` (Phase 1). Everything there still governs: tokens (§6), typography (§7), graphic language (§8), motion doctrine (§9.1), constraints C1–C12, and the anti-slop bans (§19). This document only *adds and overrides* as stated.
>
> **The bar, restated.** A high-level client must ask *"how was this made?"* — never *"which AI made this?"*. The Phase-1 subpages failed a specific test: they reused the homepage's composition grammar (same method rail on both pages, same centered-column rhythm, dead side margins). This phase exists to fix exactly that.

---

## 0 · Builder protocol

1. Read §1–§3 before writing any code. §1 lists the exact defects being fixed — re-check each one at its gate.
2. Build in §12 order; verify each gate in a browser before continuing.
3. Copy decks (§9, §10, Appendix A/B) are **final copy**. Do not rewrite.
4. The Contentful contract (§8) is **sacred**: the shared loader scripts are never edited; our pages reproduce the DOM they expect and restyle their output.
5. All new files live in `meridian/`. The only file outside the new pages you may touch is `meridian/css/*`, `meridian/js/*`, `meridian/index.html` (one body-class addition + nav/footer link updates), and `serve.json` (one rewrite line, §8.6).
6. When uncertain, this document wins.

---

## 1 · The defect list (what this phase fixes — verify each at G-FINAL)

| # | Defect | Fix (section) |
|---|---|---|
| D1 | Both service pages reuse the homepage's composition grammar — same vertical method rail appears on all three pages | Each page gets its own **geometry** and its own method treatment (§3, §5.4, §6.4) |
| D2 | AI page reads bland/blank, especially the side margins while scrolling | AI page rebuilt around a **center-spine alternating timeline** that occupies the full canvas (§6); margin-annotation system fills wide-viewport gutters on all subpages (§4) |
| D3 | PPC page also shows dead side space | PPC rebuilt around a **sticky diagnostic terminal** that permanently occupies the right rail while narrative scrolls the left (§5); margin annotations (§4) |
| D4 | FAQ copy is thin (short answers, missing the questions real buyers ask) | Full rewritten FAQ decks with pricing/ownership/timeline/compliance questions (§9) + upgraded FAQ layout (§7) |
| D5 | `FIG.02` on PPC: the "lead goes cold" SVG label clips at the right edge | Exact geometry fix (§5.6) |
| D6 | Subpages inherit the index's reserved left rail (base.css pads every `.container` ≥1080px) even though no thread exists there — asymmetric dead space | Rail padding gated behind a `has-thread` body class (§4.1) |
| D7 | No blog on the B-test surface | `meridian/blog.html` + `meridian/blog-post.html`, live Contentful, Meridian register (§8) |

---

## 2 · Distinctness doctrine (the design law for this phase)

**Shared (never varies):** tokens, type system, mono telemetry voice, nav/footer/drawer, buttons, chips, ticks, cards, kicker, status-dot, section padding rhythm, motion easing/doctrine, a11y floor.

**Owned per page (must differ):** the page's *geometry* — where its energy lives on the canvas — plus one signature interaction and its own method treatment:

| Page | Geometry | Signature interaction | Method treatment |
|---|---|---|---|
| Homepage (built) | **Left-thread**: fixed meridian rail, centered content | Scroll-plotted timeline w/ stations | Vertical amber rail (owned by index — never reused) |
| PPC | **Right-sticky terminal**: narrative scrolls left, a live diagnostic panel holds the right rail and *changes state as you scroll* | Scrollytelling audit (§5.2) | "The build sheet" — horizontal scroll-snap spec cards (§5.4) |
| AI | **Center-spine alternating**: a vertical timeline down the page center, event cards docking left/right | A lead's first hour replayed as scroll-triggered messages (§6.2) | "The build log" — terminal window that types 5 log entries (§6.4) |
| Blog | **Dispatch board**: editorial grid with a featured lead story and numbered entries | CSS-counter issue numbers + hover lift; content is the star | n/a |

Rule: if a section from one page would look at home on another page, its design is wrong. The lane check from Phase 1 §2.6 applies per page: PPC = *"a media buyer's diagnostic terminal on the audit desk"*; AI = *"a lead's message thread pinned down the middle of the worksheet"*; Blog = *"the operator's published field notes."*

---

## 3 · 21st.dev inspiration map (rebuild vanilla on tokens; never import)

| Source pattern (21st.dev) | What we take | What we discard | Lands in |
|---|---|---|---|
| Aceternity "Sticky Scroll Reveal" (sticky container, content swaps per scrolled step) | the step→panel state machine; IO threshold 0.5 activation | React/framer-motion, their dark cards | PPC desk scene (§5.2) |
| "Chat Interface" (sequential bubbles, typing indicator, avatars) | typing-dots precursor → bubble pop; sequential arrival | timers/auto-restart (we key off scroll), their styling | AI timeline (§6.2) |
| "Story scroll" / scroll-driven storytelling | narrative-unlocked-by-scroll pacing | text-highlight gimmicks | both scenes' pacing |
| Horizontal scroll-snap card galleries | `scroll-snap-type: x mandatory`, progress dots, keyboard support | carousel autoplay | PPC build sheet (§5.4) |
| Number Ticker / marquee / reveal (Phase 1) | already built | — | reused as-is |

---

## 4 · The blank-sides system (applies to both service pages)

### 4.1 Un-reserve the thread rail (D6)
In `base.css`, the ≥1080px rule `.container { padding-left: calc(var(--rail-w) + var(--gutter)) }` must apply **only when the meridian thread exists**. Change the selector to `.has-thread .container { … }` and add `class="has-thread"` to the **index page's `<body>`** only. Subpage containers return to symmetric gutters. *(This is the one permitted edit to Phase-1 files besides links.)*

### 4.2 Margin annotations (the worksheet's marginalia)
On viewports ≥1280px, the space between the content column and the viewport edge carries **mono margin notes** — the way a senior operator annotates a printed report. One per major section, alternating sides.

```css
/* components.css */
.margin-note {
  position: absolute; top: calc(var(--section-pad) + 8px);
  font-family: var(--font-mono); font-size: 0.62rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted);
  opacity: 0.6; writing-mode: vertical-rl; display: none;
  pointer-events: none; white-space: nowrap;
}
.margin-note--left  { left:  clamp(12px, calc((100vw - var(--maxw)) / 2 - 48px), 96px); }
.margin-note--right { right: clamp(12px, calc((100vw - var(--maxw)) / 2 - 48px), 96px); }
.margin-note::before { content: "— "; }
@media (min-width: 1280px) { .margin-note { display: block; } }
```
Sections that receive one are marked in §5.5/§6.5 (`data-note` column). Parent `section` must be `position: relative`. Content examples: `§02 · DIAGNOSTIC`, `FIG SET B`, `REV. 2026-07`. These are texture, not navigation — max ~6 per page, never two on the same side in a row.

### 4.3 Wider working canvas on scenes
The two signature scenes (§5.2, §6.2) use a wider wrap: `.canvas-wide { max-width: 1360px; margin-inline: auto; padding-inline: var(--gutter); }` so the design visibly *works* the full viewport on desktop.

---

## 5 · PPC page — "**The Media Desk**" (full rebuild of the body between hero and audit panel)

### 5.1 What is kept from Phase 1
Hero (code chip, h1, lead, CTAs, proof strip, click-to-revenue instrument card) — kept, but the instrument card **moves into the desk scene** (§5.2) and the hero right column instead gets the same card *statically* only on <980px. On ≥980px the hero is a single centered column (chip → h1 → lead → CTAs → proof strip) because the terminal now lives in the scene below. Also kept: channels catalog, cases, audit panel, final CTA, footer. Removed: the pillars/figures section, the flow-path + split-cols section, the vertical method rail, the old FAQ layout.

### 5.2 ★ Signature scene: the scrolling audit (`#desk`)
A `canvas-wide` grid: `grid-template-columns: 1fr 0.85fr; gap: clamp(32px,4vw,72px)`. Left: four narrative steps. Right: **one sticky terminal panel** (`position: sticky; top: 96px`) that re-renders its readout as each step crosses mid-viewport.

**The four steps (left column).** Each `.desk-step` is `min-height: 78vh; display:flex; flex-direction:column; justify-content:center;` with: mono step label (`AUDIT 01/04`), h2-size heading, one paragraph, and one `.chip` finding. Copy in Appendix A.1. Steps activate via IO (threshold 0.5): active step at full opacity, inactive steps at 0.35 opacity (`transition: opacity var(--dur-base)`).

**The terminal (right column).** The Phase-1 instrument card, upgraded: header (`data-label` "GROWTH AUDIT · LIVE" + status-chip), four readout bars, a findings line, and a footer row of four mono stage-lamps (`INTENT · MATCH · SPEED · LOOP`) where the current stage's lamp is amber. Bar widths and statuses are driven by CSS custom properties set from JS per state:

| State (step) | Ad intent | Page match | Lead speed | CRM loop | Findings line |
|---|---|---|---|---|---|
| 0 · INTENT | **82% Strong** | 48% | 34% | 56% | `> demand confirmed — the clicks are not the problem` |
| 1 · MATCH | 82% | **48% Needs work** | 34% | 56% | `> page does not repeat the ad's promise — rewrite above the fold` |
| 2 · SPEED | 82% | 71% *(fix applied)* | **34% Leaking** | 56% | `> avg first response 3h 40m — booked-call rate decays after 5 min` |
| 3 · LOOP | 82% | 71% | 68% *(fix applied)* | **56% Partial** | `> outcomes never reach the bid strategy — optimizing blind` |

Bars animate width via `transition: width 700ms var(--ease-out)`. The active row's `strong` status text is `--accent-deep`; others `--ink-muted`. Findings line swaps with a 150ms crossfade (`opacity`), mono, `--accent-deep`.

**JS (`meridian/js/scenes.js` — new file, loaded by both service pages only):**
```
initDeskScene():
  steps = [data-desk-step]; panel = .desk-terminal
  states = hardcoded array matching the table above
  IO (threshold 0.5) → on entry set panel state:
    for each of 4 bars: bar.style.width = state.w[i]+'%';
    toggle .is-current on row i; set findings textContent; set lamp i
  fallback: no IO or reduced-motion → render final state (3), steps full opacity
```

**Responsive:** <980px the grid stacks; the terminal renders **once, non-sticky, above the steps**, in its final state; steps become normal stacked blocks (`min-height: auto`). No scroll hijack on mobile, ever.

### 5.3 Section order (final PPC skeleton)
```
header
#top        hero (single column) — margin-note R: "S·01 · PAID MEDIA"
#desk       ★ the scrolling audit (4 steps × sticky terminal)
#services   what's included — P·01…P·06 catalog (kept; add margin-note L: "§02 · SCOPE")
#channels   Google / Meta / Retargeting (kept; margin-note R: "§03 · CHANNELS")
#buildsheet the build sheet (replaces method rail) — §5.4
#proof      cases + note (kept; margin-note L: "§05 · EVIDENCE")
#audit      console audit panel (kept)
#faq        upgraded FAQ (§7) with Appendix A.2 copy
final CTA · footer
```

### 5.4 "The build sheet" (PPC method — replaces the vertical rail)
A horizontal **scroll-snap gallery** of five oversized spec-sheet cards, presented like printed job sheets on the desk.

- Wrapper: `.buildsheet { overflow-x: auto; scroll-snap-type: x mandatory; display: flex; gap: var(--sp-3); padding-block: var(--sp-2); scrollbar-width: none; }` inside `canvas-wide`; edge-fade mask like the marquee.
- Card: `.buildsheet__card { scroll-snap-align: center; flex: 0 0 min(560px, 86vw); }` — `.card` base, padding `--sp-4`, containing: mono header row (`SHEET 01/05` left, `DIAGNOSE` right in `--accent-deep`), h3, paragraph (Appendix A.3 copy = Phase-1 method copy, kept), and a 3-item tick list of concrete artifacts (in copy deck).
- Progress dots under the gallery: 5 × 8px dots, active = amber pill 20px wide; JS syncs on scroll (`scenes.js: initSnapDots()` — IO on cards, rootMargin centered). Dots are `<button>`s that `scrollIntoView({inline:'center'})` their card — keyboard accessible.
- A mono hint right-aligned above: `drag / scroll →` (hidden on touch).
- Reduced motion: gallery still scrolls (user-initiated = allowed); dots still sync.

### 5.5 Margin-note map (PPC)
| Section | Note | Side |
|---|---|---|
| hero | `S·01 · PAID MEDIA` | right |
| #services | `§02 · SCOPE` | left |
| #channels | `§03 · CHANNELS` | right |
| #buildsheet | `§04 · BUILD SHEET` | left |
| #proof | `§05 · EVIDENCE` | right |

### 5.6 FIG.02 clip fix (D5) — applies wherever that figure remains
The old label sat at `x="120"` and ran past the 200-unit viewBox. If FIG.02 is reused anywhere (it is removed from PPC by §5.1, but keep this rule): SVG labels must end ≥8 units inside the viewBox — set `x="178" y="30" text-anchor="end"`. **Global rule for all figure SVGs:** every `<text>` gets `text-anchor="end"` + x ≤ (viewBox width − 8), or `text-anchor="middle"` with equal clearance. Verify no `<text>` clips at G2.

---

## 6 · AI page — "**The Follow-Up Timeline**" (full rebuild of the body between hero and audit panel)

### 6.1 What is kept from Phase 1
Hero (code chip, h1, lead, CTAs, proof strip, **console instrument** with thread + routing — kept exactly; it previews the timeline below). Also kept: W·01–W·08 workflow catalog, split-cols (AI helps / team handles), stack chips, audit panel, final CTA. Removed: pillars/figures section, leak ledger *as a standalone section* (its content moves into the timeline), flow-path section, industries ledger (moves to a compact strip, §6.3), the vertical method rail, old FAQ layout.

### 6.2 ★ Signature scene: one lead's first hour, replayed (`#timeline`)
A center vertical spine down the page middle with **event cards docking alternately left and right** — the geometry itself fills both halves of the canvas (D2 solved structurally).

**Spine:** `.tl { position: relative; }` with `.tl::before { content:""; position:absolute; left:50%; top:0; bottom:0; width:2px; background: var(--border); }` plus an amber fill element `.tl__fill` (scaleY bound to the section's own scroll progress — same math as Phase-1 rail, scoped to this section).

**Events:** each `.tl-event` is a grid row: `grid-template-columns: 1fr 88px 1fr`. The center cell holds the **time marker**: a 12px amber-ring dot + mono timestamp beneath (`T+0:00`). The card occupies the left or right cell (`.tl-event--r` mirrors). Cards are max-width 420px, pushed toward the spine (`justify-self: end` / `start`).

**The nine events (copy verbatim, Appendix B.1):**

| # | Time | Side | Card type |
|---|---|---|---|
| 1 | `T+0:00` | L | form card — "New lead: website form" + two mono fields (source, service) |
| 2 | `T+0:12` | R | SMS bubble (outbound, amber wash): first response |
| 3 | `T+0:14` | L | system card: missed-call text-back armed (mono log line) |
| 4 | `T+2:47` | R | SMS bubble (inbound, console-2): lead reply |
| 5 | `T+3:10` | L | qualification card: 3 ticked criteria + score chip `HIGH` |
| 6 | `T+3:11` | R | CRM card: stage chip moves `NEW → QUALIFIED` (two chips, arrow) |
| 7 | `T+3:15` | L | alert card: "Sales notified — owner: Marcus" (status-dot) |
| 8 | `T+18:00` | R | booking card: "Growth audit — Thu 10:30" + `CONFIRMED` chip |
| 9 | `T+3 days` | L | nurture card: "No-show recovery + long-term nurture keep working the ones that don't book" |

**Arrival animation (the chat-interface pattern, scroll-keyed):** each event's card starts hidden (`.js-motion` gated). When its row crosses IO threshold 0.4: SMS-bubble cards first show a `.typing` state (three 5px dots, staggered pulse, 450ms) then swap to the message (crossfade 180ms); all other cards rise-and-fade like `.reveal` but from the spine side (`translateX(±16px)` + fade). The dot fills amber and its timestamp goes `--accent-deep` when active. Once only; unobserve after firing.

**JS (`scenes.js: initTimeline()`):** IO for events; rAF scroll handler for `.tl__fill` scaleY (progress = section scrolled fraction, clamped 0–1).

**Interleaved leak annotations:** between events 3→4 and 8→9, a full-width quiet strip (`.tl-note`) crosses the spine with a one-line mono truth (Appendix B.1): e.g. `most businesses lose the lead in this gap — avg reply time: 3h 40m`. These carry the old "leak" content's insight without a separate card-grid section.

**Responsive:** <980px the spine moves to `left: 24px`, all events dock right of it in a single column (`grid-template-columns: 48px 1fr`), timestamps sit above cards. No alternation on mobile.

**Reduced motion:** all events visible, dots filled, fill static at 100%, no typing dots.

### 6.3 Industries strip (replaces the industries ledger)
One compact band after the timeline: kicker `Built for speed-critical businesses` + a single row of five `.mono-tag--lg` chips (`HOME SERVICES · MED SPAS & DENTAL · LAW FIRMS · COACHES · ECOMMERCE`) each with a one-line tooltip-style sub beneath in a 5-col grid (2-col mobile). Copy Appendix B.2.

### 6.4 "The build log" (AI method — replaces the vertical rail)
A single **console card** (`.instrument--console`, max-width 860px, centered) styled as a terminal: header dots (three 8px circles: `--error-on-dark`, `--accent-on-dark`, `--ink-on-dark-2` at 40%), title `lumyx@revenue-ops : build`, then five log lines that **type themselves sequentially on scroll into view** (one IO trigger for the card; lines type at 14ms/char with 350ms pause between lines — reuse the Phase-1 typing function generalized in `scenes.js: initBuildLog()`):

```
[day 00] diagnose — audited 6 lead sources · 3 drop-off points found
[day 04] map — lead journey drafted: routing, qualification, nurture, reporting
[day 09] build — workflows, CRM stages, sequences, calendar logic wired
[day 14] launch — live-fire tested with real lead scenarios, safeguards on
[day 15+] optimize — response, booking, and show-up rates reviewed weekly
```
Line prefix `[day NN]` renders `--accent-on-dark`; rest `--ink-on-dark-2`. A blinking block caret sits after the last typed character (Phase-1 caret, reused). Reduced motion: all five lines render instantly, no caret.

### 6.5 Section order (final AI skeleton) + margin notes
```
header
#top        hero + console instrument (kept)          — note R: "S·03/04 · FOLLOW-UP"
#timeline   ★ the follow-up timeline (9 events)       — note L: "§02 · FIRST HOUR"
#industries industries strip (§6.3)
#workflows  W·01…W·08 catalog (kept)                  — note R: "§03 · CATALOG"
#division   split-cols AI/team (kept)                 — note L: "§04 · DIVISION"
#stack      stack chips (kept)
#buildlog   the build log (§6.4)                      — note R: "§05 · BUILD LOG"
#audit      console audit panel (kept)
#faq        upgraded FAQ (§7) with Appendix B.3 copy
final CTA · footer
```

---

## 7 · FAQ upgrade (both service pages — layout + interaction)

Layout: two-column ≥980px — **left (sticky, top 96px):** kicker `Before you book`, h2 `The questions founders actually ask`, one-line sub `Straight answers — the same ones you'd get on the call.`, and a compact `.btn-secondary` "Ask us directly" → `mailto:Lumyxagency@gmail.com`. **Right:** the accordion (Phase-1 `details` pattern kept: mono `Q·0n` index, plus-mark, amber-on-open). New additions:
- Answer body may contain a `.chip` fact-tag where marked in copy (e.g. `YOUR ACCOUNTS. ALWAYS.`) — one per answer max.
- First item ships `open` by default.
- `<640px`: single column, lead block unsticky.

Copy: **Appendix A.2 (PPC — 8 questions) and B.3 (AI — 8 questions), final.**

---

## 8 · The blog — "**Field Notes**" (`meridian/blog.html` + `meridian/blog-post.html`)

### 8.1 Contentful contract (sacred — verified against the live code)
- The index loader is root **`/contentful-loader.js?v=3`** — fully self-contained: it defines its own credentials (space `74kxarv2y1kp` + public delivery token) inline, fetches `content_type=blogPost` ordered by `-fields.publishdate` via plain `fetch`, and self-initializes on `DOMContentLoaded` **iff `document.querySelector('.blog-grid')` exists**. It requires **no** env-loader, supabase, or the Contentful SDK. Load exactly: gtag block, fonts, the five Meridian CSS layers, `<script src="/contentful-loader.js?v=3" defer>`, `/meridian/js/meridian.js`. Nothing else.
- The loader renders into `.blog-grid` this exact markup per post (style it; never regenerate it):
  `article.blog-card > img + div.blog-content > span.blog-category + h2 + p + div.blog-meta (3 spans, each starting with an <i> icon tag) + a.read-more (ends with an <i>)`
- Its "Read More" links are **`./blog-post.html?slug=…`** — relative, so on `/meridian/blog.html` they resolve to **`/meridian/blog-post.html`**. That is why the detail page must exist (8.4).
- On any fetch failure it renders its built-in placeholder posts — the page must look complete with those too (test both states at G6).

### 8.2 Blog index design — "the dispatch board"
Register: *the operator's published field notes.* Distinct geometry: editorial grid, content-first, no scenes.

- **Hero (compact, ≤ 45vh):** graph-grid ground (reuse `.hero__grid`), kicker `Field notes`, h1 `Notes from the revenue path`, sub: `What we're seeing in paid media, funnels, follow-up, and practical AI — written for operators, not for the algorithm.` No CTAs, no metrics. A single `.status-chip`: `● UPDATED MONTHLY`.
- **Grid:** `.blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-3); }` inside the standard container.
- **Featured lead story:** `.blog-card:first-child { grid-column: 1 / -1; display: grid; grid-template-columns: 1.2fr 1fr; }` — image left (full-height, `object-fit: cover`), content right, h2 at `--text-xl`. Collapses to stacked <980px.
- **Card restyle (scoped `.blog-grid .blog-card`):** `.card` look (surface, border, `--r-lg`, shadow-sm; hover: amber border + rise via `card--interactive` grammar). Image: `aspect-ratio: 16/9; object-fit: cover; border-radius: var(--r-md) var(--r-md) 0 0` (featured: left-rounded). `.blog-content { padding: var(--sp-3); }`.
- **Issue numbers (the bespoke signature):** CSS counters — `.blog-grid { counter-reset: entry; }` `.blog-card::before { counter-increment: entry; content: "N°" counter(entry, decimal-leading-zero); }` styled as a mono data-label chip absolutely positioned top-left over the image (surface bg, hairline border). The dispatch-board tell that no template has.
- **`blog-category`** → restyle as `.mono-tag` look (mono, uppercase, amber-deep). **`blog-meta`** → hairline-top row, mono 0.72rem; **hide the icon-font tags**: `.blog-grid .blog-meta i, .blog-grid .read-more i { display: none; }` (they're empty squares otherwise — C3 stays intact without touching the loader). **`read-more`** → `.btn-text` grammar with a CSS arrow: `.blog-grid .read-more::after { content: "→"; margin-left: 6px; transition: transform var(--dur-fast) var(--ease-out); }` hover translates it 3px.
- **Reveal:** cards get the standard rise-in — but they arrive **after** load via innerHTML, so IO must be attached post-render: `meridian.js` change — expose `window.meridianObserveReveals(container)`; blog page inline one-liner: a `MutationObserver` on `.blog-grid` adds `.reveal.is-in`-safe classes then calls it once (spec in G6; if simpler, skip reveal on injected cards entirely — **content visible instantly is the priority**; motion here is optional polish).
- After the grid: the newsletter console band (Phase-1 component, kept) → `/newsletter.html`.
- Nav on all Meridian pages: add `Blog` link (desktop nav between Results and Book Audit; drawer; footer already links `/blog.html` → **update all Meridian footers/drawers to `/meridian/blog.html`**).

### 8.3 Blog index skeleton
```
header (shared) — with Blog nav item active-styled (aria-current="page")
#top     compact hero
[grid]   .blog-grid (loader owns contents)
[band]   newsletter console band
footer (shared)
```

### 8.4 Blog post page (`meridian/blog-post.html`) — "the memo"
- **Data:** own inline script (the live site does the same): read `?slug=`, `fetch` `https://cdn.contentful.com/spaces/{SPACE}/entries?content_type=blogPost&fields.slug={slug}&access_token={TOKEN}&include=2`, resolve `featuredImage` from `includes.Asset`, render title/meta/image/rich-text body into `#blog-post-content`. **Copy SPACE/TOKEN values from root `js/config.js` at build time** (they are public delivery credentials, already shipped on the live site). Include a `renderRichText` port supporting: paragraph, h1–h3, ul/ol, hyperlink, hr, **and embedded-asset image nodes if trivially available; otherwise skip gracefully**. Error state: friendly panel `We couldn't find that note.` + `.btn-secondary` back to `/meridian/blog.html`. Loading state: `.spinner` + mono `loading note…`.
- **Design:** reading page. Sticky header (shared). A `.memo-head` block: mono breadcrumb `Field notes / {category}`, h1 (`--text-2xl`, max 20ch), meta row (mono: date · read time · Lumyx Team), then the featured image full-width in the column (`--r-lg`). Body column: `max-width: 68ch`, `--text-base`/1.75 line-height; h2/h3 display-weight with generous `--sp-4` top spacing; links `--accent-text` underlined; `hr` renders as a 24px amber rule (kicker's rule, reused). A `.memo-rail` on ≥1280px: mono margin note `N° · {date}` (margin-note system).
- End of post: hairline, then a compact CTA row: text `Want this level of thinking applied to your pipeline?` + `.btn-primary` "Book my free Growth Audit" → `/meridian/index.html#calendly-container`. Then footer.
- `noindex` + canonical `https://lumyx.co/meridian/blog-post.html` on both blog pages, same as all Meridian pages.

### 8.5 Blog QA specifics (part of G6)
- Live Contentful posts render; kill network → placeholders render and still look designed.
- Read More → `/meridian/blog-post.html?slug=…` loads the right post.
- No icon-font glyphs/boxes visible anywhere (the `<i>` tags are hidden).
- Zero edits to `/contentful-loader.js`, `/js/config.js`, or any root file.

### 8.6 Dev-server line
Add to `serve.json` rewrites (local-only nicety, harmless in prod): `{ "source": "/meridian/blog", "destination": "/meridian/blog.html" }`.

---

## 9 · FAQ copy — **Appendix A.2 · PPC (final)**

1. **Q·01 — Do you only manage Google Ads?** No. We run Google Search, Shopping, Performance Max, Meta, and retargeting — but the bigger difference is that we also fix the system around the ads: the landing page, the tracking, the CRM, and the follow-up. Those decide whether a click becomes revenue, and most "ad problems" live there.
2. **Q·02 — What ad budgets do you work with?** Most clients spend between $2k and $50k/month on ads. More important than the number: your unit economics have to support paid acquisition. If they don't yet, we'll tell you that in the audit instead of taking the retainer. *(chip: `WE'LL TELL YOU STRAIGHT`)*
3. **Q·03 — How fast will we see results?** First signal usually inside 2–4 weeks — cleaner tracking, better search terms, tighter message match. Compounding gains come after that, as qualified-outcome data starts feeding the bidding. Anyone promising overnight ROAS is selling you something.
4. **Q·04 — Who owns the ad accounts and the data?** You do. Always. Accounts, pixels, audiences, conversion history — everything stays in your name with your billing, and you keep full admin access. If an agency wants to run ads from *their* account, that's your cue to leave. *(chip: `YOUR ACCOUNTS. ALWAYS.`)*
5. **Q·05 — What does reporting look like?** A monthly spend-to-pipeline review in plain language — what we spent, what it produced, what we're changing — plus live dashboard access. We report qualified pipeline, not clicks and impressions.
6. **Q·06 — What makes Lumyx different from a normal PPC agency?** Most agencies stop at the click. We're accountable for the path after it: landing page match, speed-to-lead, CRM stages, and feeding real outcomes back into the campaigns. Same budget, harder-working system.
7. **Q·07 — Do you work with ecommerce and local service businesses?** Both. Ecommerce runs through Shopping, PMax, Meta, and retargeting with feed and conversion work; local and appointment businesses get search + landing page + speed-to-lead systems. The audit tells us which playbook fits.
8. **Q·08 — What actually happens in the Free Growth Audit?** A working session, not a pitch: we go through the 9-point scan (ads, pages, tracking, CRM, follow-up) on your real accounts and leave you a prioritized fix list — useful whether or not you hire us.

## 10 · FAQ copy — **Appendix B.3 · AI page (final)**

1. **Q·01 — Is this just an AI receptionist?** No. It's a full lead-response system: capture, first response, qualification, routing, CRM updates, booking, nurture, and reactivation working together. AI assists inside that system — it isn't the product.
2. **Q·02 — Will it sound robotic to my leads?** You approve every message template before anything goes live. AI decides *when* and *where* — the words stay yours, in your voice. Most leads simply experience a business that finally answers fast. *(chip: `YOUR VOICE, FASTER`)*
3. **Q·03 — Will this replace my sales team?** The opposite. It clears the repetitive layer — first replies, reminders, data entry — so your closers spend their time on qualified conversations instead of chasing cold form-fills.
4. **Q·04 — How long does setup take?** Typically 2–4 weeks from audit to live: map the journey, build the workflows, test with real lead scenarios, then launch with safeguards. You'll see the whole build before it touches a customer.
5. **Q·05 — What about texting compliance and consent?** Built in from day one: consent-based SMS only, correct opt-in language on your forms, automatic STOP/HELP handling, and A2P 10DLC registration where required. Fast follow-up is worthless if it gets your number blocked. *(chip: `CONSENT-FIRST`)*
6. **Q·06 — What platforms do you work with?** GoHighLevel, HubSpot, Pipedrive, Salesforce, Calendly, Google Calendar, your website forms, SMS and email systems, plus Google Ads, Meta Ads, and GA4 for source tracking — matched to the stack you already run.
7. **Q·07 — What does it cost?** Scope-based: a fixed build for the system plus a monthly operations retainer — quoted after the audit, when we know exactly what needs building. No per-message metering, no surprise line items.
8. **Q·08 — What happens in the Free Growth Audit?** We trace a real lead through your current process — forms, calls, CRM, follow-up, booking — timestamp where it stalls, and hand you the fix list in priority order.

---

## 11 · Copy decks — Appendices A.1 / A.3 / B.1 / B.2 (final)

### A.1 — PPC desk-scene steps
- **AUDIT 01/04 · Intent** — h: `The clicks were never the problem` — p: `Your ads are reaching people who are actively searching for what you sell. Intent is strong — which makes everything that happens after the click matter twice as much.` — chip: `82% AD INTENT`
- **AUDIT 02/04 · Match** — h: `The page breaks the promise` — p: `The ad makes an offer; the landing page changes the subject. Message match is the cheapest conversion lift in paid media — and the most commonly skipped.` — chip: `48% PAGE MATCH`
- **AUDIT 03/04 · Speed** — h: `The lead sits for hours` — p: `A lead that hears back in five minutes books at multiples of one that waits three. Most pipelines quietly bleed here, between the form fill and the first reply.` — chip: `3H 40M AVG RESPONSE`
- **AUDIT 04/04 · Loop** — h: `The campaign never learns` — p: `If booked calls and closed deals never reach the bid strategy, Google optimizes for form fills — including the junk. Close the loop and the same budget buys better leads.` — chip: `LOOP: PARTIAL`

### A.3 — PPC build-sheet artifact lists (per card, after Phase-1 method copy)
- 01 Diagnose: `Search-term & spend audit · Landing-page teardown · Tracking gap report`
- 02 Build: `Campaign architecture · Page rewrites · Conversion + CRM wiring`
- 03 Launch: `Channel rollout plan · Budget pacing rules · Launch safeguards`
- 04 Optimize: `Weekly signal review · Creative & bid tests · Lead-quality tuning`
- 05 Scale: `Volume expansion map · Efficiency guardrails · New-channel tests`

### B.1 — AI timeline events (card copy)
1. Form card — title `New lead — website form`, rows: `source: google ads / search`, `service: consultation`
2. SMS out — `Thanks for reaching out — quick one so we route you right: is this for your home or a rental property?`
3. System card — log: `missed-call text-back armed · owner phone rang 0:06`
4. SMS in — `Our place. We'd want someone out this week if possible.`
5. Qualification card — ticks: `Timeline: this week` / `Service area: yes` / `Budget signal: confirmed`, chip `SCORE: HIGH`
6. CRM card — `NEW` →(arrow)→ `QUALIFIED`, sub `source + score written to CRM`
7. Alert card — `Sales notified — owner: Marcus · context attached` (status-dot)
8. Booking card — `Growth audit — Thu 10:30` + chip `CONFIRMED`, sub `reminders + reschedule flow armed`
9. Nurture card — `Didn't book? No-show recovery and long-term nurture keep working the ones that aren't ready yet.`
- tl-note ①: `most businesses lose the lead right here — average first reply: 3h 40m` · tl-note ②: `booked is not done — reminders and recovery protect the calendar`

### B.2 — Industries strip subs
`HOME SERVICES — missed call = lost job` · `MED SPAS & DENTAL — inquiries book while interest is hot` · `LAW FIRMS — intake speed wins the case` · `COACHES — show-up rates make the offer` · `ECOMMERCE — recover the almost-buyers`

---

## 12 · Build order & gates

| Step | Build | Gate |
|---|---|---|
| 1 | base.css `has-thread` gate + index body class + margin-note component + `canvas-wide` + link updates (Blog nav on all pages) | G1: index unchanged visually; subpage containers symmetric; margin notes render ≥1280 only |
| 2 | `scenes.js` scaffolding + PPC page rebuild (§5) | G2: desk states swap at each step; sticky ≥980; mobile stacks w/ final state; no `<text>` clipping in any SVG; build sheet snaps + dots sync + keyboard works |
| 3 | AI page rebuild (§6) | G3: 9 events alternate + arrive on scroll; typing dots on SMS only; spine fill tracks; mobile single-column left-spine; build log types once |
| 4 | FAQ upgrade both pages (§7 + decks) | G4: sticky lead col; first item open; chips render; copy verbatim |
| 5 | Blog index (§8.2–8.3) | G5: live posts render styled; placeholder fallback styled; no icon boxes; N° counters correct |
| 6 | Blog post page (§8.4) | G6: real slug loads; error + loading states; CTA row; reading measure ≤68ch |
| 7 | Full pass | G-FINAL: every D1–D7 verifiably fixed; zero console errors; zero horizontal overflow at 375/768/1280/1440; reduced-motion complete; anti-slop audit (§19 Phase 1) re-run on all four pages; the three page geometries are visibly distinct side-by-side |

**Motion doctrine reminders for the builder (from failures already seen):** every new hidden state gated behind `.js-motion`; IO thresholds exactly as specified; unobserve after fire; sticky needs `align-self: start` in grid; test at 375px before calling any gate done.

---
*End of contract. Three pages, three geometries, one voice — build it so they ask how.*
