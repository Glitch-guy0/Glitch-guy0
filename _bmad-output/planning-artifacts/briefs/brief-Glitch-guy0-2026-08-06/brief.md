---
title: "Product Brief: Freelance Backend Engineer Portfolio"
status: draft
created: 2026-08-06
updated: 2026-08-06
---

# Product Brief: Freelance Backend Engineer Portfolio

## Executive Summary

A high-converting portfolio for Prajwal M, a freelance backend engineer starting out. Built on the existing Next.js + Tailwind choice, deployed on Vercel. The portfolio is treated as a **4-step conversion funnel** — *Visit → Trust → Capability → Contact* — not a resume. Every section either builds trust, proves capability, or reduces contact friction.

**v1 ships the working webpages**: Hero, Services, Projects, About, Skills, Experience, Contact — ordered for scanning, with packaged offers (deliverables + timeline), a working contact form, resume download, and analytics wired to measure the funnel. Anything that needs more research or visitor data — geo-split personalization, buyer-segment positioning, pricing, availability, decision-system content — is **explicitly deferred to v2 after first launch**.

## The Problem

Freelance backend portfolios lose clients in seconds. Clients scan (15–30s), are evaluating risk not code, and filter out on: no clear offer ("what can I buy?"), invisible backend work (architecture decisions don't screenshot well), adjective-only claims, buried contact, and no verifiable proof. The existing content is ~90% of a winning portfolio — the work is **ordering and framing**, not creating from scratch.

## The Solution

A working Next.js + Tailwind site on Vercel, structured as one conversion funnel:

**Hero → Services → Projects → About → Skills → Experience → Contact**

- **Hero**: first-person outcome line ("I build X for Y").
- **Services**: 3 packaged offers — Backend/MVP Build (4–8 wks), AI/RAG Integration (1–3 wks), Legacy Stabilization Audit (1 wk) — each with deliverables + timeline. Pricing deferred to v2.
- **Projects**: problem → solution → result framing; lead with the zero-downtime migration result; one screenshot/GIF per project.
- **About**: keep — human, honest, work-related.
- **Skills**: 6–8 pills (AI/LLM, Backend, DB, AWS, Auth, Architecture). No percentage bars.
- **Experience**: 2 bullets reframed as outcomes (e.g., "Ran a 3-day zero-downtime migration of 5 production collections").
- **Contact**: email in header + footer; working `POST /api/contact` form (Name, Email, Budget, Message) wired to EmailOctopus (free tier); same route feeds the contacts metric.
- **Resume**: static PDF at `/public/resume.pdf` + styled button (cache-bust `?v=`).
- **Analytics**: Vercel Web Analytics (free, zero-config) for visits + engagement; contacts measured via the contact route.

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
- **Zero friction failures** — no broken links, all projects have live + GitHub links, contact reachable from header and footer.
- **Proof present at launch** — at least one testimonial (Brigosha manager) and a downloadable freelance resume.

## Scope

**In v1:** Hero, Services (3 offers, no pricing), Projects, About, Skills, Experience, Contact; contact API + EmailOctopus; resume PDF + button; Vercel Web Analytics + contacts metric; testimonials (ask manager); freelance resume.

**Explicitly out of v1 (v2, post-launch):** geo-split `/in` `/us` + server-side geolocation; buyer-segment positioning; pricing model; availability statement; decision-system blog pages (diagrams + animations).

**Also out:** visual redesign — the glitch/Y2K aesthetic in `design.md` is the reference, not to be re-designed.

## Vision

v1 is a working, converting portfolio. v2 adds geo-personalized pages and decision-system content that educates at the awareness stage and demonstrates backend depth with diagrams and animations. Longer term: the portfolio becomes an owned funnel — case studies, offers, and content that bring inbound work.

## Open Decisions (blocking nothing in v1)

- Availability statement (deferred to v2).
- LinkedIn profile, freelance resume content, testimonials, project screenshots/GIFs (build inputs, not decisions).
