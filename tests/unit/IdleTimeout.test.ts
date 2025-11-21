import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { IdleTimeout } from '../../src/IdleTimeout';

describe('IdleTimeout class', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean body
    document.body.innerHTML = '';
  });

  it('should register event listeners and use default "element" when none provided', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const cb = vi.fn();
    const idle = new IdleTimeout(cb);

    // Default element should be document.body
    expect((idle as any).options.element).toBe(document.body);

    // Create instance with a custom element
    const idle2 = new IdleTimeout(cb, { element: el, timeout: 100 });
    expect((idle2 as any).options.element).toBe(el);

    // Event listeners should be registered
    const events = (idle2 as any).eventNames as string[];
    events.forEach((ev) => {
      // There's no direct API to check listeners, but dispatching should not throw
      el.dispatchEvent(new Event(ev));
    });

    idle2.destroy();
  });

  it('should call "callback" after timeout and set "idle" flag', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { element: el, timeout: 100 });

    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(idle.idle).toBe(true);
  });

  it('should pause timer and resume with remaining time', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { element: el, timeout: 1000 });

    // Advance half the timeout
    vi.advanceTimersByTime(400);
    idle.pause();

    // Advance beyond original timeout - callback should not be called
    vi.advanceTimersByTime(1000);
    expect(cb).not.toHaveBeenCalled();

    // Resume should continue with remaining time (~600ms)
    idle.resume();
    vi.advanceTimersByTime(599);
    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should reset idle state and restart timeout', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 200 });

    vi.advanceTimersByTime(200);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(idle.idle).toBe(true);

    idle.reset();
    expect(idle.idle).toBe(false);

    // Should call again after another full timeout
    vi.advanceTimersByTime(200);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('should remove listeners and prevent callbacks after destroy', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { element: el, timeout: 1000 });

    // Simulate event should reset timeout without errors
    el.dispatchEvent(new Event('mousemove'));

    idle.destroy();

    // After destroy, dispatching events should not throw and no further callbacks occur
    el.dispatchEvent(new Event('mousemove'));
    vi.advanceTimersByTime(2000);
    expect(cb).not.toHaveBeenCalled();
  });

  it('should ignore "mousemove" events with identical coordinates', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { element: el, timeout: 100 });

    // Dispatch "mousemove" with coordinates
    const m1 = new MouseEvent('mousemove', { bubbles: true });
    // Set `pageX`/`pageY` on the event object (not part of `MouseEventInit` type)
    Object.defineProperty(m1, 'pageX', { value: 10 });
    Object.defineProperty(m1, 'pageY', { value: 20 });
    el.dispatchEvent(m1);

    // Duplicate coordinates should be ignored
    const m2 = new MouseEvent('mousemove', { bubbles: true });
    Object.defineProperty(m2, 'pageX', { value: 10 });
    Object.defineProperty(m2, 'pageY', { value: 20 });
    el.dispatchEvent(m2);

    // Advance full timeout
    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should call "callback" repeatedly when "loop" is "true"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 100, loop: true });

    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);

    // Because loop=true it should trigger again
    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('should trigger timeout when setting "idle=true" and reset when "idle=false"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 500 });

    idle.idle = true;
    expect(cb).toHaveBeenCalledTimes(1);
    expect(idle.idle).toBe(true);

    // Setting `idle=false` resets
    idle.idle = false;
    expect(idle.idle).toBe(false);
  });

  it('should ignore events when "remainingTime" greater than "0"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    // Simulate paused state
    (idle as any).remainingTime = 500;

    const spy = vi.spyOn(IdleTimeout.prototype as any, 'resetTimeout');
    document.body.dispatchEvent(new Event('mousemove'));

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should ignore "mousemove" when "pageX" and "pageY" are "undefined"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    const spy = vi.spyOn(IdleTimeout.prototype as any, 'resetTimeout');

    // Dispatch mousemove without `pageX`/`pageY` - ensure properties are `undefined`
    const m = new MouseEvent('mousemove', { bubbles: true });
    try {
      Object.defineProperty(m, 'pageX', { value: undefined });
      Object.defineProperty(m, 'pageY', { value: undefined });
    } catch (e) {
      // Some environments might not allow redefining; ignore
    }
    document.body.dispatchEvent(m);

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should return early from pause if "timeout" already expired', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    // Simulate a start time far in the past to force `remainingTime` <= `0`
    (idle as any).startTime = new Date().getTime() - 5000;

    idle.pause();

    expect((idle as any).remainingTime).toBe(0);
  });

  it('should return early from resume when there is no "remainingTime"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    const spy = vi.spyOn(IdleTimeout.prototype as any, 'resetTimeout');
    // `remainingTime` is `0` by default
    idle.resume();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should update options via setters for "loop" and "timeout"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000, loop: false });

    idle.loop = true;
    expect((idle as any).options.loop).toBe(true);

    idle.timeout = 12345;
    expect((idle as any).options.timeout).toBe(12345);
  });

  it('should clear existing timeout handle when resetting', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    // Ensure a `timeoutHandle` exists
    expect((idle as any).timeoutHandle).not.toBeNull();

    const prev = (idle as any).timeoutHandle;
    // Call `resetTimeout` directly to force clearing
    (idle as any).resetTimeout();

    // `timeoutHandle` should be replaced (or `null` then set again)
    expect((idle as any).timeoutHandle).not.toBe(prev);
  });

  it('should not set new timeout when "isIdle" and "loop=false"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000, loop: false });

    // Set idle state and ensure loop is `false`
    (idle as any).isIdle = true;
    idle.loop = false;

    // Spy on `setTimeout`
    const spy = vi.spyOn(window, 'setTimeout');
    (idle as any).resetTimeout();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should reset timeout on non-"mousemove" events', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    const spy = vi.spyOn(idle as any, 'resetTimeout');

    // Dispatch a non-mousemove event
    document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not call "clearTimeout" when "timeoutHandle" is "null" during pause', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    // Ensure ` remainingTime` positive by setting `startTime` to now
    (idle as any).startTime = new Date().getTime();
    // Ensure `timeoutHandle` is `null`
    (idle as any).timeoutHandle = null;

    const spy = vi.spyOn(window, 'clearTimeout');
    idle.pause();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should clear timeout during destroy if "timeoutHandle" present', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    // Simulate existing `timeoutHandle`
    (idle as any).timeoutHandle = 123 as any;

    const spy = vi.spyOn(window, 'clearTimeout');
    idle.destroy();
    expect(spy).toHaveBeenCalledWith(123);
    spy.mockRestore();
  });

  it('should not call "clearTimeout" during destroy when "timeoutHandle" is "null"', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    (idle as any).timeoutHandle = null;
    const spy = vi.spyOn(window, 'clearTimeout');
    idle.destroy();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should treat "mousemove" with one "undefined" coordinate as activity', () => {
    const cb = vi.fn();
    const idle = new IdleTimeout(cb, { timeout: 1000 });

    const spy = vi.spyOn(idle as any, 'resetTimeout');

    const m = new MouseEvent('mousemove', { bubbles: true });
    Object.defineProperty(m, 'pageX', { value: 5 });
    try {
      Object.defineProperty(m, 'pageY', { value: undefined });
    } catch (e) {}

    document.body.dispatchEvent(m);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
