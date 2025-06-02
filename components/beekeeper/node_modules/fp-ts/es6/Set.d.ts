/**
 * @since 2.0.0
 */
import { Either } from './Either'
import { Eq } from './Eq'
import { Magma } from './Magma'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Ord } from './Ord'
import { Predicate } from './Predicate'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import { Separated } from './Separated'
import { Show } from './Show'
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getShow: <A>(S: Show<A>) => Show<Set<A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getEq: <A>(E: Eq<A>) => Eq<Set<A>>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @since 2.0.0
 */
export declare function map<B>(E: Eq<B>): <A>(f: (x: A) => B) => (set: Set<A>) => Set<B>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @since 2.0.0
 */
export declare function chain<B>(E: Eq<B>): <A>(f: (x: A) => Set<B>) => (set: Set<A>) => Set<B>
/**
 * @since 2.0.0
 */
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): (set: Set<A>) => Set<B>
export declare function filter<A>(predicate: Predicate<A>): <B extends A>(set: Set<B>) => Set<B>
export declare function filter<A>(predicate: Predicate<A>): (set: Set<A>) => Set<A>
/**
 * @since 2.0.0
 */
export declare function partition<A, B extends A>(
  refinement: Refinement<A, B>
): (set: Set<A>) => Separated<Set<A>, Set<B>>
export declare function partition<A>(predicate: Predicate<A>): <B extends A>(set: Set<B>) => Separated<Set<B>, Set<B>>
export declare function partition<A>(predicate: Predicate<A>): (set: Set<A>) => Separated<Set<A>, Set<A>>
/**
 * Form the union of two sets
 *
 * @since 2.0.0
 */
export declare function union<A>(E: Eq<A>): {
  (that: Set<A>): (me: Set<A>) => Set<A>
  (me: Set<A>, that: Set<A>): Set<A>
}
/**
 * The set of elements which are in both the first and second set
 *
 * @since 2.0.0
 */
export declare function intersection<A>(E: Eq<A>): {
  (that: Set<A>): (me: Set<A>) => Set<A>
  (me: Set<A>, that: Set<A>): Set<A>
}
/**
 * @since 2.0.0
 */
export declare function partitionMap<B, C>(
  EB: Eq<B>,
  EC: Eq<C>
): <A>(f: (a: A) => Either<B, C>) => (set: Set<A>) => Separated<Set<B>, Set<C>>
/**
 * Form the set difference (`x` - `y`)
 *
 * @example
 * import { difference } from 'fp-ts/Set'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(new Set([1, 2]), difference(N.Eq)(new Set([1, 3]))), new Set([2]))
 *
 * @since 2.0.0
 */
export declare function difference<A>(E: Eq<A>): {
  (that: Set<A>): (me: Set<A>) => Set<A>
  (me: Set<A>, that: Set<A>): Set<A>
}
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getUnionSemigroup: <A>(E: Eq<A>) => Semigroup<Set<A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getUnionMonoid: <A>(E: Eq<A>) => Monoid<Set<A>>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getIntersectionSemigroup: <A>(E: Eq<A>) => Semigroup<Set<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getDifferenceMagma: <A>(E: Eq<A>) => Magma<Set<A>>
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduce: <A>(O: Ord<A>) => <B>(b: B, f: (b: B, a: A) => B) => (fa: Set<A>) => B
/**
 * @category folding
 * @since 2.0.0
 */
export declare const foldMap: <A, M>(O: Ord<A>, M: Monoid<M>) => (f: (a: A) => M) => (fa: Set<A>) => M
/**
 * @category folding
 * @since 2.11.0
 */
export declare const reduceRight: <A>(O: Ord<A>) => <B>(b: B, f: (a: A, b: B) => B) => (fa: Set<A>) => B
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const singleton: <A>(a: A) => Set<A>
/**
 * Insert a value into a set
 *
 * @since 2.0.0
 */
export declare function insert<A>(E: Eq<A>): (a: A) => (set: Set<A>) => Set<A>
/**
 * Delete a value from a set
 *
 * @since 2.0.0
 */
export declare const remove: <A>(E: Eq<A>) => (a: A) => (set: Set<A>) => Set<A>
/**
 * Checks an element is a member of a set;
 * If yes, removes the value from the set
 * If no, inserts the value to the set
 *
 * @since 2.5.0
 */
export declare const toggle: <A>(E: Eq<A>) => (a: A) => (set: Set<A>) => Set<A>
/**
 * Create a set from an array
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromArray: <A>(E: Eq<A>) => (as: Array<A>) => Set<A>
/**
 * @since 2.0.0
 */
export declare const compact: <A>(E: Eq<A>) => (fa: Set<Option<A>>) => Set<A>
/**
 * @since 2.0.0
 */
export declare function separate<E, A>(EE: Eq<E>, EA: Eq<A>): (fa: Set<Either<E, A>>) => Separated<Set<E>, Set<A>>
/**
 * @since 2.0.0
 */
export declare function filterMap<B>(E: Eq<B>): <A>(f: (a: A) => Option<B>) => (fa: Set<A>) => Set<B>
/**
 * @since 2.0.0
 */
export declare const empty: Set<never>
/**
 * Test whether a `Set` is empty.
 *
 * @since 2.10.0
 */
export declare const isEmpty: <A>(set: Set<A>) => boolean
/**
 * Calculate the number of elements in a `Set`.
 *
 * @since 2.10.0
 */
export declare const size: <A>(set: Set<A>) => number
/**
 * @since 2.0.0
 */
export declare const some: <A>(predicate: Predicate<A>) => (set: Set<A>) => boolean
/**
 * @since 2.0.0
 */
export declare const every: {
  <A, B extends A>(refinement: Refinement<A, B>): Refinement<Set<A>, Set<B>>
  <A>(predicate: Predicate<A>): Predicate<Set<A>>
}
/**
 * @since 2.10.0
 */
export declare const isSubset: <A>(E: Eq<A>) => (that: Set<A>) => (me: Set<A>) => boolean
/**
 * Test if a value is a member of a set
 *
 * @since 2.0.0
 */
export declare const elem: <A>(E: Eq<A>) => {
  (a: A): (set: Set<A>) => boolean
  (a: A, set: Set<A>): boolean
}
/**
 * Get a sorted `Array` of the values contained in a `Set`.
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const toArray: <A>(O: Ord<A>) => (set: Set<A>) => Array<A>
/**
 * Use [`isSubset`](#issubset) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const subset: <A>(E: Eq<A>) => {
  (that: Set<A>): (me: Set<A>) => boolean
  (me: Set<A>, that: Set<A>): boolean
}
