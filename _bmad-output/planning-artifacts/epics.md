---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - prds/prd-Glitch-guy0-2026-08-06/prd.md
  - architecture/architecture-Glitch-guy0-2026-08-06/ARCHITECTURE-SPINE.md
  - ux-designs/ux-Glitch-guy0-2026-08-06/DESIGN.md
  - ux-designs/ux-Glitch-guy0-2026-08-06/EXPERIENCE.md
---

# Glitch-guy0 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Glitch-guy0, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR-1: Anchored section navigation — header nav links smooth-scroll to each of the seven sections with the current position visibly indicated; anchor jumps work with the browser back button.
- FR-2: Email always reachable — a `mailto:` link renders in both header and footer, visible on every viewport size.
- FR-3: Responsive layout — the entire Portfolio reads and acts without horizontal scroll or broken layout at 360px, 768px, and 1280px; all CTAs and form fields have touch targets ≥ 44×44px on mobile.
- FR-4: Outcome headline — the Hero renders a first-person outcome statement ("I build X for Y") using the resume.md headline/tagline; headline + supporting line fit above the fold at desktop and mobile.
- FR-5: Hero primary CTA — exactly one primary CTA that lands at Contact or opens an email draft.
- FR-6: Three packaged offers — Services renders exactly three offers (AI Feature Build — RAG & Agent Harness 1–4 wks; AI Chat/Agent Platform MVP 4–8 wks; Backend Stabilization & Migration 1–3 wks), each with name, deliverable list, and timeline.
- FR-7: No pricing in v1 — no Offer displays a price, rate, or currency.
- FR-8: Offer-to-contact path — no per-offer action button; Contact stays reachable from Services in ≤ 3 taps/clicks via the header/hero CTA.
- FR-9: Curated project entries — each Project Entry is a problem → solution → result story with the result stated with a magnitude; featured set is Shikigami Agent SDK, ChaiBookLM, ChaiChat.
- FR-10: Harness-flavored project lead — the Shikigami Agent SDK is the first Project Entry in DOM order.
- FR-11: One visual per project — each Project Entry renders exactly one screenshot/GIF with descriptive alt text.
- FR-12: Live and GitHub links — every Project Entry has a working GitHub link; live links render where demos exist (ChaiBookLM, ChaiChat); chaiGPT is GitHub-only.
- FR-13: No placeholder content at launch — no lorem ipsum, TBD, or empty links; a pre-launch scripted crawl of all outbound links reports zero 404s/timeouts.
- FR-14: Secondary showcase — the remaining work (chaiGPT and future additions) renders in a showcase listing with GitHub links, visually distinct from featured entries.
- FR-15: Honest work-focused about copy — About renders concise first-person copy that is human, work-related, and free of fabricated claims.
- FR-16: 6–8 skill pills — Skills renders 6–8 named pills led by harness domains (LLM Harnessing, Vector Search, TypeScript/Node.js, Backend & APIs, Databases, AWS, Auth & Security, Architecture), each a skill domain, not a tool list.
- FR-17: No skill rating bars — no percentage, level bar, or numeric self-rating in Skills.
- FR-18: Outcome-framed work statements — Experience renders 2–3 work statements with magnitude (zero-downtime migration, legacy stabilization, shipped mobile app), none reading as a pure responsibility list.
- FR-19: Contact form fields and validation — Contact renders Name, Email, Message; required fields validated client-side with clear, accessible errors.
- FR-20: Form submission reaches EmailOctopus — a valid submission POSTs to the contact API route and is delivered to the Builder's inbox via EmailOctopus; API key never exposed to the client.
- FR-21: Success confirmation — after a successful submission, the Visitor sees a clear success confirmation in the form's place, not a silent redirect.
- FR-22: Visible failure handling — on failure the Visitor sees an error, their input is preserved, and retry is possible without reload.
- FR-23: Spam protection — honeypot + server-side checks; no captcha in v1.
- FR-24: Contacts metric feed — the contact API route records each valid submission so the contacts metric can be measured.
- FR-25: Resume download button — a styled button triggers download of `/public/resume.pdf` (cache-busted `?v=`) per the design system.
- FR-26: Freelance resume present at launch — the resume PDF exists, reflects resume.md as content reference (adapted to design voice), and opens without error.
- FR-27: Vercel Web Analytics on all pages — loads on the Portfolio and reports visits and engagement; no analytics outside production.
- FR-28: Contacts metric measurement — the contacts metric (valid submissions) is measured and viewable by the Builder.
- FR-29: No third-party analytics beyond free tier; consent — v1 ships only Vercel Web Analytics + the contact route; analytics initialize only after consent; banner is accessible, dismissible, and does not obstruct the Contact Flow.

