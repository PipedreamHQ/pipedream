/**
 * Data structure which represents non-empty arrays.
 *
 * ```ts
 * export type NonEmptyArray<A> = Array<A> & {
 *   0: A
 * }
 * ```
 *
 * Note that you don't need any conversion, a `NonEmptyArray` is an `Array`,
 * so all `Array`'s APIs can be used with a `NonEmptyArray` without further ado.
 *
 * @since 2.0.0
 */
import { Alt1 } from './Alt'
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import { Chain1 } from './Chain'
import { Comonad1 } from './Comonad'
import { Endomorphism } from './Endomorphism'
import { Eq } from './Eq'
import { Foldable1 } from './Foldable'
import { FoldableWithIndex1 } from './FoldableWithIndex'
import { LazyArg } from './function'
import { Functor1 } from './Functor'
import { FunctorWithIndex1 } from './FunctorWithIndex'
import { Monad1 } from './Monad'
import { Option } from './Option'
import { Ord } from './Ord'
import { Pointed1 } from './Pointed'
import { Predicate } from './Predicate'
import * as RNEA from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import * as Se from './Semigroup'
import { Show } from './Show'
import { PipeableTraverse1, Traversable1 } from './Traversable'
import { PipeableTraverseWithIndex1, TraversableWithIndex1 } from './TraversableWithIndex'
import Semigroup = Se.Semigroup
import ReadonlyNonEmptyArray = RNEA.ReadonlyNonEmptyArray
/**
 * @category model
 * @since 2.0.0
 */
export interface NonEmptyArray<A> extends Array<A> {
  0: A
}
/**
 * Remove duplicates from a `NonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.11.0
 */
export declare const uniq: <A>(E: Eq<A>) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Sort the elements of a `NonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 *
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = NEA.sortBy([byName, byAge])
 *
 * const persons: NEA.NonEmptyArray<Person> = [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 },
 *   { name: 'b', age: 2 }
 * ]
 *
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.11.0
 */
export declare const sortBy: <B>(ords: Array<Ord<B>>) => <A extends B>(as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * @since 2.11.0
 */
export declare const union: <A>(E: Eq<A>) => (second: NonEmptyArray<A>) => (first: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Rotate a `NonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @since 2.11.0
 */
