/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.0.0
 */
import { FromTask, FromTask1, FromTask2, FromTask2C, FromTask3, FromTask3C, FromTask4 } from './FromTask'
import { URIS, URIS2, URIS3, URIS4 } from './HKT'
import { MonadIO, MonadIO1, MonadIO2, MonadIO2C, MonadIO3, MonadIO3C, MonadIO4 } from './MonadIO'
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadTask<M> extends MonadIO<M>, FromTask<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadTask1<M extends URIS> extends MonadIO1<M>, FromTask1<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadTask2<M extends URIS2> extends MonadIO2<M>, FromTask2<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadTask2C<M extends URIS2, E> extends MonadIO2C<M, E>, FromTask2C<M, E> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface MonadTask3<M extends URIS3> extends MonadIO3<M>, FromTask3<M> {}
/**
 * @category model
 * @since 2.2.0
 */
export interface MonadTask3C<M extends URIS3, E> extends MonadIO3C<M, E>, FromTask3C<M, E> {}
/**
 * @category model
 * @since 2.4.4
 */
export interface MonadTask4<M extends URIS4> extends MonadIO4<M>, FromTask4<M> {}
