/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.0.0
 */
import { FromIO, FromIO1, FromIO2, FromIO2C, FromIO3, FromIO3C, FromIO4 } from './FromIO'
import { URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Monad, Monad1, Monad2, Monad2C, Monad3, Monad3C, Monad4 } from './Monad'
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadIO<M> extends Monad<M>, FromIO<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadIO1<M extends URIS> extends Monad1<M>, FromIO1<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadIO2<M extends URIS2> extends Monad2<M>, FromIO2<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadIO2C<M extends URIS2, E> extends Monad2C<M, E>, FromIO2C<M, E> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadIO3<M extends URIS3> extends Monad3<M>, FromIO3<M> {}
/**
 * @category model
 * @since 2.2.0
 */
export interface MonadIO3C<M extends URIS3, E> extends Monad3C<M, E>, FromIO3C<M, E> {}
/**
 * @category model
 * @since 2.4.4
 */
export interface MonadIO4<M extends URIS4> extends Monad4<M>, FromIO4<M> {}
