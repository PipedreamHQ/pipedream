/**
 * `IOOption<A>` represents a synchronous computation that either yields a value of type `A` or nothing.
 *
 * If you want to represent a synchronous computation that never fails, please see `IO`.
 * If you want to represent a synchronous computation that may fail, please see `IOEither`.
 *
 * @since 2.12.0
 */
import { Alt1 } from './Alt'
import { Alternative1 } from './Alternative'
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import * as chainable from './Chain'
import { Compactable1 } from './Compactable'
import { Either } from './Either'
import { Filterable1 } from './Filterable'
import { FromEither1 } from './FromEither'
import { FromIO1 } from './FromIO'
import { LazyArg } from './function'
import { Functor1 } from './Functor'
import * as I from './IO'
import { IOEither } from './IOEither'
import { Monad1 } from './Monad'
import { MonadIO1 } from './MonadIO'
import * as O from './Option'
import { Pointed1 } from './Pointed'
import { Predicate } from './Predicate'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Separated } from './Separated'
import { Zero1 } from './Zero'
import IO = I.IO
import Option = O.Option
/**
 * @category model
 * @since 2.12.0
 */
export interface IOOption<A> extends IO<Option<A>> {}
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const some: <A>(a: A) => IOOption<A>
/**
 * @category lifting
 * @since 2.12.0
 */
export declare const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => IOOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(b: B) => IOOption<B>
  <A>(predicate: Predicate<A>): (a: A) => IOOption<A>
}
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const fromOption: <A>(fa: Option<A>) => IOOption<A>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const fromEither: <A>(fa: Either<unknown, A>) => IOOption<A>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const fromIO: <A>(fa: IO<A>) => IOOption<A>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const fromIOEither: <A>(fa: IOEither<unknown, A>) => IOOption<A>
/**
 * @category pattern matching
 * @since 2.12.0
 */
export declare const match: <B, A>(onNone: () => B, onSome: (a: A) => B) => (ma: IOOption<A>) => IO<B>
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export declare const matchW: <B, A, C>(onNone: () => B, onSome: (a: A) => C) => (ma: IOOption<A>) => IO<B | C>
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`IO`).
 *
 * @category pattern matching
 * @since 2.12.0
 */
export declare const matchE: <B, A>(onNone: () => IO<B>, onSome: (a: A) => IO<B>) => (ma: IOOption<A>) => IO<B>
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.12.0
 */
export declare const fold: <B, A>(onNone: () => IO<B>, onSome: (a: A) => IO<B>) => (ma: IOOption<A>) => IO<B>
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export declare const matchEW: <B, C, A>(onNone: () => IO<B>, onSome: (a: A) => IO<C>) => (ma: IOOption<A>) => IO<B | C>
/**
 * @category error handling
 * @since 2.12.0
 */
export declare const getOrElse: <A>(onNone: LazyArg<IO<A>>) => (fa: IOOption<A>) => IO<A>
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.12.0
 */
export declare const getOrElseW: <B>(onNone: LazyArg<IO<B>>) => <A>(ma: IOOption<A>) => IO<A | B>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const toUndefined: <A>(ma: IOOption<A>) => IO<A | undefined>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const toNullable: <A>(ma: IOOption<A>) => IO<A | null>
/**
 * @category conversions
 * @since 2.12.0
 */
export declare const fromNullable: <A>(a: A) => IOOption<NonNullable<A>>
/**
 * @category lifting
 * @since 2.12.0
 */
export declare const fromNullableK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => IOOption<NonNullable<B>>
/**
 * Alias of `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainNullableK: <A, B>(
  f: (a: A) => B | null | undefined
) => (ma: IOOption<A>) => IOOption<NonNullable<B>>
/**
 * @category lifting
 * @since 2.12.0
 */
export declare const fromOptionK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => (...a: A) => IOOption<B>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.12.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: IOOption<A>) => IOOption<B>
/**
 * @since 2.12.0
 */
export declare const ap: <A>(fa: IOOption<A>) => <B>(fab: IOOption<(a: A) => B>) => IOOption<B>
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const of: <A>(a: A) => IOOption<A>
/**
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, B>(f: (a: A) => IOOption<B>): (ma: IOOption<A>) => IOOption<B>
  <A, B>(ma: IOOption<A>, f: (a: A) => IOOption<B>): IOOption<B>
}
/**
 * @category sequencing
 * @since 2.12.0
 */
