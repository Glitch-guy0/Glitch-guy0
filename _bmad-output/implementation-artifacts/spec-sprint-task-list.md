---
title: 'Sprint task list & status refresh (Epic 6)'
type: 'chore'
created: '2026-08-08'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '2e81bc2a1bee501a36bc396793528fa064a08637'
---

<intent-contract>

## Intent

**Problem:** The current sprint (Epic 6: Launch Readiness & Quality Gates) has no consolidated task list — remaining work is scattered across story specs 6-4/6-5, deferred-work.md, and open retro action items — and sprint-status.yaml's story statuses lag the spec frontmatter (spec-6-5 says `in-progress` while the status file still says `ready-for-dev`), so the sprint cannot be tracked at a glance.

**Approach:** Create `sprint-task-list.md` in the implementation artifacts enumerating every remaining Epic 6 task with status, source, and file/action — sourced from the spec-6-4 and spec-6-5 task lists, epic-6-scoped deferred-work entries, and open action items explicitly deferred to Epic 6 hardening — then update `sprint-status.yaml` so story statuses match the spec frontmatter and current repo state, refreshing `last_updated`.

## Boundaries & Constraints

**Always:**
- Create `_bmad-output/implementation-artifacts/sprint-task-list.md` with one section per remaining story (6.4, 6.5) plus a cross-cutting section for epic-6-scoped deferred-work/action items. Every task carries a file/action, a status token (`[ ]` todo, `[~]` in-progress, `[x]` done, `[!]` blocked), and a source citation (spec ID, deferred-work entry, or action item).
- Derive each task's status from its source of truth: story spec frontmatter, the task's checked state in that spec, and actual repo state (`DEPLOYMENT.md` existence, `package.json` scripts, `scripts/testing/` contents).
- Update `sprint-status.yaml` so `6-4-performance-budget: in-progress` and `6-5-deployment-and-environment-wiring: in-progress` (matching spec frontmatter) and refresh `last_updated` to today with an accurate summary comment. Quote the `last_updated` YAML value so the file parses as valid YAML (the current unquoted value contains a `: ` sequence that makes strict parsers fail). Never downgrade any status.
- Preserve the `action_items` section of `sprint-status.yaml` unchanged.

**Block If:** none — this chore only reads and consolidates existing artifacts; tasks that need the Builder's credentials or a human decision are enumerated and marked `[!] blocked` with the reason, never executed.

**Never:**
- Never fabricate a task status, completion evidence, or source citation.
- Never modify story spec content or frontmatter as part of this chore (statuses are read from them, not written to them).
- Never touch the application codebase (`src/`, `scripts/testing/`, `package.json` deps) — this chore produces and updates tracking artifacts only.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Spec frontmatter ahead of status file | spec-6-5 status=`in-progress`, sprint-status 6-5=`ready-for-dev` | sprint-status bumped to `in-progress` | Status is only ever raised, never downgraded |
| Task needs Builder credentials or a human decision | Vercel wiring; dead Shikigami GitHub link | Marked `[!]` blocked with the specific reason | Never marked done or omitted |
| Deferred-work entry is not Epic 6 scoped | resume content density, cookie preferences | Excluded from the sprint task list | Scope boundary documented in the task list intro |
| Status file not valid YAML | Unquoted `:` in `last_updated` value | Value quoted; `yaml.safe_load` succeeds | File reparsed and verified after the fix |

</intent-contract>

## Code Map

- `_bmad-output/implementation-artifacts/sprint-task-list.md` -- new: the consolidated Epic 6 sprint task list
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- update story statuses and `last_updated`, preserve `action_items`

## Tasks & Acceptance

**Execution:**
- [x] `_bmad-output/implementation-artifacts/sprint-task-list.md` -- create the sprint task list: remaining spec-6-4 and spec-6-5 tasks (with their current checked state), epic-6-scoped deferred-work entries, and open action items deferred to Epic 6 hardening, each with status token, source, and file/action -- makes the sprint trackable at a glance
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- set `6-4-performance-budget: in-progress` and `6-5-deployment-and-environment-wiring: in-progress`, refresh `last_updated` (date + accurate summary, quoted so the file is valid YAML), keep `action_items` byte-for-byte unchanged -- makes the status file consistent with the actual sprint state and parseable

**Acceptance Criteria:**
- Given the current artifact state, when the sprint task list is created, then it enumerates every remaining Epic 6 story task from the spec-6-4 and spec-6-5 task lists plus every epic-6-scoped deferred-work entry and open action item, each with a status token, source citation, and file/action, and no task is marked done without supporting evidence.
- Given the story spec frontmatter, when sprint-status.yaml is updated, then `6-5-deployment-and-environment-wiring` reads `in-progress`, `6-4-performance-budget` stays `in-progress`, no status is downgraded, `last_updated` is today, the file parses as valid YAML, and the `action_items` section is unchanged.
- Given tasks requiring Builder credentials or a human decision, when enumerated, then they are marked blocked with the specific reason rather than done or omitted.

## Spec Change Log

## Review Triage Log

