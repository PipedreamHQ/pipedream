/**
 * @since 2.0.0
 */
import { Functor2, Functor2C, Functor3, Functor3C, Functor4 } from './Functor'
import { HKT, HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Profunctor<F> {
  readonly URI: F
  readonly map: <E, A, B>(fa: HKT2<F, E, A>, f: (a: A) => B) => HKT<F, B>
  readonly promap: <E, A, D, B>(fea: HKT2<F, E, A>, f: (d: D) => E, g: (a: A) => B) => HKT2<F, D, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Profunctor2<F extends URIS2> extends Functor2<F> {
  readonly promap: <E, A, D, B>(fea: Kind2<F, E, A>, f: (d: D) => E, g: (a: A) => B) => Kind2<F, D, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Profunctor2C<F extends URIS2, E> extends Functor2C<F, E> {
  readonly promap: <A, D, B>(fea: Kind2<F, E, A>, f: (d: D) => E, g: (a: A) => B) => Kind2<F, D, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Profunctor3<F extends URIS3> extends Functor3<F> {
  readonly promap: <R, E, A, D, B>(fea: Kind3<F, R, E, A>, f: (d: D) => E, g: (a: A) => B) => Kind3<F, R, D, B>
}
/**
 * @category model
 * @since 2.2.0
 */
export interface Profunctor3C<F extends URIS3, E> extends Functor3C<F, E> {
  readonly promap: <R, A, D, B>(fea: Kind3<F, R, E, A>, f: (d: D) => E, g: (a: A) => B) => Kind3<F, R, D, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Profunctor4<F extends URIS4> extends Functor4<F> {
  readonly promap: <S, R, E, A, D, B>(fea: Kind4<F, S, R, E, A>, f: (d: D) => E, g: (a: A) => B) => Kind4<F, S, R, D, B>
}
