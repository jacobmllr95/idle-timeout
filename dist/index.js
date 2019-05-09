"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdleTimeout_1 = require("./IdleTimeout");
exports.IdleTimeout = IdleTimeout_1.default;
exports.default = (function (callback, options) {
    return new IdleTimeout_1.default(callback, options);
});
//# sourceMappingURL=index.js.map