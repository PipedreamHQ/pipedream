/**
 * @since 2.0.0
 */
import { Alt3, Alt3C } from './Alt'
import { Applicative3, Applicative3C } from './Applicative'
import { Apply1, Apply3 } from './Apply'
import { Bifunctor3 } from './Bifunctor'
import * as chainable from './Chain'
import { Compactable3C } from './Compactable'
import * as E from './Either'
import { Filterable3C } from './Filterable'
import { FromEither3 } from './FromEither'
import { FromIO3 } from './FromIO'
import { FromReader3 } from './FromReader'
import { FromTask3 } from './FromTask'
import { LazyArg } from './function'
import { Functor3 } from './Functor'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { Monad3, Monad3C } from './Monad'
import { MonadIO3 } from './MonadIO'
import { MonadTask3, MonadTask3C } from './MonadTask'
import { MonadThrow3, MonadThrow3C } from './MonadThrow'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Pointed3 } from './Pointed'
import { Predicate } from './Predicate'
import * as R from './Reader'
import { ReaderEither } from './ReaderEither'
import * as RIO from './ReaderIO'
import * as RT from './ReaderTask'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import * as T from './Task'
import * as TE from './TaskEither'
import Either = E.Either
import Task = T.Task
import TaskEither = TE.TaskEither
import Reader = R.Reader
import ReaderIO = RIO.ReaderIO
import ReaderTask = RT.ReaderTask
/**
 * @category model
 * @since 2.0.0
 */
