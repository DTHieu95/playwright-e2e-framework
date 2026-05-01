import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '@/components/header.component';

export class CartPage {
  private readonly title: Locator = this.page.locator('.title');
  private readonly cartItems: Locator = this.page.locator('.cart_item');
  private readonly checkoutButton: Locator = this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton: Locator = this.page.locator(
    '[data-test="continue-shopping"]',
  );
  readonly header: HeaderComponent = new HeaderComponent(this.page.locator('#header_container'));

  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectContainsProduct(name: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: name })).toHaveCount(1);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
