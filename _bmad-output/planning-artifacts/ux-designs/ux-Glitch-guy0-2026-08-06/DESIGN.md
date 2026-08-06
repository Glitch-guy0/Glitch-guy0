---
name: Glitch-guy0
description: Freelance harness-engineer portfolio. Terminal-clean Y2K glitch aesthetic — near-black canvas, full monochrome (black/white/gray, no chromatic color), white reserved for glitch bursts and the single conversion CTA. Dark default, light mode available.
status: final
colors:
  # Dark (default). Strictly monochrome — black, white, grays. No chromatic color in v1; emphasis carried by white, tone, and weight.
  surface-base: '#000000'
  surface-raised: '#111111'
  ink-primary: '#FFFFFF'
  ink-secondary: '#9C9C9C'
  ink-muted: '#6B6B6B'
  ink-disabled: '#3D3D3D'
  border-hairline: '#262626'
  # Light mode. Same monochrome structure, inverted.
  surface-base-light: '#F4F2EE'
  surface-raised-light: '#FFFFFF'
  ink-primary-light: '#111111'
  ink-secondary-light: '#404040'
  ink-muted-light: '#6E6A63'
  ink-disabled-light: '#A8A49C'
  border-hairline-light: '#DCD8D0'
typography:
  display:
    fontFamily: 'Space Grotesk'
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '0.95'
    letterSpacing: '-0.01em'
  display-mobile:
    fontFamily: 'Space Grotesk'
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.0'
  heading:
    fontFamily: 'Space Grotesk'
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: '0.02em'
  heading-sm:
    fontFamily: 'Space Grotesk'
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
  body:
    fontFamily: 'Inter'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-lg:
    fontFamily: 'Inter'
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: 'IBM Plex Mono'
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0.08em'
  mono-meta:
    fontFamily: 'IBM Plex Mono'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 2px
  md: 4px
  lg: 6px
  full: 9999px
spacing:
  # Tailwind 4px scale inherited; overrides for site-specific rhythm.
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 64px
  gutter-mobile: 20px
  gutter-desktop: 48px
  section-gap-mobile: 72px
  section-gap-desktop: 112px
  content-max: 1080px
components:
  button-primary:
    background: '{colors.ink-primary}'
    foreground: '{colors.surface-base}'
    radius: '{rounded.md}'
    border: 'none'
    fontFamily: '{typography.mono-label.fontFamily}'
  button-primary-hover:
    background: '{colors.ink-secondary}'
    foreground: '{colors.surface-base}'
  button-secondary:
    background: 'transparent'
    foreground: '{colors.ink-primary}'
    radius: '{rounded.md}'
    border: '1px solid {colors.ink-primary}'
    fontFamily: '{typography.mono-label.fontFamily}'
  nav-link:
    foreground: '{colors.ink-secondary}'
    fontFamily: '{typography.mono-label.fontFamily}'
  project-card:
    background: '{colors.surface-raised}'
    border: '1px solid {colors.border-hairline}'
    radius: '{rounded.md}'
  skill-pill:
    background: 'transparent'
    foreground: '{colors.ink-secondary}'
    border: '1px solid {colors.border-hairline}'
    radius: '{rounded.sm}'
    fontFamily: '{typography.mono-label.fontFamily}'
  form-field:
    background: 'transparent'
    border: '0 0 1px solid {colors.border-hairline}'
    radius: '0'
  section-number:
    color: '{colors.ink-primary}'
    fontFamily: '{typography.mono-label.fontFamily}'
---

## Brand & Style

Glitch-guy0 is a freelance portfolio for a **harness engineer** — the person who builds the infrastructure around foundation models (RAG, retrieval, agent orchestration, guardrails, evaluation) on production-grade backend foundations. The site is itself the demo: it should *look* like a system that's alive and barely contained, while *behaving* with total reliability. That gap — appearance of chaos, reality of control — is the pitch. It says: *this person knows how systems work, and how they break.*

