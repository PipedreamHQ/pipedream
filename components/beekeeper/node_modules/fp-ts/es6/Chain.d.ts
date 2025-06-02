/**
 * The `Chain` type class extends the `Apply` type class with a `chain` operation which composes computations in
 * sequence, using the return value of one computation to determine the next computation.
 *
 * Instances must satisfy the following law in addition to the `Apply` laws:
 *
 * 1. Associativity: `F.chain(F.chain(fa, afb), bfc) <-> F.chain(fa, a => F.chain(afb(a), bfc))`
 *
 * Note. `Apply`'s `ap` can be derived: `(fab, fa) => F.chain(fab, f => F.map(fa, f))`
 *
 * @since 2.0.0
 */
import { Apply, Apply1, Apply2, Apply2C, Apply3, Apply3C, Apply4 } from './Apply'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Chain<F> extends Apply<F> {
  readonly chain: <A, B>(fa: HKT<F, A>, f: (a: A) => HKT<F, B>) => HKT<F, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Chain1<F extends URIS> extends Apply1<F> {
  readonly chain: <A, B>(fa: Kind<F, A>, f: (a: A) => Kind<F, B>) => Kind<F, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Chain2<F extends URIS2> extends Apply2<F> {
  readonly chain: <E, A, B>(fa: Kind2<F, E, A>, f: (a: A) => Kind2<F, E, B>) => Kind2<F, E, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Chain2C<F extends URIS2, E> extends Apply2C<F, E> {
  readonly chain: <A, B>(fa: Kind2<F, E, A>, f: (a: A) => Kind2<F, E, B>) => Kind2<F, E, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Chain3<F extends URIS3> extends Apply3<F> {
  readonly chain: <R, E, A, B>(fa: Kind3<F, R, E, A>, f: (a: A) => Kind3<F, R, E, B>) => Kind3<F, R, E, B>
}
/**
 * @category model
 * @since 2.2.0
 */
export interface Chain3C<F extends URIS3, E> extends Apply3C<F, E> {
  readonly chain: <R, A, B>(fa: Kind3<F, R, E, A>, f: (a: A) => Kind3<F, R, E, B>) => Kind3<F, R, E, B>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Chain4<F extends URIS4> extends Apply4<F> {
  readonly chain: <S, R, E, A, B>(fa: Kind4<F, S, R, E, A>, f: (a: A) => Kind4<F, S, R, E, B>) => Kind4<F, S, R, E, B>
}
/**
 * @since 2.10.0
 */
export declare function chainFirst<M extends URIS4>(
  M: Chain4<M>
): <A, S, R, E, _>(f: (a: A) => Kind4<M, S, R, E, _>) => (first: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, A>
export declare function chainFirst<M extends URIS3>(
  M: Chain3<M>
): <A, R, E, _>(f: (a: A) => Kind3<M, R, E, _>) => (first: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export declare function chainFirst<M extends URIS3, E>(
  M: Chain3C<M, E>
): <A, R, _>(f: (a: A) => Kind3<M, R, E, _>) => (first: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export declare function chainFirst<M extends URIS2>(
  M: Chain2<M>
): <A, E, _>(f: (a: A) => Kind2<M, E, _>) => (first: Kind2<M, E, A>) => Kind2<M, E, A>
export declare function chainFirst<M extends URIS2, E>(
  M: Chain2C<M, E>
): <A, _>(f: (a: A) => Kind2<M, E, _>) => (first: Kind2<M, E, A>) => Kind2<M, E, A>
export declare function chainFirst<M extends URIS>(
  M: Chain1<M>
): <A, _>(f: (a: A) => Kind<M, _>) => (first: Kind<M, A>) => Kind<M, A>
export declare function chainFirst<M>(M: Chain<M>): <A, _>(f: (a: A) => HKT<M, _>) => (first: HKT<M, A>) => HKT<M, A>
/**
 * @since 2.10.0
 */
export declare function bind<M extends URIS4>(
  M: Chain4<M>
): <N extends string, A, S, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Kind4<M, S, R, E, B>
) => (ma: Kind4<M, S, R, E, A>) => Kind4<
  M,
  S,
  R,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
export declare function bind<M extends URIS3>(
  M: Chain3<M>
): <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Kind3<M, R, E, B>
) => (ma: Kind3<M, R, E, A>) => Kind3<
  M,
  R,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
export declare function bind<M extends URIS3, E>(
  M: Chain3C<M, E>
): <N extends string, A, R, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Kind3<M, R, E, B>
) => (ma: Kind3<M, R, E, A>) => Kind3<
  M,
  R,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
export declare function bind<M extends URIS2>(
  M: Chain2<M>
): <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Kind2<M, E, B>
) => (ma: Kind2<M, E, A>) => Kind2<
  M,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
export declare function bind<M extends URIS2, E>(
  M: Chain2C<M, E>
): <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Kind2<M, E, B>
) => (ma: Kind2<M, E, A>) => Kind2<
  M,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
export declare function bind<M extends URIS>(
  M: Chain1<M>
): <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Kind<M, B>
) => (ma: Kind<M, A>) => Kind<
  M,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
export declare function bind<M>(M: Chain<M>): <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => HKT<M, B>
) => (ma: HKT<M, A>) => HKT<
  M,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B
  }
>
