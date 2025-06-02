/**
 * @since 2.0.0
 */
import { Chain, Chain1, Chain2, Chain2C, Chain3, Chain3C, Chain4 } from './Chain'
import { Either } from './Either'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface ChainRec<F> extends Chain<F> {
  readonly chainRec: <A, B>(a: A, f: (a: A) => HKT<F, Either<A, B>>) => HKT<F, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface ChainRec1<F extends URIS> extends Chain1<F> {
  readonly chainRec: <A, B>(a: A, f: (a: A) => Kind<F, Either<A, B>>) => Kind<F, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface ChainRec2<F extends URIS2> extends Chain2<F> {
  readonly chainRec: <E, A, B>(a: A, f: (a: A) => Kind2<F, E, Either<A, B>>) => Kind2<F, E, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface ChainRec2C<F extends URIS2, E> extends Chain2C<F, E> {
  readonly chainRec: <A, B>(a: A, f: (a: A) => Kind2<F, E, Either<A, B>>) => Kind2<F, E, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface ChainRec3<F extends URIS3> extends Chain3<F> {
  readonly chainRec: <R, E, A, B>(a: A, f: (a: A) => Kind3<F, R, E, Either<A, B>>) => Kind3<F, R, E, B>
}
/**
 * @category model
 * @since 2.10.0
 */
export interface ChainRec3C<F extends URIS3, E> extends Chain3C<F, E> {
  readonly chainRec: <R, A, B>(a: A, f: (a: A) => Kind3<F, R, E, Either<A, B>>) => Kind3<F, R, E, B>
}
/**
 * @category model
 * @since 2.10.0
 */
export interface ChainRec4<F extends URIS4> extends Chain4<F> {
  readonly chainRec: <S, R, E, A, B>(a: A, f: (a: A) => Kind4<F, S, R, E, Either<A, B>>) => Kind4<F, S, R, E, B>
}
/**
 * @since 2.0.0
 */
export declare const tailRec: <A, B>(startWith: A, f: (a: A) => Either<A, B>) => B
