# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-component-library.md`
  summary: The `nav-flicker`, `card-tear`, and `btn-fringe` CSS animations defined in Story 1.4 have no `prefers-reduced-motion` guard yet.
  evidence: NFR-3/UX-DR10 require reduced-motion to disable every glitch/flicker keyframe outright; the global policy belongs to Story 1.5 (AD-2), which must disable these exact keyframe names or the flicker/tear/scale survive under reduced motion.
