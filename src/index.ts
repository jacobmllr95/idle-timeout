import { IdleTimeout } from './IdleTimeout';
import { UserOptions } from './types';

const idleTimeout = (
  callback: (element: HTMLElement, timeout?: number) => void,
  options?: UserOptions
): IdleTimeout => new IdleTimeout(callback, options);

export default idleTimeout;
