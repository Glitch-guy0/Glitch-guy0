---
title: "PRD: Freelance Harness Engineer Portfolio"
status: final
created: 2026-08-06
updated: 2026-08-06
---

# PRD: Freelance Harness Engineer Portfolio

## 0. Document Purpose

This PRD defines v1 of the freelance **Harness Engineer** portfolio for Prajwal M (the Builder): a single-page conversion funnel that turns visitors into contacts. **This PRD covers v1 only** — all planning, requirements, and scope decisions here are for the v1 launch; anything not listed as in-scope is out of scope for this document. It is the source of truth for downstream work (UX, architecture, epics/stories, build) and builds on — does not duplicate — the finalized Product Brief, its addendum (mechanism decisions: Vercel analytics), the market research digest, and the design reference (`design.md`, glitch/Y2K). The UX spines (`ux-designs/ux-Glitch-guy0-2026-08-06/DESIGN.md`, `EXPERIENCE.md`) already exist and define the visual/behavioral system this PRD constrains. **Email delivery uses EmailOctopus** (free tier, decision 2026-08-06).

## 1. Vision

Prajwal M is an early-career engineer (1+ years production backend) whose shipped work is LLM/AI infrastructure: an open-source agent SDK, a RAG research assistant, and AI chat platforms. He positions as a **Harness Engineer** — he builds the infrastructure *around* LLMs (RAG pipelines, retrieval, agent orchestration, guardrails, evaluation) on production-grade backend foundations. He does not train or own models. This identity matches what he has shipped and stays credible at his experience level.

The portfolio is a **4-step conversion funnel — Visit → Trust → Capability → Contact — not a resume**. Visitors scan in 15–30 seconds and evaluate risk, not code: the site must answer "is it safe to give this person my money and my timeline?" faster than a skimmer can click away. The site is itself the demo: a fast, working, deployed site on Vercel is subtle proof of backend competence.

v1 ships the seven working sections (Hero → Services → Projects → About → Skills → Experience → Contact), a working contact flow (EmailOctopus), a downloadable freelance resume, and funnel analytics. Deferred scope is tracked separately (see §6.2).

## 2. Target User

### 2.1 Jobs To Be Done

**Visitors (startup founders, agency owners, PMs hiring a freelance backend engineer):**
- *Functional* — find a backend engineer I can scope, trust, and start with; confirm they can deliver.
- *Emotional* — feel confident my money and timeline are safe.
- *Social* — defend the choice to a co-founder or client (proof beats adjectives).
- *Contextual* — evaluate in 15–30 seconds, often mobile, between meetings.

**Builder (Prajwal M, primary stakeholder):**
- *Functional* — ship working proof, generate inbound contacts, explain the Harness Engineer identity.
- *Emotional* — credibility as a specialist at the start of a freelance career; the site demonstrating competence.

### 2.2 Non-Users (v1)

- Non-technical keyword-scanning recruiters (the portfolio assumes a technical reader).
- Enterprise procurement (certifications, SLAs, security questionnaires).
- Full-time employers (positioning is freelance-first).

### 2.3 Key User Journeys

- **UJ-1. Maya, founder, decides in a 20-second scan.** Six-person startup, messy MVP backend, three freelancer tabs open. Arrives from search/referral on the Hero. Reads the outcome line (1–2 s) → skims Services for a matching offer → opens the leading Project Entry (problem → solution → result) → checks the header email or scrolls to Contact. Submits Name, Email, Project type, Message; sees a clear success confirmation. *Edge case:* on form error she sees a clear error, her input is preserved, and she can retry or use the header mailto link.

- **UJ-2. Raj, agency owner, deep-vets before committing.** Needs a backend subcontractor; vets harder because his client reputation is on the line. Arrives mid-funnel (Projects or Experience) via a shared link. Opens every Project Entry and follows Live + GitHub links → reads the outcome-framed work statements → downloads the freelance resume. Climax: verifiable proof (live systems, outcome metrics with magnitude) and a scope he can quote against. Resolves by emailing the Builder directly from the header with a project brief. *Edge case:* a dead link or vague metric drops his trust sharply.

