# Epic 3 Context: Contact Flow

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give visitors a flawless three-field contact form that converts interest into a qualified lead, and give the Builder a reliable pipeline that delivers every valid submission to EmailOctopus without ever silently losing one. This is the funnel's payoff: Visit → Trust → Capability → Contact closes here, so the flow must never fail invisibly, must keep spam out without adding friction (no captcha), and must feed a countable contacts metric the Builder can check.

## Stories

- Story 3.1: Shared validation schema and wire contract
- Story 3.2: Contact API route
- Story 3.3: Contact form island
- Story 3.4: Contacts metric and spam verification

## Requirements & Constraints

- The form has exactly three fields: Name, Email, Message. Client-side validation gives clear, accessible (screen-reader) inline errors; invalid email blocks send.
- A valid submission must reach the Builder's inbox via EmailOctopus (free tier); the API key must never be exposed to the client.
- On success, the Visitor sees an inline confirmation in the form's place — no redirect, no silent success.
- On failure, the Visitor sees a visible error, their input is preserved, and they can retry without a page reload.
- Spam protection is a honeypot plus basic server-side checks — no captcha. Automated/honeypot submissions must not reach the inbox or affect legitimate ones.
- Each valid submission must increment a contacts metric (the EmailOctopus list member count) by exactly one; the Builder must be able to view it.
- Data collected is limited to the three contact fields; it flows only to EmailOctopus (no other third party).
- With JavaScript disabled, the form must still offer a working fallback (a `mailto:` link) — the flow degrades gracefully rather than breaking.
- Errors must never be swallowed: any failure in the flow must surface to the Visitor.

## Technical Decisions

- Wire contract is pinned once: payload `{ name, email, message }`, response envelope `{ ok: boolean, error?: string }`. A single shared zod schema (`src/lib/contact/schema.ts`) is the only source of field rules, used for both client-side matching and server-side re-validation — client and server can never drift.
- Flow: client validates → `POST /api/contact` → server re-validates with the same shared schema → checks a hidden honeypot field named `website` (if filled, respond `{ ok: true }` with no delivery — treat as a bot, don't reveal detection) → call EmailOctopus API v2 `create-contact` with `status: "SUBSCRIBED"` and a source tag (so the Builder can filter) → return `{ ok: true }` on success, or `{ ok: false, error }` with a non-2xx status on any failure (never a silent 200).
- The client must decide outcome from `body.ok`, never from HTTP status alone.
- `src/app/api/contact/route.ts` is the only module allowed to read `EMAIL_OCTOPUS_API_KEY` / `EMAIL_OCTOPUS_LIST_ID` — server-only env vars, no `NEXT_PUBLIC_*` secrets, nothing reaches the client bundle.
- The contacts metric is not a separate counter — it is the EmailOctopus list member count itself; each valid submission creates exactly one list member.
- The ContactForm is a client-side "island" (`"use client"`) mounted inside an otherwise server-rendered section; islands may import the shared schema but never the EmailOctopus service or env access directly — only the API route talks to EmailOctopus.
- `CONTACT_EMAIL` is read server-side and rendered into `mailto:` links (header/footer, and the no-JS fallback) — never hardcoded per component.
- Use API v2 for EmailOctopus (v1.6 is legacy, not for new work).

## UX & Interaction Patterns

- Field style: underline field with a floating mono label; validates on blur and on submit.
- Errors: inline mono message plus a white underline; the field keeps focus; the message is injected into an `aria-live` region so it's announced.
- Focus state: 2px white underline + glow.
- Submitting state: button label swaps to `SUBMITTING…`, button disabled, and — importantly — the button is never glitched while in flight or otherwise (the contact form is explicitly excluded from glitch effects, same as body text).
- Success state: the form container is replaced inline by a confirmation block — "Message sent. I'll reply within a day." plus a copy-to-clipboard button for the email — no navigation away from the page.
- Failure state: an error block replaces the form, preserves the visitor's previously entered values, and offers a retry button that resubmits without a reload.
- Keyboard/tab order follows the funnel order; `Enter`/`Space` activates the submit button.
- Terminal/glitch voice is intentionally excluded from the form itself — the form must read as reliable, not stylized.

## Cross-Story Dependencies

- Story 3.1 (shared schema) is a prerequisite for both 3.2 (server route) and 3.3 (client form) — both consume the same `src/lib/contact/schema.ts` and must not implement independent validation.
- Story 3.2 (API route) is a prerequisite for 3.3 (form calls it) and 3.4 (metric/spam verification is validated against the live route).
- Story 3.4 depends on the honeypot behavior defined in 3.2 and the metric semantics (list member count) — its end-to-end test exercises 3.1–3.3 together.
- Epic 5 (Analytics & Consent) depends on the contacts metric produced here (FR-24/FR-28) being visible for the Builder's analytics view.
