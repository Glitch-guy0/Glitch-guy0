---
title: 'Epic 3 — Contact Flow (3.1–3.4 complete)'
type: 'feature'
created: '2026-08-07'
status: 'in-review'
baseline_revision: 'ada19e2b2251e179b5221ca21883d4fdd553928c'
review_loop_iteration: 2
followup_review_recommended: true
context: []
warnings: ['multiple-goals', 'oversized']
---

<intent-contract>

## Intent

**Problem:** The Contact section is a placeholder `<p>` with only a `mailto:` link. Visitors have no in-page way to send a message, and the Builder has no lead pipeline or spam protection.

**Approach:** Implement all Epic 3 stories in dependency order: a shared zod schema pinning the wire contract, then the `/api/contact` route (EmailOctopus v2 + honeypot), then the client `ContactForm` island consuming both, then verify the metric/spam behavior end-to-end.

## Boundaries & Constraints

**Always:**
- `src/lib/contact/schema.ts` exports one zod schema and inferred type; it is the only source of field rules, imported by both the client form and the API route.
- Wire contract: request body `{ name, email, message }`; response `{ ok: boolean, error?: string }`. Client decides outcome from `body.ok`, never from HTTP status alone.
- `src/app/api/contact/route.ts` is the only module that reads `EMAIL_OCTOPUS_API_KEY` / `EMAIL_OCTOPUS_LIST_ID`; use native `fetch` against EmailOctopus API v2 `create-contact`, `status: "SUBSCRIBED"`, with a source tag.
- Honeypot field named `website`: if filled, respond `{ ok: true }` with no delivery — never reveal detection to the client.
- On any server-side failure (validation, honeypot false path excluded, EmailOctopus error), return a non-2xx status and `{ ok: false, error }` — never a silent 200 on real failure.
- `ContactForm` is a `"use client"` island rendered inside the existing server-rendered `#contact` section in `src/app/page.tsx`, replacing only the placeholder `<p>`; the section wrapper, `SectionNumber`, and `data-glitch-burst` heading stay unchanged.
- Client-side inline validation on blur and submit using the shared schema; errors rendered via `FormField`'s `error` prop plus an `aria-live` region announcing the first error on submit.
- Success renders an inline confirmation block in the form's place (no navigation); failure renders an error block, preserves entered field values, and offers a retry that resubmits without a reload.
- Submitting state disables the submit button and swaps its label to `SUBMITTING…`; the form and its controls never receive `data-reveal`, `data-glitch-burst`, or `data-burst-on-load`.
- A no-JS fallback (`mailto:${CONTACT_EMAIL}` link, reusing `src/lib/config.ts`) remains reachable even when the island fails to hydrate.
- Add `EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID` usage only in the route handler; do not add new `NEXT_PUBLIC_*` secrets.

**Block If:**
- EmailOctopus API v2 contract (endpoint shape, auth header, required fields) cannot be determined from `_bmad-output/planning-artifacts/tech-stack.md` or public API conventions already implied by existing planning docs.
- A CAPTCHA or third-party spam service would be required to meet spam protection (out of scope — honeypot + server checks only).

**Never:**
- Add a captcha or third-party spam widget.
- Expose `EMAIL_OCTOPUS_API_KEY` or `EMAIL_OCTOPUS_LIST_ID` to the client bundle or any `"use client"` module.
- Implement independent client/server validation logic — both must import the same schema.
- Add glitch/reveal data attributes to any element inside `ContactForm`.
- Add a separate counter for the contacts metric — the metric is the EmailOctopus list member count itself.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path | Valid name/email/message, honeypot empty | `POST /api/contact` calls EmailOctopus, returns `{ ok: true }`; form shows success block | No error expected |
| Client validation | Invalid email format on blur | Inline error under Email field, `aria-live` region announces it, submit blocked | Field-level error, no request sent |
| Empty required field | Submit with blank Name/Email/Message | Inline errors on each empty field, submit blocked | Field-level errors, no request sent |
| Honeypot triggered | `website` field non-empty | API returns `{ ok: true }`, no EmailOctopus call made | Silently treated as success client-side |
| Server validation failure | Client bypasses JS, malformed payload posted directly | API re-validates with shared schema, returns 400 `{ ok: false, error }` | Non-2xx status, error surfaced |
| EmailOctopus failure | EmailOctopus API errors or times out | API returns 502 `{ ok: false, error }`; form shows error block, preserves input, offers retry | Non-2xx status, no silent success |
| No JS | JavaScript disabled | Static `mailto:` link fallback still renders and is usable | n/a |
| Retry after failure | User clicks retry after a failure | Form resubmits with preserved values, no page reload | Same validation/submit flow re-runs |

