import OptionsInterface from './interfaces/Options';

/** Creates an idle timeout instance. */
export default class IdleTimeout {
  /** The callback function to invoke when the timeout is complete. */
  protected callback: () => void;

  /** The merged configuration options for the timeout. */
  protected options: OptionsInterface;

  /** The timeout handle to reset the timeout. */
  protected timeoutHandle: number | null = null;

  /** Whether the timeout is idle. */
  protected isIdle: boolean = false;

  /** The start time of the timeout in milliseconds. */
  protected startTime: number = 0;

  /** The remaining time of the timeout in milliseconds. */
  protected remainingTime: number = 0;

  /** The last X-axis position on the page. */
  protected lastPageX: number = -1;

  /** The last Y-axis position on the page. */
  protected lastPageY: number = -1;

  /** The input event names. */
  protected eventNames: string[] = [
    'DOMMouseScroll',
    'mousedown',
    'mousemove',
    'mousewheel',
    'MSPointerDown',
    'MSPointerMove',
    'keydown',
    'touchmove',
    'touchstart',
    'wheel'
  ];

  /**
   * The idle timeout constructor.
   * @param {Function} callback The callback function to invoke when the timeout is complete.
   * @param {object} [options] The configuration options for the timeout.
   * @returns {void}
   */
  public constructor(callback: () => void, options?: OptionsInterface) {
    this.callback = callback;
    this.options = {
      element: document.body,
      loop: false,
      timeout: 60 * 1000 * 5, // 5 minutes
      ...options
    };

    const element = this.options.element;
    this.eventNames.forEach((eventName): void => {
      element.addEventListener(eventName, this.handleEvent);
    });

    this.resetTimeout();
  }

  /**
   * Pause the timeout.
   * @returns {void}
   */
  public pause(): void {
    const remainingTime: number = this.startTime + this.options.timeout - new Date().getTime();
    if (remainingTime <= 0) {
      return;
    }

    this.remainingTime = remainingTime;

    if (this.timeoutHandle) {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  /**
   * Resume the paused timeout.
   * @returns {void}
   */
  public resume(): void {
    if (this.remainingTime <= 0) {
      return;
    }

    this.resetTimeout();
    this.remainingTime = 0;
  }

  /**
   * Reset the timeout.
   * @returns {void}
   */
  public reset(): void {
    this.isIdle = false;
    this.remainingTime = 0;
    this.resetTimeout();
  }

  /**
   * Destroy the instance.
   * @returns {void}
   */
  public destroy(): void {
    const element = this.options.element;
    this.eventNames.forEach((eventName): void => {
      element.removeEventListener(eventName, this.handleEvent);
    });

    if (this.timeoutHandle) {
      window.clearTimeout(this.timeoutHandle);
    }
  }

  /**
   * Reset the timeout function.
   * @returns {void}
   */
  protected resetTimeout(): void {
    if (this.timeoutHandle) {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    if (this.isIdle && !this.options.loop) {
      return;
    }

    this.timeoutHandle = window.setTimeout((): void => {
      this.handleTimeout();
    }, this.remainingTime || this.options.timeout);

    this.startTime = new Date().getTime();
  }

  /**
   * Handle the input events.
   * @param {Event} event The input event.
   * @returns {void}
   */
  protected handleEvent = (event: Event): void => {
    if (this.remainingTime > 0) {
      return;
    }

    if (event.type === 'mousemove') {
      const { pageX, pageY } = event as MouseEvent;
      if (
        (pageX === undefined && pageY === undefined) ||
        (pageX === this.lastPageX && pageY === this.lastPageY)
      ) {
        return;
      }

      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }

    this.resetTimeout();
  };

  /**
   * Handle the completed timeout.
   * @returns {void}
   */
  protected handleTimeout(): void {
    this.isIdle = true;
    this.resetTimeout();

    this.callback(this.options.element);
  }

  /** Gets whether the timeout is idle. */
  public get idle(): boolean {
    return this.isIdle;
  }

  /**
   * Sets wether the timeout should restart on completion.
   * @param {boolean} value Wether the timeout should restart on completion.
   */
  public set loop(value: boolean) {
    this.options.loop = value;
  }

  /**
   * Sets the idle timeout in milliseconds.
   * @param {number} value The idle timeout in milliseconds.
   */
  public set timeout(value: number) {
    this.options.timeout = value;
  }

  /**
   * Sets whether the timeout is idle.
   * @param {boolean} value Whether the timeout is idle.
   */
  public set idle(value: boolean) {
    if (value) {
      this.handleTimeout();
    } else {
      this.reset();
    }
  }
}
