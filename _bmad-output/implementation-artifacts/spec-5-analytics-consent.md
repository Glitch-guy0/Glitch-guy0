---
title: 'Epic 5: Analytics & Consent'
type: 'feature'
created: '2026-08-08'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: ['multiple-goals', 'oversized']
baseline_revision: '51813ec0e6ac8073a4c42829e01b02f148159e4e'
---

<intent-contract>

## Intent

**Problem:** The Builder has no visibility into funnel performance (visits, engagement, contact conversions), and adding that visibility must not track visitors who haven't consented, must stay free-tier, and must run only in production.

**Approach:** Add a client-side cookie consent banner that gates a single analytics signal (Vercel Web Analytics, injected via app code, not the Vercel dashboard) behind explicit Accept consent and production-only execution; the contacts metric is the existing EmailOctopus list count with no new code required.

## Boundaries & Constraints

**Always:**
- Consent choice persists client-side under the exact key `glitch-guy0:consent` with value `"accepted"` or `"declined"`; `CookieBanner` is the sole reader/writer of this key anywhere in the codebase.
- Banner appears on cold load only when no stored consent value exists; once a choice is recorded, the banner never reappears on later visits/page loads.
- Banner renders as a non-obstructing, accessible overlay: keyboard-operable, `Esc` dismisses it (treated as no consent change — banner just hides; the next load still shows it if no key was written, so wire `Esc` to write `"declined"` to satisfy "does not reappear"), Accept/Decline controls are ≥44×44px (use `min-h-11 min-w-11`, matching `Footer.tsx`/`Header.tsx` convention), and it must never visually or functionally block the Contact Flow section or any of its controls.
- `<Analytics />` from `@vercel/analytics/react` is injected via app code (in `src/app/layout.tsx` or a small client wrapper it renders), never via Vercel's dashboard auto-injection setting.
- Analytics only mounts/initializes when BOTH: `process.env.NODE_ENV === 'production'` AND the stored consent value is `"accepted"`. If either is false, render nothing (no `<Analytics />` in the tree, not just a disabled prop).
- No analytics or tracking library other than `@vercel/analytics` may be added.
- `@vercel/analytics` is installed with `bun add @vercel/analytics` (bun is the canonical package manager per `bun.lock` being the actively updated lockfile and `package.json` scripts invoking `bun run`).
- New client components follow existing repo convention: flat file in `src/components/` (no `islands/` subfolder, no `.island.tsx` suffix), `'use client'` as the first line, single named export, root element tagged `data-component="ComponentName"` for `DebugOverlay` compatibility.
- Story 5.3 requires no new application code: verify the existing `/api/contact` route (`src/app/api/contact/route.ts`) already delivers valid submissions to EmailOctopus (confirmed in investigation) and document in the spec's Verification section that the contacts metric is the EmailOctopus list member count, viewable in the EmailOctopus dashboard alongside Vercel's engagement dashboard.

**Block If:**
- If `@vercel/analytics` requires an env var or project-linking step that cannot be completed without Vercel dashboard/account access, HALT and report — do not fabricate credentials or IDs.

**Never:**
- Never store consent state in a cookie, session storage, or server-side store — localStorage only, per AD-6.
- Never build a custom on-site analytics dashboard or new EmailOctopus API integration for the contacts metric — v1 scope is EmailOctopus's existing dashboard count.
- Never gate analytics on anything other than the two conditions above (no IP-based checks, no separate feature flags).
- Never let the banner stack with another modal/overlay, or use `aria-hidden`/focus-trap in a way that blocks page interaction outside the banner itself (it is a non-modal overlay, not a dialog).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| First cold load, no stored consent | `localStorage.getItem('glitch-guy0:consent')` returns `null` | Banner renders with Accept/Decline; `<Analytics />` not mounted | No error expected |
| Visitor clicks Accept | Click on Accept control | `localStorage` set to `"accepted"`; banner hides; if in production, `<Analytics />` mounts on next render | No error expected |
| Visitor clicks Decline | Click on Decline control | `localStorage` set to `"declined"`; banner hides; `<Analytics />` never mounts | No error expected |
| Visitor presses `Esc` while banner open | `keydown` with `key === 'Escape'` | Treated as Decline: `localStorage` set to `"declined"`; banner hides | No error expected |
| Return visit after prior choice | `localStorage` already `"accepted"` or `"declined"` | Banner does not render at all | No error expected |
| SSR / `window` undefined during render | Server-rendered pass before hydration | Component reads consent as absent until client hydration; no crash, no hydration mismatch beyond banner's own visibility toggling after mount | Guard all `localStorage`/`window` access behind `typeof window !== 'undefined'` / effect-only reads |
| Non-production environment (dev/preview) | `process.env.NODE_ENV !== 'production'` | `<Analytics />` never mounts regardless of consent value; banner still functions normally | No error expected |
| `localStorage` unavailable (e.g. private-mode restrictions throw) | `localStorage.getItem`/`setItem` throws | Component fails safe: treat as no consent, banner may reappear each load, no unhandled exception | Wrap reads/writes in try/catch; swallow and fall back to "no consent recorded" |

