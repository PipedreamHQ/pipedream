/**
 * This class identifies data structures which can be _unfolded_, generalizing `unfold` on arrays.
 *
 * @since 2.0.0
 */
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Option } from './Option'
/**
 * @category model
 * @since 2.0.0
 */
export interface Unfoldable<F> {
  readonly URI: F
  readonly unfold: <A, B>(b: B, f: (b: B) => Option<[A, B]>) => HKT<F, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Unfoldable1<F extends URIS> {
  readonly URI: F
  readonly unfold: <A, B>(b: B, f: (b: B) => Option<[A, B]>) => Kind<F, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Unfoldable2<F extends URIS2> {
  readonly URI: F
  readonly unfold: <E, A, B>(b: B, f: (b: B) => Option<[A, B]>) => Kind2<F, E, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Unfoldable2C<F extends URIS2, E> {
  readonly URI: F
  readonly _E: E
  readonly unfold: <A, B>(b: B, f: (b: B) => Option<[A, B]>) => Kind2<F, E, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Unfoldable3<F extends URIS3> {
  readonly URI: F
  readonly unfold: <R, E, A, B>(b: B, f: (b: B) => Option<[A, B]>) => Kind3<F, R, E, A>
}
/**
 * @category model
 * @since 2.10.0
 */
export interface Unfoldable3C<F extends URIS3, E> {
  readonly URI: F
  readonly _E: E
  readonly unfold: <R, A, B>(b: B, f: (b: B) => Option<[A, B]>) => Kind3<F, R, E, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Unfoldable4<F extends URIS4> {
  readonly URI: F
  readonly unfold: <S, R, E, A, B>(b: B, f: (b: B) => Option<[A, B]>) => Kind4<F, S, R, E, A>
}
