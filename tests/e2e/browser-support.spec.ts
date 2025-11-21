import { test, expect } from '@playwright/test';

test.describe('Browser Support', () => {
  test('should trigger callback after timeout', async ({ page }) => {
    // Install fake clock
    await page.clock.install();
    await page.goto('about:blank');

    // Inject the built library
    await page.addScriptTag({ path: './dist/idle-timeout.umd.js' });

    // Setup library in browser context
    await page.evaluate(() => {
      (window as any).triggered = false;

      // @ts-ignore
      window.idleTimeout(
        () => {
          (window as any).triggered = true;
        },
        {
          element: document,
          timeout: 2000,
          loop: false
        }
      );
    });

    // Fast-forward time
    await page.clock.runFor(2500);

    // Verify result
    const triggered = await page.evaluate(() => (window as any).triggered);
    expect(triggered).toBe(true);
  });
});
