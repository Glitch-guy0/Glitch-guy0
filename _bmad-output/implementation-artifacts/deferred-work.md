# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-component-library.md`
  summary: The `nav-flicker`, `card-tear`, and `btn-fringe` CSS animations defined in Story 1.4 have no `prefers-reduced-motion` guard yet.
  evidence: NFR-3/UX-DR10 require reduced-motion to disable every glitch/flicker keyframe outright; the global policy belongs to Story 1.5 (AD-2), which must disable these exact keyframe names or the flicker/tear/scale survive under reduced motion.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-epic3-complete.md`
  summary: `/api/contact` has no rate limiting, CSRF, or origin protection — the honeypot is the only anti-abuse measure and does nothing against a script POSTing directly to the route.
  evidence: Confirmed by two independent adversarial reviewers across review passes on Epic 3; each hit consumes real EmailOctopus API quota with no throttling.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-epic3-complete.md`
  summary: No automated test coverage exists for the contact schema, `/api/contact` route branching (create/duplicate/update/timeout/misconfig), or the `ContactForm` state machine.
  evidence: This is the highest-branching, highest-risk code added so far in the repo (three review-loop iterations found real bugs in exactly this branching), and the repo has no test framework installed at all yet.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-epic3-complete.md`
  summary: EmailOctopus's real custom-field length limits for the `Message`/`FirstName` fields are unverified against the schema's 5000/200-char bounds — a long legitimate message could be silently truncated or rejected upstream with only a generic "Could not deliver message" surfaced to the visitor.
  evidence: Raised independently by the adversarial reviewer on review pass 3; not verifiable without live EmailOctopus list configuration access.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-epic3-complete.md`
  summary: No observability (count/log) exists for honeypot trips on `/api/contact`, so there's no way to confirm from logs whether the anti-spam mechanism is doing anything.
  evidence: Raised by the adversarial reviewer on review pass 3; purely an observability gap, not a correctness bug.

- source_spec: `_bmad-output/implementation-artifacts/spec-4-resume.md`
  summary: `predev` regenerates `/public/resume.pdf` once at `next dev` startup only; editing `src/content/index.ts` during an already-running dev session leaves the PDF stale until the dev server restarts.
  evidence: Raised by the Edge Case Hunter review; confirmed `predev` has no file-watch mechanism and `next dev` itself never re-invokes the generation script.

- source_spec: `_bmad-output/implementation-artifacts/spec-4-resume.md`
  summary: The footer's resume link cache-busting query (`resumeHref="/resume.pdf?v=1"` in `src/app/page.tsx`) is a static literal, not tied to a content hash or build timestamp — a redeployed PDF with unchanged content-bearing fields but no manual `?v=` bump can serve a stale cached copy to returning visitors.
  evidence: Raised by the Blind Hunter review; `page.tsx` predates this story's baseline revision and was not part of this diff, so the fix is out of this story's scope.

- source_spec: `_bmad-output/implementation-artifacts/spec-4-resume.md`
  summary: The only automated validity check on the generated resume PDF is a byte-size floor (`MIN_PDF_SIZE`); nothing asserts the extracted PDF text actually reflects current `src/content/` values, so a logic error that emptied a content array would still produce a "successful" build.
  evidence: Raised by the Blind Hunter review; this story's Verification section only specifies manual PDF-opens-without-error checks, not automated content-match assertions.

- source_spec: `_bmad-output/implementation-artifacts/spec-5-analytics-consent.md`
  summary: `CookieBanner`'s window-level `Escape` listener declines consent on any Escape press while the banner is visible, even if the keypress was meant for an unrelated control (e.g. closing the mobile nav sheet, which also listens globally) and the banner never had focus.
  evidence: Raised by the Blind Hunter review; `Header.tsx` already uses the same unscoped global-listener pattern for its own state, so this isn't a novel anti-pattern, but here the side effect (a one-way opt-out with no revoke UI) is more consequential than the pre-existing case.

- source_spec: `_bmad-output/implementation-artifacts/spec-5-analytics-consent.md`
  summary: Once a visitor Accepts or Declines, there is no "manage cookie preferences" control anywhere on the site to change that choice later short of manually clearing `localStorage`.
  evidence: Raised by the Blind Hunter review; the current epic scope (Stories 5.1-5.3) never calls for a revoke/change-consent surface, so it's a product-scope gap rather than a defect in what was built.

- source_spec: `_bmad-output/implementation-artifacts/spec-5-analytics-consent.md`
  summary: `CookieBanner`'s `getServerSnapshot` always returns `null` (banner visible) for SSR/first paint, so returning visitors who already stored a consent choice can see a brief flash of the banner before `useSyncExternalStore` re-syncs to the real stored value client-side.
  evidence: Raised by the Blind Hunter review; explicitly a known trade-off of the chosen hydration-safe pattern (documented in the component's own comment), not a functional break of the "never reappears" requirement, but a real cosmetic flicker on repeat visits.
