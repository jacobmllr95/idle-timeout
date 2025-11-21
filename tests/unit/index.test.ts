import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import idleTimeout from '../../src/index';

describe('idleTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call callback after specified timeout', () => {
    const callback = vi.fn();

    idleTimeout(callback, {
      element: document.body,
      timeout: 1000,
      loop: false
    });

    // Fast-forward time
    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback before timeout', () => {
    const callback = vi.fn();

    idleTimeout(callback, {
      element: document.body,
      timeout: 1000
    });

    vi.advanceTimersByTime(999);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should reset timer on user activity', () => {
    const callback = vi.fn();
    const element = document.createElement('div');

    document.body.appendChild(element);

    idleTimeout(callback, {
      element: element,
      timeout: 1000
    });

    // Advance halfway
    vi.advanceTimersByTime(500);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'A', bubbles: true }));

    // Advance past the original timeout (total 1100ms)
    // But since we reset at 500ms, we should be safe until 1500ms
    vi.advanceTimersByTime(600);

    expect(callback).not.toHaveBeenCalled();

    // Advance to the new timeout (500ms + 1000ms = 1500ms total time)
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('calls callback repeatedly when loop is true', () => {
    const callback = vi.fn();

    idleTimeout(callback, {
      element: document.body,
      timeout: 1000,
      loop: true
    });

    // First expiry
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // Second expiry
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('resets timer for different user event types', () => {
    const callback = vi.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    idleTimeout(callback, {
      element,
      timeout: 1000,
      loop: false
    });

    // Advance halfway and dispatch different events that should reset the timer
    vi.advanceTimersByTime(400);
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    vi.advanceTimersByTime(400);
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    vi.advanceTimersByTime(400);
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'A' }));

    // Total progressed time is 1200 but resets happened, so callback should not
    // yet be called
    expect(callback).not.toHaveBeenCalled();

    // Wait timeout after last reset
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(element);
  });

  it('allows multiple independent instances on different elements', () => {
    const cbA = vi.fn();
    const cbB = vi.fn();
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.appendChild(a);
    document.body.appendChild(b);

    idleTimeout(cbA, { element: a, timeout: 500, loop: false });
    idleTimeout(cbB, { element: b, timeout: 1000, loop: false });

    // After 600ms, A should have fired, B not yet
    vi.advanceTimersByTime(600);
    expect(cbA).toHaveBeenCalledTimes(1);
    expect(cbB).not.toHaveBeenCalled();

    // After another 500ms, B should fire
    vi.advanceTimersByTime(500);
    expect(cbB).toHaveBeenCalledTimes(1);

    document.body.removeChild(a);
    document.body.removeChild(b);
  });

  it('supports multiple handlers on the same element without interference', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);

    idleTimeout(cb1, { element: el, timeout: 700, loop: false });
    idleTimeout(cb2, { element: el, timeout: 1200, loop: false });

    // Advance to 800ms -> cb1 should have fired, cb2 not yet
    vi.advanceTimersByTime(800);
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).not.toHaveBeenCalled();

    // Advance to 1200ms more -> cb2 should have fired
    vi.advanceTimersByTime(400);
    expect(cb2).toHaveBeenCalledTimes(1);

    document.body.removeChild(el);
  });
});
