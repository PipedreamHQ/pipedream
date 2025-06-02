import { pipe } from './function';
import * as N from './number';
import * as O from './Ord';
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
export var Eq = {
    equals: function (first, second) { return first.valueOf() === second.valueOf(); }
};
/**
 * @category instances
 * @since 2.6.0
 */
export var eqDate = {
    equals: function (x, y) { return x.getDate() === y.getDate(); }
};
/**
 * @category instances
 * @since 2.6.0
 */
export var eqMonth = {
    equals: function (x, y) { return x.getMonth() === y.getMonth(); }
};
/**
 * @category instances
 * @since 2.6.0
 */
export var eqYear = {
    equals: function (x, y) { return x.getFullYear() === y.getFullYear(); }
};
/**
 * @example
 * import { Ord } from 'fp-ts/Date'
 *
 * assert.deepStrictEqual(Ord.compare(new Date(1, 1, 2020), new Date(1, 1, 2021)), -1)
 *
 * @category instances
 * @since 2.10.0
 */
export var Ord = /*#__PURE__*/ pipe(N.Ord, 
/*#__PURE__*/ O.contramap(function (date) { return date.valueOf(); }));
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Returns the current `Date`
 *
 * @category constructors
 * @since 2.0.0
 */
export var create = function () { return new Date(); };
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 *
 * @since 2.0.0
 */
export var now = function () { return new Date().getTime(); };
