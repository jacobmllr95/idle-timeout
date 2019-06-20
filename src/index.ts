import IdleTimeout from './IdleTimeout';
import OptionsInterface from './interfaces/Options';

const idleTimeout = (callback: () => void, options?: OptionsInterface | undefined): IdleTimeout =>
  new IdleTimeout(callback, options);

export default idleTimeout;
