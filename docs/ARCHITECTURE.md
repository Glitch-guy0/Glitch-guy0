---
name: Glitch-guy0
type: architecture-spine
purpose: build-substrate
paradigm: island architecture (server-rendered content + small client islands)
scope: v1 freelance harness-engineer portfolio
status: final
created: 2026-08-06
updated: 2026-08-08
---

# Architecture Spine — Glitch-guy0

## Design Paradigm

**Island architecture.** The page is fully server-rendered content with small, isolated client components ("islands") mounted on top for motion, the contact form, and cookie consent. Content is baked at build; nothing fetches at runtime. This keeps the page static and fast, and the client bundle small and predictable.

| Layer | Responsibility | Home |
| --- | --- | --- |
| Content | All copy | `src/content/` |
| Tokens | Design system values | `src/styles/globals.css` (`@theme`) |
| Sections | Server-rendered composition | `src/components/` |
| Islands | Interactive leaves (Motion, ContactForm, CookieBanner, Header) | `src/components/*/island` |
| lib | Pure logic, no React | `src/lib/` |
| Route | `POST /api/contact` (the only runtime code) | `src/app/api/contact/route.ts` |

## Invariants & Rules

Dependency direction is a rule: leaves (`content`, `tokens`, `lib/*`, `env`) never depend on components. Server sections never import island internals — only mount them. Islands may import the shared validation schema but never the service (no env access). The contact route depends on `lib/contact` and env, never on components or content.

### AD-1 — Design tokens are the single source of visual truth

Every visual value is declared once as a Tailwind v4 `@theme` token in `src/styles/globals.css`. Tokens have one name each; light mode re-binds the same names under a light-theme selector — never a `-light` second name set, never added colors. Components contain zero raw design literals (token utilities or `var(--token)` only). Adding a visual value is an addition to the token layer, never a local constant.

### AD-2 — Motion is centralized and gated by one reduced-motion policy

All motion goes through `src/lib/motion/engine` + `MotionProvider.island` (GSAP 3.12+ + Lenis 1.x). One reduced-motion policy in two halves: (1) a global CSS `@media (prefers-reduced-motion: reduce)` rule disables every glitch keyframe outright; (2) a single `gsap.matchMedia()` gate disables JS tweens and Lenis smoothing (instant reveal, native scroll). Mobile ~30% intensity reduction is a single amplitude token. Lenis runs on the GSAP ticker: `autoRaf: false`, `lenis.raf(time * 1000)` (ticker passes **seconds**), `gsap.ticker.lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, `ScrollTrigger.refresh()` after mount. Glitch keyframes are CSS-only, defined once: 100–400ms grayscale-offset + jitter with instant snap-back, never on body text, form fields, the contact form, or the whole page. No other animation library.

### AD-3 — The contact flow is a closed loop that never fails silently

Wire contract pinned: payload `{ name, email, message }`, response envelope `{ ok: boolean, error?: string }`. One shared zod schema in `src/lib/contact/schema.ts` is the only source of field rules for both client and server. Flow: client validates → `POST /api/contact` → server re-validates → checks honeypot (hidden `website`; filled → `{ ok: true }` with no delivery) → calls EmailOctopus API v2 (`create-contact`, `status: "SUBSCRIBED"`, source tag) → returns `{ ok: true }` or `{ ok: false, error }` with a non-2xx status. Client decides by `body.ok`, never by HTTP status alone. The route is the only module reading `EMAIL_OCTOPUS_*` (server-only). Contacts metric = EmailOctopus list member count (each valid submission creates exactly one member). On failure the client preserves input, shows an accessible inline error, and offers retry without reload.

### AD-4 — All copy and content are single-sourced

All copy lives once in `src/content/` as typed data. Source authority is explicit: PRD-approved sets are canonical for offers, featured projects + showcase, skill pills, and section structure; resume.md is the reference only for the hero headline/tagline and Experience work statements. Sections render content only — no JSX string literals for content. The resume PDF is generated from the same content at build. Editing copy means editing the content module, never a component.

### AD-5 — Server-first; client islands sit at the boundary

The page and all seven sections are server components. `"use client"` is limited to islands: MotionProvider, Header, ContactForm, CookieBanner. Islands never import server components; server sections mount islands rather than importing internals. `useGSAP` and all window/DOM access run only inside islands. Zero client-side data fetching.

### AD-6 — Analytics are consent-gated at a single surface

Vercel Web Analytics is **cookieless** (day-scoped request hash) — the consent gate is a conservative privacy posture, not a cookie requirement. It initializes only after the visitor Accepts, persisted under the single key `glitch-guy0:consent` = `"accepted" | "declined"`. CookieBanner is the sole owner of that key and the only consent surface. Injection is app-code only (`<Analytics />` behind consent state) — dashboard-level auto-injection is forbidden. No analytics outside production; no other analytics provider.

### AD-7 — Static-first; no runtime data services

The site renders fully static. No database, no auth, no server-side state. Only transient client state (form submission + consent). All outbound external calls come from `/api/contact` only.

### AD-8 — Section identity and anchor contract

Section `id`s are fixed and unique: `#hero #services #projects #about #skills #experience #contact` (`#top` for top-of-page). Nav items are real `<a href="#section">` anchors; the click handler smooth-scrolls via Lenis `scrollTo` but leaves the hash in the URL so back-button works. Any hash navigation fires `ScrollTrigger.refresh()` after scroll settles. Header/footer render `mailto:` from server-side `CONTACT_EMAIL` on every viewport.

