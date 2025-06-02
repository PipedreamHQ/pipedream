/**
 * ```ts
 * interface Separated<E, A> {
 *    readonly left: E
 *    readonly right: A
 * }
 * ```
 *
 * Represents a result of separating a whole into two parts.
 *
 * @since 2.10.0
 */
import { Bifunctor2 } from './Bifunctor'
import { Functor2 } from './Functor'
/**
 * A `Separated` type which holds `left` and `right` parts.
 *
 * @category model
 * @since 2.10.0
 */
export interface Separated<E, A> {
  readonly left: E
  readonly right: A
}
/**
 * @category constructors
 * @since 2.10.0
 */
export declare const separated: <E, A>(left: E, right: A) => Separated<E, A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.10.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Separated<E, A>) => Separated<E, B>
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.10.0
 */
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: Separated<E, A>) => Separated<G, A>
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.10.0
 */
export declare const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: Separated<E, A>) => Separated<G, B>
/**
 * @category type lambdas
 * @since 2.10.0
 */
export declare const URI = 'Separated'
/**
 * @category type lambdas
 * @since 2.10.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Separated<E, A>
  }
}
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Bifunctor: Bifunctor2<URI>
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
) => <E, B>(fab: import('./HKT').Kind2<'Separated', E, (a: A) => B>) => import('./HKT').Kind2<'Separated', E, B>
/**
 * @since 2.10.0
 */
export declare const left: <E, A>(s: Separated<E, A>) => E
/**
 * @since 2.10.0
 */
export declare const right: <E, A>(s: Separated<E, A>) => A
