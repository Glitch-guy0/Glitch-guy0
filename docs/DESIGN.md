---
name: Glitch-guy0
description: Freelance harness-engineer portfolio. Terminal-clean Y2K glitch aesthetic — near-black canvas, full monochrome, white reserved for glitch bursts and the single conversion CTA. Dark default, light mode.
status: final
updated: 2026-08-08
---

# Glitch-guy0 — Design Spine

## Brand & Style

A freelance portfolio for a **harness engineer** — the person who builds the infrastructure around foundation models (RAG, retrieval, agent orchestration, guardrails, evaluation) on production-grade backend foundations. The site is itself the demo: it should *look* like a system that is alive and barely contained while *behaving* with total reliability. That gap — appearance of chaos, reality of control — is the pitch.

Visual language lifted deliberately from The Nifty Portal: a monochrome, terminal-clean canvas (near-black in dark mode, warm paper in light) with emphasis in white and gray alone — glitch bursts on headlines and CTAs, section numbers, hover fringes. Body text is never glitched, and the whole page is never glitched.

Type ramp: **Space Grotesk** (display, all-caps, technical) + **IBM Plex Mono** (labels, meta) + **Inter** (body). Self-hosted Google Fonts, subset + preloaded.

## Colors

Strictly monochrome — no chromatic color anywhere in v1. Emphasis via white, tone contrast, and weight.

- **Pure Black `#000000`** dark canvas; light mode swaps for **Warm Paper `#F4F2EE`**.
- **Raises `#111111` / `#FFFFFF`** — depth layer (cards, panels). Depth from tone, not shadow.
- **Industrial Gray `#9C9C9C`** body text (dark); light mode inks move to near-black grays (`#404040`, `#6E6A63`).
- **White `#FFFFFF`** emphasis color — primary CTA fill, section numbers, active nav, focus glows. The only place a full-strength ink becomes a fill.
- **Hairlines `#262626` / `#DCD8D0`** separate blocks at lowest legible contrast.
- **Contrast is verified, not assumed.** Body, mono labels, CTA labels ≥ 4.5:1 in both modes (axe-core at build). Glitch fringes/scanlines decorative and exempt.

Avoid: any chromatic color, gradients, color-coded categories, accent fills behind body copy.

## Typography

Three voices locked to roles. All-caps is a headline device only.

- **Display (Space Grotesk 700)** — hero line (64px desktop / 40px mobile, tight leading, negative tracking), section headings (32px), heading-sm (20px). Hero line stays sentence case for the human hook; headings go all-caps with wide tracking.
- **Body (Inter 400)** — 16–18px, line-height 1.6, never glitched.
- **Mono (IBM Plex Mono)** — section numbers (`001`), nav links, skill pills, project metadata, form labels, footer. `mono-label` 12px at 0.08em; `mono-meta` 13px.

Contrast floor: body and mono ≥ 4.5:1 against their surface in both modes (WCAG AA).

## Layout & Spacing

Single-page, anchored, full-width sections: **Hero → Services → Projects → About → Skills → Experience → Contact**.

- **Grid.** 12-col ≥ 1024px, single column < 768px. Content max 1080px; gutters 48px desktop / 20px mobile.
- **Rhythm.** 112px section gaps desktop / 72px mobile.
- **Breakpoints.** 360 / 768 / 1280px load-bearing. Vertical stack everywhere; only Projects (2–3 up) and Services (3 up) go multi-column on desktop.
- **Header.** Fixed top, transparent until scroll, hairline bottom border when the page moves. Email reachable on every viewport.

## Elevation & Depth

No shadows. Depth via tonal layering, atmosphere layers (full-viewport scanlines + noise at 3–6% opacity, fixed, `aria-hidden`), and the glitch as elevation: a 100–400ms grayscale-offset + jitter burst with instant snap-back on hero load, section-header entry, CTA/card hover. Never on body text, form fields, or the whole page.

## Shapes

Terminal-sharp. `2px` pills/chips, `4px` buttons/cards/CTA, `6px` rare large panel. Nothing pill-shaped except decorative scanline end-caps.

## Components

Visual specs; behavioral rules live in `EXPERIENCE.md`.

- **Primary CTA** — white fill, black mono label, 4px corner. Hover: gray fill + 100ms grayscale fringe, scale 1.02, snap back. The one place white is a fill.
- **Secondary button** — transparent, 1px white outline, mono label. Hover: fills white, inverts text.
- **Nav link** — gray mono label; active = white + weight; hover 100ms text-flicker.
- **Project card** — raised panel, 1px hairline, one visual, problem → solution → result body, mono metadata row. Hover: hairline flashes white, visual does a single 150ms horizontal tear.
- **Skill pill** — transparent, 1px hairline, mono label. Hover: border turns white. No bars.
- **Section header** — white `001` mono prefix above an all-caps heading.
- **Form field** — underline-only; focus 2px white underline + glow; error 2px white underline + inline mono message.
- **Footer** — mono meta: email, resume link, socials, copyright; hairline top border.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep the canvas monochrome; spend white in small precise doses | Any chromatic color, gradients, color-coded sections |
| Fire glitches as short bursts (100–400ms) with instant snap-back | Sustained jitter, page-wide glitching, glitching body text or form fields |
| Pair every emphasis signal with structure — underline, weight, or fill | Tone as the only signal for state |
| Use all-caps + wide tracking for headings, sentence case for hero/body | All-caps paragraph text |
| Sharpen corners to 2–6px | Pills, large radii, soft consumer-app rounding |
| Respect `prefers-reduced-motion` | Motion as the only signal; flashing > 3×/second |
| Keep body, CTAs, forms fully readable and functional at all times | Chaos that costs conversion |
