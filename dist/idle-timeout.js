(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * IdleTimeout
 *
 * @version 0.0.4
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
    this._options = (0, _utils.extend)({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNTQTs7Ozs7Ozs7QUFFQTs7OztJQUVNO0FBQ0osV0FESSxXQUNKLENBQVksUUFBWixFQUFvQzs7O1FBQWQsZ0VBQVUsa0JBQUk7OzBCQURoQyxhQUNnQzs7QUFDbEMsU0FBSyxnQkFBTCxHQUF3QixJQUF4QixDQURrQztBQUVsQyxTQUFLLEtBQUwsR0FBYSxLQUFiLENBRmtDOztBQUlsQyxTQUFLLGlCQUFMLEdBQXlCO2FBQVMsTUFBSyxZQUFMLENBQWtCLEtBQWxCO0tBQVQsQ0FKUztBQUtsQyxTQUFLLFdBQUwsR0FBbUIsQ0FDakIsZ0JBRGlCLEVBRWpCLFdBRmlCLEVBRUosV0FGSSxFQUVTLFlBRlQsRUFHakIsZUFIaUIsRUFHQSxlQUhBLEVBSWpCLFNBSmlCLEVBS2pCLFdBTGlCLEVBS0osWUFMSSxFQU1qQixPQU5pQixDQUFuQixDQUxrQzs7QUFjbEMsU0FBSyxVQUFMLEdBQWtCLElBQWxCLENBZGtDO0FBZWxDLFNBQUssY0FBTCxHQUFzQixJQUF0QixDQWZrQztBQWdCbEMsU0FBSyxVQUFMLEdBQWtCLENBQUMsQ0FBRCxDQWhCZ0I7QUFpQmxDLFNBQUssVUFBTCxHQUFrQixDQUFDLENBQUQsQ0FqQmdCOztBQW1CbEMsU0FBSyxTQUFMLEdBQWlCLFFBQWpCLENBbkJrQztBQW9CbEMsU0FBSyxRQUFMLEdBQWdCLG1CQUFPO0FBQ3JCLGVBQVMsUUFBVDtBQUNBLGVBQVMsS0FBSyxJQUFMLEdBQVksQ0FBWjtBQUNULFlBQU0sS0FBTjtLQUhjLEVBSWIsT0FKYSxDQUFoQixDQXBCa0M7O0FBMEJsQyxTQUFLLEtBQUwsR0ExQmtDO0dBQXBDOztlQURJOzs0QkE4Qkk7OztBQUNOLFdBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixxQkFBYTtBQUNwQyxlQUFLLFFB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QUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FoQlE7QUFpQlIsV0FBSyxVQUFMLEdBQWtCLElBQWxCLENBakJRO0FBa0JSLFdBQUssU0FBTCxHQUFpQixJQUFqQixDQWxCUTtBQW1CUixXQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FuQlE7Ozs7d0JBc0JDO0FBQ1QsYUFBTyxLQUFLLEtBQUwsQ0FERTs7c0JBWUYsT0FBTztBQUNkLFVBQUksS0FBSixFQUFXO0FBQ1QsYUFBSyxjQUFMLEdBRFM7T0FBWCxNQUVPO0FBQ0wsYUFBSyxLQUFMLEdBREs7T0FGUDs7OztzQkFUVSxPQUFPO0FBQ2pCLFdBQUssUUFBTCxDQUFjLE9BQWQsR0FBd0IsS0FBeEIsQ0FEaUI7Ozs7c0JBSVYsT0FBTztBQUNkLFdBQUssUUFBTCxDQUFjLElBQWQsR0FBcUIsS0FBckIsQ0FEYzs7OztTQTlJWjs7O0FBMkpOLE9BQU8sV0FBUCxHQUFxQixXQUFyQjtrQkFDZTs7O0FDektmOzs7Ozs7Ozs7Ozs7O1FBU2dCO0FBQVQsU0FBUyxNQUFULENBQWdCLFVBQWhCLEVBQXdDO29DQUFUOztHQUFTOztBQUM3QyxVQUFRLE9BQVIsQ0FBZ0Isa0JBQVU7QUFDeEIsU0FBSyxJQUFNLEdBQU4sSUFBYSxNQUFsQixFQUEwQjtBQUN4QixVQUFJLE9BQU8sY0FBUCxDQUFzQixHQUF0QixDQUFKLEVBQWdDO0FBQzlCLG1CQUFXLEdBQVgsSUFBa0IsT0FBTyxHQUFQLENBQWxCLENBRDhCO09BQWhDO0tBREY7R0FEYyxDQUFoQixDQUQ2Qzs7QUFTN0MsU0FBTyxVQUFQLENBVDZDO0NBQXhDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogSWRsZVRpbWVvdXRcbiAqXG4gKiBAdmVyc2lvbiAwLjAuNFxuICogQG92ZXJ2aWV3IEEgYmFzaWMgaWRsZSBzdGF0ZSBkZXRlY3RvciB3cml0dGVuIGluIEVTNi5cbiAqIEBhdXRob3IgSmFjb2IgTcO8bGxlciBbamFjb2IubXVlbGxlci5lbHpAZ21haWwuY29tXVxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2phY2ttdTk1L2lkbGUtdGltZW91dHxHaXRIdWJ9XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2V4dGVuZH0gZnJvbSAnLi91dGlscyc7XG5cbmNsYXNzIElkbGVUaW1lb3V0IHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3RpbWVvdXRGdW5jdGlvbiA9IG51bGw7XG4gICAgdGhpcy5faWRsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fYm91bmRIYW5kbGVFdmVudCA9IGV2ZW50ID0+IHRoaXMuX2hhbmRsZUV2ZW50KGV2ZW50KTtcbiAgICB0aGlzLl9ldmVudE5hbWVzID0gW1xuICAgICAgJ0RPTU1vdXNlU2Nyb2xsJyxcbiAgICAgICdtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNld2hlZWwnLFxuICAgICAgJ01TUG9pbnRlckRvd24nLCAnTVNQb2ludGVyTW92ZScsXG4gICAgICAna2V5ZG93bicsXG4gICAgICAndG91Y2htb3ZlJywgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3doZWVsJ1xuICAgIF07XG5cbiAgICB0aGlzLl9zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX3JlbWFpbmluZ1RpbWUgPSBudWxsO1xuICAgIHRoaXMuX2xhc3RQYWdlWCA9IC0xO1xuICAgIHRoaXMuX2xhc3RQYWdlWSA9IC0xO1xuXG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLl9vcHRpb25zID0gZXh0ZW5kKHtcbiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LFxuICAgICAgdGltZW91dDogNjAgKiAxMDAwICogNSxcbiAgICAgIGxvb3A6IGZhbHNlXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBfaW5pdCgpIHtcbiAgICB0aGlzLl9ldmVudE5hbWVzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIHRoaXMuX29wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fYm91bmRIYW5kbGVFdmVudCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgX3Jlc2V0KCkge1xuICAgIGlmICh0aGlzLl90aW1lb3V0RnVuY3Rpb24pIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0RnVuY3Rpb24pO1xuICAgICAgdGhpcy5fdGltZW91dEZ1bmN0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faWRsZSAmJiAhdGhpcy5fb3B0aW9ucy5sb29wKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdGltZW91dEZ1bmN0aW9uID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9oYW5kbGVUaW1lb3V0KCk7XG4gICAgfSwgdGhpcy5fcmVtYWluaW5nVGltZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVvdXQpO1xuXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cblxuICBfaGFuZGxlRXZlbnQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5fcmVtYWluaW5nVGltZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJykge1xuICAgICAgaWYgKCh0eXBlb2YgZXZlbnQucGFnZVggPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgIHR5cGVvZiBldmVudC5wYWdlWSA9PT0gJ3VuZGVmaW5lZCcpIHx8XG4gICAgICAgICAgKGV2ZW50LnBhZ2VYID09PSB0aGlzLl9sYXN0UGFnZVggJiZcbiAgICAgICAgICAgICAgZXZlbnQucGFnZVkgPT09IHRoaXMuX2xhc3RQYWdlWSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9sYXN0UGFnZVggPSBldmVudC5wYWdlWDtcbiAgICAgIHRoaXMuX2xhc3RQYWdlWSA9IGV2ZW50LnBhZ2VZO1xuICAgIH1cblxuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBfaGFuZGxlVGltZW91dCgpIHtcbiAgICB0aGlzLl9pZGxlID0gdHJ1ZTtcbiAgICB0aGlzLl9yZXNldCgpO1xuXG4gICAgdGhpcy5fY2FsbGJhY2soKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIGxldCByZW1haW5pbmdUaW1lID0gdGhpcy5fc3RhcnRUaW1lICsgdGhpcy5fb3B0aW9ucy50aW1lb3V0IC1cbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKHJlbWFpbmluZ1RpbWUgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbWFpbmluZ1RpbWUgPSByZW1haW5pbmdUaW1lO1xuXG4gICAgaWYgKHRoaXMuX3RpbWVvdXRGdW5jdGlvbikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRGdW5jdGlvbik7XG4gICAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VtZSgpIHtcbiAgICBpZiAoIXRoaXMuX3JlbWFpbmluZ1RpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9yZXNldCgpO1xuICAgIHRoaXMuX3JlbWFpbmluZ1RpbWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5faWRsZSA9IGZhbHNlO1xuICAgIHRoaXMuX3JlbWFpbmluZ1RpbWUgPSBudWxsO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TmFtZXMuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgdGhpcy5fb3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgZXZlbnROYW1lLCB0aGlzLl9ib3VuZEhhbmRsZUV2ZW50KTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl90aW1lb3V0RnVuY3Rpb24pIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0RnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHRoaXMuX3RpbWVvdXRGdW5jdGlvbiA9IG51bGw7XG4gICAgdGhpcy5faWRsZSA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRIYW5kbGVFdmVudCA9IG51bGw7XG4gICAgdGhpcy5fZXZlbnROYW1lcyA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9yZW1haW5pbmdUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0UGFnZVggPSBudWxsO1xuICAgIHRoaXMuX2xhc3RQYWdlWSA9IG51bGw7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuX29wdGlvbnMgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGlkbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkbGU7XG4gIH1cblxuICBzZXQgdGltZW91dCh2YWx1ZSkge1xuICAgIHRoaXMuX29wdGlvbnMudGltZW91dCA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IGxvb3AodmFsdWUpIHtcbiAgICB0aGlzLl9vcHRpb25zLmxvb3AgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBpZGxlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9oYW5kbGVUaW1lb3V0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LklkbGVUaW1lb3V0ID0gSWRsZVRpbWVvdXQ7XG5leHBvcnQgZGVmYXVsdCBJZGxlVGltZW91dDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBFeHRlbmQgYW4gb2JqZWN0IHdpdGggb25lIG9yIG1vcmUgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmFzZU9iamVjdCAtIFRoZSBiYXNlIG9iamVjdCB0byBiZSBleHRlbmRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzIC0gVGhlIG9iamVjdHMgdG8gZXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSAtIFRoZSBleHRlbmRlZCBiYXNlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGJhc2VPYmplY3QsIC4uLm9iamVjdHMpIHtcbiAgb2JqZWN0cy5mb3JFYWNoKG9iamVjdCA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgYmFzZU9iamVjdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYmFzZU9iamVjdDtcbn1cbiJdfQ==
