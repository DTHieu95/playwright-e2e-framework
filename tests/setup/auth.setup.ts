import { test as setup, expect } from '@playwright/test';
import { standardUser } from '@/testdata/users';

const STORAGE_PATH = 'playwright/.auth/standard-user.json';

setup('authenticate as standard user', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(standardUser.username);
  await page.locator('[data-test="password"]').fill(standardUser.password);
  await page.locator('[data-test="login-button"]').click();

  // Wait for the redirect to inventory before saving state — otherwise we'd
  // persist a half-authenticated session.
  await page.waitForURL('**/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');

  await page.context().storageState({ path: STORAGE_PATH });
});