- **UJ-3. Prajwal runs the funnel.** Checks Vercel Web Analytics + inbox on launch day; receives Contact submissions via the contact route → EmailOctopus; qualifies each by budget + message. Climax: a qualified inquiry arrives with enough context to reply with an offer-fit answer. Resolves by replying and moving the lead forward. *Edge case:* spam must be filterable without extra tooling (FR-23).

## 3. Glossary

- **Portfolio** — the website itself, treated as a conversion funnel; never called a "resume."
- **Visitor** — anyone who loads the Portfolio. **Builder** — Prajwal M, owner and sole maintainer.
- **Harness Engineer** — positioning: builds the infrastructure around LLMs (retrieval, orchestration, guardrails, evaluation), not models. **Harness** — the orchestration layer around a foundation model.
- **Conversion Funnel** — Visit → Trust → Capability → Contact.
- **Offer** — one of three packaged service scopes (deliverables + timeline, no price in v1).
- **Contact** — a form submission (Name, Email, Project type, Message) or direct email representing a potential engagement. **Contact Flow** — form → API route → EmailOctopus → contacts metric.
- **Project Entry** — one curated case in Projects, framed problem → solution → result, exactly one visual, live/GitHub links.
- **Engagement** — visit and time-on-site signals from Vercel Web Analytics.
- **v1** — launch scope (§6.1). Deferred scope is tracked separately (see §6.2).

## 4. Features

Single-page site with anchored sections in fixed order (Hero → Services → Projects → About → Skills → Experience → Contact), header nav, footer. FRs are globally numbered and stable.

### 4.1 Information Architecture & Navigation

**Description:** The page order is the funnel narrative; navigation must never obstruct; the email is reachable from header and footer at all times, including mobile. Realizes UJ-1, UJ-2.

#### FR-1: Anchored section navigation

A Visitor can navigate via header nav links that scroll to each of the seven sections, with the current position visibly indicated. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Each nav item smooth-scrolls to its anchor without reload; all seven sections reachable on desktop and mobile.
- Anchor jumps work with the browser back button.

#### FR-2: Email always reachable

A Visitor can initiate contact by email from the header and footer, on every viewport size. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- A `mailto:` link renders in both header and footer, visible (not collapsed) on mobile.

#### FR-3: Responsive layout

A Visitor can read and act on the entire Portfolio on phone, tablet, and desktop without horizontal scroll or broken layout.

**Consequences (testable):**
- No content clipped or overlapping at 360px, 768px, and 1280px widths.
- All CTAs and form fields have touch targets ≥ 44×44px on mobile.

### 4.2 Hero

**Description:** First-person outcome line ("I build X for Y"), one supporting line, one primary CTA. Copy is sourced from the resume.md headline/tagline (Harness Engineer framing) — no separate copy exercise (decision 2026-08-06). Brief, purposeful glitch accents (see §9). Realizes UJ-1.

#### FR-4: Outcome headline

The Hero renders a first-person outcome statement naming the audience and the value, using the resume.md headline/tagline. Copy is credible for a 1-year Harness Engineer — outcome-framed, no grand promises, no model ownership.

**Consequences (testable):**
- Headline follows "I build X for Y" with a named outcome, not a skill list.
- Headline + supporting line fit above the fold at desktop and mobile.

#### FR-5: Hero primary CTA

The Hero renders one primary CTA moving a Visitor toward Contact (scroll to Contact or a mailto link). Realizes UJ-1.

**Consequences (testable):**
- Exactly one primary CTA; activating it lands at Contact or opens an email draft.

### 4.3 Services — Offers

**Description:** Three packaged Offers (deliverables + timeline, no pricing). Packaged offers reduce decision anxiety and pre-empt scope mismatch (research digest). Realizes UJ-1, UJ-2.

#### FR-6: Three packaged offers

