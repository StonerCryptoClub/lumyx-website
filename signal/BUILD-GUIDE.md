# Lumyx "Signal" — Immersive Bespoke Build Guide

> **What this is:** the complete, self-contained implementation contract for a brand‑new Lumyx marketing site, codename **Signal**. It is written to be executed *flawlessly by any competent coding model* with no further design decisions required. Every color, font, class name, layout, motion curve, and piece of copy is specified. Where a choice exists, this document makes it — the builder does not improvise.
>
> **Deliverable:** one immersive, single‑page site inside the folder `signal/`. It must feel bespoke enough that a visitor asks *"how was this built?"*, never *"which AI made this?"*.
>
> **Rule zero — isolation:** create and edit files **only inside `signal/`**. Do **not** modify anything in `b/`, the repo root, `js/`, `css/`, or any existing page. Shared logic is *referenced upward*, never edited.
>
> **Golden rule — not a reskin:** this is **not** a light‑mode copy of the current dark site, and **not** a generic agency template. It is its own thing (see §2). If a section starts to look like "dark site but white," stop and re‑read §2.

---

## 0. How to use this document (builder instructions)

1. Read §1–§3 fully before writing a line. They define *why* and *what not to do*.
2. Build in the order given in §17. Do not jump ahead; later layers depend on earlier ones.
3. Copy the exact values in §5–§10 verbatim. They are not suggestions.
4. Reproduce the **conversion contract** in §12 exactly — IDs, script list, and head block. The site's entire business purpose (booked audit calls) depends on it. A renamed ID silently breaks tracking.
5. Copy blocks in §11 and Appendix A are **final copy**. Do not rewrite marketing copy. You may only fix obvious typos.
6. When done, run the acceptance checklist in §18 and the anti‑slop audit in §19. Do not report "done" until every box passes.
7. Only generate imagery (Higgsfield) where §13 explicitly says an image is needed. Everywhere else, the bespoke SVG/CSS *is* the imagery. Never drop a stock photo or a colored rectangle where §13 does not call for one.

---

## 1. Strategic anchor (do not deviate)

**Product.** Lumyx Consulting (lumyx.co) is a performance‑marketing agency selling one connected system — strategy, paid media, funnels, CRM/follow‑up, and practical AI: *"the full revenue path,"* not deliverables.

**The one metric.** Booked **Growth Audit** calls (GHL booking widget + hero lead‑form submissions, tracked via GA4 / Google Ads / Meta). Every element on the page exists to earn that booking. If a flourish does not serve the booking, it is cut.

**Audience.** Founders and owner‑operators of growing online businesses ($20k–$500k/mo) and their marketing leads. Skeptical, numbers‑first, burned before by agencies that ran traffic and vanished. They decide in under two minutes whether Lumyx are *operators* or *another template agency*.

**Voice.** Engineered, direct, revenue‑obsessed — a senior operator showing you the numbers, not a studio showing moodboards. Confident, specific ("43% CPA drop in month one"), never hypey. Emotional target: *"these people run tighter systems than my current agency."*

**Five principles (hold these in tension the whole build):**
1. **Practice what you preach.** A conversion agency's own site is a conversion masterclass: instant clarity, one primary CTA, zero friction to booking.
2. **Numbers are the imagery.** Proof (ROAS multiples, retention, CPA drops) carries more weight than any photo. Metrics get typographic star treatment.
3. **Engineered, not decorated.** Every visual element earns its place in the revenue argument. Motion demonstrates precision; it never fills silence.
4. **Amber is the signature.** The amber/gold accent marks value, action, and proof — never wallpaper.
5. **Speed is credibility.** Fast load, instant response, zero layout shift. A slow marketing‑agency site is a self‑refutation.

---

## 2. The concept & art direction — "The Revenue Instrument"

### 2.1 The idea in one sentence
The page is a **live operator's instrument in warm daylight**: a precision readout where a single amber **signal line** — the client's revenue — is plotted, annotated, and traced from the first fold to the last.

### 2.2 Why this concept (and why it isn't a copy of anything)
- The current live site is **dark, glassy, amber‑on‑black**. Signal is **daylight, engineered, amber‑on‑warm‑white**. Opposite ground, opposite mood — impossible to mistake for the current site.
- It is **not** the generic agency template (icon‑card grids, gradient‑text hero, uppercase eyebrows) — those are explicitly banned in §19.
- It is **not** the cream/editorial‑magazine default (display serif, drop caps, ruled columns). Lumyx is an operator brand, not a magazine.
- It **is** the brand's own world made literal: an agency obsessed with tracked numbers renders its site as the instrument those numbers live in.

### 2.3 The signature element (the one thing the page is remembered by)
**The Signal Line.** A single amber line that behaves like a plotted revenue trace:
- In the **hero**, it draws itself across an engineered grid on load (a rising curve from "audit" to "revenue").
- It becomes the **vertical progress rail** in the Growth Method (fills as you scroll).
- It re‑appears as the baseline under the **Proof Band** metrics.
- The motif — *one continuous plotted signal* — is the connective tissue of the whole page. Everything else stays quiet so the signal reads.

Spend all boldness here. Every other section is disciplined and calm.

### 2.4 Immersion devices (what makes it feel alive, not static)
1. **Cursor‑reactive hero grid** — an amber spotlight follows the pointer across the engineered grid, so the hero reads as a live console. *(Rebuilt from 21st.dev pattern; see §10.)*
2. **Scroll‑driven plotting** — the signal line and method rail draw in response to scroll position, not on a timer. *(21st animated‑roadmap pattern.)*
3. **Odometer counters** — proof numbers roll up when they enter view. *(21st "Number Ticker" pattern.)*
4. **Real diagrams, not icons** — concepts are drawn as micro‑charts (a targeting scatter, a funnel, a response‑time curve), annotated with monospaced measurement labels.

### 2.5 Aesthetic lane check (run before building)
Name the reference out loud: *"a warm‑daylight operator console — Bloomberg terminal calm meets engineering graph paper, amber signal on bone‑white."* If what you're about to build instead reads as "SaaS landing page," "dark dashboard," or "editorial magazine," you're in the wrong lane — restart the section.

---

## 3. Non‑negotiable constraints

| # | Constraint |
|---|---|
| C1 | **All new files live in `signal/`.** Nothing outside it is created or modified. |
| C2 | **Conversion contract (§12) is reproduced exactly.** IDs, classes, events, script set, head block — verbatim. This is a Liskov substitution: every root script that runs on the live site must run here unmodified. |
| C3 | **No icon font.** No Font Awesome, no Lucide CDN, no emoji‑as‑icon. All marks are inline SVG from the bespoke sprite (§9) or drawn in CSS. |
| C4 | **Zero `!important`** in the entire codebase. Specificity is managed with `@layer` (§4). |
| C5 | **No `backdrop-filter` / glassmorphism.** That is the current site's language; Signal does not borrow it. |
| C6 | **No inline styles** in markup except the two the embeds require (the GHL iframe `style` attribute and any third‑party script demands). All styling lives in the CSS layers. |
| C7 | **Content is visible without JS.** Motion is additive (§10 doctrine). No section may ship blank if `signal-motion.js` fails to run. |
| C8 | **`prefers-reduced-motion` honored everywhere.** Every animation has a crossfade/instant fallback. |
| C9 | **`<meta name="robots" content="noindex">`** stays while this is a test surface (avoids duplicate‑content penalty against the live site). |
| C10 | **AA accessibility floor** (§15): 4.5:1 body contrast, 44px control targets, 24px link targets, visible focus, full keyboard nav. |

