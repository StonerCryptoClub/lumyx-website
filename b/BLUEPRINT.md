# Lumyx "B" — Architecture & Frontend Design Blueprint

> **Status:** approved design brief → this is the implementation contract.
> **Builder notes:** built per impeccable (brand register) + frontend-design skill. PRODUCT.md at repo root is the strategic anchor. Copy is reused from A verbatim — the A/B test isolates *visual register only*.
> **Rule zero: nothing outside `b/` is modified.** The live site keeps working untouched.

---

## 1. Test Hypothesis

**A** (live): dark, glass, amber-on-black.
**B** (this): light, engineered, amber-committed — "audit-room daylight" register.
**Metric:** Growth Audit bookings (GHL widget) + hero-form `generate_lead` events, tracked with identical GA4/AW/Meta instrumentation. Only the theme varies; copy, offer, form fields, and nav targets are identical.

---

## 2. Architecture (SOLID, translated to frontend)

| Principle | Application here |
|---|---|
| **S**ingle responsibility | One file = one concern. `tokens.css` defines, never styles. `components.css` styles roles, never sections. `sections.css` composes, never redefines primitives. `b-motion.js` animates, never mutates content. Root `js/*` handle conversion logic — untouched, unduplicated. |
| **O**pen/closed | Sections extend the system via tokens and component classes; they never override primitive internals. New sections = new composition, zero edits to primitives. |
| **L**iskov substitution | B is a drop-in substitute for A at the conversion interface: identical DOM contract (IDs/classes/events in §4), so every root script that runs on A runs on B unmodified. |
| **I**nterface segregation | Root scripts are loaded per-need, not wholesale: B loads only the conversion + tracking scripts (§4.3). No Contentful/portfolio-manager/case-study loaders — B renders its proof static (fewer moving parts, faster page). |
| **D**ependency inversion | Sections depend on **semantic tokens** (`--surface`, `--ink`, `--accent-text`), never raw hex. Theme = swap the token sheet; markup is theme-agnostic. |

### 2.1 File structure

```
b/
├── BLUEPRINT.md          ← this file
├── index.html            ← one page; semantic markup only, zero inline styles
├── css/
│   ├── tokens.css        ← layer 1: design tokens (§5) — the only place values live
│   ├── base.css          ← layer 2: reset, typography rules, focus states, a11y utilities
│   ├── components.css    ← layer 3: btn / card / field / badge / metric / nav primitives (§6)
│   ├── sections.css      ← layer 4: per-section composition + responsive (§7)
│   └── motion.css        ← layer 5: keyframes, reveal states, reduced-motion overrides (§8)
└── js/
    └── b-motion.js       ← IO reveals, hero choreography trigger, metric counters, header scroll state
```

Load order in `<head>`: tokens → base → components → sections → motion (cascade mirrors dependency direction; later layers may use earlier ones, never the reverse).

**CSS layering enforcement:** wrap each sheet in `@layer tokens, base, components, sections, motion;` so specificity follows architecture, not selector weight. **Zero `!important` in the entire B codebase** — the A-side lesson, enforced from day one.

### 2.2 Path strategy

`b/index.html` references shared assets **upward**: `../js/hero-form.js`, `../Logo.png`, `../images/testimonials/alex.svg`. Nav links point at the live pages (`../ppc-management.html`, `../index.html#about` → absolute `/ppc-management.html`, `/#about` preferred for deploy-safety). B-only assets live inside `b/`.

### 2.3 Deploy (inert until pushed)

Netlify build only copies root `*.html`. When ready to ship the test, append to the build command:
`&& cp -r b dist/b`
Route the A/B split via ad-campaign URLs (send test traffic to `lumyx.co/b/`) or Netlify split testing later. **Do not** edit netlify.toml until the page is approved.

---

## 3. Page Skeleton (identical narrative spine to A)

