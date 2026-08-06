---
name: Glitch-guy0
status: final
sources:
  - {planning_artifacts}/briefs/brief-Glitch-guy0-2026-08-06/brief.md
  - {planning_artifacts}/prds/prd-Glitch-guy0-2026-08-06/prd.md
  - {planning_artifacts}/research/market-freelance-developer-portfolios-research-2026-08-06.md
  - {planning_artifacts}/design.md
updated: 2026-08-06
---

# Glitch-guy0 — Experience Spine

## Foundation

Single-surface responsive web — a one-page portfolio built on Next.js + Tailwind, deployed on Vercel. `DESIGN.md` is the visual identity reference (dark default + light mode, `{colors.surface-base}` / `{colors.surface-base-light}`); this spine is the behavior. The page is a **four-stage conversion funnel — Visit → Trust → Capability → Contact** — tuned for a 15–30 second scan. Buyers evaluate risk, not code: every decision below serves "is it safe to give this person my money?"

Visitor split: startup founders and PMs (fast scanners, mobile, between meetings) and agency owners (deep vetters, desktop). Non-users for v1: keyword-only recruiters and enterprise procurement — explicitly not designed for.

## Information Architecture

One page, seven anchored sections in a fixed order. Header nav (`nav-link` mono labels) smooth-scrolls to anchors; header and footer both carry a `mailto:` link on every viewport. No sub-pages, no modal stacks.

| Surface | Reached from | Purpose |
|---|---|---|
| Hero | Cold load / `#top` | Outcome line, primary CTA → Contact |
| Services | Header / scroll | Three packaged offers, deliverables + timelines, no pricing |
| Projects | Header / scroll | Three featured case studies (problem → solution → result) + secondary Showcase |
| About | Header / scroll | Human, honest, work-focused |
| Skills | Header / scroll | 6–8 skill pills, no rating bars |
| Experience | Header / scroll | Outcome-framed work statements + Testimonials |
| Contact | Header CTA / scroll / `#contact` | Contact form + success/error states |
| Footer | Scroll to end | Email, resume PDF, socials, copyright |
| Cookie consent | Cold load overlay | Vercel Web Analytics consent (uses cookies) |

Order locked from sources: Hero → Services → Projects → About → Skills → Experience → Contact. Closure: every stated need (scan-proof, capability proof, trust proof, friction-free contact) has a surface; every surface is reachable from the header nav and the scroll path.

## Voice and Tone

First-person, direct, outcome-focused. The visitor hears one voice across the whole page: a working engineer who states what he builds, what it shipped, and what it cost in time — no corporate filler, no grand promises, no self-rating.

| Do | Don't |
|---|---|
| "I build the infrastructure around LLMs — RAG, agents, guardrails — on backends that don't fall over." | "Passionate full-stack developer seeking opportunities!" |
| "Shikigami Agent SDK — a 3-day zero-downtime migration of 5 production collections." | "Scaled massively with cutting-edge technology." |
| "Backend Stabilization & Migration · 1–3 weeks" | "Let's connect and synergize!" |
| "Message sent. I'll reply within a day." | "✓ Your inquiry has been successfully submitted" |
| Terminal microcopy where it earns its place: `SUBMITTED.`, `VALIDATING…` | Glitch jargon on the contact form itself — the form must read as reliable |

Microcopy rule: the glitch personality lives in labels and section headers; anything a buyer reads to make a decision stays plain, confident, and grammatical.

## Component Patterns

Behavioral. Visual specs live in `DESIGN.md.Components`.

