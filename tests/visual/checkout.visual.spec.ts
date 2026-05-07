import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';

test.describe('Checkout Info — Visual', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Visual Regression');
    await feature('Checkout');
    await loginPage.goto();
    await loginPage.loginAs(standardUser);
  });

  test('checkout info form empty — baseline', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    visualSnapshot,
  }) => {
    await story('Checkout info form empty state renders consistently');
    await severity('normal');
    await tag('visual');

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.expectLoaded();
    await visualSnapshot('checkout-info-form-empty');
  });
});
