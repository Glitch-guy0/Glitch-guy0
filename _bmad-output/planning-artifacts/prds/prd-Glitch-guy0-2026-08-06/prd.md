---
title: "PRD: Freelance Harness Engineer Portfolio"
status: draft
created: 2026-08-06
updated: 2026-08-06
---

# PRD: Freelance Harness Engineer Portfolio

*Working title — updated for the Harness Engineer positioning (course-corrected 2026-08-06).*

## 0. Document Purpose

This PRD defines v1 of the freelance harness engineer portfolio for Prajwal M (the Builder). It is written for the PM, the Builder, and downstream workflows (UX, architecture, epics and stories, build). It builds on — and does not duplicate — three existing artifacts: the **finalized Product Brief** (`_bmad-output/planning-artifacts/briefs/brief-Glitch-guy0-2026-08-06/brief.md`, which carries scope decisions and the conversion-funnel model), its **addendum** (mechanism decisions: EmailOctopus wiring, Vercel analytics, v2 geo-split approach), and the **market research** digest (freelance developer portfolios, 2026-08-06). The **design reference** (`_bmad-output/planning-artifacts/design.md`, Nifty Portal glitch/Y2K teardown) defines the aesthetic — referenced here, specified downstream in UX.

Structure: Glossary-anchored vocabulary; features grouped with globally numbered, stable FR IDs; assumptions tagged inline and indexed in §12.

## 1. Vision

Prajwal M is an early-career engineer with 1+ years of production backend experience and a portfolio of shipped LLM/AI projects — an open-source agent SDK, a RAG research assistant, and AI chat platforms. His positioning is **Harness Engineer**: he builds the infrastructure *around* LLMs — RAG pipelines, retrieval, agent orchestration, guardrails, evaluation — on production-grade backend foundations. He does not train models or claim model ownership; he builds the systems that make models reliable, safe, and shippable. This identity is credible at his experience level and matches the work he has actually shipped (positioning course-correction 2026-08-06).

His portfolio is a **4-step conversion funnel — Visit → Trust → Capability → Contact — not a resume**. Every section either builds trust, proves capability, or reduces contact friction. Visitors scan in 15–30 seconds and are evaluating risk, not code: the site must answer "is it safe to give this person my money and my timeline?" faster than a skimmer can click away.

The site is itself the demo. A fast, working, deployed site on Vercel is subtle proof of backend competence: it loads fast, never breaks, and its contact flow works flawlessly. Claims stay credible for a 1-year engineer: outcomes with magnitude, no grand promises ("never breaks") the record cannot back up.

v1 ships the seven working sections (Hero → Services → Projects → About → Skills → Experience → Contact), a working contact flow, a downloadable freelance resume, and analytics that measure the funnel. Anything that needs visitor data or more research — geo-split `/in` `/us` pages, buyer-segment positioning, pricing, availability statements, decision-system content — is explicitly deferred to v2, after first launch, when real data will justify it.

## 2. Target User

### 2.1 Jobs To Be Done

**Visitors (startup founders, agency owners, product managers hiring a freelance backend engineer):**
- *Functional* — find a backend engineer I can scope, trust, and start working with; confirm they can actually deliver.
- *Emotional* — feel confident the money and timeline are safe; avoid the regret of hiring someone who overpromises.
- *Social* — be able to defend the choice to a co-founder or client (proof beats adjectives).
- *Contextual* — evaluate in 15–30 seconds, often on mobile, often in between meetings.

**Builder (Prajwal M, primary stakeholder):**
- *Functional* — ship working proof, generate inbound contacts, explain how he thinks as a Harness Engineer (the infrastructure around LLMs), not a generic backend engineer.
- *Emotional* — credibility as a specialist at the start of his freelance career; the site itself demonstrating competence.

### 2.2 Non-Users (v1)

- Non-technical recruiters doing keyword-only scanning (the portfolio assumes a technical-enough reader).
- Enterprise procurement teams requiring certifications, SLAs, or security questionnaires.
- Employers evaluating for full-time roles (positioning is freelance-first).

### 2.3 Key User Journeys

