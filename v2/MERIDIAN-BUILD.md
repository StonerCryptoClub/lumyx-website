# LUMYX — Codename **MERIDIAN**
## The Complete Build Contract for an Immersive, Fully Bespoke Site

> **What this is.** The single, self-contained implementation contract for a brand-new Lumyx marketing site. It is written so a competent coding model can build it **flawlessly with zero design decisions of its own**. Every color, font, class name, layout ratio, motion curve, copy line, and DOM ID is specified here. Where a choice could exist, this document has already made it.
>
> **The bar.** A visitor must ask *"how was this made?"* — never *"which AI made this?"*. This is major-company quality: the kind of page an agency ships for itself precisely because its own site is its best case study.
>
> **RULE ZERO — isolation.** Create and edit files **only inside `meridian/`**. Never modify anything in the repo root, `js/`, `css/`, `b/`, `signal/`, or any existing page. Shared conversion logic is referenced **upward** (`../js/...`), never copied, never edited.
>
> **GOLDEN RULE — not a reskin.** This is not the current dark site in light mode, not the previous `b/` or `signal/` attempts, and not any agency template. If a section under construction starts reading as "generic SaaS landing page," stop, reread §2, and rebuild that section.

---

## 0 · Builder protocol (read first, follow exactly)

1. Read §1–§4 completely before writing any code. They define the *why* and the *never*.
2. Build strictly in the §17 order. Each step ends with a **gate** — verify the gate in a browser before the next step. Do not batch gates.
3. Values in §6–§10 are **verbatim**, not suggestions. Copy them exactly.
4. §12 (conversion contract) is sacred. A single renamed ID silently destroys ad tracking and bookings. Copy IDs character-for-character.
5. Appendix A copy is **final**. Do not rewrite, "improve," or summarize marketing copy. Fix only obvious typos.
6. Generate imagery **only** where §13 explicitly requires it (currently: nowhere — all imagery is code). Never insert stock photos, emoji, or icon fonts.
7. Report "done" only after every box in §18 and §19 passes. If a box fails, fix it before reporting.
8. **When uncertain, this document wins** — over your instincts, over patterns you've seen, over "best practices" that conflict with it.

---

## 1 · Strategic anchor (from PRODUCT.md — do not deviate)

**Product.** Lumyx Consulting (lumyx.co) is a performance-marketing agency selling one connected system — strategy, paid media, funnels, CRM/follow-up, and practical AI: *"the full revenue path,"* not deliverables.

**The one metric.** Booked **Growth Audit** calls (GHL booking widget + hero lead-form submissions, tracked via GA4 / Google Ads / Meta). Every element exists to earn that booking.

**Audience.** Founders and owner-operators of growing online businesses ($20k–$500k/mo) and their marketing leads. Skeptical, numbers-first, burned by agencies that ran traffic and vanished. They decide in **under two minutes** whether Lumyx are *operators* or *another template agency*.

**Voice.** A senior operator showing you the numbers — not a studio showing moodboards. Confident, specific ("43% CPA drop in month one"), never hypey. Emotional target: *"these people run tighter systems than my current agency."*

**Five principles (hold in tension the entire build):**
1. **Practice what you preach.** Instant clarity, one primary CTA, zero friction to booking.
2. **Numbers are the imagery.** Metrics get typographic star treatment; no stock photos needed.
3. **Engineered, not decorated.** Motion demonstrates precision; it never fills silence.
4. **Amber is the signature.** It marks value, action, and proof — never wallpaper.
5. **Speed is credibility.** Fast load, instant response, zero layout shift.

---

## 2 · The concept — "MERIDIAN: scroll is the engagement timeline"

### 2.1 The thesis in one sentence
The page is a **client engagement plotted in time**: a warm-paper operator's chart where one amber **meridian line** runs the full height of the page, scroll position *is* the timeline, and every section is a station on the journey from **T-0 (your business today)** to **scale**.

### 2.2 The physical scene (why this register)
Picture the desk where a senior media buyer walks a founder through their numbers at 10am: warm daylight, engineering graph paper, a plotted revenue trace annotated in a terse monospaced hand, one dark console screen glowing on the desk. Calm, precise, expensive. That scene forces every choice below: daylight paper ground, ink console punctuations, amber signal, mono telemetry labels.

### 2.3 Why it cannot be mistaken for anything else
- **Not the live site:** that is dark glass, amber-on-black, floating particles. Meridian is daylight paper, engineered grid, plotted signal. Opposite world.
- **Not a light reskin:** the organizing device (scroll = engagement timeline, with time-station markers `T-0`, `T+7`, `T+30`…) exists nowhere on the current site. Layouts, iconography, motion, and narrative structure are all new.
- **Not SaaS-template:** no icon-card grids, no gradient text, no uppercase eyebrow scaffolding, no hero-metric cliché (§19 bans all of it).
- **Not cream-editorial:** no display serifs, no drop caps, no magazine columns. This is an instrument, not a publication.

### 2.4 The signature (spend ALL boldness here)
**The Meridian.** One continuous amber line, rendered as a fixed-position vertical thread on the left rail of the page (desktop), that:
1. **Plots itself downward as you scroll** — its stroke length is bound to scroll progress (scaleY transform, 0 → 1 over the full document).
2. Carries **time-station markers**: small mono labels docked to it at each section (`T-0 · DIAGNOSIS`, `T+7 · BUILD`, `T+30 · LAUNCH`, `T+60 · OPTIMIZE`, `T+90 · SCALE`, `PROOF`, `YOUR T-0 STARTS HERE`). Each marker's dot fills amber as its section crosses mid-viewport.
3. **Terminates at the booking calendar** with a pulsing terminal node — the visual argument: *the line of every client's growth starts at this booking.*

Everything else on the page stays quiet and disciplined so the Meridian reads as THE idea.

### 2.5 Immersion devices (each rebuilt vanilla — see §10 for sources)
| Device | Where | What it does |
|---|---|---|
| Scroll-bound meridian thread | full page, left rail | the signature; §2.4 |
| Cursor-reactive instrument grid | hero | amber spotlight follows pointer across graph-paper grid; hero reads as a live console |
| Self-plotting revenue curve | hero | SVG path draws itself over ~1.5s on load; nodes pop in sequence; mono axis labels |
| Odometer metrics | proof band + hero strip | digits roll up with per-digit cascade when entering view; tabular-nums = zero layout shift |
| Typing audit-line | hero, under sub | one mono line types itself once: `> audit complete — 3 revenue leaks found. fix order: [1] follow-up [2] landing page [3] spend allocation` |
| Result-chip marquee | between testimonials & newsletter | one slow, pausable, masked marquee of mono result chips (`-43% CPA`, `4.8x ROAS`, `+133% CVR`, `98% retention`, `2s load`, `-35% bounce`) |
| Micro-diagram figures | positioning pillars | concepts drawn as real annotated charts, not icons (§8.3) |

### 2.6 Aesthetic lane check (run before every section)
Say the reference aloud: *"a senior operator's daylight audit desk — engineering graph paper meets a calm trading console, amber signal on warm paper."* If the section you just built instead reads as "SaaS landing page," "dark dashboard," "editorial magazine," or "crypto site," you are in the wrong lane. Rebuild it.

---

## 3 · Non-negotiable constraints

