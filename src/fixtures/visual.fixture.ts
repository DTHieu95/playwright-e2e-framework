import { expect, test as base, type Locator } from '@playwright/test';

export type VisualSnapshotOptions = {
  /** Locators to mask (replaced with pink rectangles in the screenshot). */
  mask?: Locator[];
  /** Override default 0.2% pixel-diff threshold for a specific test. */
  maxDiffPixelRatio?: number;
  /** Take an element-scoped screenshot instead of full page. */
  clip?: { x: number; y: number; width: number; height: number };
};

export type VisualFixture = {
  visualSnapshot: (name: string, options?: VisualSnapshotOptions) => Promise<void>;
};

/**
 * Determinism layer wrapping `toHaveScreenshot()`. Centralizes wait-for-fonts,
 * wait-for-network-idle, and CSS animation/caret disabling so each spec stays terse.
 */
export const test = base.extend<VisualFixture>({
  visualSnapshot: async ({ page }, use) => {
    await use(async (name, options = {}) => {
      // 1. Wait for all initial resources (images, stylesheets) to load.
      await page.waitForLoadState('load');

      // 2. Wait for web fonts so we don't snapshot a FOUT frame.
      await page.evaluate(() => document.fonts.ready);

      // 3. Belt-and-suspenders: disable CSS animations + caret blink at the
      //    page level. Playwright's animations:'disabled' option below covers
      //    most cases but can miss late-attached transitions.
      await page.addStyleTag({
        content: `*, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          caret-color: transparent !important;
        }`,
      });

      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: options.maxDiffPixelRatio ?? 0.002,
        mask: options.mask ?? [],
        ...(options.clip ? { clip: options.clip } : {}),
      });
    });
  },
});