```
<header>            sticky, light, hairline-bordered
#home               hero: badge → headline → sub → [VSL col | form col] → proof strip
#about              positioning: "Most Agencies Stop Too Early" + 3 pillars
#growth-method      5-step method — vertical progress rail (scroll-driven)
[PROOF BAND]        ★ NEW composition, same data: drenched amber metrics band
#booking-section    audit value-prop + GHL calendar
#services           asymmetric 1+4: featured card dominant + 2×2 quiet grid
#testimonials       3 quotes, light cards, amber result chips
[newsletter]        single-line CTA band (compressed vs A)
#contact            3 contact routes + final CTA panel
<footer>            ink-dark footer (the page's one dark surface — full-circle close)
```

The PROOF BAND is A's `hero-stats` data promoted into a full-bleed section — B's signature move. Hero keeps a *compact* inline proof strip; the band restates it at scale mid-page where scroll momentum peaks.

---

## 4. Capability Parity Contract (the Liskov interface — DO NOT RENAME)

### 4.1 DOM IDs/classes root scripts depend on

| Hook | Consumed by |
|---|---|
| `#hero-lead-form`, `#hf-name`, `#hf-email`, `#hf-phone-area/-prefix/-line`, `#hf-business`, `#hf-service`, `#hf-sms-transactional`, `#hf-sms-marketing`, `#hf-error`, `#hf-err-*`, `#hf-submit`, `.hf-btn-text`, `.hf-btn-loading` | `js/hero-form.js`, `js/form-validation.js` |
| `#calendly-container` + GHL iframe `src="https://api.leadconnectorhq.com/widget/booking/d0prMwxo4qsyqutYVpCL"` + `https://link.msgsndr.com/js/form_embed.js` | `js/ghl-booking-tracker.js` (postMessage listener) |
| `#vsl-wrapper`, `#vsl-placeholder`, `#hero-watch-vsl`, `window.VSL_YOUTUBE_URL = 'https://youtu.be/3ygHNgqRVJo'` | hero-form.js VSL facade logic |
| `#mobile-menu-btn`, `#mobile-nav-sidebar`, `#mobile-nav-overlay`, `#mobile-nav-close`, `.mobile-nav-link` | root main-script menu handlers (B re-implements this tiny toggle in `b-motion.js` instead — zero root deps for nav) |
| `data-scroll-target="#calendly-container"` on every booking CTA | smooth-scroll sub-target pattern (re-implemented in `b-motion.js`) |

### 4.2 Head instrumentation (copy verbatim from A)

- gtag.js `G-N8CNQ6Y358` + `AW-17852608393` config block
- Meta/CSP-relevant meta tags; canonical → `https://lumyx.co/b/` + `<meta name="robots" content="noindex">` **while testing** (avoid duplicate-content SEO hit; remove if B wins and replaces A)
- Font Awesome 6 CDN (icons reused), Montserrat Google Fonts (add weight 800 for display)

### 4.3 Scripts loaded (deferred, exact set)

`../js/utm-tracking.js` · `../js/google-conversion-events.js` · `../js/ghl-booking-tracker.js` · `../js/hero-form.js` · `../js/analytics.js` · `../js/meta-pixel-events.js` · `../js/form-validation.js` · `./js/b-motion.js`
**Excluded by design:** contentful*, portfolio-manager, case-study-loader, newsletter.js (B's newsletter is a plain link), generate-placeholders, env-loader (verify hero-form.js doesn't require it — if it does, include).

---

## 5. Design Tokens (`b/css/tokens.css`)