| # | Constraint |
|---|---|
| C1 | All new files live in `meridian/`. Nothing outside it is created or modified. |
| C2 | Conversion contract (§12) reproduced **exactly** — IDs, classes, script set, head block, GHL iframe. Liskov substitution: every root script that runs on the live site runs here unmodified. |
| C3 | **No icon fonts.** No Font Awesome, Lucide CDN, Material Icons, or emoji-as-UI. Every mark is bespoke inline SVG (§8) or pure CSS. |
| C4 | **Zero `!important`.** Specificity is architecture (`@layer`, §5). |
| C5 | **No `backdrop-filter` / glassmorphism.** That is the old site's language. |
| C6 | **No inline styles** except attributes third-party embeds require (the GHL iframe `style`). |
| C7 | **Content visible without JS.** Motion is additive: initial hidden states apply only under `html.js-motion` (set by a one-line head script). If motion JS fails, nothing is blank. |
| C8 | **`prefers-reduced-motion` honored everywhere** — every animation has a ≤150ms crossfade or instant fallback; counters render final values; meridian renders fully drawn. |
| C9 | `<meta name="robots" content="noindex">` while this is a test surface. Canonical → `https://lumyx.co/meridian/`. |
| C10 | WCAG 2.1 AA floor: ≥4.5:1 body text, ≥3:1 large text, 44px control targets, 24px link targets, visible focus, full keyboard nav. |
| C11 | Body text line length ≤ 70ch. `text-wrap: balance` on h1–h3. |
| C12 | Every scroll listener is passive + rAF-throttled. Every observer disconnects when done. Zero console errors. |

---

## 4 · Architecture (SOLID, translated to frontend)

| Principle | Application |
|---|---|
| **S**ingle responsibility | One file, one concern. `tokens.css` defines and never styles. `components.css` styles roles, never sections. `sections.css` composes, never redefines primitives. `meridian.js` animates and never mutates content. Root `js/*` own conversion logic — untouched. |
| **O**pen/closed | Sections extend via tokens + component classes; they never override primitive internals. |
| **L**iskov | Meridian is a drop-in substitute for the live page at the conversion interface (§12): identical DOM contract, so every root script runs unmodified. |
| **I**nterface segregation | Load only the conversion/tracking scripts (§12.3). No Contentful, no portfolio-manager, no newsletter.js. Proof is rendered static. |
| **D**ependency inversion | Sections consume semantic tokens (`--surface`, `--ink`, `--accent-text`), never raw hex. |

### 4.1 File tree

```
meridian/
├── MERIDIAN-BUILD.md      ← this file
├── index.html             ← one page; semantic markup; zero inline styles (C6)
├── css/
│   ├── tokens.css         ← layer 1: every raw value on the site (§6)
│   ├── base.css           ← layer 2: reset, typography, focus, a11y utilities
│   ├── components.css     ← layer 3: primitives — btn/card/field/metric/chip/tag/figure/nav
│   ├── sections.css       ← layer 4: per-section composition + responsive
│   └── motion.css         ← layer 5: keyframes, initial states (gated), reduced-motion
└── js/
    └── meridian.js        ← the ONLY new script: thread, reveals, counters, typing line,
                              marquee pause, drawer, header state, smooth scroll, spotlight
```

### 4.2 Cascade enforcement
First line of every sheet: `@layer tokens, base, components, sections, motion;` and each sheet wraps its rules in its own `@layer <name> { … }`. Later layers may use earlier ones; never the reverse. This makes specificity follow architecture, which is what allows C4 (zero `!important`).

### 4.3 Load order in `<head>`
tokens → base → components → sections → motion, then the one-line motion gate script:
```html
<script>document.documentElement.classList.add('js-motion');</script>
```

### 4.4 Path strategy
Shared assets referenced upward: `../js/hero-form.js`, `../Logo.png`, `../images/testimonials/alex.svg`. Nav links to live pages use root-absolute paths (`/ppc-management.html`) for deploy safety. All Meridian-only assets stay inside `meridian/`.

### 4.5 Deploy (inert until approved)
Netlify currently ships only root `*.html`. When (and only when) the page is approved, append `&& cp -r meridian dist/meridian` to the build command. **Do not edit `netlify.toml` during this build.**

---

## 5 · CSS layer contract

Every selector obeys its layer:

- `tokens.css` — only `:root { --… }` custom properties. Zero selectors beyond `:root`.
- `base.css` — element selectors + a11y utilities only (`body`, `h1`, `:focus-visible`, `.visually-hidden`, `.skip-link`, `.container`, `.section`).
- `components.css` — single-class primitives (`.btn-primary`, `.card`, `.field`, `.metric`, `.chip`, `.mono-tag`, `.idx-badge`, `.tick`, `.status-dot`, `.figure`, nav/drawer). A primitive never knows which section it is in.
- `sections.css` — section-scoped composition (`.hero-grid`, `.pillars`, `.method__rail`…). It positions primitives; it never re-styles their internals.
- `motion.css` — keyframes, `.js-motion` initial states, `.is-in`/`.hero-ready` transitions, reduced-motion overrides. No layout rules.

**Cheaper-model trap (avoid):** do not write two rules that fight (e.g. `.section .cta { margin: X }` in one file and `.cta { margin: Y }` in another). If you need a variant, add a modifier class in the same layer as the base class.

---

## 6 · Design tokens (`meridian/css/tokens.css` — copy verbatim)

