# Sprint Task List

- **Sprint:** Epic 6 — Launch Readiness & Quality Gates
- **Created:** 2026-08-08
- **Owner:** Prajwal
- **Status legend:** `[ ]` todo · `[~]` in-progress · `[x]` done · `[!]` blocked

## Scope

This list covers the remaining Epic 6 story tasks (Stories 6.4 and 6.5), Epic 6/launch-scoped deferred-work (spec-6-1 manual env verification → Story 6.5; spec-6-3 CI gate wiring → Story 6.5; spec-6-2 dead Shikigami link → FR-13 zero-404 launch gate), and open action items deferred to the Epic 6 hardening phase (= this pre-launch sprint). Deferred-work not handed to Epic 6 stays tracked in its source spec (`deferred-work.md`); the optional `epic-6-retrospective` is tracked only in `sprint-status.yaml`. Other open action items remain in `sprint-status.yaml` (action_items) and are out of this sprint's scope.

## Story 6.4 — Performance budget (in-progress)

Source: `_bmad-output/implementation-artifacts/spec-6-4-performance-budget.md`

Note: spec-6-4's own task checkboxes are not yet updated; statuses here reflect actual repo state.

- [x] `package.json` — add `lighthouse` + `chrome-launcher` devDependencies and `"perf:budget": "node scripts/testing/perf-budget.cjs"` — evidence: present in package.json devDependencies and scripts. (spec-6-4, Task 1)
- [x] `scripts/testing/perf-budget.cjs` — create the Lighthouse mobile-simulated performance gate — evidence: file exists and implements the spec (asserts ≥ 90, prints Core Web Vitals, exit code). (spec-6-4, Task 2)
- [ ] Run `npm run build`, then `npm run start &`, then `npm run perf:budget` against the current site and record the real score/metrics in spec-6-4 Verification — no recorded score exists yet. If the score is < 90, record the metrics and open a remediation item per spec-6-4. (spec-6-4, Task 3)

## Story 6.5 — Deployment & environment wiring (in-progress)

Source: `_bmad-output/implementation-artifacts/spec-6-5-deployment-and-environment-wiring.md`

Note: the story is `in-progress` per spec-6-5 frontmatter (opened by an interrupted dev-auto run), but no implementation has completed yet — all tasks below are unstarted; the Vercel wiring task is blocked on Builder credentials.

- [ ] `DEPLOYMENT.md` (repo root) — create the deployment & environment wiring checklist (Vercel import/branches, per-env vars, manual value verification from Story 6.1, gate run order, Web Analytics prod-only check, e2e test submission) — evidence: `DEPLOYMENT.md` does not exist yet. (spec-6-5, Task 1)
- [ ] `package.json` — add `"prelaunch:check": "npm run axe:scan && npm run contrast:check && npm run link:check && npm run perf:budget"` — one-command pre-deploy quality gate — evidence: script absent from package.json. (spec-6-5, Task 2)
- [!] Vercel/EmailOctopus wiring — project connection, per-environment env vars, production e2e test submission, Web Analytics prod-only confirmation — **blocked:** requires the Builder's credentials/account access; must not be fabricated in an unattended run. (spec-6-5, Task 3)

## Cross-cutting & deferred

- [!] CI / pre-commit / pre-push gate wiring for `contrast-check.cjs` and `axe-scan.cjs` — **blocked:** platform/pipeline decision (where the gates live) per spec-6-5's Block If; deferred-work from `_bmad-output/implementation-artifacts/spec-6-3-accessibility-verification-both-modes.md`. (deferred-work source_spec: spec-6-3)
- [ ] Manual `CONTACT_EMAIL` / `EMAIL_OCTOPUS_*` value verification in every Vercel environment — sub-step of Story 6.5 Task 1 (run the `DEPLOYMENT.md` manual checklist); deferred-work from `_bmad-output/implementation-artifacts/spec-6-1-placeholder-purge-and-content-audit.md`, explicitly handed to Story 6.5. (deferred-work source_spec: spec-6-1)
- [!] Resolve the dead Shikigami Agent SDK GitHub link (404s) — file/action: `src/content/index.ts:71` (`githubUrl`), decision on the GitHub side (make repo public / fix URL / fix slug); success = `link:check` returns 200 for it. **blocked:** requires a human decision an unattended run cannot make; included because FR-13's zero-404 launch gate fails while it is dead. (deferred-work source_spec: spec-6-2)
- [ ] Rate limiting / CSRF / origin protection on `/api/contact` — file/action: `src/app/api/contact/route.ts` hardening; owner: Charlie; open action item from the Epic 3 retro, explicitly "Defer to Epic 6 hardening phase" (= this pre-launch sprint) in `_bmad-output/implementation-artifacts/sprint-status.yaml` action_items. (action item: epic-3)
