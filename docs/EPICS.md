# Glitch-guy0 — Epic & Story Breakdown

Complete decomposition of PRD + UX + Architecture requirements into implementable stories. All six epics are **done** (sprint complete 2026-08-08).

## Epic 1: Site Foundation & Design System
Visitors load a branded, fast, responsive, accessible shell with working navigation and reachable email.
**FRs:** FR-1, FR-2

| Story | Deliverable |
|---|---|
| 1.1 Scaffold the App Router project | Clean Next.js App Router + TS strict under `src/`, `@/` alias, `.env.example`, boilerplate removed, dev/build/lint pass |
| 1.2 Design token system | Tailwind v4 `@theme` in `globals.css`; every visual value declared once; light mode re-binds; zero raw literals in components |
| 1.3 Typography system | Space Grotesk / Inter / IBM Plex Mono self-hosted via `next/font`, subset + preloaded |
| 1.4 Component library | button-primary/secondary, nav-link, project-card, skill-pill, form-field, section-number, footer — token-driven |
| 1.5 Motion & glitch engine | GSAP + Lenis on one ticker; scanlines/noise 3–6%; 100–400ms bursts; one reduced-motion policy |
| 1.6 Layout shell — header & footer | Fixed header, anchors via Lenis + back-button hash, `mailto:` everywhere |
| 1.7 Accessibility floor | Landmarks, skip link, ≥2px focus rings, `aria-live`, axe-clean in both modes |

## Epic 2: Trust & Capability Sections
Visitors scan the full funnel (Hero → Services → Projects → About → Skills → Experience) and evaluate the offer in 15–30s.
**FRs:** FR-3..FR-12, FR-14..FR-18

| Story | Deliverable |
|---|---|
| 2.1 Content module | `src/content/` typed single source of all copy (AD-4) |
| 2.2 Hero section | First-person "I build X for Y" + one primary CTA |
| 2.3 Services — three packaged offers | 3 offers, deliverables + timelines, no pricing, no per-offer CTA |
| 2.4 Projects — featured entries | 3 entries (SDK leads), problem → solution → result, one visual, Live/GitHub links |
| 2.5 Projects — secondary showcase | chaiGPT + future, GitHub links, visually distinct |
| 2.6 About & Skills | Honest about copy + 6–8 harness-first pills, no bars |
| 2.7 Experience — work statements | 2–3 outcome-framed statements with magnitude |
| 2.8 Responsive verification | Clean at 360/768/1280px, touch targets ≥ 44×44 |

## Epic 3: Contact Flow
Visitors convert with a flawless form; Builder receives qualified contacts via EmailOctopus.
**FRs:** FR-19..FR-24

| Story | Deliverable |
|---|---|
| 3.1 Shared validation schema & wire contract | `src/lib/contact/schema.ts` — `{ name, email, message }` → `{ ok, error? }` |
| 3.2 Contact API route | `POST /api/contact` → EmailOctopus API v2, honeypot, never silent 200 |
| 3.3 Contact form island | Name/Email/Message, inline accessible errors, success/error replace form |
| 3.4 Contacts metric & spam verification | metric = list count; honeypot drops bots without counting |

## Epic 4: Resume
Deep-vetting visitors download a working freelance resume reflecting portfolio content.
**FRs:** FR-25, FR-26

| Story | Deliverable |
|---|---|
| 4.1 Resume PDF generation | `/public/resume.pdf` generated from `src/content` at build |
| 4.2 Resume download button | Styled button, cache-busted `?v=`, new tab, `download`, ≥44×44 |

## Epic 5: Analytics & Consent
Visitors get a compliant, consent-aware site; Builder sees engagement and contacts data.
**FRs:** FR-27, FR-28, FR-29

| Story | Deliverable |
|---|---|
| 5.1 Cookie consent banner | Single line + Accept/Decline, `Esc` dismiss, persists under `glitch-guy0:consent` |
| 5.2 Analytics app-code injection | `@vercel/analytics` behind consent, production-only, no dashboard auto-injection |
| 5.3 Contacts metric measurement | EmailOctopus list count viewable |

## Epic 6: Launch Readiness & Quality Gates
A zero-friction, launch-ready site: no placeholders, zero dead links, axe-clean, Lighthouse ≥ 90, wired deployment.
**FRs:** FR-13

| Story | Deliverable |
|---|---|
| 6.1 Placeholder purge & content audit | Zero lorem/TBD/empty links/stub visuals |
| 6.2 Pre-launch link-check crawl | `link-check.cjs` — zero 404s/timeouts, repeatable npm command |
| 6.3 Accessibility verification in both modes | axe-clean dark + light; contrast ≥ 4.5:1; reduced-motion disables glitch |
| 6.4 Performance budget | `perf-budget.cjs` Lighthouse ≥ 90 mobile — measured **95/100** |
| 6.5 Deployment & environment wiring | `DEPLOYMENT.md` + `prelaunch:check`; Vercel wiring human-owned |

> **Human-owned post-sprint items** (moved to `deferred-work.md`): Vercel/EmailOctopus account wiring, CI/pre-commit gate wiring, dead Shikigami link resolution, `/api/contact` rate limiting.
