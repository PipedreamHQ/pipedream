/**
 * @since 2.11.0
 */
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Pointed, Pointed1, Pointed2, Pointed2C, Pointed3, Pointed3C, Pointed4 } from './Pointed'
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero<F> {
  readonly URI: F
  readonly zero: <A>() => HKT<F, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero1<F extends URIS> {
  readonly URI: F
  readonly zero: <A>() => Kind<F, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero2<F extends URIS2> {
  readonly URI: F
  readonly zero: <E, A>() => Kind2<F, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero2C<F extends URIS2, E> {
  readonly URI: F
  readonly _E: E
  readonly zero: <A>() => Kind2<F, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero3<F extends URIS3> {
  readonly URI: F
  readonly zero: <R, E, A>() => Kind3<F, R, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero3C<F extends URIS3, E> {
  readonly URI: F
  readonly _E: E
  readonly zero: <R, A>() => Kind3<F, R, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface Zero4<F extends URIS4> {
  readonly URI: F
  readonly zero: <S, R, E, A>() => Kind4<F, S, R, E, A>
}
/**
 * @category do notation
 * @since 2.11.0
 */
export declare function guard<F extends URIS4>(
  F: Zero4<F>,
  P: Pointed4<F>
): <S, R, E>(b: boolean) => Kind4<F, S, R, E, void>
export declare function guard<F extends URIS3>(F: Zero3<F>, P: Pointed3<F>): <R, E>(b: boolean) => Kind3<F, R, E, void>
export declare function guard<F extends URIS3, E>(
  F: Zero3C<F, E>,
  P: Pointed3C<F, E>
): <R>(b: boolean) => Kind3<F, R, E, void>
export declare function guard<F extends URIS2>(F: Zero2<F>, P: Pointed2<F>): <E>(b: boolean) => Kind2<F, E, void>
export declare function guard<F extends URIS2, E>(
  F: Zero2C<F, E>,
  P: Pointed2C<F, E>
): (b: boolean) => Kind2<F, E, void>
export declare function guard<F extends URIS>(F: Zero1<F>, P: Pointed1<F>): (b: boolean) => Kind<F, void>
export declare function guard<F>(F: Zero<F>, P: Pointed<F>): (b: boolean) => HKT<F, void>
