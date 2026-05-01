import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers omitted when not in CI so Playwright picks the local default (CPU/2);
  // `exactOptionalPropertyTypes` rejects passing `undefined` for an optional field.
  ...(process.env.CI ? { workers: 2 } : {}),

  // On CI we shard tests across runners. Each shard emits a `blob` report that the
  // `merge-reports` job assembles into a single HTML report. Locally we produce the
  // standard HTML report directly. Allure results are written by every run regardless
  // of mode — flat JSON files merge naturally when combined into one directory.
  reporter: process.env.CI
    ? [['blob'], ['list'], ['allure-playwright', { detail: true, suiteTitle: false }]]
    : [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright', { detail: true, suiteTitle: false }],
      ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    // Authentication setup: runs once, saves storage state, gates `ui-authed`.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts$/,
    },
    {
      name: 'ui-chromium',
      testMatch: /tests[\\/]ui[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui-mobile',
      testMatch: /tests[\\/]ui[\\/].*\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    // Demonstrates the storageState pattern: tests start already-authenticated.
    {
      name: 'ui-authed',
      testMatch: /tests[\\/]ui-authed[\\/].*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/standard-user.json',
      },
    },
    {
      name: 'api',
      testMatch: /tests[\\/]api[\\/].*\.spec\.ts/,
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
    // Accessibility scans via axe-core. Triages by impact rather than asserting
    // zero violations — real-world a11y testing requires impact-based gating.
    {
      name: 'a11y',
      testMatch: /tests[\\/]a11y[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
