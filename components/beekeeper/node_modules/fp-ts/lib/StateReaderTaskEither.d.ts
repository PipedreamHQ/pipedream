/**
 * @since 2.0.0
 */
import { Alt4 } from './Alt'
import { Applicative4 } from './Applicative'
import { Apply4 } from './Apply'
import { Bifunctor4 } from './Bifunctor'
import * as chainable from './Chain'
import * as E from './Either'
import { Endomorphism } from './Endomorphism'
import { FromEither4 } from './FromEither'
import { FromIO4 } from './FromIO'
import { FromReader4 } from './FromReader'
import { FromState4 } from './FromState'
import { FromTask4 } from './FromTask'
import { LazyArg } from './function'
import { Functor4 } from './Functor'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { Monad4 } from './Monad'
import { MonadIO4 } from './MonadIO'
import { MonadTask4 } from './MonadTask'
import { MonadThrow4 } from './MonadThrow'
import { Option } from './Option'
import { Pointed4 } from './Pointed'
import { Predicate } from './Predicate'
import * as R from './Reader'
import { ReaderEither } from './ReaderEither'
import * as RTE from './ReaderTaskEither'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { State } from './State'
import { Task } from './Task'
import { TaskEither } from './TaskEither'
import ReaderTaskEither = RTE.ReaderTaskEither
import Either = E.Either
import Reader = R.Reader
/**
 * @category model
 * @since 2.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
  (s: S): ReaderTaskEither<R, E, [A, S]>
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const left: <S, R, E, A = never>(e: E) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const right: <S, R, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function rightTask<S, R, E = never, A = never>(ma: Task<A>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function leftTask<S, R, E, A = never>(me: Task<E>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function rightReader<S, R, E = never, A = never>(ma: Reader<R, A>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function leftReader<S, R, E, A = never>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function rightIO<S, R, E = never, A = never>(ma: IO<A>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function leftIO<S, R, E, A = never>(me: IO<E>): StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const rightState: <S, R, E = never, A = never>(ma: State<S, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const leftState: <S, R, E, A = never>(me: State<S, E>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromEither: <E, A, S, R = unknown>(fa: Either<E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.11.0
 */
