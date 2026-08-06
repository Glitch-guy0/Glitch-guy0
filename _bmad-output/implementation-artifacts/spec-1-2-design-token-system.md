---
title: 'Story 1.2: Design token system'
type: 'feature'
created: '2026-08-06'
status: 'done'
baseline_revision: '10fda88a87da266eaa640b88364e77fba76e58c7'
final_revision: '4b0992a60e0890eb7f76a0fd8d409e8becc3e84f'
review_loop_iteration: 0
followup_review_recommended: true
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** The scaffolded project hardcodes default Tailwind palette utilities and CSS values (`bg-black`, `text-neutral-400`, `--background`/`--foreground` in `globals.css`), so components can drift from DESIGN.md's monochrome palette, type ramp, spacing, radii, and breakpoints.

**Approach:** Declare the full design token layer once in a Tailwind v4 `@theme` block in `src/styles/globals.css`, with light mode re-binding the same token names, and point the layout/page placeholder at token utilities.

## Boundaries & Constraints

**Always:** One token name per value (AD-1). Token layer lives in `src/styles/globals.css` (AD-1). Dark mode is default; light mode re-binds the same names under `prefers-color-scheme: light` — no `-light` second name set, no chromatic color.

**Block If:** A decision about the light/dark switching mechanism beyond `prefers-color-scheme` re-binding is required (e.g. a manual theme toggle UI).

**Never:** Raw hex/rgba/px literals in component files (`src/app/**`). New colors beyond DESIGN.md's monochrome set. Loading fonts (Story 1.3 scope). Arbitrary-value utilities (`text-[...]`, `bg-[...]`) where a token exists.

</intent-contract>

## Code Map

