---
title: "Product Brief: Freelance Harness Engineer Portfolio"
status: final
created: 2026-08-06
updated: 2026-08-08
---

# Product Brief: Freelance Harness Engineer Portfolio

## Positioning Patch (2026-08-06)

**Harness Engineer, not generic backend engineer.** The Builder's positioning is **Harness Engineer** — the infrastructure around LLMs (RAG pipelines, retrieval, agent orchestration, guardrails, evaluation) — matching the work he ships (Shikigami Agent SDK, ChaiBookLM, ChaiChat, chaiGPT). The zero-downtime migration is a **work statement** (Experience), not a Project Entry. Hero and Services are realigned to the Harness identity, credible at 1+ year of experience — no model-ownership or grand-promise claims. **The corrected source of truth is the PRD.**

## Status

- **v1 — finalized**: working webpages (Hero, Services, Projects, About, Skills, Experience, Contact), contact flow (EmailOctopus), resume, analytics. Scope locked for build.
- **v2 — approved (deferred)**: geo-split `/in` `/us`, buyer-segment positioning, pricing, availability, decision-system blog pages, LinkedIn. Deferred to post-launch, gated on visitor data.

## Executive Summary

A high-converting portfolio for Prajwal M, a freelance backend engineer starting out, on Next.js + Tailwind, deployed on Vercel. Treated as a **4-step conversion funnel** — *Visit → Trust → Capability → Contact* — not a resume. Every section builds trust, proves capability, or reduces contact friction. Anything needing more research or visitor data is deferred to v2.

## The Problem

Freelance backend portfolios lose clients in seconds. Clients scan (15–30s), evaluate risk not code, and filter out on: no clear offer, invisible backend work, adjective-only claims, buried contact, and no verifiable proof. The existing content is ~90% of a winning portfolio — the work is **ordering and framing**, not creating from scratch.

## The Solution

A working Next.js + Tailwind site on Vercel, structured as one conversion funnel: **Hero → Services → Projects → About → Skills → Experience → Contact**.

- **Hero**: first-person outcome line ("I build X for Y") from resume.md headline/tagline.
- **Services**: 3 packaged Harness-aligned offers with deliverables + timeline. Pricing deferred to v2.
- **Projects**: problem → solution → result framing; lead with the open-source agent SDK; one screenshot/GIF per project.
- **About**: human, honest, work-related.
- **Skills**: 6–8 pills (harness-first). No percentage bars.
- **Experience**: 2–3 outcome-framed work statements.
- **Contact**: email in header + footer; working `POST /api/contact` form wired to EmailOctopus; same route feeds the contacts metric.
- **Resume**: static PDF at `/public/resume.pdf` + styled button (cache-bust `?v=`), generated from resume.md.
- **Analytics**: Vercel Web Analytics + cookie-consent banner; contacts measured via the contact route.

## What Makes This Different

- The site is itself the demo — fast, working, deployed on Vercel.
- Packaged offers over skill lists.
- Outcome-framed content — metrics over adjectives.
- Honest sequencing — v1 ships only what converts; v2 waits for real visitor data.

## Who This Serves

- **Builder (primary)**: Prajwal M — starting freelance career; needs a portfolio that ships working things.
- **Visitors**: startup founders, agency owners, PMs hiring a freelance backend dev.

## Success Criteria

- **Contacts** — form submissions flowing into email + metric.
- **Engagement** — visits and avg time via Vercel Web Analytics.
- **Zero friction failures** — no broken links; contact reachable from header and footer.
- **Proof present at launch** — downloadable freelance resume.

## Scope

### v1 — Finalized

Hero, Services (3 no-price Harness offers), Projects (3 featured + showcase), About, Skills (6–8 pills), Experience (2–3 work statements), Contact; contact API + EmailOctopus; resume PDF + button; Vercel Web Analytics + contacts metric + cookie-consent banner. No testimonials.

### v2 — Approved (deferred, post-launch)

- Geo-split `/in` `/us` + server-side geolocation.
- Buyer-segment positioning.
- Pricing model.
- Availability statement.
- Decision-system blog pages.
- LinkedIn profile.

**Also out:** visual redesign — the glitch/Y2K aesthetic is the reference, not to be re-designed.

## Vision

v1 is a working, converting portfolio. v2 adds geo-personalized pages and decision-system content that educates at the awareness stage and demonstrates backend depth. Longer term: an owned funnel — case studies, offers, and content that bring inbound work.

## Addendum Highlights

- **Conversion funnel:** Visit → Trust → Capability → Contact; 15–30 second scan.
- **Trust anxiety is the #1 filter** — proof beats brilliance; clear offers pre-empt scope mismatch.
- **Backend work is invisible** — sell decisions, architecture, and outcomes.
- **Adjective-only claims kill credibility** — every claim needs a magnitude.
- **Breadth-overload backfires** — 5–8 curated projects beat 12; 6–8 skill pills beat 40.
- **Contact friction is a silent killer** — email in nav + footer, working mobile form.
- **Packaged offers reduce decision anxiety** more than hourly rates or skill lists.
- **Build inputs:** testimonials (Brigosha manager), freelance resume, LinkedIn, project screenshots/GIFs.
