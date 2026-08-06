---
title: 'Story 1.3: Typography system'
type: 'feature'
created: '2026-08-06'
status: 'done'
followup_review_recommended: false
baseline_revision: '8651b1f11fd552c650b2e199f4a514d01f3382c6'
final_revision: ''
review_loop_iteration: 0
followup_review_recommended: false
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** The token layer (Story 1.2) declares `--font-display`/`--font-sans`/`--font-mono` referencing reserved next/font variables (`--font-space-grotesk`, `--font-inter`, `--font-ibm-plex-mono`), but no font is loaded yet — the site renders in the UA default face and the type roles (UX-DR2) are inert.

**Approach:** Load the three locked type roles via `next/font/google` (Space Grotesk 700, Inter 400, IBM Plex Mono 400/500) as self-hosted, subset, preloaded fonts bound to those exact variable names on the `<html>` element, so every token resolves and the ramp (display 64/40, heading 32, heading-sm 20, body 16–18/1.6, mono-label 12 @0.08em, mono-meta 13) renders per DESIGN.md.

## Boundaries & Constraints

**Always:** Use `next/font/google` only — self-hosted at build, no CDN requests at runtime (UX-DR2). Bind exactly `--font-space-grotesk`, `--font-inter`, `--font-ibm-plex-mono` (contract pinned in Story 1.2 Design Notes). `subsets: ['latin']` + `display: 'swap'` + preloaded. Heading roles render all-caps with wide tracking; the hero line stays sentence case (voice rule).

**Block If:** A type role, weight, or ramp value differs from UX-DR2/DESIGN.md (e.g. adding a fourth font or a decorative display face).

**Never:** Loading fonts from a CDN or external host. Adding `.woff`/`.ttf` files manually. Renaming the font tokens. Applying the display face to body text.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Cold load, fonts cached | Tokens resolve: headings Space Grotesk 700, body Inter 400, labels IBM Plex Mono; no FOIT beyond `display: swap` fallback | No error expected |
| FONT_FAIL | Build without network | Build fails at `next/font` fetch OR succeeds if fonts cached; inline `var(..., fallback)` keeps font-family valid | Document fallback in verification; tokens never break font-family (Story 1.2 patch) |

</intent-contract>

## Code Map

- `src/app/layout.tsx` -- MODIFY: import the three fonts via `next/font/google`, attach `variable` classNames to `<html>` so `--font-*` vars bind
- `src/styles/globals.css` -- VERIFY ONLY: token layer already references `--font-*` vars with inline fallbacks (Story 1.2); no change expected
- `src/app/page.tsx` -- MODIFY (cosmetic): placeholder uses `font-display`/`font-mono` utilities so the ramp renders visibly

## Tasks & Acceptance

**Execution:**
- [ ] `src/app/layout.tsx` -- Add `Space_Grotesk` (700), `Inter` (400), `IBM_Plex_Mono` (400, 500) with `subsets: ['latin']`, `variable`, `display: 'swap'`; apply all three `className` values to `<html>` -- bind the reserved font vars, self-hosted + preloaded (UX-DR2)
- [ ] `src/app/page.tsx` -- Use `font-display` on the h1 and `font-mono` on the mono label/body -- visually prove the ramp renders
- [ ] `src/styles/globals.css` -- Verify token font references unchanged and correct -- no regression to Story 1.2 contract

**Acceptance Criteria:**
- Given the type ramp (UX-DR2), when the three fonts load via `next/font` (self-hosted, subset + preloaded), then display (64/40px, 700), heading (32px), heading-sm (20px), body (16–18px/1.6), mono-label (12px, 0.08em), and mono-meta (13px) map to tokens with correct weights and tracking.
- Given the built site, when the page loads, then `--font-space-grotesk`, `--font-inter`, `--font-ibm-plex-mono` are defined and `font-display`/`font-sans`/`font-mono` utilities resolve to the correct faces.
- Given a network inspection, when the production bundle loads, then zero font requests go to a CDN (fonts are self-hosted in `.next/static/media`).
- Given the hero, when it renders, then the line stays sentence case while section headings render all-caps with wide tracking.

## Spec Change Log

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 3 (high 0, medium 1, low 2)
- defer: 0
- reject: 1 (low 1)
- addressed_findings:
  - `[medium]` `[patch]` Space Grotesk 600 not loaded; `--text-heading-sm--font-weight: 600` would clamp 600→700 or synthesize. Changed `weight: '700'` → `weight: ['600', '700']`.
  - `[low]` `[patch]` `tracking-wide` (0.025em) on the h1 overrode the `--text-display` token's `-0.01em` — a raw design value in a component (AD-1). Removed it; the token carries tracking.
  - `[low]` `[patch]` Stale placeholder copy said the token system was pending; it shipped in Story 1.2. Updated to reference the component library only.

## Verification

**Commands:**
- `npm run build` -- expected: exits 0; `.next/static/media/*.woff2` font files emitted
- `npm run lint` -- expected: exits 0

**Manual checks (if no CLI):**
- Grep built page HTML for `fonts.gstatic` / `fonts.googleapis` -- expected: no matches
- Inspect `:root` computed styles for `--font-space-grotesk` etc. being set on `<html>`

## Auto Run Result

Status: done

**Summary:** Implemented the Epic 1 Story 1.3 typography system — loaded the three locked type roles (Space Grotesk 600/700, Inter 400, IBM Plex Mono 400/500) via `next/font/google` as self-hosted, subset (`latin`), preloaded, `display: swap` fonts bound to the reserved variables `--font-space-grotesk` / `--font-inter` / `--font-ibm-plex-mono` on the `<html>` element. The Story 1.2 token chain (`--font-display`/`--font-sans`/`--font-mono`) now resolves to real faces; the placeholder page renders the display + mono ramp.

**Files changed:**
- `src/app/layout.tsx` -- three `next/font/google` instances + variable classNames on `<html>`
- `src/app/page.tsx` -- placeholder uses `font-display`/`font-mono` + responsive display ramp; stale copy fixed
- `_bmad-output/implementation-artifacts/spec-1-3-typography-system.md` -- this spec

**Review findings breakdown:** Blind Hunter + Edge Case Hunter run in parallel. Triage: 3 patches applied (1 medium: Space Grotesk 600 missing for `--text-heading-sm` — weights now `['600','700']`; 2 low: removed raw `tracking-wide` overriding the `--text-display` tracking token (AD-1), stale placeholder copy updated). 0 deferred. 1 rejected (Inter bold weights — body locked at 400 by design; voice rules use structural emphasis). No intent gaps, no bad_spec loopback.

**Follow-up review recommendation:** false — small, low-consequence localized fixes.

**Verification performed:**
- `npm run build` -- exit 0; 20 self-hosted `.woff2` files in `.next/static/media`; `--font-space-grotesk`/`--font-inter`/`--font-ibm-plex-mono` bound on `<html>`; token chain `--font-display: var(--font-space-grotesk, ...)` intact; `font-weight:600` present
- `npm run lint` -- exit 0
- Grep built output for `fonts.gstatic`/`fonts.googleapis` -- no matches

**Residual risks:**
- Inter is loaded at 400 only; any future bold body emphasis would be font-synthesized (body weight is locked at 400 per DESIGN.md, so acceptable).
- Fonts load from Google at build time; CI needs network or a warm font cache.
- Placeholder copy will be replaced by real content in Epic 2.
