import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';

test.describe('Inventory — Visual', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Visual Regression');
    await feature('Inventory');
    await loginPage.goto();
    await loginPage.loginAs(standardUser);
  });

  test('inventory grid with 6 products — baseline', async ({ inventoryPage, visualSnapshot }) => {
    await story('Inventory grid renders consistently');
    await severity('normal');
    await tag('visual');

    await inventoryPage.expectLoaded();
    await visualSnapshot('inventory-products-loaded');
  });
});
