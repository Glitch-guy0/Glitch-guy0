# Source Reconciliation — Glitch-guy0

Run: 2026-08-06 · Fast path · Consumer stakes

Sources confirmed by user: product brief (+ addendum), PRD, market research, and `{planning_artifacts}/design.md` (Nifty Portal glitch teardown, confirmed on request). Vibes source: https://portal.thenifty.com/.

## Carried into the spines

- **Funnel order** Hero → Services → Projects → About → Skills → Experience → Contact (brief §4.2–4.9, PRD §4).
- **Positioning** — "Harness Engineer", outcome hero line, 15–30s scan, risk-not-code framing.
- **Three offers**, deliverables + timelines, no pricing (brief + PRD lists reconciled: AI Feature Build / AI Chat-Platform MVP / Backend Stabilization & Migration).
- **Projects** — 3 featured (Shikigami Agent SDK lead, ChaiBookLM, ChaiChat) + secondary Showcase (chaiGPT), one visual each, Live + GitHub links, problem → solution → result.
- **Testimonials** — ≥ 1 attributed quote (Brigosha manager), placed at end of Experience (PRD §4.8).
- **Skills** — 6–8 pills, no percentage bars.
- **Contact** — `POST /api/contact`, client-side validation with accessible errors, success/failure states, honeypot spam protection, EmailOctopus.
- **Resume** — static PDF `/public/resume.pdf`, cache-busted `?v=`.
- **Analytics** — Vercel Web Analytics + lightweight cookie-consent banner.
- **NFRs** — WCAG 2.1 AA, contrast ≥ 4.5:1, keyboard nav, visible focus, Lighthouse ≥ 90 mobile, responsive 360/768/1280, touch ≥ 44×44.
- **Aesthetic** — Nifty Portal glitch/Y2K per teardown: full monochrome (black/white/gray, no chromatic color), all-caps mono headings, scanlines/noise, 100–400ms grayscale-offset glitch bursts with snap-back, sharp corners. User's color-mode choice: dark default + light.

## Deliberately dropped / deferred (with where they landed)

| Idea | Status | Where it landed |
|---|---|---|
| Geo-split `/in` `/us` personalization | v2 (sources) | Noted in IA/Responsive as out of scope |
| Buyer-segment positioning, pricing models, availability statement | v2 (sources) | "No pricing anywhere (v1)" in Services; availability omitted |
| Decision-system blog / architecture content | v2 (sources) | Named in Anti-patterns as rejected-for-v1 |
| Autoplay video + WebGL 3D anchor (Nifty Portal) | Rejected | Performance-first: CSS-only glitch, named in Anti-patterns |
| NFT gatekeeping language ("INITIATE SEQUENCE") | Rejected | Anti-patterns — a portfolio must invite contact |
| Skill bars, wall-of-tech, resume-as-website | Rejected | Anti-patterns + Skills component rules |
| Japanese character texture (Nifty Portal) | Dropped | Not carried — no audience need; would read as decoration |

## Conflict surfaced

- **Contact form fields:** brief and PRD once split on a 4th field (Budget vs Project type). Resolved 2026-08-06: the field is dropped entirely — the form ships **Name, Email, Message** (3 fields, no project-type/budget question).

## Notes

- Fonts (Space Grotesk / IBM Plex Mono / Inter) and Testimonials-inside-Experience placement are `[ASSUMPTION]`-tagged in the spines for fast-path review.
- `.working/` and `imports/` are empty — fast path skipped creative tools; no user-supplied visuals were provided.
