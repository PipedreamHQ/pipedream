"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = exports.error = exports.warn = exports.log = void 0;
/**
 * @since 2.0.0
 */
var log = function (a) {
    return function () {
        return console.log(a);
    };
};
exports.log = log;
/**
 * @since 2.0.0
 */
var warn = function (a) {
    return function () {
        return console.warn(a);
    };
};
exports.warn = warn;
/**
 * @since 2.0.0
 */
var error = function (a) {
    return function () {
        return console.error(a);
    };
};
exports.error = error;
/**
 * @since 2.0.0
 */
var info = function (a) {
    return function () {
        return console.info(a);
    };
};
exports.info = info;
