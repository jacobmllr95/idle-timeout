/*!
 * IdleTimeout
 *
 * @version 0.0.4
 * @overview A basic idle state detector written in ES6.
 * @author Jacob Müller [jacob.mueller.elz@gmail.com]
 * @see {@link https://github.com/jackmu95/idle-timeout|GitHub}
 */

'use strict';

import {extend} from './utils';

class IdleTimeout {
  constructor(callback, options = {}) {
    this._timeoutFunction = null;
    this._idle = false;

    this._boundHandleEvent = event => this._handleEvent(event);
    this._eventNames = [
      'DOMMouseScroll',
      'mousedown', 'mousemove', 'mousewheel',
      'MSPointerDown', 'MSPointerMove',
      'keydown',
      'touchmove', 'touchstart',
      'wheel'
    ];

    this._startTime = null;
    this._remainingTime = null;
    this._lastPageX = -1;
    this._lastPageY = -1;

    this._callback = callback;
    this._options = extend({
      element: document,
      timeout: 60 * 1000 * 5,
      loop: false
    }, options);

    this._init();
  }

  _init() {
    this._eventNames.forEach(eventName => {
      this._options.element.addEventListener(eventName, this._boundHandleEvent);
    });

    this._reset();
  }

  _reset() {
    if (this._timeoutFunction) {
      clearTimeout(this._timeoutFunction);
      this._timeoutFunction = null;
    }

    if (this._idle && !this._options.loop) {
      return;
    }

    this._timeoutFunction = setTimeout(() => {
      this._handleTimeout();
    }, this._remainingTime || this._options.timeout);

    this._startTime = new Date().getTime();
  }

  _handleEvent(event) {
    if (this._remainingTime) {
      return false;
    }

    if (event.type === 'mousemove') {
      if ((typeof event.pageX === 'undefined' &&
              typeof event.pageY === 'undefined') ||
          (event.pageX === this._lastPageX &&
              event.pageY === this._lastPageY)) {
        return;
      }

      this._lastPageX = event.pageX;
      this._lastPageY = event.pageY;
    }

    this._reset();
  }

  _handleTimeout() {
    this._idle = true;
    this._reset();

    this._callback();
  }

  pause() {
    let remainingTime = this._startTime + this._options.timeout -
        new Date().getTime();
    if (remainingTime <= 0) {
      return;
    }

    this._remainingTime = remainingTime;

    if (this._timeoutFunction) {
      clearTimeout(this._timeoutFunction);
      this._timeoutFunction = null;
    }
  }

  resume() {
    if (!this._remainingTime) {
      return;
    }

    this._reset();
    this._remainingTime = null;
  }

  reset() {
    this._idle = false;
    this._remainingTime = null;
    this._reset();
  }

  destroy() {
    this._eventNames.forEach(eventName => {
      this._options.element.removeEventListener(
          eventName, this._boundHandleEvent);
    });

    if (this._timeoutFunction) {
      clearTimeout(this._timeoutFunction);
    }

    this._timeoutFunction = null;
    this._idle = null;
    this._boundHandleEvent = null;
    this._eventNames = null;
    this._startTime = null;
    this._remainingTime = null;
    this._lastPageX = null;
    this._lastPageY = null;
    this._callback = null;
    this._options = null;
  }

  get idle() {
    return this._idle;
  }

  set timeout(value) {
    this._options.timeout = value;
  }

  set loop(value) {
    this._options.loop = value;
  }

  set idle(value) {
    if (value) {
      this._handleTimeout();
    } else {
      this.reset();
    }
  }
}

window.IdleTimeout = IdleTimeout;
export default IdleTimeout;
