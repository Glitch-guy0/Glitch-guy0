---
title: "PRD: Freelance Harness Engineer Portfolio"
status: final
created: 2026-08-06
updated: 2026-08-08
---

# PRD: Freelance Harness Engineer Portfolio

## 0. Document Purpose

This PRD defines v1 of the freelance **Harness Engineer** portfolio for Prajwal M (the Builder): a single-page conversion funnel that turns visitors into contacts. **This PRD covers v1 only.** It is the source of truth for downstream work (UX, architecture, epics/stories, build) and builds on — does not duplicate — the finalized Product Brief, its addendum, the market research digest, and the design reference. The UX spines define the visual/behavioral system this PRD constrains. **Email delivery uses EmailOctopus** (free tier, decision 2026-08-06).

## 1. Vision

Prajwal M is an early-career engineer (1+ years production backend) whose shipped work is LLM/AI infrastructure: an open-source agent SDK, a RAG research assistant, and AI chat platforms. He positions as a **Harness Engineer** — he builds the infrastructure *around* LLMs (RAG pipelines, retrieval, agent orchestration, guardrails, evaluation) on production-grade backend foundations. He does not train or own models.

The portfolio is a **4-step conversion funnel — Visit → Trust → Capability → Contact — not a resume**. Visitors scan in 15–30 seconds and evaluate risk, not code. The site is itself the demo: a fast, working, deployed site on Vercel is subtle proof of backend competence.

v1 ships the seven working sections, a working contact flow (EmailOctopus), a downloadable freelance resume, and funnel analytics. Deferred scope is tracked separately (see §6.2).

## 2. Target User

### 2.1 Jobs To Be Done

**Visitors (startup founders, agency owners, PMs hiring a freelance backend engineer):**
- *Functional* — find a backend engineer I can scope, trust, and start with.
- *Emotional* — feel confident my money and timeline are safe.
- *Social* — defend the choice to a co-founder or client (proof beats adjectives).
- *Contextual* — evaluate in 15–30 seconds, often mobile, between meetings.

**Builder (Prajwal M, primary stakeholder):**
- *Functional* — ship working proof, generate inbound contacts, explain the Harness Engineer identity.
- *Emotional* — credibility as a specialist at the start of a freelance career.

### 2.2 Non-Users (v1)

- Non-technical keyword-scanning recruiters.
- Enterprise procurement (certifications, SLAs, security questionnaires).
- Full-time employers (positioning is freelance-first).

### 2.3 Key User Journeys

- **UJ-1. Maya, founder, decides in a 20-second scan.** Arrives on the Hero, reads the outcome line → skims Services → opens the leading Project Entry → submits Contact, sees a clear success confirmation. *Edge case:* on form error her input is preserved and she can retry or use mailto.
- **UJ-2. Raj, agency owner, deep-vets.** Opens every Project Entry and follows Live + GitHub links → reads work statements → downloads the resume → emails the Builder. *Edge case:* a dead link or vague metric drops his trust sharply.
- **UJ-3. Prajwal runs the funnel.** Checks Vercel Web Analytics + inbox; receives Contact submissions via EmailOctopus. *Edge case:* spam must be filterable without extra tooling (FR-23).

## 3. Glossary

- **Portfolio** — the website, treated as a conversion funnel; never called a "resume."
- **Visitor** — anyone who loads the Portfolio. **Builder** — Prajwal M, owner and sole maintainer.
- **Harness Engineer** — positioning: builds the infrastructure around LLMs, not models. **Harness** — the orchestration layer around a foundation model.
- **Conversion Funnel** — Visit → Trust → Capability → Contact.
- **Offer** — one of three packaged service scopes (deliverables + timeline, no price in v1).
- **Contact** — a form submission (Name, Email, Message) or direct email. **Contact Flow** — form → API route → EmailOctopus → contacts metric.
- **Project Entry** — one curated case in Projects, framed problem → solution → result, exactly one visual, live/GitHub links.
- **v1** — launch scope (§6.1).

## 4. Features

Single-page site with anchored sections in fixed order (Hero → Services → Projects → About → Skills → Experience → Contact), header nav, footer.

### 4.1 Information Architecture & Navigation

#### FR-1: Anchored section navigation
Nav links smooth-scroll to each of the seven sections with the current position visibly indicated; anchor jumps work with the browser back button.

