---
title: 'Story 1.5: Motion & glitch engine'
type: 'feature'
created: '2026-08-06'
status: 'done'
baseline_revision: '3cf7080f138683862c8c47a75b17d0fd285da787'
final_revision: '3a72a15a299a275a06f900fa88e7c6d8f42b1eca'
review_loop_iteration: 0
followup_review_recommended: true
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** The design voice (UX-DR4/UX-DR5, AD-2) requires a branded atmosphere — CRT scanlines + noise, short glitch bursts, smooth scroll, GPU-friendly reveals — but no motion layer exists; the site is static and the Story 1.4 keyframes (`nav-flicker`, `card-tear`, `btn-fringe`) are not yet reduced-motion-guarded.

**Approach:** Build the motion architecture exactly per AD-2: a pure `src/lib/motion/engine` + a `MotionProvider` client island running GSAP 3 and Lenis 1 on a single GSAP ticker (`autoRaf: false`, `lenis.raf(time * 1000)`, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, `ScrollTrigger.refresh()` after mount); CSS-only atmosphere (fixed full-viewport scanlines + noise at 3–6% opacity, `aria-hidden`) and glitch-burst keyframes defined once; one `prefers-reduced-motion` policy in two coordinated halves.

## Boundaries & Constraints

**Always:** All GSAP/Lenis wiring inside the `MotionProvider` island (`"use client"`). `src/lib/motion/engine` is a pure module (no DOM side effects at import) exposing burst/reveal/amplitude helpers. Single GSAP ticker integration per AD-2 with the exact options listed. Glitch keyframes defined once in `src/styles/globals.css`; bursts 100–400ms with instant snap-back; `prefers-reduced-motion: reduce` disables every glitch/flicker/tear keyframe (including the Story 1.4 `nav-flicker`, `card-tear`, `btn-fringe`) AND `gsap.matchMedia()` disables JS tweens + Lenis smoothing (instant reveal, native scroll). One amplitude token for mobile ~30% intensity reduction. Atmosphere (scanlines + noise) is fixed, non-interactive, `aria-hidden`, opacity 3–6%.

**Block If:** Another animation library is needed, or a decision about scroll-jacking/parallax is required.

**Never:** Autoplay video/WebGL (NFR-1). Page-wide or sustained glitching. Glitches on body text, form fields, or the page as a whole. Flashing > 3×/s (NFR-3). Scroll-jacking, parallax, or `position: fixed` hero elements. Box-shadow/width/height animations (GPU-only opacity/transform).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | MotionProvider mounts | Lenis + ScrollTrigger wired on one ticker; scanlines + noise render at 3–6% opacity; `data-reveal` elements fade in on viewport entry; `data-glitch-burst` elements burst on entry | No error expected |
| REDUCED_MOTION | `prefers-reduced-motion: reduce` | No glitch/flicker/tear keyframes run; Lenis smoothing off (native scroll); `data-reveal` elements render instantly | `gsap.matchMedia` + global CSS media query coordinate |
| MOBILE | < 768px viewport | Glitch amplitude reduced ~30% via the amplitude token | Single token rebinds |
| NO_JS | JS disabled | No atmosphere (server-rendered divs are `aria-hidden` but CSS-only scanlines could render — acceptable); anchors scroll natively | Progressive enhancement only |

</intent-contract>

## Code Map

- `src/lib/motion/engine.ts` -- NEW: pure motion engine — amplitude tokens, reduced-motion check, `fireGlitchBurst(el)`, `registerReveal(el, opts)`, `registerBurst(el)` helpers used by the island (no DOM at import)
- `src/components/MotionProvider.tsx` -- NEW: `"use client"` island — Lenis (`autoRaf: false`) + GSAP ticker + ScrollTrigger per AD-2, `gsap.matchMedia()` reduced-motion branch, atmosphere overlay (scanlines + noise divs), scans DOM for `data-reveal`/`data-glitch-burst`
- `src/app/layout.tsx` -- MODIFY: wrap children in `<MotionProvider>`
- `src/styles/globals.css` -- MODIFY: scanlines + noise classes, `glitch-burst` keyframes (once), amplitude token, global `@media (prefers-reduced-motion: reduce)` disabling all glitch/flicker/tear keyframes
- `src/app/page.tsx` -- MODIFY: add `data-reveal`/`data-glitch-burst` attributes to preview sections to exercise the engine

