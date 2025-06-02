/**
 * @since 2.3.0
 */
import { Applicative2 } from './Applicative'
import { Apply2 } from './Apply'
import * as chainable from './Chain'
import { FromIO2 } from './FromIO'
import { FromReader2 } from './FromReader'
import { FromTask2 } from './FromTask'
import { Functor2 } from './Functor'
import { IO } from './IO'
import { Monad2 } from './Monad'
import { MonadIO2 } from './MonadIO'
import { MonadTask2 } from './MonadTask'
import { Monoid } from './Monoid'
import { Pointed2 } from './Pointed'
import * as R from './Reader'
import * as RIO from './ReaderIO'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Semigroup } from './Semigroup'
import * as T from './Task'
import ReaderIO = RIO.ReaderIO
import Task = T.Task
/**
 * @category model
 * @since 2.3.0
 */
export interface ReaderTask<R, A> {
  (r: R): Task<A>
}
/**
 * @category conversions
 * @since 2.3.0
 */
export declare const fromReader: <R, A>(fa: R.Reader<R, A>) => ReaderTask<R, A>
/**
 * @category conversions
 * @since 2.3.0
 */
export declare const fromTask: <A, R = unknown>(fa: Task<A>) => ReaderTask<R, A>
/**
 * @category conversions
 * @since 2.3.0
 */
export declare const fromIO: <A, R = unknown>(fa: IO<A>) => ReaderTask<R, A>
/**
 * @category conversions
 * @since 2.13.0
 */
export declare const fromReaderIO: <R, A>(fa: ReaderIO<R, A>) => ReaderTask<R, A>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.3.0
 */
export declare const local: <R2, R1>(f: (r2: R2) => R1) => <A>(ma: ReaderTask<R1, A>) => ReaderTask<R2, A>
/**
 * Less strict version of [`asksReaderTask`](#asksreadertask).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksReaderTaskW: <R1, R2, A>(f: (r1: R1) => ReaderTask<R2, A>) => ReaderTask<R1 & R2, A>
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksReaderTask: <R, A>(f: (r: R) => ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.3.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R>(fa: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * @since 2.3.0
 */
export declare const ap: <R, A>(fa: ReaderTask<R, A>) => <B>(fab: ReaderTask<R, (a: A) => B>) => ReaderTask<R, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.8.0
 */
export declare const apW: <R2, A>(
  fa: ReaderTask<R2, A>
) => <R1, B>(fab: ReaderTask<R1, (a: A) => B>) => ReaderTask<R1 & R2, B>
/**
 * @category constructors
 * @since 2.3.0
 */
export declare const of: <R = unknown, A = never>(a: A) => ReaderTask<R, A>
/**
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, R2, B>(f: (a: A) => ReaderTask<R2, B>): <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
  <R1, A, R2, B>(ma: ReaderTask<R1, A>, f: (a: A) => ReaderTask<R2, B>): ReaderTask<R1 & R2, B>
}
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export declare const flattenW: <R1, R2, A>(mma: ReaderTask<R1, ReaderTask<R2, A>>) => ReaderTask<R1 & R2, A>
/**
 * @category sequencing
 * @since 2.3.0
 */
export declare const flatten: <R, A>(mma: ReaderTask<R, ReaderTask<R, A>>) => ReaderTask<R, A>
/**
 * @category type lambdas
 * @since 2.3.0
 */
export declare const URI = 'ReaderTask'
/**
 * @category type lambdas
 * @since 2.3.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: ReaderTask<E, A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor2<URI>
/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const as: {
  <A>(a: A): <R, _>(self: ReaderTask<R, _>) => ReaderTask<R, A>
  <R, _, A>(self: ReaderTask<R, _>, a: A): ReaderTask<R, A>
}
/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const asUnit: <R, _>(self: ReaderTask<R, _>) => ReaderTask<R, void>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <E, B>(fab: import('./HKT').Kind2<'ReaderTask', E, (a: A) => B>) => import('./HKT').Kind2<'ReaderTask', E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
export declare const ApplyPar: Apply2<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.3.0
 */
export declare const apFirst: <E, B>(
  second: ReaderTask<E, B>
) => <A>(first: import('./HKT').Kind2<'ReaderTask', E, A>) => import('./HKT').Kind2<'ReaderTask', E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.16.10
 */
export declare const apFirstW: <R2, B>(
  second: ReaderTask<R2, B>
) => <R1, A>(first: ReaderTask<R1, A>) => ReaderTask<R1 & R2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.3.0
 */