---

## 4. File & folder architecture

```
signal/
├── BUILD-GUIDE.md            ← this file
├── index.html                ← one page, semantic markup, zero inline styles
├── css/
│   ├── tokens.css            ← layer 1: design tokens (§5) — the ONLY place raw values live
│   ├── base.css              ← layer 2: reset, typography rules, focus, a11y utilities
│   ├── components.css        ← layer 3: btn / card / field / metric / chip / mark primitives (§8)
│   ├── sections.css          ← layer 4: per‑section composition + responsive (§11)
│   └── motion.css            ← layer 5: keyframes, reveal states, reduced‑motion (§10)
├── js/
│   └── signal-motion.js      ← reveals, hero choreography + cursor grid, scroll signal/rail, counters, header state, mobile nav, smooth‑scroll
└── assets/                   ← ONLY bespoke, Signal‑specific assets (e.g. a generated hero texture if §13 calls for it)
```

**CSS load order in `<head>`** (cascade mirrors dependency direction — later layers may use earlier ones, never the reverse):
`tokens → base → components → sections → motion`

**Layer enforcement.** Wrap each sheet's contents in the matching `@layer`:
```css
/* first line of tokens.css establishes the order once */
@layer tokens, base, components, sections, motion;
```
Then each file opens with `@layer tokens { … }`, `@layer base { … }`, etc. This makes specificity follow architecture, which is why C4 (no `!important`) is achievable.

**Shared‑asset paths** resolve *upward* to the repo root: `../js/hero-form.js`, `../Logo.png`, `../images/testimonials/alex.svg`. Nav links to other pages use **root‑absolute** paths (`/ppc-management.html`, `/newsletter.html`) so they are deploy‑safe from `signal/`.

---

## 5. Design tokens — `signal/css/tokens.css`

Copy verbatim. OKLCH throughout. This is the single source of truth; no other file may contain a raw hex/oklch value except where noted (gradients that need literal hex stops).

```css
@layer tokens, base, components, sections, motion;

@layer tokens {
  :root {
    /* ---------- Surfaces: warm daylight ramp (tinted toward amber hue, chroma <= 0.01 — NOT cream) ---------- */
    --bg:             oklch(0.975 0.004 75);   /* page ground ~ #F8F7F4 */
    --surface:        oklch(0.995 0.002 75);   /* cards ~ #FEFEFD */
    --surface-sunken: oklch(0.955 0.005 75);   /* quiet alt-section ground */
    --ink-panel:      oklch(0.205 0.012 60);   /* dark form card + footer ~ #1C1815 */
    --ink-panel-2:    oklch(0.255 0.014 60);   /* raised surface on the dark panel */

    /* ---------- Ink ramp (warm near-black, never pure gray) ---------- */
    --ink:            oklch(0.235 0.012 60);   /* headings ~ #221E1A */
    --ink-body:       oklch(0.32 0.010 60);    /* body — 9.5:1 on --bg */
    --ink-muted:      oklch(0.45 0.008 60);    /* captions — 5.2:1 on --bg (AA floor is the floor) */
    --ink-on-dark:    oklch(0.97 0.004 75);    /* text on ink-panel/footer */
    --ink-on-dark-mut:oklch(0.74 0.006 75);    /* muted text on ink-panel */

    /* ---------- Amber system (the inversion rule) ---------- */
    --accent-fill:    #FFA500;                 /* FILLS/surfaces/plot lines only — NEVER text on light */
    --accent-bright:  #FFD700;
    --accent-text:    oklch(0.50 0.13 65);     /* links/accents on light ~ #9A5B00 — 4.6:1 on --bg */
    --accent-deep:    oklch(0.42 0.12 60);     /* hover / stronger accent text — 6:1 */
    --accent-wash:    oklch(0.94 0.035 80);    /* amber-tinted chip / hover ground */
    --accent-on-dark: oklch(0.86 0.14 80);     /* amber that reads on ink-panel */
    --accent-gradient: linear-gradient(135deg, #FFD700, #FFA500); /* primary CTA ONLY — the page's only gradient */

    /* ---------- Drenched band (used by exactly ONE section) ---------- */
    --drench-bg:      oklch(0.78 0.155 75);    /* saturated amber field */
    --drench-ink:     oklch(0.22 0.05 60);     /* dark-amber ink on it — 7.8:1 */
    --drench-line:    oklch(0.66 0.14 70);     /* hairline on the band */

    /* ---------- Error (must NOT look like brand amber) ---------- */
    --error:          oklch(0.55 0.16 25);
    --error-on-dark:  oklch(0.78 0.13 25);     /* ~ #FFB3A6 family on the dark form card */

    /* ---------- Structure ---------- */
    --border:         oklch(0.88 0.006 75);
    --border-strong:  oklch(0.78 0.008 75);
    --border-on-dark: oklch(0.32 0.010 60);
    --shadow-sm:  0 1px 2px oklch(0.2 0.01 60 / 0.06);
    --shadow-md:  0 6px 24px -8px oklch(0.2 0.01 60 / 0.14);
    --shadow-lg:  0 24px 60px -20px oklch(0.2 0.01 60 / 0.22);
    --shadow-cta: 0 10px 28px -6px oklch(0.72 0.15 75 / 0.45);

    /* ---------- Type ---------- */
    --font-display: 'Montserrat', system-ui, sans-serif;                 /* 800 for display; brand equity */
    --font-body:    system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;  /* fast, neutral, no webfont cost */
    --font-mono:    'Spline Sans Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace; /* DATA ANNOTATIONS ONLY */

    /* scale ratio ~1.28, body fixed 1.0625rem / 1.65 */
    --text-xs: 0.8125rem;  --text-sm: 0.9375rem;  --text-base: 1.0625rem;
    --text-lg: 1.36rem;    --text-xl: 1.74rem;
    --text-2xl: clamp(2.1rem, 1.4rem + 2.2vw, 3rem);      /* h2 */
    --text-hero: clamp(2.4rem, 1.6rem + 3.4vw, 4.2rem);   /* h1 — ceiling < 6rem, per ban */
    --lh-tight: 1.08; --lh-snug: 1.25; --lh-body: 1.65;

    /* ---------- Space (24px rhythm base) ---------- */
    --sp-1: 6px; --sp-2: 12px; --sp-3: 24px; --sp-4: 48px; --sp-5: 96px;
    --section-pad: clamp(72px, 5vw + 40px, 128px);
    --gutter: clamp(20px, 4vw, 48px);
    --measure: 65ch;
    --maxw: 1200px;

    /* ---------- Radii / motion ---------- */
    --r-sm: 8px; --r-md: 14px; --r-lg: 22px; --r-pill: 999px;
    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);           /* out-quint — the ONLY easing. No bounce. */
    --dur-fast: 180ms; --dur-base: 420ms; --dur-hero: 700ms;
    --rise: 20px;

    /* ---------- Z scale (semantic, no 9999s) ---------- */
    --z-nav: 100; --z-overlay: 200; --z-drawer: 300;
  }
}
```

**Contrast receipts (verify with a checker before shipping):** body 9.5:1 · muted 5.2:1 · accent‑text 4.6:1 · drench‑ink 7.8:1. **White‑on‑`--accent-fill` = 1.9:1 → FAILS.** Therefore CTA text on amber is **always `--ink`, never white**.

