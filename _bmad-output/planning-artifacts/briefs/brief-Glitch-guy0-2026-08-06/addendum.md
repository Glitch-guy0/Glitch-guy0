---
title: "Product Brief Addendum: Freelance Backend Engineer Portfolio"
status: final
created: 2026-08-06
updated: 2026-08-06
---

# Addendum — Freelance Backend Engineer Portfolio

Companion to `brief.md`. Captures depth that belongs in downstream documents (PRD, UX, architecture) and decision rationale that did not fit the brief.

## 1. Conversion Funnel Model

The portfolio is a **4-step conversion funnel**, not a resume:

> **Visit** → "Do I trust them?" → "Can they do my job?" → "How do I start?" → **Contact**

Every section either builds **trust**, proves **capability**, or **reduces friction**. Visitors scan in **15–30 seconds**; content must be skimmable. Buyers evaluate risk, not code — "is it safe to give this person my money?"

## 2. Section-by-Section Guidance (v1)

Page order: **Hero → Services → Projects → About → Skills → Experience → Contact**

| Section | Guidance |
|---|---|
| Hero | First-person outcome line: "I build X for Y." |
| About | Human, honest, work-related. |
| Services | 3 packaged offers — Backend/MVP Build (4–8 wks), AI/RAG Integration (1–3 wks), Legacy Stabilization Audit (1 wk). Deliverables + timeline, no pricing. |
| Projects | **problem → solution → result** framing. Lead with zero-downtime migration *result*. One screenshot/GIF per project. |
| Skills | 6–8 pills (AI/LLM, Backend, DB, AWS, Auth, Architecture). No percentage bars. |
| Experience | 2 bullets reframed as outcomes (e.g., "Ran a 3-day zero-downtime migration of 5 production collections"). |
| Testimonials | Ask Brigosha manager for 2–3 lines. Even one quote beats zero. |
| Contact | Email in header + footer, not just the contact section. |

**Contact implementation:** `POST /api/contact` (Name, Email, Budget, Message) → EmailOctopus (free tier). Same route feeds the contacts metric.
**Resume:** static PDF `/public/resume.pdf` + button, cache-bust `?v=`.
**Analytics:** Vercel Web Analytics (free, zero-config); upgrade path Simple Analytics.

## 3. Geo-Split Decision Record (v2)

**Decision:** serve `/in` and `/us` subdirectories, not hash routes. **Deferred to v2 (post-launch)**.

- **Rejected: hash fragments (`/#india`).** Hashes are never sent to the server — client-side only. Cannot enable "dynamic based on where the call is made to my server."
- **Chosen approach (when built):** server-side geolocation on Vercel via `x-vercel-ip-country` header / `@vercel/functions` `geolocation()` helper (city/country/region) in middleware or Route Handlers. Headers auto-injected on Vercel, absent locally.
- **SEO constraints:** avoid aggressive IP auto-redirects and cloaking; treat Googlebot like any user. Separate regional pages → subdirectories with `hreflang`/canonicals.
- **What to localize:** headline copy, region-relevant proof (testimonials first), pricing/currency framing, timezone + availability statement.

## 4. Deferred v2 Decisions and Rationale

| Decision | Status | Rationale / next trigger |
|---|---|---|
| Buyer-segment targeting (US/UK offshore vs India) | Deferred | Needs more research + decision-making post-launch; positioning language and offer framing differ per segment. |
| Pricing model | Deferred | v1 offers ship deliverables + timeline only; research favors packaged fixed scopes over hourly. |
| Availability statement | Deferred | No real number to commit to pre-launch. |
| Geo-split `/in` `/us` | Deferred | Needs better reason/justification; revisit post-launch with visitor data. |
| Decision-system blog (diagrams + animations) | Deferred | Priority order: working webpages > blog. Blog feeds awareness-stage traffic; answers "invisible backend work" pain. |

## 5. Research Digests (source: market research 2026-08-06)

- **Trust anxiety is the #1 filter.** Proof (metrics, named testimonials, references) matters more than technical brilliance. 38% of freelance-hire failures = scope mismatch — clear offers pre-empt it.
- **Backend work is invisible.** Selling decisions, architecture, and outcomes (writing, diagrams, metrics) — not screenshots.
- **Adjective-only claims kill credibility.** Every claim needs a magnitude.
- **Breadth-overload backfires.** 5–8 curated projects beat 12; 6–8 skill pills beat 40.
- **Contact friction is a silent killer.** Email in nav + footer, working mobile form.
- **Packaged offers reduce decision anxiety** more than hourly rates or skill lists.
- **"Work experience over the work"** — buyers judge process structure and how easy you are to manage.

## 6. Build Inputs Required (external actions)

- **Testimonials** — ask Brigosha manager (2–3 lines; one beats zero).
- **Freelance resume** — create freelancing-oriented PDF (current is corporate).
- **LinkedIn profile** — missing; high value for freelancing credibility.
- **Project screenshots/GIFs** — one per project.

## 7. Design Reference

The glitch/Y2K aesthetic documented in `_bmad-output/planning-artifacts/design.md` is the design reference (Nifty Portal teardown). Application principle: glitch effects are short, well-timed, purposeful — keep body text readable; do not glitch the whole page. Out of v1 scope: visual redesign.