</intent-contract>

## Code Map

- `src/lib/contact/schema.ts` — NEW: zod schema (`contactSchema`) + `ContactPayload` type; single source of field rules for name/email/message
- `src/app/api/contact/route.ts` — NEW: POST handler; re-validates with shared schema, honeypot check, EmailOctopus v2 call, wire-contract response
- `src/components/ContactForm.tsx` — NEW: `"use client"` island; controlled fields via `FormField`, honeypot input, validation/submit/success/error state machine
- `src/components/sections/ContactSection.tsx` — NEW: Server Component wrapping `ContactForm` plus the no-JS `mailto:` fallback
- `src/app/page.tsx` — MODIFY: replace the placeholder `<p>` inside the `#contact` section with `<ContactSection />`
- `src/content/types.ts` — MODIFY: add `ContactContent` interface (heading copy, success/error messages, field labels) to `SiteContent`
- `src/content/index.ts` — MODIFY: populate `contact` content block
- `scripts/testing/axe-scan.cjs` — MODIFY: no structural change required (already checks input/label pairing); confirm contact form inputs pass existing checks
- `.env.example` — no change needed (`EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID`, `CONTACT_EMAIL` already present)

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/contact/schema.ts` -- Define zod schema per amended Design Notes: non-empty `name` (min 1, max 200), `email` (min 1, max 320, valid format), non-empty `message` (min 1, max 5000), and an optional honeypot field (0–500 chars, named per Design Notes, not literally `website`) -- AD-3 shared validation, prevents client/server drift
- [x] `src/app/api/contact/route.ts` -- Implement POST handler per amended Design Notes: return 500 immediately if EmailOctopus env vars are unset; parse JSON, validate with shared schema (400 on failure), check the (trimmed) honeypot value (return `{ ok: true }` early if non-empty); call EmailOctopus v2 create-contact with server-only env vars and a source tag; on `MEMBER_EXISTS_WITH_EMAIL_ADDRESS`, follow up with a `PUT` to `contacts/{md5-hex-of-lowercased-email}` to update that contact's fields with the new message before returning `{ ok: true }`; read each response body exactly once; add a 6s timeout to both EmailOctopus calls; parse and log error detail on every failure branch including the final 5xx case, without ever logging the raw response body; return `{ ok: true }` only once the message is actually stored, else `{ ok: false, error }` with non-2xx -- FR-19–FR-23, wire contract
- [x] `src/content/types.ts` -- Add `ContactContent` interface (heading, subhead, field labels, success message, error message, retry label) -- keeps contact copy out of JSX per existing content convention
- [x] `src/content/index.ts` -- Populate `contact` block on `siteContent` -- single source of contact copy
- [x] `src/components/ContactForm.tsx` -- Build client island: controlled Name/Email/Message fields via `FormField`, hidden honeypot input (visually hidden, not `display:none`, `tabIndex={-1}`, `aria-hidden`), blur + submit validation against shared schema, `aria-live` region for error announcements, submit calls `/api/contact`, decides outcome from `body.ok`, renders success block / error block with retry (retry re-validates before resubmitting), preserves field values on failure, submit button disabled + `SUBMITTING…` label while in flight, ignores a submit trigger while already submitting -- FR-19–FR-22, UX form states
- [x] `src/components/sections/ContactSection.tsx` -- Server Component rendering `<ContactForm />` plus a no-JS `<noscript>` fallback with `mailto:${CONTACT_EMAIL}` link -- graceful degradation without JS
- [x] `src/app/page.tsx` -- Replace the placeholder `<p>` in the `#contact` section with `<ContactSection />`, keep `SectionNumber`/`h2`/`data-glitch-burst` unchanged -- wires the real flow into the page
- [x] `scripts/testing/axe-scan.cjs` -- Run against the new form (no code change expected) to confirm all inputs have matching labels and no accessibility violations -- unit-tests the I/O matrix's accessibility-relevant edge cases

