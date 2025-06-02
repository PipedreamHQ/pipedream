/**
 * @since 2.11.0
 */
import { flow, identity } from './function';
/**
 * @category type lambdas
 * @since 2.11.0
 */
export var URI = 'Endomorphism';
/**
 * Endomorphism form a `Semigroup` where the `concat` operation is the usual function composition.
 *
 * @category instances
 * @since 2.11.0
 */
export var getSemigroup = function () { return ({
    concat: function (first, second) { return flow(first, second); }
}); };
/**
 * Endomorphism form a `Monoid` where the `empty` value is the `identity` function.
 *
 * @category instances
 * @since 2.11.0
 */
export var getMonoid = function () { return ({
    concat: getSemigroup().concat,
    empty: identity
}); };
