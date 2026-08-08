---
title: 'Epic 6 Story 4: Performance budget'
type: 'feature'
created: '2026-08-08'
status: 'in-progress'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '2e81bc2a1bee501a36bc396793528fa064a08637'
---

<intent-contract>

## Intent

**Problem:** NFR-1 requires Lighthouse ≥ 90 performance on mobile against the production build, but nothing has ever actually run Lighthouse against this site — the "fast, working site" claim is assumed, not proven, and there's no repeatable way to re-check it after future changes.

**Approach:** Add a scripted Lighthouse run (`scripts/testing/perf-budget.cjs`) using the `lighthouse` Node API against the locally-running production build (`localhost:3000`, matching the `axe-scan.cjs`/`link-check.cjs`/`contrast-check.cjs` convention), with mobile form-factor and simulated throttling, asserting the performance category score ≥ 90 and printing the key Core Web Vitals metrics — exposed as a repeatable `npm run perf:budget` command.

## Boundaries & Constraints

**Always:**
- Add `lighthouse` and `chrome-launcher` as devDependencies (unlike the prior three Story 6.x scripts, this check genuinely requires a real Chrome instance and the Lighthouse engine — there is no dependency-free way to run a real performance audit; this is the first Epic 6 script to add a new dependency, and it is directly named as this project's canonical performance tool in `tech-stack.md`).
- `scripts/testing/perf-budget.cjs` launches Chrome via `chrome-launcher` (headless), runs `lighthouse('http://localhost:3000', { onlyCategories: ['performance'], formFactor: 'mobile', screenEmulation: <Lighthouse's default moto-g mobile preset>, throttlingMethod: 'simulate' })` matching Lighthouse's standard mobile preset (this is what NFR-1 means by "Lighthouse ≥ 90 mobile"), then kills the Chrome instance whether the audit succeeds or throws.
- Print the performance category score (0–100) and these metric `displayValue`s: First Contentful Paint, Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift, Speed Index.
- `process.exit(1)` if the performance score is `< 90`, `process.exit(0)` otherwise (matching the "fail the launch gate otherwise" framing of the epic).
- Add an npm script `"perf:budget": "node scripts/testing/perf-budget.cjs"` to `package.json`, alongside `"axe:scan"`, `"contrast:check"`, and `"link:check"`.
- If Chrome cannot be launched (no installation found by `chrome-launcher`), print a clear message naming that as the failure and `process.exit(1)` — do not silently skip the check or report a false pass.
- Record the actual measured score and metrics from a real run against this repo's current production build in this spec's Verification/Auto Run Result section — do not fabricate or estimate a score.

**Block If:** none — running Lighthouse against a locally-started production build and asserting a documented numeric threshold requires no product decision.

**Never:**
- Never run Lighthouse against `next dev` — it must run against `npm run start` (the production build), matching NFR-1's "production build" requirement and the existing sibling scripts' precondition.
- Never modify the glitch/scanline motion implementation (`src/lib/motion`, `MotionProvider.tsx`, the CSS keyframes in `globals.css`) as part of this story merely to chase a marginally higher score — this story verifies the existing budget is met; if the measured score is already ≥ 90, no code change to the motion layer is authorized. If it measures below 90, the fix must target the actual failing Lighthouse audit's real cause (e.g., an unoptimized asset), not the glitch system.
- Never add a headless-browser dependency beyond `lighthouse`'s own `chrome-launcher` (no Puppeteer/Playwright wrapper) — Lighthouse already bundles everything needed to drive Chrome.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Score ≥ 90 | Production server running, real Lighthouse mobile run | Script prints score + metrics, exits 0 | No error |
| Score < 90 | A real regression drops the score below threshold | Script prints score + metrics, exits 1 | Non-zero exit fails the gate |
| No Chrome installation | `chrome-launcher` can't find/launch Chrome | Script prints a clear "Chrome not found" message, exits 1 | Fail loudly, no false pass |
| Server not running | `localhost:3000` unreachable before Chrome navigates | Lighthouse's own navigation error surfaces; script prints it and exits 1 | Fail loudly |

</intent-contract>

## Code Map

- `scripts/testing/perf-budget.cjs` -- new script: launch headless Chrome, run Lighthouse mobile-simulated performance audit, assert ≥ 90, print metrics, exit code
- `package.json` -- add `lighthouse`/`chrome-launcher` devDependencies and `"perf:budget"` npm script

## Tasks & Acceptance

**Execution:**
- [ ] `package.json` -- add `lighthouse` and `chrome-launcher` as devDependencies, plus `"perf:budget": "node scripts/testing/perf-budget.cjs"` -- exposes the check as a repeatable npm command (NFR-1)
- [ ] `scripts/testing/perf-budget.cjs` -- create the script per the intent-contract -- proves the performance budget rather than assuming it
- [ ] Run `npm run build && npm run start &` then `npm run perf:budget` against the current site and record the actual score/metrics in this spec -- confirms whether the real budget is met today

**Acceptance Criteria:**
- Given the production build is running locally, when `npm run perf:budget` executes, then it prints the real Lighthouse mobile performance score and Core Web Vitals metrics and exits `0` only if the score is ≥ 90.
- Given the measured score from this story's actual run, when it is ≥ 90, then no change is made to the motion/glitch layer (per the `Never` rule) — the story only adds the verification tool.
- Given Chrome cannot be launched in some environment, when the script runs there, then it fails loudly with a clear message rather than reporting a false pass.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run build` -- expected: succeeds
- `npm run start &` then `npm run perf:budget` -- expected: real score printed, exit code reflects the ≥ 90 threshold
- `npm run lint` -- expected: no new lint errors
