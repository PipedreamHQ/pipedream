/**
 * Mutable references in the `IO` monad
 *
 * @since 2.0.0
 */
import { IO } from './IO'
/**
 * @example
 * import { flatMap } from 'fp-ts/IO'
 * import { newIORef } from 'fp-ts/IORef'
 *
 * assert.strictEqual(flatMap(newIORef(1), ref => flatMap(ref.write(2), () => ref.read))(), 2)
 *
 * @category model
 * @since 2.0.0
 */
export declare class IORef<A> {
  private value
  /**
   * @since 2.0.0
   */
  readonly read: IO<A>
  constructor(value: A)
  /**
   * @since 2.0.0
   */
  write(a: A): IO<void>
  /**
   * @since 2.0.0
   */
  modify(f: (a: A) => A): IO<void>
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function newIORef<A>(a: A): IO<IORef<A>>
