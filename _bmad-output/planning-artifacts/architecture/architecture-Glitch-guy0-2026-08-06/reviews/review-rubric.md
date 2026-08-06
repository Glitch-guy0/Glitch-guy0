# Architecture Spine Review — Glitch-guy0

- **Reviewed:** `ARCHITECTURE-SPINE.md` (2026-08-06, 184 lines, draft)
- **Altitude:** feature (island architecture, single-page Next.js portfolio)
- **Reviewer basis:** good-spine rubric (7 checks), PRD `prd-Glitch-guy0-2026-08-06`, `tech-stack.md`, `.env.example`, source tree, live web verification (Vercel analytics docs 2026-07-15, Next.js 16.3, EmailOctopus API docs), mermaid render validation via `mmdc`.
- **Date:** 2026-08-06

## Verdict

**Good spine overall — 7 enforceable ADs, deployment/environments and operations envelope covered, valid frontmatter and mermaid — but one CRITICAL false premise about Vercel Web Analytics ("uses cookies") drives an entire AD and island and is actively deferred instead of verified, plus a HIGH gap in the contact flow's closure guarantee (EmailOctopus double opt-in / contact status), and two silent or stale items (page metadata dimension, EmailOctopus API version label).** Fix the premise and re-base AD-6 before handoff; everything else is finalize-time.

---

## Checklist results

| # | Check | Result |
| --- | --- | --- |
| 1 | Fixes real divergence points, misses none | **Mostly passes.** 7 ADs cover tokens, motion, contact, copy, server/client boundary, analytics, static-first. **Missed:** page metadata/SEO surface (title, description, OG, canonical, favicon) is wholly silent. See HIGH-3. |
| 2 | Every AD's Rule enforceable and prevents its stated divergence | **Passes with one wrinkle.** AD-1..AD-7 rules are concrete and checkable. Wrinkle: AD-4 rule says "no JSX string literals for content" but the Consistency Conventions relax it to "or DESIGN.md copy for static labels" — two builders can classify the same string differently. See LOW-2. |
| 3 | Nothing under Deferred lets two units diverge | **Fails on one item.** Deferred "Vercel Web Analytics cookie semantics — PRD decision is binding; wiring is seed" defers a *verifiable fact*, not a seed choice, and hides the false premise. See CRITICAL-1. |
| 4 | Named tech verified-current | **Fails on two.** (a) Vercel Web Analytics is documented as **cookieless** — the spine/PRD claim it "uses cookies." (b) EmailOctopus API is **v1.6** (v2 since Oct 2024), not "v1.0". Next.js 15/16 ✓ (16.3 current), Tailwind v4 ✓, GSAP 3.12+ ✓, Lenis 1.x/`lenis/react` ✓ (correct — retired `@studio-freight/react-lenis`), zod/axe-core ✓. |
| 5 | Every owned dimension decided/deferred/open; operational envelope covered | **Passes.** Deployment & environments (one Vercel project, main→prod, PR→preview, per-env vars, prod-only analytics, domain as `[ASSUMPTION]`), infra/provider (Vercel + EmailOctopus free tiers), operations (console + Vercel logs, no extra tooling, contacts metric) are all decided or flagged. **Silent dimension:** page metadata/SEO (see HIGH-3). |
| 6 | Frontmatter and mermaid valid; no placeholders | **Passes.** Frontmatter fully populated (companions explicitly `[]`, no FILLs). Mermaid block rendered cleanly via `mmdc` with Chrome — valid. `[ASSUMPTION]` markers are intentional, not template leftovers. |
| 7 | Dependency graph consistent with ADs and source tree | **Mostly passes.** Directions match AD-3/AD-4/AD-5 (route→service→env; sections→content/tokens; islands→motion; content→types). **Inaccuracy:** graph top node is `page.tsx (server)` but Header/MotionProvider islands mount in `layout.tsx` per the seed (line 139); `ui/` primitives are absent. See MEDIUM-2. |

---

## Findings

### CRITICAL-1 — Vercel Web Analytics "uses cookies" premise is false; AD-6 and the CookieBanner island are built on it

**What's wrong.** AD-6's rationale, the Consistency Conventions ("consent state persisted client-side"), and the Deferred entry ("Vercel Web Analytics cookie semantics — PRD decision (cookies → consent) is binding; the exact provider wiring is seed") all rest on the claim that Vercel Web Analytics uses cookies. Vercel's current documentation (verified 2026-07-15) states the opposite: Web Analytics stores **no cookies**, collects **no PII**, and identifies visitors by a hash of the incoming request that resets every 24 hours; Speed Insights is likewise cookieless. This is a fact, not a "provider wiring" seed choice — the Deferred section defers exactly the verification that would have caught it.

