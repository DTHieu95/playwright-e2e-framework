---
name: research-first
description: Automatically research latest docs and best practices before writing any new code or modifying existing code in this repo
user-invocable: false
---

# Research Before Code

Auto-triggered before writing or modifying code so implementations use up-to-date APIs and follow current best practices for the libraries actually used in this repo.

## When This Applies

- Creating or modifying a page object under `src/pages/`
- Creating or modifying a component object under `src/components/`
- Creating or modifying a fixture under `src/fixtures/`
- Creating or modifying an API client under `src/api/`
- Adding new test data under `src/testdata/`
- Creating or modifying a spec under `tests/ui/`, `tests/api/`, `tests/visual/`, `tests/a11y/`, `tests/ui-authed/`
- Editing `playwright.config.ts`, `tsconfig.json`, `package.json` scripts, or workflow files under `.github/workflows/`

## Workflow

### Step 1 — Identify libraries

List every library/framework involved. The libraries actually pinned in `package.json`:

| Library | Use |
|---------|-----|
| `@playwright/test` | Test runner, fixtures, locators, assertions, `toHaveScreenshot()` for visual |
| `@axe-core/playwright` | Accessibility scans in `tests/a11y/` |
| `@faker-js/faker` | Test data generation in `src/testdata/factories.ts` |
| `allure-playwright` | Test reporter wired in `playwright.config.ts` |
| `allure-js-commons` | Runtime annotations: `epic`, `feature`, `story`, `severity`, `tag` |
| `eslint-plugin-playwright` | Lint rules |
| `husky` + `lint-staged` | Pre-commit hooks |

If a library is not in `package.json`, do NOT assume it exists. Common false friends from older versions of similar repos: `playwright-bdd`, `mailosaur`, `pdf-parse`, `cheerio`, `pixelmatch`, `pngjs` — none of these are installed here.

### Step 2 — Fetch current docs

For each library identified, use Context7 MCP:

1. `mcp__plugin_context7_context7__resolve-library-id` — e.g. `playwright`, `@playwright/test`, `@axe-core/playwright`, `allure-js-commons`
2. `mcp__plugin_context7_context7__query-docs` — query the specific API you need

Focus the query on:

- Current method signatures and return types
- Recommended patterns
- Deprecations or breaking changes since the version pinned in `package.json`
- Correct import paths

### Step 3 — Read existing patterns first

Before writing, read at least one existing example of the same shape:

| Creating… | Read first… |
|-----------|-------------|
| Page object | `src/pages/login.page.ts` (canonical: private `Locator` fields, constructor with `Page`, async methods, `expect…` helpers) |
| Component object | `src/components/header.component.ts` |
| Fixture | `src/fixtures/test.ts` (uses `mergeTests`) and one of `pages.fixture.ts` / `api.fixture.ts` / `visual.fixture.ts` |
| API client | `src/api/booker.client.ts` |
| Test data factory | `src/testdata/factories.ts` |
| UI spec | `tests/ui/login.spec.ts` (allure annotations + `test.step` + fixture-injected page objects) |
| API spec | `tests/api/booking.spec.ts` |
| Visual spec | `tests/visual/login.visual.spec.ts` (uses `visualSnapshot` fixture) |
| a11y spec | `tests/a11y/inventory.a11y.spec.ts` |

Match: import style (`@/...` path alias), single quotes, `private readonly` locator fields initialized inline, allure annotations called at the start of the test or in `beforeEach`.

### Step 4 — Implement

Write code using verified syntax + project patterns. Use the `@/...` path alias for everything under `src/`.

### Step 5 — Verify

After writing:

- [ ] Imports use `@/...` for src/, single quotes, no default imports unless the library exports default
- [ ] No deprecated APIs
- [ ] Strict TS satisfied (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`)
- [ ] If new spec file: matches a `testMatch` pattern in `playwright.config.ts` so it actually runs
- [ ] If page/component/fixture changed: defer to `self-verification-guardrail` skill before claiming it works
