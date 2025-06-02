"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathReporter = exports.success = exports.failure = void 0;
/**
 * @since 1.0.0
 */
var Either_1 = require("fp-ts/lib/Either");
var _1 = require(".");
function stringify(v) {
    if (typeof v === 'function') {
        return (0, _1.getFunctionName)(v);
    }
    if (typeof v === 'number' && !isFinite(v)) {
        if (isNaN(v)) {
            return 'NaN';
        }
        return v > 0 ? 'Infinity' : '-Infinity';
    }
    return JSON.stringify(v);
}
function getContextPath(context) {
    return context.map(function (_a) {
        var key = _a.key, type = _a.type;
        return "".concat(key, ": ").concat(type.name);
    }).join('/');
}
function getMessage(e) {
    return e.message !== undefined
        ? e.message
        : "Invalid value ".concat(stringify(e.value), " supplied to ").concat(getContextPath(e.context));
}
/**
 * @since 1.0.0
 */
function failure(es) {
    return es.map(getMessage);
}
exports.failure = failure;
/**
 * @since 1.0.0
 */
function success() {
    return ['No errors!'];
}
exports.success = success;
/**
 * @since 1.0.0
 */
exports.PathReporter = {
    report: (0, Either_1.fold)(failure, success)
};