### NonFunctional Requirements

- NFR-1 (Performance): Lighthouse ≥ 90 mobile target; the site renders quickly on 3G and mid-tier mobile; animations are opacity/transform only (GPU-friendly); no autoplay video/WebGL.
- NFR-2 (Accessibility): WCAG 2.1 AA — body/mono contrast ≥ 4.5:1 in both color modes (verified with axe-core at build); alt text on all visuals; keyboard-navigable with visible focus (≥ 2px); touch targets ≥ 44×44px.
- NFR-3 (Motion accessibility): glitch effects respect `prefers-reduced-motion` (disabled outright, not merely reduced); no flashing > 3×/s; bursts 100–400ms with snap-back; glitches never on body text, form fields, or the page as a whole.
- NFR-4 (Reliability): the Contact Flow must never be silently broken; submission failures surfaced to the visitor; pre-launch link crawl reports zero 404s/timeouts (SM-2).
- NFR-5 (Security): EmailOctopus API key server-side only; contact route validates input server-side; no secrets in the client bundle.
- NFR-6 (Observability): Vercel Web Analytics for visits/engagement; contacts metric via the contact route; consent-gated.
- NFR-7 (Privacy): collect only the three contact fields; data flows to EmailOctopus only; consent banner required before analytics.
- NFR-8 (Cost): free tiers only — Vercel (site + Web Analytics), EmailOctopus (email); no paid dependency without a decision.

### Additional Requirements

- STARTER-1: Greenfield scaffold via `npx create-next-app@latest --ts --tailwind --eslint --app --src-dir --turbopack` (Next.js App Router current stable, React, TypeScript strict, Tailwind v4) — impacts Epic 1 Story 1.
- AD-1: Design tokens single-sourced in Tailwind v4 `@theme` in `src/styles/globals.css`; one token name per value, light mode re-binds values; zero raw design literals in components.
- AD-2: Motion centralized in `src/lib/motion/engine` + `MotionProvider.island` (GSAP 3.12+ + Lenis 1.x `lenis/react`); one reduced-motion policy in two halves (global CSS media query + `gsap.matchMedia()`); Lenis on GSAP ticker (`time * 1000`, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, refresh after mount); glitch keyframes CSS-only, once.
- AD-3: Contact flow is a closed loop — wire contract `{ name, email, message }` → `{ ok, error? }`; shared zod schema in `src/lib/contact/schema.ts`; EmailOctopus API v2 with `status: "SUBSCRIBED"` + source tag; honeypot hidden `website` field; client decides by `body.ok`; contacts metric = EmailOctopus list member count.
- AD-4: All copy single-sourced in `src/content/` (typed); PRD-approved sets canonical; resume.md feeds hero headline/tagline + Experience work statements only; resume PDF generated from the same content at build; no JSX string literals for content.
- AD-5: Server-first — page + seven sections are server components; `"use client"` limited to islands (MotionProvider, Header, ContactForm, CookieBanner); zero client-side data fetching; `useGSAP`/DOM only in islands.
- AD-6: Analytics consent-gated — Vercel Web Analytics is cookieless; injected via app code (`<Analytics />` from `@vercel/analytics`) behind consent state; dashboard auto-injection forbidden; consent key `glitch-guy0:consent` = `"accepted" | "declined"`, CookieBanner sole owner; production-only.
- AD-7: Static-first — no database, no auth, no server-side state; only transient client state (form + consent); all outbound calls from `/api/contact` only.
- AD-8: Section identity/anchor contract — fixed ids `#hero #services #projects #about #skills #experience #contact` (+ `#top`); real `<a href="#section">` anchors with Lenis `scrollTo`, hash in URL for back-button, `ScrollTrigger.refresh()` after hash nav; `mailto:` from server-side `CONTACT_EMAIL`.
- DEP-1: Deployment — one Vercel project; `main` → production, PR branches → previews; env vars per environment (`EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID` server-only, `CONTACT_EMAIL` server-read); Web Analytics production-only.
- ENV-1: Env template at `.env.example`; never commit `.env`.

