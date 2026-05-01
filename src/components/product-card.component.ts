import { expect, type Locator } from '@playwright/test';

export class ProductCardComponent {
  private readonly title: Locator = this.root.locator('.inventory_item_name');
  private readonly price: Locator = this.root.locator('.inventory_item_price');
  private readonly addToCartButton: Locator = this.root.getByRole('button', {
    name: 'Add to cart',
  });
  private readonly removeButton: Locator = this.root.getByRole('button', { name: 'Remove' });

  constructor(private readonly root: Locator) {}

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async remove(): Promise<void> {
    await this.removeButton.click();
  }

  async getName(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  async getPrice(): Promise<string> {
    return (await this.price.textContent())?.trim() ?? '';
  }

  async expectInCart(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
  }

  async expectNotInCart(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
  }
}
