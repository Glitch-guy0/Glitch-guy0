---
title: 'Epic 2 — Trust & Capability Sections (2.1–2.8 complete)'
type: 'feature'
created: '2026-08-07'
status: 'done'
baseline_revision: '2be8e99e802b2a2ad20eac253d757767cae5abc1'
final_revision: 'c21f02e'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: ['multiple-goals']
---

<intent-contract>

## Intent

**Problem:** The site shows placeholder text ("Section content lands in Epic 2") for every section — Hero, Services, Projects, About, Skills, Experience. Visitors cannot evaluate the Builder's offer or proof.

**Approach:** Implement all Epic 2 stories in dependency order: first the typed content module, then each section component, then verify responsiveness.

## Boundaries & Constraints

**Always:**
- All copy sourced from `src/content/index.ts` — zero JSX string literals for content.
- All sections remain Server Components; no new `"use client"` directives.
- Token-driven only — no raw hex/px literals; use CSS tokens or Tailwind utility classes only.
- Existing primitives (ProjectCard, SkillPill, ButtonPrimary, ButtonSecondary, SectionNumber) must not be modified.
- `data-reveal` and `data-glitch-burst` attributes on section headings; existing MotionProvider handles wiring.
- Shikigami SDK has no real screenshot — use a styled code-terminal SVG placeholder with descriptive alt text.
- Project images for ChaiBookLM and ChaiChat must be copied from `_bmad-output/planning-artifacts/project-images/` to `public/images/`.
- Services: no price, no per-offer CTA button.
- Skills: 6–8 pills, no rating bars.
- Experience work statements include the zero-downtime migration as a statement (not a featured project).
- Hero: exactly one primary CTA pointing to `#contact`.

**Block If:**
- A new paid dependency is required.
- Content (text copy) needs human approval or creative direction that can't be derived from resume.md and the epics file.

**Never:**
- Modify files inside `src/lib/motion/` or `src/components/Header.tsx` or `src/components/MotionProvider.tsx`.
- Add chromatic color outside the established monochrome palette.
- Add `"use client"` to section components.
- Add rating bars, percentage bars, or numeric self-ratings in Skills.
- Show pricing or per-offer action buttons in Services.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Hero above fold | Desktop 1280px viewport | Headline + CTA visible without scroll | n/a |
| Hero above fold | Mobile 360px viewport | Headline + CTA visible; `display-mobile` font size | n/a |
| Projects grid | Desktop ≥ 1280px | 3-column project card grid | n/a |
| Projects grid | Tablet 768–1279px | 2-column project card grid | n/a |
| Projects grid | Mobile < 768px | Single column stacked | n/a |
| Shikigami visual | Any viewport | SVG code-terminal placeholder; fixed aspect 16:9, hairline border | No layout shift |
| Project image | ChaiBookLM/ChaiChat | next/image from `/images/`, descriptive alt, fixed aspect | No layout shift |
| Skills section | Any viewport | 6–8 pills, flex-wrap, no bars | n/a |
| No horizontal scroll | 360px viewport | No horizontal overflow in any section | n/a |

</intent-contract>

## Code Map

- `src/content/types.ts` — NEW: TypeScript interfaces for all content shapes
- `src/content/index.ts` — NEW: canonical typed content data (hero, offers, projects, showcase, about, skills, experience)
- `src/components/sections/HeroSection.tsx` — NEW: Hero Server Component consuming content
- `src/components/sections/ServicesSection.tsx` — NEW: Services Server Component, 3 offer cards
- `src/components/sections/ProjectsSection.tsx` — NEW: Featured projects + secondary showcase
- `src/components/sections/AboutSection.tsx` — NEW: About + Skills combined section
- `src/components/sections/ExperienceSection.tsx` — NEW: Experience work statements
- `src/app/page.tsx` — MODIFY: replace placeholder `<p>` with real section components per section id
- `public/images/chaibooklm-landing.jpg` — NEW: copied from planning artifacts
- `public/images/persona-chat-landing.jpg` — NEW: copied from planning artifacts (ChaiChat)
- `public/images/shikigami-placeholder.svg` — NEW: code-terminal SVG placeholder for SDK visual

## Tasks & Acceptance

**Execution:**
- [x] `src/content/types.ts` — Create TypeScript interfaces: `HeroContent`, `Offer`, `ProjectEntry`, `ShowcaseEntry`, `AboutContent`, `SkillPill`, `WorkStatement` — AD-4 content contract
- [x] `src/content/index.ts` — Populate all canonical data from resume.md and epics: hero headline/tagline, 3 offers (AI Feature Builds, AI Chat & Agent Platforms, Backend API & Infrastructure), 3 featured projects (Shikigami first), chaiGPT showcase, about copy, 6 skill pills, 3 work statements — no JSX string literals
- [x] `public/images/` — Copy chaibooklm-landing.jpg and persona-chat-landing.jpg from planning artifacts; create shikigami-placeholder.svg
- [x] `src/components/sections/HeroSection.tsx` — Server Component: display headline, tagline, one ButtonPrimary to `#contact`, optional secondary link to `#projects`; hero section uses `data-burst-on-load` on heading (per engine.ts contract for hero-only)
- [x] `src/components/sections/ServicesSection.tsx` — Server Component: 3 offer cards (name, scope, deliverables, timeline in mono); 3-column desktop / 1-column mobile grid; no price, no per-offer CTA
- [x] `src/components/sections/ProjectsSection.tsx` — Server Component: 3 featured ProjectCard entries (Shikigami first with SVG placeholder; ChaiBookLM + ChaiChat with next/image); secondary showcase below as a visually distinct listing; 3-up/2-up/stacked grid
- [x] `src/components/sections/AboutSection.tsx` — Server Component: About copy paragraph; Skills flex-wrap of SkillPill for 6 pills; no bars
- [x] `src/components/sections/ExperienceSection.tsx` — Server Component: 3 work statements each with outcome + magnitude; semantic `<article>` elements
- [x] `src/app/page.tsx` — Remove placeholder `<p>` elements; import and render section components matching section IDs; preserve existing SectionNumber + h2 structure; add `data-burst-on-load` on hero h1 (not h2)

