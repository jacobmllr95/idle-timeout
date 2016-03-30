(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * IdleTimeout
 *
 * @version 0.0.3
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
        document.removeEventListener(eventName, _this4._boundHandleEvent);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNTQTs7Ozs7Ozs7QUFFQTs7OztJQUVNO0FBQ0osV0FESSxXQUNKLENBQVksUUFBWixFQUFvQzs7O1FBQWQsZ0VBQVUsa0JBQUk7OzBCQURoQyxhQUNnQzs7QUFDbEMsU0FBSyxnQkFBTCxHQUF3QixJQUF4QixDQURrQztBQUVsQyxTQUFLLEtBQUwsR0FBYSxLQUFiLENBRmtDOztBQUlsQyxTQUFLLGlCQUFMLEdBQXlCO2FBQVMsTUFBSyxZQUFMLENBQWtCLEtBQWxCO0tBQVQsQ0FKUztBQUtsQyxTQUFLLFdBQUwsR0FBbUIsQ0FDakIsZ0JBRGlCLEVBRWpCLFdBRmlCLEVBRUosV0FGSSxFQUVTLFlBRlQsRUFHakIsZUFIaUIsRUFHQSxlQUhBLEVBSWpCLFNBSmlCLEVBS2pCLFdBTGlCLEVBS0osWUFMSSxFQU1qQixPQU5pQixDQUFuQixDQUxrQzs7QUFjbEMsU0FBSyxVQUFMLEdBQWtCLElBQWxCLENBZGtDO0FBZWxDLFNBQUssY0FBTCxHQUFzQixJQUF0QixDQWZrQztBQWdCbEMsU0FBSyxVQUFMLEdBQWtCLENBQUMsQ0FBRCxDQWhCZ0I7QUFpQmxDLFNBQUssVUFBTCxHQUFrQixDQUFDLENBQUQsQ0FqQmdCOztBQW1CbEMsU0FBSyxTQUFMLEdBQWlCLFFBQWpCLENBbkJrQztBQW9CbEMsU0FBSyxRQUFMLEdBQWdCLG1CQUFPO0FBQ3JCLGVBQVMsS0FBSyxJQUFMLEdBQVksQ0FBWjtBQUNULFlBQU0sS0FBTjtLQUZjLEVBR2IsT0FIYSxDQUFoQixDQXBCa0M7O0FBeUJsQyxTQUFLLEtBQUwsR0F6QmtDO0dBQXBDOztlQURJOzs0QkE2Qkk7OztBQUNOLFdBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixxQkFBYTtBQUNwQyxpQkFBUyxnQkFBVCxDQUEwQixTQUEx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Q0FoQlE7QUFpQlIsV0FBSyxTQUFMLEdBQWlCLElBQWpCLENBakJRO0FBa0JSLFdBQUssUUFBTCxHQUFnQixJQUFoQixDQWxCUTs7Ozt3QkFxQkM7QUFDVCxhQUFPLEtBQUssS0FBTCxDQURFOztzQkFZRixPQUFPO0FBQ2QsVUFBSSxLQUFKLEVBQVc7QUFDVCxhQUFLLGNBQUwsR0FEUztPQUFYLE1BRU87QUFDTCxhQUFLLEtBQUwsR0FESztPQUZQOzs7O3NCQVRVLE9BQU87QUFDakIsV0FBSyxRQUFMLENBQWMsT0FBZCxHQUF3QixLQUF4QixDQURpQjs7OztzQkFJVixPQUFPO0FBQ2QsV0FBSyxRQUFMLENBQWMsSUFBZCxHQUFxQixLQUFyQixDQURjOzs7O1NBNUlaOzs7QUF5Sk4sT0FBTyxXQUFQLEdBQXFCLFdBQXJCO2tCQUNlOzs7QUN2S2Y7Ozs7Ozs7Ozs7Ozs7UUFTZ0I7QUFBVCxTQUFTLE1BQVQsQ0FBZ0IsVUFBaEIsRUFBd0M7b0NBQVQ7O0dBQVM7O0FBQzdDLFVBQVEsT0FBUixDQUFnQixrQkFBVTtBQUN4QixTQUFLLElBQU0sR0FBTixJQUFhLE1BQWxCLEVBQTBCO0FBQ3hCLFVBQUksT0FBTyxjQUFQLENBQXNCLEdBQXRCLENBQUosRUFBZ0M7QUFDOUIsbUJBQVcsR0FBWCxJQUFrQixPQUFPLEdBQVAsQ0FBbEIsQ0FEOEI7T0FBaEM7S0FERjtHQURjLENBQWhCLENBRDZDOztBQVM3QyxTQUFPLFVBQVAsQ0FUNkM7Q0FBeEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBJZGxlVGltZW91dFxuICpcbiAqIEB2ZXJzaW9uIDAuMC4zXG4gKiBAb3ZlcnZpZXcgQSBiYXNpYyBpZGxlIHN0YXRlIGRldGVjdG9yIHdyaXR0ZW4gaW4gRVM2LlxuICogQGF1dGhvciBKYWNvYiBNw7xsbGVyIFtqYWNvYi5tdWVsbGVyLmVsekBnbWFpbC5jb21dXG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vamFja211OTUvaWRsZS10aW1lb3V0fEdpdEh1Yn1cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7ZXh0ZW5kfSBmcm9tICcuL3V0aWxzJztcblxuY2xhc3MgSWRsZVRpbWVvdXQge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fdGltZW91dEZ1bmN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9pZGxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl9ib3VuZEhhbmRsZUV2ZW50ID0gZXZlbnQgPT4gdGhpcy5faGFuZGxlRXZlbnQoZXZlbnQpO1xuICAgIHRoaXMuX2V2ZW50TmFtZXMgPSBbXG4gICAgICAnRE9NTW91c2VTY3JvbGwnLFxuICAgICAgJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V3aGVlbCcsXG4gICAgICAnTVNQb2ludGVyRG93bicsICdNU1BvaW50ZXJNb3ZlJyxcbiAgICAgICdrZXlkb3duJyxcbiAgICAgICd0b3VjaG1vdmUnLCAndG91Y2hzdGFydCcsXG4gICAgICAnd2hlZWwnXG4gICAgXTtcblxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5fcmVtYWluaW5nVGltZSA9IG51bGw7XG4gICAgdGhpcy5fbGFzdFBhZ2VYID0gLTE7XG4gICAgdGhpcy5fbGFzdFBhZ2VZID0gLTE7XG5cbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuX29wdGlvbnMgPSBleHRlbmQoe1xuICAgICAgdGltZW91dDogNjAgKiAxMDAwICogNSxcbiAgICAgIGxvb3A6IGZhbHNlXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBfaW5pdCgpIHtcbiAgICB0aGlzLl9ldmVudE5hbWVzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9ib3VuZEhhbmRsZUV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBfcmVzZXQoKSB7XG4gICAgaWYgKHRoaXMuX3RpbWVvdXRGdW5jdGlvbikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRGdW5jdGlvbik7XG4gICAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pZGxlICYmICF0aGlzLl9vcHRpb25zLmxvb3ApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX2hhbmRsZVRpbWVvdXQoKTtcbiAgICB9LCB0aGlzLl9yZW1haW5pbmdUaW1lIHx8IHRoaXMuX29wdGlvbnMudGltZW91dCk7XG5cbiAgICB0aGlzLl9zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG4gIF9oYW5kbGVFdmVudChldmVudCkge1xuICAgIGlmICh0aGlzLl9yZW1haW5pbmdUaW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICBpZiAoKHR5cGVvZiBldmVudC5wYWdlWCA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LnBhZ2VZID09PSAndW5kZWZpbmVkJykgfHxcbiAgICAgICAgICAoZXZlbnQucGFnZVggPT09IHRoaXMuX2xhc3RQYWdlWCAmJlxuICAgICAgICAgICAgICBldmVudC5wYWdlWSA9PT0gdGhpcy5fbGFzdFBhZ2VZKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xhc3RQYWdlWCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgdGhpcy5fbGFzdFBhZ2VZID0gZXZlbnQucGFnZVk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgfVxuXG4gIF9oYW5kbGVUaW1lb3V0KCkge1xuICAgIHRoaXMuX2lkbGUgPSB0cnVlO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG5cbiAgICB0aGlzLl9jYWxsYmFjaygpO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgbGV0IHJlbWFpbmluZ1RpbWUgPSB0aGlzLl9zdGFydFRpbWUgKyB0aGlzLl9vcHRpb25zLnRpbWVvdXQgLVxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAocmVtYWluaW5nVGltZSA8PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmVtYWluaW5nVGltZSA9IHJlbWFpbmluZ1RpbWU7XG5cbiAgICBpZiAodGhpcy5fdGltZW91dEZ1bmN0aW9uKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dEZ1bmN0aW9uKTtcbiAgICAgIHRoaXMuX3RpbWVvdXRGdW5jdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVzdW1lKCkge1xuICAgIGlmICghdGhpcy5fcmVtYWluaW5nVGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5fcmVtYWluaW5nVGltZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLl9pZGxlID0gZmFsc2U7XG4gICAgdGhpcy5fcmVtYWluaW5nVGltZSA9IG51bGw7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnROYW1lcy5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fYm91bmRIYW5kbGVFdmVudCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fdGltZW91dEZ1bmN0aW9uKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dEZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLl90aW1lb3V0RnVuY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX2lkbGUgPSBudWxsO1xuICAgIHRoaXMuX2JvdW5kSGFuZGxlRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX2V2ZW50TmFtZXMgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5fcmVtYWluaW5nVGltZSA9IG51bGw7XG4gICAgdGhpcy5fbGFzdFBhZ2VYID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0UGFnZVkgPSBudWxsO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLl9vcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIGdldCBpZGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9pZGxlO1xuICB9XG5cbiAgc2V0IHRpbWVvdXQodmFsdWUpIHtcbiAgICB0aGlzLl9vcHRpb25zLnRpbWVvdXQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBsb29wKHZhbHVlKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5sb29wID0gdmFsdWU7XG4gIH1cblxuICBzZXQgaWRsZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5faGFuZGxlVGltZW91dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICB9XG59XG5cbndpbmRvdy5JZGxlVGltZW91dCA9IElkbGVUaW1lb3V0O1xuZXhwb3J0IGRlZmF1bHQgSWRsZVRpbWVvdXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRXh0ZW5kIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJhc2VPYmplY3QgLSBUaGUgYmFzZSBvYmplY3QgdG8gYmUgZXh0ZW5kXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gb2JqZWN0cyAtIFRoZSBvYmplY3RzIHRvIGV4dGVuZCB0aGUgYmFzZSBvYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gLSBUaGUgZXh0ZW5kZWQgYmFzZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChiYXNlT2JqZWN0LCAuLi5vYmplY3RzKSB7XG4gIG9iamVjdHMuZm9yRWFjaChvYmplY3QgPT4ge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iamVjdCkge1xuICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGJhc2VPYmplY3Rba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGJhc2VPYmplY3Q7XG59XG4iXX0=