```css
@layer tokens, base, components, sections, motion;

@layer tokens {
:root {
  /* ---- Ground: daylight paper (warm-tinted toward amber hue; NOT cream) ---- */
  --bg:             oklch(0.975 0.004 75);  /* page ground ≈ #F8F7F4 */
  --surface:        oklch(0.995 0.002 75);  /* cards ≈ #FEFEFD */
  --surface-sunken: oklch(0.955 0.005 75);  /* alt-section ground */

  /* ---- Console: the page's dark punctuation (form card, newsletter, footer ONLY) ---- */
  --console:        oklch(0.205 0.012 60);  /* ≈ #1C1815 */
  --console-2:      oklch(0.255 0.014 60);  /* raised surface on console */

  /* ---- Ink ramp (warm near-black; never pure gray) ---- */
  --ink:            oklch(0.235 0.012 60);  /* headings */
  --ink-body:       oklch(0.32 0.010 60);   /* body — 9.5:1 on --bg */
  --ink-muted:      oklch(0.45 0.008 60);   /* captions — 5.2:1 (AA floor is the floor) */
  --ink-on-dark:    oklch(0.97 0.004 75);
  --ink-on-dark-2:  oklch(0.74 0.006 75);

  /* ---- Amber system (the inversion rule: bright amber is FILL, never text-on-light) ---- */
  --accent-fill:    #FFA500;                /* fills/surfaces only */
  --accent-bright:  #FFD700;
  --accent-text:    oklch(0.50 0.13 65);    /* links/annotations — 4.6:1 on --bg */
  --accent-deep:    oklch(0.42 0.12 60);    /* hover — 6:1 */
  --accent-gradient: linear-gradient(135deg, #FFD700, #FFA500); /* PRIMARY CTA ONLY — the page's single gradient */
  --accent-wash:    oklch(0.94 0.035 80);   /* chip/hover ground */
  --accent-on-dark: oklch(0.86 0.14 80);    /* amber that reads on console */

  /* ---- Drench (used by EXACTLY one section: the proof band) ---- */
  --drench-bg:      oklch(0.78 0.155 75);
  --drench-ink:     oklch(0.22 0.05 60);    /* 7.8:1 on drench */
  --drench-line:    oklch(0.66 0.14 70);

  /* ---- Error (must NOT look like brand amber) ---- */
  --error:          oklch(0.55 0.16 25);
  --error-on-dark:  oklch(0.78 0.13 25);

  /* ---- Structure ---- */
  --border:         oklch(0.88 0.006 75);
  --border-strong:  oklch(0.78 0.008 75);
  --border-on-dark: oklch(0.32 0.010 60);
  --shadow-sm:  0 1px 2px oklch(0.2 0.01 60 / 0.06);
  --shadow-md:  0 6px 24px -8px oklch(0.2 0.01 60 / 0.14);
  --shadow-lg:  0 24px 60px -20px oklch(0.2 0.01 60 / 0.22);
  --shadow-cta: 0 10px 28px -6px oklch(0.72 0.15 75 / 0.45);

  /* ---- Type ---- */
  --font-display: 'Montserrat', system-ui, sans-serif;              /* 800 only, display */
  --font-body:    system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono:    'Spline Sans Mono', ui-monospace, Menlo, monospace; /* telemetry voice */
  --text-xs: 0.8125rem;  --text-sm: 0.9375rem;  --text-base: 1.0625rem;
  --text-lg: 1.36rem;    --text-xl: 1.74rem;
  --text-2xl: clamp(2.1rem, 1.4rem + 2.2vw, 3rem);
  --text-hero: clamp(2.4rem, 1.6rem + 3.4vw, 4.2rem);   /* ceiling < 6rem ban */
  --lh-tight: 1.08; --lh-snug: 1.25; --lh-body: 1.65;

  /* ---- Space (24px rhythm) ---- */
  --sp-1: 6px; --sp-2: 12px; --sp-3: 24px; --sp-4: 48px; --sp-5: 96px;
  --section-pad: clamp(72px, 5vw + 40px, 128px);
  --gutter: clamp(20px, 4vw, 48px);
  --measure: 65ch;
  --maxw: 1200px;
  --rail-w: 72px;            /* reserved left rail for the meridian thread (desktop) */

  /* ---- Radii / motion ---- */
  --r-sm: 8px; --r-md: 14px; --r-lg: 22px; --r-pill: 999px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);   /* out-quint. THE easing. No bounce, ever. */
  --dur-fast: 180ms; --dur-base: 420ms; --dur-slow: 700ms;
  --rise: 20px;

  /* ---- Z scale (semantic; never 999/9999) ---- */
  --z-thread: 50; --z-nav: 100; --z-overlay: 200; --z-drawer: 300;
}
}
```

**Contrast receipts (verify with a checker during §18):** body 9.5:1 · muted 5.2:1 · accent-text 4.6:1 · drench-ink 7.8:1 · **white on #FFA500 FAILS (1.9:1)** → CTA text is always `--ink` on amber, never white.

---

## 7 · Typography system

| Role | Face | Weight | Where |
|---|---|---|---|
| Display | Montserrat | **800 only** | h1–h3, metric numerals, buttons |
| Body | system-ui stack | 400/600 | paragraphs, labels, nav |
| Telemetry | Spline Sans Mono | 400/500/600 | time-stations, data labels, figure captions, chips, audit-line |

