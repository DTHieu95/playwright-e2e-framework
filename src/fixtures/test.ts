import { mergeTests } from '@playwright/test';
import { test as pageTest } from './pages.fixture';
import { test as apiTest } from './api.fixture';
import { test as visualTest } from './visual.fixture';

export const test = mergeTests(pageTest, apiTest, visualTest);
export { expect } from '@playwright/test';
