import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';
import { standardUser } from '@/testdata/users';

test.describe('Cart — Visual', () => {
  test.beforeEach(async ({ loginPage }) => {
    await epic('Visual Regression');
    await feature('Cart');
    await loginPage.goto();
    await loginPage.loginAs(standardUser);
  });

  test('cart with one item — baseline', async ({ inventoryPage, cartPage, visualSnapshot }) => {
    await story('Cart with single item renders consistently');
    await severity('normal');
    await tag('visual');

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.header.openCart();
    await cartPage.expectLoaded();
    await visualSnapshot('cart-with-one-item');
  });
});