### UX Design Requirements

- UX-DR1: Design token system — declare the full monochrome palette (dark `#000000`/`#111111`/inks `#FFFFFF`–`#3D3D3D`/hairline `#262626`; light `#F4F2EE`/`#FFFFFF`/inks `#111111`–`#A8A49C`/hairline `#DCD8D0`) as CSS variables with one name per value; light mode re-binds, never adds color roles; zero chromatic color.
- UX-DR2: Typography system — three locked roles via `next/font`: Space Grotesk 700 (display 64/40px, headings 32px, heading-sm 20px, all-caps wide-tracking), Inter 400 (body 16–18px/1.6, never glitched), IBM Plex Mono (mono-label 12px 0.08em, mono-meta 13px); self-hosted, subset + preloaded.
- UX-DR3: Component system — implement the DESIGN.md components: button-primary (white fill, black mono label, 4px radius; hover gray fill + 100ms grayscale fringe + scale 1.02), button-secondary (transparent, 1px outline, invert on hover), nav-link (mono label, active = white + weight + flicker), project-card (raised panel, 1px hairline, one visual, problem→solution→result body, mono metadata row), skill-pill (hairline border, hover border→white), form-field (underline-only, focus 2px white underline + glow, error inline mono), section-number (mono `001` prefix), footer.
- UX-DR4: Glitch FX system — CSS-only atmosphere (full-viewport scanlines + noise at 3–6% opacity, fixed, `aria-hidden`) and glitch bursts (100–400ms grayscale-offset + jitter, instant snap-back) fired on hero load, section-header viewport entry, and CTA/card hover; single amplitude token; reduced-motion disables outright.
- UX-DR5: Micro-interactions — cursor/nav hover states, CTA hover glitch, section scroll reveals (fade-in, GPU-only), stagger patterns (≤ 150ms), all snap back; nothing hover-only that hides content on touch.
- UX-DR6: Responsive layout — single-column vertical stack everywhere; 12-col grid ≥ 1024px (Projects 3-up, Services 3-up), 768–1023px (Projects 2-up), < 768px (single column, hero `display-mobile`, glitch intensity reduced ~30%); load-bearing widths 360/768/1280px; gutters 20px mobile / 48px desktop; content max 1080px; section gaps 72px mobile / 112px desktop.
- UX-DR7: Header & navigation behavior — fixed header, transparent until scroll then hairline bottom border, active-section nav state, email reachable on every viewport; smooth scroll via Lenis with back-button-compatible anchors.
- UX-DR8: Contact form states — idle/focus (underline → 2px white glow), submitting (`SUBMITTING…`, disabled, no glitch), success (inline confirmation block "Message sent. I'll reply within a day." + email copy button, no redirect), failure (error block, input preserved, retry button, `aria-live` announcements), no-JS fallback pointing to `mailto:`.
- UX-DR9: Cookie consent banner — cold-load overlay, single line + Accept/Decline, `Esc` dismisses, dismissed state persists, analytics only on Accept, accessible and non-obstructing.
- UX-DR10: Accessibility implementation — semantic landmarks, `aria-label` on icon-only links, decorative scanlines `aria-hidden`, inline errors in `aria-live="assertive"`, alt text on all visuals, visible focus rings ≥ 2px never suppressed, keyboard order = funnel order, color never the only signal; axe-core build check in both modes.
- UX-DR11: Microcopy & voice — terminal personality in labels/headers/section numbers, plain confident grammatical copy on decision-critical text; success/error microcopy per EXPERIENCE.md voice table.
- UX-DR12: Project visuals — exactly one visual per featured entry with descriptive alt text, fixed-aspect placeholder with hairline frame + scanline shimmer (no layout shift); visuals for ChaiBookLM + ChaiChat from `project-images/`, SDK visual is a build input.

### FR Coverage Map

