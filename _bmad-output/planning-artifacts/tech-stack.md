# Glitch-guy0 — Tech Stack (build blueprint)

> Source of truth for **how** the v1 portfolio gets built, derived from the PRD (`_bmad-output/planning-artifacts/prds/prd-Glitch-guy0-2026-08-06/prd.md`), UX spines (`DESIGN.md`, `EXPERIENCE.md`), and decision records. Fields marked **FILL** are the Builder's to complete.

## Stack (locked by planning docs)

| Layer | Choice | Detail / version (FILL) |
|---|---|---|
| Framework | Next.js (App Router) | FILL (e.g. 14.x / 15.x) |
| Styling | Tailwind CSS | FILL version |
| Hosting | Vercel | FILL project/region |
| Analytics | Vercel Web Analytics | cookie-consent gated |
| Contact delivery | EmailOctopus (free tier) | FILL account / list ID |
| Fonts | Space Grotesk / IBM Plex Mono / Inter | self-hosted, subset + preloaded |
| Glitch FX | CSS-only base (no canvas/WebGL/video) | scanlines + noise 3–6%, 100–400ms grayscale-offset bursts |
| Animations | **GSAP** (+ ScrollTrigger, `@gsap/react`) | glitch bursts, hover fringes, form states, section reveals, scroll-linked motion; `gsap.matchMedia()` for reduced-motion |
| Smooth scrolling | **Lenis** | inertial scroll layer; drive via GSAP ticker (one RAF loop) |

## Language / runtime

- TypeScript: FILL (e.g. "strict mode on")
- Node: v24.19.0
- Package manager: FILL (pnpm / npm / bun)

## Key dependencies (FILL per need)

| Purpose | Package | Notes |
|---|---|---|
| Animations | `gsap` + `@gsap/react` | all motion — glitch bursts, hover fringes, form states, ScrollTrigger reveals; `gsap.matchMedia()` reduced-motion |
| Smooth scroll | `lenis` | client-only provider; sync with GSAP ticker |
| Form validation | FILL | e.g. zod + react-hook-form, or plain |
| Email send | FILL | wrap EmailOctopus API (server-side only) |
| Accessibility check | `axe-core` | build-time, both color modes |
| Link check | FILL | pre-launch crawl script (FR-13 / SM-2) |
| PDF generation | FILL | resume.md → /public/resume.pdf at build |

## Environment variables

Provided at build time as env variables. Template at `.env.example` — copy to `.env` and fill. Everything below is server-side only except the public contact email.

| Var | Purpose | Public? |
|---|---|---|
| `EMAIL_OCTOPUS_API_KEY` | EmailOctopus API key | no |
| `EMAIL_OCTOPUS_LIST_ID` | List that receives contact submissions | no |
| `CONTACT_EMAIL` | mailto fallback + footer/header email | yes |

## Design tokens (from UX DESIGN.md)

- **Palette:** strictly monochrome — no chromatic color. Dark: `#000000` / `#111111` / ink `#FFFFFF`-`#3D3D3D` / hairline `#262626`. Light: `#F4F2EE` / `#FFFFFF` / ink `#111111`-`#A8A49C` / hairline `#DCD8D0`.
- **Primary CTA:** white fill, black label; hover gray fill + grayscale-offset fringe.
- **Type ramp:** Space Grotesk 700 (display/headings), Inter 400 (body 16–18px/1.6), IBM Plex Mono (labels/meta 12–13px, 0.08em tracking).
- **Radii:** 2–6px (sharp). **Breakpoints:** 360 / 768 / 1280px. **Gutters:** 20px mobile / 48px desktop. Content max 1080px.

## Build inputs (missing — need the Builder)

- Shikigami Agent SDK project visual (screenshot/GIF)
- EmailOctopus account + API key (FILL)
- resume.pdf (generated from `_bmad-output/planning-artifacts/resume.md`, adapted to Harness voice)
- Project screenshots/GIFs already exist for ChaiBookLM + ChaiChat in `_bmad-output/planning-artifacts/project-images/`

## Quality gates

- **Performance:** Lighthouse ≥ 90 mobile (no autoplay video / WebGL).
- **Accessibility:** WCAG 2.1 AA; contrast ≥ 4.5:1 both modes via axe-core; glitches disabled under `prefers-reduced-motion`; focus rings ≥ 2px white; touch targets ≥ 44×44.
- **Reliability:** contact route must never silently fail; pre-launch link crawl reports zero 404s/timeouts.
- **Commands (FILL):**
  - dev: FILL
  - build: FILL
  - lint: FILL
  - typecheck: FILL
  - test: FILL
  - axe-check: FILL
  - link-check: FILL

## Out of scope (v1)

No geo-split, no pricing, no blog, no testimonials, no per-offer CTAs, no color palette beyond b/w, no multi-route IA.