**Acceptance Criteria:**
- Given a visitor fills all three fields validly and submits, when the request succeeds, then EmailOctopus receives one new list member and the form is replaced inline by a success confirmation.
- Given a visitor leaves a field empty or enters an invalid email, when they blur the field or submit, then an accessible inline error appears and no request is sent.
- Given an automated submission fills the honeypot `website` field, when submitted, then no EmailOctopus call is made and the client still sees `{ ok: true }`.
- Given the EmailOctopus call fails, when the API responds, then the client shows a visible error, preserves the visitor's entered values, and offers a retry that resubmits without a full page reload.
- Given JavaScript is disabled, when the Contact section renders, then a working `mailto:` fallback is present and usable.
- Given the page builds, then `npm run build` completes without TypeScript or lint errors.
- Given `axe-scan.cjs` runs against the contact form, then no new accessibility violations are reported (all inputs have associated labels).

## Spec Change Log

### 2026-08-07 — bad_spec repair (review_loop_iteration 1)
- **Finding:** When EmailOctopus reports the submitter's email as an existing contact (`MEMBER_EXISTS_WITH_EMAIL_ADDRESS`), the route returned `{ ok: true }` without ever writing the new submission's `Message`/`FirstName` fields anywhere — a returning visitor's new message was silently discarded while the UI showed success. Root cause: the Design Notes' EmailOctopus recipe only specified the create-contact call and treated "already exists" as a terminal success, never specifying an update step.
- **Amended:** Design Notes now specify an upsert: on `MEMBER_EXISTS_WITH_EMAIL_ADDRESS`, follow up with a `PUT` to update that contact's `fields` (including the new `Message`) before returning `{ ok: true }`. Also folded in two adjacent robustness fixes discovered in the same review pass, in the same code region: (a) the failure-logging branch was calling `response.json()` then `response.text()` on the same already-consumed body, silently logging an empty string instead of the real error detail; (b) the EmailOctopus fetch had no timeout, so a hung upstream call could leave a visitor stuck on "SUBMITTING…" indefinitely.
- **Avoids:** Known-bad state where a repeat submitter's message is silently lost — directly defeats the epic goal of never losing a valid submission without ever showing an error.
- **KEEP:** The overall architecture is sound and must survive re-derivation unchanged — shared zod schema as single source of validation, wire contract (`{ name, email, message }` → `{ ok, error? }`, client decides from `body.ok` not HTTP status), honeypot field named `website` returning early with `{ ok: true }` and no delivery, `ContactForm` client-island state machine (`idle/submitting/success/error`) with inline `FormField`-based validation on blur+submit, `aria-live` error announcement, success block replacing the form in place, error block with preserved values and retry, `ContactSection` Server Component with `<noscript>` `mailto:` fallback, and the `Message` custom-field approach for delivering the message body (with the `.env.example` setup note) — all worked well and are not in question.

