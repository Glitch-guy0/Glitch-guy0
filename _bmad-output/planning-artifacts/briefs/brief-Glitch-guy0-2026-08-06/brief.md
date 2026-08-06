---
title: "Product Brief: Freelance Harness Engineer Portfolio"
status: final
created: 2026-08-06
updated: 2026-08-06
---

# Product Brief: Freelance Harness Engineer Portfolio

## Positioning Patch (2026-08-06)

**Harness Engineer, not generic backend engineer.** Course-corrected via `sprint-change-proposal-2026-08-06.md`: the Builder's positioning is now **Harness Engineer** — the infrastructure around LLMs (RAG pipelines, retrieval, agent orchestration, guardrails, evaluation) — matching the work he actually ships (Shikigami Agent SDK, ChaiBookLM, ChaiChat, chaiGPT). The zero-downtime migration is a **work statement** (Experience section), not a Project Entry. Hero and Services are realigned to the Harness identity and stay credible at 1+ year of experience — no model-ownership or grand-promise claims. **This note supersedes "freelance backend engineer" references in the body below; the corrected source of truth is the PRD** (`prds/prd-Glitch-guy0-2026-08-06/prd.md`). All v1 scope-structure decisions below remain valid.

## Status

- **v1 — finalized**: working webpages (Hero, Services, Projects, About, Skills, Experience, Contact), contact flow (EmailOctopus), resume, analytics. Scope locked for build.
- **v2 — approved (deferred)**: geo-split `/in` `/us`, buyer-segment positioning, pricing model, availability statement, decision-system blog pages, LinkedIn. Direction approved; **deferred to post-launch** and gated on visitor data (details in Scope → v2).

## Executive Summary

A high-converting portfolio for Prajwal M, a freelance backend engineer starting out. Built on the existing Next.js + Tailwind choice, deployed on Vercel. The portfolio is treated as a **4-step conversion funnel** — *Visit → Trust → Capability → Contact* — not a resume. Every section either builds trust, proves capability, or reduces contact friction.

**v1 ships the working webpages**: Hero, Services, Projects, About, Skills, Experience, Contact — ordered for scanning, with packaged offers (deliverables + timeline), a working contact form, resume download, and analytics wired to measure the funnel. Anything that needs more research or visitor data — geo-split personalization, buyer-segment positioning, pricing, availability, decision-system content — is **explicitly deferred to v2 after first launch**.

## The Problem

Freelance backend portfolios lose clients in seconds. Clients scan (15–30s), are evaluating risk not code, and filter out on: no clear offer ("what can I buy?"), invisible backend work (architecture decisions don't screenshot well), adjective-only claims, buried contact, and no verifiable proof. The existing content is ~90% of a winning portfolio — the work is **ordering and framing**, not creating from scratch.

## The Solution

A working Next.js + Tailwind site on Vercel, structured as one conversion funnel:

**Hero → Services → Projects → About → Skills → Experience → Contact**

- **Hero**: first-person outcome line ("I build X for Y"), sourced from the resume.md headline/tagline.
- **Services**: 3 packaged Harness-aligned offers — AI Feature Build — RAG & Agent Harness (1–4 wks), AI Chat/Agent Platform MVP (4–8 wks), Backend Stabilization & Migration (1–3 wks) — each with deliverables + timeline. Pricing deferred to v2.
- **Projects**: problem → solution → result framing; lead with the open-source agent SDK; one screenshot/GIF per project. The migration is a work statement in Experience, not a Project Entry (positioning patch).
- **About**: keep — human, honest, work-related.
- **Skills**: 6–8 pills (harness-first: LLM Harnessing, Vector Search, TS/Node, Backend, DB, AWS, Auth, Architecture). No percentage bars.
- **Experience**: 2–3 work statements reframed as outcomes (zero-downtime migration, legacy stabilization, Play Store app), from resume.md.
- **Contact**: email in header + footer; working `POST /api/contact` form (Name, Email, Project type, Message) wired to EmailOctopus (free tier); same route feeds the contacts metric. No testimonials in v1 (decision 2026-08-06).
- **Resume**: static PDF at `/public/resume.pdf` + styled button (cache-bust `?v=`), generated from resume.md and adapted to the design voice.
- **Analytics**: Vercel Web Analytics (free, zero-config) for visits + engagement with cookie-consent banner; contacts measured via the contact route.

## What Makes This Different

- **The site is itself the demo** — fast, working, deployed on Vercel is subtle proof of backend competence.
- **Packaged offers over skill lists** — clients buy offers with predictable scope and timeline, not labels.
- **Outcome-framed content** — metrics over adjectives; no fabricated experience.
- **Honest sequencing** — v1 ships only what converts and proves capability; geo-split and decision-system content wait for v2 where real visitor data will justify them.

## Who This Serves

- **Builder (primary)**: Prajwal M — starting out as a freelance backend engineer with no client experience yet; needs a portfolio that ships working things and explains how he thinks.
- **Visitors**: startup founders, agency owners, and product managers hiring a freelance backend dev. Segment-specific targeting (US/UK offshore vs India) is deferred to v2.

## Success Criteria

- **Contacts** — the number that matters: form submissions flowing into email + metric.
- **Engagement** — page visits and avg time tracked via Vercel Web Analytics.
- **Zero friction failures** — no broken links, declared project links resolve (pre-launch scripted crawl reports zero 404s/timeouts), contact reachable from header and footer.
- **Proof present at launch** — a downloadable freelance resume (from resume.md, adapted to the design voice).

## Scope

### v1 — Finalized (in build scope)

Hero, Services (3 no-price Harness offers), Projects (3 featured entries + showcase), About, Skills (6–8 pills), Experience (2–3 work statements), Contact; contact API + EmailOctopus; resume PDF + button; Vercel Web Analytics + contacts metric + cookie-consent banner; freelance resume (from resume.md). No testimonials.

### v2 — Approved (deferred, post-launch)

All v2 scope is deferred and gated on the first post-launch visitor-data review (Vercel Web Analytics + contacts metric). No item is scheduled; each is decided with real data in hand.

- **Geo-split `/in` `/us` + server-side geolocation** — regional subdirectories via Vercel geolocation; needs visitor data to justify. Emotionally load-bearing for the Builder; revisit at first post-launch metrics review. (Approach record: addendum §3.)
- **Buyer-segment positioning** — segment-specific framing (US/UK offshore vs India); needs more research + post-launch decision.
- **Pricing model** — pricing for the three offers; v1 ships deliverables + timeline only; research favors packaged fixed scopes over hourly.
- **Availability statement** — no real number to commit to pre-launch; the resume PDF may carry one in v1 (resume domain, not the site).
- **Decision-system blog pages** — diagrams + animations that make invisible backend work visible; feeds awareness-stage traffic; priority is working webpages first.
- **LinkedIn profile** — freelancing-oriented presence; external build input / decision, not a site feature; high value for freelancing credibility.

**Also out:** visual redesign — the glitch/Y2K aesthetic in `design.md` is the reference, not to be re-designed.

## Vision

v1 is a working, converting portfolio. v2 adds geo-personalized pages and decision-system content that educates at the awareness stage and demonstrates backend depth with diagrams and animations. Longer term: the portfolio becomes an owned funnel — case studies, offers, and content that bring inbound work.

## Open Decisions (blocking nothing in v1)

- Project screenshots/GIFs, SDK visual, EmailOctopus account + API key, resume PDF export, pre-launch link-check script (build inputs, not decisions).