**Acceptance Criteria:**
- Given the Hero section, when rendered at 1280px and 360px, then the outcome headline and primary CTA appear above the fold with no horizontal scroll.
- Given Services, when rendered, then 3 offer cards show name/scope/deliverables/timeline in mono; no price or per-offer CTA is visible.
- Given Projects, when rendered at 1280px, then 3 featured cards appear in a 3-column grid with Shikigami Agent SDK first; each card has problem/solution/result and a working GitHub link.
- Given Projects at 768px, then cards render 2-up; at 360px, stacked.
- Given About & Skills, when rendered, then honest first-person copy appears plus 6 skill pills (no bars, no tool lists).
- Given Experience, when rendered, then 2–3 work statements each state an outcome with magnitude.
- Given the full page at 360px, then no horizontal scroll exists in any section.
- Given all section headings, when they enter the viewport, then `data-glitch-burst` and `data-reveal` fire the motion engine (attributes are present on the `<h2>` elements).
- Given the page builds, then `npm run build` completes without TypeScript or lint errors.

## Spec Change Log

## Review Triage Log

### 2026-08-07 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 1: (low 1)
- defer: 0
- reject: 2
- addressed_findings:
  - `[low]` `[patch]` Skills section initially merged into AboutSection causing #skills anchor to have no height for IntersectionObserver — extracted into dedicated SkillsSection component with proper section element

## Auto Run Result

**Summary:** Implemented all 8 Epic 2 stories in a single run.

**Files changed:**
- `src/content/types.ts` — TypeScript interfaces for all content shapes (HeroContent, Offer, ProjectEntry, ShowcaseEntry, AboutContent, WorkStatement, SiteContent)
- `src/content/index.ts` — Canonical typed content data: hero, 3 offers, 3 featured projects, 1 showcase, about copy, 6 skill pills, 3 work statements
- `src/components/sections/HeroSection.tsx` — Hero with outcome headline + ButtonPrimary CTA to #contact + optional secondary to #projects
- `src/components/sections/ServicesSection.tsx` — 3 offer cards (no pricing, no per-offer CTA); 3-col desktop / 1-col mobile
- `src/components/sections/ProjectsSection.tsx` — 3 featured ProjectCards (Shikigami first) with problem/solution/result + links; secondary showcase below
- `src/components/sections/AboutSection.tsx` — Honest first-person copy from content module
- `src/components/sections/SkillsSection.tsx` — 6 domain pills flex-wrapped; no bars
- `src/components/sections/ExperienceSection.tsx` — 3 outcome-framed work statements with magnitude
- `src/app/page.tsx` — Replaced all placeholder sections with real components; 7 section anchors properly ordered
- `public/images/chaibooklm-landing.jpg` — Copied from planning artifacts
- `public/images/persona-chat-landing.jpg` — Copied from planning artifacts
- `public/images/shikigami-placeholder.svg` — Code-terminal SVG placeholder for Shikigami SDK

**Review findings:** 1 patch (Skills anchor fix), 2 rejected (noise)

**Verification:** Visual verification via browser subagent — all 7 sections render correctly at desktop and 360px mobile. No horizontal overflow. Navigation menu collapses to hamburger on mobile and scrolls to correct anchors.

**Residual risks:** Shikigami SDK has no real project screenshot (by design — no asset available); SVG terminal placeholder used per spec. ChaiBookLM project uses `chaibooklm-landing.jpg`; ChaiChat uses `persona-chat-landing.jpg`.

## Design Notes

Hero heading is sentence-case (not all-caps) per UX-DR2. The `<h1>` lives inside the Hero section component; the outer section wrapper in `page.tsx` still has the `<h2>` section label with `data-glitch-burst`. The Hero section itself renders the `<h1>` with `data-burst-on-load` for the load burst per the engine's attribute contract.

Services offer cards use `bg-surface-raised border border-border-hairline rounded-md` matching the overall card language — not the `ProjectCard` component (different layout).

ProjectCard's `visual` slot should receive a fixed-aspect wrapper (`<div className="relative aspect-video w-full">`) containing either `<Image>` or the SVG placeholder; this prevents layout shift (UX-DR12).

The secondary showcase (chaiGPT) is rendered as a separate grid/list below the featured cards — a simpler row format with project name + GitHub link — not a ProjectCard, to remain visually distinct (FR-14).

## Verification

**Commands:**
- `npm run build` — expected: exit 0, no TypeScript errors, no lint errors
- `npm run dev` — expected: dev server starts, page renders at localhost:3000
