/**
 * Lift a computation from the `Reader` monad.
 *
 * @since 2.11.0
 */
import { Chain, Chain2, Chain3, Chain3C, Chain4 } from './Chain'
import { HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from './HKT'
import * as R from './Reader'
import Reader = R.Reader
/**
 * @category model
 * @since 2.11.0
 */
export interface FromReader<F> {
  readonly URI: F
  readonly fromReader: <R, A>(fa: Reader<R, A>) => HKT2<F, R, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromReader2<F extends URIS2> {
  readonly URI: F
  readonly fromReader: <E, A>(fa: Reader<E, A>) => Kind2<F, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromReader3<F extends URIS3> {
  readonly URI: F
  readonly fromReader: <R, A, E>(fa: Reader<R, A>) => Kind3<F, R, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromReader3C<F extends URIS3, E> {
  readonly URI: F
  readonly _E: E
  readonly fromReader: <R, A>(fa: Reader<R, A>) => Kind3<F, R, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromReader4<F extends URIS4> {
  readonly URI: F
  readonly fromReader: <R, A, S, E>(fa: Reader<R, A>) => Kind4<F, S, R, E, A>
}
/**
 * @category constructors
 * @since 2.11.0
 */
export declare function ask<F extends URIS4>(F: FromReader4<F>): <S, R, E>() => Kind4<F, S, R, E, R>
export declare function ask<F extends URIS3>(F: FromReader3<F>): <R, E>() => Kind3<F, R, E, R>
export declare function ask<F extends URIS3, E>(F: FromReader3C<F, E>): <R>() => Kind3<F, R, E, R>
export declare function ask<F extends URIS2>(F: FromReader2<F>): <R>() => Kind2<F, R, R>
export declare function ask<F>(F: FromReader<F>): <R>() => HKT2<F, R, R>
/**
 * @category constructors
 * @since 2.11.0
 */
export declare function asks<F extends URIS4>(F: FromReader4<F>): <R, A, S, E>(f: (r: R) => A) => Kind4<F, S, R, E, A>
export declare function asks<F extends URIS3>(F: FromReader3<F>): <R, A, E>(f: (r: R) => A) => Kind3<F, R, E, A>
export declare function asks<F extends URIS3, E>(F: FromReader3C<F, E>): <R, A>(f: (r: R) => A) => Kind3<F, R, E, A>
export declare function asks<F extends URIS2>(F: FromReader2<F>): <R, A>(f: (r: R) => A) => Kind2<F, R, A>
export declare function asks<F>(F: FromReader<F>): <R, A>(f: (r: R) => A) => HKT2<F, R, A>
/**
 * @since 2.11.0
 */
export declare function fromReaderK<F extends URIS4>(
  F: FromReader4<F>
): <A extends ReadonlyArray<unknown>, R, B>(f: (...a: A) => Reader<R, B>) => <S, E>(...a: A) => Kind4<F, S, R, E, B>
export declare function fromReaderK<F extends URIS3>(
  F: FromReader3<F>
): <A extends ReadonlyArray<unknown>, R, B>(f: (...a: A) => Reader<R, B>) => <E>(...a: A) => Kind3<F, R, E, B>
export declare function fromReaderK<F extends URIS3, E>(
  F: FromReader3C<F, E>
): <A extends ReadonlyArray<unknown>, R, B>(f: (...a: A) => Reader<R, B>) => (...a: A) => Kind3<F, R, E, B>
export declare function fromReaderK<F extends URIS2>(
  F: FromReader2<F>
): <A extends ReadonlyArray<unknown>, R, B>(f: (...a: A) => Reader<R, B>) => (...a: A) => Kind2<F, R, B>
export declare function fromReaderK<F>(
  F: FromReader<F>
): <A extends ReadonlyArray<unknown>, R, B>(f: (...a: A) => Reader<R, B>) => (...a: A) => HKT2<F, R, B>
/**
 * @since 2.11.0
 */
export declare function chainReaderK<M extends URIS4>(
  F: FromReader4<M>,
  M: Chain4<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => <S, E>(ma: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, B>
export declare function chainReaderK<M extends URIS3>(
  F: FromReader3<M>,
  M: Chain3<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => <E>(ma: Kind3<M, R, E, A>) => Kind3<M, R, E, B>
export declare function chainReaderK<M extends URIS3, E>(
  F: FromReader3C<M, E>,
  M: Chain3C<M, E>
): <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: Kind3<M, R, E, A>) => Kind3<M, R, E, B>
export declare function chainReaderK<M extends URIS2>(
  F: FromReader2<M>,
  M: Chain2<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: Kind2<M, R, A>) => Kind2<M, R, B>
export declare function chainReaderK<M>(
  F: FromReader<M>,
  M: Chain<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: HKT2<M, R, A>) => HKT2<M, R, B>
/**
 * @since 2.11.0
 */
export declare function chainFirstReaderK<M extends URIS4>(
  F: FromReader4<M>,
  M: Chain4<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => <S, E>(ma: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, A>
export declare function chainFirstReaderK<M extends URIS3>(
  F: FromReader3<M>,
  M: Chain3<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => <E>(ma: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export declare function chainFirstReaderK<M extends URIS3, E>(
  F: FromReader3C<M, E>,
  M: Chain3C<M, E>
): <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export declare function chainFirstReaderK<M extends URIS2>(
  F: FromReader2<M>,
  M: Chain2<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: Kind2<M, R, A>) => Kind2<M, R, A>
export declare function chainFirstReaderK<M>(
  F: FromReader<M>,
  M: Chain<M>
): <A, R, B>(f: (a: A) => Reader<R, B>) => (ma: HKT2<M, R, A>) => HKT2<M, R, A>
export declare function tapReader<M extends URIS2>(
  F: FromReader<M>,
  M: Chain<M>
): <A, R, B>(self: HKT2<M, R, A>, f: (a: A) => Reader<R, B>) => HKT2<M, R, A>
