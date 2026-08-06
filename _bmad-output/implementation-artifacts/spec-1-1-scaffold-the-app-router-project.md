---
title: 'Story 1.1: Scaffold the App Router project'
type: 'feature'
created: '2026-08-06'
status: 'done'
baseline_revision: 'd593fb4eb8c0175f1b5ffa03d4fd8ff3a9c4ef65'
final_revision: '4d8ecedd8ba38672fbc097c92648c1f5854a0794'
review_loop_iteration: 0
followup_review_recommended: false
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** The repository lacks the foundation Next.js App Router project structure, TypeScript configuration, and Tailwind setup required to build the portfolio application.

**Approach:** Scaffold a Next.js App Router project using create-next-app with TypeScript, Tailwind CSS, ESLint, App Router, `src/` directory, and Turbopack; clean up standard boilerplate template files; verify build and linting commands pass cleanly.

## Boundaries & Constraints

**Always:** Use standard `src/` directory structure with `@/` import alias. Ensure `.env` is git-ignored and `.env.example` is created and committed. Ensure strict TypeScript settings.

**Block If:** Scaffolding requires structural changes to `_bmad` or `_bmad-output` directories.

**Never:** Leave default Next.js demo content, SVG icons, or template boilerplate images in `src/app/` or `public/`. Never expose secret keys in committed files.

</intent-contract>

## Code Map

- `package.json` -- Dependencies and script definitions
- `tsconfig.json` -- TypeScript configuration with strict mode and `@/*` path aliases
- `src/app/layout.tsx` -- Root App Router layout Server Component
- `src/app/page.tsx` -- Root page Server Component
- `src/app/globals.css` -- Global CSS styling entry point
- `.env.example` -- Environment variable documentation template
- `.gitignore` -- Git exclusion rules including `.env` and `.next/`

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- Scaffold project & verify scripts -- Initialize Next.js project with App Router, TypeScript, Tailwind, ESLint, Turbopack
- [x] `src/app/page.tsx` -- Clean boilerplate content -- Replace Next.js starter hero/links with baseline minimal layout shell placeholder
- [x] `src/app/layout.tsx` -- Set root metadata and HTML shell -- Implement clean RootLayout Server Component
- [x] `.env.example` -- Document required environment variables -- Create environment variable template file
- [x] `.gitignore` -- Ensure environment and build outputs are ignored -- Verify `.env*` and `.next/` ignore patterns

**Acceptance Criteria:**
- Given STARTER-1 tech stack, when scaffolded with Next.js App Router, then project exists under `src/` with `@/` import alias.
- Given environment variable configuration rules, when `.env.example` is created, then it documents `EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID`, and `CONTACT_EMAIL` while `.env` is in `.gitignore`.
- Given project setup complete, when running `npm run build` and `npm run lint`, then both commands exit with code 0.

## Spec Change Log

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 0
- defer: 0
- reject: 0
- addressed_findings:
  - none

## Verification

**Commands:**
- `npm run build` -- expected: Build completes with zero errors
- `npm run lint` -- expected: ESLint passes with zero warnings or errors
