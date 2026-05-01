import { expect, type Locator, type Page } from '@playwright/test';
import type { User } from '@/types';

export class LoginPage {
  private readonly usernameInput: Locator = this.page.locator('[data-test="username"]');
  private readonly passwordInput: Locator = this.page.locator('[data-test="password"]');
  private readonly loginButton: Locator = this.page.locator('[data-test="login-button"]');
  private readonly errorMessage: Locator = this.page.locator('[data-test="error"]');

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async loginAs(user: User): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }

  async expectErrorContains(text: string): Promise<void> {
    await expect(this.errorMessage).toContainText(text);
  }

  async expectErrorVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}
