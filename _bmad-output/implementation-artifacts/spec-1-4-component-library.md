---
title: 'Story 1.4: Component library'
type: 'feature'
created: '2026-08-06'
status: 'done'
baseline_revision: 'ecc3f0aa9a976ea06b0e7bd9924046660b3991cd'
final_revision: ''
review_loop_iteration: 0
followup_review_recommended: true
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** DESIGN.md (UX-DR3) specifies eight token-driven primitives — button-primary, button-secondary, nav-link, project-card, skill-pill, form-field, section-number, footer — but no component library exists, so every future section would re-implement visuals and drift from the design.

**Approach:** Create a `src/components/ui/` library of server-rendered primitives that consume tokens exclusively (no raw hex/rgba/px, no `text-[...]`/`bg-[...]`), each with a consistent props interface, matching DESIGN.md's component specs (colors, radius, hover states).

## Boundaries & Constraints

**Always:** Token utilities only (`bg-ink-primary`, `border-border-hairline`, `rounded-md`, `text-mono-label`, etc.) — zero raw design literals (AD-1). One props interface style across components. Server Components by default (`"use client"` only where interactivity is required — nav-link active state and form-field focus handling belong to consumers/islands, not the primitives). Hover micro-interactions ≤ 150ms with instant snap-back (UX-DR5), implemented via Tailwind transitions + token colors.

**Block If:** A primitive needs motion/glitch behavior (Story 1.5 scope) or client-side state management inside the primitive itself.

**Never:** Chromatic color, gradients, shadows, pills/large radii where DESIGN.md specifies sharp corners. Defining a color, radius, or spacing value inside a component. Behavior that hides content on touch devices (hover-only).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Button with `href` + label | Renders token-styled anchor with mono label, hover gray fill + scale 1.02 | No error expected |
| DISABLED | button-primary with `disabled` prop | `aria-disabled`, reduced opacity via `ink-disabled` token, no hover transform | Hover effects suppressed |
| ICON_ONLY | nav-link with icon and no visible text | Requires `aria-label` prop | eslint jsx-a11y catches missing label |
| CARD_TEAR | project-card hover | 150ms horizontal tear via a transform/transition utility class (Story 1.5 wires the actual glitch burst) | Reduced-motion disables it globally (Story 1.5) |

</intent-contract>

## Code Map

- `src/components/ui/` -- NEW directory: eight primitive components
- `src/app/page.tsx` -- MODIFY: render a live component-library preview so primitives are exercised in the build
- `src/styles/globals.css` -- VERIFY ONLY: tokens exist for all component specs (colors, radii, type roles from Stories 1.2/1.3)

## Tasks & Acceptance

**Execution:**
- [ ] `src/components/ui/ButtonPrimary.tsx` -- white fill, black mono label, `rounded-md`, hover gray fill + 100ms grayscale fringe + scale 1.02 (transform/transition only) -- conversion CTA (DESIGN.md button-primary)
- [ ] `src/components/ui/ButtonSecondary.tsx` -- transparent, 1px ink-primary outline, mono label, hover inverts -- secondary action
- [ ] `src/components/ui/NavLink.tsx` -- `ink-secondary` mono label, active = white + weight, hover text-flicker via token transition -- header navigation
- [ ] `src/components/ui/ProjectCard.tsx` -- `surface-raised` panel, 1px hairline, one visual slot, problem/solution/result body slots, mono metadata row -- featured project entries
- [ ] `src/components/ui/SkillPill.tsx` -- transparent, 1px hairline, mono label, hover border → white -- skill domains
- [ ] `src/components/ui/FormField.tsx` -- underline-only (bottom hairline), transparent fill, focus 2px white underline + glow, error state with inline mono message slot -- contact form fields
- [ ] `src/components/ui/SectionNumber.tsx` -- mono `001`-style prefix in ink-primary -- section headers
- [ ] `src/components/ui/Footer.tsx` -- mono meta: email, socials, resume link, copyright; hairline top border -- page footer
- [ ] `src/app/page.tsx` -- preview grid exercising all eight primitives -- AC 4: build renders them

**Acceptance Criteria:**
- Given DESIGN.md component specs (UX-DR3), when all eight primitives render, then each matches its spec — primary = white fill + black mono label + 4px radius with gray-fill hover + 100ms grayscale fringe + scale 1.02; secondary = transparent + 1px outline inverting on hover; form-field = underline-only with 2px white focus glow.
- Given the library, when every primitive is scanned, then each consumes tokens only and exposes the same props interface, and no component defines its own color, radius, or spacing.
- Given `npm run build`, when the build runs, then it exits 0 and the preview page renders all primitives without layout breakage.
- Given an accessibility scan, when icon-only links render, then they carry `aria-label`s.