- FR-1: Epic 1 — anchored section navigation (nav links, smooth scroll, back-button anchors)
- FR-2: Epic 1 — email reachable from header and footer on every viewport
- FR-3: Epic 2 — responsive layout at 360/768/1280px, touch targets ≥ 44px
- FR-4: Epic 2 — Hero outcome headline ("I build X for Y") above the fold
- FR-5: Epic 2 — Hero primary CTA to Contact
- FR-6: Epic 2 — three packaged offers with deliverables + timelines
- FR-7: Epic 2 — no pricing in v1
- FR-8: Epic 2 — no per-offer action button; Contact reachable in ≤ 3 clicks
- FR-9: Epic 2 — curated project entries, problem → solution → result with magnitude
- FR-10: Epic 2 — Shikigami Agent SDK leads Projects in DOM order
- FR-11: Epic 2 — one visual per project with descriptive alt text
- FR-12: Epic 2 — working GitHub links; live links where demos exist; chaiGPT GitHub-only
- FR-13: Epic 6 — no placeholder content at launch; pre-launch crawl reports zero 404s
- FR-14: Epic 2 — secondary showcase listing (chaiGPT) with GitHub links
- FR-15: Epic 2 — honest, work-focused About copy
- FR-16: Epic 2 — 6–8 skill pills, harness-first
- FR-17: Epic 2 — no skill rating bars
- FR-18: Epic 2 — outcome-framed work statements with magnitude
- FR-19: Epic 3 — contact form fields (Name, Email, Message) with accessible validation
- FR-20: Epic 3 — valid submission delivered to inbox via EmailOctopus; key server-side
- FR-21: Epic 3 — success confirmation in the form's place
- FR-22: Epic 3 — visible failure handling; input preserved; retry without reload
- FR-23: Epic 3 — spam protection (honeypot + server-side checks), no captcha
- FR-24: Epic 3 — contacts metric feed from the contact route
- FR-25: Epic 4 — resume download button, cache-busted
- FR-26: Epic 4 — freelance resume PDF present at launch, opens without error
- FR-27: Epic 5 — Vercel Web Analytics on the Portfolio, production-only
- FR-28: Epic 5 — contacts metric measured and viewable by the Builder
- FR-29: Epic 5 — no third-party analytics beyond free tier; analytics after consent

## Epic List

### Epic 1: Site Foundation & Design System
Visitors load a branded, fast, responsive, accessible shell with working navigation and reachable email — the paved path every other epic sits on.
**FRs covered:** FR-1, FR-2

### Epic 2: Trust & Capability Sections
Visitors scan the full funnel — Hero → Services → Projects → About → Skills → Experience — and evaluate the Builder's offer and proof in 15–30 seconds.
**FRs covered:** FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-10, FR-11, FR-12, FR-14, FR-15, FR-16, FR-17, FR-18

### Epic 3: Contact Flow
Visitors convert with a flawless form; the Builder receives qualified contacts via EmailOctopus — the funnel's payoff.
**FRs covered:** FR-19, FR-20, FR-21, FR-22, FR-23, FR-24

### Epic 4: Resume
Deep-vetting visitors download a working freelance resume that reflects the portfolio's content.
**FRs covered:** FR-25, FR-26

### Epic 5: Analytics & Consent
Visitors get a compliant, consent-aware site; the Builder sees engagement and contacts data to run the funnel.
**FRs covered:** FR-27, FR-28, FR-29

### Epic 6: Launch Readiness & Quality Gates
A zero-friction, launch-ready site: no placeholders, zero dead links, axe-clean in both modes, Lighthouse ≥ 90, wired deployment.
**FRs covered:** FR-13

## Epic 1: Site Foundation & Design System

### Story 1.1: Scaffold the App Router project

As a developer,
I want the project scaffolded on the pinned stack,
So that everything built after sits on the same paved path.

**Acceptance Criteria:**

**Given** the locked tech stack (STARTER-1, AD-5),
**When** I scaffold with `npx create-next-app@latest --ts --tailwind --eslint --app --src-dir --turbopack`,
**Then** a clean Next.js App Router + TypeScript strict project exists under `src/` with the `@/` import alias and an `.env.example` mirroring the documented vars
**And** boilerplate demo content is removed, `npm run dev`/`build`/`lint` pass, and `.env` is git-ignored while `.env.example` is committed (ENV-1).

### Story 1.2: Design token system

As a developer,
I want all visual values declared once as tokens,
So that components can never hardcode a divergent color or size.