export declare const rotate: (n: number) => <A>(as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * @category conversions
 * @since 2.10.0
 */
export declare const fromReadonlyNonEmptyArray: <A>(as: ReadonlyNonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromArray: <A>(as: Array<A>) => Option<NonEmptyArray<A>>
/**
 * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const makeBy: <A>(f: (i: number) => A) => (n: number) => NonEmptyArray<A>
/**
 * Create a `NonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const replicate: <A>(a: A) => (n: number) => ReadonlyNonEmptyArray<A>
/**
 * Create a `NonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const range: (start: number, end: number) => NonEmptyArray<number>
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3]), [1, [2, 3]])
 *
 * @since 2.9.0
 */
export declare const unprepend: <A>(as: NonEmptyArray<A>) => [A, Array<A>]
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @since 2.9.0
 */
export declare const unappend: <A>(as: NonEmptyArray<A>) => [Array<A>, A]
/**
 * @since 2.11.0
 */
export declare function concatW<B>(second: NonEmptyArray<B>): <A>(first: Array<A>) => NonEmptyArray<A | B>
export declare function concatW<B>(second: Array<B>): <A>(first: NonEmptyArray<A>) => NonEmptyArray<A | B>
/**
 * @since 2.2.0
 */
export declare function concat<A>(second: NonEmptyArray<A>): (first: Array<A>) => NonEmptyArray<A>
export declare function concat<A>(second: Array<A>): (first: NonEmptyArray<A>) => NonEmptyArray<A>
/** @deprecated */
export declare function concat<A>(first: Array<A>, second: NonEmptyArray<A>): NonEmptyArray<A>
/** @deprecated */
export declare function concat<A>(first: NonEmptyArray<A>, second: Array<A>): NonEmptyArray<A>
/**
 * @since 2.0.0
 */
export declare const reverse: <A>(as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Group equal, consecutive elements of an array into non empty arrays.
 *
 * @example
 * import { group } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(group(N.Ord)([1, 2, 1, 1]), [
 *   [1],
 *   [2],
 *   [1, 1]
 * ])
 *
 * @since 2.0.0
 */
export declare function group<B>(E: Eq<B>): {
  <A extends B>(as: NonEmptyArray<A>): NonEmptyArray<NonEmptyArray<A>>
  <A extends B>(as: Array<A>): Array<NonEmptyArray<A>>
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @since 2.0.0
 */
export declare const groupBy: <A>(f: (a: A) => string) => (as: Array<A>) => Record<string, NonEmptyArray<A>>
/**
 * @since 2.0.0
 */
export declare const sort: <B>(O: Ord<B>) => <A extends B>(as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * @since 2.0.0
 */
export declare const insertAt: <A>(i: number, a: A) => (as: Array<A>) => Option<NonEmptyArray<A>>
/**
 * @since 2.0.0
 */
export declare const updateAt: <A>(i: number, a: A) => (as: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/**
 * @since 2.0.0
 */
export declare const modifyAt: <A>(i: number, f: (a: A) => A) => (as: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/**
 * @since 2.0.0
 */
export declare const copy: <A>(as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const of: <A>(a: A) => NonEmptyArray<A>
/**
 * @since 2.5.1
 */
export declare const zipWith: <A, B, C>(
  as: NonEmptyArray<A>,
  bs: NonEmptyArray<B>,
  f: (a: A, b: B) => C
) => NonEmptyArray<C>
/**
 * @since 2.5.1
 */
export declare function zip<B>(bs: NonEmptyArray<B>): <A>(as: NonEmptyArray<A>) => NonEmptyArray<[A, B]>
export declare function zip<A, B>(as: NonEmptyArray<A>, bs: NonEmptyArray<B>): NonEmptyArray<[A, B]>
/**
 * @since 2.5.1
 */
export declare const unzip: <A, B>(abs: NonEmptyArray<[A, B]>) => [NonEmptyArray<A>, NonEmptyArray<B>]
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
export declare const prependAll: <A>(middle: A) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export declare const intersperse: <A>(middle: A) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * @category folding
 * @since 2.0.0
 */
export declare const foldMapWithIndex: <S>(
  S: Semigroup<S>
) => <A>(f: (i: number, a: A) => S) => (fa: NonEmptyArray<A>) => S
/**
 * @category folding
 * @since 2.0.0
 */
export declare const foldMap: <S>(S: Semigroup<S>) => <A>(f: (a: A) => S) => (fa: NonEmptyArray<A>) => S
/**
 * @category sequencing
 * @since 2.10.0
 */
export declare const chainWithIndex: <A, B>(
  f: (i: number, a: A) => NonEmptyArray<B>
) => (as: NonEmptyArray<A>) => NonEmptyArray<B>
/**
 * @since 2.10.0
 */
export declare const chop: <A, B>(
  f: (as: NonEmptyArray<A>) => [B, Array<A>]
) => (as: NonEmptyArray<A>) => NonEmptyArray<B>
/**
 * Splits a `NonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @since 2.10.0
 */
export declare const splitAt: (n: number) => <A>(as: NonEmptyArray<A>) => [NonEmptyArray<A>, Array<A>]
/**
 * @since 2.10.0
 */
export declare const chunksOf: (n: number) => <A>(as: NonEmptyArray<A>) => NonEmptyArray<NonEmptyArray<A>>
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3] as NEA.NonEmptyArray<number>,
 *     NEA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
export declare const altW: <B>(that: LazyArg<NonEmptyArray<B>>) => <A>(as: NonEmptyArray<A>) => NonEmptyArray<A | B>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `NonEmptyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     NEA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.6.2
 */
export declare const alt: <A>(that: LazyArg<NonEmptyArray<A>>) => (fa: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Apply a function to an argument under a type constructor.
 *
 * @since 2.0.0
 */
export declare const ap: <A>(as: NonEmptyArray<A>) => <B>(fab: NonEmptyArray<(a: A) => B>) => NonEmptyArray<B>
/**
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     NEA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, B>(f: (a: A, i: number) => NonEmptyArray<B>): (ma: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(ma: NonEmptyArray<A>, f: (a: A, i: number) => NonEmptyArray<B>): NonEmptyArray<B>
}
/**
 * @since 2.0.0
 */
export declare const extend: <A, B>(f: (as: NonEmptyArray<A>) => B) => (as: NonEmptyArray<A>) => NonEmptyArray<B>
/**
 * @since 2.5.0
 */
export declare const duplicate: <A>(ma: NonEmptyArray<A>) => NonEmptyArray<NonEmptyArray<A>>
/**
 * @category sequencing
 * @since 2.5.0
 */
export declare const flatten: <A>(mma: NonEmptyArray<NonEmptyArray<A>>) => NonEmptyArray<A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (as: NonEmptyArray<A>) => NonEmptyArray<B>
/**
 * @category mapping
 * @since 2.0.0
 */
export declare const mapWithIndex: <A, B>(f: (i: number, a: A) => B) => (as: NonEmptyArray<A>) => NonEmptyArray<B>
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: NonEmptyArray<A>) => B
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduceWithIndex: <A, B>(b: B, f: (i: number, b: B, a: A) => B) => (fa: NonEmptyArray<A>) => B
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: NonEmptyArray<A>) => B
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduceRightWithIndex: <A, B>(b: B, f: (i: number, a: A, b: B) => B) => (fa: NonEmptyArray<A>) => B
/**
 * @category traversing
 * @since 2.6.3
 */
export declare const traverse: PipeableTraverse1<URI>
/**
 * @category traversing
 * @since 2.6.3
 */
export declare const sequence: Traversable1<URI>['sequence']
/**
 * @category sequencing
 * @since 2.6.3
 */
export declare const traverseWithIndex: PipeableTraverseWithIndex1<URI, number>
/**
 * @since 2.7.0
 */
export declare const extract: Comonad1<URI>['extract']
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'NonEmptyArray'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: NonEmptyArray<A>
  }
}
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getShow: <A>(S: Show<A>) => Show<NonEmptyArray<A>>
/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @category instances
 * @since 2.0.0
 */
export declare const getSemigroup: <A = never>() => Semigroup<NonEmptyArray<A>>
/**
 * @example
 * import { getEq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.0.0
 */
export declare const getEq: <A>(E: Eq<A>) => Eq<NonEmptyArray<A>>
/**
 * @since 2.11.0
 */
export declare const getUnionSemigroup: <A>(E: Eq<A>) => Semigroup<NonEmptyArray<A>>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor1<URI>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <B>(fab: import('./HKT').Kind<'NonEmptyArray', (a: A) => B>) => import('./HKT').Kind<'NonEmptyArray', B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const FunctorWithIndex: FunctorWithIndex1<URI, number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply1<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.5.0
 */
export declare const apFirst: <B>(
  second: NonEmptyArray<B>
) => <A>(first: import('./HKT').Kind<'NonEmptyArray', A>) => import('./HKT').Kind<'NonEmptyArray', A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.5.0
 */
export declare const apSecond: <B>(
  second: NonEmptyArray<B>
) => <A>(first: import('./HKT').Kind<'NonEmptyArray', A>) => import('./HKT').Kind<'NonEmptyArray', B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.5.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => NonEmptyArray<B>) => (first: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Monad: Monad1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Foldable: Foldable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const FoldableWithIndex: FoldableWithIndex1<URI, number>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Traversable: Traversable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const TraversableWithIndex: TraversableWithIndex1<URI, number>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Comonad: Comonad1<URI>
/**
 * @category do notation
 * @since 2.9.0
 */
export declare const Do: NonEmptyArray<{}>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <A>(
  fa: import('./HKT').Kind<'NonEmptyArray', A>
) => import('./HKT').Kind<'NonEmptyArray', { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  fa: import('./HKT').Kind<'NonEmptyArray', A>
) => import('./HKT').Kind<'NonEmptyArray', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
export {
  /**
   * @category do notation
   * @since 2.13.0
   */
  let_ as let
}
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind<'NonEmptyArray', B>
) => (
  ma: import('./HKT').Kind<'NonEmptyArray', A>
) => import('./HKT').Kind<'NonEmptyArray', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: NonEmptyArray<B>
) => (
  fa: import('./HKT').Kind<'NonEmptyArray', A>
) => import('./HKT').Kind<'NonEmptyArray', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.0.0
 */
export declare const head: <A>(nea: NonEmptyArray<A>) => A
/**
 * @since 2.0.0
 */
export declare const tail: <A>(as: NonEmptyArray<A>) => Array<A>
/**
 * @since 2.0.0
 */
export declare const last: <A>(nea: NonEmptyArray<A>) => A
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.2.0
 */
export declare const init: <A>(as: NonEmptyArray<A>) => Array<A>
/**
 * @since 2.0.0
 */
export declare const min: <A>(ord: Ord<A>) => (nea: NonEmptyArray<A>) => A
/**
 * @since 2.0.0
 */
export declare const max: <A>(ord: Ord<A>) => (nea: NonEmptyArray<A>) => A
/**
 * @since 2.10.0
 */
export declare const concatAll: <A>(S: Semigroup<A>) => (as: NonEmptyArray<A>) => A
/**
 * Break an `Array` into its first element and remaining elements.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export declare const matchLeft: <A, B>(f: (head: A, tail: Array<A>) => B) => (as: NonEmptyArray<A>) => B
/**
 * Break an `Array` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export declare const matchRight: <A, B>(f: (init: Array<A>, last: A) => B) => (as: NonEmptyArray<A>) => B
/**
 * Apply a function to the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export declare const modifyHead: <A>(f: Endomorphism<A>) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Change the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export declare const updateHead: <A>(a: A) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Apply a function to the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export declare const modifyLast: <A>(f: Endomorphism<A>) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Change the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export declare const updateLast: <A>(a: A) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Places an element in between members of a `NonEmptyArray`, then folds the results using the provided `Semigroup`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
export declare const intercalate: <A>(S: Semigroup<A>) => (middle: A) => (as: NonEmptyArray<A>) => A
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chain: <A, B>(f: (a: A) => NonEmptyArray<B>) => (ma: NonEmptyArray<A>) => NonEmptyArray<B>
/**
 * This is just `sort` followed by `group`.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function groupSort<B>(O: Ord<B>): {
  <A extends B>(as: NonEmptyArray<A>): NonEmptyArray<NonEmptyArray<A>>
  <A extends B>(as: Array<A>): Array<NonEmptyArray<A>>
}
/**
 * Use [`filter`](./Array.ts.html#filter) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function filter<A, B extends A>(
  refinement: Refinement<A, B>
): (as: NonEmptyArray<A>) => Option<NonEmptyArray<B>>
export declare function filter<A>(
  predicate: Predicate<A>
): <B extends A>(bs: NonEmptyArray<B>) => Option<NonEmptyArray<B>>
export declare function filter<A>(predicate: Predicate<A>): (as: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/**
 * Use [`filterWithIndex`](./Array.ts.html#filterwithindex) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const filterWithIndex: <A>(
  predicate: (i: number, a: A) => boolean
) => (as: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export declare const uncons: <A>(as: NonEmptyArray<A>) => [A, Array<A>]
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export declare const unsnoc: <A>(as: NonEmptyArray<A>) => [Array<A>, A]
/**
 * Use [`prepend`](./Array.ts.html#prepend) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function cons<A>(head: A): (tail: Array<A>) => NonEmptyArray<A>
/** @deprecated */
export declare function cons<A>(head: A, tail: Array<A>): NonEmptyArray<A>
/**
 * Use [`append`](./Array.ts.html#append) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const snoc: <A>(init: Array<A>, end: A) => NonEmptyArray<A>
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export declare const prependToAll: <A>(middle: A) => (as: NonEmptyArray<A>) => NonEmptyArray<A>
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const fold: <A>(S: Semigroup<A>) => (fa: NonEmptyArray<A>) => A
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `NEA.Functor` instead of `NEA.nonEmptyArray`
 * (where `NEA` is from `import NEA from 'fp-ts/NonEmptyArray'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const nonEmptyArray: Monad1<URI> &
  Comonad1<URI> &
  TraversableWithIndex1<URI, number> &
  FunctorWithIndex1<URI, number> &
  FoldableWithIndex1<URI, number> &
  Alt1<URI>
