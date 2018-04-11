/*! idleTimeout v1.0.0 | Copyright (c) 2016-2018 Jacob Müller */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["idleTimeout"] = factory();
	else
		root["idleTimeout"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./lib/idle-timeout.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IdleTimeout =
/*#__PURE__*/
function () {
  function IdleTimeout(callback) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, IdleTimeout);

    this.timeoutFunction = null;
    this.isIdle = false;

    this.boundHandleEvent = function (event) {
      return _this.handleEvent(event);
    };

    this.eventNames = ['DOMMouseScroll', 'mousedown', 'mousemove', 'mousewheel', 'MSPointerDown', 'MSPointerMove', 'keydown', 'touchmove', 'touchstart', 'wheel'];
    this.startTime = null;
    this.remainingTime = null;
    this.lastPageX = -1;
    this.lastPageY = -1;
    this.callback = callback;
    this.options = Object.assign({
      element: document,
      timeout: 60 * 1000 * 5,
      loop: false
    }, options);
    this.init();
  }

  _createClass(IdleTimeout, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.eventNames.forEach(function (eventName) {
        _this2.options.element.addEventListener(eventName, _this2.boundHandleEvent);
      });
      this.resetTimeout();
    }
  }, {
    key: "resetTimeout",
    value: function resetTimeout() {
      var _this3 = this;

      if (this.timeoutFunction) {
        clearTimeout(this.timeoutFunction);
        this.timeoutFunction = null;
      }

      if (this.isIdle && !this.options.loop) {
        return;
      }

      this.timeoutFunction = setTimeout(function () {
        _this3.handleTimeout();
      }, this.remainingTime || this.options.timeout);
      this.startTime = new Date().getTime();
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      if (this.remainingTime) {
        return;
      }

      if (event.type === 'mousemove') {
        if (typeof event.pageX === 'undefined' && typeof event.pageY === 'undefined' || event.pageX === this.lastPageX && event.pageY === this.lastPageY) {
          return;
        }

        this.lastPageX = event.pageX;
        this.lastPageY = event.pageY;
      }

      this.resetTimeout();
    }
  }, {
    key: "handleTimeout",
    value: function handleTimeout() {
      this.isIdle = true;
      this.resetTimeout();
      this.callback();
    }
  }, {
    key: "pause",
    value: function pause() {
      var remainingTime = this.startTime + this.options.timeout - new Date().getTime();

      if (remainingTime <= 0) {
        return;
      }

      this.remainingTime = remainingTime;

      if (this.timeoutFunction) {
        clearTimeout(this.timeoutFunction);
        this.timeoutFunction = null;
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      if (!this.remainingTime) {
        return;
      }

      this.resetTimeout();
      this.remainingTime = null;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.isIdle = false;
      this.remainingTime = null;
      this.resetTimeout();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this4 = this;

      this.eventNames.forEach(function (eventName) {
        _this4.options.element.removeEventListener(eventName, _this4.boundHandleEvent);
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
  }, {
    key: "idle",
    get: function get() {
      return this.isIdle;
    },
    set: function set(value) {
      if (value) {
        this.handleTimeout();
      } else {
        this.reset();
      }
    }
  }, {
    key: "timeout",
    set: function set(value) {
      this.options.timeout = value;
    }
  }, {
    key: "loop",
    set: function set(value) {
      this.options.loop = value;
    }
  }]);

  return IdleTimeout;
}();


// CONCATENATED MODULE: ./index.js


var index_idleTiemout = function idleTiemout() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(IdleTimeout, [null].concat(args)))();
};

/* harmony default export */ var index = __webpack_exports__["default"] = (index_idleTiemout);

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=idle-timeout.map