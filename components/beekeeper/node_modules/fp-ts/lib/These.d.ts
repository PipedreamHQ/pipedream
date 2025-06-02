/**
 * A data structure providing "inclusive-or" as opposed to `Either`'s "exclusive-or".
 *
 * If you interpret `Either<E, A>` as suggesting the computation may either fail or succeed (exclusively), then
 * `These<E, A>` may fail, succeed, or do both at the same time.
 *
 * There are a few ways to interpret the both case:
 *
 * - You can think of a computation that has a non-fatal error.
 * - You can think of a computation that went as far as it could before erroring.
 * - You can think of a computation that keeps track of errors as it completes.
 *
 * Another way you can think of `These<E, A>` is saying that we want to handle `E` kind of data, `A` kind of data, or
 * both `E` and `A` kind of data at the same time. This is particularly useful when it comes to displaying UI's.
 *
 * (description adapted from https://package.elm-lang.org/packages/joneshf/elm-these)
 *
 * Adapted from https://github.com/purescript-contrib/purescript-these
 *
 * @since 2.0.0
 */
import { Applicative2C } from './Applicative'
import { Apply2C } from './Apply'
import { Bifunctor2 } from './Bifunctor'
import { Chain2C } from './Chain'
import { Either, Left, Right } from './Either'
import { Eq } from './Eq'
import { Foldable2 } from './Foldable'
import { FromEither2 } from './FromEither'
import { FromThese2 } from './FromThese'
import { LazyArg } from './function'
import { Functor2 } from './Functor'
import { Monad2C } from './Monad'
import { MonadThrow2C } from './MonadThrow'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Pointed2 } from './Pointed'
import { Predicate } from './Predicate'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import { Show } from './Show'
import { PipeableTraverse2, Traversable2 } from './Traversable'
/**
 * @category model
 * @since 2.0.0
 */
export interface Both<E, A> {
  readonly _tag: 'Both'
  readonly left: E
  readonly right: A
}
/**
 * @category model
 * @since 2.0.0
 */
export type These<E, A> = Either<E, A> | Both<E, A>
/**
 * Returns `true` if the these is an instance of `Left`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export declare const isLeft: <E>(fa: These<E, unknown>) => fa is Left<E>
/**
 * Returns `true` if the these is an instance of `Right`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export declare const isRight: <A>(fa: These<unknown, A>) => fa is Right<A>
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export declare function isBoth<E, A>(fa: These<E, A>): fa is Both<E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function left<E = never, A = never>(left: E): These<E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function right<E = never, A = never>(right: A): These<E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function both<E, A>(left: E, right: A): These<E, A>
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchW: <E, B, A, C, D>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C,
  onBoth: (e: E, a: A) => D
) => (fa: These<E, A>) => B | C | D
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const foldW: <E, B, A, C, D>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C,
  onBoth: (e: E, a: A) => D
) => (fa: These<E, A>) => B | C | D
/**
 * @category pattern matching
 * @since 2.10.0
 */
export declare const match: <E, A, B>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B,
  onBoth: (e: E, a: A) => B
) => (fa: These<E, A>) => B
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export declare const fold: <E, A, B>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B,
  onBoth: (e: E, a: A) => B
) => (fa: These<E, A>) => B
/**
 * @since 2.4.0
 */
export declare const swap: <E, A>(fa: These<E, A>) => These<A, E>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getShow<E, A>(SE: Show<E>, SA: Show<A>): Show<These<E, A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getEq<E, A>(EE: Eq<E>, EA: Eq<A>): Eq<These<E, A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getSemigroup<E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Semigroup<These<E, A>>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getApply: <E>(S: Semigroup<E>) => Apply2C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getApplicative<E>(S: Semigroup<E>): Applicative2C<URI, E>
/**
 * @category instances
 * @since 2.10.0
 */
export declare function getChain<E>(S: Semigroup<E>): Chain2C<URI, E>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getMonad<E>(S: Semigroup<E>): Monad2C<URI, E> & MonadThrow2C<URI, E>
/**
 * Returns an `E` value if possible
 *
 * @example
 * import { getLeft, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(both('a', 1)), some('a'))
 *
 * @category conversions
 * @since 2.0.0
 */
export declare function getLeft<E, A>(fa: These<E, A>): Option<E>
/**
 * Returns an `A` value if possible
 *
 * @example
 * import { getRight, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getRight(left('a')), none)
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(both('a', 1)), some(1))
 *
 * @category conversions
 * @since 2.0.0
 */
export declare function getRight<E, A>(fa: These<E, A>): Option<A>
/**
 * @example
 * import { leftOrBoth, left, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(leftOrBoth('a')(none), left('a'))
 * assert.deepStrictEqual(leftOrBoth('a')(some(1)), both('a', 1))
 *
 * @category constructors
 * @since 2.0.0
 */