---

## 6. Typography system

Three roles, chosen deliberately (not by reflex):

| Role | Family | Usage | Rationale |
|---|---|---|---|
| Display | **Montserrat 800** | h1–h4, big metric numbers, primary buttons | Existing Lumyx brand face — identity preservation wins. Used only at 800 for confident, engineered weight. |
| Body | **system‑ui stack** | all paragraphs, labels, nav | Zero webfont cost = principle 5 (speed). Neutral, legible, not a "designy" reflex face. |
| Data | **Spline Sans Mono** (500/600) | measurement labels, figure captions, catalog codes, status chips, axis ticks | The operator's readout voice. **Restricted to short data annotations** — never body copy — so it reads as instrumentation, not developer‑costume. |

**Rules:**
- Load only the weights used: Montserrat `500;600;700;800`, Spline Sans Mono `400;500;600`. One `<link>`, `display=swap`, preconnect to fonts.gstatic.com.
- `text-wrap: balance` on h1–h3. `text-wrap: pretty` on long paragraphs.
- Display letter‑spacing: h1 `-0.02em`, h2 `-0.015em`. Never tighter than `-0.04em`.
- Body line length capped at `--measure` (65ch).
- Mono labels are `text-transform: uppercase`, `letter-spacing: 0.04em`, `font-variant-numeric: tabular-nums`.

---

## 7. Color strategy & usage discipline

Strategy = **Committed light** with one **Drenched** moment.

- **Ground:** warm daylight (`--bg`) across the page; `--surface-sunken` on alternating sections for rhythm.
- **Amber inversion rule:** amber as a *fill/plot* color is bold and everywhere it matters (signal line, CTA, plotted marks, the drench band). Amber as *text* on light must use `--accent-text`/`--accent-deep` only (the fills fail contrast as text).
- **One dark focal point in the light half:** the hero **lead‑form card** is `--ink-panel` dark — the inverted anchor that pulls the eye to the conversion action.
- **The Proof Band is the only Drenched surface.** Nothing else on the page uses `--drench-bg`. That scarcity is what makes it land.
- **Footer** is `--ink-panel` — the page is bookended by ink (form card at top‑right, footer at bottom), the light body suspended between.

---

## 8. Component primitives — `signal/css/components.css`

Each primitive is a role, not a section. Build all of these first (§17 step 3). Specs:

- **`.btn` / `.btn-primary`** — pill, min‑height 52px, `--font-display` 800. `.btn-primary` = `--accent-gradient` fill + `--ink` text + `--shadow-cta`; hover = `translateY(-2px)` + deepen shadow (transform/shadow only). **This gradient is the only gradient on the page.** Text on it is always `--ink`.
- **`.btn-secondary`** — transparent pill, 1.5px `--border-strong`, `--ink` text; hover: border → `--accent-text`, bg → `--accent-wash`.
- **`.btn-text`** — inline arrow link, `--accent-text`, min hit‑area 24px; hover: underline (offset 3px) + arrow nudges `translateX(3px)`.
- **`.card`** — `--surface`, 1px `--border`, radius `--r-lg`, `--shadow-sm`. `.card--interactive` hover: border → `--accent-fill`, `--shadow-md`, `translateY(-3px)`. **No nested cards. No side‑stripe borders.**
- **`.field` / `.field-label`** — 52px inputs. On the dark form card, fields are **white** (`--surface`) with `--ink` text (never dark‑on‑dark). Focus: 2px `--accent-fill` ring + 3px soft halo. Invalid: `--error-on-dark` border. Custom select chevron drawn in **CSS** (rotated border square), never an icon font.
- **`.metric`** — `.metric__num` in `--font-display` 800, `tabular-nums`, `--accent-text` on light / `--drench-ink` on band; `.metric__label` in `--text-sm` `--ink-muted`, sentence case. (No uppercase eyebrow tell.)
- **`.status-chip`** — bespoke replacement for icon chips: `--font-mono` uppercase label + a pulsing amber **`.status-dot`** (a dot with an expanding ring via `@keyframes`). Used for "the full revenue system", "free growth audit", "limited slots". Reduced‑motion: dot static.
- **`.chip`** — small proof pill: `--accent-wash` bg, `--accent-deep` text. Icon optional and, if present, bespoke SVG only.
- **`.kicker`** — the ONE named section lead‑in: sentence‑case bold phrase preceded by a 24px amber rule (`::before`). Max ~3 per page. **Never** an uppercase‑tracked eyebrow, never repeated above every section.
- **`.data-label`** — `--font-mono`, 0.72rem, uppercase, `--ink-muted`; `.lede` sub‑span in `--accent-deep`. Used for figure captions and measurement annotations.
- **`.figure`** — a framed micro‑diagram: 1px `--border`, radius `--r-md`, a faint CSS graph‑paper background on the `.figure__viz` SVG, and a `.figure__cap` footer holding a `.data-label`. This is how concepts are shown instead of icons.
- **`.idx-badge`** — a 46px square, `--font-mono` numeral, engineered corner ticks (amber `::before`/`::after`). Replaces feature icons with plotted index numbers.
- **`.mono-tag`** — short uppercase mono label in a hairline box (e.g. `TEL` / `EML` / `CAL`, catalog codes). Replaces wayfinding icons.
- **`.tick`** — a bespoke amber checkmark drawn in CSS (rotated border), replaces check icons in feature lists.
- **Nav** — sticky, `--surface`/95 opacity, **no blur**; hairline bottom border + `--shadow-sm` fade in on `.scrolled`. Links `--ink-body` → `--ink` with a 2px amber underline that scales in on hover. Desktop dropdown for Services (native, escapes overflow — see §11.1). Mobile drawer = `--ink-panel` dark (mirror of the form card).

**Bans within components:** no rounded‑icon‑tile above headings; no identical icon‑card grids; no gradient text; no glass.

---

## 9. The bespoke mark system — `signal/` inline SVG sprite

Icons are the #1 "AI made this" tell. Signal has **no icon font**. It ships a tiny inline SVG sprite of hand‑drawn marks on a **24px grid, 1.75 stroke, round caps/joins, `currentColor`**, placed once at the top of `<body>` (visually hidden), referenced with `<use href="#…">`.

**Discipline:** use marks *only* where a mark is genuinely functional. Prefer **numbers, mono tags, and drawn diagrams** over decorative glyphs. Decorative concept icons (target/funnel/bolt above a heading) are **banned** — use `.figure` micro‑diagrams instead.

**Approved functional marks (build these, keep the set minimal):**
`play` (VSL), `arrow` (CTA/links), `chevron` (nav dropdown + select fallback is CSS), `menu`, `close`, `star` (rating only), `instagram`, `linkedin`. That's it. Everything else is a diagram, a number, or a mono tag.

**Reference sprite** (copy verbatim; extend only if a new *functional* need appears):
```html
<svg class="icon-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.5l6 6 6-6"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.4l2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.9z"/></symbol>
  <symbol id="i-instagram" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-linkedin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2.4"/><path d="M8 10.5V16M12 16v-3.2a2.1 2.1 0 0 1 4.2 0V16"/><circle cx="8" cy="7.4" r="0.5" fill="currentColor" stroke="none"/></symbol>
</svg>
```
Base CSS: `.icon{width:1.5em;height:1.5em;display:inline-block;flex:none;vertical-align:middle;color:inherit}` — then size down per context (buttons/nav `1.1em`).

