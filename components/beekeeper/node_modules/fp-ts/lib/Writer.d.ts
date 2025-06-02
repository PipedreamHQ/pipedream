/**
 * @since 2.0.0
 */
import { Applicative2C } from './Applicative'
import { Apply2C } from './Apply'
import { Chain2C } from './Chain'
import { Functor2 } from './Functor'
import { Monad2C } from './Monad'
import { Monoid } from './Monoid'
import { Pointed2C } from './Pointed'
import { Semigroup } from './Semigroup'
/**
 * @category model
 * @since 2.0.0
 */
export interface Writer<W, A> {
  (): [A, W]
}
/**
 * Appends a value to the accumulator
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const tell: <W>(w: W) => Writer<W, void>
/**
 * Modifies the result to include the changes to the accumulator
 *
 * @since 2.0.0
 */
export declare const listen: <W, A>(fa: Writer<W, A>) => Writer<W, [A, W]>
/**
 * Applies the returned function to the accumulator
 *
 * @since 2.0.0
 */
export declare const pass: <W, A>(fa: Writer<W, [A, (w: W) => W]>) => Writer<W, A>
/**
 * Projects a value from modifications made to the accumulator during an action
 *
 * @since 2.0.0
 */
export declare const listens: <W, B>(f: (w: W) => B) => <A>(fa: Writer<W, A>) => Writer<W, [A, B]>
/**
 * Modify the final accumulator value by applying a function
 *
 * @since 2.0.0
 */
export declare const censor: <W>(f: (w: W) => W) => <A>(fa: Writer<W, A>) => Writer<W, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Writer<E, A>) => Writer<E, B>
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'Writer'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Writer<E, A>
  }
}
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getPointed: <W>(M: Monoid<W>) => Pointed2C<URI, W>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getApply: <W>(S: Semigroup<W>) => Apply2C<URI, W>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const getApplicative: <W>(M: Monoid<W>) => Applicative2C<URI, W>
/**
 * @category instances
 * @since 2.10.0
 */
export declare function getChain<W>(S: Semigroup<W>): Chain2C<URI, W>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getMonad<W>(M: Monoid<W>): Monad2C<URI, W>
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
) => <E, B>(fab: import('./HKT').Kind2<'Writer', E, (a: A) => B>) => import('./HKT').Kind2<'Writer', E, B>
/**
 * @since 2.8.0
 */
export declare const evaluate: <W, A>(fa: Writer<W, A>) => A
/**
 * @since 2.8.0
 */
export declare const execute: <W, A>(fa: Writer<W, A>) => W
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const evalWriter: <W, A>(fa: Writer<W, A>) => A
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const execWriter: <W, A>(fa: Writer<W, A>) => W
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const writer: Functor2<URI>
