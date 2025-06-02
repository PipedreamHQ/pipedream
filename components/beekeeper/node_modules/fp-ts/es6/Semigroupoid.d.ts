/**
 * @since 2.0.0
 */
import { HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Semigroupoid<F> {
  readonly URI: F
  readonly compose: <A, B, C>(bc: HKT2<F, B, C>, ab: HKT2<F, A, B>) => HKT2<F, A, C>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Semigroupoid2<F extends URIS2> {
  readonly URI: F
  readonly compose: <A, B, C>(ab: Kind2<F, B, C>, la: Kind2<F, A, B>) => Kind2<F, A, C>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Semigroupoid2C<F extends URIS2, A> {
  readonly URI: F
  readonly _E: A
  readonly compose: <B, C>(ab: Kind2<F, B, C>, la: Kind2<F, A, B>) => Kind2<F, A, C>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Semigroupoid3<F extends URIS3> {
  readonly URI: F
  readonly compose: <R, A, B, C>(ab: Kind3<F, R, B, C>, la: Kind3<F, R, A, B>) => Kind3<F, R, A, C>
}
/**
 * @category model
 * @since 2.2.0
 */
export interface Semigroupoid3C<F extends URIS3, A> {
  readonly URI: F
  readonly _E: A
  readonly compose: <R, B, C>(ab: Kind3<F, R, B, C>, la: Kind3<F, R, A, B>) => Kind3<F, R, A, C>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Semigroupoid4<F extends URIS4> {
  readonly URI: F
  readonly compose: <S, R, A, B, C>(ab: Kind4<F, S, R, B, C>, la: Kind4<F, S, R, A, B>) => Kind4<F, S, R, A, C>
}
