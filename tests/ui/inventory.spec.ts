import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test, expect } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';

test.describe('Inventory', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Shopping');
    await feature('Inventory');
    await loginPage.goto();
    await loginPage.loginAs(standardUser);
  });

  test('lists all 6 products by default', async ({ inventoryPage }) => {
    await story('Catalog renders correctly');
    await severity('normal');
    await tag('smoke');

    await test.step('inventory page loaded', async () => {
      await inventoryPage.expectLoaded();
    });

    await test.step('exactly 6 products displayed', async () => {
      await inventoryPage.expectItemCount(6);
    });
  });

  test('sorts product names A→Z and Z→A', async ({ inventoryPage }) => {
    await story('User can sort products by name');
    await severity('normal');
    await tag('regression');

    // Capture default order first so the assertion compares an actual reorder,
    // not the tautology sort(arr) === sort(arr).
    const defaultOrder = await test.step('capture default product order', async () => {
      return inventoryPage.getItemNames();
    });

    const expectedAsc = [...defaultOrder].sort((a, b) => a.localeCompare(b));
    const expectedDesc = [...defaultOrder].sort((a, b) => b.localeCompare(a));

    await test.step('sort A→Z and verify order', async () => {
      await inventoryPage.sortBy('az');
      expect(await inventoryPage.getItemNames()).toEqual(expectedAsc);
    });

    await test.step('sort Z→A and verify order', async () => {
      await inventoryPage.sortBy('za');
      expect(await inventoryPage.getItemNames()).toEqual(expectedDesc);
    });
  });

  test('adding two products updates the cart badge to 2', async ({ inventoryPage }) => {
    await story('Cart badge reflects added products');
    await severity('critical');
    await tag('smoke');

    await test.step('add Sauce Labs Backpack to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
    });

    await test.step('add Sauce Labs Bike Light to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    });

    await test.step('cart badge shows 2', async () => {
      await inventoryPage.header.expectCartBadgeCount(2);
    });
  });
});