export declare const apSecond: <E, B>(
  second: ReaderTask<E, B>
) => <A>(first: import('./HKT').Kind2<'ReaderTask', E, A>) => import('./HKT').Kind2<'ReaderTask', E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.16.10
 */
export declare const apSecondW: <R2, B>(
  second: ReaderTask<R2, B>
) => <R1, A>(first: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativePar: Applicative2<URI>
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
export declare const ApplySeq: Apply2<URI>
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
export declare const ApplicativeSeq: Applicative2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: chainable.Chain2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask2<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromReader: FromReader2<URI>
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapIO: {
  <A, B>(f: (a: A) => IO<B>): <R>(self: ReaderTask<R, A>) => ReaderTask<R, B>
  <R, A, B>(self: ReaderTask<R, A>, f: (a: A) => IO<B>): ReaderTask<R, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapTask: {
  <A, B>(f: (a: A) => Task<B>): <R>(self: ReaderTask<R, A>) => ReaderTask<R, B>
  <R, A, B>(self: ReaderTask<R, A>, f: (a: A) => Task<B>): ReaderTask<R, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReader: {
  <A, R2, B>(f: (a: A) => R.Reader<R2, B>): <R1>(self: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
  <R1, A, R2, B>(self: ReaderTask<R1, A>, f: (a: A) => R.Reader<R2, B>): ReaderTask<R1 & R2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReaderIO: {
  <A, R2, B>(f: (a: A) => ReaderIO<R2, B>): <R1>(self: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
  <R1, A, R2, B>(self: ReaderTask<R1, A>, f: (a: A) => ReaderIO<R2, B>): ReaderTask<R1 & R2, B>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export declare const tap: {
  <R1, A, R2, _>(self: ReaderTask<R1, A>, f: (a: A) => ReaderTask<R2, _>): ReaderTask<R1 & R2, A>
  <A, R2, _>(f: (a: A) => ReaderTask<R2, _>): <R1>(self: ReaderTask<R1, A>) => ReaderTask<R2 & R1, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RT from 'fp-ts/ReaderTask'
 * import * as Console from 'fp-ts/Console'
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effect = pipe(
 *   RT.ask<string>(),
 *   RT.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect('fp-ts')(), 'fp-ts')
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <R>(self: ReaderTask<R, A>) => ReaderTask<R, A>
  <R, A, _>(self: ReaderTask<R, A>, f: (a: A) => IO<_>): ReaderTask<R, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReader: {
  <R2, A, _>(f: (a: A) => R.Reader<R2, _>): <R1>(self: ReaderTask<R1, A>) => ReaderTask<R1 & R2, A>
  <R1, R2, A, _>(self: ReaderTask<R1, A>, f: (a: A) => R.Reader<R2, _>): ReaderTask<R1 & R2, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RT from 'fp-ts/ReaderTask'
 * import * as T from 'fp-ts/Task'
 *
 * const effect = pipe(
 *   RT.ask<number>(),
 *   RT.tapTask((value) => T.of(value + 1)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(1)(), 1)
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapTask: {
  <A, _>(f: (a: A) => Task<_>): <R>(self: ReaderTask<R, A>) => ReaderTask<R, A>
  <R, A, _>(self: ReaderTask<R, A>, f: (a: A) => Task<_>): ReaderTask<R, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReaderIO: {
  <R2, A, _>(f: (a: A) => ReaderIO<R2, _>): <R1>(self: ReaderTask<R1, A>) => ReaderTask<R1 & R2, A>
  <R1, R2, A, _>(self: ReaderTask<R1, A>, f: (a: A) => ReaderIO<R2, _>): ReaderTask<R1 & R2, A>
}
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => <R = unknown>(...a: A) => ReaderTask<R, B>
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainIOK: <A, B>(f: (a: A) => IO<B>) => <R>(first: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(f: (a: A) => IO<B>) => <R>(first: ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.3.0
 */
export declare const ask: <R>() => import('./HKT').Kind2<'ReaderTask', R, R>
/**
 * Projects a value from the global context in a `ReaderTask`.
 *
 * @category constructors
 * @since 2.3.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => import('./HKT').Kind2<'ReaderTask', R, A>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => R.Reader<R, B>
) => (...a: A) => ReaderTask<R, B>
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(f: (a: A) => R.Reader<R, B>) => (ma: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2>(ma: ReaderTask<R2, A>) => ReaderTask<R1 & R2, B>
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => R.Reader<R, B>
) => (ma: ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => R.Reader<R1, B>
) => <R2>(ma: ReaderTask<R2, A>) => ReaderTask<R1 & R2, A>
/**
 * @category lifting
 * @since 2.13.0
 */
export declare const fromReaderIOK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => ReaderIO<R, B>
) => (...a: A) => ReaderTask<R, B>
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
) => <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
/**
 * Alias of `flatMapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export declare const chainReaderIOK: <A, R, B>(
  f: (a: A) => ReaderIO<R, B>
) => (ma: ReaderTask<R, A>) => ReaderTask<R, B>
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
) => <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, A>
/**
 * Alias of `tapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export declare const chainFirstReaderIOK: <A, R, B>(
  f: (a: A) => ReaderIO<R, B>
) => (ma: ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => T.Task<B>
) => <R = unknown>(...a: A) => ReaderTask<R, B>
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainTaskK: <A, B>(f: (a: A) => T.Task<B>) => <R>(first: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Alias of `tapTask`.
 * @category legacy
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(f: (a: A) => T.Task<B>) => <R>(first: ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * @category do notation
 * @since 2.9.0
 */
export declare const Do: ReaderTask<unknown, {}>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(
  fa: import('./HKT').Kind2<'ReaderTask', E, A>
) => import('./HKT').Kind2<'ReaderTask', E, { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(
  fa: import('./HKT').Kind2<'ReaderTask', E, A>
) => import('./HKT').Kind2<'ReaderTask', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
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
export declare const bind: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind2<'ReaderTask', E, B>
) => (
  ma: import('./HKT').Kind2<'ReaderTask', E, A>
) => import('./HKT').Kind2<'ReaderTask', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderTask<R2, B>
) => <R1>(fa: ReaderTask<R1, A>) => ReaderTask<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTask<E, B>
) => (
  fa: import('./HKT').Kind2<'ReaderTask', E, A>
) => import('./HKT').Kind2<'ReaderTask', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, R2, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderTask<R2, B>
) => <R1>(fa: ReaderTask<R1, A>) => ReaderTask<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: ReaderTask<unknown, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTask<R, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyNonEmptyArray<A>) => ReaderTask<R, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArray: <R, A, B>(
  f: (a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const sequenceArray: <R, A>(arr: ReadonlyArray<ReaderTask<R, A>>) => ReaderTask<R, ReadonlyArray<A>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
export declare const traverseSeqArrayWithIndex: <R, A, B>(
  f: (index: number, a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
export declare const traverseSeqArray: <R, A, B>(
  f: (a: A) => ReaderTask<R, B>
) => (as: ReadonlyArray<A>) => ReaderTask<R, ReadonlyArray<B>>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.3.0
 */
export declare const chain: <A, R, B>(f: (a: A) => ReaderTask<R, B>) => (ma: ReaderTask<R, A>) => ReaderTask<R, B>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.7
 */
export declare const chainW: <R2, A, B>(
  f: (a: A) => ReaderTask<R2, B>
) => <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, B>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.3.0
 */
export declare const chainFirst: <A, R, B>(
  f: (a: A) => ReaderTask<R, B>
) => (first: ReaderTask<R, A>) => ReaderTask<R, A>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstW: <R2, A, B>(
  f: (a: A) => ReaderTask<R2, B>
) => <R1>(ma: ReaderTask<R1, A>) => ReaderTask<R1 & R2, A>
/**
 * Use `traverseReadonlyArrayWithIndexSeq` instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export declare const sequenceSeqArray: <R, A>(arr: ReadonlyArray<ReaderTask<R, A>>) => ReaderTask<R, ReadonlyArray<A>>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readerTask`
 * (where `RT` is from `import RT from 'fp-ts/ReaderTask'`)
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export declare const readerTask: MonadTask2<URI>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readerTaskSeq`
 * (where `RT` is from `import RT from 'fp-ts/ReaderTask'`)
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export declare const readerTaskSeq: typeof readerTask
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export declare const getSemigroup: <R, A>(S: Semigroup<A>) => Semigroup<ReaderTask<R, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export declare const getMonoid: <R, A>(M: Monoid<A>) => Monoid<ReaderTask<R, A>>
/**
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export declare function run<R, A>(ma: ReaderTask<R, A>, r: R): Promise<A>
