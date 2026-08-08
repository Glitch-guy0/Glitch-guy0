# Glitch-guy0 — Tech Stack (build blueprint)

> Source of truth for **how** the v1 portfolio gets built, derived from the PRD, UX spines, and decision records.

## Stack

| Layer | Choice | Detail / version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x, `npx create-next-app@latest --ts --tailwind --eslint --app --src-dir --turbopack` |
| Styling | Tailwind CSS | v4, CSS-first (`@theme` in `globals.css`) |
| Hosting | Vercel | one project; `main` → prod, PR → preview |
| Analytics | Vercel Web Analytics | cookie-consent gated, production-only |
| Contact delivery | EmailOctopus (free tier) | API v2 |
| Fonts | Space Grotesk / IBM Plex Mono / Inter | self-hosted, subset + preloaded |
| Glitch FX | CSS-only base (no canvas/WebGL/video) | scanlines + noise 3–6%, 100–400ms grayscale-offset bursts |
| Animations | GSAP (+ ScrollTrigger, `@gsap/react`) | glitch bursts, hover fringes, form states, section reveals; `gsap.matchMedia()` reduced-motion |
| Smooth scrolling | Lenis | inertial scroll on the GSAP ticker (one RAF loop) |

## Language / runtime

- TypeScript: strict mode on
- Node: v24.19.0
- Package manager: pnpm / npm / bun

## Key dependencies

| Purpose | Package | Notes |
|---|---|---|
| Animations | `gsap` + `@gsap/react` | all motion |
| Smooth scroll | `lenis` | client-only; sync with GSAP ticker |
| Form validation | `zod` | shared schema, server-side |
| Email send | EmailOctopus API v2 | server-side only |
| Accessibility check | `axe-core` | build-time, both modes |
| Link check | `link-check.cjs` | pre-launch crawl (FR-13 / SM-2) |
| Contrast check | `contrast-check.cjs` | build-time, both modes |
| PDF generation | `pdf-lib` + `scripts/generate-resume.ts` | resume.md → `/public/resume.pdf` at build |

## Quality-gate npm scripts

- `dev` / `build` / `lint` / `start`
- `axe:scan` — accessibility (axe-core, both modes)
- `contrast:check` — contrast pairs ≥ 4.5:1
- `link:check` — pre-launch crawl, zero 404s/timeouts
- `perf:budget` — Lighthouse ≥ 90 mobile
- `prelaunch:check` — chains all four gates in order, exits non-zero on first failure

## Environment variables

Template at `.env.example` — copy to `.env` and fill. Server-side only except the public contact email.

| Var | Purpose | Public? |
|---|---|---|
| `EMAIL_OCTOPUS_API_KEY` | EmailOctopus API key | no |
| `EMAIL_OCTOPUS_LIST_ID` | List receiving contact submissions | no |
| `CONTACT_EMAIL` | mailto fallback + footer/header email | yes |
| `NEXT_PUBLIC_DEBUG_COMPONENTS` | debug overlay toggle (`false` in prod) | yes |

## Design tokens (from `DESIGN.md`)

- **Palette:** strictly monochrome. Dark: `#000000` / `#111111` / ink `#FFFFFF`–`#3D3D3D` / hairline `#262626`. Light: `#F4F2EE` / `#FFFFFF` / ink `#111111`–`#A8A49C` / hairline `#DCD8D0`.
- **Primary CTA:** white fill, black label; hover gray fill + grayscale-offset fringe.
- **Type ramp:** Space Grotesk 700 (display/headings), Inter 400 (body 16–18px/1.6), IBM Plex Mono (labels/meta 12–13px, 0.08em tracking).
- **Radii:** 2–6px. **Breakpoints:** 360 / 768 / 1280px. **Gutters:** 20px mobile / 48px desktop. Content max 1080px.

## Quality gates

- **Performance:** Lighthouse ≥ 90 mobile; animations opacity/transform only; no autoplay video/WebGL.
- **Accessibility:** WCAG 2.1 AA; contrast ≥ 4.5:1 both modes; glitches disabled under `prefers-reduced-motion`; focus rings ≥ 2px white; touch targets ≥ 44×44.
- **Reliability:** contact route never silently fails; pre-launch link crawl reports zero 404s/timeouts.

## Out of scope (v1)

No geo-split, no pricing, no blog, no testimonials, no per-offer CTAs, no color palette beyond b/w, no multi-route IA.
