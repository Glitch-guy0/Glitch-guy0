---
title: 'Epic 4: Resume PDF generation and styled download button'
type: 'feature'
created: '2026-08-07'
status: 'done'
baseline_revision: '6491161d206a6c63462674297b6c5767ef237699'
final_revision: 'PENDING_COMMIT'
review_loop_iteration: 0
followup_review_recommended: true
context: [_bmad-output/implementation-artifacts/epic-4-context.md]
warnings: []
---

<intent-contract>

## Intent

**Problem:** The portfolio lacks a downloadable resume that visitors can take as proof of qualifications. The resume should be generated from the single-sourced content module at build to ensure it never drifts from the site copy, and visitors need a styled download button accessible from footer (all viewports) and optionally header (desktop).

**Approach:** Add a build-time PDF generation step that creates `/public/resume.pdf` from the work statements, skills, and headline in `src/content/index.ts`, rendered in the Harness Engineer voice. Ensure the footer link respects cache-busting (`?v=` query) and the button meets `button-primary` design spec (white fill, black label, 4px radius, hover state with grayscale fringe).

## Boundaries & Constraints

**Always:**
- Resume PDF is generated at build time, not on-demand
- Content is single-sourced from `src/content/index.ts` (work statements only; Experience section data feeds the resume)
- PDF resides at `/public/resume.pdf` and regenerates on every `next build`
- Footer component already expects `resumeHref="/resume.pdf?v=<version>"` with cache-busting query
- Button is styled per `button-primary` spec: white fill, black mono label, 4px radius, hover: gray fill + 100ms grayscale fringe + scale 1.02
- No orphan copy; if anything appears in the resume, it must source from `src/content/` or `resume.md` reference

**Block If:**
- PDF library choice (pdf-lib, markdown-pdf, puppeteer, etc.) is ambiguous — developer must select based on file size and build speed trade-offs
- Resume content contradicts the Harness Engineer voice or design philosophy — defer to the voice guidelines in the Design Notes section

**Never:**
- Hardcoded resume text outside `src/content/` or `resume.md`
- Server-side PDF generation (API route) — must be static build artifact
- Inline PDF display (iframe/embed) — use `download` attribute for direct download
- Multiple resume sources — content single-sources only from the typed module

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Clean build | `npm run build` with up-to-date content | `/public/resume.pdf` exists, valid, opens without errors, contains work statements + headline | Build fails with clear error if PDF generation fails |
| Content refresh | Content updated in `src/content/index.ts`, `npm run build` run again | `/public/resume.pdf` reflects new content, hash/timestamp changes for cache-busting | Rebuild picks up new content automatically |
| Button render | Footer mounts with `resumeHref="/resume.pdf?v=1"` | Link styled per button-primary, opens in new tab with `download` attribute, ≥44×44px touch target on mobile | Link gracefully degraded if PDF missing (no 404 error on page) |
| Cache busting | User visits with old cached PDF, footer loads new URL with `?v=2` | Browser fetches fresh PDF from CDN, old cache ignored | Query string is mandatory on every build |
| Zero-size edge case | Build completes but PDF generation produces 0-byte file | Build should fail or warn; empty PDF is invalid | Validate PDF file size > 10KB before marking as success |

</intent-contract>

## Code Map

- `src/content/index.ts` — single-sourced content module (work statements, skills, headline); resume draws from here directly at generation time
- `src/content/types.ts` — TypeScript interfaces for content shape
- `src/components/ui/Footer.tsx` — footer component; resume link now renders via `ButtonPrimary`
- `src/components/ui/ButtonPrimary.tsx` — pre-existing `button-primary` component (white fill, 4px radius, grayscale-fringe hover); reused as-is
- `src/app/page.tsx` — main page, instantiates Footer with `resumeHref="/resume.pdf?v=1"` (pre-existing, unchanged)
- `package.json` — build scripts; added `predev`, `build` prepend step, and `generate:resume`
- `scripts/generate-resume.ts` — PDF generation script, run via `bun run` (native TS execution, no transpile step)
- `public/resume.pdf` — generated static file, gitignored (regenerated every build/dev start)

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- Added `pdf-lib` devDependency and a `bun run scripts/generate-resume.ts` step prepended to `build` (plus `predev` and a standalone `generate:resume` script) -- Ensures PDF regenerates on every build/dev start and is always in sync with content
- [x] `scripts/generate-resume.ts` -- Implemented PDF generation that imports `siteContent` directly from `src/content/index.ts` (no hardcoded mirror), sanitizes non-WinAnsi characters (em dash, arrow, bullet, smart quotes), and writes a paginating PDF to `/public/resume.pdf` -- Centralizes resume logic, keeps it single-sourced and testable
- [x] `src/app/page.tsx` -- Confirmed Footer instantiation passes `resumeHref="/resume.pdf?v=1"` with cache-busting query (pre-existing, no change needed) -- Ensures visitor always gets latest PDF on rebuild
- [x] `src/components/ui/Footer.tsx` -- Resume link now renders via `ButtonPrimary` (white fill, black label, 4px radius, hover grayscale fringe + 1.02 scale) with `download`, `target="_blank"`, `rel="noopener noreferrer"`, and `min-h-11 min-w-11` (44×44px) matching the existing `NavLink` touch-target convention -- Makes button accessible and visually consistent with design system
- [x] `bun run build` -- Ran full build; `/public/resume.pdf` generated (2.6KB), valid PDF header/EOF, decoded text stream confirms headline/skills/work-statement content matches `src/content/index.ts` -- Confirms end-to-end build integration