### 2026-08-07 — bad_spec repair (review_loop_iteration 2)
- **Finding:** The upsert fix from iteration 1 is non-functional: EmailOctopus API v2 identifies a contact by the MD5 hash of the lowercased email address, not the raw email string, in the URL path for GET/PUT/DELETE-by-id. Design Notes told the implementer to `PUT .../contacts/{lowercased-email-or-returned-id}`, which 404s against the real API — so the "already exists" branch will always fall through to `{ ok: false }`, meaning every returning visitor now sees a failure (worse than iteration-0's silent success, but still not the required upsert behavior). Also found this pass, same code region: the honeypot check (`if (website)`) doesn't trim, so a stray whitespace value (e.g. from browser autofill matching the literal field name `website`) would falsely flag a real visitor as spam and silently drop their message; and the two sequential 8s EmailOctopus timeouts (create, then update) can total ~16s in the worst case, risking the platform's own function-timeout killing the request before the client ever sees a response.
- **Amended:** Design Notes now specify the correct contact-id derivation (MD5 hex digest of the lowercased email, via Node's `crypto` module), reduce each EmailOctopus call's timeout to 6s (worst case ~12s, safer against short serverless deadlines), require trimming the honeypot value before the truthiness check, and rename the honeypot field away from the literal token `website` (a common browser-autofill heuristic target) to reduce false-positive autofill collisions. Also folds in: an explicit early return when `EMAIL_OCTOPUS_API_KEY`/`EMAIL_OCTOPUS_LIST_ID` are unset (500 "Server misconfigured" instead of a silent malformed request to EmailOctopus), reading the parsed error detail on the final 5xx/unexpected-status branch too (not just the "already exists" 4xx branch), and a `max(320)` bound on the email field and a `max(500)` bound on the honeypot field for consistency with the existing name/message bounds.
- **Avoids:** Known-bad state where the "fix" for lost messages instead makes every repeat submission fail outright, and the smaller known-bad state where whitespace-autofill into a honeypot field silently drops a real visitor's message.
- **KEEP:** Everything preserved in the iteration-1 KEEP note still holds — shared zod schema, wire contract, `ContactForm` state machine, `aria-live` announcement, success/error/retry UX, `ContactSection` no-JS fallback, and the `Message` custom-field delivery approach. Additionally keep from iteration 1: single-read response-body parsing (`readEmailOctopusError`), sanitized failure logging (status + parsed code/message, never raw body), retry re-validating before resubmit, and the submit-guard against re-entrant submits while `status === 'submitting'`.

## Review Triage Log

### 2026-08-07 — Review pass 1
- intent_gap: 0
- bad_spec: 1: (high 1)
- patch: 0
- defer: 0
- reject: 0
- addressed_findings:
  - `[high]` `[bad_spec]` Repeat submission from an existing EmailOctopus contact silently discarded the new message instead of updating the record — Design Notes amended to require a `PUT` upsert on "already exists", plus adjacent fixes to the double-body-read logging bug and missing fetch timeout in the same code region. All other findings from this pass (rate limiting, max-length validation, retry-path validation, honeypot field-name/autofill collision, no-JS form still interactive, response-shape validation, PII in logs, missing tests, live-region timing) are moot per cascading order and will be re-triaged after re-derivation.

### 2026-08-07 — Review pass 2
- intent_gap: 0
- bad_spec: 1: (high 1)
- patch: 0
- defer: 0
- reject: 0
- addressed_findings:
  - `[high]` `[bad_spec]` The iteration-1 upsert used the raw lowercased email as the EmailOctopus contact id; the real API keys contacts by MD5(lowercased email), so every update would 404 and repeat submissions would now fail outright instead of merely losing the message. Design Notes amended with the correct id derivation, plus adjacent fixes: honeypot value not trimmed before the truthiness check (autofill-whitespace false positive), honeypot field named `website` (autofill-heuristic collision), sequential 8s+8s timeouts risking platform deadline, missing explicit env-var-missing guard, missing error-detail parsing on the final 5xx branch, and missing max-length bounds on email/honeypot. All other findings from this pass (rate limiting, double-submit race at the state-closure layer, "send another message" reset, missing tests, EmailOctopus custom-field length limits, `FirstName` full-name mapping, subscription-status handling on update) are moot per cascading order and will be re-triaged after re-derivation.

### 2026-08-07 — Review pass 3
- intent_gap: 0
- bad_spec: 0
- patch: 4: (medium 2, low 2)
- defer: 4: (medium 1, low 3)
- reject: 6: (low 6)
- addressed_findings:
  - `[medium]` `[patch]` EmailOctopus update (PUT) omitted `status`/`tags`, unlike create, letting a repeat contact's status/tag silently diverge from a fresh one — added `status: 'SUBSCRIBED', tags: ['source:contact-form']` to the update body.
  - `[medium]` `[patch]` Double-submit/retry guard only checked React state (`status === 'submitting'`), which can't close a race between two rapid triggers before a render commits — added a synchronous `useRef` lock checked at the top of `submit()`.
  - `[low]` `[patch]` `AbortSignal.timeout` rejections are `DOMException`, not guaranteed `instanceof Error`, so timeout failures logged `code: undefined, message: undefined` — added a `describeThrown` helper checking both `Error` and `DOMException`.
  - `[low]` `[patch]` Honeypot input had no `maxLength`, so an unusual autofill tool could overflow it past the schema's 500-char cap and strand a user in an unrecoverable retry loop (the field is invisible to them) — added `maxLength={500}` to match the schema.
  - `[medium]` `[defer]` No rate limiting/CSRF/origin protection on `/api/contact` — honeypot is the only anti-abuse measure; logged for a future dedicated hardening pass.
  - `[low]` `[defer]` No automated test coverage for the contact schema, route branching, or form state machine — this is the highest-branching code in the repo and has zero tests; consistent with the repo having no test framework at all yet.
  - `[low]` `[defer]` EmailOctopus's real custom-field length limits for `Message`/`FirstName` are unverified against the 5000/200-char schema bounds — could silently truncate/reject legitimate long messages.
  - `[low]` `[defer]` No observability on honeypot trips (count/log) — can't currently tell from logs whether the anti-spam mechanism is doing anything.
  - `[low]` `[reject]` Message overwritten (not appended) on resubmission — matches the amended Design Notes' explicit upsert semantics, not a bug.
  - `[low]` `[reject]` Update/create failures return an identical generic 502 to the client — acceptable per spec; client only needs `ok`/`error`, not a taxonomy of failure causes.
  - `[low]` `[reject]` Redundant `.trim().toLowerCase()` in the route despite schema-level trim — harmless defensive duplication.
  - `[low]` `[reject]` List ID not URL-encoded before interpolation — sourced from trusted server env config, not user input.
  - `[low]` `[reject]` Duplicate-detection error code checked only within the 4xx branch, not 5xx — speculative; EmailOctopus documents this code as accompanying 4xx responses.
  - `[low]` `[reject]` Client doesn't pre-validate the honeypot field before submit — the server already rejects an oversized honeypot value safely (400, fail-loud); the `maxLength` patch above addresses the realistic version of this concern by preventing overflow in the first place.

## Design Notes

EmailOctopus API v2 create-contact endpoint: `POST https://api.emailoctopus.com/lists/{listId}/contacts` with `Authorization: Bearer {apiKey}` header and JSON body `{ email_address, fields: { FirstName: name, Message: message }, status: "SUBSCRIBED", tags: ["source:contact-form"] }`. The target list must have a custom text field named `Message` configured in EmailOctopus (List settings > Fields) — otherwise the message text is silently dropped even though delivery "succeeds", defeating the epic's goal of never losing a valid submission.

If `EMAIL_OCTOPUS_API_KEY` or `EMAIL_OCTOPUS_LIST_ID` is unset/empty at request time, return `{ ok: false, error }` with status 500 immediately — do not attempt the EmailOctopus call with an empty key/id.

On a 4xx response, read the body **once** (as text, then `JSON.parse` it in a try/catch — never call both `.json()` and `.text()` on the same `Response`, the second read throws/returns empty). If the parsed error code is `MEMBER_EXISTS_WITH_EMAIL_ADDRESS`, the visitor already exists as a list member — do not treat this as terminal. EmailOctopus identifies a contact **by the MD5 hex digest of the lowercased email address**, not the raw email string — compute it with Node's built-in `crypto` module (`crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')`) and issue a follow-up `PUT https://api.emailoctopus.com/lists/{listId}/contacts/{that-md5-hex-digest}` with the same `fields` (`FirstName`, `Message`) to overwrite the stored message with this submission's content, then return `{ ok: true }` only after that update succeeds; if the update call itself fails, return `{ ok: false, error }` with a non-2xx status like any other delivery failure — never report success without having stored the new message somewhere. Any other 4xx/5xx/network error is a real failure: read and log the parsed error detail (status + parsed code/message, not a raw re-read of the body) on every failure branch, including the final 5xx/unexpected-status case, and return `{ ok: false, error }`. Add `signal: AbortSignal.timeout(6000)` to both the create and update `fetch` calls (kept under 6s each so the combined create→update worst case stays under ~12s); treat a timeout/`AbortError` the same as any other network failure (`{ ok: false, error }`, 502) so a visitor is never left on "SUBMITTING…" indefinitely. When logging failures server-side, log the status code and the parsed error code/message only — never log the raw response body verbatim, since it may echo back the submitter's email address into application logs.

Schema bounds: `name` 1–200 chars, `email` 1–320 chars plus `.email()`, `message` 1–5000 chars, honeypot field 0–500 chars.

Honeypot field: name it something other than the literal token `website` (e.g. `topic` or another innocuous, non-autofill-prone token) to reduce collision with browser/password-manager autofill heuristics that key off common field names like "website" or "url". Visually hidden via CSS (`.sr-only`-style absolute positioning, not `display:none`/`visibility:hidden`, since some spam bots skip those), `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`, and labelled only for bots (no visible or screen-reader label) so real users never perceive or fill it. Server-side, **trim** the value before checking truthiness (`if (value.trim())`) — an untrimmed stray-whitespace autofill must not be treated as a spam signal.

`ContactForm` local state: `{ values: {name, email, message, <honeypot field>}, errors: Record<string, string>, status: 'idle' | 'submitting' | 'success' | 'error' }`. On submit: run full schema validation client-side first (short-circuit before any network call), then POST, then transition `status` based on `body.ok`.

## Verification

**Commands:**
- `npm run build` -- expected: exit 0, no TypeScript or lint errors
- `npm run dev` then manual POST via browser form -- expected: valid submission returns `{ ok: true }`, EmailOctopus dashboard shows new contact
- `npm run axe:scan` -- expected: no new accessibility violations on the contact form's inputs/labels

**Manual checks (if no CLI):**
- Submit with honeypot filled (via devtools) -- expected: `{ ok: true }` returned, no new EmailOctopus contact created
- Disable JavaScript in browser -- expected: `mailto:` fallback link still renders and is clickable

## Auto Run Result

**Summary:** Implemented all 4 Epic 3 stories (shared validation schema, `/api/contact` route with EmailOctopus v2 create/update upsert, `ContactForm` client island, `ContactSection` + no-JS fallback) in one run, through 3 review-loop iterations — 2 bad_spec repairs and 1 patch-only pass.

**Files changed:**
- `src/lib/contact/schema.ts` — shared zod `contactSchema` (name 1–200, email 1–320 + format, message 1–5000, honeypot `topic` 0–500) — single source of validation for client and server
- `src/app/api/contact/route.ts` — POST route handler: env-var guard, honeypot check (trimmed), EmailOctopus v2 create-contact, MD5(lowercased-email)-keyed upsert on `MEMBER_EXISTS_WITH_EMAIL_ADDRESS`, single-read error parsing, 6s timeouts, sanitized failure logging
- `src/components/ContactForm.tsx` — `"use client"` island: controlled Name/Email/Message via `FormField`, honeypot input (`topic`, unlabeled, `maxLength=500`), blur+submit validation, `aria-live` announcement, idle/submitting/success/error state machine with a ref-based re-entrant-submit lock, retry that re-validates
- `src/components/sections/ContactSection.tsx` — Server Component wrapping `ContactForm` plus `<noscript>` `mailto:` fallback
- `src/app/page.tsx` — replaced the `#contact` placeholder `<p>` with `<ContactSection />`; section wrapper/`SectionNumber`/`data-glitch-burst` unchanged
- `src/content/types.ts`, `src/content/index.ts` — added `ContactContent` and populated all contact copy
- `.env.example` — documented the required EmailOctopus custom `Message` field

**Review findings across all passes:**
- 2 `bad_spec` (both high severity, both in the same EmailOctopus create→duplicate→update code path): iteration 1 never updated an existing contact's message on resubmission (silent data loss); iteration 2's fix used the raw email instead of the MD5-hash contact id the real API requires (would have 404'd every update). Both repaired via Design Notes amendment + full re-derivation.
- Pass 3 (post-fix): 4 patches applied directly (update-body status/tags parity, `DOMException` timeout logging, ref-based double-submit lock, honeypot `maxLength`), 4 deferred to `deferred-work.md` (rate limiting/CSRF, test coverage, EmailOctopus field-length limits, honeypot-trip observability), 6 rejected as noise or already-intended behavior.

**Verification performed:**
- `npm run build` — exit 0, clean TypeScript and production build
- Targeted `eslint` on all touched files — clean (one pre-existing, unrelated repo error confirmed untouched)
- `npm run axe:scan` against `npm run start` — 0 axe violations across 28 rules; the single "input w/o label" flagged by the script's structural counter is the honeypot input by design (bots-only, `aria-hidden`)

**Residual risks (see `deferred-work.md` for full detail):**
- No rate limiting/CSRF/origin protection on `/api/contact` — honeypot is the only anti-abuse layer
- Zero automated test coverage for the schema/route/form (matches the repo's current no-test-framework state, but this is now the highest-branching code in the repo)
- EmailOctopus's actual custom-field length limits are unverified against the schema's bounds
- No observability on honeypot trips
