"use strict";
/**
 * @since 2.11.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonoid = exports.getSemigroup = exports.URI = void 0;
var function_1 = require("./function");
/**
 * @category type lambdas
 * @since 2.11.0
 */
exports.URI = 'Endomorphism';
/**
 * Endomorphism form a `Semigroup` where the `concat` operation is the usual function composition.
 *
 * @category instances
 * @since 2.11.0
 */
var getSemigroup = function () { return ({
    concat: function (first, second) { return (0, function_1.flow)(first, second); }
}); };
exports.getSemigroup = getSemigroup;
/**
 * Endomorphism form a `Monoid` where the `empty` value is the `identity` function.
 *
 * @category instances
 * @since 2.11.0
 */
var getMonoid = function () { return ({
    concat: (0, exports.getSemigroup)().concat,
    empty: function_1.identity
}); };
exports.getMonoid = getMonoid;
