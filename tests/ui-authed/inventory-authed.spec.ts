import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';

test.describe('Authenticated UI (storageState pattern)', () => {
  test('user lands directly on inventory without logging in again', async ({
    page,
    inventoryPage,
  }) => {
    await epic('Performance / Test Architecture');
    await feature('Storage state authentication');
    await story('Authenticated session is reused across tests');
    await severity('normal');
    await tag('architecture');

    await test.step('navigate straight to inventory', async () => {
      await page.goto('/inventory.html');
    });

    await test.step('inventory loads — no login form was needed', async () => {
      await inventoryPage.expectLoaded();
      await inventoryPage.expectItemCount(6);
    });
  });
});
