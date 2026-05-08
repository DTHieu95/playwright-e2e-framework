# Project: SauceDemo + Booker API E2E Framework

Playwright + TypeScript test framework targeting saucedemo.com (UI, visual, a11y, authed) and restful-booker (API). Portfolio piece — POM + fixtures + CI/CD with live Allure reporting.

## Stack

- `@playwright/test` ^1.49 — runner, fixtures, locators, `toHaveScreenshot()`
- `@axe-core/playwright` — a11y scans
- `@faker-js/faker` — test data factories
- `allure-playwright` + `allure-js-commons` — reporter + runtime annotations
- TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noImplicitOverride`)
- Path alias `@/*` → `src/*`

## Layout

```
src/
├── pages/          Page Objects — private readonly Locator fields, async methods, expectXxx helpers
├── components/     Reusable cross-page UI (header, product-card, checkout-form)
├── fixtures/       test.ts merges pages.fixture + api.fixture + visual.fixture
├── api/            API clients (booker.client.ts uses Playwright's request fixture)
├── testdata/       users.ts, factories.ts (faker)
└── types/

tests/
├── ui/             Desktop Chrome + Pixel 5 (project-driven, same files re-run per device)
├── ui-authed/      Depends on `setup` project — uses storageState
├── api/            restful-booker
├── visual/         *.visual.spec.ts — Docker-only runner
├── a11y/           axe-core impact-based gating
└── setup/          auth.setup.ts → playwright/.auth/standard-user.json
```

## Critical Gotchas

1. **Visual specs must run in Docker** (`npm run test:visual` / `npm run test:visual:update`). Running `--project=visual-chromium` directly from a Windows host produces non-portable snapshots that fail CI.
2. **Allure tags are runtime annotations**, not Playwright tags. `await tag('smoke')` does NOT make `--grep "@smoke"` match. Filter by file path or test title.
3. **Specs import `test` from `@/fixtures/test`**, never from `@playwright/test` directly. Exception: `*.setup.ts` uses `test as setup` from `@playwright/test`.
4. **Authed UI tests depend on the `setup` project**. If `playwright/.auth/standard-user.json` is missing or stale, the `setup` project re-runs automatically when you use `npm run test:authed`.
5. **CI shards across 2 runners** and merges blob reports. Allure history persists via gh-pages branch — first-run failures on gh-pages are tolerated.

## Where to find what

| Need                                               | Look in                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| Running tests by project / preset                  | `.claude/skills/run-tests/`                                              |
| Scaffolding a new page object                      | `.claude/skills/new-page-object/`                                        |
| Library docs before writing code                   | `.claude/skills/research-first/` (auto-invoked)                          |
| Verifying newly written code                       | `.claude/skills/self-verification-guardrail/` (auto-invoked)             |
| Investigating a failed CI run                      | `.claude/skills/triage-ci-failure/`                                      |
| Live browser interaction (snapshot, role locators) | `.claude/skills/playwright-cli/` + MCP `playwright` server (`.mcp.json`) |
| Code review conventions                            | `.claude/agents/code-reviewer.md`                                        |

## Commands cheat sheet

- `npm test` — full suite (ui-chromium + ui-mobile + ui-authed + api + a11y)
- `npm run test:ui` / `:mobile` / `:api` / `:authed` / `:a11y` — single project
- `npm run test:visual` / `:visual:update` — Docker-only
- `npm run typecheck && npm run lint && npm run format:check` — local pre-flight
- `npm run report` — open last Playwright HTML report
- `npm run allure:gen && npm run allure:open` — local Allure dashboard
