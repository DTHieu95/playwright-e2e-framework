---
name: run-tests
description: Run Playwright tests by project, file, or test-title pattern in this SauceDemo + Booker API repo
disable-model-invocation: true
---

# Run Playwright Tests

Run tests using the npm scripts already defined in `package.json`. There is no BDD layer here — tests are plain Playwright specs split across projects.

## Usage

`/run-tests <preset> [filter]`

- `preset`: see the table below (default: `all`)
- `filter`: optional — passes through as `--grep` (matches test titles)

## Presets → npm script

| Preset | Script | What it runs |
|--------|--------|--------------|
| `all` | `npm test` | UI chromium + UI mobile + UI authed + API + a11y |
| `ui` | `npm run test:ui` | `tests/ui/*.spec.ts` on Desktop Chrome |
| `mobile` | `npm run test:mobile` | `tests/ui/*.spec.ts` on Pixel 5 |
| `api` | `npm run test:api` | `tests/api/*.spec.ts` against restful-booker |
| `authed` | `npm run test:authed` | `tests/ui-authed/*.spec.ts` (auto-runs `setup` project first) |
| `a11y` | `npm run test:a11y` | `tests/a11y/*.spec.ts` |
| `visual` | `npm run test:visual` | Visual specs via the Docker image (cross-platform stable) |
| `visual:update` | `npm run test:visual:update` | Updates baseline snapshots inside Docker |
| `headed` | `npm run test:headed` | All tests, browser visible |
| `debug` | `npm run test:debug` | Inspector mode |

## Filtering

Append `-- --grep "<pattern>"` when calling through npm:

```bash
npm run test:ui -- --grep "valid user lands"
npm run test:api -- --grep "create.*delete"
```

Filter by file:

```bash
npx playwright test tests/ui/login.spec.ts --project=ui-chromium
```

Note: tags in this repo are **runtime allure annotations** (`await tag('smoke')`), not Playwright `--grep`-able tags. To filter by behaviour, grep on the test title (e.g. `npm run test:ui -- --grep "@smoke"` will NOT work — there's no `@smoke` in any title). Use file or title text instead.

## After running

- Failed: read the error, then defer to `triage-ci-failure` skill if it's a CI run, or open the trace locally:

  ```bash
  npx playwright show-report
  ```

- Passed: report counts and duration. Don't claim a feature works just because tests pass — defer to `self-verification-guardrail` for newly-written code.

## Visual tests are special

`test:visual` and `test:visual:update` run inside Docker (`mcr.microsoft.com/playwright:v1.59.1-noble`) so snapshots stay byte-stable across Windows/macOS/CI Linux. Do NOT run visual specs directly with `npx playwright test --project=visual-chromium` from a Windows host — pixel diffs will fail because the host renderer differs from the baseline.

## Examples

- `/run-tests ui` — Chromium UI suite
- `/run-tests api` — Booker API tests
- `/run-tests authed` — authed UI suite (setup runs first)
- `/run-tests visual` — visual regression in Docker
- `/run-tests visual:update` — refresh baselines after intentional UI change