#### FR-2: Email always reachable
A `mailto:` link renders in both header and footer, visible (not collapsed) on mobile.

#### FR-3: Responsive layout
No horizontal scroll or broken layout at 360px, 768px, 1280px; all CTAs and form fields have touch targets ≥ 44×44px on mobile.

### 4.2 Hero

#### FR-4: Outcome headline
Hero renders a first-person "I build X for Y" outcome line from the resume.md headline/tagline; headline + supporting line fit above the fold at desktop and mobile.

#### FR-5: Hero primary CTA
Exactly one primary CTA; activating it lands at Contact or opens an email draft.

### 4.3 Services — Offers

#### FR-6: Three packaged offers
Approved set (2026-08-06):
1. **AI Feature Build — RAG & Agent Harness (1–4 weeks)** — retrieval pipelines, agent orchestration, guardrails, evaluation.
2. **AI Chat/Agent Platform MVP (4–8 weeks)** — end-to-end build on the pattern of the shipped chat platforms.
3. **Backend Stabilization & Migration (1–3 weeks)** — legacy audits, zero-downtime migrations, production hardening.

#### FR-7: No pricing in v1
No Offer displays a price, rate, or currency.

#### FR-8: Offer-to-contact path
No action button on any Offer card; Contact stays reachable from Services in ≤ 3 taps/clicks via the header/hero CTA.

### 4.4 Projects

#### FR-9: Curated project entries, problem → solution → result
Featured set (2026-08-06): **Shikigami Agent SDK, ChaiBookLM, ChaiChat**; chaiGPT and the rest go to the showcase (FR-14). Each result carries a quantified magnitude or concrete capability.

#### FR-10: Harness-flavored project lead
The Shikigami Agent SDK leads Projects as the first Project Entry in DOM order.

#### FR-11: One visual per project
Every Project Entry renders exactly one screenshot/GIF with descriptive alt text.

#### FR-12: Live and GitHub links
Every Project Entry has a working GitHub link; live links render where demos exist (ChaiBookLM, ChaiChat); chaiGPT is GitHub-only.

#### FR-13: No placeholder content at launch
No lorem ipsum, "TBD," or empty links; a pre-launch scripted crawl of all outbound links reports zero 404s/timeouts.

#### FR-14: Secondary showcase
chaiGPT (and future additions) render in a showcase listing with GitHub links, visually distinct from featured entries.

### 4.5 About

#### FR-15: Honest work-focused about copy
Concise first-person copy that is human, work-related, and free of fabricated claims.

### 4.6 Skills

#### FR-16: 6–8 skill pills
Named pills led by Harness Engineer domains: LLM Harnessing, Vector Search, TypeScript/Node.js, Backend & APIs, Databases, AWS, Auth & Security, Architecture.

#### FR-17: No skill rating bars
No percentage, level bar, or numeric self-rating.

### 4.7 Experience

#### FR-18: Outcome-framed work statements
2–3 statements with magnitude: zero-downtime migration, legacy stabilization, shipped mobile app. The migration is a work statement, not a Project Entry.

### 4.8 Contact Flow

#### FR-19: Contact form fields and validation
Name, Email, Message; required fields validated client-side with clear, accessible errors.

#### FR-20: Form submission reaches EmailOctopus
A valid submission POSTs to the contact API route and is delivered via EmailOctopus (free tier); API key never exposed to the client.

#### FR-21: Success confirmation to the Visitor
Clear success confirmation in the form's place — not a silent redirect.

#### FR-22: Visible failure handling
Error message shown, input preserved, retry possible without reload.

#### FR-23: Spam protection
Honeypot + server-side checks; no captcha in v1.

#### FR-24: Contacts metric feed
The contact API route records each valid submission so the contacts metric can be measured.

### 4.9 Resume

#### FR-25: Resume download button
Styled button triggers download of `/public/resume.pdf` (cache-busted `?v=`).

#### FR-26: Freelance resume present at launch
The resume PDF exists, reflects resume.md (adapted to the design voice), and opens without error.

### 4.10 Analytics

#### FR-27: Vercel Web Analytics on all pages
Loads on the Portfolio; no analytics outside production.

#### FR-28: Contacts metric measurement
The contacts metric (valid submissions) is measured and viewable by the Builder.

