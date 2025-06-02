/**
 * Lift a computation from the `State` monad.
 *
 * @since 2.11.0
 */
import { Chain, Chain2, Chain3, Chain4 } from './Chain'
import { Endomorphism } from './Endomorphism'
import { HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from './HKT'
import * as S from './State'
import State = S.State
/**
 * @category model
 * @since 2.11.0
 */
export interface FromState<F> {
  readonly URI: F
  readonly fromState: <S, A>(fa: State<S, A>) => HKT2<F, S, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromState2<F extends URIS2> {
  readonly URI: F
  readonly fromState: <S, A>(fa: State<S, A>) => Kind2<F, S, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromState3<F extends URIS3> {
  readonly URI: F
  readonly fromState: <S, A, E>(fa: State<S, A>) => Kind3<F, S, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromState3C<F extends URIS3, E> {
  readonly URI: F
  readonly _E: E
  readonly fromState: <S, A>(fa: State<S, A>) => Kind3<F, S, E, A>
}
/**
 * @category model
 * @since 2.11.0
 */
export interface FromState4<F extends URIS4> {
  readonly URI: F
  readonly fromState: <S, A, R, E>(fa: State<S, A>) => Kind4<F, S, R, E, A>
}
/**
 * @category constructors
 * @since 2.11.0
 */
export declare function get<F extends URIS4>(F: FromState4<F>): <S, R, E>() => Kind4<F, S, R, E, S>
export declare function get<F extends URIS3>(F: FromState3<F>): <S, E>() => Kind3<F, S, E, S>
export declare function get<F extends URIS3, E>(F: FromState3C<F, E>): <S>() => Kind3<F, S, E, S>
export declare function get<F extends URIS2>(F: FromState2<F>): <S>() => Kind2<F, S, S>
export declare function get<F>(F: FromState<F>): <S>() => HKT2<F, S, S>
/**
 * @category constructors
 * @since 2.11.0
 */
export declare function put<F extends URIS4>(F: FromState4<F>): <S, R, E>(s: S) => Kind4<F, S, R, E, void>
export declare function put<F extends URIS3>(F: FromState3<F>): <S, E>(s: S) => Kind3<F, S, E, void>
export declare function put<F extends URIS3, E>(F: FromState3C<F, E>): <S>(s: S) => Kind3<F, S, E, void>
export declare function put<F extends URIS2>(F: FromState2<F>): <S>(s: S) => Kind2<F, S, void>
export declare function put<F>(F: FromState<F>): <S>(s: S) => HKT2<F, S, void>
/**
 * @category constructors
 * @since 2.11.0
 */
export declare function modify<F extends URIS4>(
  F: FromState4<F>
): <S, R, E>(f: Endomorphism<S>) => Kind4<F, S, R, E, void>
export declare function modify<F extends URIS3>(F: FromState3<F>): <S, E>(f: Endomorphism<S>) => Kind3<F, S, E, void>
export declare function modify<F extends URIS3, E>(
  F: FromState3C<F, E>
): <S>(f: Endomorphism<S>) => Kind3<F, S, E, void>
export declare function modify<F extends URIS2>(F: FromState2<F>): <S>(f: Endomorphism<S>) => Kind2<F, S, void>
export declare function modify<F>(F: FromState<F>): <S>(f: Endomorphism<S>) => HKT2<F, S, void>
/**
 * @category constructors
 * @since 2.11.0
 */
export declare function gets<F extends URIS4>(F: FromState4<F>): <S, R, E, A>(f: (s: S) => A) => Kind4<F, S, R, E, A>
export declare function gets<F extends URIS3>(F: FromState3<F>): <S, E, A>(f: (s: S) => A) => Kind3<F, S, E, A>
export declare function gets<F extends URIS3, E>(F: FromState3C<F, E>): <S, A>(f: (s: S) => A) => Kind3<F, S, E, A>
export declare function gets<F extends URIS2>(F: FromState2<F>): <S, A>(f: (s: S) => A) => Kind2<F, S, A>
export declare function gets<F>(F: FromState<F>): <S, A>(f: (s: S) => A) => HKT2<F, S, A>
/**
 * @since 2.11.0
 */
export declare function fromStateK<F extends URIS4>(
  F: FromState4<F>
): <A extends ReadonlyArray<unknown>, S, B>(f: (...a: A) => State<S, B>) => <R, E>(...a: A) => Kind4<F, S, R, E, B>
export declare function fromStateK<F extends URIS3>(
  F: FromState3<F>
): <A extends ReadonlyArray<unknown>, S, B>(f: (...a: A) => State<S, B>) => <E>(...a: A) => Kind3<F, S, E, B>
export declare function fromStateK<F extends URIS3, E>(
  F: FromState3C<F, E>
): <A extends ReadonlyArray<unknown>, S, B>(f: (...a: A) => State<S, B>) => (...a: A) => Kind3<F, S, E, B>
export declare function fromStateK<F extends URIS2>(
  F: FromState2<F>
): <A extends ReadonlyArray<unknown>, S, B>(f: (...a: A) => State<S, B>) => (...a: A) => Kind2<F, S, B>
export declare function fromStateK<F>(
  F: FromState<F>
): <A extends ReadonlyArray<unknown>, S, B>(f: (...a: A) => State<S, B>) => (...a: A) => HKT2<F, S, B>
/**
 * @since 2.11.0
 */
export declare function chainStateK<M extends URIS4>(
  F: FromState4<M>,
  M: Chain4<M>
): <A, S, B>(f: (a: A) => State<S, B>) => <R, E>(ma: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, B>
export declare function chainStateK<M extends URIS3>(
  F: FromState3<M>,
  M: Chain3<M>
): <A, S, B>(f: (a: A) => State<S, B>) => <E>(ma: Kind3<M, S, E, A>) => Kind3<M, S, E, B>
export declare function chainStateK<M extends URIS2>(
  F: FromState2<M>,
  M: Chain2<M>
): <A, S, B>(f: (a: A) => State<S, B>) => (ma: Kind2<M, S, A>) => Kind2<M, S, B>
export declare function chainStateK<M>(
  F: FromState<M>,
  M: Chain<M>
): <A, S, B>(f: (a: A) => State<S, B>) => (ma: HKT2<M, S, A>) => HKT2<M, S, B>