export declare const fromReader: <R, A, S, E = never>(fa: Reader<R, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.7.0
 */
export declare const fromIO: <A, S, R = unknown, E = never>(fa: IO<A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.7.0
 */
export declare const fromTask: <A, S, R = unknown, E = never>(fa: Task<A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.10.0
 */
export declare const fromState: <S, A, R = unknown, E = never>(fa: State<S, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromTaskEither: <E, A, S, R = unknown>(fa: TaskEither<E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromIOEither: <E, A, S, R = unknown>(fa: IOEither<E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromReaderEither: <R, E, A, S>(fa: ReaderEither<R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const fromReaderTaskEither: <R, E, A, S>(
  fa: ReaderTaskEither<R, E, A>
) => StateReaderTaskEither<S, R, E, A>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.11.0
 */
export declare const local: <R2, R1>(
  f: (r2: R2) => R1
) => <S, E, A>(ma: StateReaderTaskEither<S, R1, E, A>) => StateReaderTaskEither<S, R2, E, A>
/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksStateReaderTaskEitherW: <R1, S, R2, E, A>(
  f: (r1: R1) => StateReaderTaskEither<S, R2, E, A>
) => StateReaderTaskEither<S, R1 & R2, E, A>
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksStateReaderTaskEither: <R, S, E, A>(
  f: (r: R) => StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, A>
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromIOEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IOEither<E, B>
) => <S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromTaskEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TaskEither<E, B>
) => <S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromReaderTaskEitherK: <R, E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => ReaderTaskEither<R, E, B>
) => <S>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapReaderTaskEither`.
 *
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainReaderTaskEitherKW: <R, E2, A, B>(
  f: (a: A) => ReaderTaskEither<R, E2, B>
) => <S, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B>
/**
 * Alias of `flatMapReaderTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainReaderTaskEitherK: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => <S>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.6.2
 */
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <S, R>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, G, B>
/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.6.2
 */
export declare const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, G, A>
/**
 * @since 2.0.0
 */
export declare const ap: <S, R, E, A>(
  fa: StateReaderTaskEither<S, R, E, A>
) => <B>(fab: StateReaderTaskEither<S, R, E, (a: A) => B>) => StateReaderTaskEither<S, R, E, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export declare const apW: <S, R2, E2, A>(
  fa: StateReaderTaskEither<S, R2, E2, A>
) => <R1, E1, B>(fab: StateReaderTaskEither<S, R1, E1, (a: A) => B>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
/**
 * @category constructors
 * @since 2.7.0
 */
export declare const of: <S, R = unknown, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, S, R2, E2, B>(f: (a: A) => StateReaderTaskEither<S, R2, E2, B>): <R1, E1>(
    ma: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
  <S, R1, E1, A, R2, E2, B>(
    ma: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapTaskEither: {
  <A, E2, B>(f: (a: A) => TaskEither<E2, B>): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(self: StateReaderTaskEither<S, R, E1, A>, f: (a: A) => TaskEither<E2, B>): StateReaderTaskEither<
    S,
    R,
    E1 | E2,
    B
  >
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapIO: {
  <A, B>(f: (a: A) => IO<B>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
  <S, R, E, A, B>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => IO<B>): StateReaderTaskEither<S, R, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapTask: {
  <A, B>(f: (a: A) => Task<B>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
  <S, R, E, A, B>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => Task<B>): StateReaderTaskEither<S, R, E, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReader: {
  <A, R2, B>(f: (a: A) => Reader<R2, B>): <S, R1, E>(
    self: StateReaderTaskEither<S, R1, E, A>
  ) => StateReaderTaskEither<S, R1 & R2, E, B>
  <S, R1, E, A, R2, B>(self: StateReaderTaskEither<S, R1, E, A>, f: (a: A) => Reader<R2, B>): StateReaderTaskEither<
    S,
    R1 & R2,
    E,
    B
  >
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapIOEither: {
  <A, E2, B>(f: (a: A) => IOEither<E2, B>): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(self: StateReaderTaskEither<S, R, E1, A>, f: (a: A) => IOEither<E2, B>): StateReaderTaskEither<
    S,
    R,
    E1 | E2,
    B
  >
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapEither: {
  <A, E2, B>(f: (a: A) => Either<E2, B>): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(self: StateReaderTaskEither<S, R, E1, A>, f: (a: A) => Either<E2, B>): StateReaderTaskEither<
    S,
    R,
    E1 | E2,
    B
  >
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapOption: {
  <A, E2, B>(f: (a: A) => Option<B>, onNone: (a: A) => E2): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(
    self: StateReaderTaskEither<S, R, E1, A>,
    f: (a: A) => Option<B>,
    onNone: (a: A) => E2
  ): StateReaderTaskEither<S, R, E1 | E2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapReaderTaskEither: {
  <A, R2, E2, B>(f: (a: A) => ReaderTaskEither<R2, E2, B>): <S, R1, E1>(
    self: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
  <S, R1, E1, A, R2, E2, B>(
    self: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => ReaderTaskEither<R2, E2, B>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapState: {
  <S, A, B>(f: (a: A) => State<S, B>): <R, E>(
    self: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, B>
  <S, R, E, A, B>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => State<S, B>): StateReaderTaskEither<S, R, E, B>
}
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export declare const flattenW: <S, R1, E1, R2, E2, A>(
  mma: StateReaderTaskEither<S, R1, E1, StateReaderTaskEither<S, R2, E2, A>>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatten: <S, R, E, A>(
  mma: StateReaderTaskEither<S, R, E, StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export declare const altW: <S, R2, E2, B>(
  that: () => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1, A>(fa: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E2, A | B>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.6.2
 */
export declare const alt: <S, R, E, A>(
  that: LazyArg<StateReaderTaskEither<S, R, E, A>>
) => (fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @since 2.7.0
 */
export declare const throwError: MonadThrow4<URI>['throwError']
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'StateReaderTaskEither'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind4<S, R, E, A> {
    readonly [URI]: StateReaderTaskEither<S, R, E, A>
  }
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor4<URI>
/**
 * Maps the `Right` value of this `StateReaderTaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const as: {
  <A>(a: A): <S, R, E, _>(self: StateReaderTaskEither<S, R, E, _>) => StateReaderTaskEither<S, R, E, A>
  <S, R, E, _, A>(self: StateReaderTaskEither<S, R, E, _>, a: A): StateReaderTaskEither<S, R, E, A>
}
/**
 * Maps the `Right` value of this `StateReaderTaskEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const asUnit: <S, R, E, _>(
  self: StateReaderTaskEither<S, R, E, _>
) => StateReaderTaskEither<S, R, E, void>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <S, R, E, B>(
  fab: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, (a: A) => B>
) => import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply4<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export declare const apFirst: <S, R, E, B>(
  second: StateReaderTaskEither<S, R, E, B>
) => <A>(
  first: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
) => import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export declare const apFirstW: <S, R2, E2, A, B>(
  second: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(first: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export declare const apSecond: <S, R, E, B>(
  second: StateReaderTaskEither<S, R, E, B>
) => <A>(
  first: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
) => import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export declare const apSecondW: <S, R2, E2, A, B>(
  second: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(first: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: chainable.Chain4<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromState: FromState4<URI>
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const get: <S, R, E = never>() => StateReaderTaskEither<S, R, E, S>
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const put: <S, R, E = never>(s: S) => StateReaderTaskEither<S, R, E, void>
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const modify: <S, R, E = never>(f: Endomorphism<S>) => StateReaderTaskEither<S, R, E, void>
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const gets: <S, R, E = never, A = never>(f: (s: S) => A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromStateK: <A extends ReadonlyArray<unknown>, S, B>(
  f: (...a: A) => State<S, B>
) => <R = unknown, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapState`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainStateK: <A, S, B>(
  f: (a: A) => State<S, B>
) => <R, E>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monad: Monad4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadIO: MonadIO4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadTask: MonadTask4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const MonadThrow: MonadThrow4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO4<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask4<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromReader: FromReader4<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export declare const tap: {
  <S, R1, E1, A, R2, E2, _>(
    self: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => StateReaderTaskEither<S, R2, E2, _>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
  <A, S, R2, E2, _>(f: (a: A) => StateReaderTaskEither<S, R2, E2, _>): <R1, E1>(
    self: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1 & R2, E2 | E1, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapEither: {
  <A, E2, _>(f: (a: A) => Either<E2, _>): <S, R1, E1>(
    self: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1, E2 | E1, A>
  <S, R1, E1, A, E2, _>(self: StateReaderTaskEither<S, R1, E1, A>, f: (a: A) => Either<E2, _>): StateReaderTaskEither<
    S,
    R1,
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
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
  <S, R, E, A, _>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => IO<_>): StateReaderTaskEither<S, R, E, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapTask: {
  <A, _>(f: (a: A) => Task<_>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
  <S, R, E, A, _>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => Task<_>): StateReaderTaskEither<S, R, E, A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapReader: {
  <A, R2, _>(f: (a: A) => Reader<R2, _>): <S, R1, E>(
    self: StateReaderTaskEither<S, R1, E, A>
  ) => StateReaderTaskEither<S, R1 & R2, E, A>
  <S, R1, E, A, R2, _>(self: StateReaderTaskEither<S, R1, E, A>, f: (a: A) => Reader<R2, _>): StateReaderTaskEither<
    S,
    R1 & R2,
    E,
    A
  >
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Bifunctor: Bifunctor4<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt4<URI>
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const ask: <S, R, E = never>() => StateReaderTaskEither<S, R, E, R>
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asks: <S, R, A, E = never>(f: (r: R) => A) => StateReaderTaskEither<S, R, E, A>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <S, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <S, E>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <S, R2, E>(ma: StateReaderTaskEither<S, R2, E, A>) => StateReaderTaskEither<S, R1 & R2, E, B>
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <S, E>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <S, R2, E>(ma: StateReaderTaskEither<S, R2, E, A>) => StateReaderTaskEither<S, R1 & R2, E, A>
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromOption: <E>(
  onNone: LazyArg<E>
) => <A, S, R = unknown>(fa: Option<A>) => StateReaderTaskEither<S, R, E, A>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => <S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainOptionK: <E>(
  onNone: LazyArg<E>
) => <A, B>(
  f: (a: A) => Option<B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Use `flatMapOption`.
 *
 * Less strict version of [`chainOptionK`](#chainoptionk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.13.2
 */
export declare const chainOptionKW: <E2>(
  onNone: LazyArg<E2>
) => <A, B>(
  f: (a: A) => Option<B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B>
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapEither`.
 *
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B>
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
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
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, A>
/**
 * @category lifting
 * @since 2.4.4
 */
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R = unknown>(
    a: A
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R = unknown, B extends A = A>(
    b: B
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R = unknown>(a: A) => StateReaderTaskEither<S, R, E, A>
}
/**
 * @category filtering
 * @since 2.4.4
 */
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R, B extends A>(
    mb: StateReaderTaskEither<S, R, E, B>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, A>
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
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1, B extends A>(
    mb: StateReaderTaskEither<S, R, E1, B>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, A>
}
/**
 * @category lifting
 * @since 2.4.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => <S, R = unknown, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainIOK: <A, B>(
  f: (a: A) => IO<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainFirstIOK: <A, B>(
  f: (a: A) => IO<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Alias of `flatMapTaskEither`.
 *
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B>
/**
 * Alias of `flatMapTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
export declare const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B>
/**
 * Alias of `flatMapIOEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export declare const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Task<B>
) => <S, R = unknown, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
export declare const chainTaskK: <A, B>(
  f: (a: A) => Task<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `tapTask`.
 * @category legacy
 * @since 2.10.0
 */
export declare const chainFirstTaskK: <A, B>(
  f: (a: A) => Task<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
export declare const evaluate: <S>(
  s: S
) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, A>
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
export declare const execute: <S>(s: S) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, S>
/**
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <S, R, E, A>(
  fa: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
) => import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <S, R, E>(
  fa: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
) => import('./HKT').Kind4<
  'StateReaderTaskEither',
  S,
  R,
  E,
  { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }
>
export {
  /**
   * @since 2.13.0
   */
  let_ as let
}
/**
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, S, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, B>
) => (
  ma: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
) => import('./HKT').Kind4<
  'StateReaderTaskEither',
  S,
  R,
  E,
  { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }
>
/**
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<
  S,
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, S, R, E, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R, E, B>
) => (
  fa: import('./HKT').Kind4<'StateReaderTaskEither', S, R, E, A>
) => import('./HKT').Kind4<
  'StateReaderTaskEither',
  S,
  R,
  E,
  { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }
>
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export declare const apSW: <A, N extends string, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<
  S,
  R1 & R2,
  E1 | E2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, S, R, E, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyNonEmptyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, S, R, E, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <S, R, E, A, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArray: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const sequenceArray: <S, R, E, A>(
  arr: ReadonlyArray<StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, ReadonlyArray<A>>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export declare const chainW: <S, R2, E2, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chainFirst: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
export declare const chainFirstW: <S, R2, E2, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEither`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const stateReaderTaskEither: Monad4<URI> &
  Bifunctor4<URI> &
  Alt4<URI> &
  MonadTask4<URI> &
  MonadThrow4<URI>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEitherSeq`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const stateReaderTaskEitherSeq: typeof stateReaderTaskEither
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const evalState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, A>
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const execState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, S>
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function run<S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S, r: R): Promise<Either<E, [A, S]>>
