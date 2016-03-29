/*!
 * IdleTimeout
 *
 * @version 0.0.1
 * @overview A basic idle state detector written in ES6.
 * @author Jacob Müller [jacob.mueller.elz@gmail.com]
 * @see {@link https://github.com/jackmu95/idle-timeout|GitHub}
 */

'use strict';

import {extend} from './utils';

class IdleTimeout {
  constructor(callback, options = {}) {
    this.CLASS_NAME = 'IdleTimeout';

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

    this._lastPageX = -1;
    this._lastPageY = -1;

    this._callback = callback;
    this._options = extend({
      timeout: 60 * 1000 * 5
    }, options);

    this._init();
  }

  _init() {
    this._eventNames.forEach(eventName => {
      document.addEventListener(eventName, this._boundHandleEvent);
    });

    this._reset();
  }

  _reset() {
    if (this._timeoutFunction) {
      clearTimeout(this._timeoutFunction);
      this._timeoutFunction = null;
    }

    if (this._idle) {
      return;
    }

    this._timeoutFunction = setTimeout(() => {
      this._handleTimeout();
    }, this._options.timeout);
  }

  _handleEvent(event) {
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

  reset() {
    this._idle = false;
    this._reset();
  }

  destroy() {
    this._eventNames.forEach(eventName => {
      document.removeEventListener(eventName, this._boundHandleEvent);
    });

    if (this._timeoutFunction) {
      clearTimeout(this._timeoutFunction);
    }

    this._timeoutFunction = null;
    this._idle = null;
    this._boundHandleEvent = null;
    this._eventNames = null;
    this._lastPageX = null;
    this._lastPageY = null;
    this._callback = null;
    this._options = null;
  }

  get idle() {
    return this._idle;
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
