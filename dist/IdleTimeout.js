"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Creates an idle timeout instnace. */
var IdleTimeout = /** @class */ (function () {
    /**
     * The idle timeout constructor.
     * @param {Function} callback The callback function to invoke when the timeout is complete.
     * @param {object} [options] The configuration options for the timeout.
     * @returns {void}
     */
    function IdleTimeout(callback, options) {
        var _this = this;
        /** The timeout handle to reset the timeout. */
        this.timeoutHandle = null;
        /** Whether the timeout is idle. */
        this.isIdle = false;
        /** The start time of the timeout in milliseconds. */
        this.startTime = 0;
        /** The remaining time of the timeout in milliseconds. */
        this.remainingTime = 0;
        /** The last X-axis position on the page. */
        this.lastPageX = -1;
        /** The last Y-axis position on the page. */
        this.lastPageY = -1;
        /** The input event names. */
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
        /**
         * Handle the input events.
         * @param {Event} event The input event.
         * @returns {void}
         */
        this.handleEvent = function (event) {
            if (_this.remainingTime > 0) {
                return;
            }
            if (event.type === 'mousemove') {
                var _a = event, pageX = _a.pageX, pageY = _a.pageY;
                if ((pageX === undefined && pageY === undefined) ||
                    (pageX === _this.lastPageX && pageY === _this.lastPageY)) {
                    return;
                }
                _this.lastPageX = pageX;
                _this.lastPageY = pageY;
            }
            _this.resetTimeout();
        };
        this.callback = callback;
        this.options = __assign({ element: document.body, loop: false, timeout: 60 * 1000 * 5 }, options);
        var element = this.options.element;
        this.eventNames.forEach(function (eventName) {
            element.addEventListener(eventName, _this.handleEvent);
        });
        this.resetTimeout();
    }
    /**
     * Pause the timeout.
     * @returns {void}
     */
    IdleTimeout.prototype.pause = function () {
        var remainingTime = this.startTime + this.options.timeout - new Date().getTime();
        if (remainingTime <= 0) {
            return;
        }
        this.remainingTime = remainingTime;
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    };
    /**
     * Resume the paused timeout.
     * @returns {void}
     */
    IdleTimeout.prototype.resume = function () {
        if (this.remainingTime <= 0) {
            return;
        }
        this.resetTimeout();
        this.remainingTime = 0;
    };
    /**
     * Reset the timeout.
     * @returns {void}
     */
    IdleTimeout.prototype.reset = function () {
        this.isIdle = false;
        this.remainingTime = 0;
        this.resetTimeout();
    };
    /**
     * Destroy the instance.
     * @returns {void}
     */
    IdleTimeout.prototype.destroy = function () {
        var _this = this;
        var element = this.options.element;
        this.eventNames.forEach(function (eventName) {
            element.removeEventListener(eventName, _this.handleEvent);
        });
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
    };
    /**
     * Reset the timeout function.
     * @returns {void}
     */
    IdleTimeout.prototype.resetTimeout = function () {
        var _this = this;
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
        if (this.isIdle && !this.options.loop) {
            return;
        }
        this.timeoutHandle = setTimeout(function () {
            _this.handleTimeout();
        }, this.remainingTime || this.options.timeout);
        this.startTime = new Date().getTime();
    };
    /**
     * Handle the completed timeout.
     * @returns {void}
     */
    IdleTimeout.prototype.handleTimeout = function () {
        this.isIdle = true;
        this.resetTimeout();
        this.callback();
    };
    Object.defineProperty(IdleTimeout.prototype, "idle", {
        /** Gets whether the timeout is idle. */
        get: function () {
            return this.isIdle;
        },
        /**
         * Sets whether the timeout is idle.
         * @param {boolean} value Whether the timeout is idle.
         */
        set: function (value) {
            if (value) {
                this.handleTimeout();
            }
            else {
                this.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdleTimeout.prototype, "loop", {
        /**
         * Sets wether the timeout should restart on completion.
         * @param {boolean} value Wether the timeout should restart on completion.
         */
        set: function (value) {
            this.options.loop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdleTimeout.prototype, "timeout", {
        /**
         * Sets the idle timeout in milliseconds.
         * @param {number} value The idle timeout in milliseconds.
         */
        set: function (value) {
            this.options.timeout = value;
        },
        enumerable: true,
        configurable: true
    });
    return IdleTimeout;
}());
exports.default = IdleTimeout;
//# sourceMappingURL=IdleTimeout.js.map