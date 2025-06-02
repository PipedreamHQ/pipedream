/**
 * @since 2.0.0
 */
import { Comonad2 } from './Comonad'
import { Endomorphism } from './Endomorphism'
import { Functor as FunctorHKT, Functor1, Functor2, Functor2C, Functor3, Functor3C } from './Functor'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Store<S, A> {
  readonly peek: (s: S) => A
  readonly pos: S
}
/**
 * Reposition the focus at the specified position
 *
 * @since 2.0.0
 */
export declare function seek<S>(s: S): <A>(wa: Store<S, A>) => Store<S, A>
/**
 * Reposition the focus at the specified position, which depends on the current position
 *
 * @since 2.0.0
 */
export declare function seeks<S>(f: Endomorphism<S>): <A>(wa: Store<S, A>) => Store<S, A>
/**
 * Extract a value from a position which depends on the current position
 *
 * @since 2.0.0
 */
export declare function peeks<S>(f: Endomorphism<S>): <A>(wa: Store<S, A>) => A
/**
 * Extract a collection of values from positions which depend on the current position
 *
 * @since 2.0.0
 */
export declare function experiment<F extends URIS3>(
  F: Functor3<F>
): <R, E, S>(f: (s: S) => Kind3<F, R, E, S>) => <A>(wa: Store<S, A>) => Kind3<F, R, E, A>
export declare function experiment<F extends URIS3, E>(
  F: Functor3C<F, E>
): <R, S>(f: (s: S) => Kind3<F, R, E, S>) => <A>(wa: Store<S, A>) => Kind3<F, R, E, A>
export declare function experiment<F extends URIS2>(
  F: Functor2<F>
): <E, S>(f: (s: S) => Kind2<F, E, S>) => <A>(wa: Store<S, A>) => Kind2<F, E, A>
export declare function experiment<F extends URIS2, E>(
  F: Functor2C<F, E>
): <S>(f: (s: S) => Kind2<F, E, S>) => <A>(wa: Store<S, A>) => Kind2<F, E, A>
export declare function experiment<F extends URIS>(
  F: Functor1<F>
): <S>(f: (s: S) => Kind<F, S>) => <A>(wa: Store<S, A>) => Kind<F, A>
export declare function experiment<F>(
  F: FunctorHKT<F>
): <S>(f: (s: S) => HKT<F, S>) => <A>(wa: Store<S, A>) => HKT<F, A>
/**
 * @since 2.0.0
 */
export declare const extend: <E, A, B>(f: (wa: Store<E, A>) => B) => (wa: Store<E, A>) => Store<E, B>
/**
 * @category Extract
 * @since 2.6.2
 */
export declare const extract: <E, A>(wa: Store<E, A>) => A
/**
 * @since 2.0.0
 */
export declare const duplicate: <E, A>(wa: Store<E, A>) => Store<E, Store<E, A>>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Store<E, A>) => Store<E, B>
/**
 * @category type lambdas
 * @since 2.0.0
 */
export declare const URI = 'Store'
/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Store<E, A>
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
export declare const flap: <A>(a: A) => <E, B>(fab: Kind2<'Store', E, (a: A) => B>) => Kind2<'Store', E, B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Comonad: Comonad2<URI>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Comonad` instance, pass `S.Comonad` instead of `S.store`
 * (where `S` is from `import S from 'fp-ts/Store'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const store: Comonad2<URI>
