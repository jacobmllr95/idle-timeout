import { test, expect } from './fixtures';

for (const bundle of ['idle-timeout.umd.js', 'idle-timeout.min.umd.js']) {
  test.describe(bundle, () => {
    test.use({ bundle });

    test('calls back once with the monitored element and timeout', async ({ page, idleTimer }) => {
      await page.clock.runFor(999);
      expect(await idleTimer.calls()).toEqual([]);

      await page.clock.runFor(1);
      expect(await idleTimer.calls()).toEqual([{ elementIsDocument: true, timeout: 1000 }]);

      await page.clock.runFor(1000);
      expect(await idleTimer.calls()).toHaveLength(1);
    });

    test('restarts the countdown on keyboard activity', async ({ page, idleTimer }) => {
      await page.clock.runFor(500);
      await idleTimer.activity();

      await page.clock.runFor(999);
      expect(await idleTimer.calls()).toEqual([]);

      await page.clock.runFor(1);
      expect(await idleTimer.calls()).toHaveLength(1);
    });

    test('resumes with the remaining time after a pause', async ({ page, idleTimer }) => {
      await page.clock.runFor(400);
      await idleTimer.pause();

      await page.clock.runFor(2000);
      expect(await idleTimer.calls()).toEqual([]);

      await idleTimer.resume();
      await page.clock.runFor(599);
      expect(await idleTimer.calls()).toEqual([]);

      await page.clock.runFor(1);
      expect(await idleTimer.calls()).toHaveLength(1);
    });
  });
}
