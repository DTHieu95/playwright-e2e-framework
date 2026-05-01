import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  // Locators a spec asserts against directly are exposed as readonly (public).
  // Helper methods cover the common assertion below.
  readonly confirmationHeader: Locator = this.page.locator('[data-test="complete-header"]');
  private readonly confirmationText: Locator = this.page.locator('[data-test="complete-text"]');
  private readonly backHomeButton: Locator = this.page.locator('[data-test="back-to-products"]');

  constructor(private readonly page: Page) {}

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(this.confirmationText).toBeVisible();
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