**Acceptance Criteria:**

**Given** DESIGN.md's token block,
**When** the Tailwind v4 `@theme` in `src/styles/globals.css` is populated,
**Then** every color, type role, spacing, radius, and breakpoint has exactly one token name (AD-1)
**And** light mode re-binds the same names to their light values — no `-light` second name set, no chromatic color introduced
**And** a code review confirms zero raw hex/rgba/px literals in any component file (token utilities or `var(--token)` only).

### Story 1.3: Typography system

As a developer,
I want Space Grotesk / Inter / IBM Plex Mono loaded as self-hosted type roles,
So that the terminal voice renders consistently across the site.

**Acceptance Criteria:**

**Given** the type ramp (UX-DR2),
**When** the three fonts load via `next/font` (self-hosted, subset + preloaded),
**Then** display (64/40px, 700), heading (32px), heading-sm (20px), body (16–18px/1.6), mono-label (12px, 0.08em), and mono-meta (13px) map to tokens with correct weights and tracking
**And** the hero line stays sentence-case while headings are all-caps with wide tracking, and no font loads from a CDN.

### Story 1.4: Component library

As a developer,
I want the token-driven primitive components,
So that all sections share one visual language and nothing drifts.

**Acceptance Criteria:**

**Given** the DESIGN.md component specs (UX-DR3),
**When** button-primary, button-secondary, nav-link, project-card, skill-pill, form-field, section-number, and footer are implemented,
**Then** each matches its spec — primary = white fill + black mono label + 4px radius with gray-fill hover + 100ms grayscale fringe + scale 1.02; secondary = transparent + 1px outline inverting on hover; form-field = underline-only with 2px white focus glow
**And** every primitive consumes tokens only and exposes the same props interface; no component defines its own color, radius, or spacing.

### Story 1.5: Motion & glitch engine

As a visitor,
I want the branded glitch and scanline atmosphere with smooth scroll,
So that the site feels like a system that is alive but under control.

**Acceptance Criteria:**