Load (preload + swap):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Spline+Sans+Mono:wght@400;500;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Spline+Sans+Mono:wght@400;500;600&display=swap"></noscript>
```

Rules:
- Display letter-spacing −0.02em (h1) / −0.015em (h2). Never tighter than −0.04em.
- Mono is **the telemetry voice only** — short labels, ≤ 60 characters, mostly uppercase with 0.04–0.08em tracking. Mono never sets body paragraphs.
- All numerals in metrics/counters: `font-variant-numeric: tabular-nums` (zero layout shift while counting).
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on paragraphs > 2 lines.
- The scale above is the only scale. Do not invent intermediate sizes.

---

## 8 · Graphic language (what replaces icons — this is where "bespoke" lives)

### 8.1 The rule
**There are no decorative icons on this site.** Concepts are communicated by four bespoke devices, all specified below. The only pictographic SVGs permitted are *functional*: hamburger, close ×, dropdown caret, play triangle, rating stars, Instagram/LinkedIn marks, arrow-right in CTAs. Each is hand-drawn inline SVG on a 24px grid, `stroke-width: 1.75`, round caps/joins, defined once in an inline `<symbol>` sprite at the top of `<body>`, referenced with `<use>`.

### 8.2 Device 1 — Mono data-labels
```
FIG.01 · DEMAND        T+30 · LAUNCH        S·03 — CRM        -43% CPA
```
`font-mono`, 0.72rem, 500, uppercase, 0.04em tracking, `--ink-muted` (or `--accent-deep` for the highlighted token). These annotate figures, sections, services, chips. They do the labeling work icons pretend to do.

### 8.3 Device 2 — Micro-diagram figures (`.figure`)
A framed schematic drawn as inline SVG on a graph-paper ground, with a captioned footer:
- Frame: 1px `--border`, `--r-md`, `--surface`; viz area has a 24px CSS graph-grid background on `--surface-sunken`; caption row below a hairline: `FIG.0n · <topic>` left, one highlighted mono token right.
- Three figures ship in §11.3 (targeting scatter → highlighted zone; funnel bars narrowing; response-time curve dropping). Draw them with the exact SVG geometry given there.
- Marks use only: `--ink-muted` dots, `--accent-fill` bars/lines (2.25 stroke), `--accent-text` frames, `--surface` node fills.

### 8.4 Device 3 — Status dot (`.status-dot`)
9px amber circle with an expanding-ring pulse (2s, out-quint, infinite; ring only — the dot never moves). Used in: hero status chip, form eyebrow, booking urgency line, meridian terminal node. Reduced motion: ring hidden, dot static.

### 8.5 Device 4 — Engineered marks
- `.idx-badge` — 46px square, 1px `--border-strong` frame, mono numeral `01`, two 5px amber corner ticks (top-left, bottom-right) drawn with pseudo-elements. Replaces feature icons.
- `.mono-tag` — bordered mono label chip (`TEL`, `EML`, `CAL`) on `--surface-sunken`.
- `.tick` — bespoke CSS checkmark: 5×10px border-right/bottom rotated 42°, `--accent-text`. Replaces list check icons.
- `.chip` — pill, `--accent-wash` bg, `--accent-deep` 600 text; result chips put the numeral in Montserrat 800.

### 8.6 Logo
Reuse `../Logo.png` at 34px height next to the wordmark "Lumyx" (Montserrat 800, `--ink`). If the gold mark is illegible on white when you first render it, wrap the img in a 40px `--console` rounded tile. Decide by looking, once, at gate G2.

---

## 9 · Motion system

### 9.1 Doctrine
Content is visible by default. `html.js-motion` (head one-liner) gates every initial hidden state, so a JS failure ships a fully readable page. Animate only `transform`, `opacity`, `clip-path`, and `stroke-dash*`. One easing: `--ease-out`. No bounce, no elastic, no scale-from-zero.

### 9.2 The choreography table (copy timings exactly)

| # | Moment | Trigger | Spec |
|---|---|---|---|
| M1 | Hero load | `hero-ready` class on `<html>`, added on 2nd rAF after DOMContentLoaded | status chip +60ms → h1 line 1 +120ms → h1 line 2 +200ms → sub +280ms → VSL col +340ms → form card +400ms → proof strip +480ms. Each: opacity 0→1, translateY 22px→0, `--dur-slow` |
| M2 | Hero curve | with M1 | SVG path `pathLength=1`, dashoffset 1→0 over 1500ms +200ms delay; area fill fades in at +900ms; 5 nodes pop (opacity) at 700/1000/1300/1550/1750ms |
| M3 | Typing audit-line | starts at M1 +1200ms, runs once | reveal one char per ~24ms via JS slicing into a `<span>`; blinking 2px caret (steps(2) 1s infinite); reduced-motion: full line rendered instantly, no caret blink |
| M4 | Meridian thread | scroll (passive + rAF) | `scaleY` of the fill = document scroll progress 0→1, `transform-origin: top`; station dots toggle `.is-active` (fill amber, label to full opacity) when their section's top crosses 60% viewport |
| M5 | Scroll reveals | IO threshold 0.15, rootMargin `0 0 -10%` | `.reveal` children rise `--rise` / fade over `--dur-base`; stagger via `--stagger-i` × 60ms, capped at 5; unobserve after firing |
| M6 | Proof band | IO threshold 0.35, once | band wipes in via `clip-path: inset(0 0 100% 0)` → `inset(0)` over `--dur-slow`; odometer counters run 1200ms rAF with out-quart ease; digits use tabular-nums |
| M7 | Marquee | always running | CSS `translateX` keyframe loop, two duplicated tracks, ~40s per cycle, `mask-image` edge fades; pauses on `:hover` and on `focus-within` |
| M8 | Header | scroll > 24px | `.scrolled`: hairline border + shadow-sm fade in over `--dur-base` |
| M9 | Hover grammar | — | buttons: translateY(-2px) + shadow deepen; cards: border→amber + shadow-md + translateY(-3px); links: 2px amber underline, 3px offset. Nothing else moves on hover |
| M10 | Cursor spotlight | pointermove on hero (rAF-throttled) | 240px amber radial (`--accent wash at 28%`) follows pointer over the hero grid; hidden on touch (`pointer: coarse`) and reduced motion |

### 9.3 Reduced motion (C8)
`@media (prefers-reduced-motion: reduce)`: all reveals become 150ms opacity crossfades with zero translate; curve + meridian render fully drawn; counters print final values; typing line prints complete; marquee `animation-play-state: paused`; status-dot ring off; spotlight off.

---

## 10 · 21st.dev inspiration map (inspiration, never import)

Patterns validated against the 21st.dev catalog. Rebuild each **vanilla, on §6 tokens** — no React, no Tailwind, no foreign CSS pasted in.

| Source pattern (21st.dev) | What we take | What we discard | Lands in |
|---|---|---|---|
| "Number Ticker" (odometer, per-digit cascade, prefix/suffix support, viewport-triggered) | per-digit roll feel, scroll-trigger-once, formatter for `$2M+ / 4.8x / 98% / 20+` | React/framer-motion; spring physics (we use rAF + out-quart) | M6, proof band + hero strip |
| "Animated Roadmap / milestone path" hero sections | milestones docked on a drawn path, activating on scroll | their dark theme, their card styling | the Meridian thread (M4) |
| "Modern Hero — SVG grid + mouse-follow glow" | cursor-reactive grid spotlight as radial-gradient bound to CSS vars | Three.js/bloom variants (banned weight) | hero (M10) |
| "Native Marquee / Testimonials with Marquee" | dual-track infinite loop, mask-image edge fades, pause on hover, reduced-motion pause | logo-cloud content (ours is mono result chips) | result-chip marquee (M7) |
| "Reading Text Reveal / scroll story" | the *idea* of narrative unlocked by scroll | word-by-word text highlighting (too gimmicky for an operator brand) | time-station activation cadence |
| "Sketchbook Reveal Card" (self-drawing SVG border) | stroke-dashoffset self-drawing technique | wobble/hand-drawn styling (wrong register) | hero curve (M2) |

---

## 11 · Section-by-section build spec

Page skeleton (semantic `<main>` order). The left `--rail-w` column is reserved on ≥1080px viewports for the meridian; content container sits to its right. Below 1080px the thread hides and stations render as inline section markers.

```
<header>          sticky daylight bar, hairline on scroll
[MERIDIAN]        fixed left thread + stations (desktop)
#home             T-0        hero: status chip · headline · sub · audit-line · [VSL | console form] · proof strip
#about            DIAGNOSIS  positioning: 3 figure-pillars
#growth-method    T+7…T+90   the method: sticky aside + 5 time-stationed steps
[PROOF]           PROOF      full-bleed amber drench: 4 odometer metrics
#booking-section  YOUR T-0   value-prop + GHL calendar (meridian terminates here)
#services         CATALOG    asymmetric 1+4 service catalog
#testimonials     RESULTS    3 quote cards
[marquee]         —          result-chip marquee band
[newsletter]      —          single console band
#contact          —          3 mono-tag routes + final CTA panel
<footer>          console close
```

### 11.1 Header
Sticky, `--surface`/95, no blur. 72px bar: brand left (logo img + wordmark), nav right: `Home · About · Services ▾ · Method · Results · [Book Audit]`. "Book Audit" is a compact `.btn-primary` (44px). Dropdown: `AI Lead Gen & Booking Agents / PPC Management / All Services` → root-absolute links. Links: `--ink-body` 600, hover `--ink` + 2px amber underline (M9). `.scrolled` per M8. Mobile (<640px): hamburger → console drawer (right, `--console`, mirror of the form card), IDs per §12.2.

### 11.2 Hero (`#home`) — the immersive opening
Ground `--bg`. Layers back-to-front: instrument grid (48px CSS graph-paper, radial-masked toward top-right) → cursor spotlight (M10) → self-plotting curve SVG (absolute, top 78% height, `viewBox 0 0 1200 500`, rising cubic from (120,388) to (1090,74), gradient area fill, 5 nodes, two mono axis labels: `t₀ · audit` at the base, `revenue ▲` at the peak) → content.

Content, centered column (max 940px):
1. `.status-chip`: `● THE FULL REVENUE SYSTEM` (status-dot + mono).
2. `<h1>` in two `.hl-line` block spans: `Where strategy, media & execution` / `turn into revenue` — line 2 in `--accent-text` (solid; weight carries it, no gradient).
3. Sub (Appendix A) at `--measure`, `--text-lg`.
4. Typing audit-line (M3): mono, `--accent-deep`, on its own row.

Then `.hero-grid` — `grid-template-columns: 1.25fr 1fr`, gap clamp(24px,3vw,48px):
- **Left (VSL column):** `#vsl-wrapper` 16:9, `--r-lg`, `--console` ground, containing `#vsl-placeholder` (amber gradient play ring 72px + two lines from Appendix A). `hero-form.js` injects the iframe + `.vsl-click-overlay` — style those hooks (§12.4). Below: microcopy line, then avatar cluster (3 SVG avatars, overlapped −10px, 2px `--surface` rings) + `Trusted by 20+ growing businesses` + two chips (`★ 4.8 / 5 rating`, `98% retention`). Then CTA row: `.btn-primary` "Get my free Growth Audit →" with `data-scroll-target="#calendly-container"` + `.btn-secondary` `#hero-watch-vsl` "▶ Watch the VSL".
- **Right (console form):** `.hero-form-card` — `--console`, `--r-lg`, `--shadow-lg`, padding clamp(22px,2.4vw,34px). Eyebrow (status-dot + "Free Growth Audit"), h3 `Get my free Growth Audit` (span in `--accent-on-dark`), subheading, then the **verbatim form** from §12.2/Appendix A: white 52px fields on the dark card, amber 2px focus ring, salmon (`--error-on-dark`) errors, gradient pill submit (`--ink` text), spinner span, disclaimer.
- Under the form: `.hero-proof-strip` — 4 compact metrics with `data-count` attrs (`$2M+ / 4.8x / 98% / 20+`), hairline-separated, counted per M6 at M1+640ms.

