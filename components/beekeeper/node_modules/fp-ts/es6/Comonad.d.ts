/**
 * @since 2.0.0
 */
import { Extend, Extend1, Extend2, Extend2C, Extend3, Extend3C, Extend4 } from './Extend'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Comonad<W> extends Extend<W> {
  readonly extract: <A>(wa: HKT<W, A>) => A
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Comonad1<W extends URIS> extends Extend1<W> {
  readonly extract: <A>(wa: Kind<W, A>) => A
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Comonad2<W extends URIS2> extends Extend2<W> {
  readonly extract: <E, A>(wa: Kind2<W, E, A>) => A
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Comonad2C<W extends URIS2, E> extends Extend2C<W, E> {
  readonly extract: <A>(wa: Kind2<W, E, A>) => A
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Comonad3<W extends URIS3> extends Extend3<W> {
  readonly extract: <R, E, A>(wa: Kind3<W, R, E, A>) => A
}
/**
 * @category model
 * @since 2.10.0
 */
export interface Comonad3C<W extends URIS3, E> extends Extend3C<W, E> {
  readonly extract: <R, A>(wa: Kind3<W, R, E, A>) => A
}
/**
 * @category model
 * @since 2.10.0
 */
export interface Comonad4<W extends URIS4> extends Extend4<W> {
  readonly extract: <S, R, E, A>(wa: Kind4<W, S, R, E, A>) => A
}