export interface ReaderTaskEither<R, E, A> {
  (r: R): TaskEither<E, A>
}
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromTaskEither: <E, A, R = unknown>(fa: TaskEither<E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const left: <R, E = never, A = never>(e: E) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const right: <R, E = never, A = never>(a: A) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightTask: <R, E = never, A = never>(ma: Task<A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftTask: <R, E = never, A = never>(me: Task<E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightReader: <R, E = never, A = never>(ma: Reader<R, A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftReader: <R, E = never, A = never>(me: Reader<R, E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.5.0
 */
export declare const rightReaderTask: <R, E = never, A = never>(ma: ReaderTask<R, A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.5.0
 */
export declare const leftReaderTask: <R, E = never, A = never>(me: ReaderTask<R, E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightIO: <R, E = never, A = never>(ma: IO<A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftIO: <R, E = never, A = never>(me: IO<E>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.13.0
 */
export declare const rightReaderIO: <R, E = never, A = never>(ma: ReaderIO<R, A>) => ReaderTaskEither<R, E, A>
/**
 * @category constructors
 * @since 2.13.0
 */
export declare const leftReaderIO: <R, E = never, A = never>(me: ReaderIO<R, E>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromEither: <E, A, R = unknown>(fa: Either<E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.11.0
 */
export declare const fromReader: <R, A, E = never>(fa: Reader<R, A>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromIO: <A, R = unknown, E = never>(fa: IO<A>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromTask: <A, R = unknown, E = never>(fa: Task<A>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromIOEither: <E, A, R = unknown>(fa: IOEither<E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromReaderEither: <R, E, A>(fa: ReaderEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category pattern matching
 * @since 2.10.0
 */
export declare const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B>
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B | C>
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`ReaderTask`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchE: <R, E, A, B>(
  onLeft: (e: E) => ReaderTask<R, B>,
  onRight: (a: A) => ReaderTask<R, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export declare const fold: <R, E, A, B>(
  onLeft: (e: E) => ReaderTask<R, B>,
  onRight: (a: A) => ReaderTask<R, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchEW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => ReaderTask<R2, B>,
  onRight: (a: A) => ReaderTask<R3, C>
) => <R1>(ma: ReaderTaskEither<R1, E, A>) => ReaderTask<R1 & R2 & R3, B | C>
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const foldW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => ReaderTask<R2, B>,
  onRight: (a: A) => ReaderTask<R3, C>
) => <R1>(ma: ReaderTaskEither<R1, E, A>) => ReaderTask<R1 & R2 & R3, B | C>
/**
 * @category error handling
 * @since 2.0.0
 */
export declare const getOrElse: <R, E, A>(
  onLeft: (e: E) => ReaderTask<R, A>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTask<R, A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
export declare const getOrElseW: <R2, E, B>(
  onLeft: (e: E) => ReaderTask<R2, B>
) => <R1, A>(ma: ReaderTaskEither<R1, E, A>) => ReaderTask<R1 & R2, A | B>
/**
 * @category conversions
 * @since 2.10.0
 */
export declare const toUnion: <R, E, A>(fa: ReaderTaskEither<R, E, A>) => ReaderTask<R, E | A>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const fromNullable: <E>(e: E) => <R, A>(a: A) => ReaderTaskEither<R, E, NonNullable<A>>
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const fromNullableK: <E>(
  e: E
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => <R = unknown>(...a: A) => ReaderTaskEither<R, E, NonNullable<B>>
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainNullableK: <E>(
  e: E
) => <A, B>(
  f: (a: A) => B | null | undefined
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, NonNullable<B>>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.0.0
 */
export declare const local: <R2, R1>(
  f: (r2: R2) => R1
) => <E, A>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R2, E, A>
/**
 * Less strict version of [`asksReaderTaskEither`](#asksreadertaskeither).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksReaderTaskEitherW: <R1, R2, E, A>(
  f: (r1: R1) => ReaderTaskEither<R2, E, A>
) => ReaderTaskEither<R1 & R2, E, A>
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksReaderTaskEither: <R, E, A>(
  f: (r: R) => ReaderTaskEither<R, E, A>
) => ReaderTaskEither<R, E, A>
/**
 * @category error handling
 * @since 2.0.0
 */
export declare const orElse: <R, E1, A, E2>(
  onLeft: (e: E1) => ReaderTaskEither<R, E2, A>
) => (ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E2, A>
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
export declare const orElseW: <E1, R1, E2, B>(
  onLeft: (e: E1) => ReaderTaskEither<R1, E2, B>
) => <R2, A>(ma: ReaderTaskEither<R2, E1, A>) => ReaderTaskEither<R1 & R2, E2, A | B>
/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 2.15.0
 */
export declare const tapError: {
  <E1, R2, E2, _>(onLeft: (e: E1) => ReaderTaskEither<R2, E2, _>): <R1, A>(
    self: ReaderTaskEither<R1, E1, A>
  ) => ReaderTaskEither<R1 & R2, E1 | E2, A>
  <R1, E1, A, R2, E2, _>(
    self: ReaderTaskEither<R1, E1, A>,
    onLeft: (e: E1) => ReaderTaskEither<R2, E2, _>
  ): ReaderTaskEither<R1 & R2, E1 | E2, A>
}
/**
 * @category error handling
 * @since 2.11.0
 */
export declare const orLeft: <E1, R, E2>(
  onLeft: (e: E1) => ReaderTask<R, E2>
) => <A>(fa: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E2, A>
/**
 * @category error handling
 * @since 2.16.6
 */
export declare const orLeftW: <E1, R2, E2>(
  onLeft: (e: E1) => ReaderTask<R2, E2>
) => <R1, A>(fa: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E2, A>
/**
 * @since 2.0.0
 */
export declare const swap: <R, E, A>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, A, E>
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromIOEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IOEither<E, B>
) => <R = unknown>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromTaskEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TaskEither<E, B>
) => <R = unknown>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromReaderEitherK: <R, E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => ReaderEither<R, E, B>
) => (...a: A) => ReaderTaskEither<R, E, B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R, E>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Returns a `ReaderTaskEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @example
 * import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 * const g = (n: number) => n * 2
 *
 * async function test() {
 *   assert.deepStrictEqual(await ReaderTaskEither.mapBoth(ReaderTaskEither.right(1), f, g)({})(), Either.right(2))
 *   assert.deepStrictEqual(await ReaderTaskEither.mapBoth(ReaderTaskEither.left('err'), f, g)({})(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
export declare const mapBoth: {
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B): <R>(self: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, B>
  <R, E, A, G, B>(self: ReaderTaskEither<R, E, A>, f: (e: E) => G, g: (a: A) => B): ReaderTaskEither<R, G, B>
}
/**
 * Alias of `mapBoth`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, B>
/**
 * Returns a `ReaderTaskEither` with its error channel mapped using the specified function.
 *
 * @example
 * import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 *
 * async function test() {
 *   assert.deepStrictEqual(await ReaderTaskEither.mapError(ReaderTaskEither.right(1), f)({})(), Either.right(1))
 *   assert.deepStrictEqual(await ReaderTaskEither.mapError(ReaderTaskEither.left('err'), f)({})(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
export declare const mapError: {
  <R, E, G>(f: (e: E) => G): <A>(self: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, A>
  <R, E, A, G>(self: ReaderTaskEither<R, E, A>, f: (e: E) => G): ReaderTaskEither<R, G, A>
}
/**
 * Alias of `mapError`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, A>
/**
 * @since 2.0.0
 */
export declare const ap: <R, E, A>(
  fa: ReaderTaskEither<R, E, A>
) => <B>(fab: ReaderTaskEither<R, E, (a: A) => B>) => ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export declare const apW: <R2, E2, A>(
  fa: ReaderTaskEither<R2, E2, A>
) => <R1, E1, B>(fab: ReaderTaskEither<R1, E1, (a: A) => B>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * @category constructors
 * @since 2.7.0
 */
export declare const of: <R = unknown, E = never, A = never>(a: A) => ReaderTaskEither<R, E, A>
/**
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, R2, E2, B>(f: (a: A) => ReaderTaskEither<R2, E2, B>): <R1, E1>(
    ma: ReaderTaskEither<R1, E1, A>
  ) => ReaderTaskEither<R1 & R2, E1 | E2, B>
  <R1, E1, A, R2, E2, B>(ma: ReaderTaskEither<R1, E1, A>, f: (a: A) => ReaderTaskEither<R2, E2, B>): ReaderTaskEither<
    R1 & R2,
    E1 | E2,
    B
  >
}
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export declare const flattenW: <R1, E1, R2, E2, A>(
  mma: ReaderTaskEither<R1, E1, ReaderTaskEither<R2, E2, A>>
) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatten: <R, E, A>(
  mma: ReaderTaskEither<R, E, ReaderTaskEither<R, E, A>>
) => ReaderTaskEither<R, E, A>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.0.0
 */
export declare const alt: <R, E, A>(
  that: () => ReaderTaskEither<R, E, A>
) => (fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export declare const altW: <R2, E2, B>(
  that: () => ReaderTaskEither<R2, E2, B>
) => <R1, E1, A>(fa: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E2, A | B>
/**
 * @since 2.0.0
 */
export declare const throwError: MonadThrow3<URI>['throwError']
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'ReaderTaskEither'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderTaskEither<R, E, A>
  }
}
/**
 * @category filtering
 * @since 2.10.0
 */
export declare const getCompactable: <E>(M: Monoid<E>) => Compactable3C<URI, E>
/**
 * @category filtering
 * @since 2.10.0
 */
export declare function getFilterable<E>(M: Monoid<E>): Filterable3C<URI, E>
/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getApplicativeValidation`](./Either.ts.html#getapplicativevalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export declare function getApplicativeReaderTaskValidation<E>(A: Apply1<T.URI>, S: Semigroup<E>): Applicative3C<URI, E>
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getAltValidation`](./Either.ts.html#getaltvalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export declare function getAltReaderTaskValidation<E>(S: Semigroup<E>): Alt3C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor3<URI>
/**
 * Maps the `Right` value of this `ReaderTaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const as: {
  <A>(a: A): <R, E, _>(self: ReaderTaskEither<R, E, _>) => ReaderTaskEither<R, E, A>
  <R, E, _, A>(self: ReaderTaskEither<R, E, _>, a: A): ReaderTaskEither<R, E, A>
}
/**
 * Maps the `Right` value of this `ReaderTaskEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const asUnit: <R, E, _>(self: ReaderTaskEither<R, E, _>) => ReaderTaskEither<R, E, void>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <R, E, B>(
  fab: import('./HKT').Kind3<'ReaderTaskEither', R, E, (a: A) => B>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed3<URI>
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
export declare const ApplyPar: Apply3<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export declare const apFirst: <R, E, B>(
  second: ReaderTaskEither<R, E, B>
) => <A>(
  first: import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export declare const apFirstW: <R2, E2, B>(
  second: ReaderTaskEither<R2, E2, B>
) => <R1, E1, A>(first: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export declare const apSecond: <R, E, B>(
  second: ReaderTaskEither<R, E, B>
) => <A>(
  first: import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export declare const apSecondW: <R2, E2, B>(
  second: ReaderTaskEither<R2, E2, B>
) => <R1, E1, A>(first: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativePar: Applicative3<URI>
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
export declare const ApplySeq: Apply3<URI>
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativeSeq: Applicative3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: chainable.Chain3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadThrow: MonadThrow3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO3<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask3<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromReader: FromReader3<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export declare const tap: {
  <R1, E1, A, R2, E2, _>(self: ReaderTaskEither<R1, E1, A>, f: (a: A) => ReaderTaskEither<R2, E2, _>): ReaderTaskEither<
    R1 & R2,
    E1 | E2,
    A
  >
  <A, R2, E2, _>(f: (a: A) => ReaderTaskEither<R2, E2, _>): <R1, E1>(
    self: ReaderTaskEither<R1, E1, A>
  ) => ReaderTaskEither<R1 & R2, E2 | E1, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 *
 * const checkString = (value: string) => pipe(
 *   RTE.ask<number>(),
 *   RTE.tapEither((minLength) => value.length > minLength ? E.right('ok') : E.left('error'))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await checkString('')(2)(), E.left('error'))
 *   assert.deepStrictEqual(await checkString('fp-ts')(2)(), E.right(2))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapEither: {
  <A, E2, _>(f: (a: A) => Either<E2, _>): <R, E1>(self: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, A>
  <R, E1, A, E2, _>(self: ReaderTaskEither<R, E1, A>, f: (a: A) => Either<E2, _>): ReaderTaskEither<R, E1 | E2, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as Console from 'fp-ts/Console'
 *
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effect = RTE.tapIO(
 *   RTE.ask<string>(),
 *   (value) => Console.log(`Hello, ${value}`)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect('fp-ts')(), E.of('fp-ts'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <R, E>(self: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
  <R, E, A, _>(self: ReaderTaskEither<R, E, A>, f: (a: A) => IO<_>): ReaderTaskEither<R, E, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as T from 'fp-ts/Task'
 *
 *
 * const effect = RTE.tapTask(
 *   RTE.ask<number>(),
 *   (value) => T.of(value + 1)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(1)(), E.of(1))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapTask: {
  <A, _>(f: (a: A) => Task<_>): <R, E>(self: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
  <R, E, A, _>(self: ReaderTaskEither<R, E, A>, f: (a: A) => Task<_>): ReaderTaskEither<R, E, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReader: {
  <A, R2, _>(f: (a: A) => Reader<R2, _>): <R1, E>(self: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, A>
  <R1, E, A, R2, _>(self: ReaderTaskEither<R1, E, A>, f: (a: A) => Reader<R2, _>): ReaderTaskEither<R1 & R2, E, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReaderEither: {
  <A, R2, E2, _>(f: (a: A) => ReaderEither<R2, E2, _>): <R1, E1>(
    self: ReaderTaskEither<R1, E1, A>
  ) => ReaderTaskEither<R1 & R2, E1 | E2, A>
  <R1, E1, A, R2, E2, _>(self: ReaderTaskEither<R1, E1, A>, f: (a: A) => ReaderEither<R2, E2, _>): ReaderTaskEither<
    R1 & R2,
    E1 | E2,
    A
  >
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapTaskEither: {
  <A, E2, _>(f: (a: A) => TaskEither<E2, _>): <R, E1>(
    self: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E1 | E2, A>
  <R, E1, A, E2, _>(self: ReaderTaskEither<R, E1, A>, f: (a: A) => TaskEither<E2, _>): ReaderTaskEither<R, E1 | E2, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReaderTask: {
  <A, R2, _>(f: (a: A) => ReaderTask<R2, _>): <R1, E>(
    self: ReaderTaskEither<R1, E, A>
  ) => ReaderTaskEither<R1 & R2, E, A>
  <R1, E, A, R2, _>(self: ReaderTaskEither<R1, E, A>, f: (a: A) => ReaderTask<R2, _>): ReaderTaskEither<R1 & R2, E, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReaderIO: {
  <A, R2, _>(f: (a: A) => ReaderIO<R2, _>): <R1, E>(self: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, A>
  <R1, E, A, R2, _>(self: ReaderTaskEither<R1, E, A>, f: (a: A) => ReaderIO<R2, _>): ReaderTaskEither<R1 & R2, E, A>
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor3<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt3<URI>
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const ask: <R, E = never>() => ReaderTaskEither<R, E, R>
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const asks: <R, A, E = never>(f: (r: R) => A) => ReaderTaskEither<R, E, A>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => R.Reader<R, B>
) => <E>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2, E>(ma: ReaderTaskEither<R2, E, A>) => ReaderTaskEither<R1 & R2, E, A>
/**
 * Alias of `tapReaderEither`.
 *
 * Less strict version of [`chainFirstReaderEitherK`](#chainfirstreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderEitherKW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * Alias of `tapReaderEither`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderEitherK: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Alias of `tapTaskEither`.
 *
 * Less strict version of [`chainFirstTaskEitherK`](#chainfirsttaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, A>
/**
 * Alias of `tapTaskEither`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromReaderTaskK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => ReaderTask<R, B>
) => <E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Alias of `tapReaderTask`.
 *
 * Less strict version of [`chainFirstReaderTaskK`](#chainfirstreadertaskk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderTaskKW: <A, R2, B>(
  f: (a: A) => RT.ReaderTask<R2, B>
) => <R1, E>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, A>
/**
 * Alias of `tapReaderTask`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderTaskK: <A, R, B>(
  f: (a: A) => RT.ReaderTask<R, B>
) => <E>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category lifting
 * @since 2.13.0
 */
export declare const fromReaderIOK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => ReaderIO<R, B>
) => <E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Alias of `tapReaderIO`.
 *
 * Less strict version of [`chainFirstReaderIOK`](#chainfirstreaderiok).
 *
 * @category legacy
 * @since 2.13.0
 */
export declare const chainFirstReaderIOKW: <A, R2, B>(
  f: (a: A) => ReaderIO<R2, B>
) => <R1, E>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, A>
/**
 * Alias of `tapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export declare const chainFirstReaderIOK: <A, R, B>(
  f: (a: A) => ReaderIO<R, B>
) => <E>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromOption: <E>(onNone: LazyArg<E>) => <A, R = unknown>(fa: Option<A>) => ReaderTaskEither<R, E, A>
/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => <R = unknown>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainOptionK: <E>(
  onNone: LazyArg<E>
) => <A, B>(f: (a: A) => Option<B>) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
export declare const chainOptionKW: <E2>(
  onNone: LazyArg<E2>
) => <A, B>(f: (a: A) => Option<B>) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * @category lifting
 * @since 2.15.0
 */
export declare const liftNullable: <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: (...a: A) => E
) => <R>(...a: A) => ReaderTaskEither<R, E, NonNullable<B>>
/**
 * @category lifting
 * @since 2.15.0
 */
export declare const liftOption: <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => Option<B>,
  onNone: (...a: A) => E
) => <R>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category sequencing
 * @since 2.15.0
 */
export declare const flatMapNullable: {
  <A, B, E2>(f: (a: A) => B | null | undefined, onNullable: (a: A) => E2): <R, E1>(
    self: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E2 | E1, NonNullable<B>>
  <R, E1, A, B, E2>(
    self: ReaderTaskEither<R, E1, A>,
    f: (a: A) => B | null | undefined,
    onNullable: (a: A) => E2
  ): ReaderTaskEither<R, E1 | E2, NonNullable<B>>
}
/**
 * @category sequencing
 * @since 2.15.0
 */
export declare const flatMapOption: {
  <A, B, E2>(f: (a: A) => Option<B>, onNone: (a: A) => E2): <R, E1>(
    self: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E2 | E1, B>
  <R, E1, A, B, E2>(self: ReaderTaskEither<R, E1, A>, f: (a: A) => Option<B>, onNone: (a: A) => E2): ReaderTaskEither<
    R,
    E1 | E2,
    B
  >
}
/**
 * @category sequencing
 * @since 2.15.0
 */
export declare const flatMapEither: {
  <A, E2, B>(f: (a: A) => E.Either<E2, B>): <R, E1>(self: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
  <R, E1, A, E2, B>(self: ReaderTaskEither<R, E1, A>, f: (a: A) => E.Either<E2, B>): ReaderTaskEither<R, E1 | E2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapTaskEither: {
  <A, E2, B>(f: (a: A) => TaskEither<E2, B>): <R, E1>(
    self: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E1 | E2, B>
  <R, E1, A, E2, B>(self: ReaderTaskEither<R, E1, A>, f: (a: A) => TaskEither<E2, B>): ReaderTaskEither<R, E1 | E2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReaderTask: {
  <A, R2, B>(f: (a: A) => ReaderTask<R2, B>): <R1, E>(
    self: ReaderTaskEither<R1, E, A>
  ) => ReaderTaskEither<R1 & R2, E, B>
  <R1, E, A, R2, B>(self: ReaderTaskEither<R1, E, A>, f: (a: A) => ReaderTask<R2, B>): ReaderTaskEither<R1 & R2, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapIO: {
  <A, B>(f: (a: A) => IO<B>): <R, E>(self: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
  <R, E, A, B>(self: ReaderTaskEither<R, E, A>, f: (a: A) => IO<B>): ReaderTaskEither<R, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapTask: {
  <A, B>(f: (a: A) => Task<B>): <R, E>(self: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
  <R, E, A, B>(self: ReaderTaskEither<R, E, A>, f: (a: A) => Task<B>): ReaderTaskEither<R, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReader: {
  <A, R2, B>(f: (a: A) => Reader<R2, B>): <R1, E>(self: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, B>
  <R1, E, A, R2, B>(self: ReaderTaskEither<R1, E, A>, f: (a: A) => Reader<R2, B>): ReaderTaskEither<R1 & R2, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReaderIO: {
  <A, R2, B>(f: (a: A) => ReaderIO<R2, B>): <R1, E>(self: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, B>
  <R1, E, A, R2, B>(self: ReaderTaskEither<R1, E, A>, f: (a: A) => ReaderIO<R2, B>): ReaderTaskEither<R1 & R2, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapIOEither: {
  <A, E2, B>(f: (a: A) => IOEither<E2, B>): <R, E1>(self: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
  <R, E1, A, E2, B>(self: ReaderTaskEither<R, E1, A>, f: (a: A) => IOEither<E2, B>): ReaderTaskEither<R, E1 | E2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReaderEither: {
  <A, R2, E2, B>(f: (a: A) => ReaderEither<R2, E2, B>): <R1, E1>(
    self: ReaderTaskEither<R1, E1, A>
  ) => ReaderTaskEither<R1 & R2, E1 | E2, B>
  <R1, E1, A, R2, E2, B>(self: ReaderTaskEither<R1, E1, A>, f: (a: A) => ReaderEither<R2, E2, B>): ReaderTaskEither<
    R1 & R2,
    E1 | E2,
    B
  >
}
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Alias of `tapEither`.
 *
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, A>
/**
 * Alias of `flatMapTaskEither`.
 *
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * Alias of `flatMapTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapReaderTask`.
 *
 * Less strict version of [`chainReaderTaskK`](#chainreadertaskk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderTaskKW: <A, R2, B>(
  f: (a: A) => RT.ReaderTask<R2, B>
) => <R1, E>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, B>
/**
 * Alias of `flatMapReaderTask`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderTaskK: <A, R, B>(
  f: (a: A) => RT.ReaderTask<R, B>
) => <E>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * @category lifting
 * @since 2.0.0
 */
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R = unknown>(
    a: A
  ) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R = unknown, B extends A = A>(
    b: B
  ) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R = unknown>(a: A) => ReaderTaskEither<R, E, A>
}
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderTaskEither<R, E, A>
  ) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R, B extends A>(
    mb: ReaderTaskEither<R, E, B>
  ) => ReaderTaskEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
}
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
export declare const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1, B extends A>(
    mb: ReaderTaskEither<R, E1, B>
  ) => ReaderTaskEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderTaskEither<R, E1, A>
  ) => ReaderTaskEither<R, E1 | E2, A>
}
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <R = unknown>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => <R = unknown, E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainIOK: <A, B>(
  f: (a: A) => IO<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(
  f: (a: A) => IO<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => T.Task<B>
) => <R = unknown, E = never>(...a: A) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainTaskK: <A, B>(
  f: (a: A) => T.Task<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `tapTask`.
 * @category legacy
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(
  f: (a: A) => T.Task<B>
) => <R, E>(first: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <E>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2, E>(ma: ReaderTaskEither<R2, E, A>) => ReaderTaskEither<R1 & R2, E, B>
/**
 * Alias of `flatMapReaderIO`.
 *
 * Less strict version of [`chainReaderIOK`](#chainreaderiok).
 *
 * @category legacy
 * @since 2.13.0
 */
export declare const chainReaderIOKW: <A, R2, B>(
  f: (a: A) => ReaderIO<R2, B>
) => <R1, E>(ma: ReaderTaskEither<R1, E, A>) => ReaderTaskEither<R1 & R2, E, B>
/**
 * Alias of `flatMapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export declare const chainReaderIOK: <A, R, B>(
  f: (a: A) => ReaderIO<R, B>
) => <E>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <R, E1>(ma: ReaderTaskEither<R, E1, A>) => ReaderTaskEither<R, E1 | E2, B>
/**
 * Alias of `flatMapIOEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMapReaderEither`.
 *
 * Less strict version of [`chainReaderEitherK`](#chainreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderEitherKW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * Alias of `flatMapReaderEither`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderEitherK: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.4
 */
export declare function bracket<R, E, A, B>(
  acquire: ReaderTaskEither<R, E, A>,
  use: (a: A) => ReaderTaskEither<R, E, B>,
  release: (a: A, e: Either<E, B>) => ReaderTaskEither<R, E, void>
): ReaderTaskEither<R, E, B>
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
export declare function bracketW<R1, E1, A, R2, E2, B, R3, E3>(
  acquire: ReaderTaskEither<R1, E1, A>,
  use: (a: A) => ReaderTaskEither<R2, E2, B>,
  release: (a: A, e: Either<E2, B>) => ReaderTaskEither<R3, E3, void>
): ReaderTaskEither<R1 & R2 & R3, E1 | E2 | E3, B>
/**
 * @category do notation
 * @since 2.9.0
 */
export declare const Do: ReaderTaskEither<unknown, never, {}>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <R, E, A>(
  fa: import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <R, E>(
  fa: import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
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
export declare const bind: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind3<'ReaderTaskEither', R, E, B>
) => (
  ma: import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderTaskEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderTaskEither<R1, E1, A>
) => ReaderTaskEither<
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTaskEither<R, E, B>
) => (
  fa: import('./HKT').Kind3<'ReaderTaskEither', R, E, A>
) => import('./HKT').Kind3<'ReaderTaskEither', R, E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTaskEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderTaskEither<R1, E1, A>
) => ReaderTaskEither<
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: ReaderTaskEither<unknown, never, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTaskEither<R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTaskEither<R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <A, R, E, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, E, A, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArray: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const sequenceArray: <R, E, A>(
  arr: ReadonlyArray<ReaderTaskEither<R, E, A>>
) => ReaderTaskEither<R, E, ReadonlyArray<A>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseSeqArrayWithIndex: <R, E, A, B>(
  f: (index: number, a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseSeqArray: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderTaskEither<R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const sequenceSeqArray: <R, E, A>(
  arr: ReadonlyArray<ReaderTaskEither<R, E, A>>
) => ReaderTaskEither<R, E, ReadonlyArray<A>>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chain: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export declare const chainW: <R2, E2, A, B>(
  f: (a: A) => ReaderTaskEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, B>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chainFirst: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
export declare const chainFirstW: <R2, E2, A, B>(
  f: (a: A) => ReaderTaskEither<R2, E2, B>
) => <R1, E1>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const orElseFirst: <E, R, B>(
  onLeft: (e: E) => ReaderTaskEither<R, E, B>
) => <A>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const orElseFirstW: <E1, R2, E2, B>(
  onLeft: (e: E1) => ReaderTaskEither<R2, E2, B>
) => <R1, A>(ma: ReaderTaskEither<R1, E1, A>) => ReaderTaskEither<R1 & R2, E1 | E2, A>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RTE.Functor` instead of `RTE.readerTaskEither`
 * (where `RTE` is from `import RTE from 'fp-ts/ReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const readerTaskEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI> & MonadTask3<URI> & MonadThrow3<URI>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RTE.Functor` instead of `RTE.readerTaskEitherSeq`
 * (where `RTE` is from `import RTE from 'fp-ts/ReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const readerTaskEitherSeq: typeof readerTaskEither
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplySemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderTaskEither<R, E, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getApplyMonoid: <R, E, A>(M: Monoid<A>) => Monoid<ReaderTaskEither<R, E, A>>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderTaskEither<R, E, A>>
/**
 * Use [`getApplicativeReaderTaskValidation`](#getapplicativereadertaskvalidation) and [`getAltReaderTaskValidation`](#getaltreadertaskvalidation) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export declare function getReaderTaskValidation<E>(
  SE: Semigroup<E>
): Monad3C<URI, E> & Bifunctor3<URI> & Alt3C<URI, E> & MonadTask3C<URI, E> & MonadThrow3C<URI, E>
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function run<R, E, A>(ma: ReaderTaskEither<R, E, A>, r: R): Promise<Either<E, A>>