**Why it matters.** The consent banner is one of only four client islands and a full build unit, justified by a false statement about the named platform. The builder will either (a) implement a cookie-consent banner ePrivacy Article 5(3) does not require, or (b) discover Vercel's docs mid-build and diverge from the spine's asserted rationale — exactly the drift the spine exists to prevent. It also misstates the platform to the PRD level, where the "confirmed 2026-08-06" decision originated.

**Suggested fix.** Before handoff: correct the premise. Re-base AD-6 as a *conservative privacy choice*, not a cookie mandate — Vercel analytics is cookieless but still loads client-side and processes request-derived hashes (arguably personal data under some GDPR readings), so gating initialization behind Accept is a defensible, stricter posture; keep the banner, relabel its justification, and add a one-line privacy note. Replace the Deferred entry with the verified fact. If the Builder wants strict minimum scope, the banner could be dropped and analytics loaded with a `beforeSend` redaction hook — but that is a PRD-level decision (FR-29) to re-confirm, and the spine should flag it as an open question rather than silently re-decide it.

---

### HIGH-1 — AD-3 does not pin EmailOctopus contact `status`; double opt-in can silently swallow the funnel payoff

**What's wrong.** AD-3's closed loop guarantees a valid submission "reaches the Builder's inbox" and "never fails silently," but it never rules the contact's `status` parameter. EmailOctopus's `create-contact` defaults new contacts to `PENDING` on lists with double opt-in enabled — and with `PENDING`, the account's "new subscriber" notification (the thing that actually gets the submission in front of the Builder) typically does **not** fire until the contact confirms. The visitor sees a success state; the Builder's inbox stays silent. That is precisely the silent-loss vector AD-3 exists to prevent.

**Why it matters.** The contact flow is the single payoff of the funnel (SM-1) and the PRD's reliability NFR ("Contact Flow is the one thing that must never be silently broken"). The spine leaves the deciding knob to the list's build-input config, so two builders can close the loop differently — one with a working notification path, one without.

**Suggested fix.** Add to AD-3's Rule: the `create-contact` call passes `status: "SUBSCRIBED"` explicitly (a documented API param) so double opt-in on the list cannot trap submissions in `PENDING`; list double-opt-in config is treated as a build input with the status param as the invariant. Optionally note a deliberate decision if the Builder *wants* confirmed-only contacts — that is a PRD-level choice that must not be left to chance.

---

### HIGH-2 — Silent dimension: page metadata / SEO surface is undecided

**What's wrong.** No AD, rule, convention, or seed entry governs the `<head>` metadata surface: document `title`, meta description, OpenGraph/Twitter cards, canonical URL, favicon, robots, `theme-color`. The spine rules content (AD-4), tokens (AD-1), motion (AD-2), and layout shell (`fonts (next/font)`) but is silent on who owns the metadata a single-page portfolio shares via every link.

**Why it matters.** This is a dimension the feature altitude owns, and it is wholly silent — the explicit checklist-5 trigger. Two builders will diverge (one adds OG tags + canonical in `layout.tsx`; another ships a bare `<title>`), and for a site that *is* the demo, the shared-link preview is part of the proof. The site is also a personal brand surface; title/OG copy is content and should trace to `src/content/` under AD-4.

