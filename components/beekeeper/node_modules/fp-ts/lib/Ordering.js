"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monoidOrdering = exports.eqOrdering = exports.semigroupOrdering = exports.invert = exports.sign = exports.Monoid = exports.Semigroup = exports.Eq = exports.reverse = exports.match = exports.matchW = void 0;
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
var matchW = function (onLessThan, onEqual, onGreaterThan) {
    return function (o) {
        return o === -1 ? onLessThan() : o === 0 ? onEqual() : onGreaterThan();
    };
};
exports.matchW = matchW;
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = exports.matchW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var reverse = function (o) { return (o === -1 ? 1 : o === 1 ? -1 : 0); };
exports.reverse = reverse;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
exports.Eq = {
    equals: function (x, y) { return x === y; }
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Semigroup = {
    concat: function (x, y) { return (x !== 0 ? x : y); }
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monoid = {
    concat: exports.Semigroup.concat,
    empty: 0
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
var sign = function (n) { return (n <= -1 ? -1 : n >= 1 ? 1 : 0); };
exports.sign = sign;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.invert = exports.reverse;
/**
 * Use [`Semigroup`](#semigroup) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupOrdering = exports.Semigroup;
/**
 * Use [`Eq`](#eq) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqOrdering = exports.Eq;
/**
 * Use [`Monoid`](#monoid) instead
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
exports.monoidOrdering = exports.Monoid;