export declare function leftOrBoth<E>(e: E): <A>(ma: Option<A>) => These<E, A>
/**
 * @example
 * import { rightOrBoth, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(rightOrBoth(1)(none), right(1))
 * assert.deepStrictEqual(rightOrBoth(1)(some('a')), both('a', 1))
 *
 * @category constructors
 * @since 2.0.0
 */
export declare function rightOrBoth<A>(a: A): <E>(me: Option<E>) => These<E, A>
/**
 * Returns the `E` value if and only if the value is constructed with `Left`
 *
 * @example
 * import { getLeftOnly, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getLeftOnly(left('a')), some('a'))
 * assert.deepStrictEqual(getLeftOnly(right(1)), none)
 * assert.deepStrictEqual(getLeftOnly(both('a', 1)), none)
 *
 * @category conversions
 * @since 2.0.0
 */
export declare function getLeftOnly<E, A>(fa: These<E, A>): Option<E>
/**
 * Returns the `A` value if and only if the value is constructed with `Right`
 *
 * @example
 * import { getRightOnly, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getRightOnly(left('a')), none)
 * assert.deepStrictEqual(getRightOnly(right(1)), some(1))
 * assert.deepStrictEqual(getRightOnly(both('a', 1)), none)
 *
 * @category conversions
 * @since 2.0.0
 */
export declare function getRightOnly<E, A>(fa: These<E, A>): Option<A>
/**
 * Takes a pair of `Option`s and attempts to create a `These` from them
 *
 * @example
 * import { fromOptions, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromOptions(none, none), none)
 * assert.deepStrictEqual(fromOptions(some('a'), none), some(left('a')))
 * assert.deepStrictEqual(fromOptions(none, some(1)), some(right(1)))
 * assert.deepStrictEqual(fromOptions(some('a'), some(1)), some(both('a', 1)))
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromOptions: <E, A>(fe: Option<E>, fa: Option<A>) => Option<These<E, A>>
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: These<E, A>) => These<G, B>
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: These<E, A>) => These<G, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: These<E, A>) => These<E, B>
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: These<E, A>) => B
/**
 * @category folding
 * @since 2.0.0
 */
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: These<E, A>) => M
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: These<E, A>) => B
/**
 * @category traversing
 * @since 2.6.3
 */
export declare const traverse: PipeableTraverse2<URI>
/**
 * @category traversing
 * @since 2.6.3
 */
export declare const sequence: Traversable2<URI>['sequence']
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const of: <E = never, A = never>(right: A) => These<E, A>
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'These'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: These<E, A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor2<URI>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <E, B>(fab: import('./HKT').Kind2<'These', E, (a: A) => B>) => import('./HKT').Kind2<'These', E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor2<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromThese: FromThese2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Foldable: Foldable2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Traversable: Traversable2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither2<URI>
/**
 * @category lifting
 * @since 2.13.0
 */
export declare const fromPredicate: {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => These<E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(b: B) => These<E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => These<E, A>
}
/**
 * @category conversions
 * @since 2.10.0
 */
export declare const fromOption: <E>(onNone: LazyArg<E>) => <A>(fa: Option<A>) => These<E, A>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Option<B>) => (...a: A) => These<E, B>
/**
 * @since 2.11.0
 */
export declare const elem: <A>(E: Eq<A>) => (a: A) => <E>(ma: These<E, A>) => boolean
/**
 * @since 2.11.0
 */
export declare const exists: <A>(predicate: Predicate<A>) => (ma: These<unknown, A>) => boolean
/**
 * @example
 * import { toTuple2, left, right, both } from 'fp-ts/These'
 *
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(left('b')), ['b', 1])
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(right(2)), ['a', 2])
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(both('b', 2)), ['b', 2])
 *
 * @category conversions
 * @since 2.10.0
 */
export declare const toTuple2: <E, A>(e: LazyArg<E>, a: LazyArg<A>) => (fa: These<E, A>) => readonly [E, A]
/**
 * Use [`toTuple2`](#totuple2) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const toTuple: <E, A>(e: E, a: A) => (fa: These<E, A>) => [E, A]
/**
 * @since 2.11.0
 */
export declare const ApT: These<never, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <E>(
  S: Semigroup<E>
) => <A, B>(
  f: (index: number, a: A) => These<E, B>
) => (as: ReadonlyNonEmptyArray<A>) => These<E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <E>(
  S: Semigroup<E>
) => <A, B>(f: (index: number, a: A) => These<E, B>) => (as: ReadonlyArray<A>) => These<E, ReadonlyArray<B>>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.these`
 * (where `T` is from `import T from 'fp-ts/These'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const these: Functor2<URI> & Bifunctor2<URI> & Foldable2<URI> & Traversable2<URI>