export declare const flatten: <A>(mma: IOOption<IOOption<A>>) => IOOption<A>
/**
 * @category error handling
 * @since 2.12.0
 */
export declare const alt: <A>(second: LazyArg<IOOption<A>>) => (first: IOOption<A>) => IOOption<A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.12.0
 */
export declare const altW: <B>(second: LazyArg<IOOption<B>>) => <A>(first: IOOption<A>) => IOOption<A | B>
/**
 * @since 2.12.0
 */
export declare const zero: <A>() => IOOption<A>
/**
 * @category constructors
 * @since 2.12.0
 */
export declare const none: IOOption<never>
/**
 * @category filtering
 * @since 2.12.0
 */
export declare const compact: Compactable1<URI>['compact']
/**
 * @category filtering
 * @since 2.12.0
 */
export declare const separate: Compactable1<URI>['separate']
/**
 * @category filtering
 * @since 2.12.0
 */
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: IOOption<A>) => IOOption<B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: IOOption<B>) => IOOption<B>
  <A>(predicate: Predicate<A>): (fa: IOOption<A>) => IOOption<A>
}
/**
 * @category filtering
 * @since 2.12.0
 */
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (fga: IOOption<A>) => IOOption<B>
/**
 * @category filtering
 * @since 2.12.0
 */
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fb: IOOption<A>) => Separated<IOOption<A>, IOOption<B>>
  <A>(predicate: Predicate<A>): <B extends A>(fb: IOOption<B>) => Separated<IOOption<B>, IOOption<B>>
  <A>(predicate: Predicate<A>): (fa: IOOption<A>) => Separated<IOOption<A>, IOOption<A>>
}
/**
 * @category filtering
 * @since 2.12.0
 */
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: IOOption<A>) => Separated<IOOption<B>, IOOption<C>>
/**
 * @category type lambdas
 * @since 2.12.0
 */
export declare const URI = 'IOOption'
/**
 * @category type lambdas
 * @since 2.12.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: IOOption<A>
  }
}
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Functor: Functor1<URI>
/**
 * Maps the `Some` value of this `IOOption` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const as: {
  <A>(a: A): <_>(self: IOOption<_>) => IOOption<A>
  <_, A>(self: IOOption<_>, a: A): IOOption<A>
}
/**
 * Maps the `Some` value of this `IOOption` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export declare const asUnit: <_>(self: IOOption<_>) => IOOption<void>
/**
 * @category mapping
 * @since 2.12.0
 */
export declare const flap: <A>(
  a: A
) => <B>(fab: import('./HKT').Kind<'IOOption', (a: A) => B>) => import('./HKT').Kind<'IOOption', B>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Pointed: Pointed1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Apply: Apply1<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.12.0
 */
export declare const apFirst: <B>(
  second: IOOption<B>
) => <A>(first: import('./HKT').Kind<'IOOption', A>) => import('./HKT').Kind<'IOOption', A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.12.0
 */