- `src/styles/globals.css` -- NEW: token layer (`@theme`: colors, type roles, spacing, radii, breakpoints) + `@layer base` body defaults with light-mode re-binding. Supersedes `src/app/globals.css`.
- `src/app/globals.css` -- DELETED: replaced by `src/styles/globals.css` per AD-1's prescribed location.
- `src/app/layout.tsx` -- Update CSS import to `@/styles/globals.css`; body/selection classes use token utilities.
- `src/app/page.tsx` -- Swap default-palette placeholder utilities for token utilities.
- `postcss.config.mjs` -- NEW (tooling deviation): wire `@tailwindcss/postcss`; the Story 1.1 scaffold never shipped a PostCSS config, so Tailwind was never processing CSS and the token layer would be inert.
- `eslint.config.mjs` -- NEW (tooling deviation): Next 16 flat ESLint config; the scaffold's `next lint` script was removed in Next 16 and failed. `package.json` `lint` script changed from `next lint` to `eslint`.
- `.env.example` -- UNCHANGED (Story 1.1 scope, not touched).

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/globals.css` -- Create `@theme` token layer + `@layer base` (body defaults, light re-binding) -- AD-1 single source of visual truth
- [x] `src/app/globals.css` -- Delete superseded file -- one global CSS entry point
- [x] `src/app/layout.tsx` -- Import `@/styles/globals.css`; use token utilities on body/selection -- wire the token layer, purge default-palette classes
- [x] `src/app/page.tsx` -- Replace `text-neutral-400`/`text-3xl` with token utilities -- placeholder consumes tokens, no default-palette drift

**Acceptance Criteria:**
- Given DESIGN.md's token block, when the Tailwind v4 `@theme` in `src/styles/globals.css` is populated, then every color, type role, spacing, radius, and breakpoint has exactly one token name (AD-1).
- Given the same token names, when `prefers-color-scheme: light` applies, then the `*-light` values from DESIGN.md re-bind those names to their light values — no `-light` second name set, no chromatic color.
- Given the build, when running `npm run build` and `npm run lint`, then both exit 0 and the compiled CSS emits the token variables plus the light re-binding block.
- Given a code review, when scanning `src/app/**` component files, then zero raw hex/rgba/px literals appear (token utilities or `var(--token)` only).

## Spec Change Log

### 2026-08-06 — implementation additions (pre-review)
- **Finding:** `npm run lint` could not pass — the Story 1.1 scaffold shipped a `lint` script of `next lint`, which Next.js 16 removed (errors: `Invalid project directory provided`), and no eslint config existed. Story 1.1's lint AC was never actually satisfiable.
- **Amended:** Added `eslint.config.mjs` (Next 16 flat config: `eslint-config-next/core-web-vitals` + `typescript`, global ignores for tooling dirs) and changed the `package.json` `lint` script to `eslint`. Lint now exits 0.
- **Avoids:** every later Epic-1 story failing its `npm run lint` verification with an unfixable tooling error.
- **Finding:** The Story 1.1 scaffold shipped no `postcss.config.mjs`, so `@tailwindcss/postcss` never ran — `@theme` was inert and no utilities were generated. The token layer would have had no effect.
- **Amended:** Added `postcss.config.mjs` wiring `@tailwindcss/postcss`. Build emits token vars, utilities, and the light re-binding block.
- **KEEP:** Token names mirror DESIGN.md roles; `@theme` in `src/styles/globals.css`; light re-binding via `@media (prefers-color-scheme: light)` on `:root`; `--font-*` tokens reference reserved next/font vars (`--font-inter`, `--font-space-grotesk`, `--font-ibm-plex-mono`) for Story 1.3 to bind.

### 2026-08-06 — review pass patches
- **Finding (high, patch):** `var(--font-inter)` with no inline fallback makes the whole `font-family` declaration invalid at computed-value time when the var is undefined (fonts load in Story 1.3), so the trailing `"Inter"` fallbacks never applied — the site rendered in the UA default face.
- **Amended:** Inline `var(..., fallback)` in each `--font-*` token.
- **Avoids:** invisible font identity until Story 1.3 and a broken font-family cascade.
- **Finding (medium, patch):** No `color-scheme` set — a dark-default page showed light native UI chrome (scrollbars, form controls) on light-OS devices.
- **Amended:** `color-scheme: dark` on `:root` and `color-scheme: light` in the light media block.
- **Finding (medium, patch):** `--breakpoint-mobile: 360px` generated a min-width variant that matches almost every viewport, could not express mobile-only, and `tablet` duplicated the default `md` vocabulary.
- **Amended:** Removed `--breakpoint-mobile`; mobile-first base is unprefixed (covers the 360px minimum); kept `tablet`/`desktop`. Spec Design Notes updated to match.
- **Finding (medium, patch):** px type ramp ignores browser font-size preferences.
- **Amended:** Type font sizes converted to `rem` (identical computed values at a 16px root).
- **Finding (low, patch):** `--spacing-content-max` in the spacing namespace generated nonsense `p-`/`gap-`/`w-` utilities.
- **Amended:** Moved to `--container-content-max` (max-width namespace → `max-w-content-max` only).
- **Finding (low, patch):** body theming duplicated between globals.css base rule and `bg-surface-base text-ink-primary` utilities on `<body>`; `min-height: 100vh` overflows on mobile URL bars.
- **Amended:** Removed the redundant utility classes from `layout.tsx` body (CSS base rule is single-sourced); `100vh` → `100dvh`.
- **KEEP:** `@theme` + `@layer base` structure; one token per DESIGN.md value; token utilities on components only; re-binding under `prefers-color-scheme`.

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 7 (high 1, medium 3, low 3)
- defer: 0
- reject: 9 (medium 2, low 7)
- addressed_findings:
  - `[high]` `[patch]` Inline `var(..., fallback)` in `--font-sans`/`--font-display`/`--font-mono` so font-family stays valid before Story 1.3 loads fonts.
  - `[medium]` `[patch]` Set `color-scheme: dark` default and `color-scheme: light` in the light media block.
  - `[medium]` `[patch]` Removed `--breakpoint-mobile` (misleading always-on min-width); mobile-first base is unprefixed; kept `tablet`/`desktop`.
  - `[medium]` `[patch]` Converted type font sizes to `rem` so browser font-size preferences scale the type ramp.
  - `[low]` `[patch]` Moved content max-width to `--container-content-max` (max-w namespace).
  - `[low]` `[patch]` Removed redundant body theming classes in `layout.tsx`; single-sourced in globals.css base rule.
  - `[low]` `[patch]` `min-height: 100vh` → `100dvh` for mobile URL-bar safety.

## Design Notes

Token names mirror DESIGN.md roles so the source of truth stays auditable (`border-hairline` → `--color-border-hairline`). Tailwind v4 utilities emit `var(--token)` references, so re-binding a token name under a light media query updates every consumer automatically:

```css
@theme {
  --color-surface-base: #000000;
  --color-ink-primary: #ffffff;
  --text-display: 4rem;
  --text-display--line-height: 0.95;
  --font-sans: var(--font-inter, "Inter"), system-ui, sans-serif;
}

@layer base {
  :root {
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) {
    :root {
      color-scheme: light;
      --color-surface-base: #f4f2ee; /* re-binds same name, no -light set */
    }
  }
  body { background-color: var(--color-surface-base); color: var(--color-ink-primary); }
}
```

- Type roles carry their composite values as nested theme vars (`--text-*--line-height/letter-spacing/font-weight`); `font-family` is a separate `--font-*` role token.
- `--font-sans`/`--font-display`/`--font-mono` reference reserved next/font variables `--font-inter`, `--font-space-grotesk`, `--font-ibm-plex-mono` (bound by Story 1.3) with **inline `var(..., fallback)`** so the `font-family` declaration stays valid before fonts load. This pins the interface Story 1.3 must satisfy.
- Type font sizes are `rem` (DESIGN.md's px preserved at a 16px root) so browser font-size preferences scale the ramp; line-heights are unitless, letter-spacing is em, spacing/radii stay px per DESIGN.md.
- Spacing: inherited Tailwind 4px scale for 1–8, plus site tokens `--spacing-gutter-mobile/desktop`, `--spacing-section-gap-mobile/desktop`, and `--container-content-max` (in the max-width namespace, so it generates only `max-w-content-max`).
- Breakpoints: mobile-first base is unprefixed (covers the 360px minimum supported width); `--breakpoint-tablet` (768px) and `--breakpoint-desktop` (1280px) generate `tablet:`/`desktop:` overrides.
- `color-scheme` is set to `dark` by default and `light` under the light media query so native UI chrome (scrollbars, form controls) matches the active theme.

## Verification

**Commands:**
- `npm run build` -- expected: exits 0; compiled CSS includes token variables + light-mode re-binding block
- `npm run lint` -- expected: exits 0

**Manual checks (if no CLI):**
- Grep `src/app/**/*.tsx` for `#[0-9a-fA-F]{3,6}`, `rgba?(`, and `[0-9]+px` -- expected: no matches
- Inspect `.next/static/css/*.css` for the `@media (prefers-color-scheme: light)` re-binding block