- **UJ-1. Maya, founder, decides in a 20-second scan.**
  - **Persona + context:** Maya runs a 6-person startup; her MVP's backend is a mess and she needs someone to take over. She has three tabs of freelancers open.
  - **Entry state:** arrives from a Google search or referral, landing on the Hero.
  - **Path:** reads the Hero outcome line (1–2 s) → skims Services to see if an offer matches her need → opens the leading Project Entry (zero-downtime migration) and reads problem → solution → result → checks the header email or scrolls to Contact.
  - **Climax:** finds a packaged offer that matches her problem with a named timeline; the site has loaded fast, nothing has broken, and the contact form is right there with her email.
  - **Resolution:** submits Name, Email, Budget, Message; sees a clear success confirmation; the Builder receives the submission and replies. *Edge case:* if the form errors (network, email provider), Maya sees a clear error message, her input is not silently lost, and she can retry or fall back to the header mailto link.

- **UJ-2. Raj, agency owner, deep-vets before committing.**
  - **Persona + context:** Raj's agency needs a backend subcontractor for a client project; he vets harder than a founder because his own client reputation is on the line.
  - **Entry state:** arrives mid-funnel (Projects or Experience) via a shared link.
  - **Path:** opens every Project Entry (agent SDK, RAG assistant, chat platforms) and follows Live + GitHub links → reads the outcome-framed Experience work statements (zero-downtime migration, legacy stabilization) → downloads the freelance resume → reads the testimonial.
  - **Climax:** finds verifiable proof (live systems, named testimonial, outcome metrics with magnitude) and a scope he can quote against.
  - **Resolution:** emails the Builder directly from the header with a project brief. *Edge case:* if a project link is dead or a metric is vague, Raj's trust drops sharply — this is the "zero friction failures" requirement made personal.

- **UJ-3. Prajwal runs the funnel.**
  - **Persona + context:** the Builder, checking his inbox and analytics on launch day.
  - **Entry state:** Vercel Web Analytics dashboard + email inbox.
  - **Path:** sees visits and engagement rising; receives Contact submissions via the contact route → EmailOctopus; qualifies each by Budget + Message.
  - **Climax:** a qualified inquiry arrives with enough context (budget, problem) to reply with an offer-fit answer.
  - **Resolution:** replies, moves the lead forward; the funnel is proven. *Edge case:* spam or junk submissions must be filterable without extra tooling (see FR-23).

## 3. Glossary

- **Portfolio** — The website itself, treated as a conversion funnel. Never referred to as a "resume."
- **Visitor** — Anyone who loads the Portfolio. Evaluates risk first, capability second.
- **Builder** — Prajwal M, owner, operator, and sole maintainer of the Portfolio.
- **Harness Engineer** — The Builder's positioning: an engineer who builds the infrastructure around LLMs (RAG pipelines, retrieval, agent orchestration, guardrails, evaluation) rather than training models. The Portfolio's framing hangs on this identity.
- **Harness** — The orchestration layer wrapped around a foundation model: context management, tool dispatch, guardrails, error recovery, state persistence, evaluation. Used as "the harness around an LLM."
- **Conversion Funnel** — The 4-step model *Visit → Trust → Capability → Contact*. Every section builds Trust, proves Capability, or reduces Contact friction.
- **Offer** — One of the three packaged service scopes sold on the Portfolio (Backend/MVP Build, AI/RAG Integration, Legacy Stabilization Audit). Each Offer has named deliverables + a timeline and carries no price in v1.
- **Contact** — A form submission (Name, Email, Budget, Message) or a direct email that represents a potential engagement. The funnel's success output.
- **Contact Flow** — The end-to-end path from form submission through the API route to EmailOctopus and the contacts metric.
- **Project Entry** — One curated case in the Projects section, framed problem → solution → result, with exactly one visual and live links.
- **Testimonial** — A named, attributed client quote. Even one beats zero.
- **Engagement** — Visit and time-on-site signals measured by Vercel Web Analytics.
- **v1** — The launch scope defined in §6.1. **v2** — Approved-but-deferred scope in §6.2, triggered post-launch by visitor data.

## 4. Features