export declare const apSecond: <B>(
  second: IOOption<B>
) => <A>(first: import('./HKT').Kind<'IOOption', A>) => import('./HKT').Kind<'IOOption', B>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Applicative: Applicative1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Chain: chainable.Chain1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const FromEither: FromEither1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const FromIO: FromIO1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export declare const tap: {
  <A, _>(self: IOOption<A>, f: (a: A) => IOOption<_>): IOOption<A>
  <A, _>(f: (a: A) => IOOption<_>): (self: IOOption<A>) => IOOption<A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as IOO from 'fp-ts/IOOption'
 * import * as O from 'fp-ts/Option'
 * import * as E from 'fp-ts/Either'
 *
 * const compute = (value: number) => pipe(
 *   IOO.of(value),
 *   IOO.tapEither((value) => value > 0 ? E.right('ok') : E.left('error')),
 * )
 *
 * assert.deepStrictEqual(compute(1)(), O.of(1))
 * assert.deepStrictEqual(compute(-1)(), O.none)
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapEither: {
  <A, E, _>(f: (a: A) => Either<E, _>): (self: IOOption<A>) => IOOption<A>
  <A, E, _>(self: IOOption<A>, f: (a: A) => Either<E, _>): IOOption<A>
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as IOO from 'fp-ts/IOOption'
 * import * as O from 'fp-ts/Option'
 * import * as Console from 'fp-ts/Console'
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effectA = pipe(
 *   IOO.of('fp-ts'),
 *   IOO.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * // No output to the stdout
 * const effectB = pipe(
 *   IOO.none as IOO.IOOption<string>,
 *   IOO.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(effectA(), O.of('fp-ts'))
 *   assert.deepStrictEqual(effectB(), O.none)
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): (self: IOOption<A>) => IOOption<A>
  <A, _>(self: IOOption<A>, f: (a: A) => IO<_>): IOOption<A>
}
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Alt: Alt1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Zero: Zero1<URI>
/**
 * @category do notation
 * @since 2.12.0
 */
export declare const guard: (b: boolean) => import('./HKT').Kind<'IOOption', void>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Alternative: Alternative1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Monad: Monad1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const MonadIO: MonadIO1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Compactable: Compactable1<URI>
/**
 * @category instances
 * @since 2.12.0
 */
export declare const Filterable: Filterable1<URI>
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapIO: {
  <A, B>(f: (a: A) => IO<B>): (self: IOOption<A>) => IOOption<B>
  <A, B>(self: IOOption<A>, f: (a: A) => IO<B>): IOOption<B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapOption: {
  <A, B>(f: (a: A) => Option<B>): (self: IOOption<A>) => IOOption<B>
  <A, B>(self: IOOption<A>, f: (a: A) => Option<B>): IOOption<B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapEither: {
  <A, B, _>(f: (a: A) => Either<_, B>): (self: IOOption<A>) => IOOption<B>
  <A, B, _>(self: IOOption<A>, f: (a: A) => Either<_, B>): IOOption<B>
}
/**
 * @category sequencing
 * @since 2.16.0
 */
export declare const flatMapNullable: {
  <A, B>(f: (a: A) => B | null | undefined): (self: IOOption<A>) => IOOption<B>
  <A, B>(self: IOOption<A>, f: (a: A) => B | null | undefined): IOOption<B>
}
/**
 * @category lifting
 * @since 2.12.0
 */
export declare const fromIOK: <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => I.IO<B>) => (...a: A) => IOOption<B>
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainIOK: <A, B>(f: (a: A) => I.IO<B>) => (first: IOOption<A>) => IOOption<B>
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainFirstIOK: <A, B>(f: (a: A) => I.IO<B>) => (first: IOOption<A>) => IOOption<A>
/**
 * @category lifting
 * @since 2.12.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => IOOption<B>
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: IOOption<A>) => IOOption<B>
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainFirstEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: IOOption<A>) => IOOption<A>
/**
 * Alias of `flatMapOption`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainOptionK: <A, B>(f: (a: A) => Option<B>) => (ma: IOOption<A>) => IOOption<B>
/**
 * @category do notation
 * @since 2.12.0
 */
export declare const Do: IOOption<{}>
/**
 * @category do notation
 * @since 2.12.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <A>(fa: import('./HKT').Kind<'IOOption', A>) => import('./HKT').Kind<'IOOption', { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  fa: import('./HKT').Kind<'IOOption', A>
) => import('./HKT').Kind<'IOOption', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
export {
  /**
   * @category do notation
   * @since 2.13.0
   */
  let_ as let
}
/**
 * @category do notation
 * @since 2.12.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind<'IOOption', B>
) => (
  ma: import('./HKT').Kind<'IOOption', A>
) => import('./HKT').Kind<'IOOption', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * @category do notation
 * @since 2.12.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: IOOption<B>
) => (
  fa: import('./HKT').Kind<'IOOption', A>
) => import('./HKT').Kind<'IOOption', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * @since 2.12.0
 */
export declare const ApT: IOOption<readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.12.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IOOption<B>
) => (as: ReadonlyNonEmptyArray<A>) => IOOption<ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.12.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IOOption<B>
) => (as: ReadonlyArray<A>) => IOOption<ReadonlyArray<B>>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chain: <A, B>(f: (a: A) => IOOption<B>) => (ma: IOOption<A>) => IOOption<B>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.12.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => IOOption<B>) => (first: IOOption<A>) => IOOption<A>
