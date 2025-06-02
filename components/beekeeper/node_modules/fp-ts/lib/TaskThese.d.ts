/**
 * @since 2.4.0
 */
import { Applicative2C } from './Applicative'
import { Apply1, Apply2C } from './Apply'
import { Bifunctor2 } from './Bifunctor'
import { Chain2C } from './Chain'
import { Either } from './Either'
import { FromEither2 } from './FromEither'
import { FromIO2 } from './FromIO'
import { FromTask2 } from './FromTask'
import { FromThese2 } from './FromThese'
import { LazyArg } from './function'
import { Functor2 } from './Functor'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { Monad2C } from './Monad'
import { MonadTask2C } from './MonadTask'
import { Option } from './Option'
import { Pointed2 } from './Pointed'
import { Predicate } from './Predicate'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import * as T from './Task'
import * as TH from './These'
import These = TH.These
import Task = T.Task
/**
 * @category model
 * @since 2.4.0
 */
export interface TaskThese<E, A> extends Task<These<E, A>> {}
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const left: <E = never, A = never>(e: E) => TaskThese<E, A>
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const right: <E = never, A = never>(a: A) => TaskThese<E, A>
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const both: <E, A>(e: E, a: A) => TaskThese<E, A>
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const rightTask: <E = never, A = never>(ma: Task<A>) => TaskThese<E, A>
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const leftTask: <E = never, A = never>(me: Task<E>) => TaskThese<E, A>
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const rightIO: <E = never, A = never>(ma: IO<A>) => TaskThese<E, A>
/**
 * @category constructors
 * @since 2.4.0
 */
export declare const leftIO: <E = never, A = never>(me: IO<E>) => TaskThese<E, A>
/**
 * @category conversions
 * @since 2.10.0
 */
export declare const fromEither: <E, A>(fa: Either<E, A>) => TaskThese<E, A>
/**
 * @category conversions
 * @since 2.11.0
 */
export declare const fromThese: <E, A>(fa: These<E, A>) => TaskThese<E, A>
/**
 * @category conversions
 * @since 2.7.0
 */
export declare const fromIO: <A, E = never>(fa: IO<A>) => TaskThese<E, A>
/**
 * @category conversions
 * @since 2.4.0
 */
export declare const fromIOEither: <E, A>(fa: IOEither<E, A>) => TaskThese<E, A>
/**
 * @category conversions
 * @since 2.7.0
 */
export declare const fromTask: <A, E = never>(fa: Task<A>) => TaskThese<E, A>
/**
 * @category pattern matching
 * @since 2.10.0
 */
export declare const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B,
  onBoth: (e: E, a: A) => B
) => (fa: TaskThese<E, A>) => Task<B>
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
) => (ma: TaskThese<E, A>) => T.Task<B | C | D>
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchE: <E, B, A>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<B>,
  onBoth: (e: E, a: A) => Task<B>
) => (fa: TaskThese<E, A>) => Task<B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.4.0
 */
export declare const fold: <E, B, A>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<B>,
  onBoth: (e: E, a: A) => Task<B>
) => (fa: TaskThese<E, A>) => Task<B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchEW: <E, B, A, C, D>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<C>,
  onBoth: (e: E, a: A) => Task<D>
) => (fa: TaskThese<E, A>) => Task<B | C | D>
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const foldW: <E, B, A, C, D>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<C>,
  onBoth: (e: E, a: A) => Task<D>
) => (fa: TaskThese<E, A>) => Task<B | C | D>
/**
 * @since 2.4.0
 */
export declare const swap: <E, A>(fa: TaskThese<E, A>) => TaskThese<A, E>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.4.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: TaskThese<E, A>) => TaskThese<E, B>
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.4.0
 */
export declare const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: TaskThese<E, A>) => TaskThese<G, B>
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.4.0
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: TaskThese<E, A>) => TaskThese<G, A>
/**
 * @category constructors
 * @since 2.7.0
 */
