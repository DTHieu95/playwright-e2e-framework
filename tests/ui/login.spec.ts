import { epic, feature, severity, story, tag } from 'allure-js-commons';
import { test } from '@/fixtures/test';
import { lockedOutUser, standardUser } from '@/testdata/users';

test.describe('Login', () => {
  test.beforeEach(async () => {
    await epic('Authentication');
    await feature('Login');
  });

  test('valid user lands on the inventory page', async ({ loginPage, inventoryPage }) => {
    await story('Standard user can log in');
    await severity('critical');
    await tag('smoke');

    await test.step('navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('submit valid credentials', async () => {
      await loginPage.loginAs(standardUser);
    });

    await test.step('inventory page is displayed', async () => {
      await inventoryPage.expectLoaded();
    });
  });

  test('locked-out user sees error message', async ({ loginPage }) => {
    await story('Locked-out user is blocked');
    await severity('normal');
    await tag('regression');

    await test.step('navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('submit locked-out credentials', async () => {
      await loginPage.loginAs(lockedOutUser);
    });

    await test.step('error message indicates lockout', async () => {
      await loginPage.expectErrorContains('locked out');
    });
  });

  test('empty credentials show validation error', async ({ loginPage }) => {
    await story('Empty form is rejected');
    await severity('minor');
    await tag('regression');

    await test.step('navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('submit empty form', async () => {
      await loginPage.loginAs({ username: '', password: '' });
    });

    await test.step('username-required error appears', async () => {
      await loginPage.expectErrorContains('Username is required');
    });
  });
});
