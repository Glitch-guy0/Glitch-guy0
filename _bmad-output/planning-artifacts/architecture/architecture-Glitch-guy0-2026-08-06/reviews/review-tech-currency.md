# Tech-Currency Review — Glitch-guy0 Architecture Spine

- **Reviewed:** ARCHITECTURE-SPINE.md (2026-08-06, draft)
- **Date of review:** 2026-08-06
- **Method:** every committed technology claim below was checked against current web sources (official docs, npm registry, release notes, pricing pages). Nothing was taken from training data.
- **Verdict:** Sound spine overall — **1 HIGH, 0 CRITICAL**, several MEDIUM/LOW refinements. The only wrong committed claim is the EmailOctopus version string ("API v1.0"); everything else checks out as current and the GSAP+Lenis integration pattern matches documented practice.

---

## Stack-claim-by-claim findings

### 1. Next.js App Router — VERIFIED (LOW note)

**Claim:** "latest stable at scaffold — 15.x/16.x current"; App Router default.

**What the web says:** Current stable is **16.x — 16.3.0** (docs `version: 16.3.0`, lastUpdated 2026-07-21; blog post `next-16-3` published 2026-08-03). `create-next-app` defaults enable **TypeScript, Tailwind CSS, ESLint, App Router, Turbopack, import alias `@/*`, and AGENTS.md**. React Compiler and the `src/` directory are NOT part of the defaults (both are opt-in).

**Fit:** Claim is accurate. Two scaffold notes for the builder:
- The structural seed uses `src/app/` — that requires the explicit `--src-dir` flag at scaffold (not a default).
- Next 16 removed `next lint` (deprecated in 15.5); linting uses the ESLint CLI directly or Biome, and the default is Turbopack. This is relevant to the axe-core "build" wiring only insofar as the build script must invoke the right tool.

**Fix:** None required. Add "scaffold with `--src-dir`" to the seed notes; keep "16.x" and drop the "15.x/" hedge if precision is wanted.

### 2. Tailwind CSS v4 CSS-first config — VERIFIED

**Claim:** v4, `@theme` in `globals.css`, no `tailwind.config` needed.

**What the web says:** v4.0 shipped Jan 2025; CSS-first configuration is the flagship change — tokens in `@theme {}` blocks inside the CSS file, `tailwind.config.js` no longer needed (JS config still loadable via `@config` for legacy). `@import "tailwindcss"` replaces the `@tailwind` directives. Theme variables map 1:1 to utilities and become native CSS variables.

**Fit:** Exact match for AD-1 (single `@theme` in `src/styles/globals.css`, one declaration per token). The light/dark "one token set, inverted ink/surface roles" approach is compatible.

**Fix:** None.

### 3. GSAP 3.12+ (core + ScrollTrigger + @gsap/react useGSAP) — VERIFIED

**Claim:** GSAP 3.12+ with ScrollTrigger and `@gsap/react` `useGSAP`.

**What the web says:** Current GSAP is **3.15.0** (npm, 2026-04-13); 3.13 (2025-04-29) and 3.14 (2025-12-08) are the recent majors within 3.x. `@gsap/react` is current at **2.1.2** (peer `gsap ^3.12.5`, `react >=17`). Since GSAP 3.13, the full plugin set (incl. SplitText) is free. `useGSAP` is the officially documented React integration (context scoping + auto-revert, StrictMode-safe).

**Fit:** "3.12+" correctly covers 3.15. No issue. Bonus: glitch text effects from AD-2 could use SplitText free now — not required, but available.

**Fix:** None.

### 4. Lenis 1.x via `lenis/react` — VERIFIED

**Claim:** "Lenis 1.x — import `lenis/react` (`ReactLenis`), not the retired `@studio-freight/react-lenis`."

**What the web says:** Correct. Current Lenis is **1.3.x** (unpkg refs at `lenis@1.3.25` / `1.3.26`). The official package is `lenis`, with framework adapters `lenis/react` (`ReactLenis` + `useLenis`) and `lenis/vue`. `@studio-freight/react-lenis` is the deprecated pre-renamespace package (the npm registry page is the old readme; the project renamed to darkroomengineering/lenis). Community guides explicitly call the `@studio-freight/*` packages deprecated.

**Fit:** Exact match. `ReactLenis root options={{ autoRaf: false }}` is the current API.

**Fix:** None.

### 5. zod (server-side form validation) — VERIFIED

**Claim:** "latest (form validation, server-side)."

**What the web says:** Current is **4.4.3** (npm, 2026-05-04). Zod 4 is stable; since July 2025 the package root `zod` exports v4 (v3 available at `zod/v3`). 31M weekly downloads.