## Consistency Conventions

| Concern | Convention |
| --- | --- |
| Naming | Components PascalCase; islands carry an `Island` suffix + top-of-file `"use client"`; content data camelCase in `src/content/`; lib modules pure (no React) |
| Data & formats | Contact payload `{ name, email, message }`; API envelope `{ ok, error? }`; dates ISO-8601; consent key `glitch-guy0:consent` |
| State & cross-cutting | Errors never swallowed (FR-22); no secret in the client bundle; env vars follow `.env.example` |
| Content sourcing | Every visible string traces to `src/content/` |
| Accessibility & quality | Axe-core at build in both modes; contrast ≥ 4.5:1; focus rings ≥ 2px white; touch targets ≥ 44×44px; Lighthouse ≥ 90 mobile |

## Stack

Seed verified at authoring; the code owns exact versions once it exists.

| Name | Version |
| --- | --- |
| Next.js (App Router) | 16.x — scaffold `npx create-next-app@latest --ts --tailwind --eslint --app --src-dir --turbopack` |
| React | latest stable with scaffolded Next.js |
| TypeScript | strict mode on |
| Tailwind CSS | v4 — CSS-first (`@theme` in `globals.css`) |
| GSAP | 3.12+ (core + ScrollTrigger + `@gsap/react`) |
| Lenis | 1.x — `lenis/react` (`ReactLenis`), not the retired `@studio-freight/react-lenis` |
| zod | latest (shared validation schema) |
| axe-core | latest (build-time accessibility check) |
| Vercel | hosting + Web Analytics (cookieless) |
| EmailOctopus | API v2 |

## Structural Seed

```text
src/
  app/
    page.tsx              # single page: sections in funnel order
    layout.tsx            # fonts, MotionProvider, Header/Footer shell
    api/contact/route.ts  # POST handler — the only runtime code path
  components/
    header/  footer/  motion/  hero/  services/  projects/
    about/  skills/  experience/  contact/  cookie-banner/  ui/
  content/
    index.ts  types.ts    # single source of copy (AD-4)
  lib/
    motion/engine.ts      # GSAP+Lenis, reduced-motion policy (AD-2)
    contact/              # schema.ts + EmailOctopus service (AD-3)
  styles/
    globals.css           # @theme tokens (AD-1), glitch keyframes + reduced-motion (AD-2)
public/
  resume.pdf              # generated from src/content at build (AD-4)
  <project visuals>       # one per featured project
.env                      # from .env.example — server-side only
```

**Deployment & environments.** One Vercel project. `main` → production; PR branches → preview. Env vars per environment. Web Analytics production-only (AD-6). See [`DEPLOYMENT.md`](../DEPLOYMENT.md).

## Capability → Architecture Map

| Capability | Lives in | Governed by |
| --- | --- | --- |
| Hero | `components/hero` | AD-1, AD-4, AD-5, AD-8 |
| Services / offers | `components/services` + `content` | AD-4, AD-1 |
| Projects + showcase | `components/projects` + `content` + `public` | AD-4, AD-1 |
| About / Skills / Experience | sections + `content` | AD-4, AD-1 |
| Navigation | `components/header` + section `id`s | AD-8, AD-5 |
| Contact flow | `ContactForm.island` + `api/contact/route.ts` + `lib/contact` | AD-3, AD-5 |
| Resume PDF | `public/resume.pdf` from `content` | AD-4 |
| Analytics + consent | `CookieBanner.island` + `@vercel/analytics` | AD-6 |
| Motion, glitch FX, a11y | `lib/motion/engine` + `MotionProvider.island` + `styles/globals.css` | AD-2, AD-1 |
| Performance (Lighthouse ≥ 90) | whole page | AD-5, AD-7 |

## Deferred

- Contacts metric on-site view (metric = EmailOctopus list count).
- v2 (geo-split, pricing, buyer-segment, availability, blog, LinkedIn) — out of scope, gated on post-launch visitor data.
