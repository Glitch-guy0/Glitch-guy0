# Epic 4 Context: Resume

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Provide deep-vetting visitors with a downloadable freelance resume that reflects the portfolio's content. The resume PDF is generated from the content module at build, ensuring it never drifts from the site copy, and a cache-busted download button makes it accessible from header (desktop), footer, and contact section on every viewport.

## Stories

- Story 4.1: Resume PDF generation from content at build
- Story 4.2: Styled resume download button with cache-busting

## Requirements & Constraints

**FR-25 (Resume download button):** A styled button triggers download of `/public/resume.pdf` with cache-busting query (`?v=`), opens in a new tab, carries the `download` attribute, and is reachable from footer and header (desktop); touch targets ≥ 44×44px per design system.

**FR-26 (Freelance resume present at launch):** `/public/resume.pdf` exists, reflects resume.md as content reference (adapted to the Harness Engineer voice), and opens without error as a valid PDF. Regenerating content and rebuilding yields an updated PDF.

**AD-4 (Single-sourced content):** All copy and content live in `src/content/` as typed data. The resume PDF is generated from the same content module at build; resume.md is the reference for hero headline/tagline and Experience work statements only — it is not a Services or About source. No orphan copy.

**Design constraints:** Button styled per `button-primary` spec (white fill, black mono label, 4px radius, gray-fill hover + 100ms grayscale fringe + scale 1.02). Footer and header components render the resume link; mobile touch targets ≥ 44×44px.

## Technical Decisions

**PDF generation:** The md → PDF tool (pandoc, md-to-pdf, or hand-crafted) is a build-time seed choice. Pipeline integrates with the build process so `npm run build` regenerates `/public/resume.pdf` from `src/content` each time.

**Content sourcing:** Resume PDF draws from the content module and resume.md reference. Framing and wording adapt to the Harness Engineer voice and design philosophy, not a literal md-to-PDF export. Hero headline/tagline and Experience work statements (zero-downtime migration, legacy stabilization, Play Store app) are sourced from resume.md.

**Caching strategy:** Download button URL includes `?v={timestamp-or-hash}` query parameter to bust browser cache when the PDF is regenerated at build, ensuring visitors always get the latest version.

**Static deployment:** The PDF resides at `/public/resume.pdf` under Vercel static hosting (no server-side generation at request time).

## UX & Interaction Patterns

**Resume link placement:** Available from footer on all viewports; header displays it on desktop only (per EXPERIENCE.md responsive rules). Opens in new tab with `download` attribute so the browser prompts a save dialog or downloads directly rather than displaying inline.

**Download experience:** Button label is "Resume" or equivalent per content module. Styled as primary CTA to signal importance. Hover fires 100ms grayscale-offset fringe and scales 1.02 (DESIGN.md button-primary spec). Instantly downloadable without form friction.

**Accessibility:** Touch targets ≥ 44×44px on mobile; semantic link with clear label and `download` attribute; visible focus ring ≥ 2px (per WCAG 2.1 AA).

## Cross-Story Dependencies

**Story 4.1 → Story 4.2:** The resume PDF must exist and be valid before the download button can render. Build order: content module → PDF generation → static file placement → button references the static path with cache-bust query.

**Epic 2 dependency:** Content module (Story 2.1, Epic 2) must be complete and typed before resume PDF generation can run; Experience work statements in Story 2.7 feed the resume content.

**Epic 1 dependency:** Footer and header components (Stories 1.6) must exist to mount the resume link; footer is the canonical host on all viewports.