export declare const of: <E = never, A = never>(a: A) => TaskThese<E, A>
/**
 * @category type lambdas
 * @since 2.4.0
 */
export declare const URI = 'TaskThese'
/**
 * @category type lambdas
 * @since 2.4.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: TaskThese<E, A>
  }
}
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getApply: <E>(A: Apply1<T.URI>, S: Semigroup<E>) => Apply2C<URI, E>
/**
 * @category instances
 * @since 2.7.0
 */
export declare function getApplicative<E>(A: Apply1<T.URI>, S: Semigroup<E>): Applicative2C<URI, E>
/**
 * @category instances
 * @since 2.10.0
 */
export declare function getChain<E>(S: Semigroup<E>): Chain2C<URI, E>
/**
 * @category instances
 * @since 2.4.0
 */
export declare function getMonad<E>(S: Semigroup<E>): Monad2C<URI, E> & MonadTask2C<URI, E>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Functor: Functor2<URI>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <E, B>(fab: import('./HKT').Kind2<'TaskThese', E, (a: A) => B>) => import('./HKT').Kind2<'TaskThese', E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Bifunctor: Bifunctor2<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromEither: FromEither2<URI>
/**
 * @category conversions
 * @since 2.10.0
 */
export declare const fromOption: <E>(onNone: LazyArg<E>) => <A>(fa: Option<A>) => TaskThese<E, A>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Option<B>) => (...a: A) => TaskThese<E, B>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromPredicate: {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => TaskThese<E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(b: B) => TaskThese<E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => TaskThese<E, A>
}
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromThese: FromThese2<URI>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromTheseK: <A extends ReadonlyArray<unknown>, E, B>(
  f: (...a: A) => TH.These<E, B>
) => (...a: A) => TaskThese<E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromIO: FromIO2<URI>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => <E = never>(...a: A) => TaskThese<E, B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const FromTask: FromTask2<URI>
/**
 * @category lifting
 * @since 2.10.0
 */
export declare const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => T.Task<B>
) => <E = never>(...a: A) => TaskThese<E, B>
/**
 * @since 2.10.0
 */
export declare const toTuple2: <E, A>(e: LazyArg<E>, a: LazyArg<A>) => (fa: TaskThese<E, A>) => Task<readonly [E, A]>
/**
 * @since 2.11.0
 */
export declare const ApT: TaskThese<never, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <E>(
  S: Semigroup<E>
) => <A, B>(
  f: (index: number, a: A) => TaskThese<E, B>
) => (as: ReadonlyNonEmptyArray<A>) => TaskThese<E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <E>(
  S: Semigroup<E>
) => <A, B>(f: (index: number, a: A) => TaskThese<E, B>) => (as: ReadonlyArray<A>) => TaskThese<E, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndexSeq: <E>(
  S: Semigroup<E>
) => <A, B>(
  f: (index: number, a: A) => TaskThese<E, B>
) => (as: ReadonlyNonEmptyArray<A>) => TaskThese<E, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndexSeq: <E>(
  S: Semigroup<E>
) => <A, B>(f: (index: number, a: A) => TaskThese<E, B>) => (as: ReadonlyArray<A>) => TaskThese<E, ReadonlyArray<B>>
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const functorTaskThese: Functor2<URI>
/**
 * Use [`Bifunctor`](#bifunctor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const bifunctorTaskThese: Bifunctor2<URI>
/**
 * Use [`toTuple2`](#totuple2) instead.
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export declare const toTuple: <E, A>(e: E, a: A) => (fa: TaskThese<E, A>) => Task<[E, A]>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TT.Functor` instead of `TT.taskThese`
 * (where `TT` is from `import TT from 'fp-ts/TaskThese'`)
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export declare const taskThese: Functor2<URI> & Bifunctor2<URI>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export declare const getSemigroup: <E, A>(SE: Semigroup<E>, SA: Semigroup<A>) => Semigroup<TaskThese<E, A>>