The visual language is lifted deliberately from The Nifty Portal: a monochrome, terminal-clean canvas (near-black in dark mode, warm paper in light) carrying the content, with emphasis handled in white and gray alone — glitch bursts on headlines and CTAs, section numbers, hover fringes. Nothing decorative is ever large. Body text is never glitched, and the whole page is never glitched. The effect is a time capsule that still converts.

[ASSUMPTION] Type ramp: **Space Grotesk** (display, all-caps, technical) + **IBM Plex Mono** (labels, meta, technical readouts) + **Inter** (body). Self-hosted Google Fonts, subset + preloaded. Swap any of these at build time; the roles (display / mono / body) are the contract.

## Colors

The palette is strictly monochrome — black, white, and grays. No chromatic color anywhere in v1. Emphasis is carried by white, tone contrast, and weight, so every emphasis signal has a structural twin (underline, weight, or fill change).

- **Pure Black (`#000000`)** is the dark canvas — infinite space, terminal blank. Light mode swaps it for **Warm Paper (`#F4F2EE`)**: a slightly warm off-white that keeps the CRT memory without going clinical.
- **Raises (`#111111` / `#FFFFFF`)** are the depth layer — project cards, raised panels. Depth comes from tone, not shadow.
- **Industrial Gray (`#9C9C9C`)** is the body text of dark mode. In light mode the ink roles move to near-black grays (`#404040`, `#6E6A63`).
- **White (`#FFFFFF`)** is the emphasis color — the primary CTA fill, section numbers, active nav, focus glows, hover borders. It is the only place a full-strength ink becomes a fill.
- **Hairlines (`#262626` dark / `#DCD8D0` light)** separate blocks at the lowest legible contrast. Terminal frames, not card borders.
- **Contrast is verified, not assumed.** Body text, mono labels, and CTA labels meet ≥ 4.5:1 in both modes; the build verifies load-bearing combinations with automated tooling (axe-core) before launch. Glitch fringes and scanline textures are decorative and exempt from contrast targets.

Avoid: any chromatic color, gradients, color-coded categories, and accent fills behind body copy. If the site can't justify a tone, it doesn't get one.

## Typography

Three voices, locked to roles. All-caps is a headline device only — never paragraph text (tracking keeps dense all-caps readable at 0.02–0.08em).

- **Display (Space Grotesk 700)** — hero line, section headings. The hero ("I build X for Y") is the one `display` moment on the page: 64px desktop / 40px mobile, tight leading, negative tracking. Everything else at `heading` (32px) or `heading-sm` (20px). All-caps with wide tracking reads terminal; sentence case reads human — the hero line itself stays sentence case for the human hook, headings go all-caps.
- **Body (Inter 400)** — 16–18px, line-height 1.6. The scanning window is 15–30 seconds; body text is set at the largest comfortable size and never glitched.
- **Mono (IBM Plex Mono)** — section numbers (`001`), nav links, skill pills, project metadata (timeline, links), form labels, footer. `mono-label` 12px at 0.08em tracking for labels; `mono-meta` 13px for readouts.

Contrast floor: body and mono text ≥ 4.5:1 against their surface in both modes (WCAG AA). Glitch fringes are decorative and exempt from contrast targets.

## Layout & Spacing

Single-page, anchored, full-width sections — the conversion funnel reads top to bottom with no dead ends: **Hero → Services → Projects → About → Skills → Experience → Contact**.

- **Grid.** 12-column on desktop (≥ 1024px), collapsed to single column below 768px. Content constrained to `{spacing.content-max}` (1080px), centered, with `{spacing.gutter-desktop}` (48px) side gutters and `{spacing.gutter-mobile}` (20px) on mobile.
- **Rhythm.** `{spacing.section-gap-desktop}` (112px) between major sections — the teardown's "extreme white space" rule: generous breathing room before, between, and after CTAs. Section gaps are the pause that makes glitch bursts land.
- **Breakpoints.** 360px / 768px / 1280px are the load-bearing widths. The page is a vertical stack everywhere; nothing reflows into a multi-column reading experience on desktop except the Projects grid (2–3 cards) and Services (3 cards).
- **Header.** Fixed top, `nav-link` mono labels, transparent until scroll, hairline bottom border when the page moves. Email reachable from header on every viewport.

