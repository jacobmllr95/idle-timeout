export default class IdleTimeout {
  constructor(callback, options = {}) {
    this.timeoutFunction = null;
    this.isIdle = false;

    this.boundHandleEvent = event => this.handleEvent(event);
    this.eventNames = [
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

    this.startTime = null;
    this.remainingTime = null;
    this.lastPageX = -1;
    this.lastPageY = -1;

    this.callback = callback;
    this.options = Object.assign(
      {
        element: document,
        timeout: 60 * 1000 * 5,
        loop: false
      },
      options
    );

    this.init();
  }

  init() {
    this.eventNames.forEach(eventName => {
      this.options.element.addEventListener(eventName, this.boundHandleEvent);
    });

    this.resetTimeout();
  }

  resetTimeout() {
    if (this.timeoutFunction) {
      clearTimeout(this.timeoutFunction);
      this.timeoutFunction = null;
    }

    if (this.isIdle && !this.options.loop) {
      return;
    }

    this.timeoutFunction = setTimeout(() => {
      this.handleTimeout();
    }, this.remainingTime || this.options.timeout);

    this.startTime = new Date().getTime();
  }

  handleEvent(event) {
    if (this.remainingTime) {
      return;
    }

    if (event.type === 'mousemove') {
      if (
        (typeof event.pageX === 'undefined' && typeof event.pageY === 'undefined') ||
        (event.pageX === this.lastPageX && event.pageY === this.lastPageY)
      ) {
        return;
      }

      this.lastPageX = event.pageX;
      this.lastPageY = event.pageY;
    }

    this.resetTimeout();
  }

  handleTimeout() {
    this.isIdle = true;
    this.resetTimeout();

    this.callback();
  }

  pause() {
    let remainingTime = this.startTime + this.options.timeout - new Date().getTime();
    if (remainingTime <= 0) {
      return;
    }

    this.remainingTime = remainingTime;

    if (this.timeoutFunction) {
      clearTimeout(this.timeoutFunction);
      this.timeoutFunction = null;
    }
  }

  resume() {
    if (!this.remainingTime) {
      return;
    }

    this.resetTimeout();
    this.remainingTime = null;
  }

  reset() {
    this.isIdle = false;
    this.remainingTime = null;
    this.resetTimeout();
  }

  destroy() {
    this.eventNames.forEach(eventName => {
      this.options.element.removeEventListener(eventName, this.boundHandleEvent);
    });

    if (this.timeoutFunction) {
      clearTimeout(this.timeoutFunction);
    }

    this.timeoutFunction = null;
    this.isIdle = null;
    this.boundHandleEvent = null;
    this.eventNames = null;
    this.startTime = null;
    this.remainingTime = null;
    this.lastPageX = null;
    this.lastPageY = null;
    this.callback = null;
    this.options = null;
  }

  get idle() {
    return this.isIdle;
  }

  set timeout(value) {
    this.options.timeout = value;
  }

  set loop(value) {
    this.options.loop = value;
  }

  set idle(value) {
    if (value) {
      this.handleTimeout();
    } else {
      this.reset();
    }
  }
}
