/**
 * @since 2.0.0
 */
import { Applicative2 } from './Applicative'
import { Apply2 } from './Apply'
import * as chainable from './Chain'
import { FromState2 } from './FromState'
import { Functor2 } from './Functor'
import { Monad2 } from './Monad'
import { Pointed2 } from './Pointed'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
/**
 * @category model
 * @since 2.0.0
 */
export interface State<S, A> {
  (s: S): [A, S]
}
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const get: <S>() => State<S, S>
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const put: <S>(s: S) => State<S, void>
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const modify: <S>(f: (s: S) => S) => State<S, void>
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const gets: <S, A>(f: (s: S) => A) => State<S, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: State<E, A>) => State<E, B>
/**
 * @since 2.0.0
 */
export declare const ap: <E, A>(fa: State<E, A>) => <B>(fab: State<E, (a: A) => B>) => State<E, B>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const of: <S, A>(a: A) => State<S, A>
/**
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, S, B>(f: (a: A) => State<S, B>): (ma: State<S, A>) => State<S, B>
  <S, A, B>(ma: State<S, A>, f: (a: A) => State<S, B>): State<S, B>
}
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatten: <E, A>(mma: State<E, State<E, A>>) => State<E, A>
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'State'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: State<E, A>
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
) => <E, B>(fab: import('./HKT').Kind2<'State', E, (a: A) => B>) => import('./HKT').Kind2<'State', E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply2<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export declare const apFirst: <E, B>(
  second: State<E, B>
) => <A>(first: import('./HKT').Kind2<'State', E, A>) => import('./HKT').Kind2<'State', E, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export declare const apSecond: <E, B>(
  second: State<E, B>
) => <A>(first: import('./HKT').Kind2<'State', E, A>) => import('./HKT').Kind2<'State', E, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: chainable.Chain2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Monad: Monad2<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export declare const tap: {
  <S, A, _>(self: State<S, A>, f: (a: A) => State<S, _>): State<S, A>
  <A, S, _>(f: (a: A) => State<S, _>): (self: State<S, A>) => State<S, A>
}
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromState: FromState2<URI>
/**
 * Run a computation in the `State` monad, discarding the final state
 *
 * @since 2.8.0
 */
export declare const evaluate: <S>(s: S) => <A>(ma: State<S, A>) => A
/**
 * Run a computation in the `State` monad discarding the result
 *
 * @since 2.8.0
 */
export declare const execute: <S>(s: S) => <A>(ma: State<S, A>) => S
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(fa: import('./HKT').Kind2<'State', E, A>) => import('./HKT').Kind2<'State', E, { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(
  fa: import('./HKT').Kind2<'State', E, A>
) => import('./HKT').Kind2<'State', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
export {
  /**
   * @since 2.13.0
   */
  let_ as let
}
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind2<'State', E, B>
) => (
  ma: import('./HKT').Kind2<'State', E, A>
) => import('./HKT').Kind2<'State', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: State<E, B>
) => (
  fa: import('./HKT').Kind2<'State', E, A>
) => import('./HKT').Kind2<'State', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, S, B>(
  f: (index: number, a: A) => State<S, B>
) => (as: ReadonlyNonEmptyArray<A>) => State<S, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, S, B>(
  f: (index: number, a: A) => State<S, B>
) => (as: ReadonlyArray<A>) => State<S, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <A, S, B>(
  f: (index: number, a: A) => State<S, B>
) => (as: ReadonlyArray<A>) => State<S, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArray: <A, S, B>(
  f: (a: A) => State<S, B>
) => (as: ReadonlyArray<A>) => State<S, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const sequenceArray: <S, A>(arr: ReadonlyArray<State<S, A>>) => State<S, ReadonlyArray<A>>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chain: <S, A, B>(f: (a: A) => State<S, B>) => (ma: State<S, A>) => State<S, B>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chainFirst: <S, A, B>(f: (a: A) => State<S, B>) => (ma: State<S, A>) => State<S, A>
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const evalState: <S, A>(ma: State<S, A>, s: S) => A
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const execState: <S, A>(ma: State<S, A>, s: S) => S
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `S.Functor` instead of `S.state`
 * (where `S` is from `import S from 'fp-ts/State'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const state: Monad2<URI>