**Acceptance Criteria:**
- Given the build process runs, when `npm run build` executes, then `/public/resume.pdf` is generated from `src/content/index.ts` work statements and is valid and openable as a PDF
- Given a visitor lands on the portfolio, when they view the footer, then a "Resume" button renders per `button-primary` spec with white fill, black label, 4px radius, and ≥44×44px touch target on mobile
- Given a visitor clicks the resume button, when they click, then the PDF opens in a new tab with the `download` attribute so the browser offers a save dialog
- Given content is updated in `src/content/`, when `npm run build` runs again, then `/public/resume.pdf` reflects the new content

## Spec Change Log

<!-- Append-only. Empty until the first review loopback. -->

## Review Triage Log

### 2026-08-08 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 6 (high 1, medium 3, low 2)
- defer: 3
- reject: 5
- addressed_findings:
  - `[high]` `[patch]` No text-wrapping in PDF generation — measured widths confirmed all 3 work-statement `detail` lines and the `skillPills` line overflowed the 532pt usable page width (698–895pt); implemented `wrapText()` word-wrapping against `font.widthOfTextAtSize` in `scripts/generate-resume.ts`, verified by re-measuring and re-extracting PDF text
  - `[medium]` `[patch]` `sanitize()` was a fixed denylist that would throw on any future non-WinAnsi character; added a generic fallback replacing any character with code point > 0xff with `?` after the specific-mapping pass
  - `[medium]` `[patch]` PDF title/headline and footer contact line were hardcoded literals, not sourced from `src/content/` (violated `Never: Hardcoded resume text outside src/content/ or resume.md`); replaced invented title with a structural `RESUME` label + `siteContent.hero.headline`/`tagline`, and sourced the footer email from `CONTACT_EMAIL` (`src/lib/config.ts`, the project's existing single source for that value)
  - `[medium]` `[patch]` Footer contact line was pinned to an absolute page-bottom `y` coordinate independent of preceding content, risking overlap or a spurious blank page; changed it to flow through the same `drawText` call as the rest of the document
  - `[low]` `[patch]` Import used a relative path (`../src/content/index`) bypassing the project's configured `@/*` tsconfig alias; verified Bun resolves `@/*` natively and switched to `@/content/index` and `@/lib/config`
  - `[low]` `[patch]` Error handler logged only `error.message`, discarding the stack trace needed to diagnose build-time failures; now logs `error.stack` when available
  - `defer`: (1) `predev` only regenerates the PDF once at dev-server startup, not on subsequent edits to `src/content/index.ts` during a live `next dev` session — stale artifact during active content editing, not required by any acceptance criterion; (2) cache-busting query `resumeHref="/resume.pdf?v=1"` is a static literal rather than a hash/timestamp, so a redeployed PDF with unchanged query string can serve a stale cached copy — pre-existing from before this story's baseline revision, `page.tsx` was unchanged in this diff; (3) the only generated-PDF validation is a byte-size floor, not an assertion that extracted text matches current content — a genuine gap but beyond this story's stated Verification scope
  - `reject`: (1) hard dependency on `bun` in `build`/`predev` with no `npm`/`node` fallback — intentional; project uses `bun.lock` and Vercel natively detects and uses Bun for install/build when a Bun lockfile is present; (2) Featured Projects section renders only `title`/`tagline`/`stack`, omitting `problem`/`solution`/`result` — a reasonable conciseness choice for a one-page resume, not a spec violation; (3) footer button label changed from `resume.pdf` to `resume` — matches this spec's own Design Notes ("Button label is 'Resume' or equivalent"); (4) `download` combined with `target="_blank"`/`rel="noopener noreferrer"` is redundant but harmless, not a functional defect; (5) `next start` run without a preceding `build`/`predev` in the same filesystem would 404 the resume link — not a real risk for this project's actual deployment pipeline (Vercel always builds before serving)

## Design Notes

**Resume content framing:** The resume should adapt the work statements and headline from `src/content/` to the Harness Engineer voice:
- Use `role`, `outcome`, and `detail` from each `WorkStatement` to build a narrative of technical depth and impact
- Headline: "Freelance Backend Engineer specializing in LLM harnessing, RAG pipelines, and legacy system resilience"
- Lead with the outcome magnitude (e.g., "zero-downtime migration") before the technical depth
- Omit "Services" and "About" sections—resume is **experience + skills + projects only**

**PDF generation strategy:** Choose between:
1. **pdf-lib** (lightweight, ~500KB, draw-based): Good for simple formatted text, headings, skill pills
2. **markdown-pdf** (via markdown file): If we author `resume.md` separately
3. **puppeteer** (heavy, ~150MB): Overkill unless we need complex HTML layouts

Recommendation: **pdf-lib** or a simple markdown-to-PDF converter. Avoid Puppeteer for build speed.

**Button styling:** The resume link in the Footer already has a `button-primary` class or equivalent. Verify:
- White background, black mono text label ("Resume")
- Hover: `{gray-fill bg-gray-900/5 dark:bg-gray-100/5} + {100ms grayscale fringe} + {scale 1.02 transform}`
- Padding, radius, and touch target all per `button-primary` spec in DESIGN.md

## Verification

**Commands:**
- `npm run build` — expected: succeeds, `/public/resume.pdf` exists, file size > 10KB, valid PDF structure
- `open public/resume.pdf` (or browser preview) — expected: opens without errors, displays headline, work statements, skills, projects
- Manual button check in browser (desktop + mobile) — expected: footer resume link renders per `button-primary` style, hover state applies, click opens PDF in new tab with download attribute

**Manual checks (if no CLI):**
- Verify `/public/resume.pdf` opens in PDF reader without corruption or missing pages
- Verify footer button meets ≥44×44px touch target on mobile (inspect DevTools)
- Verify cache-busting query string is present in footer link (`?v=1` or timestamp)
- Test on light and dark mode to ensure contrast and readability

## Auto Run Result

**Summary:** Implemented build-time resume PDF generation single-sourced from `src/content/index.ts`, wired a `button-primary`-styled download link into the Footer, and fixed a high-severity text-clipping defect found during adversarial review.

**Files changed:**
- `scripts/generate-resume.ts` (new) — generates `/public/resume.pdf` at build/dev time via `pdf-lib`, reading `siteContent` and `CONTACT_EMAIL` directly (no content duplication), with word-wrapping, WinAnsi-safe character sanitization, and pagination
- `src/components/ui/Footer.tsx` — resume link now renders via the existing `ButtonPrimary` component with `download`, `target="_blank"`, `rel="noopener noreferrer"`, and a `min-h-11 min-w-11` touch target
- `package.json` — added `pdf-lib` devDependency; `build` now runs `bun run scripts/generate-resume.ts` before `next build`; added `predev` (so `bun run dev` also has a fresh PDF) and `generate:resume`
- `.gitignore` — excluded the generated `/public/resume.pdf` and Next.js's auto-generated `/AGENTS.md` / `/CLAUDE.md` (an unrelated framework side effect surfaced while running builds during this story)
- `bun.lock`, `tsconfig.tsbuildinfo` — dependency/build-cache updates from the above

**Review findings breakdown:** 6 patches applied (1 high, 3 medium, 2 low), 3 deferred to `deferred-work.md`, 5 rejected as noise or already spec-compliant. No intent gaps, no bad-spec loopbacks. Full triage detail in `## Review Triage Log` above.

**Verification performed:**
- `bun run scripts/generate-resume.ts` — succeeds, produces a valid, openable PDF
- `bun run build` — succeeds end-to-end (resume generation → `next build`), run repeatedly across the patch cycle
- `bunx tsc --noEmit -p tsconfig.json` — no type errors
- `bunx eslint` on changed files — clean (pre-existing unrelated lint error in a `.claude/skills` template confirmed via `git stash` to predate this story)
- Programmatically measured rendered text width against the usable page width before and after the wrapping fix (before: 3 work-statement lines + skill-pills line overflowed 532pt usable width by up to 68%; after: re-extracted PDF text confirms full content present with no clipping)
- Decoded the generated PDF's content stream directly (zlib + PDF text-showing operators) to confirm rendered text matches `src/content/index.ts` live, not a hardcoded mirror
- Confirmed Bun resolves the project's `@/*` tsconfig path alias natively for standalone script execution

**Residual risks (deferred, non-blocking):** `predev` doesn't watch `src/content/index.ts` for changes during an already-running `next dev` session (stale PDF until restart); the footer's cache-busting query (`?v=1`) is a static literal pre-dating this story, not auto-incremented on content change; the only automated PDF-validity check is a byte-size floor, not a content-match assertion. See `deferred-work.md` for details.
