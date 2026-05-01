import { type Locator } from '@playwright/test';
import type { CheckoutInfo } from '@/types';

export class CheckoutFormComponent {
  private readonly firstNameInput: Locator = this.root.locator('[data-test="firstName"]');
  private readonly lastNameInput: Locator = this.root.locator('[data-test="lastName"]');
  private readonly zipCodeInput: Locator = this.root.locator('[data-test="postalCode"]');

  constructor(private readonly root: Locator) {}

  async fill(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.zipCodeInput.fill(info.zipCode);
  }
}