The Portfolio is a **single-page site** with anchored sections in a fixed order — Hero → Services → Projects → About → Skills → Experience → Contact — plus a header nav and footer. [ASSUMPTION: single-page anchored layout, per the brief's section ordering; a multi-route IA is not required for v1.]

### 4.1 Information Architecture & Navigation

**Description:** The page order is itself the funnel narrative — each section sets up the next. Navigation must never obstruct: header links jump to sections, and the email address is reachable from both header and footer at all times, including mobile. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-1: Anchored section navigation

A Visitor can navigate the Portfolio via header nav links that scroll to each of the seven sections, with the current position visibly indicated. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Each header nav item scrolls smoothly to its section anchor without page reload.
- All seven sections are reachable from the header on desktop and mobile.
- Anchor jumps work with the browser back button [ASSUMPTION: standard anchor behavior is acceptable].

#### FR-2: Email always reachable

A Visitor can initiate a contact by email from the header and the footer, on every viewport size. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- A `mailto:` link to the Builder's email renders in both header and footer.
- The email is visible (not collapsed) on mobile header and footer.

#### FR-3: Responsive layout

A Visitor can read and act on the entire Portfolio on phone, tablet, and desktop without horizontal scroll or broken layout.

**Consequences (testable):**
- No content is clipped or overlapping at 360px, 768px, and 1280px widths.
- All CTAs and form fields have touch targets ≥ 44×44px on mobile.

### 4.2 Hero

**Description:** The first thing a Visitor sees: a first-person outcome line — "I build X for Y" — a short supporting line, and one primary CTA. The Hero states what the Builder does and for whom within two seconds, and anchors the glitch aesthetic with brief, purposeful glitch accents (see §9). Realizes UJ-1.

**Functional Requirements:**

#### FR-4: Outcome headline

The Hero renders a first-person outcome statement that names the audience and the value, replacing adjective-heavy taglines. Copy must be credible for a 1-year Harness Engineer — outcome-framed, no "never breaks" grand promises. [ASSUMPTION: exact copy is undecided; §11 OQ-4 holds research-backed candidate lines pending the Builder's choice.]

**Consequences (testable):**
- Headline follows an "I build X for Y" structure with a named outcome, not a skill list.
- Headline claims nothing the Builder's shipped work cannot evidence (no model ownership, no years-of-enterprise claims).
- Headline + supporting line fit above the fold at desktop and mobile.

#### FR-5: Hero primary CTA

The Hero renders one primary CTA that moves a Visitor toward Contact (scroll to the Contact section or a mailto link). Realizes UJ-1.

**Consequences (testable):**
- Exactly one primary CTA renders in the Hero.
- Activating it lands the Visitor at the Contact section or opens an email draft.

### 4.3 Services — Offers

**Description:** The Services section presents three packaged Offers, each with named deliverables and a timeline, and **no pricing** (pricing is deferred to v2). Packaged offers beat skill lists because they reduce a buyer's decision anxiety and pre-empt scope-mismatch failure (38% of freelance-hire failures are scope mismatch — research digest). **Course-corrected 2026-08-06:** the offers were realigned from the brief's generic backend framing to the Harness Engineer positioning, matching the work the Builder actually ships. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-6: Three packaged offers

A Visitor sees exactly three Offers aligned to the Harness Engineer positioning, each listing named deliverables and a timeline. Proposed set (pending OQ-8):

1. **AI Feature Build — RAG & Agent Harness (1–4 weeks)** — retrieval pipelines, agent orchestration, guardrails, evaluation.
2. **AI Chat/Agent Platform MVP (4–8 weeks)** — end-to-end product build on the pattern of the Builder's shipped chat platforms.
3. **Backend Stabilization & Migration (1–3 weeks)** — legacy audits, zero-downtime migrations, production hardening.

[APPROVED 2026-08-06: offer set confirmed by Builder — §11 OQ-8.]

**Consequences (testable):**
- Three Offer cards render, each with a name, deliverable list, and timeline.
- Deliverable wording is concrete (outcomes), not adjective-only claims.

#### FR-7: No pricing in v1

No Offer displays a price, rate, or currency. Realizes UJ-1.

**Consequences (testable):**
- No monetary value appears anywhere in the Services section.

#### FR-8: Offer-to-contact path

Each Offer provides a way to start a Contact referencing that Offer, so the Builder can qualify faster. [ASSUMPTION: per-offer CTA links to the Contact section; pre-filling an offer reference is optional v1 nicety.]

**Consequences (testable):**
- Each Offer card has an actionable CTA leading to the Contact Flow.
- A Visitor can complete a Contact from any Offer in ≤ 3 taps/clicks.

### 4.4 Projects

**Description:** The proof section. Each Project Entry is framed **problem → solution → result** and carries exactly one screenshot/GIF plus Live and GitHub links. Research favors 5–8 curated projects over breadth; v1 ships a curated set of the Builder's real, shipped AI work. **Course-corrected 2026-08-06:** the zero-downtime migration is *not* a Project Entry — it is a work statement that lives in Experience (§4.7). Project Entries are the shipped AI builds, led by the open-source agent SDK. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-9: Curated project entries with problem→solution→result framing

A Visitor can read each Project Entry as a problem → solution → result story, with the result stated with a magnitude (metric, count, or capability) — no adjective-only claims. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Each entry contains explicit problem, solution, and result blocks.
- Each result includes at least one quantified magnitude or concrete capability.
- v1 renders a curated set of three featured entries: **Shikigami Agent SDK, ChaiBookLM, ChaiChat** [decision 2026-08-06 — OQ-1 resolved].

#### FR-10: Harness-flavored project lead

The Projects section leads with the Shikigami Agent SDK — the open-source TypeScript agent harness — as the strongest proof of Harness Engineer capability. [ASSUMPTION: SDK is public and linkable; links verified at build — OQ-1.]

**Consequences (testable):**
- The first Project Entry in DOM order is the Shikigami Agent SDK.

#### FR-11: One visual per project

Each Project Entry renders exactly one screenshot or GIF. Visuals already exist for ChaiBookLM (3) and ChaiChat/persona-chat (2) in `_bmad-output/planning-artifacts/project-images/`; the SDK needs a visual (repo/README capture acceptable) [ASSUMPTION: SDK visual sourced at build — OQ-1].

**Consequences (testable):**
- Every Project Entry has exactly one visual asset with descriptive alt text.

#### FR-12: Live and GitHub links on every project

Each Project Entry links to a working source repository and, where a deployed demo exists, a working live system. Realizes UJ-2.

**Consequences (testable):**
- Every Project Entry has a working GitHub link; live links where demos exist (ChaiBookLM, ChaiChat, chaiGPT have live demos; the SDK links to GitHub + announcement).
- At launch, zero project links 404 or time out (feeds SM-2).

#### FR-13: No dead or placeholder content at launch

Placeholders used during build are fully replaced before launch; no lorem ipsum, no "TBD," no empty links survive. [ASSUMPTION: remaining build inputs (SDK visual, link verification) provided before launch — OQ-1.]

**Consequences (testable):**
- A pre-launch crawl of the Projects section finds zero placeholder markers and zero broken links.

#### FR-30: Additional showcase entries

A Visitor can see the Builder's remaining shipped work (e.g., chaiGPT — multi-provider AI chat platform) in a secondary showcase listing with live/GitHub links, without full problem→solution→result framing. Realizes UJ-2. [Decision 2026-08-06: feature SDK, ChaiBookLM, ChaiChat; showcase the rest — OQ-1.]

**Consequences (testable):**
- The showcase renders chaiGPT (and future additions) with working GitHub and live-demo links.
- Showcase entries are visually distinct from the three featured Project Entries.
- At launch, zero showcase links 404 or time out (feeds SM-2).

### 4.5 About

**Description:** A human, honest, work-related section. It explains how the Builder thinks and what working with him is like — the "work experience over the work" signal research names — without corporate filler or fabricated history. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-14: Honest work-focused about copy

The About section renders concise first-person copy that is human, work-related, and free of fabricated claims. Realizes UJ-1.

**Consequences (testable):**
- No claim in the About section asserts experience, employer, or credential the Builder does not have.
- Copy is written for a technical buyer, not a recruiter keyword scan.

### 4.6 Skills

**Description:** A compact, scannable proof of capability: 6–8 skill pills (AI/LLM, Backend, Database, AWS, Auth, Architecture), **no percentage bars** — research shows breadth-overload backfires and self-rated bars undermine credibility. Realizes UJ-1.

**Functional Requirements:**

#### FR-15: 6–8 skill pills

The Skills section renders 6–8 named skill pills, no more, led by Harness Engineer domains. Proposed set (pending confirmation): **LLM Harnessing (RAG, agents, orchestration), Vector Search, TypeScript/Node.js, Backend & APIs, Databases, AWS, Auth & Security, Architecture.**

**Consequences (testable):**
- Count of pills is between 6 and 8.
- Each pill names a skill domain, not a tool list [ASSUMPTION: pill set pending confirmation].

#### FR-16: No skill rating bars

No percentage, level bar, or numeric self-rating renders anywhere in the Skills section.

**Consequences (testable):**
- DOM contains no progress/bar elements in the Skills section.

### 4.7 Experience

**Description:** Work history reframed as **work statements** — outcome cards that say what happened, at what magnitude, and what it proves (e.g., "Ran a 3-day zero-downtime migration of 5 production collections"). The zero-downtime migration leads this section as a work statement, not a Project Entry (course-corrected 2026-08-06). Realizes UJ-2.

**Functional Requirements:**

#### FR-17: Outcome-framed work statements

The Experience section renders 2–3 work statements with magnitude, not role-verbs or duties. Proposed set from the Builder's real record (resume.md 2026-08-06):

1. **Zero-downtime migration** — led a 2-week MongoDB → DynamoDB migration (~12 collections, 5,000+ records), phased A/B cutover with zero downtime on 5 critical production collections.
2. **Legacy stabilization** — took a 2019 proof-of-concept NestJS backend, unmaintained 3+ years, audited, de-bugged, and refactored into production-ready state.
3. **Shipped mobile app** — React Native operator app for real-time charger fleet monitoring, live on the Play Store.

[ASSUMPTION: exact set and wording pending Builder confirmation — OQ-2.]

**Consequences (testable):**
- Each work statement states an outcome and includes a magnitude.
- No item reads as a pure responsibility list.
- The migration is rendered as a work statement in Experience, not as a Project Entry.

### 4.8 Testimonials

**Description:** One named, attributed quote beats none. A Testimonial is requested from the Brigosha manager for launch. Realizes UJ-2.

**Functional Requirements:**

#### FR-18: At least one attributed testimonial at launch

The Portfolio renders at least one Testimonial with a name/role attribution. [ASSUMPTION: quote text is a build input; §11 OQ-3.]

**Consequences (testable):**
- ≥ 1 Testimonial renders with attribution (name and role).
- The quote is not presented as anonymous.

### 4.9 Contact Flow

**Description:** The funnel's payoff — a working `POST /api/contact` form (Name, Email, Budget, Message) that delivers submissions to EmailOctopus (free tier) and feeds the same route to the contacts metric. The form must work flawlessly, tell the Visitor what happened, and never silently lose a submission. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-19: Contact form fields and validation

A Visitor can submit a Contact with Name, Email, Message, and a project-scope field; required fields are validated client-side with clear, accessible error messages. The fourth field is **free text** (fixed decision 2026-08-06 — OQ-6 resolved); label is **Project type** per resume.md. [NOTE FOR PM: if the intended label is Budget, flip FR-19 wording and OQ-6.]

**Consequences (testable):**
- Submitting with an invalid email shows an inline error and does not send.
- Required-field errors name the field and are screen-reader accessible.
- Form renders four fields: Name, Email, Project type (free text), Message.
- The fourth field accepts free text, not preset ranges.

#### FR-20: Form submission reaches EmailOctopus

A valid Contact submission POSTs to the contact API route and is delivered to EmailOctopus (free tier). Realizes UJ-3.

**Consequences (testable):**
- A valid submission results in an EmailOctopus contact/list entry within a reasonable window [ASSUMPTION: EmailOctopus account + list exist as build inputs].
- API key is never exposed to the client.

#### FR-21: Success confirmation to the Visitor

After a successful submission, the Visitor sees a clear success confirmation in the form's place — not a silent redirect. Realizes UJ-1.

**Consequences (testable):**
- Success state renders immediately after the POST resolves; form clears.
- The message tells the Visitor what happens next (reply timeline [ASSUMPTION]).

#### FR-22: Visible failure handling

If a submission fails (network, provider), the Visitor sees an error message, their input is preserved, and a retry is possible. Realizes UJ-1.

**Consequences (testable):**
- Failure renders an error state, restores field values, and allows resubmission without reload.

#### FR-23: Spam protection

The Contact Flow includes lightweight spam protection so the Builder's inbox stays usable without extra tooling. [ASSUMPTION: a honeypot field + server-side basic checks are sufficient for v1 traffic.]

**Consequences (testable):**
- Automated submissions caught by the honeypot do not reach EmailOctopus.
- Legitimate submissions are unaffected (no captcha in v1 [ASSUMPTION]).

#### FR-24: Contacts metric feed

The contact API route records each Contact (submission event) so the contacts metric can be measured. Realizes UJ-3.

**Consequences (testable):**
- Each valid submission increments the contacts metric by one.
- The metric is viewable by the Builder without opening EmailOctopus [ASSUMPTION: route logs to a simple store/analytics event].

### 4.10 Resume

**Description:** A downloadable freelance-oriented resume as a static PDF with a styled download button, cache-busted. The current resume is corporate-oriented; a freelancing version is a build input. Realizes UJ-2.

**Functional Requirements:**

#### FR-25: Resume download button

A Visitor can download the Builder's resume via a styled button pointing at the static PDF with a cache-busting query. Realizes UJ-2.

**Consequences (testable):**
- Button triggers download of `/public/resume.pdf` (cache-busted `?v=`).
- Button is styled consistently with the design system and reachable from the relevant section [ASSUMPTION: placement = Experience or Contact area].

#### FR-26: Freelance resume present at launch

The resume PDF exists, is the freelancing-oriented version, and opens without error. Content is currently a **placeholder** — the Builder will update `planning-artifacts/resume.md` later; the PDF is generated from that file at build (OQ-5 resolved 2026-08-06).

**Consequences (testable):**
- `/public/resume.pdf` returns 200 with a valid PDF at launch.
- The PDF reflects the Builder's final resume.md content — placeholder text never ships.

### 4.11 Analytics

**Description:** Free, zero-config Vercel Web Analytics measures visits and engagement; the contacts metric rides the contact route. No additional paid tooling in v1; Simple Analytics is the named upgrade path for later. Realizes UJ-3.

**Functional Requirements:**

#### FR-27: Vercel Web Analytics on all pages

Vercel Web Analytics loads on the Portfolio and reports visits and engagement (time on site). Realizes UJ-3.

**Consequences (testable):**
- Analytics script loads on every page render; visits and engagement appear in the Vercel dashboard.
- No analytics block in non-production environments [ASSUMPTION].

#### FR-28: Contacts metric measurement

The contacts metric (valid Contact submissions) is measured and viewable by the Builder. Realizes UJ-3.

**Consequences (testable):**
- Contacts metric increments on valid submissions (see FR-24) and is displayed in the analytics view.

#### FR-29: No third-party analytics beyond free tier

v1 ships no analytics dependency beyond Vercel Web Analytics and the contact route; no paid tool. **Consent (fixed 2026-08-06 — OQ-7):** Vercel Web Analytics is confirmed to use cookies, so v1 includes a lightweight cookie-consent banner that defers analytics until accepted. [ASSUMPTION overturned: cookieless assumption replaced by the consent-banner requirement.]

**Consequences (testable):**
- No additional analytics scripts load in production beyond Vercel Web Analytics.
- Analytics initialize only after consent (per banner configuration).
- The consent banner is accessible, dismissible, and does not obstruct the Contact Flow.

## 5. Non-Goals (Explicit)

- **Not a resume:** the Portfolio never reads as a CV dump; experience is outcome-framed and curated.
- **No geo-split personalization** in v1 — no `/in`, `/us`, or server-side geolocation (deferred to v2, post-launch, with visitor-data justification).
- **No buyer-segment positioning** in v1 — single positioning; segment-specific (US/UK offshore vs India) framing is v2.
- **No pricing or rates displayed** in v1.
- **No availability statement** in v1 — there is no real number to commit to pre-launch.
- **No decision-system blog/content pages** in v1 — blog feeds awareness-stage traffic and demonstrates backend depth in v2.
- **No visual redesign** — the glitch/Y2K aesthetic in `design.md` is the reference, not a prompt to redesign.
- **No fabricated metrics or experience:** every claim carries a real magnitude or is not made.
- **No model ownership claims:** the Builder builds harnesses around LLMs (orchestration, RAG, guardrails, evaluation) — never claims to train or own foundation models.
- **No grand promises:** hero and copy stay credible for a 1-year engineer — no "never breaks," no enterprise-scale guarantees the record can't back.
- **No skill rating bars, no keyword-wall copy, no contact friction** (email reachable always).

## 6. MVP Scope

### 6.1 In Scope

- Seven-section single-page site: Hero, Services (3 Harness-aligned Offers, no pricing), Projects (3 featured entries — Shikigami Agent SDK, ChaiBookLM, ChaiChat — plus a secondary Showcase for remaining work), About, Skills (6–8 pills), Experience (2–3 work statements), Contact.
- Header nav + footer with always-visible email; responsive at 360/768/1280px.
- Contact Flow: `POST /api/contact` → EmailOctopus (free tier), success/error states, spam protection, contacts metric feed.
- Resume: freelance PDF + cache-busted download button.
- Testimonials: ≥ 1 attributed quote.
- Analytics: Vercel Web Analytics + contacts metric.
- Glitch/Y2K aesthetic per design reference, accessibility-respecting (§9, §8).

### 6.2 Out of Scope for MVP

- Geo-split `/in` `/us` + server-side geolocation — **v2**; needs visitor data to justify. *[NOTE FOR PM: emotionally load-bearing — the Builder wants regional relevance; revisit at first post-launch metrics review.]*
- Buyer-segment positioning — **v2**; needs more research + post-launch decision.
- Pricing model — **v2**; offers ship deliverables + timeline only.
- Availability statement — **v2**; no number to commit to pre-launch.
- Decision-system blog pages (diagrams + animations) — **v2**; priority is working webpages first. *[NOTE FOR PM: high-value for "invisible backend work" pain; schedule explicitly in v2 planning.]*
- LinkedIn profile — build input/decision, not a site feature *[NOTE FOR PM: high value for freelancing credibility; track externally.]*

## 7. Success Metrics

*Qualitative targets per Builder choice (2026-08-06). Each SM cross-references the FRs it validates.*

**Primary**
- **SM-1: Contacts flowing** — Contact submissions arrive in email and increment the contacts metric; the funnel's payoff works end to end. Validates FR-19, FR-20, FR-24, FR-28.
- **SM-2: Zero friction failures** — no broken links, all project Live + GitHub links resolve, email reachable from header/footer on all viewports. Validates FR-1, FR-2, FR-12, FR-13.
- **SM-3: Proof present at launch** — ≥ 1 attributed Testimonial and a downloadable freelance resume. Validates FR-18, FR-25, FR-26.

**Secondary**
- **SM-4: Engagement tracked** — visits and average time on site are visible in Vercel Web Analytics from launch day. Validates FR-27.

**Counter-metrics (do not optimize)**
- **SM-C1: Vanity traffic** — raw visit volume must not be optimized; the goal is qualified Contacts, not traffic. Counterbalances SM-1.
- **SM-C2: Raw submission volume** — brute-force form volume (or spam slipping through) must not be chased at the cost of submission quality; spam guardrails stay (FR-23). Counterbalances SM-1.

## 8. Cross-Cutting NFRs

- **Performance** — the site is the demo: pages render quickly on 3G and mid-tier mobile. [ASSUMPTION: Lighthouse performance ≥ 90 on mobile is the target; exact budget set in architecture.]
- **Accessibility** — WCAG 2.1 AA: body text contrast ≥ 4.5:1, all visuals have alt text, keyboard-navigable, focus states visible. Glitch effects must respect `prefers-reduced-motion`; no flashing > 3×/second; glitch bursts 100–400ms with snap-back (design reference).
- **Reliability** — Contact Flow is the one thing that must never be silently broken: monitor submission failures; zero-dead-link check at launch (SM-2).
- **Security** — EmailOctopus API key server-side only; contact route validates input server-side; no secrets in client bundle.
- **Observability** — Vercel Web Analytics for visits/engagement; contacts metric via contact route; upgrade path to Simple Analytics named (brief addendum).

## 9. Aesthetic and Tone

**Aesthetic (reference: `_bmad-output/planning-artifacts/design.md`, Nifty Portal teardown):** glitch/Y2K — dark near-black backgrounds, neon accent glitches, RGB channel splits, scan lines, low-opacity distortion overlays, all-caps technical headings with monospace undertones and technical numbering. **Application principle: glitches are short (100–400ms), well-timed, and purposeful** — they snap back, never obscure body text, never glitch CTAs or the contact form, and are disabled for `prefers-reduced-motion`. Out of v1 scope: a full visual redesign; this section constrains how the existing aesthetic is applied.

**Voice:** first-person, direct, outcome-focused — "I build X for Y," spoken as a Harness Engineer: the infrastructure around LLMs (retrieval, orchestration, guardrails, evaluation), never model ownership. Every claim carries a magnitude or is not made, and stays credible for 1+ years of experience — no grand promises. Honest: no fabricated experience, no self-rated skill bars. Written for a technical buyer scanning in 15–30 seconds: short lines, scannable structure, zero corporate filler.

## 10. Constraints and Guardrails

- **Privacy** — collect only the four contact fields (Name, Email, Project type, Message); nothing more. Contact data flows to EmailOctopus only. Vercel Web Analytics confirmed to use cookies (2026-08-06) → v1 ships a lightweight cookie-consent banner (FR-29); no other tracking.
- **Cost** — v1 rides free tiers only: Vercel (site + Web Analytics), EmailOctopus (free tier). No paid dependency introduced without decision.
- **Spam** — honeypot + basic server-side checks (FR-23); no captcha burden on Visitors in v1.

## 11. Open Questions

1. **Project inventory** — **RESOLVED (2026-08-06):** featured entries = Shikigami Agent SDK, ChaiBookLM, ChaiChat (live webpage); chaiGPT and the rest go in a secondary Showcase (FR-30).
2. **Experience work statements** — confirm the proposed 2–3 work statements (migration, legacy stabilization, Play Store app) and wording. *(q2 skipped per Builder 2026-08-06 — resolved with proposed set above.)*
3. **Testimonial text** — quote from the Brigosha manager (2–3 lines; attribution). *(q3 skipped per Builder 2026-08-06 — open, no action now.)*
4. **Hero copy** — research-backed candidate lines presented 2026-08-06 (harness framing); Builder decides later.
5. **Freelance resume** — **RESOLVED (2026-08-06):** resume.md rewritten for Harness Engineer positioning; content stays a placeholder until the Builder updates the file later; PDF export at build (FR-26).
6. **Contact form fourth field** — **RESOLVED (2026-08-06, fixed decision):** fourth field is **free text**; label **Project type** per resume.md (flip to Budget on request — see [NOTE FOR PM] at FR-19).
7. **Vercel Web Analytics consent** — **RESOLVED (2026-08-06):** Vercel confirmed to use cookies → v1 ships a lightweight cookie-consent banner (FR-29).
8. **Services offer set** — **RESOLVED (2026-08-06):** approved the three Harness-aligned offers (FR-6).
9. **Brief positioning patch** — **RESOLVED (2026-08-06):** brief patched with a positioning note; PRD + change proposal carry the direction.

## 12. Assumptions Index

- §4 intro — single-page anchored layout (no multi-route IA in v1).
- §4.1 FR-1 — standard anchor behavior with browser back navigation is acceptable.
- §4.2 FR-4 — Hero copy undecided; candidate lines pending Builder (OQ-4).
- §4.3 FR-6 — Harness-aligned offer set approved (OQ-8, 2026-08-06).
- §4.3 FR-8 — per-offer CTA links to Contact; pre-filling an offer reference is optional.
- §4.4 FR-9 — three featured Project Entries (SDK, ChaiBookLM, ChaiChat) — resolved (OQ-1).
- §4.4 FR-10 — Shikigami Agent SDK leads Projects; public links verified at build.
- §4.4 FR-11 — one visual per project; SDK visual sourced at build (OQ-1).
- §4.4 FR-13 — placeholders replaced before launch (OQ-1).
- §4.4 FR-30 — showcase lists chaiGPT + future additions; links verified at launch.
- §4.6 FR-15 — pill set pending confirmation.
- §4.7 FR-17 — work-statement set and wording pending confirmation (OQ-2).
- §4.8 FR-18 — testimonial text from Brigosha manager (OQ-3).
- §4.9 FR-19 — four-field form; fourth field free text, label Project type (OQ-6 fixed).
- §4.9 FR-20 — EmailOctopus account + list exist as build inputs.
- §4.9 FR-21 — success state mentions a reply timeline.
- §4.9 FR-23 — honeypot + server-side checks suffice; no captcha in v1.
- §4.9 FR-24 — contacts metric recorded via the route (simple store/analytics event).
- §4.10 FR-25 — resume button placement in Experience or Contact area.
- §4.10 FR-26 — resume content placeholder until Builder updates resume.md (OQ-5).
- §4.11 FR-27 — analytics disabled outside production.
- §4.11 FR-29 — Vercel Web Analytics uses cookies → consent banner required (OQ-7).
- §8 — Lighthouse performance ≥ 90 mobile target (budget finalized in architecture).
