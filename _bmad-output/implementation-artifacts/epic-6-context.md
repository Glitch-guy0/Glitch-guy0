# Epic 6 Context: Launch Readiness & Quality Gates

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Prove the site is genuinely launch-ready rather than assuming it: purge every placeholder, verify every outbound link resolves, confirm accessibility and performance targets are actually met (not just designed for), and wire the production deployment so the full Visit → Trust → Capability → Contact funnel runs end to end. This epic is the gate between "built" and "shipped" — nothing here adds features; everything here verifies and hardens what Epics 1–5 produced.

## Stories

- Story 6.1: Placeholder purge and content audit
- Story 6.2: Pre-launch link-check crawl
- Story 6.3: Accessibility verification in both modes
- Story 6.4: Performance budget
- Story 6.5: Deployment and environment wiring

## Requirements & Constraints

- No placeholder markers (lorem ipsum, "TBD," empty links, stub visuals) may survive at launch; every Project Entry visual must be the real asset with descriptive alt text.
- A repeatable, scripted crawl (an npm command) must check all declared outbound links — GitHub repos, live demos, `mailto:`, resume PDF — and the launch gate fails on any 404 or timeout.
- Accessibility must be verified, not assumed: axe-core run against the **built** site in both dark and light mode must report zero serious/critical violations; load-bearing contrast pairs must measure ≥ 4.5:1 in both modes.
- A manual accessibility pass must confirm keyboard navigation works in funnel order, focus is always visible, and `prefers-reduced-motion` disables all glitch keyframes and Lenis smoothing.
- Lighthouse run against the production build on mobile must score ≥ 90 performance, with no regression introduced by the glitch/scanline layer; all motion must remain opacity/transform-only (no layout-thrashing properties).
- Production deployment must be fully wired: `main` branch deploys to production, PR branches get preview deployments, and a real end-to-end test submission confirms the funnel (Visit → Trust → Capability → Contact) closes in production.
- Environment variables (`EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID`, `CONTACT_EMAIL`) must be configured per Vercel environment (production gets real values; preview gets test values or none).
- Web Analytics must run in production only — never in preview/dev.
- Cost constraint: free tiers only (Vercel, EmailOctopus) — no paid dependency added to satisfy any of these gates without an explicit decision.

## Technical Decisions

- The link-check script lives at `scripts/link-check` and is exposed as a repeatable npm command; its implementation is a build seed, but the "zero 404s/timeouts" launch gate itself is not negotiable.
- Accessibility checking uses `axe-core` at build time against both color modes — this is the canonical a11y verification tool for the project; no alternative a11y tool should be introduced.
- Performance and motion are coupled: all glitch/scanline/scroll animation goes through the centralized motion engine (`src/lib/motion/engine` + `MotionProvider.island`), animates only `opacity`/`transform`, and is gated by one `prefers-reduced-motion` policy implemented in two coordinated halves — a global CSS media-query rule disabling glitch keyframes, and a `gsap.matchMedia()` gate disabling JS tweens and Lenis smoothing. Verification in this epic must exercise both halves, not just the CSS rule.
- Deployment target is a single Vercel project: `main` → production, PR branches → preview deployments, environment variables configured per-environment in the Vercel dashboard (not committed). No custom domain is decided for launch — the default `*.vercel.app` URL is acceptable.
- Vercel Web Analytics injection is app-code only (`<Analytics />` from `@vercel/analytics`, mounted behind explicit visitor consent) and must run in production only — this constraint is part of the deployment-wiring verification, not just the analytics epic.
- No secrets belong in the client bundle; `EMAIL_OCTOPUS_*` vars are server-only and read exclusively by the contact API route. `CONTACT_EMAIL` is the only public-facing env var.
- The contact flow's reliability contract (never fails silently; client preserves input and offers retry on failure) is what the end-to-end deployment test submission is validating — this epic verifies that contract holds in the real production environment, not just in local/dev testing.

## Cross-Story Dependencies

- Story 6.1 (placeholder purge) should complete before 6.2 (link-check), since a placeholder link would otherwise register as a link-check failure the audit should have already caught.
- Story 6.3 (accessibility) and 6.4 (performance) both require a production-equivalent **built** site (not dev server) to produce valid results, and both depend on the motion engine and token/typography work from Epic 1 being complete.
- Story 6.5 (deployment wiring) depends on all prior epics' functional work being complete, since its end-to-end test submission exercises the full funnel (Trust sections from Epic 2, Contact Flow from Epic 3, Resume from Epic 4, consent-gated Analytics from Epic 5).
- Story 6.5 also depends on Story 6.3/6.4 gates being satisfied on the deployed build where feasible, since the production deployment is the actual artifact being certified as launch-ready.