## Tasks & Acceptance

**Execution:**
- [ ] `src/styles/globals.css` -- Add `--glitch-amplitude` + `--glitch-amplitude-mobile` tokens; scanlines + noise atmosphere classes (fixed, 3–6% opacity, `aria-hidden` pattern); `@keyframes glitch-burst` (100–400ms grayscale-offset + jitter, 0%/100% identical for snap-back); `@media (prefers-reduced-motion: reduce)` rule disabling `glitch-burst`, `nav-flicker`, `card-tear`, `btn-fringe` -- atmosphere + bursts + the reduced-motion policy's CSS half (UX-DR4, AD-2, deferred finding from 1.4)
- [ ] `src/lib/motion/engine.ts` -- Pure helpers: amplitude token access, `reducedMotion()` check, `fireGlitchBurst(el)`, `registerReveal(el, {stagger, y})`, `registerBurst(el)` -- reusable motion API for sections/islands (AD-2, UX-DR5)
- [ ] `src/components/MotionProvider.tsx` -- Client island wiring Lenis + GSAP + ScrollTrigger on one ticker exactly per AD-2; `gsap.matchMedia()` reduces tweens/smoothing; atmosphere overlay divs; effect scans `[data-reveal]` and `[data-glitch-burst]` -- single integration point (AD-2)
- [ ] `src/app/layout.tsx` -- Wrap page content in `<MotionProvider>` -- engine runs on every route
- [ ] `src/app/page.tsx` -- Annotate preview sections with `data-reveal`/`data-glitch-burst` -- AC 4: engine is exercised in the build

