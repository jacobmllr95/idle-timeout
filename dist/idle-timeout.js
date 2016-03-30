(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * IdleTimeout
 *
 * @version 0.0.2
 * @overview A basic idle state detector written in ES6.
 * @author Jacob Müller [jacob.mueller.elz@gmail.com]
 * @see {@link https://github.com/jackmu95/idle-timeout|GitHub}
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IdleTimeout = function () {
  function IdleTimeout(callback) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, IdleTimeout);

    this.CLASS_NAME = 'IdleTimeout';

    this._timeoutFunction = null;
    this._idle = false;

    this._boundHandleEvent = function (event) {
      return _this._handleEvent(event);
    };
    this._eventNames = ['DOMMouseScroll', 'mousedown', 'mousemove', 'mousewheel', 'MSPointerDown', 'MSPointerMove', 'keydown', 'touchmove', 'touchstart', 'wheel'];

    this._lastPageX = -1;
    this._lastPageY = -1;

    this._callback = callback;
    this._options = (0, _utils.extend)({
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
        document.addEventListener(eventName, _this2._boundHandleEvent);
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
      }, this._options.timeout);
    }
  }, {
    key: '_handleEvent',
    value: function _handleEvent(event) {
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
    key: 'reset',
    value: function reset() {
      this._idle = false;
      this._reset();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this4 = this;

      this._eventNames.forEach(function (eventName) {
        document.removeEventListener(eventName, _this4._boundHandleEvent);
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
exports.default = IdleTimeout;

},{"./utils":2}],2:[function(require,module,exports){
'use strict';

/**
 * Extend an object with one or more objects.
 *
 * @param {Object} baseObject - The base object to be extend
 * @param {...Object} objects - The objects to extend the base object
 * @return {Object} - The extended base object
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
function extend(baseObject) {
  for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objects[_key - 1] = arguments[_key];
  }

  objects.forEach(function (object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        baseObject[key] = object[key];
      }
    }
  });

  return baseObject;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNTQTs7Ozs7Ozs7QUFFQTs7OztJQUVNO0FBQ0osV0FESSxXQUNKLENBQVksUUFBWixFQUFvQzs7O1FBQWQsZ0VBQVUsa0JBQUk7OzBCQURoQyxhQUNnQzs7QUFDbEMsU0FBSyxVQUFMLEdBQWtCLGFBQWxCLENBRGtDOztBQUdsQyxTQUFLLGdCQUFMLEdBQXdCLElBQXhCLENBSGtDO0FBSWxDLFNBQUssS0FBTCxHQUFhLEtBQWIsQ0FKa0M7O0FBTWxDLFNBQUssaUJBQUwsR0FBeUI7YUFBUyxNQUFLLFlBQUwsQ0FBa0IsS0FBbEI7S0FBVCxDQU5TO0FBT2xDLFNBQUssV0FBTCxHQUFtQixDQUNqQixnQkFEaUIsRUFFakIsV0FGaUIsRUFFSixXQUZJLEVBRVMsWUFGVCxFQUdqQixlQUhpQixFQUdBLGVBSEEsRUFJakIsU0FKaUIsRUFLakIsV0FMaUIsRUFLSixZQUxJLEVBTWpCLE9BTmlCLENBQW5CLENBUGtDOztBQWdCbEMsU0FBSyxVQUFMLEdBQWtCLENBQUMsQ0FBRCxDQWhCZ0I7QUFpQmxDLFNBQUssVUFBTCxHQUFrQixDQUFDLENBQUQsQ0FqQmdCOztBQW1CbEMsU0FBSyxTQUFMLEdBQWlCLFFBQWpCLENBbkJrQztBQW9CbEMsU0FBSyxRQUFMLEdBQWdCLG1CQUFPO0FBQ3JCLGVBQVMsS0FBSyxJQUFMLEdBQVksQ0FBWjtBQUNULFlBQU0sS0FBTjtLQUZjLEVBR2IsT0FIYSxDQUFoQixDQXBCa0M7O0FBeUJsQyxTQUFLLEtBQUwsR0F6QmtDO0dBQXBDOztlQURJOzs0QkE2Qkk7OztBQUNOLFdBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixxQkFBYTtBQUNwQyxpQkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxPQUFLLGlCQUFMLENBQXJDLENBRG9DO09B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YXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogSWRsZVRpbWVvdXRcbiAqXG4gKiBAdmVyc2lvbiAwLjAuMlxuICogQG92ZXJ2aWV3IEEgYmFzaWMgaWRsZSBzdGF0ZSBkZXRlY3RvciB3cml0dGVuIGluIEVTNi5cbiAqIEBhdXRob3IgSmFjb2IgTcO8bGxlciBbamFjb2IubXVlbGxlci5lbHpAZ21haWwuY29tXVxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2phY2ttdTk1L2lkbGUtdGltZW91dHxHaXRIdWJ9XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2V4dGVuZH0gZnJvbSAnLi91dGlscyc7XG5cbmNsYXNzIElkbGVUaW1lb3V0IHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuQ0xBU1NfTkFNRSA9ICdJZGxlVGltZW91dCc7XG5cbiAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX2lkbGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX2JvdW5kSGFuZGxlRXZlbnQgPSBldmVudCA9PiB0aGlzLl9oYW5kbGVFdmVudChldmVudCk7XG4gICAgdGhpcy5fZXZlbnROYW1lcyA9IFtcbiAgICAgICdET01Nb3VzZVNjcm9sbCcsXG4gICAgICAnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXdoZWVsJyxcbiAgICAgICdNU1BvaW50ZXJEb3duJywgJ01TUG9pbnRlck1vdmUnLFxuICAgICAgJ2tleWRvd24nLFxuICAgICAgJ3RvdWNobW92ZScsICd0b3VjaHN0YXJ0JyxcbiAgICAgICd3aGVlbCdcbiAgICBdO1xuXG4gICAgdGhpcy5fbGFzdFBhZ2VYID0gLTE7XG4gICAgdGhpcy5fbGFzdFBhZ2VZID0gLTE7XG5cbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuX29wdGlvbnMgPSBleHRlbmQoe1xuICAgICAgdGltZW91dDogNjAgKiAxMDAwICogNSxcbiAgICAgIGxvb3A6IGZhbHNlXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBfaW5pdCgpIHtcbiAgICB0aGlzLl9ldmVudE5hbWVzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9ib3VuZEhhbmRsZUV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBfcmVzZXQoKSB7XG4gICAgaWYgKHRoaXMuX3RpbWVvdXRGdW5jdGlvbikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRGdW5jdGlvbik7XG4gICAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pZGxlICYmICF0aGlzLl9vcHRpb25zLmxvb3ApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX2hhbmRsZVRpbWVvdXQoKTtcbiAgICB9LCB0aGlzLl9vcHRpb25zLnRpbWVvdXQpO1xuICB9XG5cbiAgX2hhbmRsZUV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICBpZiAoKHR5cGVvZiBldmVudC5wYWdlWCA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LnBhZ2VZID09PSAndW5kZWZpbmVkJykgfHxcbiAgICAgICAgICAoZXZlbnQucGFnZVggPT09IHRoaXMuX2xhc3RQYWdlWCAmJlxuICAgICAgICAgICAgICBldmVudC5wYWdlWSA9PT0gdGhpcy5fbGFzdFBhZ2VZKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xhc3RQYWdlWCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgdGhpcy5fbGFzdFBhZ2VZID0gZXZlbnQucGFnZVk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgfVxuXG4gIF9oYW5kbGVUaW1lb3V0KCkge1xuICAgIHRoaXMuX2lkbGUgPSB0cnVlO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG5cbiAgICB0aGlzLl9jYWxsYmFjaygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5faWRsZSA9IGZhbHNlO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TmFtZXMuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX2JvdW5kSGFuZGxlRXZlbnQpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3RpbWVvdXRGdW5jdGlvbikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRGdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fdGltZW91dEZ1bmN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9pZGxlID0gbnVsbDtcbiAgICB0aGlzLl9ib3VuZEhhbmRsZUV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9ldmVudE5hbWVzID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0UGFnZVggPSBudWxsO1xuICAgIHRoaXMuX2xhc3RQYWdlWSA9IG51bGw7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuX29wdGlvbnMgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGlkbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkbGU7XG4gIH1cblxuICBzZXQgdGltZW91dCh2YWx1ZSkge1xuICAgIHRoaXMuX29wdGlvbnMudGltZW91dCA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IGxvb3AodmFsdWUpIHtcbiAgICB0aGlzLl9vcHRpb25zLmxvb3AgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBpZGxlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9oYW5kbGVUaW1lb3V0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LklkbGVUaW1lb3V0ID0gSWRsZVRpbWVvdXQ7XG5leHBvcnQgZGVmYXVsdCBJZGxlVGltZW91dDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBFeHRlbmQgYW4gb2JqZWN0IHdpdGggb25lIG9yIG1vcmUgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmFzZU9iamVjdCAtIFRoZSBiYXNlIG9iamVjdCB0byBiZSBleHRlbmRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzIC0gVGhlIG9iamVjdHMgdG8gZXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSAtIFRoZSBleHRlbmRlZCBiYXNlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGJhc2VPYmplY3QsIC4uLm9iamVjdHMpIHtcbiAgb2JqZWN0cy5mb3JFYWNoKG9iamVjdCA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgYmFzZU9iamVjdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYmFzZU9iamVjdDtcbn1cbiJdfQ==
