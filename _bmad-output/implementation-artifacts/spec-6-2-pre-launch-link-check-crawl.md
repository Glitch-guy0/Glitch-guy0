---
title: 'Epic 6 Story 2: Pre-launch link-check crawl'
type: 'feature'
created: '2026-08-08'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'ff3093e13014138db0d2592f47bbe203f51f894f'
final_revision: 'PENDING_COMMIT'
---

<intent-contract>

## Intent

**Problem:** Nothing today verifies that the outbound links the funnel depends on (GitHub repos, live demo URLs, `mailto:` addresses, the resume PDF) actually resolve. A dead link on any of these would silently undercut the site's credibility with no automated signal to catch it before launch.

**Approach:** Add a scripted crawl (`scripts/testing/link-check.cjs`, following the existing `axe-scan.cjs` convention of fetching the built production server at `localhost:3000`) that extracts every outbound link rendered on the page, validates each by category (HTTP HEAD/GET for external URLs and the resume PDF, format validation for `mailto:`), and exits non-zero with a clear report if any check fails — exposed as a repeatable `npm run link:check` command.

## Boundaries & Constraints

**Always:**
- Follow the existing `scripts/testing/axe-scan.cjs` pattern: a Node script (CommonJS, `.cjs`) that fetches `http://localhost:3000` and instructs the operator to run `npm run start` first if the fetch fails — do not introduce a browser-automation dependency (Playwright/Puppeteer) where a plain HTTP fetch suffices.
- Extract every `<a href>` from the fetched HTML (use `jsdom`, already a devDependency, matching `axe-scan.cjs`'s parsing approach) and classify each by scheme: `mailto:` links get format validation only; `http(s):` links pointing off-origin (GitHub, live demo, LinkedIn, etc.) get a real network check; the resume PDF link (`/resume.pdf...`, same-origin) gets a same-origin fetch with a `Content-Type: application/pdf` assertion; in-page anchors (`#section-id`) are skipped (not outbound, not this story's scope).
- For each off-origin `http(s):` link, send a browser-like `User-Agent` header, issue a `HEAD` request (falling back to `GET` if the target returns `405` for `HEAD`, since some hosts reject `HEAD`) with a bounded timeout (10s) and follow redirects; treat a `403`/`999` response as `BLOCKED` (logged separately, does not fail the gate — some hosts, e.g. LinkedIn, return these to any datacenter/CI request regardless of whether the link is actually dead, so this needs a manual browser check, not an automated verdict), treat any other final status `>= 400`, a network error, or a timeout as `FAIL`, and anything else as `PASS`.
- For `mailto:` links, extract the address portion and validate it against a basic RFC-5322-ish email pattern; treat a non-matching or empty address as a failure.
- Print a per-link PASS/FAIL/BLOCKED line (URL, status/result) and a final summary count (`N passed, M failed, K blocked`); `process.exit(1)` if any link is `FAIL`, `process.exit(0)` otherwise (a `BLOCKED` result alone does not fail the gate).
- Add an npm script `"link:check": "node scripts/testing/link-check.cjs"` to `package.json`, alongside the existing `"axe:scan"` entry.

**Block If:** none — this is a self-contained script addition with no product decision required.

**Never:**
- Never add a new runtime dependency for HTTP requests or HTML parsing — use Node's built-in `fetch` and the already-installed `jsdom` package, matching `axe-scan.cjs`.
- Never crawl beyond the single rendered page (no recursive crawling of linked pages) — the site is a single-page funnel; this story checks the links declared on that page, not a multi-page site graph.
- Never make this script a build-time gate in `next build`/`npm run build` — it runs against the already-built, already-started server (`npm run start`), same as `axe:scan`, and stays a separate, explicitly-invoked command.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| All links resolve | Production server running at `localhost:3000`, all external URLs return 2xx/3xx-followed-to-2xx | Script prints all PASS, exits 0 | No error |
| One external link 404s | One GitHub/demo URL returns 404 | Script prints FAIL for that link with status code, exits 1 | Non-zero exit fails the gate |
| Host blocks scripted requests | External URL returns 403 or 999 (e.g. LinkedIn to a datacenter IP) | Script prints BLOCKED with a manual-check note; does not fail the gate by itself | Exit code unaffected by BLOCKED alone |
| Network timeout | One external URL never responds within 10s | Script prints FAIL with "timeout", exits 1 | Non-zero exit fails the gate |
| Malformed mailto | A `mailto:` href with no `@` or empty address | Script prints FAIL for that link | Non-zero exit fails the gate |
| Resume PDF missing/wrong type | `/resume.pdf...` returns non-200 or non-PDF content-type | Script prints FAIL | Non-zero exit fails the gate |
| Server not running | `fetch('http://localhost:3000')` rejects | Script prints an instruction to run `npm run start` first and exits 1 | Same failure mode as `axe-scan.cjs` |
| In-page anchor (`#contact`) | href starts with `#` | Skipped — not counted as pass or fail | No error |

</intent-contract>

## Code Map

- `scripts/testing/link-check.cjs` -- new crawl script (fetch built page, extract/classify/verify links, exit code)
- `package.json` -- add `"link:check"` npm script entry