A Visitor sees exactly three Offers aligned to the Harness Engineer positioning. Approved set (2026-08-06):
1. **AI Feature Build — RAG & Agent Harness (1–4 weeks)** — retrieval pipelines, agent orchestration, guardrails, evaluation.
2. **AI Chat/Agent Platform MVP (4–8 weeks)** — end-to-end build on the pattern of the shipped chat platforms.
3. **Backend Stabilization & Migration (1–3 weeks)** — legacy audits, zero-downtime migrations, production hardening.

**Consequences (testable):**
- Three Offer cards render, each with a name, deliverable list, and timeline; deliverables are outcome-framed.

#### FR-7: No pricing in v1

No Offer displays a price, rate, or currency. Realizes UJ-1.

**Consequences (testable):**
- No monetary value appears anywhere in Services.

#### FR-8: Offer-to-contact path

Each Offer provides a way to start a Contact referencing that Offer. Realizes UJ-1.

**Consequences (testable):**
- Each Offer card has an actionable CTA to the Contact Flow; Contact completable from any Offer in ≤ 3 taps/clicks.

### 4.4 Projects

**Description:** The proof section. Three featured Project Entries (problem → solution → result, one visual, live/GitHub links), led by the open-source agent SDK, plus a secondary showcase for remaining work. Realizes UJ-1, UJ-2.

#### FR-9: Curated project entries, problem → solution → result

A Visitor can read each Project Entry as a problem → solution → result story, with the result stated with a magnitude (metric, count, or capability). Featured set (decision 2026-08-06): **Shikigami Agent SDK, ChaiBookLM, ChaiChat**; chaiGPT and the rest go to the showcase (FR-14). Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Each entry has explicit problem, solution, and result blocks; each result carries a quantified magnitude or concrete capability.

#### FR-10: Harness-flavored project lead

The Shikigami Agent SDK — the open-source TypeScript agent harness — leads Projects as the strongest Harness Engineer proof.

**Consequences (testable):**
- The first Project Entry in DOM order is the Shikigami Agent SDK.

#### FR-11: One visual per project

Each Project Entry renders exactly one screenshot or GIF with descriptive alt text. Visuals exist for ChaiBookLM (3) and ChaiChat (2) in `project-images/`; the SDK visual is a build input.

**Consequences (testable):**
- Every Project Entry has exactly one visual asset with descriptive alt text.

#### FR-12: Live and GitHub links

Each Project Entry links to its source repo and, where a deployment exists, a live system. **chaiGPT has no live demo — GitHub-only** (decision 2026-08-06). Realizes UJ-2.

**Consequences (testable):**
- Every Project Entry has a working GitHub link; live links render where demos exist (ChaiBookLM, ChaiChat).

#### FR-13: No placeholder content at launch

Placeholders used during build are fully replaced before launch — no lorem ipsum, no "TBD," no empty links.

**Consequences (testable):**
- No placeholder markers survive at launch.
- A pre-launch scripted crawl of all outbound links (GitHub, live demos, mailto, resume PDF) reports zero 404s/timeouts (feeds SM-2).

#### FR-14: Secondary showcase

A Visitor can see the remaining shipped work (chaiGPT and future additions) in a secondary showcase listing with GitHub links (live links where demos exist), without full problem → solution → result framing. Realizes UJ-2.

**Consequences (testable):**
- The showcase renders chaiGPT with a working GitHub link; entries are visually distinct from featured Project Entries.

### 4.5 About

**Description:** Human, honest, work-related copy — "work experience over the work" (research signal), without corporate filler or fabricated history. Realizes UJ-1, UJ-2.

#### FR-15: Honest work-focused about copy

The About section renders concise first-person copy that is human, work-related, and free of fabricated claims.

**Consequences (testable):**
- No claim asserts experience, employer, or credential the Builder does not have; copy targets a technical buyer.

### 4.6 Skills

**Description:** 6–8 scannable skill pills (harness-first), no percentage bars — breadth-overload and self-rated bars backfire (research). Realizes UJ-1.

