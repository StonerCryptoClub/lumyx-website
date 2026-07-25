# v2 Mobile Refinement — handoff

Scope: improve the v2 site on phones **without touching desktop**. One edit,
shared CSS, all pages.

## What changed (already done)

Single block appended to `v2/css/sections.css`, labeled
`MOBILE REFINEMENT PASS (phones, ≤640px)`. Every rule is inside
`@media (max-width: 640px)`, so anything ≥641px is untouched.

| Fix | Before | After |
|---|---|---|
| Hero backdrop SVG (`.hero-viz`) slice-cropped into a 2200px smear | 78% of a 2800px hero | capped to a 220–320px band behind the headline |
| Section rhythm (`--section-pad` floor) | 72px min | 52–76px on phones |
| Hero sub (`.hero-sub`) | 1.36rem, ~6 lines | body size (1.0625rem) |
| Hero top stack | airy (509px) | tighter (433px) |
| Consent checkboxes | 18px native | 22px |

## The rule that keeps desktop safe

All mobile rules are `@media (max-width: 640px)`. Verified at 1280px: hero-viz
back to 78%, sub 21.76px, hero grid 2-col, meridian thread visible,
`--section-pad` = original `clamp(72px, 5vw + 40px, 128px)`. Nothing drifted.

## How to verify (cheap-model checklist)

Serve locally (`npx serve -l 5510 .`) and load `/v2/`. In DevTools console at a
375px width, confirm:

- `document.documentElement.scrollWidth === window.innerWidth` (no h-scroll)
- `.hero-viz` height ≈ 313px (not ~2200)
- All `a,button` visible → height ≥ 24px for links, ≥ 44px for real controls

Then widen to 1280px and confirm `.hero-viz` is ~78% of the hero again
(desktop unchanged).

## If extending further (optional, same guarded pattern)

Keep every new rule inside a `max-width` query. Candidate next passes:
`v2/ppc-management.html` (`.desk-*` scroll steps) and
`v2/lead-follow-up-automation.html` (`.tl-*` timeline) — both already collapse
at 980px; only touch them if a real geometry issue shows up on a 375px measure.
Do **not** add rules outside a `max-width` query.
