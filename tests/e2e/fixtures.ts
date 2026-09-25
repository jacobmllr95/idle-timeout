import { test as base, expect } from '@playwright/test';
import type idleTimeout from '../../src';

interface CallbackCall {
  elementIsDocument: boolean;
  timeout?: number;
}

interface IdleTimer {
  calls(): Promise<CallbackCall[]>;
  activity(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
}

declare global {
  interface Window {
    idleTimeout: typeof idleTimeout;
  }
}

export const test = base.extend<{ bundle: string; idleTimer: IdleTimer }>({
  bundle: ['idle-timeout.umd.js', { option: true }],

  idleTimer: async ({ page, bundle }, use) => {
    await page.goto('about:blank');
    await page.clock.install({ time: 0 });
    // Freeze time before creating the timer; tests advance it explicitly with runFor().
    await page.clock.pauseAt(1000);
    await page.addScriptTag({ path: `./dist/${bundle}` });

    const state = await page.evaluateHandle(() => {
      const calls: CallbackCall[] = [];
      const instance = window.idleTimeout(
        (element, timeout) => calls.push({ elementIsDocument: element === document, timeout }),
        { element: document, timeout: 1000 }
      );
      return { instance, calls };
    });

    await use({
      calls: () => state.evaluate(({ calls }) => calls),
      activity: () =>
        page.evaluate(() => {
          document.dispatchEvent(new KeyboardEvent('keydown'));
        }),
      pause: () => state.evaluate(({ instance }) => instance.pause()),
      resume: () => state.evaluate(({ instance }) => instance.resume())
    });

    await state.evaluate(({ instance }) => instance.destroy());
    await state.dispose();
  }
});

export { expect };