#### FR-29: No third-party analytics beyond free tier; consent
v1 ships only Vercel Web Analytics + the contact route; analytics initialize only after consent; banner is accessible, dismissible, and does not obstruct the Contact Flow.

## 5. Non-Goals (Explicit)

- Not a resume; no geo-split personalization in v1; no buyer-segment positioning; no pricing/rates; no availability statement on the site; no decision-system blog; no testimonials; no visual redesign; no fabricated metrics/experience/model-ownership claims; no skill rating bars, keyword walls, or contact friction.

## 6. MVP Scope

### 6.1 In Scope

- Seven-section single-page site; header nav + footer with always-visible email; responsive at 360/768/1280px.
- Contact Flow: `POST /api/contact` → EmailOctopus; success/error states; spam protection; contacts metric feed.
- Freelance resume PDF + cache-busted download button (from resume.md).
- Analytics: Vercel Web Analytics + contacts metric, with cookie-consent banner.
- Glitch/Y2K aesthetic per design reference and UX spines, accessibility-respecting.

**Build inputs:** SDK visual; EmailOctopus account + API key; resume PDF; pre-launch link-check script.

### 6.2 Out of Scope for MVP

All deferred scope (geo-split, buyer-segment positioning, pricing, availability, decision-system blog pages, LinkedIn) is tracked in the Product Brief as approved-deferred, post-launch, gated on visitor data.

## 7. Success Metrics

**Primary**
- **SM-1: Contacts flowing** — submissions arrive and increment the contacts metric (FR-19, FR-20, FR-24, FR-28).
- **SM-2: Zero friction failures** — email reachable everywhere; declared links resolve (zero 404s/timeouts) (FR-1, FR-2, FR-12, FR-13).
- **SM-3: Proof present at launch** — downloadable freelance resume (FR-25, FR-26).

**Secondary**
- **SM-4: Engagement tracked** — visits and time on site visible in Vercel Web Analytics (FR-27).

**Counter-metrics (do not optimize)**
- **SM-C1: Vanity traffic** — raw visit volume must not be optimized (counterbalances SM-1).
- **SM-C2: Raw submission volume** — brute-force/spam volume must not be chased at the cost of quality (counterbalances SM-1).

## 8. Cross-Cutting NFRs

- **Performance** — Lighthouse ≥ 90 mobile; renders quickly on 3G and mid-tier mobile.
- **Accessibility** — WCAG 2.1 AA: contrast ≥ 4.5:1, alt text, keyboard-navigable, visible focus; glitches respect `prefers-reduced-motion`.
- **Reliability** — Contact Flow must never be silently broken.
- **Security** — EmailOctopus API key server-side only; contact route validates server-side; no secrets in the client bundle.
- **Observability** — Vercel Web Analytics; contacts metric via the contact route.

## 9. Aesthetic and Tone

Glitch/Y2K — near-black backgrounds, full monochrome (no chromatic color), grayscale glitch offsets, scan lines, all-caps technical headings. Glitches are short (100–400ms), purposeful, snap back, never obscure body text, never glitch CTAs or the contact form, disabled for `prefers-reduced-motion`.

**Voice:** first-person, direct, outcome-focused. Every claim carries a magnitude or is not made.

## 10. Constraints and Guardrails

- **Privacy** — collect only the three contact fields; data flows to EmailOctopus only; consent banner for analytics.
- **Cost** — free tiers only (Vercel, EmailOctopus); no paid dependency without decision.
- **Spam** — honeypot + basic server-side checks (FR-23); no captcha.

## 11. Open Questions

None — all previously open questions resolved as of 2026-08-06.

## 12. Assumptions & Decisions Index

- Single-page anchored layout, no multi-route IA in v1 (assumption).
- Hero copy = resume.md headline/tagline (decision).
- Offer set approved; featured + showcase set approved; chaiGPT GitHub-only (decision).
- Email via EmailOctopus free tier (decision).
- Work statements sourced from resume.md (decision).
- No testimonials, no availability statement (decision).
- Contact form: three fields (decision).
- Honeypot + server-side checks suffice for spam (assumption).
- Cookie-consent banner for Vercel Web Analytics (decision).
- Lighthouse ≥ 90 mobile target (assumption; budget in architecture).