**Acceptance:** headline wraps clean at 375/768/1280 with zero horizontal overflow; curve draws once; spotlight tracks; form matches §12.2 IDs exactly; strip counts once.

### 11.3 Positioning (`#about`) — station `DIAGNOSIS`
Ground `--surface-sunken`. Left-aligned head (max 780px): kicker #1 `— Why Lumyx is different`, h2 `Most agencies stop too early`, lead paragraph (Appendix A). Then `.pillars` — 3 equal columns, gap `--sp-3`, each: **figure (8.3) → h3 → paragraph**. No cards, no icons.

Figure geometry (viewBox `0 0 200 112` each):
- **FIG.01 · DEMAND** — 9 scattered 2.4px `--ink-muted` dots left half; right: amber-stroked rect (128,34,52×48, r4) with faint crosshair lines and 5 amber 3px dots inside. Caption token: `TARGETED`.
- **FIG.02 · CONVERSION** — 4 centered amber bars narrowing (widths 160/118/78/44 at y 16/40/64/88, heights 16, r3, opacities .95/.78/.6/.9). Caption token: `−FRICTION`.
- **FIG.03 · FOLLOW-UP** — axis L-path (26,18→26,96→184,96), amber polyline dropping (34,36 → 68,44 → 96,80 → 134,88 → 182,90), 2 white nodes with amber stroke. Caption token: `FASTER`.

**Acceptance:** three distinct diagrams (never same shape), captions mono, columns stack at <640px.

### 11.4 Growth Method (`#growth-method`) — stations `T+7…T+90`
Ground `--bg`. Two-col `0.85fr 1.15fr`, gap clamp(32px,5vw,88px). Left sticky (top 100px): kicker #2 `— How Lumyx works`, h2 `The Lumyx Growth Method`, sub. Right: `<ol>` of 5 steps on a 2px rail (this rail is a local echo of the meridian: `--border` track, amber fill scaleY-bound to the list's own scroll progress). Each `<li>`: 44px numbered circle (mono, tabular) that activates amber per M4's 60% rule + mono time-station (`T+7 · BUILD` etc. — mapping in Appendix A) + h3 + paragraph. Numbers stay: this IS a real sequence.

**Acceptance:** rail fills smoothly with scroll (no jumps); steps activate top-to-bottom; sticky aside never overlaps footer of section; stacks cleanly <980px (aside becomes static header).

### 11.5 ★ Proof band — station `PROOF` (the ONE drenched moment)
Full-bleed `--drench-bg` + faint 44px grid overlay (`--drench-line` at 18% opacity). Lead line (display, `--drench-ink`): `The numbers behind the system — tracked, not estimated.` Then 4 metrics in a row (2×2 <640px), numerals `clamp(2.4rem, 1.6rem + 2.6vw, 3.6rem)` Montserrat 800 `--drench-ink`, odometer per M6, labels sentence-case below. Hairline `--drench-line` separators between columns. **Nothing else on the page may use `--drench-bg`.**

**Acceptance:** wipe fires once at 35% visibility; counters land exactly on `$2M+ / 4.8x / 98% / 20+`; contrast of ink-on-drench ≥ 7:1.

### 11.6 Booking (`#booking-section`) — station `YOUR T-0 STARTS HERE`
Ground `--bg`. Two-col `1fr 1.05fr`. Left: status-chip `● FREE GROWTH AUDIT`, h2, lead, then "What your Growth Audit covers" as 4 rows: `.idx-badge` (01–04) + bold title + desc (Appendix A). Below: quiet bordered guarantee panel (no icon): bold lead `No pressure, no obligation` + sentence. Right: `.card` containing calendar header (h3 + line), `.ghl-shell` with spinner skeleton behind the **verbatim GHL embed** (§12.2), then urgency line: status-dot + `Limited audit slots open each week` in `--ink-muted`. The meridian's terminal node docks beside this section with a slow pulse.

**Acceptance:** iframe loads and is ≥620px tall; skeleton visible before load; every `data-scroll-target` CTA on the page lands here with ~88px offset.

### 11.7 Services (`#services`) — station `CATALOG`
Ground `--surface-sunken`. Kicker #3 `— What we do`, h2, sub (link to `/blog.html` styled `--accent-text`). Asymmetric grid: 3 columns; featured card spans column 1 across both rows; other 4 fill the 2×2. Featured (`Paid media & campaign strategy`): `--surface`, 2px `--accent-fill` border, meta row `S·01 — PAID MEDIA` + chip `Most popular`, larger type. Quiet 4: borderless/transparent until hover (then `--surface` + border + shadow-md + rise). Every card: meta row (mono code `S·0n — <domain>` + mono context tag) above a hairline, h3, desc, 3 `.tick` features, `.btn-text` CTA with arrow. Copy + links verbatim from Appendix A. Below grid, past a hairline: "How we think about results" note.

**Acceptance:** featured visually dominant; no numbered-eyebrow feel (codes live inside cards as catalog metadata); 2-col then 1-col collapse; all 5 CTAs correct hrefs.

### 11.8 Testimonials (`#testimonials`) — station `RESULTS`
Ground `--bg`. Head (max 720px) then 3 `.card`s: oversized typographic `"` (Montserrat 800, 3.4rem, `--accent-fill`, cropped line-height — no icon), quote, result chip (`43% cost reduction` / `35% bounce rate drop` / `133% conversion boost` with the numeral 800), author row past a hairline (SVG avatar 46px + name + role + 5 amber star SVGs right-aligned). Featured (middle) card: 3px amber **top** hairline full-width (never a side-stripe).

### 11.9 Result-chip marquee (no heading)
A quiet band on `--bg`, one dual-track marquee (M7) of mono chips: `-43% CPA · 4.8x ROAS · +133% CVR · 98% RETENTION · <2s LOAD · -35% BOUNCE · $2M+ GENERATED · 20+ SYSTEMS` — each `.mono-tag` sized up (14px), amber numeral tokens. 40s loop, edge-masked, pause on hover/focus.

### 11.10 Newsletter band
Single `--console` band (padding-block clamp(40px,4vw,64px)): left — h2 `Stay ahead of the competition` (`--ink-on-dark`) + one line sub; right — `.btn-primary` `Get free strategy insights →` → `/newsletter.html` (target _blank noopener). Nothing else. One page, one job.

### 11.11 Contact (`#contact`)
Ground `--bg`. Head, then 3 hairline-separated columns (no cards): `.mono-tag` (`TEL`/`EML`/`CAL`) → h3 → value link (tel:/mailto:/scroll) → meta line. Then final CTA `.card` centered: h3 `Ready to find where revenue is leaking?`, sentence, `.btn-primary` with `data-scroll-target="#calendly-container"`.

