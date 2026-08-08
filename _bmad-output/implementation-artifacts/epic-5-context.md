# Epic 5 Context: Analytics & Consent

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give the Builder visibility into funnel performance — visits, engagement, and contact conversions — without adding tracking the visitor hasn't agreed to. v1 measures the funnel with exactly two signals (Vercel Web Analytics for engagement, the EmailOctopus list count for contacts) and gates the analytics signal behind an explicit, accessible consent choice, so the site stays free-tier, privacy-respecting, and legally sound while still closing the loop on whether the Visit → Trust → Capability → Contact funnel is working.

## Stories

- Story 5.1: Cookie consent banner
- Story 5.2: Analytics app-code injection
- Story 5.3: Contacts metric measurement

## Requirements & Constraints

- Vercel Web Analytics must load on every page of the Portfolio and report visits/engagement, but only in production — no analytics of any kind runs in preview/dev environments.
- No third-party analytics or tracking script beyond Vercel Web Analytics may be added without a separate decision; the only other funnel signal is the EmailOctopus contacts count.
- Analytics must not initialize until the visitor explicitly consents (Accept); declining or ignoring the banner keeps analytics off.
- The contacts metric (valid form submissions) must increment on each valid submission and be viewable by the Builder alongside engagement data, with no additional paid tooling introduced.
- Consent banner must be accessible (keyboard operable, `Esc` dismisses), non-obstructing (never blocks the Contact Flow), dismissible, and its choice must persist across visits.
- Interactive controls (including cookie-banner buttons) must have touch targets ≥ 44×44px.
- Privacy guardrail: only the three contact fields (name, email, message) are collected; data flows to EmailOctopus only. No other tracking beyond the consent-gated analytics.
- Cost guardrail: free tiers only (Vercel, EmailOctopus) — no paid dependency may be introduced for this epic.

## Technical Decisions

- **Consent-gated analytics, single surface (AD-6):** Vercel Web Analytics is cookieless (day-scoped request hash) — the consent gate is a conservative privacy posture, not a technical cookie requirement. Analytics initializes only after the visitor explicitly Accepts.
- **Persistence key:** consent choice is stored client-side under the single key `glitch-guy0:consent` with value `"accepted" | "declined"`. The CookieBanner component is the sole owner/writer of this key — no other code should read or set it directly.
- **Injection method:** Analytics must be injected via app code — `<Analytics />` from `@vercel/analytics`, mounted behind the consent state. Dashboard-level automatic injection in Vercel is explicitly forbidden because it cannot be consent-gated.
- **Production-only:** no analytics code path may run outside the production environment.
- **Contacts metric source:** the metric is simply the EmailOctopus list member count (no custom on-site analytics dashboard is in scope for v1); it increments naturally as valid submissions are delivered to EmailOctopus.
- **Architecture placement:** CookieBanner is a client-side "island" (`"use client"`) per the site's island architecture — the page is otherwise server-rendered and static, with no runtime data fetching. Client islands don't import server components; islands may reference shared content/tokens.
- **Home in the codebase:** the CookieBanner island's home was defined in the architecture as `cookie-banner/` under the islands directory.
- **Deployment:** one Vercel project; env vars configured per environment (production gets real values, preview gets test/none); confirm Web Analytics is production-only as part of the deployment/launch checklist.

## UX & Interaction Patterns

- Cookie banner appears as a cold-load overlay: single line of copy with Accept / Decline actions.
- Banner must never obstruct the Contact Flow and must not stack with any other modal (no modal stack deeper than this single banner is allowed anywhere on the site).
- `Esc` dismisses the banner; keyboard `Tab` order and visible focus rings apply to its controls same as the rest of the page.
- Once dismissed (Accept or Decline), the choice persists — the banner does not reappear on subsequent visits.
- Voice/tone for any banner copy should stay plain and direct, consistent with the rest of the site (no corporate/marketing filler).

## Cross-Story Dependencies

- Story 5.2 (analytics injection) depends on Story 5.1 (consent banner) existing first, since analytics must mount behind the consent state the banner establishes.
- Story 5.3 (contacts metric) depends on the Contact Flow (Epic covering `POST /api/contact` → EmailOctopus) already delivering valid submissions to EmailOctopus — the metric is just the resulting list count, not new instrumentation.
- Story 5.3's "viewable by the Builder" pairs with Story 5.2's engagement data so both signals are checked from one place (the Vercel dashboard + EmailOctopus list).
