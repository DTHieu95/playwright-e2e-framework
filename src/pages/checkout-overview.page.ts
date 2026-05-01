import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  private readonly title: Locator = this.page.locator('.title');
  private readonly finishButton: Locator = this.page.locator('[data-test="finish"]');
  private readonly cancelButton: Locator = this.page.locator('[data-test="cancel"]');
  private readonly summaryItems: Locator = this.page.locator('.cart_item');
  private readonly subtotalLabel: Locator = this.page.locator('.summary_subtotal_label');
  private readonly totalLabel: Locator = this.page.locator('.summary_total_label');

  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.summaryItems).toHaveCount(count);
  }

  async expectSubtotalContains(text: string): Promise<void> {
    await expect(this.subtotalLabel).toContainText(text);
  }

  async expectTotalContains(text: string): Promise<void> {
    await expect(this.totalLabel).toContainText(text);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
