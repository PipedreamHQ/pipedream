/**
 * The `Reader` monad (also called the Environment monad). Represents a computation, which can read values from a shared environment,
 * pass values from function to function, and execute sub-computations in a modified environment.
 * Using `Reader` monad for such computations is often clearer and easier than using the `State` monad.
 *
 * In this example the `Reader` monad provides access to variable bindings. `Bindings` are a map of `number` variables.
 * The variable count contains number of variables in the bindings. You can see how to run a `Reader` monad and retrieve
 * data from it, how to access the `Reader` data with `ask` and `asks`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 * import * as R from 'fp-ts/Reader'
 * import * as RR from 'fp-ts/ReadonlyRecord'
 *
 * interface Bindings extends RR.ReadonlyRecord<string, number> {}
 *
 * // The Reader monad, which implements this complicated check.
 * const isCountCorrect: R.Reader<Bindings, boolean> = pipe(
 *   R.Do,
 *   R.bind('count', () => R.asks(lookupVar('count'))),
 *   R.bind('bindings', () => R.ask()),
 *   R.map(({ count, bindings }) => count === RR.size(bindings))
 * )
 *
 * // The selector function to use with 'asks'.
 * // Returns value of the variable with specified name.
 * const lookupVar = (name: string) => (bindings: Bindings): number =>
 *   pipe(
 *     bindings,
 *     RR.lookup(name),
 *     O.getOrElse(() => 0)
 *   )
 *
 * const sampleBindings: Bindings = { count: 3, a: 1, b: 2 }
 *
 * assert.deepStrictEqual(isCountCorrect(sampleBindings), true)
 *
 * @since 2.0.0
 */
import { Applicative2 } from './Applicative'
import { Apply2 } from './Apply'
import { Category2 } from './Category'
import * as chainable from './Chain'
import { Choice2 } from './Choice'
import { Functor2 } from './Functor'
import { Monad2 } from './Monad'
import { Monoid } from './Monoid'
import { Pointed2 } from './Pointed'
import { Profunctor2 } from './Profunctor'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray'
import { Semigroup } from './Semigroup'
import { Strong2 } from './Strong'
/**
 * @category model
 * @since 2.0.0
 */
export interface Reader<R, A> {
  (r: R): A
}
/**
 * Reads the current context
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const ask: <R>() => Reader<R, R>
/**
 * Projects a value from the global context in a Reader
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => Reader<R, A>
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as R from 'fp-ts/Reader'
 * import * as string from 'fp-ts/string'
 *
 * const calculateContentLen: R.Reader<string, number> = pipe(
 *   R.Do,
 *   R.bind('content', () => R.ask<string>()),
 *   R.map(({ content }) => string.size(content))
 * )
 *
 * // Calls calculateContentLen after adding a prefix to the Reader content.
 * const calculateModifiedContentLen: R.Reader<string, number> = pipe(
 *   calculateContentLen,
 *   R.local((s) => 'Prefix ' + s)
 * )
 *
 * const s = '12345'
 *
 * assert.deepStrictEqual(
 *   "Modified 's' length: " + calculateModifiedContentLen(s) + '\n' + "Original 's' length: " + calculateContentLen(s),
 *   "Modified 's' length: 12\nOriginal 's' length: 5"
 * )
 *
 * @since 2.0.0
 */
export declare const local: <R2, R1>(f: (r2: R2) => R1) => <A>(ma: Reader<R1, A>) => Reader<R2, A>
/**
 * Less strict version of [`asksReader`](#asksreader).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksReaderW: <R1, R2, A>(f: (r1: R1) => Reader<R2, A>) => Reader<R1 & R2, A>
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export declare const asksReader: <R, A>(f: (r: R) => Reader<R, A>) => Reader<R, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, A>) => Reader<R, B>
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.8.0
 */
export declare const apW: <R2, A>(fa: Reader<R2, A>) => <R1, B>(fab: Reader<R1, (a: A) => B>) => Reader<R1 & R2, B>
/**
 * @since 2.0.0
 */
export declare const ap: <R, A>(fa: Reader<R, A>) => <B>(fab: Reader<R, (a: A) => B>) => Reader<R, B>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const of: <R = unknown, A = never>(a: A) => Reader<R, A>
/**
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, R2, B>(f: (a: A) => Reader<R2, B>): <R1>(ma: Reader<R1, A>) => Reader<R1 & R2, B>
  <R1, A, R2, B>(ma: Reader<R1, A>, f: (a: A) => Reader<R2, B>): Reader<R1 & R2, B>
}
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export declare const flattenW: <R1, R2, A>(mma: Reader<R1, Reader<R2, A>>) => Reader<R1 & R2, A>
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatten: <R, A>(mma: Reader<R, Reader<R, A>>) => Reader<R, A>
/**
 * @since 2.0.0
 */
export declare const compose: <A, B>(ab: Reader<A, B>) => <C>(bc: Reader<B, C>) => Reader<A, C>
/**
 * @since 2.0.0
 */
