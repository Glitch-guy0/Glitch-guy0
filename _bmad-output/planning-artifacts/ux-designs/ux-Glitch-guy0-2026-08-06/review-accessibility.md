# Accessibility Review — Glitch-guy0 (WCAG 2.1 AA)

## Verdict
PASS WITH CONDITIONS. The spines explicitly account for contrast floors, motion safety, keyboard operability, screen-reader semantics, and touch targets. Conditions are build-time verifications, not spine gaps.

## Findings

### 1. Contrast targets & color load-bearing combinations — high
- Dark mode body (`#9C9C9C` on `#000000`) measures ~5.25:1 — passes AA. Light-mode ink roles (`#404040` / `#6E6A63` on `#F4F2EE`) pass.
- Light-mode accents are deepened to hold AA when carrying text; `#7C5E00` (yellow-light) needs exact measurement for small text.
- Glitch fringes correctly marked decorative and exempt.
- *Fix:* verify load-bearing pairs with axe-core at build; deepen or demote any neon that measures below 4.5:1 (3:1 for graphical indicators). **RESOLVED in spine — Colors section now mandates build-time verification and the deepen-or-demote rule.**

### 2. Glitch & motion constraints (WCAG 2.3.1 + prefers-reduced-motion) — medium
- Bursts locked to 100–400ms with snap-back; never on body text/form fields; never page-wide; no flashing > 3×/sec.
- `prefers-reduced-motion: reduce` disables jitter/flicker/RGB.
- *Fix:* enforce via a global media query that fully unmounts/disables glitch keyframes (not merely reduces). **RESOLVED in spine — Accessibility Floor now states a global `prefers-reduced-motion: reduce` media query disables all glitch keyframes outright.**

### 3. Keyboard operability & focus management — medium
- Tab order follows funnel order; visible focus rings ≥ 2px cyan; `Esc` dismisses banner.
- *Fix:* never suppress focus indicators without a custom replacement; ensure pills, links, and cookie controls are focusable with visible rings. **RESOLVED in spine — `outline: none` only with ≥ 2px replacement.**

### 4. Screen-reader semantics & aria-live — low
- Landmarks, labelled headings, `aria-label` on icon-only links, `alt` on project visuals, `aria-hidden` on decorative scanlines/noise, errors announced.
- *Fix:* inline validation errors must be injected inside an `aria-live="assertive"` region so they announce on injection. **RESOLVED in spine — explicit `aria-live` injection requirement added.**

### 5. Touch targets & responsive sizing — low
- ≥ 44×44px specified; form fields full-width on mobile.
- *Fix:* include cookie-banner controls and mobile nav items in the 44px rule. **RESOLVED in spine.**

### 6. Color-not-only — low
- Active nav uses glow + weight; errors use text + magenta underline.
- *Fix:* never rely on chromatic shift alone. **RESOLVED in spine — "Color is never the only signal" bullet added.**
