import { expect, type Locator, type Page } from '@playwright/test';
import { CheckoutFormComponent } from '@/components/checkout-form.component';
import type { CheckoutInfo } from '@/types';

export class CheckoutInfoPage {
  private readonly title: Locator = this.page.locator('.title');
  private readonly continueButton: Locator = this.page.locator('[data-test="continue"]');
  private readonly cancelButton: Locator = this.page.locator('[data-test="cancel"]');
  private readonly errorMessage: Locator = this.page.locator('[data-test="error"]');
  readonly form: CheckoutFormComponent = new CheckoutFormComponent(
    this.page.locator('.checkout_info'),
  );

  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async fillForm(info: CheckoutInfo): Promise<void> {
    await this.form.fill(info);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectErrorContains(text: string): Promise<void> {
    await expect(this.errorMessage).toContainText(text);
  }
}