export declare const promap: <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fea: Reader<E, A>) => Reader<D, B>
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const id: Category2<URI>['id']
/**
 * @since 2.10.0
 */
export declare const first: Strong2<URI>['first']
/**
 * @since 2.10.0
 */
export declare const second: Strong2<URI>['second']
/**
 * @since 2.10.0
 */
export declare const left: Choice2<URI>['left']
/**
 * @since 2.10.0
 */
export declare const right: Choice2<URI>['right']
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'Reader'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Reader<E, A>
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
) => <E, B>(fab: import('./HKT').Kind2<'Reader', E, (a: A) => B>) => import('./HKT').Kind2<'Reader', E, B>
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
  second: Reader<E, B>
) => <A>(first: import('./HKT').Kind2<'Reader', E, A>) => import('./HKT').Kind2<'Reader', E, A>
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.12.0
 */
export declare const apFirstW: <R2, B>(second: Reader<R2, B>) => <R1, A>(first: Reader<R1, A>) => Reader<R1 & R2, A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export declare const apSecond: <E, B>(
  second: Reader<E, B>
) => <A>(first: import('./HKT').Kind2<'Reader', E, A>) => import('./HKT').Kind2<'Reader', E, B>
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.12.0
 */
export declare const apSecondW: <R2, B>(second: Reader<R2, B>) => <R1, A>(first: Reader<R1, A>) => Reader<R1 & R2, B>
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
  <R1, A, R2, _>(self: Reader<R1, A>, f: (a: A) => Reader<R2, _>): Reader<R1 & R2, A>
  <A, R2, _>(f: (a: A) => Reader<R2, _>): <R1>(self: Reader<R1, A>) => Reader<R2 & R1, A>
}
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Profunctor: Profunctor2<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Category: Category2<URI>
/**
 * @category instances
 * @since 2.8.3
 */
export declare const Strong: Strong2<URI>
/**
 * @category instances
 * @since 2.8.3
 */
export declare const Choice: Choice2<URI>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(fa: import('./HKT').Kind2<'Reader', E, A>) => import('./HKT').Kind2<'Reader', E, { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(
  fa: import('./HKT').Kind2<'Reader', E, A>
) => import('./HKT').Kind2<'Reader', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
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
  f: (a: A) => import('./HKT').Kind2<'Reader', E, B>
) => (
  ma: import('./HKT').Kind2<'Reader', E, A>
) => import('./HKT').Kind2<'Reader', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export declare const bindW: <N extends string, A, R2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Reader<R2, B>
) => <R1>(fa: Reader<R1, A>) => Reader<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @category do notation
 * @since 2.9.0
 */
export declare const Do: Reader<unknown, {}>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Reader<E, B>
) => (
  fa: import('./HKT').Kind2<'Reader', E, A>
) => import('./HKT').Kind2<'Reader', E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
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
  fb: Reader<R2, B>
) => <R1>(fa: Reader<R1, A>) => Reader<
  R1 & R2,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
/**
 * @since 2.11.0
 */
export declare const ApT: Reader<unknown, readonly []>
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => Reader<R, B>
) => (as: ReadonlyNonEmptyArray<A>) => Reader<R, ReadonlyNonEmptyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const traverseReadonlyArrayWithIndex: <A, R, B>(
  f: (index: number, a: A) => Reader<R, B>
) => (as: ReadonlyArray<A>) => Reader<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArrayWithIndex: <R, A, B>(
  f: (index: number, a: A) => Reader<R, B>
) => (as: ReadonlyArray<A>) => Reader<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const traverseArray: <R, A, B>(
  f: (a: A) => Reader<R, B>
) => (as: ReadonlyArray<A>) => Reader<R, ReadonlyArray<B>>
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export declare const sequenceArray: <R, A>(arr: ReadonlyArray<Reader<R, A>>) => Reader<R, ReadonlyArray<A>>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export declare const chainW: <R2, A, B>(f: (a: A) => Reader<R2, B>) => <R1>(ma: Reader<R1, A>) => Reader<R1 & R2, B>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chain: <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: Reader<R, A>) => Reader<R, B>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export declare const chainFirst: <A, R, B>(f: (a: A) => Reader<R, B>) => (first: Reader<R, A>) => Reader<R, A>
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.11.0
 */
export declare const chainFirstW: <R2, A, B>(
  f: (a: A) => Reader<R2, B>
) => <R1>(ma: Reader<R1, A>) => Reader<R1 & R2, A>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `R.Functor` instead of `R.reader`
 * (where `R` is from `import R from 'fp-ts/Reader'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const reader: Monad2<URI> & Profunctor2<URI> & Category2<URI> & Strong2<URI> & Choice2<URI>
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getSemigroup: <R, A>(S: Semigroup<A>) => Semigroup<Reader<R, A>>
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getMonoid: <R, A>(M: Monoid<A>) => Monoid<Reader<R, A>>
