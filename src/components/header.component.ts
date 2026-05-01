import { expect, type Locator } from '@playwright/test';

export class HeaderComponent {
  private readonly cartLink: Locator = this.root.locator('[data-test="shopping-cart-link"]');
  private readonly cartBadge: Locator = this.root.locator('.shopping_cart_badge');
  private readonly burgerButton: Locator = this.root.locator('#react-burger-menu-btn');
  // Logout link portal-renders to body, so it lives outside the header subtree.
  private readonly logoutLink: Locator = this.root.page().locator('#logout_sidebar_link');

  constructor(private readonly root: Locator) {}

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async logout(): Promise<void> {
    await this.burgerButton.click();
    await this.logoutLink.click();
  }
}
