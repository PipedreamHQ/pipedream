/**
 * The `Monad` type class combines the operations of the `Chain` and
 * `Applicative` type classes. Therefore, `Monad` instances represent type
 * constructors which support sequential composition, and also lifting of
 * functions of arbitrary arity.
 *
 * Instances must satisfy the following laws in addition to the `Applicative` and `Chain` laws:
 *
 * 1. Left identity: `M.chain(M.of(a), f) <-> f(a)`
 * 2. Right identity: `M.chain(fa, M.of) <-> fa`
 *
 * Note. `Functor`'s `map` can be derived: `A.map = (fa, f) => A.chain(fa, a => A.of(f(a)))`
 *
 * @since 2.0.0
 */
import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4
} from './Applicative'
import { Chain, Chain1, Chain2, Chain2C, Chain3, Chain3C, Chain4 } from './Chain'
import { URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Monad<F> extends Applicative<F>, Chain<F> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Monad1<F extends URIS> extends Applicative1<F>, Chain1<F> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Monad2<M extends URIS2> extends Applicative2<M>, Chain2<M> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Monad2C<M extends URIS2, L> extends Applicative2C<M, L>, Chain2C<M, L> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Monad3<M extends URIS3> extends Applicative3<M>, Chain3<M> {}
/**
 * @category model
 * @since 2.2.0
 */
export interface Monad3C<M extends URIS3, E> extends Applicative3C<M, E>, Chain3C<M, E> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Monad4<M extends URIS4> extends Applicative4<M>, Chain4<M> {}