### 2026-08-08 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 10 (medium 5, low 5)
- defer: 0
- reject: 2 (medium 1, low 1)
- addressed_findings:
  - `[medium]` `patch` Story 6.4 Task 3 corrected from `[~]` to `[ ]` (no started work), command sequence fixed to `npm run build` → `npm run start &` → `npm run perf:budget` (the `build && start &` chain backgrounded the whole chain so the gate ran against no server), and a `< 90` fallback branch added.
  - `[medium]` `patch` Story 6.5 in-progress-vs-all-unstarted contradiction resolved: explicit note in the task list and an inline comment in sprint-status.yaml surfacing that tasks are unstarted and Vercel wiring is blocked on Builder credentials.
  - `[medium]` `patch` CI/pre-commit/pre-push gate wiring marked `[!]` blocked (platform/pipeline decision per spec-6-5 Block If) instead of `[ ]`, consistent with the Vercel/dead-link blocked treatment.
  - `[medium]` `patch` Scope wording corrected to accurate attributions (spec-6-1 → Story 6.5; spec-6-3 → Story 6.5; spec-6-2 dead link → FR-13 zero-404 launch gate), "Epic 6 hardening phase" defined as this pre-launch sprint, and the trackers for out-of-scope items named.
  - `[medium]` `patch` CONTACT_EMAIL verification cross-cutting item clarified as a sub-step of Story 6.5 Task 1 (DEPLOYMENT.md checklist) to remove double-count ambiguity.
  - `[low]` `patch` Story 6.4 Task 1/2 evidence strengthened: note added that spec-6-4 checkboxes lag repo state, and Task 2 evidence cites conformance (assert ≥ 90, prints metrics, exit code) rather than bare file existence.
  - `[low]` `patch` Dead-link item given a concrete file/action (`src/content/index.ts:71`, GitHub-side decision, success = link-check 200).
  - `[low]` `patch` Task list header `Generated` renamed to `Created` to avoid false equivalence with sprint-status.yaml's `generated` field.
  - `[low]` `patch` Per-item owner added to the rate-limit action item (Charlie), preserving accountability dropped in consolidation.
  - `[low]` `patch` epic-6-retrospective explicitly declared optional and tracked only in sprint-status.yaml, so it is neither silently dropped nor double-tracked.

## Verification

**Commands:**
- `python3 -c "import yaml; yaml.safe_load(open('_bmad-output/implementation-artifacts/sprint-status.yaml')); print('valid yaml')"` -- expected: `valid yaml`
- `rg -n "6-4-performance-budget|6-5-deployment-and-environment-wiring|last_updated" _bmad-output/implementation-artifacts/sprint-status.yaml` -- expected: both stories `in-progress`, `last_updated` today

**Manual checks:**
- `sprint-task-list.md` exists, every task has a status token + source, and blocked tasks cite their reason.
- `action_items` section of sprint-status.yaml is identical to the pre-run snapshot.

## Auto Run Result

**Status:** done

**Summary of implemented change:** Created `sprint-task-list.md` — the consolidated task list for the current sprint (Epic 6: Launch Readiness & Quality Gates) covering the remaining Story 6.4/6.5 tasks, epic-6-scoped deferred-work, and the action item deferred to Epic 6 hardening — and updated `sprint-status.yaml` so `6-4-performance-budget` and `6-5-deployment-and-environment-wiring` read `in-progress` (matching spec frontmatter), `last_updated` is refreshed, the `last_updated` value is quoted to make the file valid YAML, and the `action_items` section is unchanged.

**Files changed:**
- `_bmad-output/implementation-artifacts/sprint-task-list.md` -- new: the sprint task list (statuses, sources, file/actions, blocked reasons)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- statuses raised to `in-progress` for 6-4/6-5, `last_updated` refreshed + quoted (valid YAML), clarifying inline comments, `action_items` preserved
- `_bmad-output/implementation-artifacts/spec-sprint-task-list.md` -- this spec

**Review findings breakdown:** 10 patches applied (5 medium, 5 low — status accuracy, cross-artifact consistency, scope attribution, actionability/evidence wording); 2 rejected (one misattributed baseline comparison vs committed HEAD rather than the pre-change working tree; one by-design duplicate metadata mandated by the sprint-planning skill); 0 deferred; 0 intent gaps; 0 bad specs.

**Follow-up review recommendation:** false (all fixes are localized doc-level consistency edits to two small tracking artifacts; no behavior/API/security/data impact).

**Verification performed:** `yaml.safe_load` on sprint-status.yaml → `valid yaml`; `6-5-deployment-and-environment-wiring: in-progress` confirmed; task list read back with every task carrying a status token + source + file/action; `git diff` on sprint-status.yaml shows zero hunks in the `action_items` block.

**Residual risks:** `sprint-status.yaml`'s committed baseline shows 6-4/6-5 at `backlog` because the preceding story work (specs 6-4/6-5, `perf-budget.cjs`, `package.json`, `bun.lock`) remains uncommitted in the working tree and is not part of this chore's commit. Story 6.4's recorded perf score and Story 6.5's `DEPLOYMENT.md`/`prelaunch:check` are still outstanding (tracked as open tasks in `sprint-task-list.md`).