**The three concept diagrams** (used in the Positioning pillars, §11.3) are drawn inline as `.figure__viz` SVGs on a 200×112 viewBox, colored with the `viz-*` classes below. Build them exactly:

```css
/* in components.css — schematic mark colors */
.viz-ink        { fill: var(--ink-muted); }
.viz-amber-fill { fill: var(--accent-fill); }
.viz-amber-line { fill: none; stroke: var(--accent-fill); stroke-width: 2.25; stroke-linecap: round; stroke-linejoin: round; }
.viz-amber-stroke { fill: none; stroke: var(--accent-text); stroke-width: 1.5; }
.viz-axis       { stroke: var(--border-strong); stroke-width: 1.25; fill: none; }
.viz-node       { fill: var(--surface); stroke: var(--accent-fill); stroke-width: 2; }
```

- **FIG.01 · Demand** — a scatter of `.viz-ink` dots on the left; a crosshair target box (`.viz-amber-stroke` rect + two faint crosshair lines) on the right with a tight cluster of `.viz-amber-fill` dots inside. *Reads: attract the right audience.*
- **FIG.02 · Conversion** — four centered `.viz-amber-fill` bars, decreasing width top→bottom (a funnel), opacity stepping 0.95/0.78/0.6/0.9. *Reads: narrowing to conversion.*
- **FIG.03 · Follow‑up** — an `.viz-axis` L‑shape; a `.viz-amber-line` path that starts high‑left, drops steeply, then holds low; two `.viz-node` circles at the drop and the end. *Reads: response time falling.*

Each sits in a `.figure` with a `.figure__cap` reading e.g. `FIG.01 · DEMAND` (left) and a `.lede` annotation like `targeted` (right).

---

## 10. Motion system — `signal/css/motion.css` + `signal/js/signal-motion.js`

**Doctrine.** Content is visible by default. `signal-motion.js` adds `js-motion` to `<html>` **in the `<head>` before paint** (a tiny inline script) — only then do the hidden initial states apply. If JS never runs, nothing is hidden. All motion is `transform` / `opacity` / `clip-path` / `stroke-dashoffset`. Easing is always `--ease-out`. **No bounce, no elastic.**

**Inline head snippet (exact):**
```html
<script>document.documentElement.classList.add('js-motion');</script>
```

**The seven motions (each with its reduced‑motion fallback):**

1. **Hero load choreography** (~900ms, once). Sequence: status chip fades up → headline lines rise‑fade (staggered 80ms) → sub → VSL column → form card → proof strip. Driven by `.js-motion.hero-ready` (JS adds `hero-ready` after two `requestAnimationFrame`s). *Reduced motion:* everything crossfades in 150ms, no translate.
2. **Hero signal draws itself.** The revenue curve `<path>` has `pathLength="1"`, `stroke-dasharray:1`, `stroke-dashoffset:1` → transitions to `0` over 1500ms on `hero-ready`. The area fill fades in after; the 5 plot nodes pop in on a 700→1750ms stagger. *Reduced motion:* rendered final (offset 0, nodes visible), no transition.
3. **Cursor‑reactive grid.** On `pointermove` over the hero, JS writes `--mx`/`--my` (%) to a `.hero__spotlight` radial‑gradient layer via one `requestAnimationFrame` throttle. Spotlight opacity 0 → 1 on `:hover`. *(21st.dev "mouse‑follow glow / interactive SVG grid" pattern, rebuilt on tokens.)* *Reduced motion / coarse pointer:* disabled.
4. **Scroll reveals.** `IntersectionObserver` (threshold 0.15, `rootMargin: 0 0 -10% 0`) adds `.is-in` to `.reveal` elements; children get `--stagger-i` (60ms steps, cap 5). Rise `--rise`, `--dur-base`. Reveals **enhance already‑visible content** — never gate visibility on the class. *Reduced motion:* opacity‑only crossfade.
5. **Method progress rail** (the signal, continued). A scroll handler maps the section's viewport progress to `scaleY` on `.rail__fill`; each `.step` toggles `.is-active` (its mono index goes `--ink-muted` → `--accent-text`, its node lights amber) as it crosses 60% viewport. *(21st animated‑roadmap pattern.)* *Reduced motion:* rail rendered full, all steps active.
6. **Proof band wipe + odometer.** On enter‑view: the band's inner `clip-path` wipes `inset(0 0 100% 0)` → `inset(0)` over `--dur-hero`; the four numbers **roll up** (rAF, ~1200ms, out‑quart, `tabular-nums` = zero layout shift), once. Formats: `$2M+`, `4.8x`, `98%`, `20+` via `data-count`/`data-prefix`/`data-suffix`/`data-decimals`. *(21st "Number Ticker" pattern.)* *Reduced motion:* final values rendered instantly, no wipe.
7. **Header state.** `.scrolled` toggles at `scrollY > 24` → hairline border + `--shadow-sm` fade in.

**`signal-motion.js` also owns (zero root‑script dependencies for nav):**
- Mobile drawer open/close (`#mobile-menu-btn`, `#mobile-nav-sidebar`, `#mobile-nav-overlay`, `#mobile-nav-close`, `.mobile-nav-link`), Esc to close, body scroll lock.
- Smooth‑scroll for in‑page anchors **and** the `data-scroll-target="#calendly-container"` sub‑target pattern, with an 88px header offset. Uses `behavior:'auto'` under reduced motion.

Structure the JS as one IIFE, `'use strict'`, a single `matchMedia('(prefers-reduced-motion: reduce)')` check reused throughout, all listeners `{ passive: true }`, all scroll work rAF‑throttled.

---

## 11. Page architecture & section‑by‑section spec

