---
name: new-page-object
description: Scaffold a new Page Object under src/pages/ with matching fixture wiring and a starter spec — for the SauceDemo POM in this repo
disable-model-invocation: true
---

# Scaffold a New Page Object

Creates a page object under `src/pages/`, wires it into `src/fixtures/pages.fixture.ts`, and creates a starter spec under `tests/ui/`.

## Usage

`/new-page-object <name> [url-path]`

- `name`: PascalCase or camelCase root (e.g. `cart`, `checkoutInfo` — produces `CartPage`, `CheckoutInfoPage`)
- `url-path`: optional path passed to `page.goto()` (default: `/`)

## Steps

### 1. Create the page object

`src/pages/<name>.page.ts`

```ts
import { expect, type Locator, type Page } from '@playwright/test';

export class <Name>Page {
  private readonly heading: Locator = this.page.locator('.title');
  // Add locators as private readonly fields. Prefer data-test attributes when present:
  //   this.page.locator('[data-test="..."]')

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('<url-path>');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
```

### 2. Wire into the fixture

Edit `src/fixtures/pages.fixture.ts`:

- Add the import: `import { <Name>Page } from '@/pages/<name>.page';`
- Add to `PageFixtures` type: `<name>Page: <Name>Page;`
- Add to `base.extend(...)`:
  ```ts
  <name>Page: async ({ page }, use) => {
    await use(new <Name>Page(page));
  },
  ```

`src/fixtures/test.ts` re-exports automatically — no change needed there.

### 3. Create starter spec

`tests/ui/<name>.spec.ts`

```ts
import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';

test.describe('<Name>', () => {
  test.beforeEach(async () => {
    await epic('<Epic>');
    await feature('<Name>');
  });

  test('loads successfully', async ({ <name>Page }) => {
    await story('Page renders');
    await severity('normal');
    await tag('smoke');

    await <name>Page.goto();
    await <name>Page.expectLoaded();
  });
});
```

## Conventions (read before scaffolding)

Read `src/pages/login.page.ts` and `src/fixtures/pages.fixture.ts` once to confirm conventions are still current:

- Private `readonly` locator fields, initialized inline using `this.page.locator(...)`
- Constructor: `constructor(private readonly page: Page) {}`
- Methods are async, return `Promise<void>` unless they return data
- Assertion helpers (`expectXxx`) live on the page, not in tests
- Single quotes, semicolons, trailing commas (es5)
- Allure: `epic`/`feature`/`severity`/`story`/`tag` are **runtime** functions awaited inside tests (not Playwright `.tag` decorators)

## After scaffolding

```bash
npm run typecheck
npm run lint
```

Fix any errors before claiming the scaffold works. Defer to `self-verification-guardrail` before running the new spec to confirm it works end-to-end.