**Suggested fix.** Add a decision (extend AD-4's bind, or a short AD) that `layout.tsx` owns `metadata` (title, description, OG/Twitter, canonical = `[ASSUMPTION]`-domained URL) and that metadata copy is sourced from `src/content/` like all other copy. Decide favicon/theme-color in the same rule or defer them explicitly with an `[ASSUMPTION]` marker.

---

### MEDIUM-1 — EmailOctopus API version mislabeled ("v1.0"; current public API is 1.6, v2 available since Oct 2024)

**What's wrong.** Stack table: `EmailOctopus | API v1.0`. The current documented public API is **v1.6** (`POST /api/1.6/lists/{listId}/contacts`), and v2 has existed since 2024-10-07. The `create-contact` endpoint reference in AD-3 is correct, so the build is not broken — but the named version pin is stale.

**Why it matters.** Checklist-4 explicitly demands verified-current named tech; a wrong pin erodes trust in the table and invites the builder to hit a `/api/1.0/` path or copy stale examples.

**Suggested fix.** Update the row to `EmailOctopus | API v1.6 (create-contact)`, noting v2 exists but the public docs still expose the v1.6 endpoint set; the code owns the exact path once it exists.

---

### MEDIUM-2 — Dependency graph does not match the seed's mount points and omits `ui/`

**What's wrong.** The graph's top node is `page.tsx (server)`, but the seed (Structural Seed, `layout.tsx` line) mounts MotionProvider and the Header island in `layout.tsx` — so the real hierarchy is `layout + page → islands`, and the `page → client islands` edge understates where islands live. The `ui/` primitives (Button/Card/Pill) that sections import per the seed are absent from the graph entirely.

**Why it matters.** Checklist-7 asks for graph/AD/source-tree consistency. The inconsistency is cosmetic (no wrong-direction edge; all arrows agree with the ADs), but a builder using the graph as the mental model will attribute island mounting to the wrong server module and won't see where `ui/` fits the dependency direction.

**Suggested fix.** Retitle the top node `layout + page (server)` and add edges `layout → islands` and `sections → ui`, `ui → tokens` (or fold `ui` into the sections label with a comment). The `none[ ]` empty-node idiom for leaves is valid but renders a stray empty box; consider `tokens ---| |none` or simply annotating leaves in text instead.

---

### LOW-1 — Lighthouse budget: PRD says "budget finalized in architecture"; the spine only restates ≥ 90

**What's wrong.** PRD §8 says the performance target is "Lighthouse ≥ 90 mobile (budget finalized in architecture)." The spine's map (AD-5/AD-7) and conventions carry the ≥ 90 number but add no finalization — no LCP/CLS/JS-bundle budget, no page-weight ceiling.

**Why it matters.** The one delegated budget task from the PRD is not actually finalized; at feature altitude this is minor (the island architecture + baked content plausibly meet it), but it leaves the number unowned.

**Suggested fix.** Add a short Performance row to Consistency Conventions or Stack: `LCP ≤ 2.5s on 3G mid-tier, client JS ≤ ~100 KB gz, Lighthouse ≥ 90 mobile` — or explicitly defer the finer budget to the code, in the spine, rather than leaving the PRD's delegation unacknowledged.

---

### LOW-2 — AD-4 rule vs. Consistency Conventions tension on "static labels"

**What's wrong.** AD-4's Rule: "no JSX string literals for content." The Consistency Conventions row: "Every visible string traces to `src/content/` (**or DESIGN.md copy for static labels**)." The carve-out lets two builders classify the same string differently — a button label or aria-label is a "static label" for one and "content" for the other.

**Why it matters.** Checklist-2's enforceability: a rule with an ambiguity is a rule two units can diverge on. Low impact (visual strings, not copy drift), but cheap to close.

**Suggested fix.** Make the carve-out mechanical: static microcopy (button labels, error strings, aria-labels) is enumerated in one `content/microcopy.ts` module rather than "whatever's in DESIGN.md," or remove the carve-out and single-source all visible strings under AD-4.

---

### LOW-3 — Font delivery mechanism not ruled

**What's wrong.** tech-stack.md locks the families and "self-hosted, subset + preloaded"; the spine's seed comment says only `fonts (next/font)`. `next/font/google` vs `next/font/local` (and which weights) is unruled.

**Why it matters.** Minor — both paths satisfy "self-hosted" and the type roles are AD-1 tokens. Only a naming/sourcing nit.

**Suggested fix.** One line in the seed: fonts via `next/font` (local `woff2` in `src/app/fonts/` or google at scaffold), subsets + preload as documented — a seed choice, made explicit.

---

## Positive confirmations

- **Operational/environmental envelope is NOT silent** (checklist-5): deployment & environments, infra/provider strategy, and operations/monitoring are all decided or `[ASSUMPTION]`-flagged — one Vercel project, `main`→production / PR→preview, per-environment secrets, production-only analytics, console+Vercel logging, no extra tooling, free-tier-only cost guardrail.
- **Frontmatter and mermaid validated**: the dependency mermaid block was rendered successfully with `mmdc` (no syntax errors); frontmatter is fully populated with no FILLs/placeholders.
- **AD-1/AD-2/AD-5/AD-7 are strong**: token single-sourcing (Tailwind v4 `@theme`), the GSAP+Lenis single-RAF ticker + `gsap.matchMedia()` reduced-motion gate, the server-first island boundary, and static-first/no-DB are concrete, enforceable, and correctly prevent their stated divergences.
- **Lenis/`lenis/react` guidance is current and correct** (avoids the retired `@studio-freight/react-lenis`), and the `autoRaf: false` + `gsap.ticker` integration is the documented pattern.