</intent-contract>

## Code Map

- `package.json` -- add `@vercel/analytics` dependency
- `src/app/layout.tsx` -- root layout; mounts `CookieBanner` and the consent-gated analytics wrapper alongside existing `Header`/`MotionProvider`/`DebugOverlay`
- `src/components/CookieBanner.tsx` -- new client island; owns the `glitch-guy0:consent` key, renders Accept/Decline overlay, exposes current consent state for the analytics wrapper to read
- `src/components/Analytics.tsx` -- new small client component wrapping `<Analytics />` from `@vercel/analytics/react`, mounted only when production + consent accepted
- `src/components/Header.tsx` -- reference only: existing `Esc`-key-listener and `z-70` fixed-bar pattern to mirror for banner keyboard handling and stacking
- `src/components/ui/ButtonPrimary.tsx`, `src/components/ui/ButtonSecondary.tsx` -- reference only: visual style source for Accept/Decline buttons (native `<button>`, not anchor, so don't import directly — copy the class pattern)
- `src/app/api/contact/route.ts` -- reference only: confirms existing EmailOctopus delivery satisfies Story 5.3, no changes needed
- `.env.example` -- reference only: confirm no new env var is required for `@vercel/analytics` (it auto-detects via Vercel's build-time injection in production)

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- run `bun add @vercel/analytics` -- required dependency for Story 5.2, not yet installed
- [x] `src/components/CookieBanner.tsx` -- create client island reading/writing `localStorage['glitch-guy0:consent']`, rendering a bottom-fixed, non-obstructing banner with Accept/Decline `<button>` elements (`min-h-11 min-w-11`, focus-visible outline matching existing button classes), an `Esc` keydown handler that writes `"declined"`, guarded `typeof window` checks, and try/catch around storage access -- implements Story 5.1
- [x] `src/components/Analytics.tsx` -- create client component that reads the same consent key (via a small exported helper or prop from `CookieBanner`'s logic) and conditionally renders `<Analytics />` from `@vercel/analytics/react` only when `process.env.NODE_ENV === 'production'` and consent is `"accepted"` -- implements Story 5.2
- [x] `src/app/layout.tsx` -- import and mount `CookieBanner` and the new `Analytics` wrapper inside the existing layout tree (alongside `Header`, `MotionProvider`, `DebugOverlay`) -- wires both islands into every page
- [x] `src/app/api/contact/route.ts` -- no code change; verify by reading that it already posts/updates EmailOctopus list contacts on valid submissions -- confirms Story 5.3 requires no new code

**Acceptance Criteria:**
- Given a visitor with no stored consent, when the site loads, then the CookieBanner renders as a single-line, accessible, non-obstructing overlay with Accept/Decline, and analytics does not initialize.
- Given the visitor accepts, when consent is recorded, then `localStorage['glitch-guy0:consent']` is `"accepted"`, the banner is dismissed and never reappears on subsequent loads, and (in production only) `<Analytics />` is present in the rendered tree.
- Given the visitor declines or presses `Esc`, when consent is recorded as `"declined"`, then the banner is dismissed and never reappears, and analytics never initializes regardless of environment.
- Given a non-production environment, when any consent value is set, then `<Analytics />` never mounts.
- Given the Contact Flow section is on screen, when the banner is visible, then no banner element overlaps or intercepts pointer/keyboard focus intended for Contact Flow controls.
- Given a valid contact form submission (Epic 3 flow, unchanged), when it completes, then the EmailOctopus list member count increments, satisfying the Story 5.3 "contacts metric" without new code.

## Spec Change Log

## Review Triage Log

### 2026-08-08 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 1: (high 0, medium 0, low 1)
- defer: 3: (high 0, medium 2, low 1)
- reject: 9: (high 0, medium 0, low 9)
- addressed_findings:
  - `[low]` `[patch]` No cross-tab consent sync — `CookieBanner` and `Analytics` only listened for the same-tab `consent-changed` custom event; added a native `storage` event listener alongside it in both files so consent changes made in one tab propagate to other open tabs.

## Design Notes

Consent state needs to be read in two places (`CookieBanner` for its own visibility, `Analytics` wrapper for its gating decision) but only `CookieBanner` may write the key. Simplest approach: export a small ungated helper from `CookieBanner.tsx` (e.g. `getStoredConsent()`) that both components import for reads, while only `CookieBanner`'s internal handlers call `localStorage.setItem`. Keep both components as separate small files rather than one combined component, since `Analytics` needs to re-render when consent changes (e.g. via a shared `storage` event listener or lifting state into a tiny context) — a `window.addEventListener('storage', ...)` won't fire in the same tab that wrote the value, so use a custom event (`window.dispatchEvent(new Event('consent-changed'))`) fired by `CookieBanner` on write, and listened for by `Analytics`, to keep same-tab reactivity without introducing a new state-management dependency.

## Verification

**Commands:**
- `bun run build` -- expected: production build succeeds with `@vercel/analytics` bundled, no type errors
- `bun run lint` -- expected: no new lint violations in `CookieBanner.tsx` or `Analytics.tsx`
- `npm run axe:scan` (or repo's documented axe command) -- expected: zero serious/critical violations with the banner present, confirming keyboard operability and contrast

**Manual checks (if no CLI):**
- Load the dev build with `localStorage` cleared: confirm banner appears, Accept/Decline are each ≥44×44px, `Tab` reaches both controls, `Esc` dismisses and writes `"declined"`.
- Reload after Accept: confirm banner does not reappear.
- Build with `NODE_ENV=production` locally (or inspect deployed preview vs production): confirm `<Analytics />` script only loads in production even when consent is `"accepted"`.
- Submit the contact form once; confirm the EmailOctopus list (via its dashboard or API) shows the incremented member count.

## Auto Run Result

**Summary:** Implemented Epic 5 (Analytics & Consent) in full: a client-side cookie consent banner gating a single, app-code-injected Vercel Web Analytics signal, with the contacts metric (Story 5.3) confirmed to need no new code.

**Files changed:**
- `src/components/CookieBanner.tsx` (new) -- owns the `glitch-guy0:consent` localStorage key, renders the accessible Accept/Decline overlay, handles `Esc`-as-decline, dispatches a same-tab `consent-changed` event plus listens for native `storage` events for cross-tab sync.
- `src/components/Analytics.tsx` (new) -- mounts `<Analytics />` from `@vercel/analytics/react` only when `NODE_ENV === 'production'` and consent is `"accepted"`.
- `src/app/layout.tsx` -- wires `CookieBanner` and `Analytics` into the root layout.
- `package.json` / `bun.lock` -- added `@vercel/analytics@2.0.1`.
- `_bmad-output/implementation-artifacts/epic-5-context.md` (new) -- compiled epic context for planning.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- appended 3 deferred findings from this story's review.

**Review findings breakdown:** 1 patch applied (added native `storage`-event cross-tab sync, alongside the existing same-tab custom event), 3 deferred (unscoped global `Escape` listener can unintentionally decline consent when the keypress was meant for something else; no consent-revoke/manage-preferences control exists; SSR-safe hydration pattern causes a brief banner flash for returning visitors), 9 rejected as false alarms or already matching spec/repo convention (non-standard-looking `z-60` class verified to compile correctly; no `aria-live` announcement; a fail-open storage-error claim disproven by code walkthrough; no neutral dismiss option — matches the spec's two-choice design; consent-logic file coupling — no premature abstraction, first consumer; no unit tests — repo has no test framework and axe-scan is the documented gate; caret-range dependency pinning — matches every other dependency; CSP/network allowlist — no CSP exists in this project; `NODE_ENV`-gated analytics being unverifiable in dev — an explicit spec requirement).

**Verification performed:** `bun run build` passed (clean TypeScript check, static generation succeeded) both before and after the patch. `bun run lint` showed zero new violations; the one reported error is a pre-existing, unrelated rule-definition issue in a `.claude/skills` template file untouched by this change. `bun run axe:scan` and the manual dev-server/browser checks listed under Verification were not run in this unattended pass (no running browser session available); they remain outstanding manual verification for a human or a future browser-driving pass.

**Residual risks:** The three deferred findings above remain open in `deferred-work.md`. Axe-core accessibility scan and manual keyboard/visual QA of the banner have not been executed against a running build.