#### FR-16: 6–8 skill pills

The Skills section renders 6–8 named skill pills led by Harness Engineer domains: **LLM Harnessing (RAG, agents, orchestration), Vector Search, TypeScript/Node.js, Backend & APIs, Databases, AWS, Auth & Security, Architecture.**

**Consequences (testable):**
- Pill count is 6–8; each pill names a skill domain, not a tool list.

#### FR-17: No skill rating bars

No percentage, level bar, or numeric self-rating renders in Skills.

**Consequences (testable):**
- No progress/bar elements in the Skills section.

### 4.7 Experience

**Description:** Work history as outcome work statements — what happened, at what magnitude, what it proves. Content is sourced from resume.md (decision 2026-08-06). Realizes UJ-2.

#### FR-18: Outcome-framed work statements

The Experience section renders 2–3 work statements with magnitude, not role-verbs:
1. **Zero-downtime migration** — led a 2-week MongoDB → DynamoDB migration (~12 collections, 5,000+ records), phased A/B cutover, zero downtime on 5 critical production collections.
2. **Legacy stabilization** — audited and refactored a 2019 NestJS proof-of-concept, unmaintained 3+ years, into production-ready state.
3. **Shipped mobile app** — React Native operator app for real-time charger fleet monitoring, live on the Play Store.

The migration is a work statement here, not a Project Entry.

**Consequences (testable):**
- Each statement states an outcome with a magnitude; none reads as a pure responsibility list.

### 4.8 Contact Flow

**Description:** The funnel's payoff — a working `POST /api/contact` form (Name, Email, Project type, Message) delivering submissions to **EmailOctopus** and feeding the contacts metric. Must work flawlessly, tell the Visitor what happened, and never silently lose a submission. Realizes UJ-1, UJ-3.

#### FR-19: Contact form fields and validation

A Visitor can submit a Contact with Name, Email, Project type (free text), and Message; required fields are validated client-side with clear, accessible errors (decision 2026-08-06: Project type, per resume.md).

**Consequences (testable):**
- Invalid email → inline, screen-reader-accessible error; no send.
- Form renders four fields; the fourth accepts free text.

#### FR-20: Form submission reaches EmailOctopus

A valid submission POSTs to the contact API route and is delivered to the Builder's inbox via EmailOctopus (free tier). Realizes UJ-3.

**Consequences (testable):**
- A valid submission results in an EmailOctopus-delivered email; API key never exposed to the client.

#### FR-21: Success confirmation to the Visitor

After a successful submission, the Visitor sees a clear success confirmation in the form's place — not a silent redirect. Realizes UJ-1.

**Consequences (testable):**
- Success state renders after the POST resolves; form clears; message states what happens next.

#### FR-22: Visible failure handling

If a submission fails, the Visitor sees an error message, their input is preserved, and retry is possible. Realizes UJ-1.

**Consequences (testable):**
- Failure renders an error state, restores field values, allows resubmission without reload.

#### FR-23: Spam protection

The Contact Flow includes lightweight spam protection (honeypot + server-side checks) so the Builder's inbox stays usable; no captcha in v1.

**Consequences (testable):**
- Automated submissions caught by the honeypot do not reach the inbox; legitimate submissions are unaffected.

#### FR-24: Contacts metric feed

The contact API route records each valid submission so the contacts metric can be measured. Realizes UJ-3.

**Consequences (testable):**
- Each valid submission increments the contacts metric by one, viewable by the Builder.

### 4.9 Resume

**Description:** A downloadable freelance-oriented resume as a static PDF with a styled, cache-busted download button. resume.md is the content reference; the working resume copy/PDF adapts framing and wording to the design philosophy (Harness voice, glitch/Y2K) and is generated from resume.md at build. Realizes UJ-2.

#### FR-25: Resume download button

A Visitor can download the resume via a styled button pointing at the static PDF with a cache-busting query. Realizes UJ-2.

