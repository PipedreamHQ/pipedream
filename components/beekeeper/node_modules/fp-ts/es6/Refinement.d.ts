/**
 * @since 2.11.0
 */
import { Either } from './Either'
import { Option } from './Option'
/**
 * @since 2.11.0
 */
export interface Refinement<A, B extends A> {
  (a: A): a is B
}
/**
 * Returns a `Refinement` from a `Option` returning function.
 * This function ensures that a `Refinement` definition is type-safe.
 *
 * @category lifting
 * @since 2.11.0
 */
export declare const fromOptionK: <A, B extends A>(getOption: (a: A) => Option<B>) => Refinement<A, B>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromEitherK: <A, B extends A>(getEither: (a: A) => Either<unknown, B>) => Refinement<A, B>
/**
 * @category constructors
 * @since 2.11.0
 */
export declare const id: <A>() => Refinement<A, A>
/**
 * @since 2.11.0
 */
export declare const not: <A, B extends A>(refinement: Refinement<A, B>) => Refinement<A, Exclude<A, B>>
/**
 * @since 2.11.0
 */
export declare const or: <A, C extends A>(
  second: Refinement<A, C>
) => <B extends A>(first: Refinement<A, B>) => Refinement<A, B | C>
/**
 * @since 2.11.0
 */
export declare const and: <A, C extends A>(
  second: Refinement<A, C>
) => <B extends A>(first: Refinement<A, B>) => Refinement<A, B & C>
/**
 * @since 2.11.0
 */
export declare const zero: <A, B extends A>() => Refinement<A, B>
/**
 * @since 2.11.0
 */
export declare const compose: <A, B extends A, C extends B>(
  bc: Refinement<B, C>
) => (ab: Refinement<A, B>) => Refinement<A, C>
