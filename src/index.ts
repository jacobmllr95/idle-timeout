import IdleTimeout from './IdleTimeout';
import OptionsInterface from './interfaces/Options';

export { IdleTimeout, OptionsInterface };

export default (callback: () => void, options?: OptionsInterface | undefined) =>
  new IdleTimeout(callback, options);