**Consequences (testable):**
- Button triggers download of `/public/resume.pdf` (cache-busted `?v=`); styled per the design system.

#### FR-26: Freelance resume present at launch

The resume PDF exists, reflects resume.md as the content reference (adapted to the design voice), and opens without error. Realizes UJ-2.

**Consequences (testable):**
- `/public/resume.pdf` returns 200 with a valid PDF at launch.

### 4.10 Analytics

**Description:** Free, zero-config Vercel Web Analytics for visits and engagement; the contacts metric rides the contact route. No additional paid tooling in v1. Realizes UJ-3.

#### FR-27: Vercel Web Analytics on all pages

Vercel Web Analytics loads on the Portfolio and reports visits and engagement. Realizes UJ-3.

**Consequences (testable):**
- Script loads on every page render; visits/engagement appear in the Vercel dashboard; no analytics outside production.

#### FR-28: Contacts metric measurement

The contacts metric (valid submissions) is measured and viewable by the Builder. Realizes UJ-3.

**Consequences (testable):**
- Contacts metric increments on valid submissions (FR-24) and is displayed in the analytics view.

#### FR-29: No third-party analytics beyond free tier; consent

v1 ships no analytics dependency beyond Vercel Web Analytics and the contact route. Vercel Web Analytics uses cookies (confirmed 2026-08-06), so v1 includes a lightweight cookie-consent banner that defers analytics until accepted.

**Consequences (testable):**
- No additional analytics scripts in production beyond Vercel Web Analytics; analytics initialize only after consent; banner is accessible, dismissible, and does not obstruct the Contact Flow.

## 5. Non-Goals (Explicit)

- **Not a resume:** experience is outcome-framed and curated, never a CV dump.
- **No geo-split personalization** in v1 (`/in`, `/us`, server-side geolocation).
- **No buyer-segment positioning** in v1.
- **No pricing or rates** displayed in v1.
- **No availability statement on the site** in v1 (decision 2026-08-06).
- **No decision-system blog/content pages** in v1.
- **No testimonials in v1** — not required (decision 2026-08-06).
- **No visual redesign** — the glitch/Y2K aesthetic is the reference, not a redesign prompt.
- **No fabricated metrics or experience; no model-ownership claims; no grand promises** — every claim carries a real magnitude or is not made.
- **No skill rating bars, no keyword walls, no contact friction.**

## 6. MVP Scope

### 6.1 In Scope

- Seven-section single-page site: Hero (resume.md copy), Services (3 no-price Offers), Projects (3 featured entries + showcase), About, Skills (6–8 pills), Experience (2–3 work statements), Contact.
- Header nav + footer with always-visible email; responsive at 360/768/1280px.
- Contact Flow: `POST /api/contact` → EmailOctopus; success/error states; spam protection; contacts metric feed.
- Freelance resume PDF + cache-busted download button (from resume.md).
- Analytics: Vercel Web Analytics + contacts metric, with cookie-consent banner.
- Glitch/Y2K aesthetic per design reference and UX spines, accessibility-respecting.

**Build inputs:** SDK visual; EmailOctopus account + API key; resume PDF (from resume.md, adapted to design voice); pre-launch link-check script (flags 404s/timeouts).

### 6.2 Out of Scope for MVP

**v1-only scope: this PRD does not define v2.** All deferred scope — geo-split `/in` `/us`, buyer-segment positioning, pricing, availability statement, decision-system blog pages, LinkedIn profile — is tracked in the finalized Product Brief (`briefs/brief-Glitch-guy0-2026-08-06/brief.md`, §Scope → v2), approved-deferred, post-launch, gated on visitor data. Nothing here commits to or plans for v2.

## 7. Success Metrics

*Qualitative targets per Builder choice (2026-08-06); each SM cross-references the FRs it validates.*

