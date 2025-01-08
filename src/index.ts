import { IdleTimeout } from './IdleTimeout';
import { Options } from './types';

const idleTimeout = (callback: () => void, options?: Options | undefined): IdleTimeout =>
  new IdleTimeout(callback, options);

export default idleTimeout;
