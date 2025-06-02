/**
 * The `MonadThrow` type class represents those monads which support errors via
 * `throwError`, where `throwError(e)` halts, yielding the error `e`.
 *
 * Laws:
 *
 * - Left zero: `M.chain(M.throwError(e), f) = M.throwError(e)`
 *
 * @since 2.0.0
 */
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Monad, Monad1, Monad2, Monad2C, Monad3, Monad3C, Monad4 } from './Monad'
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadThrow<M> extends Monad<M> {
  readonly throwError: <E, A>(e: E) => HKT<M, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadThrow1<M extends URIS> extends Monad1<M> {
  readonly throwError: <E, A>(e: E) => Kind<M, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadThrow2<M extends URIS2> extends Monad2<M> {
  readonly throwError: <E, A>(e: E) => Kind2<M, E, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadThrow2C<M extends URIS2, E> extends Monad2C<M, E> {
  readonly throwError: <A>(e: E) => Kind2<M, E, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadThrow3<M extends URIS3> extends Monad3<M> {
  readonly throwError: <R, E, A>(e: E) => Kind3<M, R, E, A>
}
/**
 * @category model
 * @since 2.2.0
 */
export interface MonadThrow3C<M extends URIS3, E> extends Monad3C<M, E> {
  readonly throwError: <R, A>(e: E) => Kind3<M, R, E, A>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadThrow4<M extends URIS4> extends Monad4<M> {
  readonly throwError: <S, R, E, A>(e: E) => Kind4<M, S, R, E, A>
}
