/**
 * The `Bounded` type class represents totally ordered types that have an upper and lower boundary.
 *
 * Instances should satisfy the following law in addition to the `Ord` laws:
 *
 * - Bounded: `bottom <= a <= top`
 *
 * @since 2.0.0
 */
import * as O from './Ord';
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Clamp a value between bottom and top values.
 *
 * @category utils
 * @since 2.12.0
 */
export var clamp = function (B) { return O.clamp(B)(B.bottom, B.top); };
/**
 * Reverses the Ord of a bound and swaps top and bottom values.
 *
 * @category utils
 * @since 2.12.0
 */
export var reverse = function (B) {
    var R = O.reverse(B);
    return {
        equals: R.equals,
        compare: R.compare,
        top: B.bottom,
        bottom: B.top
    };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Bounded`](./number.ts.html#bounded) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var boundedNumber = {
    equals: O.ordNumber.equals,
    compare: O.ordNumber.compare,
    top: Infinity,
    bottom: -Infinity
};
