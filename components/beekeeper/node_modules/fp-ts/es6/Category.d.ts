/**
 * @since 2.0.0
 */
import { HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from './HKT'
import { Semigroupoid, Semigroupoid2, Semigroupoid3, Semigroupoid4 } from './Semigroupoid'
/**
 * @category model
 * @since 2.0.0
 */
export interface Category<F> extends Semigroupoid<F> {
  readonly id: <A>() => HKT2<F, A, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Category2<F extends URIS2> extends Semigroupoid2<F> {
  readonly id: <A>() => Kind2<F, A, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Category3<F extends URIS3> extends Semigroupoid3<F> {
  readonly id: <R, A>() => Kind3<F, R, A, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Category4<F extends URIS4> extends Semigroupoid4<F> {
  readonly id: <S, R, A>() => Kind4<F, S, R, A, A>
}