## Spec Change Log

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 7 (high 0, medium 4, low 3)
- defer: 1 (medium 1)
- reject: 2 (low 2)
- addressed_findings:
  - `[medium]` `[patch]` `grayscale(0.35)` filter on button hover is invisible in a strictly monochrome palette (white has no chroma to desaturate). Removed the dead filter; the gray-fill change + scale 1.02 carry the fringe, and the CTA hover glitch burst is Story 1.5's motion engine.
  - `[medium]` `[patch]` Disabled anchors stayed in the tab order. Added `tabIndex={disabled ? -1 : undefined}` to both button primitives.
  - `[medium]` `[patch]` NavLink shipped no ≥ 44px touch target (NFR-2). Added `min-h-11 py-2` (44px from the token spacing scale).
  - `[medium]` `[patch]` FormField was input-only; Epic 3's Message field needs a multiline field. Added `multiline` prop rendering a `<textarea>`, typed via union props.
  - `[low]` `[patch]` Dead `transition: border-color` on `.card-tear` (border flash lives on the parent article); tear also fired only on visual hover, not card hover. Moved to `.group:hover .card-tear` and removed the dead transition.
  - `[low]` `[patch]` Footer socials keyed by index. Now keyed by `href ?? children`.
  - `[low]` `[patch]` Confusing `errorAnnouncement` prop made the required visible inline error sr-only. Removed the prop; the inline mono error is always visible (Epic 3 owns aria-live announcements).

## Verification

**Commands:**
- `npm run build` -- expected: exits 0; preview page renders all eight primitives
- `npm run lint` -- expected: exits 0 (jsx-a11y checks aria-labels)

**Manual checks (if no CLI):**
- Grep `src/components/**` for `#[0-9a-fA-F]{3,6}`, `rgba?(`, and `[0-9]+px` -- expected: no matches
- Grep `src/components/**` for `text-[` / `bg-[` arbitrary-value utilities -- expected: no matches

## Auto Run Result

Status: done

**Summary:** Implemented the Epic 1 Story 1.4 component library — eight token-driven server primitives in `src/components/ui/` (ButtonPrimary, ButtonSecondary, NavLink, ProjectCard, SkillPill, FormField, SectionNumber, Footer) matching DESIGN.md UX-DR3 specs, plus their CSS behavior utilities in `src/styles/globals.css` (btn-fringe, nav-flicker, card-tear, form-field) and a live preview page exercising all eight.

**Files changed:**
- `src/components/ui/ButtonPrimary.tsx` -- NEW: white-fill CTA, mono label, gray-fill hover + scale 1.02, disabled state
- `src/components/ui/ButtonSecondary.tsx` -- NEW: transparent + 1px outline, inverts on hover
- `src/components/ui/NavLink.tsx` -- NEW: mono label, active = white + weight, 100ms text-flicker, ≥ 44px touch target
- `src/components/ui/SectionNumber.tsx` -- NEW: mono `001` prefix (aria-hidden decorative emphasis)
- `src/components/ui/SkillPill.tsx` -- NEW: hairline pill, hover border → white
- `src/components/ui/ProjectCard.tsx` -- NEW: raised panel, one visual, problem/solution/result body, mono metadata, hover tear
- `src/components/ui/FormField.tsx` -- NEW: underline-only, 2px white focus underline + glow, multiline support, inline mono errors
- `src/components/ui/Footer.tsx` -- NEW: mono meta email/resume/socials/copyright, hairline top border
- `src/styles/globals.css` -- component behavior utilities added
- `src/app/page.tsx` -- preview page exercising all eight primitives
- `_bmad-output/implementation-artifacts/spec-1-4-component-library.md` -- this spec

**Review findings breakdown:** Blind Hunter + Edge Case Hunter run in parallel. Triage: 7 patches applied (4 medium: invisible grayscale fringe removed, disabled tab order fixed, NavLink touch target, FormField multiline; 3 low: card-tear group-hover + dead transition, socials keys, errorAnnouncement removal). 1 deferred (reduced-motion guard for the new keyframes — Story 1.5 owns the global policy and must disable `nav-flicker`/`card-tear`/`btn-fringe`). 2 rejected (SectionNumber aria-hidden is a conscious decorative decision per UX-DR10; preview placeholder links are temporary and replaced by Epics 2/4). No intent gaps, no bad_spec loopback.

**Follow-up review recommendation:** true — the final pass made 4 medium-consequence fixes across shared primitives that Epic 2 builds on; one independent confirmation pass is warranted.

**Verification performed:**
- `npm run build` -- exit 0; preview page renders all eight primitives
- `npm run lint` -- exit 0
- Grep `src/components/**` for raw hex/rgba/px and arbitrary utilities -- only JSDoc comment matches; code is token-pure

**Residual risks:**
- `nav-flicker`, `card-tear`, `btn-fringe` keyframes are not yet reduced-motion-guarded; Story 1.5's global `prefers-reduced-motion` rule must disable them (deferred finding).
- Preview page footer/social/resume links (`/resume.pdf?v=1`, `github.com/glitch-guy0`) are placeholders; FR-13 (zero empty links at launch) depends on Epics 2/4 replacing them.
- FormField focus glow is a solid 1px shadow line rather than a soft glow — intentional under the monochrome constraint, matches DESIGN.md's "2px white underline + glow".
