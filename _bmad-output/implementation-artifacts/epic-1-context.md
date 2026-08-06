# Epic 1 Context: Site Foundation & Design System

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Visitors load a branded, fast, responsive, accessible shell with working navigation and reachable email — the paved path every other epic sits on.

## Stories

- Story 1.1: Scaffold the App Router project
- Story 1.2: Design token system
- Story 1.3: Typography system
- Story 1.4: Component library
- Story 1.5: Motion & glitch engine
- Story 1.6: Layout shell — header & footer
- Story 1.7: Accessibility floor

## Requirements & Constraints

- FR-1: Anchored section navigation — header nav links smooth-scroll to each of the seven sections with the current position visibly indicated; anchor jumps work with the browser back button.
- FR-2: Email always reachable — a `mailto:` link renders in both header and footer, visible on every viewport size.
- NFR-1 (Performance): Lighthouse ≥ 90 mobile target; fast render on 3G/mid-tier mobile; opacity/transform animations only; no autoplay video/WebGL.
- NFR-2 (Accessibility): WCAG 2.1 AA — body/mono contrast ≥ 4.5:1 in both color modes; alt text on all visuals; keyboard-navigable with visible focus (≥ 2px); touch targets ≥ 44×44px.
- NFR-3 (Motion accessibility): Glitch effects respect `prefers-reduced-motion` (disabled outright); no flashing > 3×/s; bursts 100–400ms with snap-back; glitches never on body text, form fields, or the page as a whole.

## Technical Decisions

- Stack: Next.js App Router (React, TypeScript strict, Tailwind v4, Turbopack) initialized via `npx create-next-app@latest --ts --tailwind --eslint --app --src-dir --turbopack`.
- Token system: Single-sourced in Tailwind v4 `@theme` in `src/styles/globals.css`. One token name per value; light mode re-binds values. Zero raw design literals in components.
- Motion architecture: Centralized in `src/lib/motion/engine` + `MotionProvider.island` (GSAP 3.12+ + Lenis 1.x `lenis/react`). Single GSAP ticker integration (`autoRaf: false`, `lenis.raf(time * 1000)`, `gsap.ticker.lagSmoothing(0)`). Glitch keyframes CSS-only.
- Server-first layout: Page and section wrappers are Server Components. `"use client"` restricted to dynamic islands (`MotionProvider`, `Header`, `ContactForm`, `CookieBanner`).
- Section identity/anchor contract: Fixed IDs `#hero`, `#services`, `#projects`, `#about`, `#skills`, `#experience`, `#contact` (+ `#top`). Real `<a href="#section">` anchors with Lenis `scrollTo`, hash in URL for back-button compatibility.

## UX & Interaction Patterns

- Monochrome color palette defined via CSS variables with light mode re-binding.
- Three typography roles loaded self-hosted via `next/font`: Space Grotesk 700 (display/headings), Inter 400 (body), IBM Plex Mono (mono labels/metadata).
- CSS-only scanlines + noise (3–6% opacity, `aria-hidden`) and glitch bursts (100–400ms grayscale offset + jitter, instant snap-back).
- Fixed header transparent until scroll, gaining hairline bottom border, with visible active section state.

## Cross-Story Dependencies

- Story 1.1 must precede all other stories to establish `src/`, TypeScript config, and dependencies.
- Story 1.2 and 1.3 define design tokens and fonts required by Story 1.4 (Component Library).
- Story 1.4 primitives are required by Story 1.6 (Layout Shell).
- Story 1.5 (Motion Engine) integrates into Story 1.6 (Layout Shell).
- Story 1.7 verifies accessibility across all Epic 1 output.
