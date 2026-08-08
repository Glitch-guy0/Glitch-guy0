---
title: 'Epic 6 Story 1: Placeholder purge and content audit'
type: 'chore'
created: '2026-08-08'
status: 'done'
review_loop_iteration: 1
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '460269b7093ef2f649724ea5606cd4c7cd703f83'
final_revision: 'PENDING_COMMIT'
---

<intent-contract>

## Intent

**Problem:** A pre-launch content audit found two items that could ship as "looks unfinished": a shipped project visual whose filename and code comment literally read "placeholder" (inviting exactly the doubt this audit exists to remove, even though the SVG itself is a real, finished, descriptive asset), and a stale dev-only comment (`Contact placeholder (Epic 3)`) left in production JSX.

**Approach:** Rename the Shikigami SVG asset and its in-code references to drop "placeholder" branding (no new visual asset is needed — the audit confirmed it is a real, finished, descriptively-alt-tagged illustration, not a stub), and delete the stale dev comment.

## Boundaries & Constraints

**Always:**
- Rename `public/images/shikigami-placeholder.svg` to `public/images/shikigami-terminal.svg` and update every reference (`src/content/index.ts` `imageSrc` field) to the new path. Do not alter the SVG's visual content, dimensions, or `imageAlt` text — the audit confirmed both are correct and descriptive.
- Update the stale code comment in `src/components/sections/ProjectsSection.tsx` (currently `/* SVG placeholder — use regular img for SVG support */`) to describe the actual reason for the `<img>`/`<Image>` branch (SVG sources need a plain `<img>` because `next/image` cannot optimize SVGs) without using the word "placeholder".
- Delete the stale comment `{/* ── Contact placeholder (Epic 3) ─────────────────────────────── */}` in `src/app/page.tsx` (the Contact section below it is fully implemented, not a placeholder) and replace it with a comment consistent with the section-comment style used for the other funnel sections in the same file (e.g. `{/* ── Contact ──... */}`).
- Grep the full `src/` tree after the rename for any remaining reference to `shikigami-placeholder` or the literal string `"placeholder"` in non-Tailwind, non-test contexts, and resolve every hit found by this story's scope.

**Block If:** none — this story only touches file naming, a comment, and a config fallback; no decision here requires human input.

**Never:**
- Never replace the Shikigami SVG with a new graphic or screenshot — the audit already confirmed it is a finished, real asset; only its "placeholder" naming is the problem.
- Never touch `chaibooklm-landing.jpg`, `persona-chat-landing.jpg`, project URLs, or alt text — the audit found these clean.
- Never change `.env.example`'s placeholder values (`your_email_octopus_api_key_here`, etc.) — those are correctly generic since the file is a template, not shipped config.
- Never widen this story into the link-check crawl (Story 6.2) — this story only fixes what the audit found; it does not build the crawl script.
- Never gate behavior on `NODE_ENV === 'production'` to distinguish Vercel preview from production — Next.js sets `NODE_ENV=production` for every Vercel build (preview and production alike), so any check using it cannot tell the two apart. `CONTACT_EMAIL` production-value verification stays a manual pre-launch checklist item (tracked under Story 6.5), not a code-level enforcement in this story.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Shikigami project render | `featuredProjects[0].imageSrc` after rename | Renders the renamed SVG via the `<img>` branch with unchanged alt text | No error expected |
| `CONTACT_EMAIL` unset, any environment | `process.env.CONTACT_EMAIL` unset/empty | Module exports `'builder@example.com'` fallback (unchanged pre-existing behavior; verifying the real value is set in Vercel production is a manual Story 6.5 checklist item) | No error expected |

</intent-contract>

## Code Map

- `public/images/shikigami-placeholder.svg` -- rename to `public/images/shikigami-terminal.svg`
- `src/content/index.ts` -- update `imageSrc` for the Shikigami Agent SDK entry to the renamed path
- `src/components/sections/ProjectsSection.tsx` -- reword the stale "SVG placeholder" comment
- `src/app/page.tsx` -- delete/reword the stale "Contact placeholder (Epic 3)" section comment

## Tasks & Acceptance