**Acceptance Criteria:**
- Given AD-2, when `MotionProvider` mounts, then GSAP 3 + Lenis 1 run on a single GSAP ticker — `autoRaf: false`, `lenis.raf(time * 1000)`, `gsap.ticker.lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, `ScrollTrigger.refresh()` after mount.
- Given UX-DR4, when the page renders, then full-viewport scanlines + noise render at 3–6% opacity and are `aria-hidden`.
- Given the motion API, when `data-glitch-burst` elements enter the viewport and `data-reveal` elements scroll in, then bursts fire 100–400ms with instant snap-back and reveals are opacity/transform-only with ≤ 150ms stagger — never on body text, form fields, or the whole page.
- Given reduced-motion, when `prefers-reduced-motion: reduce` applies, then the global CSS rule disables every glitch/flicker/tear keyframe (including `nav-flicker`, `card-tear`, `btn-fringe` from Story 1.4) and `gsap.matchMedia()` disables JS tweens and Lenis smoothing — instant reveal, native scroll.
- Given the mobile viewport, when < 768px, then glitch amplitude drops ~30% via the single amplitude token.
- Given the build, when `npm run build` and `npm run lint` run, then both exit 0.

## Spec Change Log

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 4 (high 0, medium 1, low 3)
- defer: 0
- reject: 3 (low 3)
- addressed_findings:
  - `[medium]` `[patch]` Dead exports in `engine.ts` (`revealHiddenStyle`, `revealStaggerDelay`) + the burst-removal timeout pattern inlined twice in MotionProvider. Removed the dead helpers and switched both call sites to the exported `clearGlitchBurst`.
  - `[low]` `[patch]` `GLITCH_BURST_CLASS` constant was bypassed for raw `'glitch-burst'` strings in MotionProvider. Now imported and used via `clearGlitchBurst`/`fireGlitchBurst`.
  - `[low]` `[patch]` `data-burst-on-load` + `data-glitch-burst` mutual-exclusivity was undocumented (double-burst risk). Pinned the contract as a doc comment in `engine.ts`.
  - `[low]` `[patch]` `revealHiddenStyle` (meant to prevent SSR→client reveal flash) was unused; removed it. The SSR-visible → client-hide → reveal flash is a deliberate progressive-enhancement tradeoff (EXPERIENCE.md no-JS pattern) — rejected as a finding, helper deleted to avoid dead code.

## Verification

**Commands:**
- `npm run build` -- expected: exits 0
- `npm run lint` -- expected: exits 0

**Manual checks (if no CLI):**
- Grep built CSS for `@media (prefers-reduced-motion: reduce)` rule containing `glitch-burst`, `nav-flicker`, `card-tear`, `btn-fringe`
- Grep built CSS for `--glitch-amplitude` tokens and `@keyframes glitch-burst`
- Inspect `MotionProvider` for `autoRaf: false`, `lagSmoothing(0)`, `lenis.raf(time * 1000)`

## Auto Run Result

Status: done

**Summary:** Implemented the Epic 1 Story 1.5 motion & glitch engine — the pure `src/lib/motion/engine` (burst/reveal/reduced-motion helpers) and the `MotionProvider` client island wiring GSAP 3 + Lenis 1 on a single GSAP ticker exactly per AD-2 (`autoRaf: false`, `lenis.raf(time * 1000)`, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, `ScrollTrigger.refresh()` after mount), plus the CSS-only atmosphere (fixed scanlines + noise at 5% opacity, aria-hidden), `glitch-burst` keyframes defined once with a token-driven amplitude (3px / 2px mobile ≈ 30% reduction), and the two-half reduced-motion policy (global CSS media rule disabling `glitch-burst`/`nav-flicker`/`card-tear`/`btn-fringe` + `gsap.matchMedia()` disabling JS tweens and Lenis smoothing).

**Files changed:**
- `src/lib/motion/engine.ts` -- NEW: pure motion helpers (burst, clear, reduced-motion, attribute contract)
- `src/components/MotionProvider.tsx` -- NEW: `"use client"` island — Lenis+GSAP single ticker, matchMedia branches, atmosphere overlay, DOM scanning for reveal/burst attributes
- `src/app/layout.tsx` -- wraps children in `<MotionProvider>`
- `src/styles/globals.css` -- amplitude tokens, atmosphere classes, glitch-burst keyframes (once), reduced-motion rule
- `src/app/page.tsx` -- preview annotated with `data-reveal`/`data-burst-on-load`/`data-glitch-burst`
- `_bmad-output/implementation-artifacts/spec-1-5-motion-glitch-engine.md` -- this spec

**Review findings breakdown:** Blind Hunter + Edge Case Hunter run in parallel. Triage: 4 patches applied (1 medium: dead exports + duplicated burst-removal inlined twice — now reusing `clearGlitchBurst`; 3 low: `GLITCH_BURST_CLASS` constant wired, double-burst attribute contract pinned, unused FOUC helper removed). 0 deferred. 3 rejected (SSR reveal flash is the deliberate progressive-enhancement no-JS pattern; Lenis runtime reduced-motion toggle is an edge-of-an-edge with the CSS + matchMedia halves covering the critical behavior; `filter` in the burst keyframes is by design per UX-DR4 "grayscale-offset"). No intent gaps, no bad_spec loopback. The Story 1.4 deferred finding (reduced-motion guard for `nav-flicker`/`card-tear`/`btn-fringe`) is now RESOLVED by this story's global rule.

**Follow-up review recommendation:** true — the single-ticker GSAP/Lenis wiring is the foundation Story 1.6's layout shell integrates with; an independent confirmation pass is warranted.

**Verification performed:**
- `npm run build` -- exit 0
- `npm run lint` -- exit 0
- Built CSS contains: `@media (prefers-reduced-motion: reduce)` rule disabling `glitch-burst`/`nav-flicker:hover`/`.group:hover .card-tear`/`btn-fringe`, `@keyframes glitch-burst`/`nav-flicker`/`card-tear`, `--glitch-amplitude: 3px` + `2px` mobile rebind, `.atmosphere-scanlines`/`.atmosphere-noise`
- Source inspection: `autoRaf: false`, `lenis.raf(time * 1000)`, `gsap.ticker.lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`, post-mount `ScrollTrigger.refresh()`

**Residual risks:**
- Z-index stacking: `.atmosphere` sits at z-60; Story 1.6's fixed header (and Epic 5's cookie banner) must explicitly stack above it or below it — pinned as a cross-story note.
- The SSR-visible → client-hide → reveal pattern means above-the-fold `[data-reveal]` content briefly flashes before JS hides and re-reveals it (accepted progressive-enhancement tradeoff).
- Lenis smoothing is fixed at mount; a runtime OS reduced-motion toggle mid-session won't switch Lenis (CSS + matchMedia halves still react).