**Given** AD-2 and UX-DR4/UX-DR5,
**When** `src/lib/motion/engine` (pure) and `MotionProvider.island` run GSAP 3 + Lenis 1 on a single GSAP ticker — `autoRaf: false`, `lenis.raf(time * 1000)`, `gsap.ticker.lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, `ScrollTrigger.refresh()` after mount,
**Then** full-viewport scanlines + noise render at 3–6% opacity (`aria-hidden`) and glitch bursts fire 100–400ms with instant snap-back on hero load, section-header viewport entry, and CTA/card hover — never on body text, form fields, or the whole page
**And** one `prefers-reduced-motion` policy operates in two coordinated halves: the global CSS `@media (prefers-reduced-motion: reduce)` rule disables every glitch keyframe and `gsap.matchMedia()` disables JS tweens and Lenis smoothing (instant reveal, native scroll), and the mobile ~30% intensity reduction is a single amplitude token
**And** no other animation library is added (AD-2, NFR-3).

### Story 1.6: Layout shell — header & footer

As a visitor,
I want the site shell with navigation and reachable email,
So that I can move through the funnel and contact the Builder from anywhere.

**Acceptance Criteria:**

**Given** FR-1, FR-2, and AD-8,
**When** the fixed header and footer render,
**Then** the header is transparent until scroll then gains a hairline bottom border, shows the active section, and carries `mailto:` plus real `<a href="#section">` anchors that smooth-scroll via Lenis while leaving the hash in the URL so the browser back button works
**And** the footer renders email, socials, copyright, and a resume link slot, and `mailto:` from server-side `CONTACT_EMAIL` is visible on desktop and mobile in both header and footer
**And** `ScrollTrigger.refresh()` fires after any hash navigation settles (FR-1, FR-2, UX-DR7).

### Story 1.7: Accessibility floor

As a visitor using a screen reader or keyboard,
I want the shell fully operable,
So that the funnel is usable by everyone.

**Acceptance Criteria:**

**Given** UX-DR10 and NFR-2,
**When** landmarks (`header`/`main`/`section` with labelled headings), a skip link, visible ≥ 2px focus rings, `aria-label`s on icon-only links, and `aria-live` regions are in place,
**Then** the shell is fully keyboard-navigable in funnel order with no suppressed focus indicators and no keyboard traps
**And** axe-core reports zero serious/critical violations in both dark and light mode, and load-bearing contrast pairs measure ≥ 4.5:1 (UX-DR10, NFR-2).

## Epic 2: Trust & Capability Sections

### Story 2.1: Content module

As a developer,
I want all copy single-sourced in typed content,
So that sections and the resume can never drift.

**Acceptance Criteria:**

**Given** AD-4,
**When** `src/content/types.ts` and `src/content/index.ts` define the content model,
**Then** hero copy, the three offers, three featured projects + showcase, about, 6–8 skill pills, work statements, and all microcopy (nav labels, form labels, buttons, aria text, success/error copy) live there as typed data
**And** the PRD-approved sets are canonical — offers/projects/pills come from the PRD, resume.md feeds only the hero headline/tagline and Experience work statements, and no JSX string literal carries content (FR-4, FR-6, FR-9, FR-15, FR-16, FR-18).

### Story 2.2: Hero section

As a visitor,
I want a first-person outcome headline with one clear CTA,
So that I know what the Builder does within seconds.

**Acceptance Criteria:**

**Given** FR-4 and FR-5,
**When** the Hero renders from content,
**Then** the "I build X for Y" outcome line and one supporting line fit above the fold at desktop and mobile, render a single 100–400ms glitch burst on load and then stay stable
**And** exactly one primary CTA renders and activating it lands at Contact or opens an email draft (FR-4, FR-5).

### Story 2.3: Services — three packaged offers

As a visitor,
I want three clear offers with deliverables and timelines,
So that I can scope the Builder against my need without price anxiety.

**Acceptance Criteria:**

**Given** FR-6, FR-7, and FR-8,
**When** Services renders the three offers from content,
**Then** each card shows name, 1–2 line scope, deliverables list, and timeline in mono
**And** no price, rate, or currency appears anywhere, no per-offer action button renders, and Contact is reachable from Services in ≤ 3 clicks via the page's single primary CTA (FR-6, FR-7, FR-8).

### Story 2.4: Projects — featured entries

As a visitor,
I want proof framed as problem → solution → result,
So that I can judge real capability fast.

**Acceptance Criteria:**

**Given** FR-9, FR-10, FR-11, and FR-12,
**When** Projects renders the three featured entries from content,
**Then** the Shikigami Agent SDK is the first Project Entry in DOM order
**And** each entry has explicit problem, solution, and result blocks with the result stated at a quantified magnitude
**And** each entry renders exactly one visual with descriptive alt text and a fixed-aspect placeholder (no layout shift), plus a working GitHub link and a Live link where a demo exists (ChaiBookLM, ChaiChat) (FR-9, FR-10, FR-11, FR-12, UX-DR12).

### Story 2.5: Projects — secondary showcase

As a visitor,
I want remaining shipped work listed,
So that depth beyond the three features is visible.

**Acceptance Criteria:**

**Given** FR-14,
**When** the showcase renders chaiGPT (and future additions) from content,
**Then** it shows a working GitHub link per entry, is visually distinct from featured Project Entries, and carries no problem → solution → result framing (FR-14).

### Story 2.6: About & Skills sections

As a visitor,
I want honest context and a scannable skill set,
So that trust and capability are confirmed without walls of text.

**Acceptance Criteria:**

**Given** FR-15, FR-16, and FR-17,
**When** About renders concise first-person copy and Skills renders 6–8 pills, both from content,
**Then** no claim asserts experience, employer, or credential the Builder does not have
**And** each pill names a skill domain (not a tool list), the count is between 6 and 8, and no percentage bar, level bar, or numeric self-rating renders anywhere in Skills (FR-15, FR-16, FR-17).

### Story 2.7: Experience — work statements

As a visitor,
I want outcome-framed work,
So that I can gauge magnitude rather than job duties.

**Acceptance Criteria:**

**Given** FR-18,
**When** Experience renders 2–3 work statements from content (zero-downtime migration, legacy stabilization, shipped mobile app),
**Then** each statement states an outcome with a magnitude and none reads as a pure responsibility list
**And** the migration is a work statement here, not a Project Entry (FR-18).

### Story 2.8: Responsive verification

As a visitor on any device,
I want every section to lay out cleanly,
So that nothing is clipped or broken.

**Acceptance Criteria:**

**Given** FR-3 and UX-DR6,
**When** all sections are verified at 360px, 768px, and 1280px,
**Then** there is no horizontal scroll or overlapping/clipped content, Projects render 3-up / 2-up / stacked per breakpoint, the hero uses the `display-mobile` ramp under 768px, and every CTA and form target measures ≥ 44×44px on mobile (FR-3, UX-DR6).

## Epic 3: Contact Flow

### Story 3.1: Shared validation schema and wire contract

As a developer,
I want the contact wire contract pinned once,
So that client and server can never disagree on what a valid submission is.

**Acceptance Criteria:**

**Given** AD-3,
**When** `src/lib/contact/schema.ts` defines the shared zod schema,
**Then** the payload shape `{ name, email, message }` and response envelope `{ ok: boolean, error?: string }` are typed and exported as the single source of field rules for both client and server
**And** the schema validates email format, requires non-empty name/message, and is the only place field rules live (FR-19, FR-20, AD-3).

### Story 3.2: Contact API route

As a developer,
I want `POST /api/contact` to deliver submissions to EmailOctopus,
So that the Builder reliably receives qualified contacts.

**Acceptance Criteria:**

**Given** AD-3, FR-20, and FR-23,
**When** `src/app/api/contact/route.ts` receives a submission,
**Then** it re-validates with the shared schema, rejects a filled honeypot (`website`) with `{ ok: true }` and no delivery, and calls EmailOctopus API v2 `create-contact` with `status: "SUBSCRIBED"` and a source tag
**And** on success it returns `{ ok: true }`, on any EmailOctopus failure it returns `{ ok: false, error }` with a non-2xx status (never a silent 200), and it is the only module reading `EMAIL_OCTOPUS_API_KEY` / `EMAIL_OCTOPUS_LIST_ID` (server-only env, no secrets in the client bundle) (FR-20, FR-23, AD-3).

### Story 3.3: Contact form island

As a visitor,
I want a three-field form that tells me exactly what happened,
So that submitting never feels like a black box.

**Acceptance Criteria:**

**Given** FR-19, FR-21, FR-22, and UX-DR8,
**When** the ContactForm island renders Name, Email, and Message,
**Then** client-side validation matches the shared schema, errors are inline and announced via `aria-live`, focus gets a 2px white underline + glow
**And** on success the form is replaced inline by a confirmation block ("Message sent. I'll reply within a day." + email copy button) — no redirect; on failure an error block preserves the visitor's input and offers a retry button without reload; the submit button shows `SUBMITTING…` while in flight and is never glitched
**And** with JavaScript disabled a graceful fallback points to `mailto:` (FR-19, FR-21, FR-22, UX-DR8, NFR-4).

### Story 3.4: Contacts metric and spam verification

As the Builder,
I want every valid submission counted and spam excluded,
So that the funnel's payoff is measurable and the inbox stays usable.

**Acceptance Criteria:**

**Given** FR-24 and FR-23,
**When** a valid submission completes,
**Then** it creates exactly one member in the EmailOctopus list (the contacts metric = list member count, visible to the Builder), and honeypot submissions are dropped without delivery or counting
**And** an end-to-end test proves a valid submission reaches the inbox and increments the metric while an automated submission is caught by the honeypot (FR-23, FR-24, FR-28).

## Epic 4: Resume

### Story 4.1: Resume PDF generation

As a developer,
I want the resume PDF generated from the content module at build,
So that the resume can never drift from the site's copy.

**Acceptance Criteria:**

**Given** FR-26 and AD-4,
**When** the build runs,
**Then** `/public/resume.pdf` is generated from `src/content` (the resume dataset adapted to the Harness voice) and opens without error as a valid PDF
**And** the generated PDF is present at launch and reflects the current content — regenerating content and rebuilding yields an updated PDF (FR-26, AD-4).

### Story 4.2: Resume download button

As a visitor,
I want a styled download for the resume,
So that I can take proof with me.

**Acceptance Criteria:**

**Given** FR-25 and UX-DR3,
**When** the resume link renders,
**Then** a styled button points at `/public/resume.pdf` with a cache-busting `?v=` query, opens in a new tab, carries the `download` attribute, and is reachable from the footer (and header on desktop) per the design system
**And** the button is accessible with a ≥ 44×44px touch target (FR-25, FR-2).

## Epic 5: Analytics & Consent

### Story 5.1: Cookie consent banner

As a visitor,
I want to choose whether tracking runs,
So that my visit stays consent-aware and compliant.

**Acceptance Criteria:**

**Given** FR-29 and UX-DR9,
**When** the site loads cold,
**Then** a single-line banner with Accept/Decline renders as an accessible, non-obstructing overlay, `Esc` dismisses it, and the choice persists under the key `glitch-guy0:consent` (`"accepted" | "declined"`), with the CookieBanner as the sole owner of that key
**And** the banner never obstructs the Contact Flow and is keyboard-accessible with ≥ 44×44px controls (FR-29, UX-DR9, NFR-7).

### Story 5.2: Analytics app-code injection

As the Builder,
I want engagement measured only after consent and only in production,
So that I get funnel data without tracking anyone who opted out.

**Acceptance Criteria:**

**Given** AD-6 and FR-27,
**When** analytics initializes,
**Then** Vercel Web Analytics (`@vercel/analytics`) is injected via app code behind the consent state — dashboard-level automatic injection is disabled — and no analytics code runs outside production
**And** no other analytics provider or tracking script is present (FR-27, FR-29, AD-6).

### Story 5.3: Contacts metric measurement

As the Builder,
I want the contacts metric viewable,
So that I can run the funnel from one place.

**Acceptance Criteria:**

**Given** FR-28,
**When** the Builder checks the metrics,
**Then** the contacts metric (EmailOctopus list member count) increments on each valid submission (FR-24) and is visible to the Builder alongside engagement data
**And** no additional paid tooling is introduced (FR-28, NFR-8).

## Epic 6: Launch Readiness & Quality Gates

### Story 6.1: Placeholder purge and content audit

As the Builder,
I want zero placeholder content at launch,
So that nothing ships that looks unfinished or breaks trust.

**Acceptance Criteria:**

**Given** FR-13,
**When** the site is audited pre-launch,
**Then** no lorem ipsum, TBD, empty link, or stub visual survives anywhere, every outbound link resolves, and each project visual is the real asset with descriptive alt text (FR-13, NFR-4).

### Story 6.2: Pre-launch link-check crawl

As the Builder,
I want a scripted crawl of all outbound links,
So that dead links cannot ship.

**Acceptance Criteria:**

**Given** FR-13 and NFR-4,
**When** the link-check script runs,
**Then** it crawls all declared outbound links (GitHub, live demos, mailto, resume PDF) and reports zero 404s/timeouts, failing the launch gate otherwise
**And** the script is a repeatable npm command (FR-13, NFR-4, SM-2).

### Story 6.3: Accessibility verification in both modes

As the Builder,
I want accessibility proven, not assumed,
So that the site meets WCAG 2.1 AA at launch.

**Acceptance Criteria:**

**Given** NFR-2 and NFR-3,
**When** axe-core runs against the built site in dark and light mode,
**Then** it reports zero serious/critical violations in both modes, load-bearing contrast pairs measure ≥ 4.5:1, and a manual pass confirms keyboard navigation, visible focus, and that reduced-motion disables all glitch keyframes and Lenis smoothing (NFR-2, NFR-3).

### Story 6.4: Performance budget

As the Builder,
I want the site verified fast,
So that the "fast, working site" is itself the demo.

**Acceptance Criteria:**

**Given** NFR-1,
**When** Lighthouse runs against the production build on mobile,
**Then** performance scores ≥ 90 with no regressions from the glitch/scanline layer, and animations remain opacity/transform-only (NFR-1, AD-2).

### Story 6.5: Deployment and environment wiring

As the Builder,
I want the production pipeline wired,
So that the site deploys and the funnel runs end to end.

**Acceptance Criteria:**

**Given** DEP-1 and NFR-8,
**When** the project is connected to Vercel,
**Then** `main` deploys to production and PR branches to preview deployments, environment variables (`EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID`, `CONTACT_EMAIL`) are configured per environment, Web Analytics runs in production only, and a test submission confirms the Visit → Trust → Capability → Contact loop closes end to end (DEP-1, NFR-8, SM-1).
