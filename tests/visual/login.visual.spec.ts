import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';

test.describe('Login — Visual', () => {
  test.beforeEach(async () => {
    await epic('Visual Regression');
    await feature('Login');
  });

  test('login page empty state — baseline', async ({ loginPage, visualSnapshot, page }) => {
    await story('Empty login form renders consistently');
    await severity('normal');
    await tag('visual');

    await loginPage.goto();
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#ff00ff;z-index:99999;pointer-events:none;';
      document.body.appendChild(overlay);
    });
    await visualSnapshot('login-empty');
  });
});