### 11.12 Footer — console close
`--console`, `--ink-on-dark-2` text. 3 columns: brand blurb / quick links (Services, About, Growth Method, Contact, Blog, FAQ, Privacy, Terms) / connect (2 social SVG marks in 42px bordered circles + `TEL`/`EML` tagged contact lines). Bottom bar past hairline: © line + `Book your free call →` (amber, `data-scroll-target`). The console bookends the page: form card at the top, footer at the bottom.

---

## 12 · Conversion contract (SACRED — copy character-for-character)

### 12.1 Head instrumentation
Copy the gtag block **from the live root `index.html` at build time** so the current ad IDs are used (the Google Ads ID was recently updated in the working tree — mirror whatever the live file has):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N8CNQ6Y358"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-N8CNQ6Y358');
  gtag('config', '<COPY-CURRENT-AW-ID-FROM-ROOT-INDEX.HTML>');
</script>
```
Plus: `<meta name="robots" content="noindex">` · `<link rel="canonical" href="https://lumyx.co/meridian/">` · viewport · charset · title/description (Appendix A) · font block (§7) · CSS layer links (§4.3) · motion gate one-liner · `<script>window.VSL_YOUTUBE_URL = 'https://youtu.be/3ygHNgqRVJo';</script>`.

### 12.2 DOM IDs root scripts depend on (NEVER rename)

| Hook | Consumer |
|---|---|
| `#hero-lead-form`, `#hf-name`, `#hf-email`, `#hf-phone-area`, `#hf-phone-prefix`, `#hf-phone-line`, `#hf-phone-group`, `#hf-business`, `#hf-service`, `#hf-sms-transactional`, `#hf-sms-marketing`, `#hf-error`, `#hf-err-name/-email/-phone/-business/-service`, `#hf-submit`, `.hf-btn-text`, `.hf-btn-loading`, `.hf-field-error` (+`.visible`), `.hf-invalid` | `../js/hero-form.js`, `../js/form-validation.js` |
| `#hf-service` `<option>` values — the 7 exact strings in Appendix A | GHL payload mapping |
| `#calendly-container` wrapping `<iframe src="https://api.leadconnectorhq.com/widget/booking/d0prMwxo4qsyqutYVpCL" style="width:100%;border:none;" scrolling="no" id="d0prMwxo4qsyqutYVpCL_1781470766128" title="Book your free growth audit">` + `<script src="https://link.msgsndr.com/js/form_embed.js">` | `../js/ghl-booking-tracker.js` (postMessage) + hero-form.js **prefill targets the iframe id exactly** |
| `#vsl-wrapper`, `#vsl-placeholder`, `#hero-watch-vsl`, `window.VSL_YOUTUBE_URL` | hero-form.js VSL facade |
| `#mobile-menu-btn`, `#mobile-nav-sidebar`, `#mobile-nav-overlay`, `#mobile-nav-close`, `.mobile-nav-link` | implemented in `meridian.js` (zero root deps for nav) |
| `data-scroll-target="#calendly-container"` on every booking CTA | smooth-scroll sub-target (in `meridian.js`) |

### 12.3 Script set (deferred, end of `<body>`, exact and complete)
```html
<script defer src="../js/utm-tracking.js"></script>
<script defer src="../js/google-conversion-events.js"></script>
<script defer src="../js/ghl-booking-tracker.js"></script>
<script defer src="../js/hero-form.js"></script>
<script defer src="../js/analytics.js"></script>
<script defer src="../js/meta-pixel-events.js"></script>
<script defer src="../js/form-validation.js"></script>
<script defer src="./js/meridian.js"></script>
```
**Excluded by design:** contentful*, portfolio-manager, case-study-loader, newsletter.js, generate-placeholders, env-loader, main-script menu handlers.

### 12.4 Hooks hero-form.js injects (style them, don't create them)
`.vsl-click-overlay` (absolute inset overlay, dark 35% scrim, `.hiding` fades), `.vsl-overlay-play` (66px amber gradient circle), `.vsl-overlay-label`, `body.vsl-active`. Submit states: `.hf-submit.loading` shows `.hf-btn-loading` / hides text; `.hf-submit.success` turns green-ish (`oklch(0.7 0.15 145)`) with "Saved! Continue below".

---

## 13 · Imagery policy (Higgsfield: only when needed)

**Current requirement: zero generated images.** The bespoke SVG/CSS system IS the imagery (Principle 2: numbers are the imagery). The page must ship complete and beautiful with no raster art beyond `../Logo.png` and the 3 existing testimonial SVG avatars.

Optional enhancement slots — generate **only after the page passes §18 and only if the user asks**:

| Slot | Asset | Higgsfield prompt (prompt-ready) | Fallback (ships by default) |
|---|---|---|---|
| ① | Hero ambient, masked right-bleed | "Abstract macro of warm daylight refracting through layered translucent amber glass planes on an off-white desk, one thin sharp amber light streak crossing like a plotted chart line, high-key, minimal, engineered calm, empty left third, no text, no people" 16:9 | CSS grid + spotlight + curve (already built) |
| ② | Proof-band texture | "Subtle engineered grid texture, deep amber on amber, barely there, tileable" | CSS grid overlay (already built) |

---

## 14 · Responsive matrix

| Breakpoint | Changes |
|---|---|
| ≥1080px | meridian thread + stations visible in left `--rail-w` rail; all multi-col layouts active |
| 980–1080px | thread hides (stations render as inline mono markers above each section head); layouts unchanged |
| 640–980px | hero-grid → 1 col (VSL above form); method → 1 col, aside static; booking → 1 col (value-prop above calendar); services → 2 col (featured full-width first); testimonials → 1 col; footer → 2 col |
| <640px | nav → drawer; pillars stack; proof band 2×2 with vertical hairlines on even items; services 1 col; contact routes stack with horizontal hairlines; footer 1 col; form name/email rows stack; proof strip 2×2 |
| <400px | proof strip 1 col |

Hard rule at every breakpoint: **zero horizontal overflow** (`document.documentElement.scrollWidth <= window.innerWidth`). Test 375, 768, 1280 explicitly.

---

## 15 · Accessibility contract
- Skip-link to `#home` as first body element (visible on focus).
- One `<h1>`. Sections use `<section>` + h2; testimonials/services are `<article>`.
- `:focus-visible`: 2px `--accent-fill` outline, 3px offset, on every interactive element — including inside the dark form card and footer.
- Form: every input labeled (`<label for>` or aria-label on phone segments); errors are text + color (never color alone); `#hf-error` has `role="alert"`.
- Decorative SVG: `aria-hidden="true"`. Figures that carry meaning: `role="img"` + `aria-label` describing the chart.
- Drawer: `aria-expanded` on the button, `aria-controls`, Esc closes, focus returns to the trigger, body scroll locked while open.
- Star ratings: wrapper `aria-label="5 out of 5 stars"`, star SVGs hidden.
- Touch: all controls ≥44px, links ≥24px hit area.

---

## 16 · Performance budget
- No JS libraries. `meridian.js` ≤ 12KB unminified. CSS total ≤ 48KB unminified.
- Two font families, four total weights, preloaded with swap.
- The GHL iframe and YouTube embed are the only third-party payloads; YouTube loads only after user intent (hero-form.js facade already handles this).
- Zero layout shift: aspect-ratio on VSL, min-height 620px on the calendar shell, tabular-nums on all counters.
- All observers/listeners passive + rAF-throttled (C12). Lighthouse mobile ≥90 perf, 100 a11y target.

