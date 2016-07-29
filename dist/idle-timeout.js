/*!
 * IdleTimeout
 *
 * @version 0.1.0
 * @overview A basic idle state detector written in ES6.
 * @author Jacob Müller [jacob.mueller.elz@gmail.com]
 * @see {@link https://github.com/jackmu95/idle-timeout|GitHub}
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IdleTimeout = function () {
  function IdleTimeout(callback) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, IdleTimeout);

    this._timeoutFunction = null;
    this._idle = false;

    this._boundHandleEvent = function (event) {
      return _this._handleEvent(event);
    };
    this._eventNames = ['DOMMouseScroll', 'mousedown', 'mousemove', 'mousewheel', 'MSPointerDown', 'MSPointerMove', 'keydown', 'touchmove', 'touchstart', 'wheel'];

    this._startTime = null;
    this._remainingTime = null;
    this._lastPageX = -1;
    this._lastPageY = -1;

    this._callback = callback;
    this._options = _extends({
      element: document,
      timeout: 60 * 1000 * 5,
      loop: false
    }, options);

    this._init();
  }

  _createClass(IdleTimeout, [{
    key: '_init',
    value: function _init() {
      var _this2 = this;

      this._eventNames.forEach(function (eventName) {
        _this2._options.element.addEventListener(eventName, _this2._boundHandleEvent);
      });

      this._reset();
    }
  }, {
    key: '_reset',
    value: function _reset() {
      var _this3 = this;

      if (this._timeoutFunction) {
        clearTimeout(this._timeoutFunction);
        this._timeoutFunction = null;
      }

      if (this._idle && !this._options.loop) {
        return;
      }

      this._timeoutFunction = setTimeout(function () {
        _this3._handleTimeout();
      }, this._remainingTime || this._options.timeout);

      this._startTime = new Date().getTime();
    }
  }, {
    key: '_handleEvent',
    value: function _handleEvent(event) {
      if (this._remainingTime) {
        return false;
      }

      if (event.type === 'mousemove') {
        if (typeof event.pageX === 'undefined' && typeof event.pageY === 'undefined' || event.pageX === this._lastPageX && event.pageY === this._lastPageY) {
          return;
        }

        this._lastPageX = event.pageX;
        this._lastPageY = event.pageY;
      }

      this._reset();
    }
  }, {
    key: '_handleTimeout',
    value: function _handleTimeout() {
      this._idle = true;
      this._reset();

      this._callback();
    }
  }, {
    key: 'pause',
    value: function pause() {
      var remainingTime = this._startTime + this._options.timeout - new Date().getTime();
      if (remainingTime <= 0) {
        return;
      }

      this._remainingTime = remainingTime;

      if (this._timeoutFunction) {
        clearTimeout(this._timeoutFunction);
        this._timeoutFunction = null;
      }
    }
  }, {
    key: 'resume',
    value: function resume() {
      if (!this._remainingTime) {
        return;
      }

      this._reset();
      this._remainingTime = null;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._idle = false;
      this._remainingTime = null;
      this._reset();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this4 = this;

      this._eventNames.forEach(function (eventName) {
        _this4._options.element.removeEventListener(eventName, _this4._boundHandleEvent);
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
  }, {
    key: 'idle',
    get: function get() {
      return this._idle;
    },
    set: function set(value) {
      if (value) {
        this._handleTimeout();
      } else {
        this.reset();
      }
    }
  }, {
    key: 'timeout',
    set: function set(value) {
      this._options.timeout = value;
    }
  }, {
    key: 'loop',
    set: function set(value) {
      this._options.loop = value;
    }
  }]);

  return IdleTimeout;
}();

window.IdleTimeout = IdleTimeout;
//# sourceMappingURL=data:application/json;base64,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QUFyQjtBQUNEOzs7Ozs7QUFXSCxPQUFPLFdBQVAsR0FBcUIsV0FBckIiLCJmaWxlIjoiaWRsZS10aW1lb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBJZGxlVGltZW91dFxuICpcbiAqIEB2ZXJzaW9uIDAuMS4wXG4gKiBAb3ZlcnZpZXcgQSBiYXNpYyBpZGxlIHN0YXRlIGRldGVjdG9yIHdyaXR0ZW4gaW4gRVM2LlxuICogQGF1dGhvciBKYWNvYiBNw7xsbGVyIFtqYWNvYi5tdWVsbGVyLmVsekBnbWFpbC5jb21dXG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vamFja211OTUvaWRsZS10aW1lb3V0fEdpdEh1Yn1cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIElkbGVUaW1lb3V0IHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3RpbWVvdXRGdW5jdGlvbiA9IG51bGw7XG4gICAgdGhpcy5faWRsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fYm91bmRIYW5kbGVFdmVudCA9IGV2ZW50ID0+IHRoaXMuX2hhbmRsZUV2ZW50KGV2ZW50KTtcbiAgICB0aGlzLl9ldmVudE5hbWVzID0gW1xuICAgICAgJ0RPTU1vdXNlU2Nyb2xsJyxcbiAgICAgICdtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNld2hlZWwnLFxuICAgICAgJ01TUG9pbnRlckRvd24nLCAnTVNQb2ludGVyTW92ZScsXG4gICAgICAna2V5ZG93bicsXG4gICAgICAndG91Y2htb3ZlJywgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3doZWVsJ1xuICAgIF07XG5cbiAgICB0aGlzLl9zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX3JlbWFpbmluZ1RpbWUgPSBudWxsO1xuICAgIHRoaXMuX2xhc3RQYWdlWCA9IC0xO1xuICAgIHRoaXMuX2xhc3RQYWdlWSA9IC0xO1xuXG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBlbGVtZW50OiBkb2N1bWVudCxcbiAgICAgIHRpbWVvdXQ6IDYwICogMTAwMCAqIDUsXG4gICAgICBsb29wOiBmYWxzZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICB9XG5cbiAgX2luaXQoKSB7XG4gICAgdGhpcy5fZXZlbnROYW1lcy5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICB0aGlzLl9vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX2JvdW5kSGFuZGxlRXZlbnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgfVxuXG4gIF9yZXNldCgpIHtcbiAgICBpZiAodGhpcy5fdGltZW91dEZ1bmN0aW9uKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dEZ1bmN0aW9uKTtcbiAgICAgIHRoaXMuX3RpbWVvdXRGdW5jdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2lkbGUgJiYgIXRoaXMuX29wdGlvbnMubG9vcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3RpbWVvdXRGdW5jdGlvbiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5faGFuZGxlVGltZW91dCgpO1xuICAgIH0sIHRoaXMuX3JlbWFpbmluZ1RpbWUgfHwgdGhpcy5fb3B0aW9ucy50aW1lb3V0KTtcblxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgX2hhbmRsZUV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX3JlbWFpbmluZ1RpbWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcbiAgICAgIGlmICgodHlwZW9mIGV2ZW50LnBhZ2VYID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQucGFnZVkgPT09ICd1bmRlZmluZWQnKSB8fFxuICAgICAgICAgIChldmVudC5wYWdlWCA9PT0gdGhpcy5fbGFzdFBhZ2VYICYmXG4gICAgICAgICAgICAgIGV2ZW50LnBhZ2VZID09PSB0aGlzLl9sYXN0UGFnZVkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbGFzdFBhZ2VYID0gZXZlbnQucGFnZVg7XG4gICAgICB0aGlzLl9sYXN0UGFnZVkgPSBldmVudC5wYWdlWTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgX2hhbmRsZVRpbWVvdXQoKSB7XG4gICAgdGhpcy5faWRsZSA9IHRydWU7XG4gICAgdGhpcy5fcmVzZXQoKTtcblxuICAgIHRoaXMuX2NhbGxiYWNrKCk7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICBsZXQgcmVtYWluaW5nVGltZSA9IHRoaXMuX3N0YXJ0VGltZSArIHRoaXMuX29wdGlvbnMudGltZW91dCAtXG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGlmIChyZW1haW5pbmdUaW1lIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9yZW1haW5pbmdUaW1lID0gcmVtYWluaW5nVGltZTtcblxuICAgIGlmICh0aGlzLl90aW1lb3V0RnVuY3Rpb24pIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0RnVuY3Rpb24pO1xuICAgICAgdGhpcy5fdGltZW91dEZ1bmN0aW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXN1bWUoKSB7XG4gICAgaWYgKCF0aGlzLl9yZW1haW5pbmdUaW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB0aGlzLl9yZW1haW5pbmdUaW1lID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2lkbGUgPSBmYWxzZTtcbiAgICB0aGlzLl9yZW1haW5pbmdUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE5hbWVzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIHRoaXMuX29wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGV2ZW50TmFtZSwgdGhpcy5fYm91bmRIYW5kbGVFdmVudCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fdGltZW91dEZ1bmN0aW9uKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dEZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX2lkbGUgPSBudWxsO1xuICAgIHRoaXMuX2JvdW5kSGFuZGxlRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX2V2ZW50TmFtZXMgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5fcmVtYWluaW5nVGltZSA9IG51bGw7XG4gICAgdGhpcy5fbGFzdFBhZ2VYID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0UGFnZVkgPSBudWxsO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLl9vcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIGdldCBpZGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9pZGxlO1xuICB9XG5cbiAgc2V0IHRpbWVvdXQodmFsdWUpIHtcbiAgICB0aGlzLl9vcHRpb25zLnRpbWVvdXQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBsb29wKHZhbHVlKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5sb29wID0gdmFsdWU7XG4gIH1cblxuICBzZXQgaWRsZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5faGFuZGxlVGltZW91dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICB9XG59XG5cbndpbmRvdy5JZGxlVGltZW91dCA9IElkbGVUaW1lb3V0O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
