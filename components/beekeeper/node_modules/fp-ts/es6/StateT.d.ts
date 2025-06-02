/**
 * The state monad transformer. It can be used to add state to other monads.
 *
 * The `of` function leaves the state unchanged, while `chain` uses the final state of the first computation
 * as the initial state of the second.
 *
 * @since 2.0.0
 */
import { Chain, Chain1, Chain2, Chain2C, Chain3, Chain3C } from './Chain'
import { Functor, Functor1, Functor2, Functor2C, Functor3, Functor3C } from './Functor'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from './HKT'
import { Monad, Monad1, Monad2, Monad2C, Monad3, Monad3C } from './Monad'
import { Pointed, Pointed1, Pointed2, Pointed2C, Pointed3, Pointed3C } from './Pointed'
import { State } from './State'
/**
 * @category model
 * @since 2.0.0
 */
export interface StateT<M, S, A> {
  (s: S): HKT<M, [A, S]>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface StateT1<M extends URIS, S, A> {
  (s: S): Kind<M, [A, S]>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface StateT2<M extends URIS2, S, E, A> {
  (s: S): Kind2<M, E, [A, S]>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface StateT3<M extends URIS3, S, R, E, A> {
  (s: S): Kind3<M, R, E, [A, S]>
}
/**
 * @since 2.10.0
 */
export declare function of<F extends URIS3>(F: Pointed3<F>): <A, S, R, E>(a: A) => StateT3<F, S, R, E, A>
export declare function of<F extends URIS3, E>(F: Pointed3C<F, E>): <A, S, R>(a: A) => StateT3<F, S, R, E, A>
export declare function of<F extends URIS2>(F: Pointed2<F>): <A, S, E>(a: A) => StateT2<F, S, E, A>
export declare function of<F extends URIS2, E>(F: Pointed2C<F, E>): <A, S>(a: A) => StateT2<F, S, E, A>
export declare function of<F extends URIS>(F: Pointed1<F>): <A, S>(a: A) => StateT1<F, S, A>
export declare function of<F>(F: Pointed<F>): <A, S>(a: A) => StateT<F, S, A>
/**
 * @since 2.10.0
 */
export declare function map<F extends URIS3>(
  F: Functor3<F>
): <A, B>(f: (a: A) => B) => <S, R, E>(fa: StateT3<F, S, R, E, A>) => StateT3<F, S, R, E, B>
export declare function map<F extends URIS3, E>(
  F: Functor3C<F, E>
): <A, B>(f: (a: A) => B) => <S, R>(fa: StateT3<F, S, R, E, A>) => StateT3<F, S, R, E, B>
export declare function map<F extends URIS2>(
  F: Functor2<F>
): <A, B>(f: (a: A) => B) => <S, E>(fa: StateT2<F, S, E, A>) => StateT2<F, S, E, B>
export declare function map<F extends URIS2, E>(
  F: Functor2C<F, E>
): <A, B>(f: (a: A) => B) => <S>(fa: StateT2<F, S, E, A>) => StateT2<F, S, E, B>
export declare function map<F extends URIS>(
  F: Functor1<F>
): <A, B>(f: (a: A) => B) => <S>(fa: StateT1<F, S, A>) => StateT1<F, S, B>
export declare function map<F>(F: Functor<F>): <A, B>(f: (a: A) => B) => <S>(fa: StateT<F, S, A>) => StateT<F, S, B>
/**
 * @since 2.10.0
 */
export declare function ap<M extends URIS3>(
  M: Chain3<M>
): <S, R, E, A>(fa: StateT3<M, S, R, E, A>) => <B>(fab: StateT3<M, S, R, E, (a: A) => B>) => StateT3<M, S, R, E, B>
export declare function ap<M extends URIS3, E>(
  M: Chain3C<M, E>
): <S, R, A>(fa: StateT3<M, S, R, E, A>) => <B>(fab: StateT3<M, S, R, E, (a: A) => B>) => StateT3<M, S, R, E, B>
export declare function ap<M extends URIS2>(
  M: Chain2<M>
): <S, E, A>(fa: StateT2<M, S, E, A>) => <B>(fab: StateT2<M, S, E, (a: A) => B>) => StateT2<M, S, E, B>
export declare function ap<M extends URIS2, E>(
  M: Chain2C<M, E>
): <S, A>(fa: StateT2<M, S, E, A>) => <B>(fab: StateT2<M, S, E, (a: A) => B>) => StateT2<M, S, E, B>
export declare function ap<M extends URIS>(
  M: Chain1<M>
): <S, A>(fa: StateT1<M, S, A>) => <B>(fab: StateT1<M, S, (a: A) => B>) => StateT1<M, S, B>
export declare function ap<M>(
  M: Chain<M>
): <S, A>(fa: StateT<M, S, A>) => <B>(fab: StateT<M, S, (a: A) => B>) => StateT<M, S, B>
/**
 * @since 2.10.0
 */
export declare function chain<M extends URIS3>(
  M: Chain3<M>
): <A, S, R, E, B>(f: (a: A) => StateT3<M, S, R, E, B>) => (ma: StateT3<M, S, R, E, A>) => StateT3<M, S, R, E, B>
export declare function chain<M extends URIS3, E>(
  M: Chain3C<M, E>
): <A, S, R, B>(f: (a: A) => StateT3<M, S, R, E, B>) => (ma: StateT3<M, S, R, E, A>) => StateT3<M, S, R, E, B>
export declare function chain<M extends URIS2>(
  M: Chain2<M>
): <A, S, E, B>(f: (a: A) => StateT2<M, S, E, B>) => (ma: StateT2<M, S, E, A>) => StateT2<M, S, E, B>
export declare function chain<M extends URIS2, E>(
  M: Chain2C<M, E>
): <A, S, B>(f: (a: A) => StateT2<M, S, E, B>) => (ma: StateT2<M, S, E, A>) => StateT2<M, S, E, B>
export declare function chain<M extends URIS>(
  M: Chain1<M>
): <A, S, B>(f: (a: A) => StateT1<M, S, B>) => (ma: StateT1<M, S, A>) => StateT1<M, S, B>
export declare function chain<M>(
  M: Chain<M>
): <A, S, B>(f: (a: A) => StateT<M, S, B>) => (ma: StateT<M, S, A>) => StateT<M, S, B>
/**
 * @since 2.10.0
 */
export declare function fromState<F extends URIS3>(
  F: Pointed3<F>
): <S, A, R, E>(sa: State<S, A>) => StateT3<F, S, R, E, A>
export declare function fromState<F extends URIS3, E>(
  F: Pointed3C<F, E>
): <S, A, R>(sa: State<S, A>) => StateT3<F, S, R, E, A>
export declare function fromState<F extends URIS2>(F: Pointed2<F>): <S, A, E>(sa: State<S, A>) => StateT2<F, S, E, A>
export declare function fromState<F extends URIS2, E>(
  F: Pointed2C<F, E>
): <S, A>(sa: State<S, A>) => StateT2<F, S, E, A>
export declare function fromState<F extends URIS>(F: Pointed1<F>): <S, A>(sa: State<S, A>) => StateT1<F, S, A>
export declare function fromState<F>(F: Pointed<F>): <S, A>(sa: State<S, A>) => StateT<F, S, A>
/**
 * @since 2.10.0
 */
export declare function fromF<F extends URIS3>(
  F: Functor3<F>
): <R, E, A, S>(ma: Kind3<F, R, E, A>) => StateT3<F, S, R, E, A>
export declare function fromF<F extends URIS3, E>(
  F: Functor3C<F, E>
): <R, A, S>(ma: Kind3<F, R, E, A>) => StateT3<F, S, R, E, A>
export declare function fromF<F extends URIS2>(F: Functor2<F>): <E, A, S>(ma: Kind2<F, E, A>) => StateT2<F, S, E, A>
export declare function fromF<F extends URIS2, E>(F: Functor2C<F, E>): <A, S>(ma: Kind2<F, E, A>) => StateT2<F, S, E, A>
export declare function fromF<F extends URIS>(F: Functor1<F>): <A, S>(ma: Kind<F, A>) => StateT1<F, S, A>
export declare function fromF<F>(F: Functor<F>): <A, S>(ma: HKT<F, A>) => StateT<F, S, A>
/**
 * @since 2.10.0
 */
export declare function evaluate<F extends URIS3>(
  F: Functor3<F>
): <S>(s: S) => <R, E, A>(ma: StateT3<F, S, R, E, A>) => Kind3<F, R, E, A>
export declare function evaluate<F extends URIS3, E>(
  F: Functor3C<F, E>
): <S>(s: S) => <R, A>(ma: StateT3<F, S, R, E, A>) => Kind3<F, R, E, A>
export declare function evaluate<F extends URIS2>(
  F: Functor2<F>
): <S>(s: S) => <E, A>(ma: StateT2<F, S, E, A>) => Kind2<F, E, A>
export declare function evaluate<F extends URIS2, E>(
  F: Functor2C<F, E>
): <S>(s: S) => <A>(ma: StateT2<F, S, E, A>) => Kind2<F, E, A>
export declare function evaluate<F extends URIS>(F: Functor1<F>): <S>(s: S) => <A>(ma: StateT1<F, S, A>) => Kind<F, A>
export declare function evaluate<F>(F: Functor<F>): <S>(s: S) => <A>(ma: StateT<F, S, A>) => HKT<F, A>
/**
 * @since 2.10.0
 */
export declare function execute<F extends URIS3>(
  F: Functor3<F>
): <S>(s: S) => <R, E, A>(ma: StateT3<F, S, R, E, A>) => Kind3<F, R, E, S>
export declare function execute<F extends URIS3, E>(
  F: Functor3C<F, E>
): <S>(s: S) => <R, A>(ma: StateT3<F, S, R, E, A>) => Kind3<F, R, E, S>
export declare function execute<F extends URIS2>(
  F: Functor2<F>
): <S>(s: S) => <E, A>(ma: StateT2<F, S, E, A>) => Kind2<F, E, S>
export declare function execute<F extends URIS2, E>(
  F: Functor2C<F, E>
): <S>(s: S) => <A>(ma: StateT2<F, S, E, A>) => Kind2<F, E, S>
export declare function execute<F extends URIS>(F: Functor1<F>): <S>(s: S) => <A>(ma: StateT1<F, S, A>) => Kind<F, S>
export declare function execute<F>(F: Functor<F>): <S>(s: S) => <A>(ma: StateT<F, S, A>) => HKT<F, S>
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface StateM<M> {
  readonly map: <S, A, B>(fa: StateT<M, S, A>, f: (a: A) => B) => StateT<M, S, B>
  readonly of: <S, A>(a: A) => StateT<M, S, A>
  readonly ap: <S, A, B>(fab: StateT<M, S, (a: A) => B>, fa: StateT<M, S, A>) => StateT<M, S, B>
  readonly chain: <S, A, B>(fa: StateT<M, S, A>, f: (a: A) => StateT<M, S, B>) => StateT<M, S, B>
  readonly get: <S>() => StateT<M, S, S>
  readonly put: <S>(s: S) => StateT<M, S, void>
  readonly modify: <S>(f: (s: S) => S) => StateT<M, S, void>
  readonly gets: <S, A>(f: (s: S) => A) => StateT<M, S, A>
  readonly fromState: <S, A>(fa: State<S, A>) => StateT<M, S, A>
  readonly fromM: <S, A>(ma: HKT<M, A>) => StateT<M, S, A>
  readonly evalState: <S, A>(ma: StateT<M, S, A>, s: S) => HKT<M, A>
  readonly execState: <S, A>(ma: StateT<M, S, A>, s: S) => HKT<M, S>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface StateM1<M extends URIS> {
  readonly map: <S, A, B>(fa: StateT1<M, S, A>, f: (a: A) => B) => StateT1<M, S, B>
  readonly of: <S, A>(a: A) => StateT1<M, S, A>
  readonly ap: <S, A, B>(fab: StateT1<M, S, (a: A) => B>, fa: StateT1<M, S, A>) => StateT1<M, S, B>
  readonly chain: <S, A, B>(fa: StateT1<M, S, A>, f: (a: A) => StateT1<M, S, B>) => StateT1<M, S, B>
  readonly get: <S>() => StateT1<M, S, S>
  readonly put: <S>(s: S) => StateT1<M, S, void>
  readonly modify: <S>(f: (s: S) => S) => StateT1<M, S, void>
  readonly gets: <S, A>(f: (s: S) => A) => StateT1<M, S, A>
  readonly fromState: <S, A>(fa: State<S, A>) => StateT1<M, S, A>
  readonly fromM: <S, A>(ma: Kind<M, A>) => StateT1<M, S, A>
  readonly evalState: <S, A>(ma: StateT1<M, S, A>, s: S) => Kind<M, A>
  readonly execState: <S, A>(ma: StateT1<M, S, A>, s: S) => Kind<M, S>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface StateM2<M extends URIS2> {
  readonly map: <S, E, A, B>(fa: StateT2<M, S, E, A>, f: (a: A) => B) => StateT2<M, S, E, B>
  readonly of: <S, E, A>(a: A) => StateT2<M, S, E, A>
  readonly ap: <S, E, A, B>(fab: StateT2<M, S, E, (a: A) => B>, fa: StateT2<M, S, E, A>) => StateT2<M, S, E, B>
  readonly chain: <S, E, A, B>(fa: StateT2<M, S, E, A>, f: (a: A) => StateT2<M, S, E, B>) => StateT2<M, S, E, B>
  readonly get: <E, S>() => StateT2<M, S, E, S>
  readonly put: <E, S>(s: S) => StateT2<M, S, E, void>
  readonly modify: <E, S>(f: (s: S) => S) => StateT2<M, S, E, void>
  readonly gets: <S, E, A>(f: (s: S) => A) => StateT2<M, S, E, A>
  readonly fromState: <S, E, A>(fa: State<S, A>) => StateT2<M, S, E, A>
  readonly fromM: <S, E, A>(ma: Kind2<M, E, A>) => StateT2<M, S, E, A>
  readonly evalState: <S, E, A>(ma: StateT2<M, S, E, A>, s: S) => Kind2<M, E, A>
  readonly execState: <S, E, A>(ma: StateT2<M, S, E, A>, s: S) => Kind2<M, E, S>
}
/**
 * @category zone of death
 * @since 2.5.4
 * @deprecated
 */
export interface StateM2C<M extends URIS2, E> {
  readonly map: <S, A, B>(fa: StateT2<M, S, E, A>, f: (a: A) => B) => StateT2<M, S, E, B>
  readonly of: <S, A>(a: A) => StateT2<M, S, E, A>
  readonly ap: <S, A, B>(fab: StateT2<M, S, E, (a: A) => B>, fa: StateT2<M, S, E, A>) => StateT2<M, S, E, B>
  readonly chain: <S, A, B>(fa: StateT2<M, S, E, A>, f: (a: A) => StateT2<M, S, E, B>) => StateT2<M, S, E, B>
  readonly get: <S>() => StateT2<M, S, E, S>
  readonly put: <S>(s: S) => StateT2<M, S, E, void>
  readonly modify: <S>(f: (s: S) => S) => StateT2<M, S, E, void>
  readonly gets: <S, A>(f: (s: S) => A) => StateT2<M, S, E, A>
  readonly fromState: <S, A>(fa: State<S, A>) => StateT2<M, S, E, A>
  readonly fromM: <S, A>(ma: Kind2<M, E, A>) => StateT2<M, S, E, A>
  readonly evalState: <S, A>(ma: StateT2<M, S, E, A>, s: S) => Kind2<M, E, A>
  readonly execState: <S, A>(ma: StateT2<M, S, E, A>, s: S) => Kind2<M, E, S>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface StateM3<M extends URIS3> {
  readonly map: <S, R, E, A, B>(fa: StateT3<M, S, R, E, A>, f: (a: A) => B) => StateT3<M, S, R, E, B>
  readonly of: <S, R, E, A>(a: A) => StateT3<M, S, R, E, A>
  readonly ap: <S, R, E, A, B>(
    fab: StateT3<M, S, R, E, (a: A) => B>,
    fa: StateT3<M, S, R, E, A>
  ) => StateT3<M, S, R, E, B>
  readonly chain: <S, R, E, A, B>(
    fa: StateT3<M, S, R, E, A>,
    f: (a: A) => StateT3<M, S, R, E, B>
  ) => StateT3<M, S, R, E, B>
  readonly get: <R, E, S>() => StateT3<M, S, R, E, S>
  readonly put: <R, E, S>(s: S) => StateT3<M, S, R, E, void>
  readonly modify: <R, E, S>(f: (s: S) => S) => StateT3<M, S, R, E, void>
  readonly gets: <S, R, E, A>(f: (s: S) => A) => StateT3<M, S, R, E, A>
  readonly fromState: <S, R, E, A>(fa: State<S, A>) => StateT3<M, S, R, E, A>
  readonly fromM: <S, R, E, A>(ma: Kind3<M, R, E, A>) => StateT3<M, S, R, E, A>
  readonly evalState: <S, R, E, A>(ma: StateT3<M, S, R, E, A>, s: S) => Kind3<M, R, E, A>
  readonly execState: <S, R, E, A>(ma: StateT3<M, S, R, E, A>, s: S) => Kind3<M, R, E, S>
}
/**
 * @category zone of death
 * @since 2.5.4
 * @deprecated
 */
export interface StateM3C<M extends URIS3, E> {
  readonly map: <S, R, A, B>(fa: StateT3<M, S, R, E, A>, f: (a: A) => B) => StateT3<M, S, R, E, B>
  readonly of: <S, R, A>(a: A) => StateT3<M, S, R, E, A>
  readonly ap: <S, R, A, B>(fab: StateT3<M, S, R, E, (a: A) => B>, fa: StateT3<M, S, R, E, A>) => StateT3<M, S, R, E, B>
  readonly chain: <S, R, A, B>(
    fa: StateT3<M, S, R, E, A>,
    f: (a: A) => StateT3<M, S, R, E, B>
  ) => StateT3<M, S, R, E, B>
  readonly get: <R, S>() => StateT3<M, S, R, E, S>
  readonly put: <R, S>(s: S) => StateT3<M, S, R, E, void>
  readonly modify: <R, S>(f: (s: S) => S) => StateT3<M, S, R, E, void>
  readonly gets: <S, R, A>(f: (s: S) => A) => StateT3<M, S, R, E, A>
  readonly fromState: <S, R, A>(fa: State<S, A>) => StateT3<M, S, R, E, A>
  readonly fromM: <S, R, A>(ma: Kind3<M, R, E, A>) => StateT3<M, S, R, E, A>
  readonly evalState: <S, R, A>(ma: StateT3<M, S, R, E, A>, s: S) => Kind3<M, R, E, A>
  readonly execState: <S, R, A>(ma: StateT3<M, S, R, E, A>, s: S) => Kind3<M, R, E, S>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function getStateM<M extends URIS3>(M: Monad3<M>): StateM3<M>
/** @deprecated */
export declare function getStateM<M extends URIS3, E>(M: Monad3C<M, E>): StateM3C<M, E>
/** @deprecated */
export declare function getStateM<M extends URIS2>(M: Monad2<M>): StateM2<M>
/** @deprecated */
export declare function getStateM<M extends URIS2, E>(M: Monad2C<M, E>): StateM2C<M, E>
/** @deprecated */
export declare function getStateM<M extends URIS>(M: Monad1<M>): StateM1<M>
/** @deprecated */
export declare function getStateM<M>(M: Monad<M>): StateM<M>
