---
title: 'Epic 6 Story 3: Accessibility verification in both modes'
type: 'feature'
created: '2026-08-08'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'd65cb0f4315c6da4ced1a521910fbd927ee3ea26'
final_revision: '5947001a0dbfb4caf0735d0865e471b6d92d58db'
---

<intent-contract>

## Intent

**Problem:** Accessibility has been built (Story 1.7) but never proven against the built site: `axe-scan.cjs` already runs structural axe-core checks but cannot compute real color contrast (jsdom has no layout/rendering engine, and its own output shows the `color-contrast` rule as `incomplete`, never `pass`/`fail`), and nothing verifies the `prefers-reduced-motion` policy actually disables every glitch/Lenis mechanism it claims to, in either color mode.

**Approach:** Add a dependency-free contrast-verification script that computes real WCAG contrast ratios for every load-bearing text/background token pair in both dark and light mode directly from the token hex values already declared in `src/styles/globals.css` (parsing them, not hardcoding, so the check can never drift from the real tokens), confirm the existing `axe-scan.cjs` reports zero serious/critical violations, and statically verify both halves of the reduced-motion policy (the CSS media-query rule's keyframe/class coverage, and the `gsap.matchMedia()` JS wiring) are present and complete. A live-browser keyboard-operability walkthrough is outside what this unattended workflow can perform; `axe-scan.cjs`'s existing structural checks (skip link, focus-visible tokens, unlabeled controls, empty links, duplicate IDs) are documented as the closest automated proxy.

## Boundaries & Constraints

**Always:**
- Add `scripts/testing/contrast-check.cjs` (CommonJS, matching sibling scripts) that reads `src/styles/globals.css` from disk, parses the `:root` block's default (dark) token hex values and the `@media (prefers-color-scheme: light)` block's overriding hex values for `--color-surface-base`, `--color-surface-raised`, `--color-ink-primary`, `--color-ink-secondary`, `--color-ink-muted`, and computes the WCAG relative-luminance contrast ratio for every load-bearing pair: (`ink-primary`/`surface-base`), (`ink-primary`/`surface-raised`), (`ink-secondary`/`surface-base`), (`ink-secondary`/`surface-raised`), (`ink-muted`/`surface-base`), (`ink-muted`/`surface-raised`) — in **both** dark and light token sets (12 checks total).
- `--color-ink-disabled` is excluded from the checked pairs: it is used only on `disabled:` form/button states, which WCAG 2.1 AA does not require to meet the 4.5:1 text-contrast threshold.
- Treat any checked pair below `4.5:1` as `FAIL`; print each pair's computed ratio and PASS/FAIL, plus a final summary; `process.exit(1)` if any pair fails, `process.exit(0)` otherwise.
- Add an npm script `"contrast:check": "node scripts/testing/contrast-check.cjs"` alongside `"axe:scan"` and `"link:check"`.
- Run the existing `npm run axe:scan` against the current build and record its actual output (violation count) in this spec's Verification/Auto Run Result — do not modify `axe-scan.cjs` itself; this story verifies, it does not rebuild the existing tool.
- Statically verify (via direct file inspection, not a new script) that `src/styles/globals.css`'s `@media (prefers-reduced-motion: reduce)` block still covers every currently-defined glitch/flicker/tear class (`.glitch-burst`, `.nav-flicker:hover`, `.group:hover .card-tear`, `.btn-fringe:hover`, `.btn-fringe:active`) and that `src/components/MotionProvider.tsx` still wires `gsap.matchMedia()` to disable Lenis smoothing and JS tweens; record what was found, and if a currently-defined animation class is missing from the CSS reduced-motion block, that is a real defect to fix in this story (in `src/styles/globals.css` only — no new animation classes may be introduced).
- If `contrast-check.cjs` reports a real load-bearing pair below 4.5:1, fix it by adjusting only the failing token's hex value in `src/styles/globals.css` (the smallest change that clears the threshold with a small safety margin), never by changing which token a component uses or removing the pair from the check — WCAG AA contrast is a hard, already-agreed requirement (tech-stack.md), not a product decision requiring human sign-off.

**Block If:** none — every check in this story is either computable from already-declared token values or is a read-only inspection of already-built code; no product decision is required.

**Never:**
- Never introduce a headless-browser dependency (Playwright/Puppeteer) to compute contrast — the site's palette is fully monochrome and every token value is already declared as a literal hex string in `globals.css`, so a pure math (relative-luminance) check is sufficient and dependency-free, matching this repo's established "no new runtime deps for testing scripts" convention.
- Never hardcode the hex values in the new script as a second source of truth — parse them from `globals.css` so the check tracks the real tokens and can't silently go stale after a design change.
- Never claim a live-browser manual keyboard/focus walkthrough was performed — this workflow runs unattended with no browser interaction available; state plainly in the Verification section that this specific AC sub-item (manual keyboard pass) could not be executed and rely on the documented structural-check proxy instead.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| All 12 pairs pass | Every load-bearing pair in both modes ≥ 4.5:1 | Script prints all PASS, exits 0 | No error |
| One pair fails | A pair's computed ratio < 4.5:1 | Script prints FAIL with the exact ratio, exits 1 | Non-zero exit fails the gate |
| Token missing from CSS | A required `--color-*` custom property isn't found in either block | Script prints a parse error naming the missing token and exits 1 | Fail loudly, don't guess a default |
| Reduced-motion CSS gap found | A currently-defined glitch class isn't listed in the `prefers-reduced-motion` block | Treated as a real defect; fixed in `globals.css` as part of this story | Not a script failure — a code fix |

</intent-contract>

## Code Map

- `scripts/testing/contrast-check.cjs` -- new script: parse `globals.css` tokens, compute WCAG contrast ratios for both modes, PASS/FAIL report
- `package.json` -- add `"contrast:check"` npm script entry
- `src/styles/globals.css` -- inspect reduced-motion block coverage; fix only if a gap is found
- `src/components/MotionProvider.tsx` -- inspect (read-only) for `gsap.matchMedia()` wiring

## Tasks & Acceptance

**Execution:**
- [x] `scripts/testing/contrast-check.cjs` -- create the script (parse tokens from `globals.css`, compute contrast ratios for the 6 load-bearing pairs × 2 modes, PASS/FAIL, exit code) -- proves contrast ≥ 4.5:1 rather than assuming it
- [x] `package.json` -- add `"contrast:check": "node scripts/testing/contrast-check.cjs"` -- exposes the check as a repeatable npm command
- [x] Run `npm run axe:scan` against the built site and record the actual violation count in this spec -- confirmed zero total violations
- [x] Inspect `src/styles/globals.css`'s reduced-motion block against every currently-defined glitch/flicker/tear class -- confirmed complete, no gap found, no fix needed
- [x] Inspect `src/components/MotionProvider.tsx` for `gsap.matchMedia()` wiring disabling Lenis/JS tweens -- confirmed wired (`smoothWheel: !reduced` on Lenis, `gsap.matchMedia()` gating all reveal/glitch tweens)
- [x] `src/styles/globals.css` -- fix `--color-ink-muted` (real contrast failure found, see Spec Change Log) -- brings both failing pairs above 4.5:1

**Acceptance Criteria:**
- Given `npm run contrast:check` runs against `src/styles/globals.css`'s current tokens, when it computes all 12 pair ratios, then every load-bearing pair reports ≥ 4.5:1 in both dark and light mode, and the script exits `0`. **Verified: 12/12 PASS.**
- Given `npm run axe:scan` runs against the built site, when it completes, then it reports zero serious/critical violations (matching Story 1.7's original floor, now re-verified post-Epics 2-5). **Verified: 0 violations.**
- Given the reduced-motion CSS block in `globals.css`, when compared against every currently-defined glitch/flicker/tear animation class, then every one is covered (no gap), and `MotionProvider.tsx` is confirmed to call `gsap.matchMedia()` for the JS half. **Verified: complete coverage, JS half wired.**
- Given this story cannot perform a live keyboard walkthrough, when the Verification section is written, then it states this limitation explicitly rather than claiming a manual pass occurred. **Done — see Verification section.**

## Spec Change Log

### 2026-08-08 — pre-review scope amendment
**Trigger:** `contrast-check.cjs` found a real, previously-unverified defect: `--color-ink-muted: #6b6b6b` scored 3.94:1 against `--color-surface-base` and 3.54:1 against `--color-surface-raised` in dark mode — both below the 4.5:1 AA floor tech-stack.md already mandates. The original `Always` list authorized fixing a reduced-motion CSS gap but didn't explicitly authorize fixing a failing color token, since that possibility wasn't anticipated when the spec was drafted.
**Amended:** Added an `Always` rule authorizing a minimal, targeted hex-value fix to any failing token (smallest change that clears 4.5:1 with a small margin), scoped so it can't be used to change which token components consume or to weaken the check itself.
**Known-bad state avoided:** Shipping a story titled "accessibility verification" that discovers a real AA failure and then merely logs it instead of fixing it, when the fix is a same-file, same-scope, one-line, unambiguous correction (not a product/brand decision).
**Fix applied:** `--color-ink-muted` changed from `#6b6b6b` to `#808080` in `src/styles/globals.css` (dark/default token only — light mode's `#6e6a63` already passed at 4.81:1/5.38:1 and was left untouched). Re-verified: all 12 pairs now PASS (dark ink-muted/surface-base 5.32:1, ink-muted/surface-raised 4.78:1).
**KEEP:** The parsing/computation approach in `contrast-check.cjs` (read real tokens from `globals.css`, WCAG relative-luminance formula, no hardcoded color duplication) is confirmed correct and caught a real bug — must survive unchanged.

## Review Triage Log

### 2026-08-08 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2 (low 2)
- defer: 8 (low 8)
- reject: 4 (low 4)
- addressed_findings:
  - `[low]` `[patch]` `fs.readFileSync(CSS_PATH)` had no try/catch (inconsistent with every other error path in the file, which prints a clean message) — wrapped it, now prints `Could not read <path>: <reason>` and exits 1 instead of a raw stack trace.
  - `[low]` `[patch]` `--color-ink-disabled`'s exclusion from the checked pairs had no comment explaining it was deliberate (WCAG exempts disabled-state text) — added a one-line comment above `PAIRS`.

## Verification

**Commands:**
- `npm run build` -- expected: succeeds
- `npm run start &` then `npm run contrast:check` -- expected: 12/12 PASS, exit code `0`
- `npm run start &` then `npm run axe:scan` -- expected: `AXE TOTAL violations: 0`
- `npm run lint` -- expected: no new lint errors

**Manual checks (documented limitation):**
- Live keyboard-navigation/focus-visibility walkthrough in an actual browser is not performed by this unattended workflow. The automated proxy is `axe-scan.cjs`'s structural output (skip link presence, unlabeled-control count, empty-link count, duplicate-ID count) plus the CSS `:focus-visible` token rule already present in `globals.css`.

## Auto Run Result

**Summary:** Added a dependency-free `npm run contrast:check` script that parses real token hex values from `globals.css` and computes WCAG contrast ratios for 6 load-bearing text/background pairs in both dark and light mode. It found a genuine AA failure (`--color-ink-muted` at 3.94:1/3.54:1 in dark mode) and the fix (retuning that one token to `#808080`) was applied and re-verified (now 5.32:1/4.78:1). Confirmed `axe:scan` still reports zero violations and both halves of the reduced-motion policy are complete/wired — no code change was needed for either.

**Files changed:**
- `scripts/testing/contrast-check.cjs` -- new contrast-verification script
- `package.json` -- added `"contrast:check"` npm script
- `src/styles/globals.css` -- `--color-ink-muted` changed from `#6b6b6b` to `#808080` (dark mode only; light mode already passed)

**Review findings breakdown:** 2 patches applied (readFileSync error handling, a clarifying comment), 8 deferred (CI/hook wiring for the new a11y scripts; several latent script-parsing edge cases not triggered by the current file — tracked in `deferred-work.md`), 4 rejected (deliberate scope decisions already documented: narrow pair set, disabled-state exclusion, asymmetric dark-only fix, visual-hierarchy framing overridden by the hard AA requirement).

**Follow-up review recommendation:** false — the token change is a single, small, accessibility-motivated color adjustment with no behavioral/security impact; the script patches are minor robustness fixes.

**Verification performed:** `npm run contrast:check` reports 12/12 PASS, exit 0; `npm run build` succeeds; `npm run axe:scan` against the built site reports 0 violations; `npm run lint` shows only the pre-existing unrelated error. Manual keyboard walkthrough was not performed (documented limitation above), with the structural axe-scan output and CSS focus-visible rule serving as the closest automated proxy.

**Residual risks:** None from this story's surviving changes. The lack of CI/hook enforcement for `contrast:check`/`axe:scan` (tracked in `deferred-work.md`) means a future `globals.css` edit could reintroduce a contrast regression without an automatic catch — worth Story 6.5's consideration.
