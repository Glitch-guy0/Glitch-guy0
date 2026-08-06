---
title: "Divergence Review — ARCHITECTURE-SPINE.md (Glitch-guy0)"
type: review
subtype: adversarial-divergence
created: 2026-08-06
target: architecture-Glitch-guy0-2026-08-06/ARCHITECTURE-SPINE.md
method: construct two hypothetical builder units, each compliant with every AD as written, and show they build incompatibly
status: findings
---

# Divergence Review — Architecture Spine

## Verdict

The spine is directionally sound (island split, single-sourced content, consent-gated analytics) but its ADs govern **intent, not contract**: every payload, ID scheme, storage key, gate mechanism, and generation step it names is under-specified, and two of its rules are internally self-contradictory with their own bound sources (AD-1 vs DESIGN.md tokens; AD-2's "single gate" vs the CSS keyframe requirement). A pair of disciplined builders following the document literally will produce a site whose form and route disagree on success, whose reduced-motion gate leaks, whose light mode breaks, and whose anchors don't meet FR-1's back-button consequence. **3 CRITICAL, 5 HIGH, 5 MEDIUM.**

---

## Baseline read (what the spine actually pins)

| Contract surface | What ADs/conventions pin | What is left open |
| --- | --- | --- |
| Contact payload | `{ name, email, message }` | honeypot member & name, schema strictness, status↔envelope mapping, success/error copy source |
| API response | `{ ok: boolean, error?: string }` | which HTTP status each outcome maps to; client decides by `res.ok` or `body.ok` |
| Content | "single-sourced in `src/content/` as typed data" | module shape/exports; precedence when resume.md and PRD conflict; form/nav microcopy ownership |
| Motion | "all motion through `src/lib/motion`", "glitch keyframes are CSS" | who gates CSS keyframes (matchMedia cannot); durations/easing/amplitude tokens; mobile 30% reduction owner |
| Consent | "persisted client-side", "initializes only after Accept" | storage key/value/TTL; script-injection mechanism (dashboard auto-inject vs package) |
| Tokens | "one declaration each", "mapped 1:1 from DESIGN.md" | whether `-light` values are new tokens or re-bound variables |
| Anchors | FR-1: smooth scroll + back button | id scheme for the seven sections; hash/URL contract under Lenis |
| Resume | `/public/resume.pdf` cache-busted `?v=` | what `?v=` is; how the PDF gets generated; href owner |

---

## CRITICAL

### C1 — The contact wire contract has an unnamed member (honeypot), an unpinned status↔envelope mapping, and no way to share one schema

**The two units.**

- **Unit A (route).** Body schema `z.object({ name, email, message }).strict()`, rejects unknowns. Honeypot arrives as an extra body field named `website`; route returns 400 + `{ok:false,error}` on validation failure, 502 + `{ok:false,error}` on EmailOctopus failure, 200 + `{ok:true}` for honeypot (stealth).
- **Unit B (route).** Honeypot named `company`; schema `.passthrough()`; validation failures return **200** + `{ok:false, error:"Please check your input"}` (form errors are a "user-visible" outcome, not a server fault, so non-2xx is reserved for infra); honeypot returns 200 + `{ok:true}`.

**The client pairs.** A's client tests `if (!res.ok) throw` — it never reads `body.ok`. B's client tests `if (!body.ok) throw` — it never trusts `res.ok`. The PRD's acceptance test (EXPERIENCE.md Flow 3) is "test contact arrives + metric increments", which both pass *in isolation*.

**How they obey every AD.** AD-3 demands honeypot + format checks + explicit success/error + never-silent-200 on EO failure; the convention pins `{name,email,message}` and `{ok,error?}` — all satisfied by both. AD-3 says "client validates (client-side **+ a zod schema server-side**)" — two zod schemas are literally prescribed, so duplication is not only permitted, it is the stated design.

**The incompatibility.** (1) A's `.strict()` schema hard-fails the moment a client built to B's assumptions sends `company`; a client built to A's `website` sends nothing the B route's honeypot checks. (2) A client that decides by `res.ok` receives B's validation-200 + `{ok:false}` and renders the **success** state for an unsent form; B's client receives A's 400 and renders a form error the A route intended as a honeypot-stealth success. Success semantics are decided in two places. (3) The drawn mermaid graph lists only `islands → content|tokens|motion` — there is **no `islands → lib/contact` edge** — so a builder who reads the graph as exhaustive *cannot* import a shared schema and must maintain the two zod copies AD-3 implies, which then drift.

**Closure (new AD-8 "Contact wire contract is one shared definition").** Pin: the full wire shape including the honeypot member name (e.g. `website`) and that it travels in the JSON body; schema strictness (`strip()` — a honeypot-hit must never surface as a validation error to a legitimate client that accidentally sends the field); the exact status table (200 ok / 400 invalid format / 502 EO failure / 200+`{ok:true}` honeypot-stealth); that the client decides success **only** by `body.ok`; and that exactly one zod schema lives in `src/lib/contact/schema.ts`, imported by both the island and the route. Amend the mermaid graph (or add a note) to allow `islands → lib/contact` for the schema, keeping `env` access the only server-side part.

---

### C2 — The reduced-motion gate has two owners, and AD-2's "single gate" claim is false as written

**The two units.**

- **Unit A (CSS-first glitch).** Per "Glitch keyframes are CSS, defined once in the token/styles layer", implements the glitch bursts as pure CSS keyframes in `globals.css`, fired by an IntersectionObserver in a small island that toggles `.is-active`. Relies on a `@media (prefers-reduced-motion: reduce)` block in `globals.css` to disable the keyframes. The `gsap.matchMedia()` gate (AD-2) only guards GSAP reveals and Lenis.
- **Unit B (GSAP-first glitch).** Implements glitch bursts as GSAP timelines (grayscale offset + jitter tweens) driven by ScrollTrigger; the CSS keyframes exist only as a never-mounted fallback. Relies entirely on the single `gsap.matchMedia()` gate — no `@media` block for keyframes, because matchMedia is declared "a single gate" and a CSS media query would be a second gate.

**How they obey every AD.** Both route all authored motion through `src/lib/motion` (AD-2), both define keyframes once in the token/styles layer, both can legitimately cite "a single `gsap.matchMedia()` gate" for their GSAP work, and both respect `prefers-reduced-motion` for *their* system. EXPERIENCE.md's Accessibility Floor separately mandates "a global `prefers-reduced-motion: reduce` media query disables all glitch keyframes — outright" — the spine's AD-2 contradicts its own binder, which already presumes the CSS gate exists.

**The incompatibility.** `gsap.matchMedia()` cannot kill a CSS animation, and a CSS media query cannot kill a GSAP tween. Unit A's reduced-motion users still get GSAP reveals and Lenis smoothing; Unit B's still get CSS keyframe motion if any keyframe survives. Whichever builder pairs the "wrong" complementary half — and the spine never says which — ships flashing >3×/s to a vestibular-sensitive visitor, failing WCAG 2.3.1 which AD-2 claims to enforce. The `~30% glitch reduction on mobile` (EXPERIENCE.md Responsive) is a third unowned knob: it lives in the CSS keyframes *and* the GSAP timelines, so neither builder reduces it coherently.

**Closure (tighten AD-2).** Declare one gate with one owner: a single `isReducedMotion()` check in `src/lib/motion` feeds the one `gsap.matchMedia()` **and** toggles a `data-reduced` attribute on `<html>`; every CSS keyframe/transition is additionally (and redundantly) shielded by the same global `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`. Explicitly state that a CSS media query for keyframes is *not* a second gate but the keyframe half of the same gate. Pin the mobile 30% reduction as a single amplitude token set read by both the CSS keyframes (via a custom property) and the GSAP timelines.

---

### C3 — Consent: the persistence key/shape is unpinned, and the Vercel dashboard auto-injection trap makes AD-6 silently unfulfillable

**The two units.**

- **Unit A.** Adds the `@vercel/analytics` package and calls `injectAnalytics()` only inside the CookieBanner's Accept handler. Consent stored as `localStorage["glitch-consent"] = "accepted" | "declined"`.
- **Unit B.** Enables **Vercel's dashboard Web Analytics auto-injection** (zero-code script injection on every deployment — this is Vercel's advertised "zero-config" path and satisfies FR-27's "Vercel Web Analytics loads on all pages" trivially), and adds the banner purely as UI whose Accept button sets `localStorage["analytics-consent"] = JSON.stringify({v:1,t:Date.now()})`. The builder reasons the banner "gates analytics" in spirit.

**How they obey every AD.** AD-6: "initializes only after the Visitor explicitly Accepts, persisted client-side" — Unit B *believes* the consent flag blocks tracking; the Deferred section explicitly calls "the exact provider wiring… seed", so the mechanism is declared out of scope of the spine. FR-29 "banner is accessible, dismissible" is satisfied by both. Nothing in AD-6 or the conventions names the key, the value encoding, or forbids dashboard injection.

**The incompatibility.** (1) Dashboard-injected analytics **cannot be consent-gated from app code at all** — the script is outside the bundle — so Unit B's production site reports visits pre-consent, a GDPR/FR-29 violation that no build gate, lint, or axe run catches, and the "consent state and analytics init drift" that AD-6 claims to prevent is actually guaranteed. (2) Even between two package-based builders, key/shape differ (`glitch-consent` vs `analytics-consent`, string vs JSON blob), so any future reader (a second builder, an audit, or a shared helper) cannot assume the shape. (3) No owner is named for the banner's re-ask policy ("Decline" persist-forever vs re-prompt) despite EXPERIENCE.md promising "dismissed state persists".

**Closure (tighten AD-6).** Pin: analytics **must** be injected from app code via the `@vercel/analytics` package gated by consent — Vercel dashboard auto-injection is explicitly forbidden, with a launch-checklist/build-check item; the consent key is exactly `glitch-guy0:consent` with values `"accepted" | "declined"` (strings, no TTL in v1); CookieBanner is the single reader/writer (matching AD-6's "single surface"); Decline persists indefinitely.

---

## HIGH

### H1 — AD-1 is self-contradictory: "mapped 1:1 from DESIGN.md's token block" vs "light mode inverts… it does not add colors"

**The two units.**

- **Unit A.** Builds one token name set. Dark values on `:root`, light mode re-binds the **same** variables under `[data-theme="light"]` (`--color-surface-base: #F4F2EE`, `--color-ink-secondary: #404040`, …). Zero `-light` token names exist. Components use `bg-surface-raised`, `text-ink-secondary` in both modes.
- **Unit B.** Follows "mapped 1:1 from DESIGN.md's token block" literally: creates `--color-surface-base-light`, `--color-ink-secondary-light`, `--color-border-hairline-light`, … (eight extra tokens) for every value in the DESIGN.md frontmatter, because DESIGN.md *defines them as distinct named tokens*, and `#404040`/`#F4F2EE`/`#DCD8D0` are not inversions of the dark values anyway (warm paper is a new hue; `ink-secondary-light #404040` is not `#FFFFFF − #9C9C9C`).

**How they obey every AD.** AD-1's rule is two sentences that mandate both behaviors: components must contain "zero raw design literals — only token utilities" (both satisfy) and the token layer must be "mapped 1:1 from DESIGN.md's token block" (B) *and* "light mode inverts the ink/surface roles, it does not add colors" (A). A builder cannot satisfy both readings at once — the AD is broken, and its binder (DESIGN.md) pins the `-light` tokens as real tokens.

**The incompatibility.** Every component built under Unit A's assumption (`bg-surface-raised` = raised in light mode) renders dark-on-dark or wrong-hue in Unit B's site, where `bg-surface-raised` is still `#111111` unless the component remembers to apply the `-light` variant. The light mode that AD-1 guarantees is structurally broken for whichever builder chose the other token-reading. No merge is possible without re-tokenizing every component.

**Closure (tighten AD-1).** Delete "it does not add colors" or the "1:1" clause; instead pin the mechanism: **one** token name set (the dark-mode role names), light mode = re-bound values of those same variables under `[data-theme="light"]`, and DESIGN.md's `-light` frontmatter values are defined to be the light-mode *values* for those roles — not token names. Add a test-style invariant: `--color-surface-base` resolves differently under the two theme attributes, and no token name contains the substring `-light`.

---

### H2 — The seven section anchors have no id scheme, so FR-1's smooth scroll and back-button consequence diverge

**The two units.**

- **Unit A.** Semantic kebab ids: `<section id="hero" id="services" id="projects" id="about" id="skills" id="experience" id="contact">`; nav uses native `<a href="#services">`, Lenis `lenis.scrollTo` handles the motion, URL hash updates so the back button works; hero reachable via `#top`.
- **Unit B.** Ids mirror the DESIGN.md section numbers that "map 1:1 to nav order": `<section id="001" id="002" … id="007">`; nav links use `href="#002"`, and scroll uses `history.pushState` + `scrollIntoView` inside a Lenis tick so the hash isn't polluted.

**How they obey every AD.** FR-1 (bound into AD-5/FR-1's anchor consequence) requires only "smooth-scrolls to its anchor without reload" and "anchor jumps work with the browser back button" — both schemes satisfy both consequences in isolation. AD-2 requires Lenis + ScrollTrigger wiring, nothing about ids. The section number (DESIGN.md "maps 1:1 to nav order") is a *visual* contract that Unit B reads as the anchor contract.

**The incompatibility.** Any nav link written against `#services` is a dead no-op on a page whose section is `id="002"` (silent native jump failure — the exact "dead link drops trust" failure in UJ-2), and conversely. Back-button behavior also diverges: with native anchors the hash round-trips through the browser; with `history.pushState` the ScrollTrigger offsets (fixed header, section gaps) must be recomputed on hashchange or the scroll lands under the fixed header. Nothing pins whether the URL hash is part of the contract at all.

**Closure (new AD-9 "Section anchors are one contract").** Pin: semantic kebab ids (`#hero`, `#services`, `#projects`, `#about`, `#skills`, `#experience`, `#contact`, `#top`); nav links are native `<a href="#id">` for the no-JS path (EXPERIENCE.md's "anchors still jump natively"); Lenis intercepts clicks; the URL hash is always updated on scroll-driven navigation; `ScrollTrigger.refresh()` and header-offset compensation run after `hashchange`; the section-number `001…007` is a *label* token, never an id.

---

### H3 — EmailOctopus payload shape and the "contacts metric" mechanism are both unpinned, and AD-7 forbids the storage the metric implies

**The two units.**

- **Unit A.** `lib/contact` calls `POST /contacts` with `{ email_address: body.email, fields: { Name: body.name }, status: "SUBSCRIBED", tags: ["portfolio"] }`. The "contacts metric" (FR-24/FR-28) is measured as the **EmailOctopus list member count** — the only free-tier observability that exists — and "viewed in the analytics view" means the EmailOctopus dashboard.
- **Unit B.** Uses `status: "PENDING"` (double opt-in so the inbox stays clean) and measures the metric by `console.log("contact-accepted", email)` per valid submission, summed in Vercel Logs, because AD-7 forbids any database/server-side state and Vercel Web Analytics has **no custom-event API** — so a metric "displayed in the analytics view" (FR-28) has nowhere to live in Web Analytics.

**How they obey every AD.** AD-3 requires `create-contact` with explicit success/error and "the contacts metric counts valid submissions only" — both measure only valid submissions by their own definition. AD-7 forbids DB/auth/state, which *both* obey (logs are not a database; EO dashboard is external). Neither the EO field-mapping, the `status` value, nor the metric's storage/display home is named anywhere in AD-3, AD-7, or the conventions.

**The incompatibility.** A's metric (EO list count) and B's metric (log events) disagree systematically: PENDING vs SUBSCRIBED changes whether a submission counts toward the list; hard-bounces inflate/deflate each differently. SM-1 ("submissions arrive and increment the contacts metric") becomes non-reproducible across the two builds — the Builder cannot tell whether the funnel works. And A's `PENDING`/`SUBSCRIBED` choice silently changes deliverability and list hygiene.

**Closure (tighten AD-3).** Pin the EO request shape: `fields: { Name }`, `status: "SUBSCRIBED"` (the funnel's acceptance test requires no opt-in step), tag `portfolio`; pin the contacts metric = EmailOctopus list member count (a built input, no storage layer), and rewrite FR-28's "displayed in the analytics view" claim to "visible in the EmailOctopus dashboard" so the spine stops implying a Vercel Web Analytics metric that cannot exist on the free tier.

---

### H4 — MotionProvider is simultaneously a client island (AD-5) and a lib leaf that "never depends on components" (AD-2 + structural seed + graph)

**The two units.**

- **Unit A.** Follows AD-5's island list literally: `MotionProvider` lives in `src/components/motion/MotionProvider.island.tsx` with `"use client"`, and `src/lib/motion/` holds pure engine code (ticker setup, timeline factories, the reduced-motion flag).
- **Unit B.** Follows the structural seed ("`lib/motion` — GSAP+Lenis provider") and AD-2 ("All motion goes through `src/lib/motion`"): `MotionProvider` is a React component rendered from `src/lib/motion/MotionProvider.tsx`.

**How they obey every AD.** AD-5 mandates `"use client"` on MotionProvider and that islands never import server components — both satisfy. AD-2 mandates the provider live conceptually in `lib/motion` — B satisfies, A relocates the React wrapper. The mermaid graph draws `motion --> none` and the prose says leaves "never depend on components" — B's `src/lib/motion` now imports React and returns JSX, making the `lib` layer depend on component/framework code, i.e., it points inward across its own layer, contradicting the graph; A violates the letter of the structural seed but honors the graph.

**The incompatibility.** B's lib/motion can no longer be imported by the route or any server-only context without dragging React in, and any future server import of a "motion" util breaks server/client boundaries (an AD-5 violation B can't see). A's version splits the engine across two homes so the "one reduced-motion gate" has no single file — C2's closure becomes unbuildable. The spine cannot say where the provider lives.

**Closure (tighten AD-5 / structural seed).** Split explicitly: `src/lib/motion/` = pure engine (GSAP/Lenis setup, timeline factories, `isReducedMotion()`, no React imports); `src/components/motion/MotionProvider.island.tsx` = the `"use client"` island that mounts the engine. State that the *engine* home is lib and the *island* home is components, and amend the graph edge to `islandMotion["MotionProvider.island"] --> motion["lib/motion engine"]`.

---

### H5 — AD-4 names two conflicting content sources for the same entity, and form/nav microcopy has no owner

**The two units.**

- **Unit A.** Sources Services from PRD FR-6's approved three-offer set (AI Feature Build 1–4wk / AI Chat Platform 4–8wk / Backend Stabilization 1–3wk), because the PRD is the bound source of "PRD-approved sets (offers…)" and FR-6 is dated and explicit.
- **Unit B.** Sources Services from `resume.md` §8 (seven services: AI feature builds, AI chat platforms, Backend API design, Database migrations, Auth, Legacy stabilization, Cloud deployment), because AD-4's rule says content is "derived from resume.md **and** the PRD-approved sets" and resume.md is the named content reference.

**The incompatibility.** The two sources disagree structurally (three packaged offers with timelines vs seven un-timed service bullets). Unit A's site shows 3 offer cards; Unit B's shows 7. Both cite AD-4. This is not a style drift — it is a different Services section (FR-6's testable "exactly three Offers" fails under B), produced by following the AD's own sourcing rule.

**Second divergence in the same AD.** "Every visible string traces to `src/content/` (or DESIGN.md copy for static labels)" — but the Contact Form's microcopy is specified in EXPERIENCE.md (`SUBMITTING…`, `VALIDATING…`, `Message sent. I'll reply within a day.`) and AD-4's binds list ("every section") does not include island microcopy. Unit A puts all form copy + nav labels + section titles in `content`; Unit B hardcodes form copy as island literals and treats nav/section titles as DESIGN.md static labels. Result: the same visible string (`SUBMITTING…`, `SERVICES`, the success line) exists in two places depending on builder, and the resume PDF (generated from content) and the page can drift again — the exact failure AD-4 exists to prevent. Additionally, the public contact email (header/footer/`mailto:` fallback) has two owners: the `CONTACT_EMAIL` env var (convention table) vs the content module (AD-4) — neither with a `NEXT_PUBLIC_` prefix decision for client islands to read it.

**Closure (tighten AD-4).** Declare precedence: PRD-approved sets are canonical for Services/Projects/Experience; `resume.md` is the reference for Hero/About/Experience copy only (resume.md §8 is not a source for the Services section — delete it from the derivation list). Extend AD-4 to *all islands*: every visible string including form microcopy, validation messages, success/error copy, nav labels, and section titles lives in `src/content/`; kill the "DESIGN.md static labels" carve-out or scope it to `aria-label` on icon-only links. Pin the email: `CONTACT_EMAIL` is `NEXT_PUBLIC_CONTACT_EMAIL`, read only by a single `src/content/site.ts` exporter that also feeds the `mailto:` links.

---

## MEDIUM

### M1 — Resume PDF: the cache-bust contract and generation mechanism are unpinned

FR-25 requires a cache-busting `?v=`. Unit A ships `resume.pdf?v=1` as a literal in content; Unit B ships `resume.pdf?v=<contentHash or buildId>` computed at build. A's "cache-bust" never busts — the URL is byte-identical across deploys, so CDN/browser caches serve a stale PDF forever, defeating FR-25's stated purpose. Second axis: Unit A generates the PDF in a prebuild script into `public/` (obeying "generated from src/content at build"); Unit B commits a checked-in `public/resume.pdf` derived once from resume.md (the PDF and content now have two owners and can drift — the AD-4 failure). Closure: pin the href as a single export `resumeHref = "/resume.pdf?v=" + contentHash` computed from the generated artifact, referenced by Header/Footer/Contact alike; generation is a prebuild script, never a committed artifact.

### M2 — "No placeholder content at launch" (FR-13) has no enforcement mechanism

The spine defers the link-check script but never gates placeholders. Unit A adds a build-time grep for placeholder markers (`lorem`, `TBD`, `TODO:`, `example.com`, `PLACEHOLDER`) that fails the build; Unit B relies on manual pre-launch review (and ships a placeholder SDK visual if the build input is missing, since "no placeholders" isn't a build gate). Both obey AD-4 (content single-sourced) and the deferred-section's framing. Closure: new AD — a build gate rejects placeholder markers in `src/content/`, and the lead-project visual (SDK) being missing or a generated placeholder hard-fails the build.

### M3 — Font loading mechanism is unowned

DESIGN.md says "Self-hosted Google Fonts, subset + preloaded" and marks the type ramp `[ASSUMPTION]`; the seed pins `layout.tsx # fonts (next/font)`. Unit A uses `next/font/google` (build-time self-hosting, `variable: '--font-space-grotesk'`, `subset: 'latin'`, default `preload`); Unit B uses `next/font/local` with downloaded woff2 files. Both are "self-hosted via next/font" and both obey AD-1's "fonts as roles" — but the CSS variable names and Tailwind v4 `@theme` mapping (`--font-display: var(--font-space-grotesk)` vs `--font-display: var(--font-display-local)`) differ, so token utilities break across builds, and preload coverage (all three families) affects Lighthouse ≥ 90. Closure: pin `next/font/google` for all three, the exact variable names (`--font-display`, `--font-mono`, `--font-body`), `subsets: ['latin']`, and preload all three families.

### M4 — The mermaid graph's edge semantics are ambiguous (illustrative vs exhaustive), and the drawn edges forbid the schema sharing C1 needs

The prose rule is "dependency direction" (no inward-pointing across a layer), but the graph draws specific edges and labels leaves `tokens → none`, `motion → none`, `env → none`. Unit A reads the graph as authoritative → `islands` may only touch `content/tokens/motion`, so the ContactForm island cannot import `lib/contact/schema.ts` → duplicated validation (C1's drift). Unit B reads it as illustrative → adds `islands → lib/contact` freely. Closure: add one line — the graph is the minimal set of *permitted* cross-layer edges and is extensible outward; explicitly allow `islands → lib/contact` for the shared schema (C1) while keeping `env` server-only.

### M5 — AD-1's "visual values" list omits motion/time domains, so durations, easing, amplitudes, and opacities have no token home

AD-1 enumerates "colors, type roles, spacing, radii, breakpoints" — not durations, easing curves, glitch amplitudes (px), scanline opacity (3–6%), or focus-ring widths. Unit A hardcodes `100ms`/`150ms`/`400ms` in `lib/motion` factories; Unit B declares `--duration-glitch: 400ms` etc. in `@theme`. Both obey AD-1 (the listed domains are tokenized) and AD-2 (motion centralized). The `~30% mobile reduction` (EXPERIENCE.md) then has two owners (see C2). Closure: amend AD-1's list to "including but not limited to" and add durations, easing, amplitudes, and opacities as `@theme` tokens with single owners.

---

## Consolidated closure list (what to change)

| # | Tier | Artifact | Change |
| --- | --- | --- | --- |
| C1 | CRITICAL | AD-3 + conventions + graph | Pin wire shape (honeypot member), status↔envelope table, single shared zod schema, client judges by `body.ok`; allow `islands → lib/contact` |
| C2 | CRITICAL | AD-2 | One gate, two halves: global CSS reduce rule for keyframes **and** `gsap.matchMedia` in `lib/motion`, plus `data-reduced` hook; pin mobile 30% amplitude token |
| C3 | CRITICAL | AD-6 | App-code injection only (dashboard auto-injection forbidden); pin consent key/value/no-TTL; CookieBanner sole reader/writer; Decline persists |
| H1 | HIGH | AD-1 | One token name set; light mode = re-bound values under `[data-theme="light"]`; no `-light` token names; DESIGN.md `-light` values are the light-mode values |
| H2 | HIGH | new AD-9 | Pin `#hero…#contact` ids, native anchors, hash-in-URL, ScrollTrigger refresh + header offset on hashchange |
| H3 | HIGH | AD-3/AD-7 | Pin EO payload (`fields:{Name}`, `status:"SUBSCRIBED"`, tag), metric = EO list count; drop "in analytics view" wording |
| H4 | HIGH | AD-5 + seed | Split lib/motion engine (no React) from `components/motion/MotionProvider.island.tsx` |
| H5 | HIGH | AD-4 | Precedence (PRD sets canonical; resume.md not a Services source); all island/visible strings → content; `NEXT_PUBLIC_CONTACT_EMAIL` single exporter |
| M1 | MEDIUM | FR-25/AD-4 | `resumeHref = "/resume.pdf?v=<contentHash>"` single export; prebuild generation, no committed artifact |
| M2 | MEDIUM | FR-13 | Build gate on placeholder markers; missing lead visual fails build |
| M3 | MEDIUM | AD-1 + seed | Pin `next/font/google`, variable names, `latin` subset, preload all three |
| M4 | MEDIUM | graph | Declare edges minimal-and-extensible; allow islands → lib/contact schema |
| M5 | MEDIUM | AD-1 | Add durations/easing/amplitudes/opacities to the token list |
