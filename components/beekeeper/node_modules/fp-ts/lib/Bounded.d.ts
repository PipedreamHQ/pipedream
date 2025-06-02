/**
 * The `Bounded` type class represents totally ordered types that have an upper and lower boundary.
 *
 * Instances should satisfy the following law in addition to the `Ord` laws:
 *
 * - Bounded: `bottom <= a <= top`
 *
 * @since 2.0.0
 */
import * as O from './Ord'
import Ord = O.Ord
/**
 * @category model
 * @since 2.0.0
 */
export interface Bounded<A> extends Ord<A> {
  readonly top: A
  readonly bottom: A
}
/**
 * Clamp a value between bottom and top values.
 *
 * @category utils
 * @since 2.12.0
 */
export declare const clamp: <A>(B: Bounded<A>) => (a: A) => A
/**
 * Reverses the Ord of a bound and swaps top and bottom values.
 *
 * @category utils
 * @since 2.12.0
 */
export declare const reverse: <A>(B: Bounded<A>) => Bounded<A>
/**
 * Use [`Bounded`](./number.ts.html#bounded) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const boundedNumber: Bounded<number>
