import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';

test.describe('Login — Visual', () => {
  test.beforeEach(async () => {
    await epic('Visual Regression');
    await feature('Login');
  });

  test('login page empty state — baseline', async ({ loginPage, visualSnapshot }) => {
    await story('Empty login form renders consistently');
    await severity('normal');
    await tag('visual');

    await loginPage.goto();
    await visualSnapshot('login-empty');
  });
});