**Primary**
- **SM-1: Contacts flowing** — submissions arrive in the inbox and increment the contacts metric; the funnel's payoff works end to end. Validates FR-19, FR-20, FR-24, FR-28.
- **SM-2: Zero friction failures** — email reachable from header/footer on all viewports; declared links resolve (pre-launch scripted crawl reports zero 404s/timeouts). Validates FR-1, FR-2, FR-12, FR-13.
- **SM-3: Proof present at launch** — a downloadable freelance resume reflecting final content. Validates FR-25, FR-26.

**Secondary**
- **SM-4: Engagement tracked** — visits and average time on site visible in Vercel Web Analytics from launch day. Validates FR-27.

**Counter-metrics (do not optimize)**
- **SM-C1: Vanity traffic** — raw visit volume must not be optimized; the goal is qualified Contacts. Counterbalances SM-1.
- **SM-C2: Raw submission volume** — brute-force form volume (or spam slipping through) must not be chased at the cost of submission quality; guardrails stay (FR-23). Counterbalances SM-1.

## 8. Cross-Cutting NFRs

- **Performance** — the site is the demo: renders quickly on 3G and mid-tier mobile. Lighthouse ≥ 90 mobile is the target (budget finalized in architecture).
- **Accessibility** — WCAG 2.1 AA: body contrast ≥ 4.5:1, alt text on all visuals, keyboard-navigable, visible focus. Glitch effects respect `prefers-reduced-motion`; no flashing > 3×/s; bursts 100–400ms with snap-back.
- **Reliability** — Contact Flow is the one thing that must never be silently broken; monitor submission failures.
- **Security** — EmailOctopus API key server-side only; contact route validates input server-side; no secrets in the client bundle.
- **Observability** — Vercel Web Analytics for visits/engagement; contacts metric via the contact route.

## 9. Aesthetic and Tone

**Aesthetic (design.md + UX spines):** glitch/Y2K — near-black backgrounds, neon accents, RGB channel splits, scan lines, all-caps technical headings. **Application principle:** glitches are short (100–400ms), purposeful, snap back, never obscure body text, never glitch CTAs or the contact form, disabled for `prefers-reduced-motion`. Out of v1 scope: a full visual redesign.

**Voice:** first-person, direct, outcome-focused — "I build X for Y" as a Harness Engineer. Every claim carries a magnitude or is not made; honest (no fabricated experience, no self-rated bars); written for a technical buyer scanning in 15–30 seconds.

## 10. Constraints and Guardrails

- **Privacy** — collect only the four contact fields; data flows to EmailOctopus only. Vercel Web Analytics uses cookies → consent banner (FR-29); no other tracking.
- **Cost** — free tiers only: Vercel (site + Web Analytics), EmailOctopus (email). No paid dependency without decision.
- **Spam** — honeypot + basic server-side checks (FR-23); no captcha burden on Visitors in v1.

## 11. Open Questions

None — all previously open questions (project set, work statements, resume content, contact field, analytics consent, offer set, positioning) resolved as of 2026-08-06. See memlog.

## 12. Assumptions & Decisions Index

*Decisions are dated; assumptions are to confirm at build.*

- Single-page anchored layout, no multi-route IA in v1 (assumption).
- Hero copy = resume.md headline/tagline (decision 2026-08-06).
- Offer set approved (decision 2026-08-06).
- Featured entries + showcase set approved; chaiGPT GitHub-only, no live demo (decision 2026-08-06).
- SDK visual is a build input (assumption).
- Email via EmailOctopus (free tier); account + API key are build inputs (decision 2026-08-06, reverted from Resend).
- Work statements sourced from resume.md (decision 2026-08-06).
- No testimonials in v1 (decision 2026-08-06).
- No availability statement on the site in v1; tracked as deferred scope (decision 2026-08-06).
- Contact form: four fields; fourth is free text labeled Project type (decision 2026-08-06).
- Honeypot + server-side checks suffice for spam; no captcha (assumption).
- Vercel Web Analytics uses cookies → consent banner required (decision 2026-08-06).
- Lighthouse ≥ 90 mobile target (assumption; budget in architecture).