**Execution:**
- [x] `public/images/shikigami-placeholder.svg` -- rename file to `public/images/shikigami-terminal.svg` -- drop misleading "placeholder" branding from a real, finished asset
- [x] `src/content/index.ts` -- update the Shikigami entry's `imageSrc` to `/images/shikigami-terminal.svg` -- keep the reference in sync with the rename
- [x] `src/components/sections/ProjectsSection.tsx` -- reword the `/* SVG placeholder ... */` comment to explain the real reason (next/image can't optimize SVGs) -- remove misleading "placeholder" wording without losing the rationale
- [x] `src/app/page.tsx` -- replace the `{/* ── Contact placeholder (Epic 3) ── */}` comment with a plain `{/* ── Contact ── */}` comment matching sibling sections -- the Contact section is fully implemented, the comment is stale and misleading
- [x] `src/lib/config.ts` -- revert the production-throw change (review found it crashes Vercel preview builds, see Spec Change Log); confirm the original `builder@example.com` fallback behavior is restored -- avoid a build-breaking regression
- [x] grep `src/` for any remaining `shikigami-placeholder` or stray `"placeholder"` content string after the above changes -- confirm the purge is complete

**Acceptance Criteria:**
- Given the production build, when `CONTACT_EMAIL` is set to a real address, then the header/footer/contact `mailto:` links use that address with no errors.
- Given `CONTACT_EMAIL` is unset in any environment (including a Vercel preview build), when the app builds and runs, then it falls back to `builder@example.com` without throwing.
- Given the Projects section renders, when the Shikigami card is displayed, then it loads `/images/shikigami-terminal.svg` with its original, unchanged alt text and visual.
- Given a full-text search of `src/` for `placeholder`, when run after this story's changes, then no hits remain outside legitimate Tailwind `placeholder:` pseudo-class utilities.

## Spec Change Log

### 2026-08-08 — bad_spec amendment (review_loop_iteration 1)
**Triggering finding:** Both review passes (Blind Hunter and Edge Case Hunter) flagged that gating the `CONTACT_EMAIL` throw on `process.env.NODE_ENV === 'production'` is unsafe: Next.js sets `NODE_ENV=production` during every Vercel build, preview included, and epic-6-context explicitly allows preview environments to have no `CONTACT_EMAIL` set. The throw would have crashed every preview build lacking that var — a severe, unintended regression, not the intended "fail loudly only in real production" behavior.
**Amended:** Removed the `CONTACT_EMAIL` production-throw task/AC/Code-Map entry and the corresponding `Always`/I-O-matrix language from the intent-contract; added a `Never` rule against gating on bare `NODE_ENV === 'production'` for environment-distinguishing checks; reverted `src/lib/config.ts` to its original pre-story fallback-only behavior.
**Known-bad state avoided:** A code change in Story 6.1 that would break Vercel preview deployments the first time `CONTACT_EMAIL` is left unset there.
**KEEP:** The SVG rename (`shikigami-placeholder.svg` → `shikigami-terminal.svg`), the `src/content/index.ts` reference update, the `ProjectsSection.tsx` comment reword, and the `page.tsx` "Contact" comment cleanup are all confirmed correct by review and must survive unchanged. Verifying the real `CONTACT_EMAIL` value is actually set in Vercel's production environment remains a manual checklist item, now tracked under Story 6.5 (deployment/environment wiring) instead of enforced in code here.

## Review Triage Log

### 2026-08-08 — Review pass
- intent_gap: 0
- bad_spec: 1 (high 1, medium 0, low 0)
- patch: 0
- defer: 0
- reject: 10 (low 10)
- addressed_findings:
  - `[high]` `[bad_spec]` `CONTACT_EMAIL` production-throw gated on `NODE_ENV==='production'` would crash Vercel preview builds lacking that var, contradicting epic-6-context's allowance for preview to have none set — reverted the code change, trimmed the spec scope, moved manual verification to Story 6.5.

## Verification

**Commands:**
- `npm run build` -- expected: production build succeeds regardless of whether `CONTACT_EMAIL` is set
- `npm run lint` -- expected: no new lint errors
- `grep -rn "placeholder" src/ --include="*.ts" --include="*.tsx" | grep -vi "placeholder:"` -- expected: zero content/comment hits (Tailwind `placeholder:` utility hits are fine and expected)

## Auto Run Result

**Summary:** Purged misleading "placeholder" naming from a real, finished project asset and removed a stale dev comment; a code-level `CONTACT_EMAIL` production enforcement was attempted, found unsafe by review (would crash Vercel preview builds), and reverted — that verification now lives as a manual checklist item for Story 6.5.

**Files changed:**
- `public/images/shikigami-placeholder.svg` → renamed to `public/images/shikigami-terminal.svg` (content unchanged)
- `src/content/index.ts` — `imageSrc` updated to the renamed path
- `src/components/sections/ProjectsSection.tsx` — reworded stale "SVG placeholder" comment
- `src/app/page.tsx` — reworded stale "Contact placeholder (Epic 3)" comment
- `src/lib/config.ts` — touched then reverted to original behavior (see Spec Change Log)

**Review findings breakdown:** 1 bad_spec (high, fixed via revert + spec amendment), 10 rejected as noise (cosmetic/redundant/already-addressed-by-audit), 0 deferred.

**Follow-up review recommendation:** false — the surviving diff is a file rename plus two comment rewords; no behavior change ships.

**Verification performed:** `npm run build` succeeds with no `CONTACT_EMAIL` set; `npm run lint` shows no new errors (one pre-existing, unrelated lint config error confirmed present before this change too); `grep -rn "placeholder" src/` shows zero hits outside Tailwind `placeholder:` utility classes.

**Residual risks:** None from this story's surviving changes. Confirming real `CONTACT_EMAIL`/`EMAIL_OCTOPUS_*` values are set per Vercel environment remains an open manual item, tracked under Story 6.5.
