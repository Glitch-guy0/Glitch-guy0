# Epic 2 Context: Trust & Capability Sections

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Visitors scan the full funnel — Hero → Services → Projects → About → Skills → Experience — and evaluate the Builder's offer and proof in 15–30 seconds. This epic replaces all "Section content lands in Epic 2" placeholders with real, typed-content-driven sections that follow the established design token system and motion engine from Epic 1.

## Stories

- Story 2.1: Content module — typed copy single-sourced in `src/content/`
- Story 2.2: Hero section — outcome headline above the fold + single primary CTA
- Story 2.3: Services — three packaged offers with deliverables and timelines; no pricing
- Story 2.4: Projects — three featured entries (problem → solution → result + visual)
- Story 2.5: Projects — secondary showcase (chaiGPT) with GitHub link
- Story 2.6: About & Skills sections — honest copy + 6–8 skill pills; no rating bars
- Story 2.7: Experience — 2–3 outcome-framed work statements with magnitude
- Story 2.8: Responsive verification — no horizontal scroll at 360/768/1280px

## Requirements & Constraints

- Hero outcome headline ("I build X for Y") must appear above the fold at both desktop and mobile; fires a single 100–400ms glitch burst on load then stays stable.
- Exactly one primary CTA in Hero; activating it scrolls to Contact or opens an email draft.
- Services: each card shows name, 1–2 line scope, deliverables list, and timeline in mono. No price, no per-offer action button. Contact reachable ≤ 3 clicks via the page's single primary CTA.
- Projects featured entries: Shikigami Agent SDK is first in DOM order. Each entry has problem, solution, and result blocks with quantified magnitude, one visual with descriptive alt text, a working GitHub link, and a live link where demo exists (ChaiBookLM, ChaiChat). chaiGPT is GitHub-only.
- Secondary showcase (Story 2.5): visually distinct from featured entries; no problem → solution → result framing.
- About: concise first-person copy; no false credentials.
- Skills: 6–8 pills naming skill domains (not tool lists), no percentage bars or level bars.
- Experience: 2–3 work statements, each with outcome + magnitude. The zero-downtime migration is a work statement here, not a featured project.
- Responsive: no horizontal scroll at 360/768/1280px. Projects 3-up / 2-up / stacked per breakpoint. Hero uses `display-mobile` ramp under 768px. All CTAs ≥ 44×44px on mobile.
- All copy lives in `src/content/` — no JSX string literals for content (AD-4).
- All sections are Server Components (`"use client"` only on islands from Epic 1).
- Token-driven only: no raw hex/px literals in components; use CSS tokens or Tailwind utility classes.
- Glitch bursts on section-header viewport entry (via existing `data-glitch-burst` + `data-reveal` attributes wired by MotionProvider).

## Technical Decisions

- **Content module shape:** `src/content/types.ts` defines interfaces; `src/content/index.ts` exports the canonical data object. PRD-approved sets (offers, projects, pills) are canonical; resume.md feeds hero headline/tagline and Experience work statements only.
- **Sections are Server Components** rendered in `src/app/page.tsx`. Each section gets its own component file under `src/components/sections/`.
- **ProjectCard** from `src/components/ui/ProjectCard.tsx` and **SkillPill** from `src/components/ui/SkillPill.tsx` are the primitives; use them without modification.
- **ButtonPrimary** / **ButtonSecondary** from `src/components/ui/` are the CTA primitives.
- **Existing section anchors** are already declared in `page.tsx`; replace the placeholder `<p>` inside each `<section>` with the real section component.
- **Project images** for ChaiBookLM and ChaiChat already exist in `_bmad-output/planning-artifacts/project-images/`; copy them to `public/images/` and reference via `<Image />` from `next/image`.
- **Shikigami SDK visual**: no real screenshot is available; create a styled code-terminal SVG placeholder with descriptive alt text and a hairline frame (fixed-aspect, no layout shift per UX-DR12).
- **Section-reveal + burst** attributes (`data-reveal`, `data-glitch-burst`) must be placed on the section heading elements; the MotionProvider already wires these.

## UX & Interaction Patterns

- Hero: large display-size heading (sentence-case "I build the harness around LLMs…"), one ButtonPrimary CTA pointing to `#contact`. Optional secondary link to `#projects`.
- Services: 3-column grid at desktop / 1-column at mobile. Each card is a `<div>` with `bg-surface-raised`, `border-border-hairline`, `rounded-md`. Timeline line in `font-mono text-mono-meta`.
- Projects featured: 3-column grid at ≥ 1280px, 2-column at 768–1279px, 1-column at < 768px. Use existing `ProjectCard`. Visual uses `next/image` with fixed aspect ratio wrapper (`aspect-[16/9]`).
- Skills: flex-wrap pill row using `SkillPill`.
- About + Skills rendered together in one section block.
- Experience: ordered list or vertical stack of `<article>` blocks.

## Cross-Story Dependencies

- Story 2.1 must be implemented first — all other stories in this epic consume `src/content/`.
- Stories 2.2–2.7 can be implemented sequentially after 2.1; each replaces the placeholder for its section.
- Story 2.8 is verification and runs last after all sections are in place.
- Epic 1 primitives (ProjectCard, SkillPill, ButtonPrimary, ButtonSecondary, SectionNumber) are already implemented and must not be modified.
- The `data-reveal` and `data-glitch-burst` attributes are already understood by the MotionProvider; place them on section headings as done in the placeholder.