**Fit:** Sound, standard choice for the `POST /api/contact` server-side validation in AD-3.

**Fix:** None. (Pin `^4` at scaffold; zod 4's error APIs changed from v3.)

### 6. axe-core build-time accessibility checking — VERIFIED (LOW/MEDIUM note)

**Claim:** "axe-core latest (build-time accessibility check)"; Consistency table: "Axe-core runs at build in both color modes."

**What the web says:** Current **axe-core 4.11.4** / **`@axe-core/cli` 4.12.1** (npm, mid-2026). axe-core is an automated accessibility engine (the same engine as Lighthouse/DevTools). For build-time use the standard tooling is `@axe-core/cli` (headless-Chrome scan of a served page) or `axe-core` + a runner (Playwright/Puppeteer); there are published Next.js 16 + axe-core build/dev-gate patterns.

**Fit:** Claim is correct and the tool is right for the job. Two implementation realities to keep honest:
- axe is a DOM scanner, not a static analyzer. "At build" means running it against the *built output served locally* (e.g. `next build && next start`, then CLI scan), not against source files.
- "Both color modes": axe only scans what's in the rendered DOM. The light mode check works out of the box; the dark mode requires making the dark variant reachable (forced theme class on `<html>`, or a URL/preview toggle) so the scanner can render and measure contrast ≥ 4.5:1 against it. Plan the scan harness accordingly.

**Fix:** None to the claim; seed the scan approach (`@axe-core/cli` vs Playwright) and the dark-mode-rendering trick.

### 7. EmailOctopus API v1.0 create-contact — HIGH (borders CRITICAL)

**Claim:** Stack table — "EmailOctopus | API v1.0 (contact delivery)"; AD-3 calls `create-contact`.

**What the web says:**
- **There is no "API v1.0."** The public legacy API line is versioned **1.5 → 1.6**; the documented create-contact endpoint is `POST https://emailoctopus.com/api/1.6/lists/{listId}/contacts` (JSON body: `{ api_key, email_address, fields, tags, status }`). The version string in the spine is unfounded.
- **v1 is legacy.** EmailOctopus launched **API v2 on 7 October 2024**. The API docs state v1 "is now considered legacy and no longer actively [developed]" and explicitly **recommend migrating to API v2 for new integrations, improvements, and ongoing support**. v1 still works, but for a new 2026 build the committed choice should be v2 (auth is via an API key; create/upsert contact semantics differ from v1's body `api_key`).
- **The `create-contact` operation itself is real and correctly shaped** on both versions — so the architecture is right, the version pin is wrong.
- **Free tier: VERIFIED.** Free Starter plan, forever, no credit card: **2,500 subscribers, 10,000 emails/month**, EmailOctopus branding. Ample for a portfolio contact flow.

**Why HIGH not CRITICAL:** the service, the endpoint concept, and the free tier all exist and work; it is not a dead or fabricated technology. But "API v1.0" is a wrong/legacy version claim, and v1 is formally deprecated by the vendor — a new build committing to it is exactly the "out of date" case.

**Fix:**
1. Change the stack row to **"EmailOctopus API v2 (create-contact; free Starter plan, 2,500 subs / 10k emails mo.)"** — or, if v1 is kept, pin the real string **v1.6** and note it is legacy per the vendor.
2. In AD-3/`lib/contact`, plan for the v2 auth scheme and the two realistic failure modes that contradict "never fails silently": the **`MEMBER_EXISTS_WITH_EMAIL_ADDRESS`** error on duplicate submission (decide: idempotent success vs explicit message — currently unspecified), and list double-opt-in status (`PENDING` default when opt-in is enabled — a "created" contact may not be subscribed yet, so "valid submissions counted" should key on API success, not subscription state).

### 8. Vercel Web Analytics (free tier, cookie behavior) — VERIFIED (MEDIUM note)

**Claim:** Hosting + Web Analytics, production-only; AD-6 gates initialization behind explicit Accept; Deferred: "PRD decision (cookies → consent) is binding."

**What the web says:**
- **Free tier: VERIFIED.** Web Analytics is free on the Hobby plan within usage limits (2,500 events/month on Hobby per the GA changelog; Vercel "will not charge for additional usage" — it stops capturing after limits, no billing surprise).
- **Cookie behavior: Vercel Web Analytics is cookieless.** Official docs (2026-07-15): "does not use cookies … visitors are identified by a hash created from the incoming request … valid for a single day." No storage on the device.

**Fit/impact:** Two consequences for AD-6:
- Because it sets **no cookies**, Web Analytics does **not** trigger the ePrivacy Article 5(3) *storage* rule on its own. The spine's consent gate is still the safer and recommended setup (GDPR: an IP-derived hash and a client-side tracking beacon still process personal data; Vercel's own privacy page says the customer is responsible for consent), so **keep the gate** — but the binding rationale should be reframed from "cookies → consent" to **"tracking/processing → consent"**. Otherwise the CookieBanner copy ("cookies") will be technically inaccurate for the one thing it gates.
- No built-in consent management: the component begins reporting the moment it mounts, so the AD-6 pattern (render `<Analytics/>` only after Accept, and use the `beforeSend` guard as a second line) is exactly the documented best practice. Production-only is consistent (WA only captures on production deployments anyway).

**Fix:** Reword the AD-6/deferred note: consent is required because analytics *processing* occurs, not because of cookies. Keep the conditional-mount + `beforeSend` pattern.

---

## AD-2 sanity check — GSAP + Lenis integration pattern

**Claimed pattern (AD-2):** single RAF via `gsap.ticker`; `autoRaf: false` on `ReactLenis`; `lenis.raf()` added to `gsap.ticker`; `ScrollTrigger.refresh()` after mount; `gsap.matchMedia()` gate for `prefers-reduced-motion: reduce`.

**What the web says — the pattern is the documented one.** Both the Lenis README and `lenis/react` README ship this exact GSAP integration:

```js
// lenis/react README (official)
function update(time) { lenisRef.current?.lenis?.raf(time * 1000) }
gsap.ticker.add(update)
return () => gsap.ticker.remove(update)
// <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
```

and the Lenis main README's ScrollTrigger setup adds:

```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

So: `autoRaf: false` + `lenis.raf()` on the ticker + refresh after mount is correct. **MEDIUM/LOW gaps to encode in the seed** so the builder doesn't reintroduce the classic bugs:

1. **Units:** the GSAP ticker passes **seconds**, `lenis.raf()` expects **milliseconds** → the callback must be `time * 1000`. Omitted, Lenis scroll is off by ~1000× and appears broken. The spine does not mention the conversion.
2. **`gsap.ticker.lagSmoothing(0)`** is recommended by both vendors when driving Lenis from the ticker (prevents jumpy ScrollTrigger scrub).
3. **`lenis.on('scroll', ScrollTrigger.update)`** is the canonical sync line for scrub-linked ScrollTriggers; the spine implies but doesn't state it. Add it to the motion provider spec.
4. **`ScrollTrigger.refresh()` after mount** is correct and also recommended after async loads/fonts/layout shifts — matches AD-2. Keep.
5. `gsap.matchMedia()` reduced-motion gating is current, documented GSAP practice (the README itself cites `gsap.matchMedia()` for accessibility-friendly animations) — the reduced-motion gate is sound. Good.

---

## Summary table

| # | Claim | Status | Severity |
|---|-------|--------|----------|
| 1 | Next.js App Router 15/16.x, CNA defaults | 16.3.0 current; defaults = TS/Tailwind/ESLint/App Router/Turbopack; `src/` is opt-in | VERIFIED / LOW |
| 2 | Tailwind v4 CSS-first `@theme`, no config | v4 CSS-first confirmed | VERIFIED |
| 3 | GSAP 3.12+ + ScrollTrigger + @gsap/react | 3.15.0 / @gsap/react 2.1.2 | VERIFIED |
| 4 | Lenis 1.x `lenis/react`, not @studio-freight | 1.3.x; `lenis/react` correct; @studio-freight deprecated | VERIFIED |
| 5 | zod server-side validation | 4.4.3 (v4 stable) | VERIFIED |
| 6 | axe-core build-time a11y check | 4.11/4.12 current; DOM-scan + dark-mode reachability caveat | VERIFIED / LOW |
| 7 | EmailOctopus "API v1.0" create-contact | No v1.0; legacy line is 1.6; **v2 launched Oct 2024, v1 legacy**; free plan 2,500 subs/10k mo. confirmed | **HIGH** |
| 8 | Vercel Web Analytics free tier + cookie behavior | Free on Hobby (2,500 events/mo); **cookieless** (day-scoped request hash) | VERIFIED / MEDIUM |
| — | AD-2 GSAP+Lenis single-RAF pattern | Matches official docs; missing `time*1000`, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)` details | VERIFIED / MEDIUM |

**No CRITICAL findings.** One HIGH (EmailOctopus version), one MEDIUM (Web Analytics "cookies → consent" framing), plus low-severity seed-level notes (Next `--src-dir`, axe dark-mode scan, AD-2 integration details).