```css
@layer tokens {
:root {
  /* ---- Surfaces: daylight ramp (warm-tinted toward amber hue, chroma ≤0.01 — NOT cream) ---- */
  --bg:            oklch(0.975 0.004 75);   /* ≈ #F8F7F4 page ground        */
  --surface:       oklch(0.995 0.002 75);   /* ≈ #FEFEFD cards              */
  --surface-sunken:oklch(0.955 0.005 75);   /* quiet alt-section ground     */
  --ink-panel:     oklch(0.205 0.012 60);   /* ≈ #1C1815 dark form card + footer */

  /* ---- Ink ramp (warm near-black, never pure gray) ---- */
  --ink:           oklch(0.235 0.012 60);   /* headings ≈ #221E1A           */
  --ink-body:      oklch(0.32 0.010 60);    /* body 9.5:1 on --bg           */
  --ink-muted:     oklch(0.45 0.008 60);    /* captions 5.2:1 — AA floor is the floor */
  --ink-on-dark:   oklch(0.97 0.004 75);    /* text on ink-panel/footer     */

  /* ---- Amber system (the inversion rule) ---- */
  --accent-fill:   #FFA500;                  /* fills/surfaces only, NEVER text on light */
  --accent-bright: #FFD700;
  --accent-text:   oklch(0.50 0.13 65);      /* ≈ #9A5B00 links/accents — 4.6:1 on --bg */
  --accent-deep:   oklch(0.42 0.12 60);      /* hover state — 6:1               */
  --accent-gradient: linear-gradient(135deg, #FFD700, #FFA500); /* primary CTA ONLY */
  --accent-wash:   oklch(0.94 0.035 80);     /* amber-tinted chip/hover ground  */

  /* ---- Drenched band ---- */
  --drench-bg:     oklch(0.78 0.155 75);     /* saturated amber field           */
  --drench-ink:    oklch(0.22 0.05 60);      /* dark-amber ink on it — 7.8:1    */

  /* ---- Structure ---- */
  --border:        oklch(0.88 0.006 75);     /* hairlines */
  --border-strong: oklch(0.78 0.008 75);
  --shadow-sm: 0 1px 2px oklch(0.2 0.01 60 / 0.06);
  --shadow-md: 0 6px 24px -8px oklch(0.2 0.01 60 / 0.14);
  --shadow-cta: 0 10px 28px -6px oklch(0.72 0.15 75 / 0.45);

  /* ---- Type ---- */
  --font-display: 'Montserrat', system-ui, sans-serif;   /* 800 only */
  --font-body: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  /* scale ratio 1.28, body fixed 1.0625rem/1.65 */
  --text-xs: 0.8125rem;  --text-sm: 0.9375rem;  --text-base: 1.0625rem;
  --text-lg: 1.36rem;    --text-xl: 1.74rem;
  --text-2xl: clamp(2.1rem, 1.4rem + 2.2vw, 3rem);        /* h2 */
  --text-hero: clamp(2.4rem, 1.6rem + 3.4vw, 4.2rem);     /* h1, ceiling < 6rem ban */

  /* ---- Space (24px rhythm base) ---- */
  --sp-1: 6px; --sp-2: 12px; --sp-3: 24px; --sp-4: 48px; --sp-5: 96px;
  --section-pad: clamp(72px, 5vw + 40px, 128px);
  --measure: 65ch;

  /* ---- Radii / motion ---- */
  --r-sm: 8px; --r-md: 14px; --r-lg: 22px; --r-pill: 999px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);             /* out-quint */
  --dur-fast: 180ms; --dur-base: 420ms; --dur-hero: 700ms;
  --rise: 20px;

  /* ---- Z scale (semantic, no 9999s) ---- */
  --z-nav: 100; --z-overlay: 200; --z-drawer: 300;
}
}
```

**Contrast receipts:** body 9.5:1 · muted 5.2:1 · accent-text 4.6:1 · drench-ink 7.8:1 · white-on-accent-fill **fails** (1.9:1) → CTA text is always `--ink` on amber, never white.

---

## 6. Component Primitives (`b/css/components.css`)

- **`.btn-primary`** — pill, `--accent-gradient` fill, `--ink` text 800, 52px min-height, `--shadow-cta`; hover: translateY(-2px) + shadow deepen (transform/shadow only). The ONLY gradient on the page.
- **`.btn-secondary`** — pill ghost: transparent, 1.5px `--border-strong`, `--ink` text; hover: border → `--accent-text`, bg → `--accent-wash`.
- **`.btn-text`** — inline arrow-link, `--accent-text`, underline on hover, 24px min hit-area.
- **`.card`** — `--surface`, 1px `--border`, `--r-lg`, `--shadow-sm`; hover (where interactive): border → amber + `--shadow-md`. **No backdrop-filter anywhere in B.**
- **`.field`** — 52px inputs, `--surface` on the dark form card ≥ inputs stay light-on-dark-card (white fields, `--ink` text); 2px focus ring `--accent-fill` + offset; error text `#FFB3A6`-family on dark card (not amber — errors must not look like brand).
- **`.metric`** — display number: Montserrat 800, tabular-nums, `--accent-text` on light / `--drench-ink` on band; label: `--text-sm` `--ink-muted`, sentence case (kills the HERO-METRIC eyebrow tell).
- **`.kicker`** — B's ONE named kicker system: short bold sentence-case lead-in with a 24px amber rule before it (`— Why Lumyx is different`). Used max 3× per page; **never** the uppercase-tracked-eyebrow pattern.
- **`.chip`** — proof pill: `--accent-wash` bg, `--accent-deep` text, icon optional.
- **Nav** — sticky white/95 + blur-none, hairline bottom border appears on `.scrolled`; links `--ink-body` → `--ink` hover with 2px amber underline offset; desktop dropdown per A's structure; mobile drawer = `--ink-panel` dark (mirror of the form card).