## Tasks & Acceptance

**Execution:**
- [x] `scripts/testing/link-check.cjs` -- create the script per the intent-contract (fetch `localhost:3000`, parse with `jsdom`, classify links by scheme/origin, verify each, print PASS/FAIL/BLOCKED, exit code) -- makes the link-check repeatable and CI-friendly
- [x] `package.json` -- add `"link:check": "node scripts/testing/link-check.cjs"` script -- exposes the crawl as a repeatable npm command (FR-13, NFR-4, SM-2)
- [x] Run `npm run build && npm run start &` then `npm run link:check` against the current site -- ran against the real site; found one genuine dead link (see Auto Run Result) and one bot-blocked host correctly categorized as BLOCKED, not FAIL

**Acceptance Criteria:**
- Given the production build is running locally, when `npm run link:check` executes, then it reports every outbound GitHub, live-demo, LinkedIn, `mailto:`, and resume-PDF link found on the page with a PASS/FAIL/BLOCKED verdict and exits `0` only if no link is FAIL.
- Given any one of those links is broken (confirmed live: the Shikigami Agent SDK GitHub URL genuinely 404s), when the script runs, then it reports that specific link as FAIL with the failure reason and exits non-zero.
- Given the script is run without the production server started, when it executes, then it prints an instruction to start the server first and exits non-zero, matching `axe-scan.cjs`'s existing failure UX.

## Spec Change Log

### 2026-08-08 — pre-review implementation refinement
**Trigger:** Live verification against the real site found LinkedIn returning `403` to every scripted request regardless of link validity (confirmed via independent `curl` with a browser User-Agent — still 403), a known bot-blocking behavior, not evidence of a dead link.
**Amended:** Added a browser-like `User-Agent` header to off-origin checks, and a `BLOCKED` verdict (for `403`/`999` responses) that is reported but does not fail the gate, distinct from `FAIL`. Updated the intent-contract's `Always` rule, I/O matrix, and Tasks/AC to match.
**Known-bad state avoided:** The gate permanently failing on LinkedIn every run regardless of whether the profile link is actually valid.
**KEEP:** The core script structure (fetch localhost:3000 → jsdom parse → classify by scheme/origin → per-link verdict → summary → exit code) is unchanged and confirmed correct.

## Review Triage Log

### 2026-08-08 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 3 (low 3)
- defer: 5 (low 5)
- reject: 6 (low 6)
- addressed_findings:
  - `[low]` `[patch]` Unrecognized-scheme/relative hrefs fell through every branch with no log line, understating what was checked — added a `SKIP <href> (unrecognized scheme/target, not checked)` line so nothing silently vanishes from the report.
  - `[low]` `[patch]` If the initial fetch to `localhost:3000` returned a non-2xx error page, or the page had zero `<a href>` elements, the script still printed a reassuring "0 passed, 0 failed" and exited `0` — added a `res.ok` check on the initial fetch and an explicit `anchors.length === 0` guard, both exiting `1`.
  - `[low]` `[patch]` `href.includes('resume.pdf')` was a fragile substring match (would misfire on unrelated hrefs containing that text, miss case variants) — replaced with proper `URL` parsing and a `pathname.toLowerCase().endsWith('.pdf')` check.

## Verification

**Commands:**
- `npm run build` -- expected: succeeds
- `npm run start &` then `npm run link:check` -- expected: all current real links report PASS, exit code `0`
- `npm run lint` -- expected: no new lint errors

## Auto Run Result

**Summary:** Added a repeatable `npm run link:check` crawl script that fetches the built site, extracts every outbound link, and verifies each by category (network check for external URLs, format check for `mailto:`, content-type check for the resume PDF), with a `BLOCKED` tri-state for bot-gated hosts (e.g. LinkedIn) that doesn't fail the gate on its own.

**Files changed:**
- `scripts/testing/link-check.cjs` -- new crawl script
- `package.json` -- added `"link:check"` npm script

**Review findings breakdown:** 3 patches applied (unrecognized-scheme links now logged instead of silently dropped; zero-anchors/error-page now fails loudly instead of reporting false success; fragile `resume.pdf` substring match replaced with proper URL-path checking), 5 deferred (dedup, retry/concurrency, PDF-body-byte validation — tracked in `deferred-work.md`), 6 rejected (in-page anchor target validation and bot-block/HEAD-retry nuances are deliberate, already-documented scope decisions; multi-recipient-mailto and scheme-case-sensitivity edge cases don't apply to this site's actual, controlled content).

**Follow-up review recommendation:** false — all three patches are small, localized robustness fixes to a manually-invoked script; no behavior/security/data-handling change to the production site itself.

**Verification performed:** `npm run build` succeeds; live run against `npm run start` correctly reports 10 PASS, 1 FAIL (see residual risk below), 1 BLOCKED, exit code `1`; `npm run lint` shows only the pre-existing unrelated error.

**Residual risks:** The crawl found a genuinely dead link — `https://github.com/Glitch-guy0/shikigami-agent-sdk` returns a real 404 — logged to `deferred-work.md` since fixing it requires a human decision (this workflow cannot fabricate or guess the correct destination). This is the crawl tool working as intended, not a defect in this story's deliverable.
