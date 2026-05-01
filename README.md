# Saucedemo Playwright Framework

[![CI](https://github.com/DTHieu95/playwright-e2e-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/DTHieu95/playwright-e2e-framework/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.x-2EAD33?logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Allure Report](https://img.shields.io/badge/Allure-Live%20Report-FF6E00?logo=qameta)](https://dthieu95.github.io/playwright-e2e-framework/)

End-to-end and API test framework built with Playwright + TypeScript. Demonstrates modern Page Object Model patterns with fixture-injected page objects, component composition, and a CI/CD pipeline that publishes a live Allure report to GitHub Pages on every push to `main`.

🔗 **Live test report:** https://dthieu95.github.io/playwright-e2e-framework/

## Highlights

- **Playwright 1.x + TypeScript** with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals/Parameters`
- **Fixture-injected Page Object Model** — no `new PageObject(page)` in `beforeEach`
- **Component composition** — `HeaderComponent`, `ProductCardComponent`, `CheckoutFormComponent` reused across pages without inheritance
- **Six Playwright projects** — `setup`, `ui-chromium`, `ui-mobile` (Pixel 5), `ui-authed`, `api`, `a11y`
- **Storage-state authentication** — `auth.setup.ts` runs once and gates `ui-authed`, demonstrating the cached-session pattern
- **API tests** via the built-in `request` fixture against [restful-booker](https://restful-booker.herokuapp.com), with a typed `BookerClient` wrapping the surface
- **Accessibility scans** with [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm), triaged by impact with a documented allowlist (the realistic pattern, not "fail on any violation")
- **Allure reporting with metadata** — `epic` / `feature` / `story` / `severity` / `tag` annotations + nested `test.step()` blocks for clear, scannable reports
- **ESLint with `eslint-plugin-playwright`** + Prettier + Husky pre-commit + Dependabot
- **GitHub Actions CI** with **2-shard parallel execution**, blob-report merging, and Allure publishing to GitHub Pages with trend history

## Quickstart

```bash
git clone https://github.com/DTHieu95/playwright-e2e-framework.git
cd playwright-e2e-framework
npm ci
npx playwright install --with-deps chromium
npm test
```

That's it — the suite runs against the public saucedemo and restful-booker demo sites, no credentials required.

## Project Structure

```
.
├── src/
│   ├── pages/          # one class per page; locators private readonly
│   ├── components/     # reusable UI pieces composed into pages
│   ├── fixtures/       # custom test fixtures injecting POM/API instances
│   ├── api/            # typed API client(s)
│   ├── testdata/       # constants + faker-based factories
│   └── types/          # shared TS interfaces
├── tests/
│   ├── setup/          # one-shot auth.setup.ts that primes storageState
│   ├── ui/             # standard UI tests (login flow each test)
│   ├── ui-authed/      # UI tests using cached storageState (no per-test login)
│   ├── api/            # API tests (restful-booker)
│   └── a11y/           # axe-core accessibility scans
├── playwright.config.ts
└── .github/
    ├── workflows/ci.yml
    └── dependabot.yml
```

## Architecture Decisions

**Why fixtures over `beforeEach { this.loginPage = new LoginPage(page) }`?** Fixtures via `test.extend` are Playwright's modern injection pattern — they make page objects available as destructured arguments, eliminate setup boilerplate, scope cleanup correctly per test, and let any spec opt into only the page objects it actually uses. The old pattern leaks setup detail into every spec; this one doesn't.

**Why composition over a `BasePage` superclass?** Inheritance forces shared behavior to live in one place even when the actual reuse is structural (the header is on Inventory, Cart, and Checkout — but Login has no header). Composition via small `Component` classes (each scoped to a `Locator` root) reuses the exact pieces that are actually shared, with no `super.foo()` chains and no diamond problems. It also reads as well to a reviewer skimming the repo as it does to the author who wrote it.

**Why role-based / `data-test` locators over CSS?** Playwright's recommended selector priority is `getByRole` → `getByLabel` → `getByPlaceholder` → `getByText` → `getByTestId`. Saucedemo exposes `data-test` attributes that survive markup refactors, so this framework prefers them over CSS classes (which the next bootstrap upgrade will rename).

**Why an a11y allowlist instead of "fail on any violation"?** Asserting zero axe violations against any real app produces ignored test failures within a week — teams stop reading the output, then the suite stops catching real regressions. This framework documents known violations with rationale and only fails on _new_ critical/serious findings. That's the pattern that survives contact with a real product backlog.

## Running Specific Suites

| Command                                     | Purpose                                           |
| ------------------------------------------- | ------------------------------------------------- |
| `npm test`                                  | Run all 6 projects                                |
| `npm run test:ui`                           | UI tests on desktop chromium                      |
| `npm run test:mobile`                       | UI tests on Pixel 5 viewport                      |
| `npm run test:authed`                       | Authenticated UI suite (uses cached storageState) |
| `npm run test:api`                          | API tests only                                    |
| `npm run test:a11y`                         | Accessibility scans (axe-core)                    |
| `npm run test:headed`                       | UI tests with browser visible                     |
| `npm run test:debug`                        | Step through tests with Playwright Inspector      |
| `npm run test:ui-mode`                      | Open Playwright UI mode                           |
| `npm run report`                            | Open the Playwright HTML report                   |
| `npm run allure:gen && npm run allure:open` | Generate and open Allure report locally           |

## Reports

- **Built-in HTML:** `npm run report` after a run
- **Allure (local):** `npm run allure:gen && npm run allure:open`
- **Allure (live, published from `main`):** https://dthieu95.github.io/playwright-e2e-framework/

## CI

The [CI workflow](.github/workflows/ci.yml) has four jobs:

1. **`lint-and-typecheck`** — gates everything else. Runs ESLint, `tsc --noEmit`, and `prettier --check`.
2. **`test`** — runs in parallel across 2 shards using Playwright's built-in sharding (`--shard=1/2`, `--shard=2/2`). Each shard emits a [blob report](https://playwright.dev/docs/test-sharding#blob-reports). All 6 projects are exercised on every shard.
3. **`merge-reports`** — downloads blob reports from all shards, calls `playwright merge-reports --reporter html` to assemble a single HTML report, and combines per-shard Allure results before generating the Allure dashboard with prior-run trend history merged in from the `gh-pages` branch.
4. **`publish-allure`** — runs only on `main`. Publishes the Allure report to the `gh-pages` branch via `peaceiris/actions-gh-pages@v4`. Pages serves it at the badge URL above.

## Tech Stack

- [Playwright](https://playwright.dev/) — test runner & browser automation
- [TypeScript](https://www.typescriptlang.org/) — strict mode
- [@faker-js/faker](https://fakerjs.dev/) — dynamic test data
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) — accessibility scanning
- [allure-playwright](https://github.com/allure-framework/allure-js) + [allure-js-commons](https://github.com/allure-framework/allure-js) — rich, history-aware reporting with metadata annotations
- [restful-booker](https://restful-booker.herokuapp.com) — public API for the API test surface

## License

MIT
