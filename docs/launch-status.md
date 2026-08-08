# Glitch-guy0 — Launch Status

> Sprint complete (2026-08-08). All six epics and every story shipped. This page records the pre-launch quality-gate results and the remaining **human-owned** launch steps.

## Quality gates — results

All four gates ship as repeatable npm commands and are chained by `npm run prelaunch:check`.

| Gate | Command | Status | Result |
|---|---|---|---|
| Accessibility (both modes) | `npm run axe:scan` | done | zero serious/critical violations |
| Contrast (both modes) | `npm run contrast:check` | done | load-bearing pairs ≥ 4.5:1 |
| Link crawl (zero 404s) | `npm run link:check` | done* | one known dead link — see below |
| Performance budget | `npm run perf:budget` | done | **Lighthouse 95/100** (exit 0) |

\* The link crawl exposes one real dead link: the **Shikigami Agent SDK GitHub repo** (`src/content/index.ts:71`) 404s. It is a human decision to fix (make public / correct URL/slug). Success = `link:check` returns 200 for it.

## Human-owned launch steps (from `DEPLOYMENT.md`)

These require the Builder's account access and cannot be done unattended:

- [ ] **Vercel/EmailOctopus wiring** — import project, `main` → production + PR → preview, per-environment env vars, production e2e test submission, confirm Web Analytics is production-only.
- [ ] **Manual env verification** — confirm real `CONTACT_EMAIL` / `EMAIL_OCTOPUS_*` values set in every Vercel environment (Story 6.1 hand-off).
- [ ] **CI / pre-commit / pre-push gate wiring** for `contrast-check.cjs` + `axe-scan.cjs` — decide where the gates live.
- [ ] **Resolve dead Shikigami GitHub link** — human decision on the repo visibility/URL.
- [ ] **Rate limiting / CSRF / origin protection** on `/api/contact` (`src/app/api/contact/route.ts`) — honeypot is currently the only anti-abuse layer.

> The complete ordered checklist is [`DEPLOYMENT.md`](../DEPLOYMENT.md) at the repo root. Follow it in order to take the site to production.
