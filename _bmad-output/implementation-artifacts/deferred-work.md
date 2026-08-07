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
