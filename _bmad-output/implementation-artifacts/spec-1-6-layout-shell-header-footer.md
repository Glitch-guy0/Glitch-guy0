---
title: 'Story 1.6: Layout shell — header & footer'
type: 'feature'
created: '2026-08-06'
status: 'done'
baseline_revision: 'ae4fabc37db3872bac3244f615549c50fb004d53'
final_revision: ''
review_loop_iteration: 0
followup_review_recommended: true
context: ['_bmad-output/implementation-artifacts/epic-1-context.md']
warnings: []
---

<intent-contract>

## Intent

**Problem:** FR-1 (anchored section navigation) and FR-2 (email always reachable) have no implementation — the page is a component-library preview with no header, footer, or section anchors, so the funnel has no shell.

**Approach:** Build the layout shell per UX-DR7/AD-8: a fixed `Header` client island (transparent until scroll → hairline bottom border, active-section state, `mailto:` + real `<a href="#section">` anchors that smooth-scroll via the Story 1.5 Lenis instance, hash stays in the URL for back-button support, `ScrollTrigger.refresh()` after hash navigation settles) and the `Footer` primitive wired with email/socials/copyright/resume slot; the page renders the seven anchored section shells (`#hero #services #projects #about #skills #experience #contact` + `#top`) so navigation has real targets.

## Boundaries & Constraints

**Always:** Header and Footer are `"use client"` islands (AD-5). Real `<a href="#section">` anchors (AD-8) — never button-scroll. Email from server-side `CONTACT_EMAIL` passed as a prop from the server layout (never hardcoded; never in the client bundle from a server-only env). Smooth scroll via the MotionProvider Lenis instance; hash in the URL after navigation (back-button compatible). Fixed header transparent at top, hairline bottom border once scrolled. Active section tracked and rendered white + weight (NavLink `active`). Touch targets ≥ 44×44px (mobile nav items). ScrollTrigger.refresh() after hash navigation settles. Footer: email, socials, copyright, resume link slot.

**Block If:** A hamburger-drawer pattern beyond a same-page anchor sheet is required, or any decision about header logo/branding copy that isn't in the design docs.

**Never:** Button-based scrolling that breaks the hash contract. Hiding the email anywhere (desktop or mobile). Autoplay/parallax header behavior. Client-side reading of server-only env vars. Page-wide glitching or glitch on the header itself.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Click nav link | Smooth-scrolls to the target section via Lenis; hash updates to `#section`; back button returns to the previous position | No error expected |
| NO_JS | Anchors clicked / JS disabled | Native anchor jump to the section; hash in URL (progressive enhancement) | Native browser behavior |
| SCROLLED | Header after scroll | Transparent → hairline bottom border; active nav updates | Passive scroll listener throttled |
| MOBILE | < 768px viewport | Condensed nav: `☰` button toggles a same-page anchor sheet (≥ 44px targets); email still reachable | Sheet is keyboard-dismissible (Esc) |
| EMAIL_MISSING | `CONTACT_EMAIL` unset | Falls back to a documented placeholder address; never crashes | Fallback constant in the server layout |

</intent-contract>

## Code Map

- `src/components/Header.tsx` -- NEW: `"use client"` fixed header island — scroll hairline, active section, Lenis smooth scroll + hash, mailto, mobile anchor sheet
- `src/components/Footer.tsx` -- MODIFY (minor): already a primitive; wire from page props (no change needed unless API gaps)
- `src/lib/motion/engine.ts` -- MODIFY: expose the active Lenis instance (`setActiveLenis`/`getActiveLenis`) so Header can smooth-scroll without re-creating it
- `src/components/MotionProvider.tsx` -- MODIFY: register the Lenis instance in the engine registry after construction
- `src/app/layout.tsx` -- MODIFY: read `CONTACT_EMAIL` server-side, pass to Header/Footer; render Header above main
- `src/app/page.tsx` -- MODIFY: replace preview with the seven anchored section shells + header + footer, `#top` wrapper

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/motion/engine.ts` -- Add `setActiveLenis(lenis)` / `getActiveLenis()` (module-level registry, no DOM at import) -- Header needs the Lenis instance (AD-8 smooth scroll)
- [ ] `src/components/MotionProvider.tsx` -- Call `setActiveLenis(lenis)` after construction; clear on cleanup -- registry stays in sync with the island lifecycle
- [ ] `src/components/Header.tsx` -- Fixed header: transparent → hairline on scroll (throttled passive listener); `mailto:`; real `#section` anchors that call `getActiveLenis()?.scrollTo(target)` + update `location.hash`; `ScrollTrigger.refresh()` after navigation settles; active-section tracking; mobile `☰` anchor sheet -- UX-DR7/AD-8
- [ ] `src/app/layout.tsx` -- Server-side `process.env.CONTACT_EMAIL` fallback; render `<Header email={...} />` and pass email/footer data -- FR-2 server-read email (AD-8)
- [ ] `src/app/page.tsx` -- Seven section shells with fixed IDs + section numbers + headings + `#top`, footer wired with email/socials/copyright/resume slot -- FR-1/FR-2 targets exist
- [ ] `src/components/Footer.tsx` -- Verify primitive API covers email/socials/copyright/resume (Story 1.4) -- no drift

