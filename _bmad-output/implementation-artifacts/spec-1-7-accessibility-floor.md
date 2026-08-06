---
title: 'Story 1.7: Accessibility floor'
type: 'feature'
created: '2026-08-06'
status: 'done'
baseline_revision: 'fb381af1f4742ff829cb355068902e63adb6d8cb'
final_revision: ''
review_loop_iteration: 0
followup_review_recommended: false
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** UX-DR10/NFR-2 require the shell to be fully operable for keyboard and screen-reader users — landmarks, a skip link, visible ≥ 2px focus rings, aria-labels on icon-only links, and aria-live regions — but the current shell has no skip link, no global focus-visible policy, and unverified landmark/label coverage.

**Approach:** Add the accessibility floor across the existing Epic 1 output: a skip-to-content link in the layout, a global token-based `:focus-visible` outline policy in `src/styles/globals.css` (≥ 2px, never suppressed), verify landmark structure (`header`/`main`/`section` with labelled headings), ensure icon-only links carry `aria-label`s, add the `aria-live` regions the shell owns (the Contact form island in Epic 3 owns its own), and run an axe-core scan in both color modes to confirm zero serious/critical violations.

## Boundaries & Constraints

**Always:** Token-driven focus ring (≥ 2px, `--color-ink-primary`) via a global `:focus-visible` rule; `outline: none` only ever paired with a custom replacement. Skip link is the first focusable element and targets `#top`/main content. Semantic landmarks — one `header`, one `main`, `section`s with labelled headings — with no duplicate landmark roles on a page. `aria-label` on every icon-only link (socials, logo, mobile menu button). Decorative atmosphere is `aria-hidden`. Keyboard order follows the funnel (header → hero CTA → sections → contact). No keyboard traps; `Esc` dismisses the mobile sheet (already wired in Story 1.6).

**Block If:** A manual axe scan can't run in this environment (browser-use unavailable) — then verify by code inspection + lint and record it as a residual risk.

**Never:** Suppressing focus indicators. Adding `tabIndex` that breaks natural order. Hiding interactive content from screen readers. Color as the only state signal (active nav = white AND weight; errors = message AND underline).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Keyboard Tab from page load | Skip link first → header nav → main content → footer, no traps, visible focus rings throughout | No error expected |
| SKIP_CLICK | Skip link activated | Focus moves to main content, URL unchanged | Focus target is a real focusable anchor |
| ICON_ONLY | Socials/menu icons render | Each has an `aria-label` | eslint jsx-a11y catches missing labels |
| AXE_SCAN | axe-core in dark + light mode | Zero serious/critical violations | Fix or record as residual risk |

</intent-contract>

## Code Map

- `src/app/layout.tsx` -- MODIFY: skip link as first element; keep landmarks
- `src/styles/globals.css` -- MODIFY: global `:focus-visible` policy (≥ 2px token outline) in `@layer base`
- `src/components/Header.tsx` -- VERIFY/MODIFY: `aria-label`s on icon-only links (logo, menu button); mobile sheet `aria-controls` (already present)
- `src/components/ui/Footer.tsx` -- VERIFY/MODIFY: `aria-label`s on social links
- `src/app/page.tsx` -- VERIFY: sections labelled by headings; main landmark present
- `src/components/MotionProvider.tsx` -- VERIFY: atmosphere `aria-hidden` (already present)

## Tasks & Acceptance

**Execution:**
- [ ] `src/styles/globals.css` -- Global `:focus-visible` rule: 2px outline in `--color-ink-primary` with `outline-offset`, and a companion rule for elements that custom-render focus (form-field uses its own underline+glow) -- never-suppressed visible focus (UX-DR10, NFR-2)
- [ ] `src/app/layout.tsx` -- Add skip link (first focusable element → main content) with `sr-only`-until-focus styling -- keyboard users jump the nav
- [ ] `src/components/Header.tsx` -- Verify logo + menu button + socials have `aria-label`s; mobile sheet links carry `aria-current` (present); add any missing labels -- icon-only links announced
- [ ] `src/components/ui/Footer.tsx` -- Verify social links render `aria-label`s (add `aria-label` per social when children are text labels, or an explicit label) -- icon/text links announced
- [ ] `src/app/page.tsx` -- Verify each `section` has a labelled heading (`aria-labelledby` present) and `main` is the single main landmark -- landmark structure (UX-DR10)

**Acceptance Criteria:**
- Given UX-DR10 and NFR-2, when the shell renders, then landmarks (`header`/`main`/`section` with labelled headings), a skip link, visible ≥ 2px focus rings, `aria-label`s on icon-only links, and `aria-live` regions are in place.
- Given keyboard navigation, when Tab is pressed, then the funnel order (header → hero CTA → sections → contact) is traversable with no suppressed focus indicators and no keyboard traps.
- Given an axe-core scan in dark and light mode, when it runs against the built site, then zero serious/critical violations are reported.
- Given the build, when `npm run build` and `npm run lint` run, then both exit 0.

