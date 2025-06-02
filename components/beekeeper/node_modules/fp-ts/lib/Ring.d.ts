import { Semiring } from './Semiring'
/**
 * @category model
 * @since 2.0.0
 */
export interface Ring<A> extends Semiring<A> {
  readonly sub: (x: A, y: A) => A
}
/**
 * Given a tuple of `Ring`s returns a `Ring` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Ring'
 * import * as N from 'fp-ts/number'
 *
 * const R = tuple(N.Field, N.Field, N.Field)
 * assert.deepStrictEqual(R.add([1, 2, 3], [4, 5, 6]), [5, 7, 9])
 * assert.deepStrictEqual(R.mul([1, 2, 3], [4, 5, 6]), [4, 10, 18])
 * assert.deepStrictEqual(R.one, [1, 1, 1])
 * assert.deepStrictEqual(R.sub([1, 2, 3], [4, 5, 6]), [-3, -3, -3])
 * assert.deepStrictEqual(R.zero, [0, 0, 0])
 *
 * @since 2.10.0
 */
export declare const tuple: <A extends ReadonlyArray<unknown>>(
  ...rings: { [K in keyof A]: Ring<A[K]> }
) => Ring<Readonly<A>>
/**
 * `negate x` can be used as a shorthand for `zero - x`
 *
 * @since 2.0.0
 */
export declare const negate: <A>(R: Ring<A>) => (a: A) => A
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getTupleRing: <T extends ReadonlyArray<Ring<any>>>(
  ...rings: T
) => Ring<{
  [K in keyof T]: T[K] extends Ring<infer A> ? A : never
}>
/**
 * Use [`getRing`](./function.ts.html#getring) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getFunctionRing: <A, B>(R: Ring<B>) => Ring<(a: A) => B>