Narrative spine (same proven order as the live site — the *treatment* is what's new):

```
<header>          sticky, light, hairline
#home             HERO — instrument: status chip → headline → sub → [VSL col | dark form card] → proof strip; signal draws behind
#about            POSITIONING — kicker + "Most Agencies Stop Too Early" + 3 FIGURE micro-diagrams (not icons)
#growth-method    GROWTH METHOD — sticky aside + 5 steps on the amber signal rail (scroll-driven)
[PROOF BAND]      ★ the one drenched-amber moment; 4 odometer metrics
#booking-section  BOOKING — value-prop (idx-badge features) + GHL calendar in a card
#services         SERVICES — asymmetric 1 (featured, full-height) + 2×2 quiet grid; mono catalog codes, no icons
#testimonials     TESTIMONIALS — 3 light cards, typographic quote mark, result chip, star rating
[newsletter]      NEWSLETTER — single compressed ink band + one CTA
#contact          CONTACT — 3 routes (mono tags) + final CTA card
<footer>          ink-dark close, mirrors the form card
```

Copy is **final** (Appendix A holds the verbatim blocks). Art direction per section:

### 11.1 Header / nav
Sticky, `--surface`/95, no blur. Left: `../Logo.png` (height ~34px) + "Lumyx" wordmark in Montserrat 800. Right: `Home · About · Services▾ · Method · Results · Book Audit`. Services is a native hover/focus dropdown (`AI Lead Gen & Booking Agents`, `PPC Management`, `All Services`) — render it so it is **not clipped** by any `overflow` ancestor (use `position:absolute` inside a `position:relative` `.nav-dropdown` with no clipping ancestor, or the popover API). "Book Audit" carries `data-scroll-target="#calendly-container"`. Mobile (≤640px): hide inline links, show `#mobile-menu-btn` (bespoke `i-menu`), open the dark drawer.

### 11.2 Hero (`#home`) — the instrument
- Ground `--bg`. Three absolutely‑positioned background layers behind the content (`z:0`, `pointer-events:none`): `.hero__grid` (48px CSS graph paper, radial‑masked so it fades out toward edges), `.hero__spotlight` (cursor‑reactive amber radial), and `.hero-viz` (the self‑drawing revenue curve SVG, `preserveAspectRatio:xMidYMid slice`, with `.hero-viz__axislabel` mono labels reading `t₀ · audit` bottom‑left and `revenue ▲` top‑right).
- Centered `.hero-top`: a `.status-chip` (`● THE FULL REVENUE SYSTEM`), then `<h1>` in two `.hl-line` spans — line 1 `--ink`, line 2 `.accent` in `--accent-text` (solid; weight carries it, **no gradient text**), then a `.hero-sub` at `--measure` in `--ink-body`.
- Two‑column `.hero-grid` (VSL `1.25fr` | form `1fr`, stacks ≤980px):
  - **VSL column:** the `#vsl-wrapper` facade (16:9, `--ink-panel`, amber play ring), microcopy, an inline social‑proof row (avatars + two text chips), and the primary/secondary CTA row.
  - **Form column:** the `--ink-panel` dark **lead‑form card** (the inverted focal point) — internals per §12.1, white fields, gradient submit. Below it, the compact **proof strip** of four `.metric`s, hairline‑separated, that also roll up on load.
- The hero is the only place the full signal choreography fires.

### 11.3 Positioning (`#about`)
`--surface-sunken` ground. `.kicker` = "Why Lumyx is different". h2 "Most Agencies Stop Too Early" + the positioning paragraph. Then **three pillars**, each a `.figure` micro‑diagram (FIG.01/02/03 from §9) above an h3 + short paragraph. **No icon tiles.** The diagrams are the differentiator — three real charts, not three glyphs.

### 11.4 Growth Method (`#growth-method`)
`--bg`. Two columns: a **sticky left aside** (`.kicker` "How Lumyx works" + h2 "The Lumyx Growth Method" + sub) and a right **rail** — the amber signal continued vertically. Five steps (`01`–`05`, mono index in rule‑off nodes) on a 2px track whose `.rail__fill` scales with scroll. Numbers stay here because this genuinely *is* an ordered sequence. Copy: Diagnose / Build / Launch / Optimize / Scale (Appendix A).

### 11.5 ★ Proof Band
Full‑bleed `--drench-bg` — the single drenched surface. A barely‑there engineered grid texture overlay (CSS, `opacity ~0.18`). One line of `.proof-band__lead` ("The numbers behind the system — tracked, not estimated."). Four odometer metrics (`$2M+ / 4.8x / 98% / 20+`) with one‑line context each, in `--drench-ink`, `--text-2xl`+ display weight, tabular. 4‑across → 2×2 at ≤640px. `clip-path` wipe entrance.

### 11.6 Booking (`#booking-section`)
`--bg`, two columns (stacks ≤980px). Left: a `.status-chip` "Free Growth Audit", h2, intro, a "What your Growth Audit covers" list of four features each led by an **`.idx-badge`** (`01`–`04`), and a quiet bordered **guarantee panel** ("No pressure, no obligation"). Right: a `.card` holding the GHL calendar — a branded skeleton (`.spinner` + "Loading available times…") sits *behind* the `#calendly-container` iframe (§12.2). Below the card, a quiet urgency line with a pulsing `.status-dot` ("Limited audit slots open each week") — urgency without red.

### 11.7 Services (`#services`)
`--surface-sunken`. `.kicker` "What we do" + h2 "Built Around Outcomes, Not Deliverables" + sub (with the blog link). **Asymmetric 1 + (2×2):** a featured card spans the left column full height (2px `--accent-fill` border, "Most popular" chip, larger type) for **Paid Media**; the other four sit in a quiet 2×2 (borderless until hover). Each card leads with a `.service__meta` row: a mono `.service__code` (`S·01`…`S·05`) + a small `.data-label` tag — **no icon tiles**. Feature lists use `.tick` bullets. All CTAs/links from Appendix A. (No `01–05` sequence numbering on the grid — a grid is not a sequence; the mono catalog code is a label, not an order.)

### 11.8 Testimonials (`#testimonials`)
`--bg`. Three `.card`s. Each: an oversized typographic quote mark (`&ldquo;` in Montserrat 800 amber — not an icon), the quote, a result `.chip` (`43%` / `35%` / `133%`), and an author row (avatar + name/title + 5 `i-star` marks in `--accent-fill`). Featured (middle) card gets a full‑width **amber top hairline** (never a side‑stripe).

### 11.9 Newsletter
A single compressed `--ink-panel` band: one line of copy + one `.btn-primary` "Get free strategy insights" → `/newsletter.html`. (The live site's 3‑benefit grid is intentionally cut: one page, one job.)

### 11.10 Contact (`#contact`)
`--bg`. Three quiet route columns, each led by a `.mono-tag` (`TEL` / `EML` / `CAL`) — not icons — with a real `tel:` / `mailto:` / booking link. Then a final `.card` CTA panel: h3 + `.btn-primary` with `data-scroll-target`.

### 11.11 Footer
`--ink-panel`, `--ink-on-dark` text. Three columns (brand blurb / quick links / connect). Socials use `i-instagram` + `i-linkedin` marks; phone/email use small mono tags. Legal + "Book your free call" bottom row. This dark close mirrors the form card — ink at both ends.

---

## 12. The conversion contract (Liskov interface — reproduce EXACTLY)

> These IDs, classes, events, scripts, and the head block are consumed by shared root scripts. **Do not rename anything here.** Verify each against the live `../index.html` before shipping; if the live file differs, the live file wins (copy from it).

### 12.1 Lead form — exact markup (place inside the dark hero form card)
The form must contain, with these exact IDs/classes:
- `<form id="hero-lead-form" novalidate>`
- Inputs: `#hf-name`, `#hf-email`; phone group `#hf-phone-group` wrapping `#hf-phone-area` (maxlength 3), `#hf-phone-prefix` (maxlength 3), `#hf-phone-line` (maxlength 4); `#hf-business`; `<select id="hf-service">` with the **exact 7 options** in Appendix A.
- Two SMS consent checkboxes: `#hf-sms-transactional` and `#hf-sms-marketing`, each unchecked/optional, with the **exact consent copy** in Appendix A, plus the legal line linking `/privacy-policy.html` and `/terms-of-service.html`.
- Per‑field error spans: `#hf-err-name`, `#hf-err-email`, `#hf-err-phone`, `#hf-err-business`, `#hf-err-service` (class `hf-field-error`, hidden until `.visible`).
- General error box: `<div class="hf-error" id="hf-error" role="alert">`.
- Submit: `<button type="submit" class="hf-submit" id="hf-submit">` containing `<span class="hf-btn-text">…</span>` and `<span class="hf-btn-loading">…</span>` (the loading span uses a bespoke `.spinner`, **not** an icon font).

`hero-form.js` handles validation, phone auto‑advance, GHL submission, success state, and the scroll‑to‑booking. It depends on `window.getLumyxAttribution` (from `utm-tracking.js`) and `window.lumyxTrackLeadConversion` (from `google-conversion-events.js`). It does **not** require `env-loader.js`.

### 12.2 VSL facade
- `#vsl-wrapper` (16:9) containing `#vsl-placeholder`, plus a `#hero-watch-vsl` button in the CTA row.
- In `<head>` (or before the script): `<script>window.VSL_YOUTUBE_URL = 'https://youtu.be/3ygHNgqRVJo';</script>`.
- `hero-form.js` removes `#vsl-placeholder`, injects the YouTube iframe, and adds a `.vsl-click-overlay` containing an element it fills with a Font‑Awesome `<i class="fas fa-play">`. **Because Signal has no Font Awesome, style `.vsl-overlay-play` with a CSS‑drawn play triangle and hide any injected `<i>`** (`.vsl-click-overlay i{display:none}`). Also style the injected `.vsl-active` body state.

### 12.3 GHL booking
```html
<div id="calendly-container">
  <iframe src="https://api.leadconnectorhq.com/widget/booking/d0prMwxo4qsyqutYVpCL"
          style="width:100%;border:none;" scrolling="no"
          id="d0prMwxo4qsyqutYVpCL_1781470766128"
          title="Book your free growth audit"></iframe>
</div>
<script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>
```
The iframe **id must stay exactly `d0prMwxo4qsyqutYVpCL_1781470766128`** — `hero-form.js` prefills it by that id. `ghl-booking-tracker.js` listens for the widget's `postMessage`. Every booking CTA on the page carries `data-scroll-target="#calendly-container"`.

### 12.4 Head instrumentation (copy verbatim from the live `../index.html`)
- The **gtag.js block** exactly as in the live `<head>` (GA4 `G-N8CNQ6Y358` + the Google Ads `AW-…` config). Copy it from the current file rather than hardcoding the ID here, so it stays in sync.
- `<meta name="robots" content="noindex">` while testing; `<link rel="canonical" href="https://lumyx.co/signal/">`.
- Google Fonts (Montserrat + Spline Sans Mono) with preconnect.

### 12.5 Scripts (deferred, exact set, in this order, end of `<body>`)
```
../js/utm-tracking.js
../js/google-conversion-events.js
../js/ghl-booking-tracker.js
../js/hero-form.js
../js/analytics.js
../js/meta-pixel-events.js
../js/form-validation.js
./js/signal-motion.js
```
**Excluded by design** (do not load): `contentful*`, `portfolio-manager.js`, `case-study-loader.js`, `newsletter.js` (Signal's newsletter is a plain link), `generate-placeholders.js`. `env-loader.js` is not needed (verified — `hero-form.js` does not reference it).

---

## 13. Imagery plan (Higgsfield only where marked)

**Numbers and diagrams are the imagery.** Do not add stock photos. There are exactly two optional raster slots; both have shipping CSS fallbacks, so the page is complete without them.

| Slot | Where | Generate with Higgsfield? | Fallback (ships by default) |
|---|---|---|---|
| Hero atmosphere | very faint layer behind the hero, right third | **Optional.** Only if the hero feels flat after build. Prompt: *"abstract macro, warm daylight refracting through layered translucent amber glass on off‑white, one sharp thin amber streak like a plotted signal line, high‑key minimal, generous negative space left, no text/people/logos"*, 16:9, then place at low opacity behind `z:0` layers. | The CSS grid + spotlight + signal curve (already the intended look). |
| Proof‑band texture | overlay on the drench band | **No** (CSS is better here). | The CSS engineered‑grid overlay at ~0.18 opacity. |

If you do generate the hero atmosphere, save it to `signal/assets/` and reference it locally. Keep it subtle — it must never compete with the signal line or reduce text contrast.

---

## 14. Responsive spec

Breakpoints (max‑width): **980px** (tablet) and **640px** (mobile); one **400px** guard for the hero strip.

- **≤980px:** hero grid → 1 column (form under VSL); method → single column, aside un‑sticks; booking → 1 column; services → 2 columns with the featured card spanning full width; testimonials → 1 column; footer → 2 columns.
- **≤640px:** inline nav hidden, hamburger + drawer shown; pillars → 1 column; proof band → 2×2; services → 1 column; hero proof strip → 2 columns; contact routes → stacked with top hairlines instead of left dividers; footer → 1 column; form rows → 1 column.
- **≤400px:** hero proof strip → 1 column.
- **Every breakpoint:** no horizontal overflow; test the h1/h2 copy at 360, 768, 1280, 1440 — if any heading overflows, the clamp max is too high or the copy too long. `text-wrap: balance` on headings.

---

## 15. Accessibility spec (WCAG 2.1 AA floor)

- Body ≥ 4.5:1, large/bold ≥ 3:1, placeholder text ≥ 4.5:1 (per §5 receipts).
- Controls (buttons, inputs, the hamburger, drawer close) ≥ **44px** hit target; text links ≥ **24px**.
- Visible keyboard focus everywhere: `:focus-visible { outline: 2px solid var(--accent-fill); outline-offset: 3px }`.
- Full keyboard operability: nav dropdown opens on focus‑within; drawer traps nothing but closes on Esc; form is fully labeled (`<label for>` on every field; phone segments have `aria-label`s).
- A skip link (`.skip-link` → `#home`) as the first focusable element.
- All decorative SVG/marks `aria-hidden="true"`; the star rating row has an `aria-label="5 out of 5 stars"`.
- Motion gated behind `prefers-reduced-motion` (§10).
- Semantic landmarks: one `<header>`, one `<main>`, one `<footer>`; sections use real headings in order (no skipped levels).

---

## 16. Performance spec (principle 5)

- No layout shift: counters use `tabular-nums`; images have explicit `width`/`height`; the GHL card reserves min‑height so the iframe load doesn't jump.
- Fonts: `display=swap`, only used weights, preconnect. Body uses `system-ui` (no webfont on the critical path).
- All non‑critical scripts `defer` (§12.5). No render‑blocking JS.
- SVG marks are inline (no icon‑font network cost). No large libraries — motion is hand‑rolled vanilla; do **not** pull GSAP/Framer for this build.
- `content-visibility: auto` may be applied to below‑the‑fold sections if needed, but never to anything that would break the scroll‑driven rail math.
- Target: Lighthouse Performance ≥ 90 mobile, CLS ≈ 0, no console errors from `signal-motion.js`.

---

## 17. Build order (follow exactly)

1. **Scaffold** the `signal/` tree (§4). Create empty CSS/JS files with their `@layer` wrappers.
2. **`tokens.css`** — paste §5 verbatim.
3. **`base.css`** — reset, base type (§6), links, focus, `.container`, `.section`, a11y utilities (`.visually-hidden`, `.skip-link`).
4. **`components.css`** — every primitive in §8 + the mark base + `viz-*` classes (§9). Build these before any section.
5. **`index.html` shell** — head (§12.4), the inline `js-motion` script, the VSL global, the sprite (§9), header + mobile drawer, empty `<main>`, footer, the script list (§12.5).
6. **Hero** (§11.2) including the exact form contract (§12.1), VSL facade (§12.2), and the three background layers. Get the form and VSL working first; decorate second.
7. **Proof Band** (§11.5) with odometer data attributes.
8. **Remaining sections top‑to‑bottom** (§11.3, 11.4, 11.6–11.11), composing only from existing primitives.
9. **`sections.css`** — write section composition as you build each section; keep primitives untouched.
10. **`motion.css` + `signal-motion.js`** last (§10): reveals, hero choreography + signal draw + cursor grid, method rail, proof wipe + counters, header state, mobile nav, smooth‑scroll.
11. **Parity + QA** — §18, then §19.

---

## 18. Acceptance checklist (all must pass)

**Conversion (highest priority):**
- [ ] Submitting the hero form fires validation, phone auto‑advance, spinner, and (network tab) a GA4 `generate_lead` event via `hero-form.js`.
- [ ] Both SMS checkboxes work and are optional; the form submits without them.
- [ ] The GHL iframe loads; `ghl-booking-tracker.js` logs its `postMessage`.
- [ ] The VSL facade plays `youtu.be/3ygHNgqRVJo`; the injected overlay shows a **CSS** play triangle (no missing‑icon box).
- [ ] Every `data-scroll-target` CTA smooth‑scrolls to `#calendly-container`.

**Craft / responsive / a11y:**
- [ ] 360 / 768 / 1280 / 1440 all clean; **zero horizontal overflow**; no heading overflows its container.
- [ ] Controls ≥ 44px, links ≥ 24px; visible focus on every interactive element; full keyboard pass.
- [ ] Contrast spot‑checks pass the §5 receipts (esp. muted text and CTA text = `--ink` on amber).
- [ ] Reduced‑motion: everything readable, nothing blank, counters show final values, rail static‑filled, signal drawn.
- [ ] `noindex` present; canonical → `/signal/`.
- [ ] Zero console errors from `signal-motion.js`; zero `!important`; zero `backdrop-filter`; zero icon‑font references.

**Motion:**
- [ ] Hero signal draws once on load; cursor spotlight tracks the pointer (desktop, motion on).
- [ ] Method rail fills and steps activate on scroll.
- [ ] Proof band wipes and numbers roll once on enter‑view.

---

## 19. Anti‑slop self‑audit (impeccable bans — reject and rebuild any hit)

Run this last. If any is present, the element is rewritten with different structure.

- [ ] **No icon font / no decorative concept icons** above headings (target/funnel/bolt tiles). Concepts are `.figure` diagrams, numbers, or mono tags.
- [ ] **No gradient text** (`background-clip:text`). Emphasis is weight/size/`--accent-text`.
- [ ] **No side‑stripe borders** (>1px colored left/right accent). Use full borders / top hairline / tint.
- [ ] **No glassmorphism / backdrop‑filter.**
- [ ] **No hero‑metric template** (big number + tiny label + gradient) as the hero's main idea — the hero's idea is the *drawn signal instrument*.
- [ ] **No identical icon‑card grid** repeated down the page.
- [ ] **No uppercase tracked eyebrow** above every section. `.kicker` appears ≤3× and is sentence‑case with an amber rule; mono `.data-label`s are measurement annotations, not section eyebrows.
- [ ] **Numbered markers only where there's a real sequence** (the Method's 01–05). The Services grid uses catalog *codes* (`S·01`), not sequence numbers.
- [ ] **No text overflow** at any breakpoint.
- [ ] **Category‑reflex check:** could someone guess this layout from "marketing agency" alone? If yes, the section is too generic — push it toward the instrument concept.
- [ ] **Register check:** is this clearly *not* a light‑mode copy of the dark live site, and *not* an editorial‑magazine layout? If unsure, it fails.

---

## Appendix A — Verbatim copy blocks

> Marketing copy is final. Reuse from the live site where noted; do not rewrite.

**Hero**
- Status chip: `The full revenue system`
- H1 line 1: `Where strategy, media & execution`  · line 2 (accent): `turn into revenue`
- Sub: `We help businesses attract better prospects, convert more opportunities, and follow up faster — through paid media, funnel optimization, CRM automation, and practical AI integrations.`
- VSL label: `Watch the Lumyx growth process` / sub `Press play to see how it all fits together`
- VSL microcopy: `See how Lumyx connects strategy, paid media, funnels, follow-up, and AI-enhanced execution into one growth process.`
- Social proof: `Trusted by 20+ growing businesses` · `★ 4.8 / 5 rating` · `98% retention`
- CTAs: `Get my free Growth Audit` (primary, → booking) · `Watch the VSL` (secondary)

**Hero form**
- Eyebrow: `Free Growth Audit` · H3: `Get my free Growth Audit`
- Subheading: `A clear breakdown of what is working, what is leaking revenue, and what to fix first across your marketing and follow-up.`
- Labels: `Full name` / `Email address` / `Phone number` / `Business name` / `Growth focus`
- Select options (exact, in order): `Select a focus` (disabled/selected) · `PPC Management & Google Ads` · `SEO Services` · `AI Lead Generation & Booking Agents` · `Marketing Strategy & Consulting` · `Social Media Advertising` · `Conversion Rate Optimization` · `Full-Service Growth Package`
- SMS #1 (transactional): `I consent to receive non-marketing text messages from Lumyx Consulting about appointment reminders, scheduling, and service updates. Message frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.`
- SMS #2 (marketing): `I consent to receive marketing text messages, about special offers, discounts, and service updates, from Lumyx Consulting at the phone number provided. Message frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.`
- Legal: `Consent is not a condition of purchase and is not required to submit this form. See our Privacy Policy & Terms of Service.`
- Submit: `Book my free Growth Audit` · Disclaimer: `No pressure. Just a clear breakdown of what is working, what is leaking revenue, and what to fix first.`
- Proof strip: `$2M+` Generated for clients · `4.8x` Avg. ROAS · `98%` Client retention · `20+` Success stories

**Positioning (`#about`)** — kicker `Why Lumyx is different` · h2 `Most Agencies Stop Too Early` · body `Traffic alone does not grow a business. Leads still need to be captured, qualified, followed up with, nurtured, and converted. Lumyx focuses on the full revenue path — strategy, paid media, landing pages, CRM workflows, and AI-supported execution — so more opportunities turn into real business.`
- Pillars: `Better demand` — `Campaigns built to attract the right audience, not just generate cheap clicks.` · `Cleaner conversion` — `Funnels and landing pages designed to move visitors toward action with less friction.` · `Faster follow-up` — `Automation and AI-enhanced workflows that help teams respond faster, nurture better, and miss fewer opportunities.`

**Growth Method (`#growth-method`)** — kicker `How Lumyx works` · h2 `The Lumyx Growth Method` · sub `A clear, repeatable process that connects strategy, paid media, funnels, and follow-up into one system built for revenue.`
- 01 `Diagnose` — `We audit your current marketing, website, funnel, and follow-up process to find the biggest growth constraints.`
- 02 `Build` — `We create the campaign structure, landing pages, tracking, automations, and conversion assets needed to support growth.`
- 03 `Launch` — `We execute across the channels and systems that make the most sense for your business.`
- 04 `Optimize` — `We use performance data to improve creative, targeting, funnel flow, follow-up, and conversion rates.`
- 05 `Scale` — `Once the system is working, we increase volume while protecting efficiency and lead quality.`

**Proof Band** — lead `The numbers behind the system — tracked, not estimated.` · `$2M+` Generated in client revenue · `4.8x` Average return on ad spend · `98%` Client retention rate · `20+` Businesses scaled on the system

**Booking (`#booking-section`)** — chip `Free Growth Audit` · h2 `Get a Free Growth Audit` · intro `We'll review your current marketing, website, funnel, and follow-up process to identify where leads are dropping off and where Lumyx can help create more qualified opportunities.` · list title `What your Growth Audit covers`
- 01 `Demand & paid media` — `Where your campaigns attract the right prospects, and where spend is being wasted.`
- 02 `Funnel & conversion` — `The points in your funnel and landing pages where visitors drop off.`
- 03 `Follow-up & CRM` — `How fast leads are handled and where follow-up is leaking revenue.`
- 04 `Priority fix list` — `A clear breakdown of what is working and what to fix first.`
- Guarantee: `No pressure, no obligation` — `This is a working session, not a pitch. You'll leave with a clear view of what is working, what is leaking revenue, and what to fix first.`
- Calendar card: h3 `Book my free Growth Audit` / `Select a time that works best for you.` · urgency `Limited audit slots open each week`

**Services (`#services`)** — kicker `What we do` · h2 `Built Around Outcomes, Not Deliverables` · sub `We connect strategy, paid media, funnels, follow-up, and practical AI into one revenue path. Read our latest insights on performance marketing and growth.` (link "Read our latest insights" → `/blog.html`)
- `S·01 — Paid media` (featured, "Most popular") `Paid media & campaign strategy` — `Launch and optimize campaigns designed to generate qualified opportunities, not vanity metrics.` — Google & Meta campaign management / Audience and offer strategy / Creative testing and budget pacing — CTA `Learn more about PPC` → `/ppc-management.html`
- `S·02 — Funnels` `Funnel & landing page optimization` — `Improve the path from visitor to lead with pages built around clarity, trust, and conversion.` — Landing page design and copy / Funnel flow and friction removal / Search visibility and on-page SEO (`/seo-services.html`) — CTA `Get a free Growth Audit` → booking
- `S·03 — CRM` `CRM, automation & follow-up` (→ `/ai-lead-generation.html`) — `Create cleaner systems for lead handling, nurturing, reminders, and pipeline visibility.` — CRM setup and pipeline structure / Automated nurture and reminders / Lead routing and response speed — CTA `Explore follow-up systems` → `/ai-lead-generation.html`
- `S·04 — AI` `AI services & integrations` (→ `/ai-lead-generation.html`) — `Use practical AI tools and workflows to support faster response times, better follow-up, and more efficient operations.` — AI-enhanced lead qualification / Workflow and operations automation / Tool integration across your stack — CTA `Explore AI solutions`
- `S·05 — Conversion` `Conversion strategy` — `Identify where prospects drop off and improve the messaging, offer, and user journey that moves them forward.` — Offer and messaging refinement / Drop-off analysis across the funnel / Data-driven testing and iteration — CTA `Get a free Growth Audit` → booking
- Note: h3 `How we think about results` — `Results vary by business, offer, market, and execution. Our focus is building the marketing infrastructure and optimization process needed to improve performance over time.`

**Testimonials (`#testimonials`)** — h2 `What our clients say` · sub `Real results from businesses we've helped attract, convert, and follow up with more qualified opportunities.`
- `Lumyx developed our entire marketing strategy and then executed it flawlessly. We saw a 43% drop in cost per acquisition within the first month, and our demo signups doubled. They completely exceeded our expectations.` — chip `43% cost reduction` — Alex Thompson, Head of Growth, CloudStack
- (featured) `Our website was stuck in 2010 until Lumyx stepped in. They rebuilt everything from scratch, focusing on mobile-first design. The new site loads in under 2 seconds and our bounce rate dropped by 35%.` — chip `35% bounce rate drop` — Maria Rodriguez, Director of Digital, RetailPro
- `What sets Lumyx apart is their deep understanding of conversion funnels. They completely revamped our email sequences and landing pages. Our trial-to-paid conversion jumped from 12% to 28%.` — chip `133% conversion boost` — James Chen, Founder, MarketFlow
- Avatars: `../images/testimonials/alex.svg`, `maria.svg`, `james.svg`.

**Newsletter** — h2 `Stay ahead of the competition` · sub `Proven strategies and real case studies, straight to your inbox. No spam — unsubscribe anytime.` · CTA `Get free strategy insights` → `/newsletter.html` (new tab)

**Contact (`#contact`)** — h2 `Ready to scale your business?` · sub `Get in touch and let's discuss how we can help you achieve your growth goals.`
- `TEL` `Call us` — `(248) 238-2704` (`tel:+12482382704`) — `Available Mon–Fri, 9AM–6PM EST`
- `EML` `Email us` — `Lumyxagency@gmail.com` (`mailto:`) — `We respond within 24 hours`
- `CAL` `Book a call` — `Free 30-min strategy session` (→ booking) — `Discuss your growth goals`
- Final CTA: h3 `Ready to find where revenue is leaking?` — `Book a free Growth Audit and get a clear breakdown of what is working, what is leaking revenue, and what to fix first.` — `Book my free Growth Audit` → booking

**Footer** — brand `Lumyx Consulting` — `Strategic marketing consulting and implementation. We develop winning strategies, then execute with performance ads and AI workflows to enhance your profits.` · Quick links: Services / About / Growth Method / Contact / Blog (`/blog.html`) / FAQ (`/faq.html`) / Privacy Policy / Terms of Service · Socials: Instagram `https://www.instagram.com/lumyxgrowth`, LinkedIn `https://www.linkedin.com/company/lumyx-agency` · `TEL (248) 238-2704` · `EML Lumyxagency@gmail.com` · bottom `© 2026 Lumyx Consulting. All rights reserved.` + `Book your free call →`

---

## Appendix B — 21st.dev inspiration references (rebuild, do not import)

Per the inspiration‑not‑import rule: study these patterns, then rebuild them in vanilla on §5 tokens. Never paste foreign React/Tailwind/CSS.

- **Number Ticker** (`@dev.yadhakim/number-ticker`) — odometer roll for the Proof Band / hero strip (§10.6). Rebuild as a rAF count‑up with prefix/suffix/decimals.
- **Mouse‑follow glow / interactive SVG grid** (`@uniquesonu/modern-hero-section-1`) — the cursor‑reactive hero (§10.3).
- **Animated roadmap / scroll‑path** (`@ravikatiyar162/hero-section-5`) — the scroll‑driven method rail (§10.5).
- **Asymmetric bento** (`@kokonutd/bento-grid`, `@designali-in/bento-grid`) — the Services 1+(2×2) composition (§11.7).
- **`reui` line charts** — visual grammar for the hero signal + `.figure` micro‑diagrams (§9).

To pull more references during the build, use the 21st MCP `search` (free) and view previews; only `get_component` if a specific animation technique needs decoding. Everything adopted is re‑expressed on Signal's tokens.

---

## Appendix C — What to reuse from the current site (and what not to)

**Reuse (it's plumbing, not design):** the conversion scripts (§12.5), the exact form/booking/VSL contract (§12), the head gtag block, `../Logo.png`, and the testimonial avatar SVGs. Copy the **final marketing copy** (Appendix A) — it's already tuned.

**Do NOT reuse (it's the old visual register):** the dark background, glassmorphism, floating stars/particles, gradient‑text headings, `hero-stats` styling, the icon‑card grids, the uppercase section eyebrows, or any of the live CSS. Signal's look is defined entirely by §5–§11. If you find yourself copying a class or a color out of the live stylesheet, stop — you're drifting into the reskin failure mode this whole document exists to prevent.

---

*End of guide. Build in `signal/` only. When every box in §18 and §19 passes, it's done — and it should read as an instrument someone engineered, not a template someone filled in.*