**Acceptance Criteria:**
- Given FR-1, FR-2, and AD-8, when the fixed header and footer render, then the header is transparent until scroll then gains a hairline bottom border, shows the active section, and carries `mailto:` plus real `<a href="#section">` anchors that smooth-scroll via Lenis while leaving the hash in the URL so the browser back button works.
- Given the footer, when it renders, then email, socials, copyright, and a resume link slot render, and `mailto:` from server-side `CONTACT_EMAIL` is visible on desktop and mobile in both header and footer.
- Given hash navigation, when the user clicks an anchor, then `ScrollTrigger.refresh()` fires after the navigation settles (FR-1, AD-8).
- Given the mobile viewport, when the nav is condensed, then every touch target measures ≥ 44×44px and the anchor sheet is keyboard-dismissible.
- Given the build, when `npm run build` and `npm run lint` run, then both exit 0.

## Spec Change Log

## Review Triage Log

### 2026-08-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 6 (high 0, medium 2, low 4)
- defer: 0
- reject: 1 (low 1)
- addressed_findings:
  - `[medium]` `[patch]` Back button changed the hash but nothing re-scrolled the viewport (native restoration is unreliable with Lenis). Added a `popstate` listener that re-scrolls to the hash target via the shared `scrollToTarget` + `ScrollTrigger.refresh()` — the FR-1/AD-8 back-button contract is now actually delivered.
  - `[medium]` `[patch]` `lenis.scrollTo(duration: 1)` animated programmatically even under reduced motion (NFR-3 requires instant). Added `immediate: prefersReducedMotion()`.
  - `[low]` `[patch]` Empty-string `CONTACT_EMAIL` passed `??` and produced `mailto:` with no address. Centralized in `src/lib/config.ts` with `?.trim() ||` fallback; both layout and page import it (also fixes the duplicated env read).
  - `[low]` `[patch]` Anchor clearance mismatch: Lenis `offset: -80` vs sections `scroll-mt-24` (96px). Unified on 80px — sections now `scroll-mt-20`, offset is the named constant `ANCHOR_OFFSET`.
  - `[low]` `[patch]` Re-clicking the same anchor stacked duplicate history entries. Now `replaceState` when the hash is unchanged.
  - `[low]` `[patch]` `z-70` emission verified in the built CSS — header stacks above the atmosphere's `z-60` (the Story 1.5 cross-story note is resolved).

## Verification

**Commands:**
- `npm run build` -- expected: exits 0
- `npm run lint` -- expected: exits 0

**Manual checks (if no CLI):**
- Grep page.tsx for the seven fixed section IDs (`#hero #services #projects #about #skills #experience #contact #top`)
- Grep Header for real `<a href="#...">` anchors and `location.hash` usage
- Grep layout.tsx for `process.env.CONTACT_EMAIL` (server-only)
- Grep the client bundle output for the email value — expected: NOT present (server prop)

## Auto Run Result

Status: done

**Summary:** Implemented the Epic 1 Story 1.6 layout shell — the fixed `Header` client island (transparent until scroll → hairline bottom border, active-section tracking, real `#section` anchors smooth-scrolling via the Lenis registry with the hash left in the URL, `popstate` back-button re-scroll, `ScrollTrigger.refresh()` after navigation settles, mobile anchor sheet with Esc dismiss, `mailto:` reachable on every viewport) and the `Footer` wired with email/socials/copyright/resume slot; the page now renders the seven anchored section shells (`#hero #services #projects #about #skills #experience #contact` + `#top`) per AD-8, with email sourced server-side from `CONTACT_EMAIL`.

**Files changed:**
- `src/components/Header.tsx` -- NEW: fixed header island — scroll hairline, active section, Lenis smooth scroll + hash, popstate handler, mobile sheet
- `src/lib/config.ts` -- NEW: server-only config module (`CONTACT_EMAIL` with empty-string-safe fallback)
- `src/lib/motion/engine.ts` -- `setActiveLenis`/`getActiveLenis` registry added
- `src/components/MotionProvider.tsx` -- registers/clears the Lenis instance
- `src/app/layout.tsx` -- server-read email; renders `<Header>` inside MotionProvider
- `src/app/page.tsx` -- seven anchored section shells + `#top` + Footer
- `_bmad-output/implementation-artifacts/spec-1-6-layout-shell-header-footer.md` -- this spec

**Review findings breakdown:** Blind Hunter + Edge Case Hunter run in parallel. Triage: 6 patches applied (2 medium: popstate back-button re-scroll added, reduced-motion `immediate` on scrollTo; 4 low: empty-string email + duplicated env read centralized into `src/lib/config.ts`, anchor clearance unified at 80px, `replaceState` for duplicate hashes, `z-70` emission verified). 0 deferred. 1 rejected (duplicate history entries — harmless, now also handled by replaceState). No intent gaps, no bad_spec loopback.

**Follow-up review recommendation:** true — the shell is the interaction surface Epic 2 sections and Epic 5's cookie banner build on; the popstate + Lenis interplay deserves one independent confirmation pass.

**Verification performed:**
- `npm run build` -- exit 0; built HTML contains all seven `id` anchors + `#top`, real `href="#..."` anchors, and `mailto:` links
- `npm run lint` -- exit 0
- `z-70` emits in built CSS (header stacks above atmosphere `z-60`)
- Email (`builder@example.com` fallback and the real env value) absent from all client chunks — server-only (exit 1 on client grep)

**Residual risks:**
- Header offset (80px) is tuned for the current shell; Epic 2 content sections may need an offset re-check once real content changes section heights.
- The real `CONTACT_EMAIL` value is read from the local environment; production must set it (DEP-1 env vars).
- `history.pushState` with Lenis is verified in the build but deserves a real-browser back-button pass (browser-use) — recommended as a follow-up review.
