import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';
import { buildCheckoutInfo } from '@/testdata/factories';

test.describe('End-to-end checkout', () => {
  test('user buys one item and reaches order confirmation', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await epic('Shopping');
    await feature('Checkout');
    await story('Single-item purchase flow');
    await severity('critical');
    await tag('e2e');
    await tag('smoke');

    await test.step('log in as standard user', async () => {
      await loginPage.goto();
      await loginPage.loginAs(standardUser);
      await inventoryPage.expectLoaded();
    });

    await test.step('add backpack to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.header.expectCartBadgeCount(1);
    });

    await test.step('open cart and verify contents', async () => {
      await inventoryPage.header.openCart();
      await cartPage.expectLoaded();
      await cartPage.expectItemCount(1);
      await cartPage.expectContainsProduct('Sauce Labs Backpack');
    });

    await test.step('fill checkout information', async () => {
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.expectLoaded();
      await checkoutInfoPage.fillForm(buildCheckoutInfo());
      await checkoutInfoPage.continue();
    });

    await test.step('confirm overview and finish', async () => {
      await checkoutOverviewPage.expectLoaded();
      await checkoutOverviewPage.expectItemCount(1);
      await checkoutOverviewPage.finish();
    });

    await test.step('order confirmation displayed', async () => {
      await checkoutCompletePage.expectOrderConfirmed();
    });
  });
});
