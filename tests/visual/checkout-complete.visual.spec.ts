import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';
import { buildCheckoutInfo } from '@/testdata/factories';

test.describe('Checkout Complete — Visual', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Visual Regression');
    await feature('Checkout');
    await loginPage.goto();
    await loginPage.loginAs(standardUser);
  });

  test('order confirmation page — baseline', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    visualSnapshot,
  }) => {
    await story('Order confirmation page renders consistently');
    await severity('normal');
    await tag('visual');

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm(buildCheckoutInfo());
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.expectOrderConfirmed();
    await visualSnapshot('checkout-thank-you');
  });
});
