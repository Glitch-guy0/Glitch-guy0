---
title: "Sprint Change Proposal: Harness Engineer Positioning"
status: proposed
created: 2026-08-06
---

# Sprint Change Proposal — Harness Engineer Positioning

*Workflow: bmad-correct-course · Mode: Batch · Pre-sprint (no epics exist yet — planning-phase adjustment)*

## Section 1: Issue Summary

**Trigger:** During PRD draft review (2026-08-06), the Builder supplied `resume.md` and `project-images/`, revealing a contradiction between the finalized Product Brief's positioning and the work he actually ships.

**Problem statement (precise):** The brief positions the Builder as a *freelance backend engineer* whose Projects section leads with a zero-downtime migration and whose Services are generic backend offers (Backend/MVP Build, AI/RAG Integration, Legacy Stabilization Audit). His real, shipped work is AI/LLM infrastructure: an open-source agent SDK, a RAG research assistant, and AI chat platforms. The Builder explicitly directed: portray as **Harness Engineer** (the infrastructure around LLMs — retrieval, orchestration, guardrails, evaluation), summary/description must match his projects rather than generic "backend engineer" duties, and the migration is a **work statement** (Experience section), not a Project Entry. He also rejected the draft hero line ("I build backends that don't break") as overbold for 1 year of experience.

**Evidence:** `_bmad-output/planning-artifacts/resume.md` (2026-08-06); `project-images/` (ChaiBookLM ×3, ChaiChat/persona-chat ×2); web research 2026-08-06 (harness engineering is an established 2026 sub-discipline; credible 1-year claims = harness/orchestration/eval infrastructure, not model ownership or grand guarantees).

**Issue type:** Strategic pivot (positioning) + new understanding of existing assets.

## Section 2: Impact Analysis

| Artifact | Impact |
|---|---|
| **Product Brief** (final) | Conflicts on positioning ("freelance backend engineer"), Services, Projects lead, Experience count. *Historical doc — patch or leave as historical pending OQ-9.* |
| **PRD** (draft) | Updated: title, Vision, JTBD, Glossary (+Harness Engineer, Harness), Hero (FR-4 credibility rule), Services (FR-6 offer set), Projects (FR-9–13 real inventory, SDK leads, migration removed), Skills (FR-15 pills), Experience (FR-17 work statements), Contact (FR-19 field), Non-Goals (+no model-ownership, +no grand promises), Scope, Voice, Open Questions, Assumptions. |
| **resume.md** | Rewritten: Harness Engineer headline/tagline, harness-matching About, Skills regrouped, Services reframed, Projects reframed as harness proof. |
| **Epics/Stories** | N/A — do not exist yet; will derive from the corrected PRD. |
| **Architecture / UX** | N/A — not created yet; no conflict. Design reference (glitch/Y2K) unaffected. |
| **Build inputs** | Changed: project set (SDK + ChaiBookLM + ChaiChat proposed), SDK visual needed, contact field (Project type vs Budget). |

## Section 3: Recommended Approach

**Selected:** Option 1 — **Direct Adjustment** (Hybrid with Option 3 review, no scope-structure change).

**Rationale:** Pre-sprint, nothing is built — no rollback exists (Option 2 N/A). MVP structure (7 sections, funnel model, contact flow, analytics) is unaffected; only content/positioning changes. Effort: Low–Medium. Risk: Low (no technical or timeline impact; the change *reduces* overpromise risk). The corrected PRD becomes the single source for downstream epics/architecture/UX.

## Section 4: Detailed Change Proposals

### PRD (`prds/prd-Glitch-guy0-2026-08-06/prd.md`) — applied

- **Title:** *Freelance Backend Engineer Portfolio* → *Freelance Harness Engineer Portfolio*.
- **§1 Vision:** generic-backend narrative → Harness Engineer narrative (harness = infrastructure around LLMs; no model ownership; credible claims at 1 year).
- **§3 Glossary:** added **Harness Engineer**, **Harness**.
- **§4.2 FR-4:** hero credibility rule added; copy undecided (OQ-4, candidate lines pending).
- **§4.3 FR-6:** offers realigned → (1) AI Feature Build — RAG & Agent Harness (1–4 wks), (2) AI Chat/Agent Platform MVP (4–8 wks), (3) Backend Stabilization & Migration (1–3 wks). Pending OQ-8.
- **§4.4 FR-9–13:** Projects = shipped AI builds; **Shikigami Agent SDK leads** (FR-10); migration removed from Projects (now a work statement); visuals: ChaiBookLM + ChaiChat images exist, SDK visual required; live/GitHub links per real inventory.
- **§4.6 FR-15:** pills → harness-led set (LLM Harnessing, Vector Search, TS/Node, Backend & APIs, Databases, AWS, Auth & Security, Architecture).
- **§4.7 FR-17:** Experience = 2–3 **work statements** (migration, legacy stabilization, Play Store app); migration explicitly not a Project Entry.
- **§4.9 FR-19:** fourth field Project type vs Budget — pending OQ-6.
- **§5 Non-Goals:** + no model-ownership claims; + no grand promises.
- **§9 Voice:** harness-identity + 1-year credibility.
- **§11 OQs:** renumbered/updated (project set, work statements, testimonial skipped, hero pending, resume done, contact field, consent, offers, brief patch).
- **§12 Assumptions:** updated to match.

### resume.md (`planning-artifacts/resume.md`) — applied

- Headline: *Harness Engineer — LLM Infrastructure, RAG Pipelines & AI Orchestration* (replaces "Backend Engineer specializing in…").
- Tagline/About: harness framing matched to shipped projects; backend work framed as the production-grade foundation *underneath* the AI work.
- Skills: grouped harness-first; Services: AI-feature builds, AI chat/agent platforms, backend, migrations, auth, legacy, cloud.
- Contact fields: Name, Email, Project type, Message (feeds OQ-6).
- No claims added beyond the real record.

### Product Brief — proposed (pending OQ-9)

- Patch positioning references (Executive Summary, Who This Serves, addendum research digests) to Harness Engineer, or leave as historical baseline. Recommended: **patch via addendum note**, keep v1 scope structure.

## Section 5: Implementation Handoff

- **Scope classification:** Moderate (positioning/content change across planning artifacts; no code yet).
- **Executed by:** PM (John) + Builder approval gates. Applied 2026-08-06: PRD + resume.md updated, change logged to PRD memlog.
- **Approvals (2026-08-06):** OQ-1 **resolved** — 3 featured entries (SDK, ChaiBookLM, ChaiChat) + secondary Showcase (FR-30) for chaiGPT and the rest. OQ-5 **placeholder** — resume.md content placeholder until Builder updates. OQ-6 **fixed** — fourth contact field is free text, label Project type. OQ-7 **fixed** — Vercel uses cookies → lightweight cookie-consent banner (FR-29). OQ-8 **approved** — three Harness-aligned offers. OQ-9 **patched** — brief carries a positioning note. Hero copy decision (OQ-4) deferred by Builder.
- **Success criteria:** PRD and resume.md fully reflect Harness Engineer positioning; no contradictory "backend engineer" primary framing remains; hero line pending but constrained by credibility rule.
- **Route after approval:** corrected PRD → `bmad-ux` / `bmad-architecture` / `bmad-create-epics-and-stories`.
