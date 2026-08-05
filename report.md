# Portfolio Content & Requirements Analysis

> **Author:** Mary (Business Analyst) — BMad session
> **Date:** 2026-08-06
> **Subject:** Prajwal M — Freelance Backend Engineer portfolio (repo: `Glitch-guy0`)

---

## Executive Verdict

The portfolio content document is **~90% of a winning freelance portfolio** already. The real
work is not *what to showcase* but *ordering and framing*. Treat the portfolio as a **4-step
conversion funnel**, not a resume:

> **Visit** → *"Do I trust them?"* → *"Can they do my job?"* → *"How do I start?"* → **Contact**

Every section either builds **trust**, proves **capability**, or **reduces friction**.

---

## 1. What to Showcase — Section-by-Section Analysis

| Section | Status | Action |
|---|---|---|
| **Hero** | 🟢 Strong | Write in first person with an outcome ("I build X for Y"). Pick one tagline, add outcome framing. |
| **About** | 🟢 Strong | Keep — human, honest, work-related. |
| **Services** | 🔴 Missing | **Biggest gap.** Clients buy *packaged offers*, not skill lists. Package 3 offers with deliverables + timeline: Backend/MVP Build (4–8 wks), AI/RAG Integration (1–3 wks), Legacy Stabilization Audit (1 wk). |
| **Projects** | 🟡 Good | Add **problem → solution → result** framing. Lead with the zero-downtime migration *result*. Add one screenshot/GIF per project. |
| **Skills** | 🟡 Good | Condense to 6–8 pills (AI/LLM, Backend, Databases, Cloud/AWS, Auth, Architecture). **Never use percentage bars.** |
| **Experience** | 🟢 Smart call | Skip corporate detail, but reframe 2 bullets as outcomes (e.g., "Ran a 3-day zero-downtime migration of 5 production collections"). |
| **Testimonials** | 🔴 Gap | Ask the Brigosha manager for 2–3 lines now. Even one quote beats zero. |
| **Availability** | 🟡 Placeholder | Commit to one real number ("Available 20 hrs/week" or "Open to short-term contracts"). |
| **Contact** | 🟡 Good | Put email in header + footer, not just the contact section. |

### Corrected Structure Order

Services should sit **above** projects — clients scan for *what you offer* before reading the story:

**Hero → Services → Projects → About → Skills → Experience → Contact**

### Other Required Fixes

- **LinkedIn** — missing; high value for freelancing credibility.
- **X/Twitter** — promote prominently; live activity is free proof of expertise.
- **Freelance resume** — create a freelancing-oriented version (current one is corporate).

---

## 2. Actionable Things

| Requirement | How to deliver |
|---|---|
| **Download resume** | Static PDF at `/public/resume.pdf` + styled button. Use a `?v=2` cache-busting query param. Requires a freelance version of the resume first. |
| **Send contact info (name, email, details)** | Next.js API route (`POST /api/contact`) + low-volume email service (**EmailOctopus**, free tier). Form fields: Name, Email, Budget range, Message. The same route also feeds the contacts metric. |

---

## 3. Non-Functional Requirements (Metrics)

| Metric | What it measures | How to measure |
|---|---|---|
| **Page visit count** | Top of funnel | Analytics script |
| **Avg time spent** | Engagement (is content landing?) | Analytics session duration |
| **People contacted** | Conversion (the number that matters) | Count rows in the contact route + log submissions; fire a custom analytics event on successful submit |

### Recommended Tools

- **Analytics:** Simple Analytics (privacy-first, no GDPR banner, plain-language metrics; reports page views + session duration). Free alternative: **Vercel Web Analytics** (built-in, $0, zero config — good starting point on Vercel).
- **Contact form:** EmailOctopus (free tier, simple API) wired through a Next.js serverless route.
- **Stack:** Next.js + Tailwind, deployed on Vercel (fast load = subtle proof of backend competence).

---

## Decisions Pending (Open Items)

1. Commit to an **availability** statement.
2. Create **freelance resume** PDF.
3. Create **LinkedIn** profile.
4. Collect 2–3 **testimonials** (manager first).
5. Add **screenshots/GIFs** per project.
6. Decide analytics start point: Vercel Web Analytics vs Simple Analytics.
