---
name: Glitch-guy0
status: final
updated: 2026-08-08
---

# Glitch-guy0 — Experience Spine

## Foundation

Single-surface responsive web — a one-page portfolio on Next.js + Tailwind, deployed on Vercel. `DESIGN.md` is the visual identity; this spine is the behavior. The page is a **four-stage conversion funnel — Visit → Trust → Capability → Contact** — tuned for a 15–30 second scan. Buyers evaluate risk, not code.

Visitor split: startup founders and PMs (fast scanners, mobile) and agency owners (deep vetters, desktop). Non-users for v1: keyword-only recruiters and enterprise procurement.

## Information Architecture

One page, seven anchored sections in fixed order (Hero → Services → Projects → About → Skills → Experience → Contact), header nav + `mailto:` in header and footer on every viewport. No sub-pages, no modal stacks beyond the single cookie banner.

## Voice and Tone

First-person, direct, outcome-focused — one voice: a working engineer who states what he builds, what it shipped, and what it cost in time. No corporate filler, no grand promises, no self-rating.

Microcopy rule: the glitch personality lives in labels and section headers; anything a buyer reads to make a decision stays plain, confident, and grammatical.

| Do | Don't |
|---|---|
| "I build the infrastructure around LLMs — RAG, agents, guardrails." | "Passionate full-stack developer seeking opportunities!" |
| "3-day zero-downtime migration of 5 production collections." | "Scaled massively with cutting-edge technology." |
| "Backend Stabilization & Migration · 1–3 weeks" | "Let's connect and synergize!" |
| "Message sent. I'll reply within a day." | "✓ Your inquiry has been successfully submitted" |

## Component Patterns

Behavioral; visual specs in `DESIGN.md`.

| Component | Use | Behavioral rules |
|---|---|---|
| Nav link | Header | Click smooth-scrolls to anchor. Active = white + weight. Tab-focusable, visible focus ring. |
| Primary CTA | Hero, Contact, footer | Single action: jump to Contact. Hover glitch burst. Label outcome-based. |
| Offer card | Services | Three cards, identical anatomy; no pricing; no per-offer button; hover hairline → white. |
| Project card | Projects | Featured: one visual, problem → solution → result, mono metadata, Live + GitHub links. Showcase: compact rows, links only. |
| Skill pill | Skills | 6–8 pills, harness-first. Plain list, no bars/counts/hover reveal. |
| Testimonial | Experience end | At least one attributed quote. Name + role in mono. |
| Form field | Contact | Underline field, floating mono label. Validates on blur + submit; errors inline, announced. |
| Submit button | Contact | Primary CTA treatment. `SUBMITTING…` in flight; success/error replace form inline. |
| Resume link | Header (desktop), footer, Contact | Static PDF, cache-busted (`?v=`). New tab, `download`. |
| Cookie banner | Overlay, cold load | Single line + Accept/Decline; persists; analytics only on Accept. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold load | Hero | Headline reveals with the single hero glitch burst (load only). |
| Scrolled | Header | Transparent → hairline bottom border; active nav updates. |
| Section enter | Any header | One 150ms glitch burst on section number + heading; never repeats in view. |
| Form idle / focus | Contact | Underline at rest; white glow on focus. |
| Form error | Contact | Inline mono message + white underline; field keeps focus; message in `aria-live`. |
| Form submitting | Contact | `SUBMITTING…`, disabled, no glitch while in flight. |
| Form success | Contact | Form replaced by success block: plain confirmation + "I'll reply within a day." + email copy button. |
| Form failure | Contact | Error block replaces form; retry button; input preserved. |
| No JS | All | Anchors jump natively; form fallback points to `mailto:`. |
| Image loading | Projects | Fixed-aspect placeholder + hairline frame + scanline shimmer; no layout shift. |
| Reduced motion | All | `prefers-reduced-motion: reduce` → glitch becomes instant reveal; scroll falls back to instant. |
| Cookie not accepted | All | Analytics blocked; page fully functional. |

## Interaction Primitives

- Scroll is the primary navigation; header nav is the shortcut.
- Hover micro-interactions (desktop only, ≤ 150ms): glitch fringe, text flicker, border shifts — all snap back.
- Keyboard: `Tab` follows funnel order; `Enter`/`Space` activate; `Esc` closes the cookie banner.
- **Banned:** page-wide glitching, autoplay video, infinite scroll, skill bars, image carousels, deep modal stacks, any interaction obscuring body text.

## Accessibility Floor

- **WCAG 2.1 AA.** Body/mono labels ≥ 4.5:1 in both modes; CTA labels ≥ 4.5:1 against fills.
- **Glitch constraints (WCAG 2.3.1):** no flashing > 3×/s; bursts 100–400ms; never on body text or form fields; global `prefers-reduced-motion` disables all glitch keyframes outright.
- **Keyboard:** fully operable with visible focus rings ≥ 2px; never suppressed; no traps; `Esc` dismisses banner.
- **Screen readers:** semantic landmarks, `aria-label` on icon-only links, `alt` on visuals (decorative scanlines `aria-hidden`), inline errors in `aria-live="assertive"`.
- **Touch:** targets ≥ 44×44px; form fields full-width on mobile.
- **Color is never the only signal** — every state has a structural twin.
- **Motion:** opacity/transform only; no parallax, no scroll-jacking, no autoplay media.

## Inspiration & Anti-patterns

- **Lifted from Nifty Portal:** monochrome terminal canvas, all-caps mono headings + section numbering, scanlines/noise atmosphere, 100–400ms glitch bursts with snap-back, sharp corners, "works flawlessly while looking unstable."
- **Lifted from strong freelance portfolios:** problem → solution → result with quantified magnitudes, named testimonials, timezone framing, contact reachable everywhere, one outcome headline in 3 seconds.
- **Rejected — NFT gatekeeping:** the portfolio must *invite* contact, not gate it.
- **Rejected — resume-as-website, autoplay video/WebGL, blog/decision-system content** (deferred to v2).

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| ≥ 1024px (desktop) | 12-col grid; Projects 3-up; Services 3-up; header nav labels; resume link in header. |
| 768–1023px (tablet) | Projects 2-up; services stack/2-up. |
| < 768px (mobile) | Single column; hero `display-mobile`; projects stack; condensed nav; touch targets ≥ 44px; glitch intensity reduced ~30%. |
| Reduced motion | All glitch/motion off. |

The site is a vertical stack at every width. Performance is a feature: Lighthouse ≥ 90 mobile, and the CSS-only glitch approach is chosen partly to hold it.

## Key Flows

### Flow 1 — The 20-second scan (UJ-1)
Hero (outcome line + CTA, one glitch burst) → scroll Services (three offers, no pricing wall) → lead project framed problem → solution → result with quantified magnitude → header CTA → contact form focused on name field → submit → plain confirmation. *Failure:* error block preserves input, retry without reload.

### Flow 2 — The deep vet (UJ-2)
Reads hero → Projects via nav → opens every Live + GitHub link (featured + showcase) → Experience work statements + attributed testimonial → downloads resume PDF → submits a detailed message. *Critical failure:* any dead link drops trust; zero-dead-link is a launch gate.

### Flow 3 — The inbound (UJ-3)
Builder opens site after deploy → submits a test contact → lands in email via EmailOctopus, contacts metric increments, Web Analytics shows the visit. The loop closes end to end. *Failure:* test contact never arrives → highest-risk build item; this is the funnel's acceptance test.
