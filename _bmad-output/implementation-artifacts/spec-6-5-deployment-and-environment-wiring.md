---
title: 'Epic 6 Story 5: Deployment and environment wiring'
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

**Problem:** DEP-1 requires the project deployed to Vercel with `main` → production, PR branches → preview deployments, per-environment env vars, production-only Web Analytics, and a real end-to-end test submission — but none of that is wired yet, and the deployment knowledge lives scattered across planning docs and deferred-work entries rather than one executable checklist.

**Approach:** Create a deployment & environment wiring checklist (`DEPLOYMENT.md`) capturing every manual step and launch gate (per DEP-1 / epic-6-context / deferred-work), expose a single `prelaunch:check` npm command that chains the four Story 6.x quality gates (axe, contrast, link, perf), verify the unattended-completable pieces, and halt blocked on the Vercel/EmailOctopus account actions that require the Builder's credentials.

## Boundaries & Constraints

**Always:**
- Create `DEPLOYMENT.md` at the repo root documenting, in order: Vercel project import + branch config (`main` → production, PR branches → preview), per-environment env vars (`EMAIL_OCTOPUS_API_KEY` / `EMAIL_OCTOPUS_LIST_ID` server-only, `CONTACT_EMAIL` server-read), the manual `CONTACT_EMAIL`/`EMAIL_OCTOPUS_*` value verification deferred from Story 6.1, the pre-launch gate run order, Web Analytics production-only confirmation, and the end-to-end test submission steps that close the Visit → Trust → Capability → Contact loop.
- Add `"prelaunch:check"` to `package.json` chaining the four existing gates in order: `axe:scan` → `contrast:check` → `link:check` → `perf:budget`. This is the one-command pre-deploy quality gate, consistent with the epic's repeatable-npm-command convention.
- `.env.example` already documents every required var — verify only, do not modify unless a real gap is found.
- Keep everything free-tier (NFR-8); no paid dependency.

**Block If:** any Vercel/EmailOctopus account action that cannot be completed without the Builder's credentials — creating/importing/connecting the Vercel project, branch/domain settings, entering real env values in Vercel dashboards, running the production end-to-end test submission, live confirmation that Web Analytics is production-only, and CI/pre-commit/pre-push gate wiring (platform/pipeline decision). HALT with status `blocked` rather than fabricating credentials, IDs, or a false success.

**Never:**
- Never commit secrets or `.env` (ENV-1).
- Never gate behavior on `process.env.NODE_ENV === 'production'` in app code — Next.js sets `NODE_ENV=production` for every Vercel build, preview included (Story 6.1 lesson).
- Never add a paid dependency to satisfy any gate (NFR-8).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Vercel preview with no env vars | Preview deploy, vars unset | App builds and runs; `CONTACT_EMAIL` falls back to `builder@example.com` (spec-6-1) | No crash; checklist instructs setting test values per environment |
| `prelaunch:check` with no server | No `npm run start` / no Chrome | `link:check` / `perf:budget` fail loudly | Chained script stops at first failure, non-zero exit |
| No real credentials in this run | Reaching Vercel wiring steps | Run HALTs `blocked`; nothing fabricated | Blocking condition documented in Auto Run Result |

</intent-contract>

## Code Map

- `DEPLOYMENT.md` -- new: the executable deployment & environment wiring checklist (DEP-1, epic-6-context, deferred-work hand-off)
- `package.json` -- add `"prelaunch:check"` chaining the four quality gates

## Tasks & Acceptance

**Execution:**
- [ ] `DEPLOYMENT.md` -- create the deployment & environment wiring checklist (Vercel import/branches, per-env vars, manual value verification from Story 6.1, gate run order, Web Analytics prod-only check, e2e test submission) -- makes the human-owned launch steps executable instead of scattered (DEP-1, NFR-8)
- [ ] `package.json` -- add `"prelaunch:check": "npm run axe:scan && npm run contrast:check && npm run link:check && npm run perf:budget"` -- one-command pre-deploy quality gate
- [ ] Vercel/EmailOctopus wiring (project connection, per-environment env vars, production e2e test submission, Web Analytics prod-only confirmation) -- Block If: requires Builder's account access; halt blocked, do not fabricate

**Acceptance Criteria:**
- Given the repo, when a maintainer follows `DEPLOYMENT.md`, then they can connect Vercel (branches + per-env vars), run the pre-launch gates, and confirm Web Analytics is production-only, with every step checkable and no step depending on undocumented knowledge.
- Given the production build is running, when `bun run prelaunch:check` executes, then all four quality gates run in order and the command exits non-zero on the first failure.
- Given this unattended run lacks real credentials, when the Vercel wiring steps are reached, then the run halts `blocked` instead of fabricating env values or claiming a false success.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `bun run prelaunch:check` -- expected: four gates chain in order; full run requires the production build running and Chrome installed (documented as the launch-gate step in `DEPLOYMENT.md`)
- `git status` -- expected: only `DEPLOYMENT.md` and `package.json` touched by this story (plus the pre-existing uncommitted Story 6.4 work)
