import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { InventoryPage } from '@/pages/inventory.page';
import { CartPage } from '@/pages/cart.page';
import { CheckoutInfoPage } from '@/pages/checkout-info.page';
import { CheckoutOverviewPage } from '@/pages/checkout-overview.page';
import { CheckoutCompletePage } from '@/pages/checkout-complete.page';

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});
