"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomElem = exports.randomBool = exports.random = void 0;
exports.randomInt = randomInt;
exports.randomRange = randomRange;
/**
 * @since 2.0.0
 */
var function_1 = require("./function");
var IO_1 = require("./IO");
/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive). This is a direct wrapper around JavaScript's
 * `Math.random()`.
 *
 * @since 2.0.0
 */
var random = function () { return Math.random(); };
exports.random = random;
/**
 * Takes a range specified by `low` (the first argument) and `high` (the second), and returns a random integer uniformly
 * distributed in the closed interval `[low, high]`. It is unspecified what happens if `low > high`, or if either of
 * `low` or `high` is not an integer.
 *
 * @since 2.0.0
 */
function randomInt(low, high) {
    return (0, function_1.pipe)(exports.random, (0, IO_1.map)(function (n) { return Math.floor((high - low + 1) * n + low); }));
}
/**
 * Returns a random number between a minimum value (inclusive) and a maximum value (exclusive). It is unspecified what
 * happens if `maximum < minimum`.
 *
 * @since 2.0.0
 */
function randomRange(min, max) {
    return (0, function_1.pipe)(exports.random, (0, IO_1.map)(function (n) { return (max - min) * n + min; }));
}
/**
 * Returns a random boolean value with an equal chance of being `true` or `false`
 *
 * @since 2.0.0
 */
exports.randomBool = (0, function_1.pipe)(exports.random, (0, IO_1.map)(function (n) { return n < 0.5; }));
/**
 * Returns a random element of a `ReadonlyNonEmptyArray`.
 *
 * @since 2.10.0
 */
var randomElem = function (as) {
    return (0, function_1.pipe)(randomInt(0, as.length - 1), (0, IO_1.map)(function (i) { return as[i]; }));
};
exports.randomElem = randomElem;
