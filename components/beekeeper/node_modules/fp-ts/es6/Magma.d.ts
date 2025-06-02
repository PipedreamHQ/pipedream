/**
 * A `Magma` is a pair `(A, concat)` in which `A` is a non-empty set and `concat` is a binary operation on `A`
 *
 * See [Semigroup](https://gcanti.github.io/fp-ts/modules/Semigroup.ts.html) for some instances.
 *
 * @since 2.0.0
 */
import { Endomorphism } from './Endomorphism'
import { Predicate } from './Predicate'
/**
 * @category model
 * @since 2.0.0
 */
export interface Magma<A> {
  readonly concat: (x: A, y: A) => A
}
/**
 * The dual of a `Magma`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse, concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(reverse(N.MagmaSub))(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), 2)
 *
 * @since 2.11.0
 */
export declare const reverse: <A>(M: Magma<A>) => Magma<A>
/**
 * @since 2.11.0
 */
export declare const filterFirst: <A>(predicate: Predicate<A>) => (M: Magma<A>) => Magma<A>
/**
 * @since 2.11.0
 */
export declare const filterSecond: <A>(predicate: Predicate<A>) => (M: Magma<A>) => Magma<A>
/**
 * @since 2.11.0
 */
export declare const endo: <A>(f: Endomorphism<A>) => (M: Magma<A>) => Magma<A>
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(N.MagmaSub)(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), -6)
 *
 * @since 2.11.0
 */
export declare const concatAll: <A>(M: Magma<A>) => (startWith: A) => (as: ReadonlyArray<A>) => A
