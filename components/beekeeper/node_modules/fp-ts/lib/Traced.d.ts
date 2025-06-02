/**
 * @since 2.0.0
 */
import { Comonad2C } from './Comonad'
import { Functor2 } from './Functor'
import { Monoid } from './Monoid'
/**
 * @category model
 * @since 2.0.0
 */
export interface Traced<P, A> {
  (p: P): A
}
/**
 * Extracts a value at a relative position which depends on the current value.
 *
 * @since 2.0.0
 */
export declare function tracks<P, A>(M: Monoid<P>, f: (a: A) => P): (wa: Traced<P, A>) => A
/**
 * Get the current position
 *
 * @since 2.0.0
 */
export declare function listen<P, A>(wa: Traced<P, A>): Traced<P, [A, P]>
/**
 * Get a value which depends on the current position
 *
 * @since 2.0.0
 */
export declare function listens<P, B>(f: (p: P) => B): <A>(wa: Traced<P, A>) => Traced<P, [A, B]>
/**
 * Apply a function to the current position
 *
 * @since 2.0.0
 */
export declare function censor<P>(f: (p: P) => P): <A>(wa: Traced<P, A>) => Traced<P, A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare function getComonad<P>(monoid: Monoid<P>): Comonad2C<URI, P>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Traced<E, A>) => Traced<E, B>
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'Traced'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Traced<E, A>
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
) => <E, B>(fab: import('./HKT').Kind2<'Traced', E, (a: A) => B>) => import('./HKT').Kind2<'Traced', E, B>
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const traced: Functor2<URI>