| Component | Use | Behavioral rules |
|---|---|---|
| Nav link | Header | Click smooth-scrolls to anchor. Active section glows cyan (`{colors.accent-cyan}`). Tab-focusable, visible focus ring. |
| Primary CTA | Hero, Contact, footer | Single action: jump to Contact. Hover glitch burst per `DESIGN.md`. Label is outcome-based ("Tell me about your project"). |
| Offer card | Services | Three cards, identical anatomy: name, 1–2 line scope, deliverables list, timeline in mono. No pricing anywhere (v1). Hover: hairline → magenta. |
| Project card | Projects | Featured: one visual, problem → solution → result body, mono metadata (stack, timeline), working **Live** and **GitHub** links. Secondary Showcase: compact rows, links only. |
| Skill pill | Skills | 6–8 pills, lead with harness domains (AI/LLM, RAG, agent orchestration, backend, DB, AWS, auth, architecture). Plain list — no bars, no counts, no hover reveal. |
| Testimonial | Experience end | At least one attributed quote (Brigosha manager). Name + role in mono. Left cyan rule per `DESIGN.md`. |
| Form field | Contact | Underline field, floating mono label. Validates on blur + on submit. Errors inline, announced. |
| Submit button | Contact | Primary CTA treatment. `SUBMITTING…` while in flight; success and error replace the form inline (no navigation). |
| Resume link | Header (desktop), footer, Contact | Static PDF at `/public/resume.pdf`, cache-busted (`?v=`). New tab, `download` attribute. |
| Cookie banner | Overlay, cold load | Single line + Accept / Decline. Dismissed state persists; analytics only run on Accept. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold load | Hero | Headline reveals with the single hero glitch burst (load only, then stable). Above-the-fold shows outcome line + CTA within first viewport. |
| Scrolled | Header | Transparent → hairline bottom border. Section nav updates active glow. |
| Section enter | Any header | One 150ms glitch burst on the section number + heading as it enters the viewport; never repeats while in view. |
| Form idle / focus | Contact | Underline at rest; cyan glow on focus (`{colors.accent-cyan}`). |
| Form error | Contact | Inline mono message + magenta underline (`{colors.accent-magenta}`). Field keeps focus; message in `aria-live`. |
| Form submitting | Contact | Button label swaps to `SUBMITTING…`, button disabled, no glitch on the button while in flight. |
| Form success | Contact | Form container replaced by success block: plain confirmation + "I'll reply within a day." Copy button for email. |
| Form failure | Contact | Error block replaces form: retry button, message preserved client-side (never lose the visitor's words). |
| No JS | All | Anchors still jump natively; form shows graceful fallback message pointing to `mailto:`. Progressive enhancement only. |
| Image loading | Projects | Fixed-aspect placeholder with hairline frame + scanline shimmer; no layout shift. |
| Reduced motion | All | `prefers-reduced-motion: reduce` → glitch bursts become instant reveal (no jitter, no RGB split, no flicker); scroll behavior falls back to instant. |
| Cookie not accepted | All | Vercel analytics blocked; page fully functional. |

## Interaction Primitives

- **Scroll is the primary navigation** — sections unfold in the funnel order; header nav is the shortcut.
- **Click to act** on CTA, nav links, project links, resume. No hover-only affordances that hide content on touch.
- **Hover micro-interactions** (desktop only, ≤ 150ms): glitch fringe on CTAs and cards, text flicker on nav, border color shifts on pills/offers. All snap back instantly.
- **Keyboard**: `Tab` follows the funnel order (header → hero CTA → sections → contact). `Enter`/`Space` activate links and the submit button. `Esc` closes the cookie banner.
- **Banned everywhere:** page-wide glitching, autoplay video backgrounds, infinite scroll, skill percentage bars, image carousels, any modal stack deeper than the single cookie banner, and any interaction that obscures body text.

## Accessibility Floor

Behavioral. Visual contrast lives in `DESIGN.md` (`Colors`).

- **WCAG 2.1 AA** across the responsive surface (per PRD §5). Body text and mono labels ≥ 4.5:1 in both modes; CTA labels ≥ 4.5:1 against their fills.
- **Glitch constraints (WCAG 2.3.1):** no flashing > 3×/second; bursts 100–400ms; never on body text or form fields. A global `prefers-reduced-motion: reduce` media query disables all glitch keyframes — jitter, flicker, RGB split, card tear — outright (not merely reduced), leaving the instant reveal.
- **Keyboard:** full page operable with visible focus rings (`{colors.accent-cyan}` outline ≥ 2px). Focus indicators are never suppressed (`outline: none` only ever paired with a ≥ 2px custom replacement). No keyboard traps; `Esc` dismisses the banner.
- **Screen readers:** semantic landmarks (`header`, `main`, `section` with labelled headings), `aria-label` on icon-only links, `alt` text on all project visuals (decorative scanlines/noise are `aria-hidden`), inline form errors injected into an `aria-live="assertive"` region so they announce immediately, success/failure regions announced.
- **Touch:** targets ≥ 44×44px (PRD) — including cookie-banner controls and mobile nav items. Form fields full-width on mobile.
- **Color is never the only signal:** active nav = glow *and* weight; form errors = message *and* magenta underline; glitch bursts are motion-plus-color, never a state indicator.
- **Build-time verification:** load-bearing contrast pairs verified with automated tooling (axe-core) in both modes before launch (PRD §5).
- **Motion-sensitive & vestibular:** all animations are opacity/transform only (GPU-friendly); no parallax, no scroll-jacking, no autoplay media.

## Inspiration & Anti-patterns

- **Lifted from The Nifty Portal:** monochrome terminal canvas + three neons spent in small doses; all-caps mono headings with section numbering (`001`, `002`…); scanlines + noise as atmosphere; 100–400ms glitch bursts with instant snap-back; sharp corners; "works flawlessly while looking unstable" as the trust device.
- **Lifted from strong freelance portfolios (research):** problem → solution → result case studies with quantified magnitudes; named testimonials; timezone/communication framing; contact reachable everywhere; one outcome headline in the first 3 seconds.
- **Rejected — NFT gatekeeping (Nifty Portal):** the portal language ("INITIATE SEQUENCE", exclusivity framing) is membership theater. A freelance portfolio must *invite* contact, not gate it. The terminal voice stays; the "you're not worthy" posture goes.
- **Rejected — Resume-as-website (junior pattern):** flat tech lists, adjective-only claims, self-rated skill bars, no case-study depth. The PRD's "no fabricated experience, every claim needs a magnitude" is a hard rule.
- **Rejected — Autoplay video / WebGL spectacle:** Nifty's rain video and 3D anchor are gorgeous but cost Lighthouse points and battery. v1 keeps the vibe in CSS (scanlines, noise, glitch) so the site *is* fast — itself a proof point.
- **Rejected — Blog / decision-system content:** deferred to v2 by sources; not part of the conversion funnel in v1.

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| ≥ 1024px (desktop) | 12-col grid. Projects: 3 featured cards. Services: 3 cards. Header nav labels visible. Resume link in header. |
| 768–1023px (tablet) | Projects 2-up; services stack or 2-up by content length. Header labels may compress to short form. |
| < 768px (mobile, 360–767px) | Single column. Hero at `display-mobile`. Projects stack, one visual per card. Header shows condensed nav (label or `☰` → same-page anchor sheet). Touch targets ≥ 44px. Glitch intensity reduced ~30% (fewer bursts, lower amplitude). |
| Reduced motion | All glitch/motion off, per `Accessibility Floor`. |

The site is a vertical stack at every width — no multi-column reading experience, no hamburger-to-drawer complexity beyond the anchor sheet on mobile. Performance is a feature: Lighthouse ≥ 90 on mobile (PRD §5) is a stated goal, and the CSS-only glitch approach is chosen partly to hold it.

## Key Flows

### Flow 1 — The 20-second scan (UJ-1: Founder; Dana, startup founder, between meetings, on mobile)

1. Dana opens the link from a Slack message.
2. Hero loads: outcome line + CTA in the first viewport, one glitch burst on the headline, then stable.
3. She scrolls past Services — three offers with timelines, no pricing wall — and lands on the lead project, Shikigami Agent SDK, framed problem → solution → result.
4. The result is quantified ("3-day zero-downtime migration of 5 production collections").
5. She taps **Tell me about your project** in the header CTA.
6. **Climax:** The contact form is already focused on her name field when she arrives; she fills Name, Email, Project type, Message in under a minute, submits, and gets a plain confirmation — *"Message sent. I'll reply within a day."* — without ever leaving the page.

Failure: submit fails (network / API error) → the form is replaced by an error block with her message preserved and a single retry button. Her words are never lost.

### Flow 2 — The deep vet (UJ-2: Agency Owner; Marcus, agency owner, on desktop, mid-afternoon)

1. Marcus lands from a Google search for a backend/AI freelancer.
2. He reads the hero, then jumps straight to Projects via nav.
3. He opens every Live link and GitHub repo on the three featured cards, and the secondary Showcase — checking the work is real and runnable.
4. Experience section: he reads the two outcome-framed work statements — the zero-downtime migration and the NestJS stabilization — and the attributed Brigosha testimonial.
5. He downloads the resume PDF (cache-busted) from the footer, then returns to Contact.
6. **Climax:** He submits a 40-line message with a budget and a deadline, and the form confirms receipt immediately. The site *looked* like a system that could break and *behaved* like one that never does — exactly the trust signal he was vetting for.

Failure: any Live/GitHub link 404s → this is the funnel's critical failure; zero-dead-link verification is a launch gate (PRD SM-2).

### Flow 3 — The inbound (UJ-3: Builder; Prajwal, the owner, checking the funnel works)

1. Prajwal opens the site after a new deploy.
2. He submits a test contact via the form.
3. **Climax:** The submission lands in his email via EmailOctopus, the contacts metric increments, and Vercel Web Analytics shows the visit — the loop Visit → Trust → Capability → Contact is closed end-to-end. He watches for a moment, then closes the tab.

Failure: the test contact never arrives → the API route and EmailOctopus integration are the highest-risk build items; this is the acceptance test for the entire funnel.