---

## 17 · Build order & gates

| Step | Build | Gate (verify in browser before continuing) |
|---|---|---|
| 1 | `tokens.css` + `base.css` + skeleton `index.html` (head, layers, gate script, empty sections) | G1: page loads, warm-paper bg, fonts render, zero console errors |
| 2 | Header + footer + drawer + `components.css` primitives | G2: nav sticky + scrolled state works; drawer opens/closes/Esc; logo legible (decide §8.6); footer console renders |
| 3 | Hero complete (grid, spotlight, curve, form verbatim, VSL, strip) | G3: all §12.2 hero IDs present (`document.querySelectorAll` check); choreography M1–M3 runs once; no overflow at 375 |
| 4 | Meridian thread + stations | G4: thread fills 0→1 across full scroll; stations activate in order; hidden <1080px |
| 5 | Positioning + figures | G5: three distinct diagrams render; captions mono; stacks at 640 |
| 6 | Method rail | G6: rail fills with scroll; steps activate; sticky aside behaves |
| 7 | Proof band | G7: wipe once; odometers land exact; drench used nowhere else |
| 8 | Booking + GHL embed | G8: iframe loads; skeleton behind; every `data-scroll-target` CTA lands on calendar |
| 9 | Services + testimonials + marquee + newsletter + contact | G9: featured card dominant; marquee loops seamlessly + pauses on hover; all links correct |
| 10 | `motion.css` polish + reduced-motion pass | G10: with reduced motion emulated, everything readable, nothing blank, marquee paused |
| 11 | Full §18 + §19 audit | G11: every box checked |

---

## 18 · Acceptance checklist (all must pass)
- [ ] Form: per-field errors show/clear, phone segments auto-advance, both SMS checkboxes optional, submit shows spinner → success state; network tab shows GHL POST and GA4 `generate_lead` on success
- [ ] GHL iframe loads; booking-tracker logs postMessage events; iframe id matches §12.2 exactly (prefill depends on it)
- [ ] VSL facade plays `youtu.be/3ygHNgqRVJo` via click and via `#hero-watch-vsl`
- [ ] Every `data-scroll-target` CTA lands on the calendar with offset
- [ ] 375 / 768 / 1280: no horizontal overflow, headline wraps clean, touch targets pass
- [ ] Contrast spot-checks per §6 receipts (body, muted, accent-text, drench, CTA text)
- [ ] Reduced motion: full content, no blank regions, counters final, marquee paused
- [ ] `noindex` present; canonical correct; zero console errors; zero 404s in network tab
- [ ] Zero `!important`; zero `backdrop-filter`; zero icon-font requests; zero inline styles beyond the GHL iframe
- [ ] Meridian: draws with scroll, stations activate in order, terminal node pulses at booking
- [ ] Lighthouse: perf ≥90 mobile, a11y = 100

## 19 · Anti-slop audit (match-and-refuse; rebuild any hit)
- [ ] No side-stripe accent borders (colored `border-left/right` >1px on cards/callouts)
- [ ] No gradient text (`background-clip: text`) anywhere
- [ ] No glassmorphism / decorative blur
- [ ] No hero-metric template (big number + small label + gradient accent as the hero)
- [ ] No identical icon-card grids; no large rounded icon tiles above headings
- [ ] No uppercase-tracked eyebrow above every section (the kicker appears exactly 3×, sentence case, with its 24px amber rule; time-stations are data, not eyebrows)
- [ ] Numbered markers exist ONLY where content is a true sequence (method steps, audit coverage list, catalog codes as metadata)
- [ ] No cream/serif editorial drift; no dark-SaaS drift; the lane check (§2.6) passes for every section
- [ ] Final question, honestly answered: *would anyone guess a template or an AI made this?* If even "maybe," identify the tell and rebuild it.

---

## Appendix A · Copy deck (final — do not rewrite)

**Title tag:** `Lumyx | The Full Revenue Path — Performance Marketing That Follows Through`
**Meta description:** `Lumyx connects strategy, paid media, funnels, CRM follow-up, and practical AI into one revenue system. Book a free Growth Audit.`

**Hero.** Status chip: `THE FULL REVENUE SYSTEM` · H1: `Where strategy, media & execution` / `turn into revenue` · Sub: `We help businesses attract better prospects, convert more opportunities, and follow up faster — through paid media, funnel optimization, CRM automation, and practical AI integrations.` · Audit-line (types): `> audit complete — 3 revenue leaks found. fix order: [1] follow-up [2] landing page [3] spend allocation` · VSL placeholder: `Watch the Lumyx growth process` / `Press play to see how it all fits together` · VSL microcopy: `See how Lumyx connects strategy, paid media, funnels, follow-up, and AI-enhanced execution into one growth process.` · Proof text: `Trusted by 20+ growing businesses` · Chips: `★ 4.8 / 5 rating` / `98% retention` · CTAs: `Get my free Growth Audit` / `Watch the VSL`.

**Form.** Eyebrow `Free Growth Audit` · H3 `Get my free Growth Audit` · Sub: `A clear breakdown of what is working, what is leaking revenue, and what to fix first across your marketing and follow-up.` · Labels: Full name / Email address / Phone number / Business name / Growth focus · Placeholders: `Jane Smith` / `jane@company.com` / `###`,`###`,`####` / `Company name` / `Select a focus` · **Service options (values verbatim):** `PPC Management & Google Ads` · `SEO Services` · `AI Lead Generation & Booking Agents` · `Marketing Strategy & Consulting` · `Social Media Advertising` · `Conversion Rate Optimization` · `Full-Service Growth Package` · Field errors: `Please enter your full name.` / `Please enter a valid email address.` / `Please enter a valid phone number.` / `Please enter your business name.` / `Please select a service.` · SMS consent ×2 + legal line: copy the three blocks verbatim from root `index.html` (`#hf-sms-transactional` / `#hf-sms-marketing` labels + "Consent is not a condition of purchase…" with Privacy/Terms links) · Submit: `Book my free Growth Audit →` / loading `Sending…` · Disclaimer: `No pressure. Just a clear breakdown of what is working, what is leaking revenue, and what to fix first.`

**Metrics (hero strip + proof band):** `$2M+ Generated for clients` · `4.8x Avg. ROAS` · `98% Client retention` · `20+ Success stories`. Proof-band labels (long form): `Generated in client revenue` / `Average return on ad spend` / `Client retention rate` / `Businesses scaled on the system`. Proof lead: `The numbers behind the system — tracked, not estimated.`

**Positioning.** Kicker: `Why Lumyx is different` · H2: `Most agencies stop too early` · Lead: `Traffic alone does not grow a business. Leads still need to be captured, qualified, followed up with, nurtured, and converted. Lumyx focuses on the full revenue path — strategy, paid media, landing pages, CRM workflows, and AI-supported execution — so more opportunities turn into real business.` · Pillars: `Better demand` — `Campaigns built to attract the right audience, not just generate cheap clicks.` / `Cleaner conversion` — `Funnels and landing pages designed to move visitors toward action with less friction.` / `Faster follow-up` — `Automation and AI-enhanced workflows that help teams respond faster, nurture better, and miss fewer opportunities.`

