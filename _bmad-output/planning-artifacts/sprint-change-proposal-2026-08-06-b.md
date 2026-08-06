---
title: "Sprint Change Proposal: Monochrome palette, 3-field contact, no offer CTAs"
status: applied
created: 2026-08-06
---

# Sprint Change Proposal — Design & Contact Simplification

*Workflow: bmad-correct-course · Mode: Batch · Pre-sprint (no epics yet — planning-phase adjustment)*

## Section 1: Issue Summary

Builder directives on the v1 landing wireframe (`landing.md`), 2026-08-06:
1. **Drop the PROJECT TYPE field** from the Contact form (no project-type/budget question).
2. **Full monochrome palette** — black/white/gray only, no color pops (neon accents removed).
3. **Remove the `[ START ]` action buttons** from the three Services offer cards.

## Section 2: Impact Analysis

| Artifact | Impact |
|---|---|
| **PRD** | Contact = 3 fields (FR-19 + Glossary, UJ-1, §10); per-offer CTA removed (FR-8 → single-CTA path); §9 aesthetic → monochrome; §12 decision note. |
| **UX DESIGN.md** | `accent-magenta/cyan/yellow` + `on-accent` tokens deleted; CTA/section-number/focus/hover specs re-pointed to white (`ink-primary`); RGB split → grayscale offset. |
| **UX EXPERIENCE.md** | Field set (Flow 1), offer-card behavior (no button), all cyan/magenta state references → white. |
| **brief.md / resume.md** | Contact field list → Name, Email, Message. |
| **landing.md** | Wireframe updated: 3 fields, b/w scheme, no START buttons. |
| **reconcile-sources.md** | Aesthetic line + contact-field conflict marked resolved. |
| **Epics/Stories** | N/A — do not exist yet; derive from the corrected PRD. |
| **Architecture** | N/A — not generated yet; token set (no accents) becomes an input. |

## Section 3: Recommended Approach

**Selected:** Direct Adjustment. Pre-sprint, nothing is built; scope structure (7 sections, funnel, contact flow, analytics) unchanged. Effort: Low. Risk: Low (monochrome *raises* contrast headroom; fewer form fields *reduce* friction).

## Section 4: Detailed Change Proposals — applied

### PRD (`prd.md`) — applied
- **FR-8:** Offer cards carry no action button; path to Contact is the page's single primary CTA (reachable from Services in ≤ 3 taps/clicks).
- **FR-19:** Contact submits Name, Email, Message (3 fields); "four fields / fourth free text" consequence removed.
- **§9 Aesthetic:** neon accents + RGB channel splits → full monochrome (black/white/gray), grayscale glitch offsets.
- **Glossary / UJ-1 / §10 / §12:** field set = 3 fields; Privacy note "three contact fields".

### UX DESIGN.md — applied
- Tokens: removed `accent-*` and `on-accent`; CTA fill = `ink-primary` (white) on `surface-base`, hover = `ink-secondary`; `section-number` = `ink-primary`.
- Glitch: "RGB split" → "grayscale offset"; "neon" → "white" everywhere; Do/Don't row reworded (no chromatic color).

### UX EXPERIENCE.md — applied
- Offer card: no per-offer button; hover hairline → white.
- All cyan/magenta state treatments (nav active, focus, error, testimonial rule, focus ring) → white.
- Contact field set in Flow 1 → Name, Email, Message.

### brief.md / resume.md / landing.md / reconcile-sources.md — applied
- Field list → Name, Email, Message (brief + resume + wireframe).
- Wireframe: b/w scheme, no START buttons, 3-field form.
- `design.md` kept as the external Nifty Portal teardown reference (its palette documents the *source*, not Glitch-guy0); the load-bearing tokens live in `DESIGN.md`.

## Section 5: Implementation Handoff

- **Scope:** Minor — direct implementation by the Developer agent from the corrected PRD + spines.
- **Build notes:** contact API accepts 3 fields; no `projectType` in schema/validation; tokens ship without accent vars; glitch keyframes use grayscale offsets (no chromatic fringing).
- **Success criteria:** no `projectType`/`START`/neon-accent references remain in build sources; form renders 3 fields; axe-core contrast passes with the monochrome set.
- **Route after approval:** corrected PRD → `bmad-architecture` → epics/stories → build.