## Spec Change Log

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 5 (high 0, medium 2, low 3)
- defer: 0
- reject: 0
- addressed_findings:
  - `[medium]` `[patch]` Skip link scrolled to `#top` but `<main>` isn't focusable, so keyboard focus stayed in the header (WCAG 2.4.1 bypass-block pattern). Added `tabIndex={-1}` to `<main id="top">`.
  - `[medium]` `[patch]` The "both modes" contrast AC was only in throwaway terminal output. Recorded the computed dark + light contrast ratios in the spec's Verification section for an auditable trace (dark secondary 7.65:1, light muted 4.81:1, all informative pairs ≥ 4.5:1).
  - `[low]` `[patch]` Reduced-motion rule didn't cover the skip link's 150ms slide. Added `.skip-link` to the `transition: none` block.
  - `[low]` `[patch]` Header logo `//` separator kept below-threshold `ink-muted` (3.94:1). Bumped to `ink-secondary` for consistency.
  - `[low]` `[patch]` `axe:scan` failed with a bare `fetch failed` when the server wasn't running. Now prints "start the production server first: npm run start".

## Verification

**Commands:**
- `npm run build` -- expected: exits 0
- `npm run lint` -- expected: exits 0 (jsx-a11y checks aria-labels, landmark roles)
- `npm run axe:build` (if added) -- expected: zero serious/critical; see tasks

**Manual checks (if no CLI):**
- Grep layout for skip link
- Grep globals.css for `:focus-visible` outline rule
- Grep Header/Footer for `aria-label` on icon-only links
- If browser-use is available: run axe-core in dark + light mode against `npm run dev` / built output

## Auto Run Result

Status: done

**Summary:** Implemented the Epic 1 Story 1.7 accessibility floor — a token-driven global `:focus-visible` outline (2px `ink-primary`, never suppressed, with `.focus-self` opt-out for the form field's own underline+glow), a skip-to-content link as the first focusable element, verified landmark structure (1 header / 1 main / 7 labelled sections / 1 footer, no duplicate IDs), `aria-label` coverage on icon-only links, and a repeatable `npm run axe:scan` verification (jsdom + axe-core: 0 violations across 16 runnable WCAG 2.x A/AA rules + manual structural checks). Fixed a real contrast violation: dark-mode `ink-muted` is 3.94:1 (below the 4.5:1 floor), so all informative mono/body text moved to `ink-secondary` (7.65:1 dark).

**Files changed:**
- `src/styles/globals.css` -- global `:focus-visible` outline, `.focus-self` opt-out, `.skip-link` reveal-on-focus (reduced-motion aware)
- `src/app/layout.tsx` -- skip link as first focusable element
- `src/app/page.tsx` -- `<main tabIndex={-1}>` so the skip link moves keyboard focus (WCAG 2.4.1)
- `src/components/ui/FormField.tsx` -- `focus-self` opt-out + placeholder/hint contrast to `ink-secondary`
- `src/components/ui/ProjectCard.tsx` -- metadata contrast to `ink-secondary`
- `src/components/ui/Footer.tsx` -- copyright contrast to `ink-secondary`
- `src/components/Header.tsx` -- logo `//` separator contrast to `ink-secondary`
- `scripts/axe-scan.cjs` -- NEW: axe-core + structural scan (0 violations, 16 rules)
- `package.json` -- `axe:scan` script; devDeps `jsdom` + `axe-core`
- `eslint.config.mjs` -- ignore `scripts/**` (CJS dev tool)
- `_bmad-output/implementation-artifacts/spec-1-7-accessibility-floor.md` -- this spec

**Review findings breakdown:** Blind Hunter + Edge Case Hunter run in parallel. Triage: 5 patches applied (2 medium: `tabIndex={-1}` on main so the skip link actually moves focus — WCAG 2.4.1 bypass-block pattern; contrast ratios recorded below for an auditable "both modes" AC trace. 3 low: skip-link slide added to the reduced-motion rule, header logo `//` separator bumped to `ink-secondary`, `axe:scan` now fails with a clear "start the server first" message). 0 deferred. 0 rejected. No intent gaps, no bad_spec loopback.

**Follow-up review recommendation:** false — all fixes are small, localized, and the axe/structural scan confirms zero violations; the remaining unverified rule (color-contrast in a real browser) is Epic 6.3's automated pass.

**Verification performed:**
- `npm run build` -- exit 0
- `npm run lint` -- exit 0
- `npm run axe:scan` (jsdom + axe-core, WCAG 2.x A/AA) -- 0 violations across 16 runnable rules; `color-contrast` incomplete in jsdom (needs a real browser)
- Manual structural checks -- 1 main / 1 header / 1 footer; 7/7 sections labelled via `aria-labelledby`; skip link present (→ `#top`); 0 unlabeled buttons; 0 inputs without labels; 0 anchors without href; 0 empty links; no duplicate IDs
- **Contrast ratios (WCAG AA, 4.5:1 floor; decorative borders/disabled states exempt):**
  - Dark: body white/ink `#fff` on `#000` = **21.0:1**; secondary `#9c9c9c` = **7.65:1**; muted `#6b6b6b` = 3.94:1 (informative text moved to secondary); button label `#000` on `#fff` = **21.0:1**; label on raised = **18.9:1**
  - Light: body `#111` on `#f4f2ee` = **16.9:1**; secondary `#404040` = **9.3:1**; muted `#6e6a63` = 4.81:1; button label `#fff` on `#111` = **18.9:1**; focus outline `#111` on paper = **16.9:1**

**Residual risks:**
- `color-contrast` and landmark/region axe rules need a real browser with a layout engine; Epic 6.3 runs the automated axe pass in both modes against the production build (browser-use or CI).
- The axe scan reads the server-rendered HTML (no client JS executes in jsdom) — interactive islands (header sheet, motion) are verified structurally, not behaviorally.
- `aria-live` regions for the contact form are Epic 3's scope (the shell owns landmarks/labels/focus).
