import AxeBuilder from '@axe-core/playwright';
import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test, expect } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';

/**
 * Known a11y violations on saucedemo, documented and triaged. Real-world a11y
 * testing maintains an allowlist with rationale rather than failing on any
 * violation — that's the only way the suite stays green long enough to catch
 * NEW regressions instead of the same baseline noise.
 *
 * Each entry should ideally link to a tracking issue and have an owner +
 * target-fix date in a real codebase.
 */
const KNOWN_VIOLATIONS: Record<string, string> = {
  'select-name':
    'Sort dropdown is missing an aria-label. Demo-site bug; would be tracked as JIRA in a real product.',
};

test.describe('Accessibility — saucedemo', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Accessibility');
    await feature('WCAG 2 A/AA scan');
    await loginPage.goto();
    await loginPage.loginAs(standardUser);
  });

  test('inventory page has no NEW critical/serious a11y violations', async ({
    page,
    inventoryPage,
  }) => {
    await story('Inventory page passes critical/serious axe rules (with allowlist)');
    await severity('normal');
    await tag('a11y');

    await inventoryPage.expectLoaded();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    // Always attach the full violation set — visible in Allure regardless of
    // pass/fail. Reviewers can see the baseline without having to run the suite.
    await test.info().attach('axe-violations', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const newBlocking = results.violations.filter(
      (v) => (v.impact === 'critical' || v.impact === 'serious') && !(v.id in KNOWN_VIOLATIONS),
    );

    expect(
      newBlocking,
      `New critical/serious a11y violations (not in allowlist):\n${newBlocking
        .map((v) => `  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
        .join('\n')}`,
    ).toEqual([]);
  });
});