**Method.** Kicker: `How Lumyx works` · H2: `The Lumyx Growth Method` · Sub: `A clear, repeatable process that connects strategy, paid media, funnels, and follow-up into one system built for revenue.` · Steps (station · title · body):
1. `T-0 · DIAGNOSE` — `We audit your current marketing, website, funnel, and follow-up process to find the biggest growth constraints.`
2. `T+7 · BUILD` — `We create the campaign structure, landing pages, tracking, automations, and conversion assets needed to support growth.`
3. `T+30 · LAUNCH` — `We execute across the channels and systems that make the most sense for your business.`
4. `T+60 · OPTIMIZE` — `We use performance data to improve creative, targeting, funnel flow, follow-up, and conversion rates.`
5. `T+90 · SCALE` — `Once the system is working, we increase volume while protecting efficiency and lead quality.`

**Booking.** H2: `Get a free Growth Audit` · Lead: `We'll review your current marketing, website, funnel, and follow-up process to identify where leads are dropping off and where Lumyx can help create more qualified opportunities.` · Cover title: `What your Growth Audit covers` · Items: `01 Demand & paid media` — `Where your campaigns attract the right prospects, and where spend is being wasted.` / `02 Funnel & conversion` — `The points in your funnel and landing pages where visitors drop off.` / `03 Follow-up & CRM` — `How fast leads are handled and where follow-up is leaking revenue.` / `04 Priority fix list` — `A clear breakdown of what is working and what to fix first.` · Guarantee: `No pressure, no obligation` — `This is a working session, not a pitch. You'll leave with a clear view of what is working, what is leaking revenue, and what to fix first.` · Calendar head: `Book my free Growth Audit` / `Select a time that works best for you.` · Urgency: `Limited audit slots open each week`.

**Services.** Kicker: `What we do` · H2: `Built around outcomes, not deliverables` · Sub: `We connect strategy, paid media, funnels, follow-up, and practical AI into one revenue path. Read our latest insights on performance marketing and growth.` (link "Read our latest insights" → `/blog.html`) · Cards (code · title[link] · desc · 3 features · CTA[href]):
- `S·01 — PAID MEDIA` · `Paid media & campaign strategy` [/ppc-management.html] · `Launch and optimize campaigns designed to generate qualified opportunities, not vanity metrics.` · Google & Meta campaign management / Audience and offer strategy / Creative testing and budget pacing · `Learn more about PPC` [/ppc-management.html] · chip `Most popular`
- `S·02 — FUNNELS` · `Funnel & landing page optimization` · `Improve the path from visitor to lead with pages built around clarity, trust, and conversion.` · Landing page design and copy / Funnel flow and friction removal / Search visibility and on-page SEO [link → /seo-services.html] · `Get a free Growth Audit` [#booking-section + data-scroll-target]
- `S·03 — CRM` · `CRM, automation & follow-up` [/ai-lead-generation.html] · `Create cleaner systems for lead handling, nurturing, reminders, and pipeline visibility.` · CRM setup and pipeline structure / Automated nurture and reminders / Lead routing and response speed · `Explore follow-up systems` [/ai-lead-generation.html]
- `S·04 — AI` · `AI services & integrations` [/ai-lead-generation.html] · `Use practical AI tools and workflows to support faster response times, better follow-up, and more efficient operations.` · AI-enhanced lead qualification / Workflow and operations automation / Tool integration across your stack · `Explore AI solutions` [/ai-lead-generation.html]
- `S·05 — CONVERSION` · `Conversion strategy` · `Identify where prospects drop off and improve the messaging, offer, and user journey that moves them forward.` · Offer and messaging refinement / Drop-off analysis across the funnel / Data-driven testing and iteration · `Get a free Growth Audit` [#booking-section + data-scroll-target]
- Note: `How we think about results` — `Results vary by business, offer, market, and execution. Our focus is building the marketing infrastructure and optimization process needed to improve performance over time.`

**Testimonials.** H2: `What our clients say` · Sub: `Real results from businesses we've helped attract, convert, and follow up with more qualified opportunities.` · Quotes verbatim from root index.html: Alex Thompson (Head of Growth, CloudStack; chip `43% cost reduction`; avatar `../images/testimonials/alex.svg`), Maria Rodriguez (Director of Digital, RetailPro; chip `35% bounce rate drop`; featured; `maria.svg`), James Chen (Founder, MarketFlow; chip `133% conversion boost`; `james.svg`).

**Marquee chips:** `-43% CPA` · `4.8x ROAS` · `+133% CVR` · `98% RETENTION` · `<2s LOAD` · `-35% BOUNCE` · `$2M+ GENERATED` · `20+ SYSTEMS`

**Newsletter.** H2: `Stay ahead of the competition` · Sub: `Proven strategies and real case studies, straight to your inbox. No spam — unsubscribe anytime.` · CTA: `Get free strategy insights` → `/newsletter.html`.

**Contact.** H2: `Ready to scale your business?` · Sub: `Get in touch and let's discuss how we can help you achieve your growth goals.` · Routes: `TEL` `Call us` `(248) 238-2704` `Available Mon–Fri, 9AM–6PM EST` / `EML` `Email us` `Lumyxagency@gmail.com` `We respond within 24 hours` / `CAL` `Book a call` `Free 30-min strategy session` `Discuss your growth goals` · Final panel: `Ready to find where revenue is leaking?` — `Book a free Growth Audit and get a clear breakdown of what is working, what is leaking revenue, and what to fix first.` — CTA `Book my free Growth Audit`.

**Footer.** Blurb: `Strategic marketing consulting and implementation. We develop winning strategies, then execute with performance ads and AI workflows to enhance your profits.` · Quick links: Services, About, Growth Method, Contact, Blog (/blog.html), FAQ (/faq.html), Privacy Policy (/privacy-policy.html), Terms of Service (/terms-of-service.html) · Socials: instagram.com/lumyxgrowth, linkedin.com/company/lumyx-agency · © `2026 Lumyx Consulting. All rights reserved.` · `Ready to scale? Book your free call →`

---

## Appendix B · Known cheaper-model failure modes (pre-emptied)

1. **Gating content on animation.** Never set `opacity: 0` outside a `.js-motion` scope. The gate class comes from the head one-liner, initial states live only in `motion.css`.
2. **IO that never fires.** `rootMargin` percentages apply to the root, not the target; use the exact M5 config. Always `unobserve` after reveal.
3. **Specificity fights.** All five sheets declare the same `@layer` order line first. Never style a primitive from `sections.css`.
4. **The GHL iframe id.** `hero-form.js` prefills by `document.getElementById('d0prMwxo4qsyqutYVpCL_1781470766128')`. Change one character and prefill silently dies.
5. **Counter layout shift.** Set `font-variant-numeric: tabular-nums` on the numeral element itself, not the parent.
6. **Marquee seams.** Duplicate the track element exactly once and translate the wrapper −50%; any other math visibly jumps at the loop point.
7. **Sticky-in-grid.** The sticky aside needs `align-items: start` (or `align-self: start`) on the grid, else sticky silently fails.
8. **Curve draw.** Set `pathLength="1"` on the SVG path and animate `stroke-dashoffset` 1→0 with `stroke-dasharray: 1` — avoids measuring path length in JS.
9. **Meridian jitter.** Bind to `scaleY` transform of a fill inside a fixed track — never animate `height`. Throttle with one rAF per scroll frame.
10. **Testing only at desktop.** Gate G3/G5/G9 explicitly include a 375px check. `scrollWidth <= innerWidth` is the assertion.

*End of contract. Build it so they ask how, not which.*
