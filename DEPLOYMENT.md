# Deployment & Environment Wiring Checklist

> This is the executable checklist for wiring **Glitch-guy0** to production (DEP-1). Follow the steps in order. Steps requiring your Vercel/EmailOctopus account are manual and must be completed by the Builder — the codebase cannot (and must not) fabricate credentials or a false success.

## Prerequisites

- The four quality-gate npm commands are installed and repeatable: `axe:scan`, `contrast:check`, `link:check`, `perf:budget`.
- The one-command pre-deploy gate is available: `npm run prelaunch:check` (chains all four gates in order, exits non-zero on first failure).
- All required environment variables are documented in `.env.example` — verify, do not modify unless a real gap is found.

## Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `EMAIL_OCTOPUS_API_KEY` | server-only | EmailOctopus API key |
| `EMAIL_OCTOPUS_LIST_ID` | server-only | EmailOctopus list id |
| `CONTACT_EMAIL` | server-read | Contact email rendered server-side in header/footer |
| `NEXT_PUBLIC_DEBUG_COMPONENTS` | client | Debug overlay toggle (`false` in production) |

- The EmailOctopus target list must have a custom text field named `Message` so the contact route can store the visitor's message.
- **Never commit `.env`** (ENV-1). Only `.env.example` is committed.

## Steps

### 1. Import the project into Vercel

1. Create a Vercel project for this repository.
2. Configure branches:
   - `main` → **Production**
   - All other branches (e.g. PR branches) → **Preview** deployments.

### 2. Configure per-environment environment variables

Set the values per environment (Production + Preview):

- `EMAIL_OCTOPUS_API_KEY`
- `EMAIL_OCTOPUS_LIST_ID`
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_DEBUG_COMPONENTS=false`

> **Manual verification (from Story 6.1):** confirm real `CONTACT_EMAIL` / `EMAIL_OCTOPUS_*` values are actually set in **every** relevant Vercel environment before launch. This is a manual step — there is no automated check. If a value is missing, the app falls back to `builder@example.com` for `CONTACT_EMAIL` (preview builds must still build and run without crashing).

### 3. Run the pre-launch gates

Build and start the production server, then run the full gate:

```bash
npm run build
npm run start &
npm run prelaunch:check
```

The command stops at the first failing gate with a non-zero exit. All four gates must pass before launch:

1. `axe:scan` — zero serious/critical accessibility violations (dark + light).
2. `contrast:check` — load-bearing contrast pairs ≥ 4.5:1 in both modes.
3. `link:check` — all outbound links resolve (zero 404s/timeouts).
4. `perf:budget` — Lighthouse performance ≥ 90 on mobile.

> **Note:** `link:check` and `perf:budget` require the production server running and Chrome installed.

### 4. Confirm Web Analytics is production-only

- Web Analytics (`@vercel/analytics`) is injected via app code behind consent state, and dashboard-level automatic injection is disabled.
- Confirm analytics runs **only** in production (never in preview).

### 5. End-to-end test submission

Submit a real test message through the deployed Contact form and confirm it:

1. Renders inline success confirmation ("Message sent. I'll reply within a day.").
2. Reaches your inbox via EmailOctopus (list member count increments = contacts metric).
3. A filled honeypot (`website`) submission is dropped without delivery or counting.

This closes the **Visit → Trust → Capability → Contact** loop end to end.

## Blocked / human-owned items

These cannot be completed by an unattended run and require a human decision or account access:

- [ ] **Vercel/EmailOctopus wiring** (steps 1, 2, 4, 5 above) — requires Builder credentials/account access.
- [ ] **CI / pre-commit / pre-push gate wiring** for `contrast-check.cjs` and `axe-scan.cjs` — platform/pipeline decision on where the gates live.
- [ ] **Resolve the dead Shikigami Agent SDK GitHub link** (`src/content/index.ts:71`) — it currently 404s; decide to make the repo public / fix the URL / fix the slug. Success = `link:check` returns 200 for it (FR-13 zero-404 launch gate).

## Notes

- Keep everything free-tier (NFR-8) — Vercel (site + Web Analytics), EmailOctopus (email). No paid dependency without a decision.
- Never gate behavior on `process.env.NODE_ENV === 'production'` in app code — Next.js sets `NODE_ENV=production` for every Vercel build, preview included.
