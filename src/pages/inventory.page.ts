import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '@/components/header.component';
import { ProductCardComponent } from '@/components/product-card.component';
import type { SortOption } from '@/types';

const SORT_VALUES: Record<SortOption, string> = {
  az: 'az',
  za: 'za',
  lohi: 'lohi',
  hilo: 'hilo',
};

export class InventoryPage {
  private readonly title: Locator = this.page.locator('.title');
  private readonly sortSelect: Locator = this.page.locator('[data-test="product-sort-container"]');
  private readonly inventoryItems: Locator = this.page.locator('.inventory_item');
  readonly header: HeaderComponent = new HeaderComponent(this.page.locator('#header_container'));

  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  productByName(name: string): ProductCardComponent {
    return new ProductCardComponent(
      this.inventoryItems.filter({
        has: this.page.locator('.inventory_item_name', { hasText: name }),
      }),
    );
  }

  async addProductToCart(name: string): Promise<void> {
    await this.productByName(name).addToCart();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(SORT_VALUES[option]);
  }

  async getItemNames(): Promise<string[]> {
    const items = await this.inventoryItems.locator('.inventory_item_name').allTextContents();
    return items.map((s) => s.trim());
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.inventoryItems).toHaveCount(count);
  }
}
