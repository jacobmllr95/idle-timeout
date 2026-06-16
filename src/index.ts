import { IdleTimeout } from './IdleTimeout';
import { TimeoutCallback, UserOptions } from './types';

const idleTimeout = (callback: TimeoutCallback, options?: UserOptions): IdleTimeout =>
  new IdleTimeout(callback, options);

export default idleTimeout;