## Elevation & Depth

Glitch-guy0 does not elevate with shadows. Depth is layered through tone and texture:

- **Tonal layering** — `{colors.surface-raised}` panels against `{colors.surface-base}`; no drop shadows on cards.
- **Atmosphere layers** — a full-viewport, low-opacity CRT treatment: scanlines + faint noise, fixed and non-interactive, at 3–6% opacity. It reads as hardware, not decoration.
- **The glitch as elevation** — a glitch burst (100–400ms grayscale offset + jitter, instant snap-back) is the "lift" moment: it fires on the hero headline at load, on section headers entering the viewport, and on CTA/card hover. It is the only elevation the system has, which is why it lands. Never applied to body text, form fields, or the whole page at once.

## Shapes

Terminal-sharp. `{rounded.sm}` (2px) for pills and small chips, `{rounded.md}` (4px) for buttons, cards, and the CTA, `{rounded.lg}` (6px) for the rare large panel. Nothing is pill-shaped except decorative scanline end-caps. Sharp corners say *equipment*; the aesthetic breaks if buttons soften.

## Components

Visual specs. Behavioral rules live in `EXPERIENCE.md.Component Patterns`.

- **Primary CTA (button-primary)** — solid `{colors.ink-primary}` fill, `{colors.surface-base}` mono label, `{rounded.md}` corner. Hover: fills `{colors.ink-secondary}` with a 100ms grayscale-offset fringe, scales 1.02, snaps back on exit. The one place white is a fill.
- **Secondary button (button-secondary)** — transparent, 1px `{colors.ink-primary}` outline, mono label. Hover: fills `{colors.ink-primary}` and inverts text.
- **Nav link (nav-link)** — `{colors.ink-secondary}` mono label; active section renders white + weight; hover fires a 100ms text-flicker.
- **Project card (project-card)** — `{colors.surface-raised}` panel, 1px hairline border. One visual (screenshot/GIF), problem → solution → result body, mono metadata row (stack, timeline, Live / GitHub links). Hover: hairline border flashes white and the visual does a single 150ms horizontal tear.
- **Skill pill (skill-pill)** — transparent, 1px hairline, mono label. Hover: border turns white. No percentage bars, no fills.
- **Section header** — white `{colors.section-number}` prefix (`001`) in mono above an all-caps `heading`. The number is the only per-section emphasis — it maps 1:1 to nav order.
- **Form field (form-field)** — underline-only (bottom hairline), transparent fill. Focus: 2px white underline + glow. Error: 2px white underline with inline mono message.
- **Testimonial** — `body-lg` quote with a left white rule, mono attribution (`— NAME, ROLE`). Hairline separation, no card fill.
- **Footer** — mono meta: email, resume link, socials, copyright. Inline with hairline top border, no hero treatment.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep the canvas monochrome; spend white in small precise doses | Any chromatic color, gradients, color-coded sections |
| Fire glitches as short bursts (100–400ms) with instant snap-back | Sustained jitter, page-wide glitching, glitching body text or form fields |
| Pair every emphasis signal with structure — underline, weight, or fill | Tone as the only signal for state (active, error, hover) |
| Use all-caps + wide tracking for headings, sentence case for the hero line and body | All-caps paragraph text, decorative display type |
| Sharpen corners to 2–6px (equipment, not appliance) | Pills, large radii, soft consumer-app rounding |
| Respect `prefers-reduced-motion` — glitch becomes instant reveal, no animation | Motion as the only signal; flashing > 3×/second anywhere |
| Keep body, CTAs, and forms fully readable and functional at all times | Chaos that costs conversion — the site must *work* while looking unstable |