## Auto Run Result

Status: done

**Summary:** Implemented the Epic 1 Story 1.2 design token system — a single-sourced Tailwind v4 `@theme` token layer in `src/styles/globals.css` (monochrome colors, type roles, font roles, spacing, radii, breakpoints) with light-mode re-binding of the same token names under `prefers-color-scheme: light`, `color-scheme` matching, and token utilities wired into the layout/placeholder. Fixed two Story 1.1 scaffold defects that blocked verification (missing `postcss.config.mjs`; Next 16 `next lint` script + missing eslint config).

**Files changed:**
- `src/styles/globals.css` -- NEW: token layer + base layer (dark default, light re-binding, body defaults)
- `src/app/globals.css` -- DELETED: superseded by `src/styles/globals.css` (AD-1 location)
- `src/app/layout.tsx` -- import `@/styles/globals.css`; token selection classes; removed vestigial `className="dark"`
- `src/app/page.tsx` -- placeholder uses `text-heading`/`text-ink-muted` token utilities
- `postcss.config.mjs` -- NEW: wires `@tailwindcss/postcss` (scaffold shipped none)
- `eslint.config.mjs` -- NEW: Next 16 flat config (core-web-vitals + typescript, tooling-dir ignores)
- `package.json` -- `lint` script `next lint` → `eslint` (Next 16 removed `next lint`)
- `_bmad-output/implementation-artifacts/spec-1-2-design-token-system.md` -- this spec
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- story 1-2 → done

**Review findings breakdown:** Blind Hunter + Edge Case Hunter run in parallel. Triage: 7 patches applied (1 high: undefined `--font-*` vars invalidating `font-family` — inline `var(..., fallback)` added; 3 medium: `color-scheme` missing, misleading `--breakpoint-mobile` removed in favor of mobile-first unprefixed base, px type ramp → rem; 3 low: `--container-content-max` namespace, body theming dedup, `100dvh`). 0 deferred. 9 rejected (overreach/faithful-to-DESIGN.md/by-design). No intent gaps, no bad_spec loopback.

**Follow-up review recommendation:** true — a foundation file every Epic-1 story builds on received 7 review patches including a high, so one independent confirmation pass is warranted.

**Verification performed:**
- `npm run build` -- exit 0; compiled CSS contains token vars, `@media (prefers-color-scheme: light)` re-binding block, `color-scheme` dark/light, `100dvh`, inline font fallbacks
- `npm run lint` -- exit 0
- Grep `src/app/**/*.tsx` for `#[0-9a-fA-F]{3,6}`, `rgba?(`, `[0-9]+px` -- no matches

**Residual risks:**
- `tablet:`/`desktop:` variants and most type/spacing tokens are not yet consumed by components (consumed by Stories 1.3–1.6).
- Story 1.3 must bind next/font vars exactly `--font-inter`, `--font-space-grotesk`, `--font-ibm-plex-mono` (contract pinned in Design Notes).
- The default Tailwind `sm/md/lg/xl/2xl` breakpoint set still coexists with `tablet`/`desktop`; components should use the site tokens. 360px is a minimum-supported-width test floor, not a breakpoint.
