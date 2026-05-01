module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  ignorePatterns: [
    'node_modules/',
    'playwright-report/',
    'test-results/',
    'allure-report/',
    'allure-results/',
    '.husky/',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'playwright/expect-expect': [
      'error',
      {
        // Page-object helpers that wrap expect() internally. Plugin v2 matches by
        // exact identifier name (no globs), so each helper name must be enumerated.
        assertFunctionNames: [
          'expect',
          'expectLoaded',
          'expectErrorContains',
          'expectErrorVisible',
          'expectItemCount',
          'expectContainsProduct',
          'expectSubtotalContains',
          'expectTotalContains',
          'expectOrderConfirmed',
          'expectCartBadgeCount',
          'expectInCart',
          'expectNotInCart',
        ],
      },
    ],
    'playwright/no-conditional-in-test': 'error',
    'playwright/no-wait-for-timeout': 'error',
    'playwright/prefer-web-first-assertions': 'error',
    'playwright/no-skipped-test': 'warn',
  },
};