---

## 7. Section Composition & Content (`b/css/sections.css`)

Copy is **A's verbatim** (already in `index.html` §8345–9057 of root) unless noted. Art direction per section:

1. **Header/nav** — as §6. Logo: reuse Logo.png; if the gold mark vanishes on white, wrap in 40px `--ink-panel` rounded tile (decision at build, slot ④ Higgsfield fallback).
2. **Hero** (`#home`) — ground `--bg`, no stars/floating elements (A's dark-theme props die here). Badge → `.chip`. H1 in `--ink`, "Turn Into Revenue" in `--accent-text` (solid; weight carries it). Sub in `--ink-body` at `--measure`. Grid: VSL 1.25fr | form 1fr (A's ratio). **Form card = `--ink-panel` dark** — the inverted focal point; its internals per §4 DOM contract, white fields, gradient submit. VSL facade: poster + amber play ring. Proof strip: 4 compact `.metric`s inline under form, hairline-separated.
3. **Positioning** (`#about`) — `--surface-sunken` ground. Kicker #1. Three pillars as **borderless columns** with 40px amber-wash icon tiles, hairline verticals between (not cards — kills the identical-card tell).
4. **Growth Method** (`#growth-method`) — `--bg`. Kicker #2. Vertical layout: left sticky column (h2 + sub), right: 5 steps on a **2px amber progress rail** that fills with scroll (scroll-driven `scaleY`, `transform`-only); step numbers in `--accent-text` tabular, 44px rule-off circles. Numbers stay: this IS a real sequence (ban-compliant).
5. **★ PROOF BAND** — full-bleed `--drench-bg`, clip-path wipe entrance. Content: "$2M+ / 4.8x / 98% / 20+" as `--text-2xl`+ metrics in `--drench-ink`, one line of context each. 4-across → 2×2 mobile. This is the drenched moment — nothing else on the page may use `--drench-bg`.
6. **Booking** (`#booking-section`) — `--bg`. Two-col: value-prop left (4 features, amber-wash icon tiles, guarantee note as bordered quiet panel), **GHL calendar right in a `.card`** with branded skeleton behind the iframe (`#calendly-container` contract intact). "Limited audit slots" line in `--ink-muted` — quiet urgency, not red.
7. **Services** (`#services`) — `--surface-sunken`. Kicker #3. **Asymmetric 1+4:** featured "Paid Media" card spans left column full-height (amber 2px border, "Most Popular" chip top-right, larger type); remaining 4 in a quiet 2×2 (borderless until hover). Numbers 01–05 dropped (grid isn't a sequence — ban-compliant). All CTAs/links/copy from A.
8. **Testimonials** (`#testimonials`) — `--bg`. 3 `.card`s, quote icon small amber, result stat as `.chip` (43% / 35% / 133%), avatars + 5 stars in `--accent-fill`. Featured card: amber top hairline (full-width top border, not a side-stripe).
9. **Newsletter** — compressed to a single `--ink-panel` band: one line of copy + `.btn-primary` "Get Free Strategy Insights" → `/newsletter.html`. (A's 3-benefit grid cut: one page, one job.)
10. **Contact** (`#contact`) — `--bg`. 3 contact routes as quiet columns (phone/email/book), then final CTA panel: `--surface` card, h3 + `.btn-primary` with `data-scroll-target`.
11. **Footer** — `--ink-panel`, `--ink-on-dark` text, amber link hovers; A's exact link list + socials + legal. Dark close mirrors the form card — the page is bookended by ink.

---

## 8. Motion System (`b/css/motion.css` + `b/js/b-motion.js`)

**Doctrine:** content visible by default; JS adds `.js-motion` to `<html>`, only then do initial-states apply (no blank-section risk). Everything transform/opacity/clip-path. No bounce. `--ease-out` everywhere.

1. **Hero load choreography** (the one ambitious moment, ~900ms total): headline lines mask-rise 700ms → sub + badge fade-rise +120ms → form card rises +180ms → proof strip fades +240ms. Runs once, CSS-driven off `.js-motion.hero-ready`.
2. **Scroll reveals:** IO at threshold 0.15, `rootMargin: 0 0 -10%`; `.reveal` children get `--stagger-i` custom-prop delays (60ms steps, cap 5). Rise `--rise`, `--dur-base`.
3. **Progress rail** (method): IO progress → `scaleY` on rail fill; step activates (`--accent-text` number → full opacity) as its row crosses 60% viewport.
4. **Proof band wipe:** `clip-path: inset(0 0 100% 0)` → `inset(0)` at `--dur-hero`; metrics counter-up (rAF, 1.2s, tabular-nums = zero layout shift), once.
5. **Header:** `.scrolled` at 24px — border + shadow-sm fade in.
6. **Reduced motion:** `@media (prefers-reduced-motion: reduce)` → all reveals opacity-crossfade 150ms, counters render final values, rail static-filled.

---

## 9. Higgsfield Imagery Plan (generate AFTER layout approval — per user decision)

| Slot | Asset | Direction (prompt-ready) | Fallback |
|---|---|---|---|
| ① | Hero ambient, right-bleed behind form col | "Abstract macro of layered warm-white paper planes with a single amber light refraction, soft daylight, minimal, high-key" — 1600×1200 | pure CSS: layered `--accent-wash` radial |
| ② | Proof-band texture | "Subtle engineered grid texture, deep amber on amber, barely-there, tileable" | flat `--drench-bg` (band works without it) |
| ③ | 3 portfolio/testimonial header thumbs | consistent grade, amber-warm daylight, abstract commerce/growth objects | current SVG avatars only |
| ④ | Logo mark on light (only if Logo.png fails on white) | re-cut of existing mark, ink version | ink-panel tile wrap |

Slots are optional enhancements: the page must ship complete with all fallbacks. **Numbers are the imagery** (PRODUCT.md principle 2).

## 10. 21st.dev Integration Points (when the MCP is registered — terminal: `claude mcp add -s user --transport http 21st https://21st.dev/api/mcp --header "x-api-key: <key>"`)

Inspiration pulls, not imports: ① testimonial-card treatments, ② asymmetric feature-grid patterns for services, ③ sticky-rail step patterns for method. Anything adopted gets rebuilt on §5 tokens — no foreign CSS pasted in.

---

## 11. Build Order & QA Gate (for the implementation session)

**Order:** tokens → base → header+footer shell → hero (incl. form contract) → proof band → sections top-to-bottom → motion last → parity audit.

**QA checklist before "done":**
- [ ] Form: validation errors, phone segments, both SMS checkboxes, submit spinner → hero-form.js fires (network tab: GA4 `generate_lead`)
- [ ] GHL iframe loads; booking-tracker postMessage logs
- [ ] VSL facade plays youtu.be/3ygHNgqRVJo
- [ ] All `data-scroll-target` CTAs land on calendar
- [ ] 375 / 768 / 1280 clean; no horizontal overflow; text-wrap balance on h1-h3
- [ ] Touch: controls ≥44px, links ≥24px
- [ ] Contrast spot-checks per §5 receipts
- [ ] Reduced-motion: everything readable, nothing blank
- [ ] `noindex` present; zero console errors from b-motion.js; zero `!important`; zero backdrop-filter
- [ ] Impeccable audit re-run on b/ targeting ≥18/20
