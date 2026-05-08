---
name: self-verification-guardrail
description: Use when about to verify newly written or modified test code (page objects, components, fixtures, API clients, specs) — enforces that verification executes the committed code path, never an AI-improvised alternative
user-invocable: false
---

# Self-Verification Guardrail

When verifying that newly written or modified code works, the verification MUST exercise the **committed function or locator** from the codebase. Improvised equivalents are forbidden because they hide drift between what was written and what gets tested.

## Why This Rule Exists

Without this guardrail a subtle failure mode appears:

1. AI writes `LoginPage.loginAs()` that targets the wrong field.
2. AI then "verifies" by running `playwright-cli fill "[data-test=username]" "..."` — improvising the selector instead of calling the committed method.
3. The improvised fill succeeds, the AI reports "verified", the committed code is still broken, CI breaks later.

The bug lives in the committed code, but verification used a different path and never touched it.

## When This Applies

Trigger this skill before any of these:

- Running `playwright-cli` commands to confirm a new method on `src/pages/*.page.ts` or `src/components/*.component.ts`
- Running an ad-hoc script in `playwright-cli run-code` that interacts with the page
- Modifying a locator field on any page or component object
- Modifying a method on `src/api/*.client.ts`
- Asking "did my change work?" and exercising the page manually
- Editing a fixture in `src/fixtures/`

It does NOT apply to:

- Reading existing code without touching the page
- Running the project's own test suite via `npm run test:*` — that already exercises committed code by definition

## Required Verification Pattern

### For page objects and components

Always go through the committed method, not the underlying selector.

```ts
// In playwright-cli run-code or a scratch script (preferred):
import { LoginPage } from './src/pages/login.page';
import { standardUser } from './src/testdata/users';

const loginPage = new LoginPage(page);
await loginPage.loginAs(standardUser);   // calls the committed method
```

NOT:

```bash
# Forbidden — bypasses LoginPage.loginAs() entirely
playwright-cli fill '[data-test="username"]' "standard_user"
playwright-cli fill '[data-test="password"]' "secret_sauce"
playwright-cli click '[data-test="login-button"]'
```

### For locators

If a locator field was just added or changed, the verification must read it from the page object — not retype the selector.

```ts
const loginPage = new LoginPage(page);
await loginPage.expectErrorVisible();   // exercises the errorMessage locator + the assertion
```

NOT:

```bash
# Forbidden — does not exercise the locator definition
playwright-cli eval "document.querySelector('[data-test=\"error\"]') !== null"
```

### For API clients

```ts
import { BookerClient } from './src/api/booker.client';
const client = new BookerClient(request);
const created = await client.createBooking(payload);  // committed method
```

NOT a hand-rolled `request.post('/booking', ...)` that re-implements the client.

### For specs

Run the spec through Playwright, scoped tightly:

```bash
npx playwright test tests/ui/<name>.spec.ts --project=ui-chromium --grep "<test title>"
```

Don't manually re-execute the test body in `playwright-cli`.

### For visual specs

The `visualSnapshot` fixture wraps screenshot comparison with project-specific tolerances. Use it through the fixture in a real spec — never substitute raw `page.screenshot()` + `expect(...).toMatchSnapshot()` for "quick verification". And visual verification must run inside Docker (`npm run test:visual`), not against the local renderer.

## Workflow

1. **Identify the committed symbol(s)** — file path, class, method, exported function, locator field.
2. **Decide verification surface**:
   - Method changed → call it through its class.
   - Locator changed → assert via the page object's `expect…` helper.
   - Spec changed → run that spec file with `--grep`.
   - Fixture changed → run a spec that depends on the fixture.
3. **Write the verification** so it imports/instantiates from the committed file. No re-implementations, no "equivalent" selectors.
4. **Run it.** If it fails, fix the committed code — do not relax the verification to make it pass.
5. **Report what was verified**, naming the committed symbol exercised, so the user can audit the chain.

## Red Flags — Stop and Reconsider

| Thought | Reality |
|---------|---------|
| "I'll just click the button manually with playwright-cli to confirm the page works" | This bypasses the method you just wrote. Call it instead. |
| "The selector works when I type it directly into playwright-cli" | Then it should work when called through the page object. If it doesn't, the page object is broken. |
| "I'll write a quick eval to check the element exists" | The page object has a locator for this. Use it. |
| "It's faster to verify with a one-liner" | Faster verification that misses bugs is not faster overall. |

## Reporting Format

Report verification with:

- **Symbol exercised**: `<file>:<class>.<method>` or `<file>:<locator field>`
- **How**: import + call, or `npx playwright test <path> --grep <title>`
- **Outcome**: pass / fail / what changed in the trace

Example:

> Verified `src/pages/login.page.ts:LoginPage.loginAs()` by running `npx playwright test tests/ui/login.spec.ts --project=ui-chromium --grep "valid user"`. 1 passed in 3.2s.
