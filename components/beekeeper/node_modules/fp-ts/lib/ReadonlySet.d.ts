/**
 * @since 2.5.0
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
 * @category conversions
 * @since 2.5.0
 */
export declare const fromSet: <A>(s: Set<A>) => ReadonlySet<A>
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.5.0
 */
export declare const singleton: <A>(a: A) => ReadonlySet<A>
/**
 * Create a `ReadonlySet` from a `ReadonlyArray`
 *
 * @category conversions
 * @since 2.10.0
 */
export declare const fromReadonlyArray: <A>(E: Eq<A>) => (as: ReadonlyArray<A>) => ReadonlySet<A>
/**
 * @category conversions
 * @since 2.5.0
 */
export declare function toSet<A>(s: ReadonlySet<A>): Set<A>
/**
 * Projects a Set through a function
 *
 * @since 2.5.0
 */
export declare function map<B>(E: Eq<B>): <A>(f: (x: A) => B) => (set: ReadonlySet<A>) => ReadonlySet<B>
/**
 * @since 2.5.0
 */
export declare function chain<B>(E: Eq<B>): <A>(f: (x: A) => ReadonlySet<B>) => (set: ReadonlySet<A>) => ReadonlySet<B>
/**
 * @since 2.5.0
 */
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): (set: ReadonlySet<A>) => ReadonlySet<B>
export declare function filter<A>(predicate: Predicate<A>): <B extends A>(set: ReadonlySet<B>) => ReadonlySet<B>
export declare function filter<A>(predicate: Predicate<A>): (set: ReadonlySet<A>) => ReadonlySet<A>
/**
 * @since 2.5.0
 */
export declare function partition<A, B extends A>(
  refinement: Refinement<A, B>
): (set: ReadonlySet<A>) => Separated<ReadonlySet<A>, ReadonlySet<B>>
export declare function partition<A>(
  predicate: Predicate<A>
): <B extends A>(set: ReadonlySet<B>) => Separated<ReadonlySet<B>, ReadonlySet<B>>
export declare function partition<A>(
  predicate: Predicate<A>
): (set: ReadonlySet<A>) => Separated<ReadonlySet<A>, ReadonlySet<A>>
/**
 * Form the union of two sets
 *
 * @since 2.5.0
 */
export declare function union<A>(E: Eq<A>): {
  (that: ReadonlySet<A>): (me: ReadonlySet<A>) => ReadonlySet<A>
  (me: ReadonlySet<A>, that: ReadonlySet<A>): ReadonlySet<A>
}
/**
 * The set of elements which are in both the first and second set
 *
 * @since 2.5.0
 */
export declare function intersection<A>(E: Eq<A>): {
  (that: ReadonlySet<A>): (me: ReadonlySet<A>) => ReadonlySet<A>
  (me: ReadonlySet<A>, that: ReadonlySet<A>): ReadonlySet<A>
}
/**
 * @since 2.5.0
 */
export declare function partitionMap<B, C>(
  EB: Eq<B>,
  EC: Eq<C>
): <A>(f: (a: A) => Either<B, C>) => (set: ReadonlySet<A>) => Separated<ReadonlySet<B>, ReadonlySet<C>>
/**
 * Form the set difference (`x` - `y`)
 *
 * @example
 * import { difference } from 'fp-ts/ReadonlySet'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(new Set([1, 2]), difference(N.Eq)(new Set([1, 3]))), new Set([2]))
 *
 * @since 2.5.0
 */
export declare function difference<A>(E: Eq<A>): {
  (that: ReadonlySet<A>): (me: ReadonlySet<A>) => ReadonlySet<A>
  (me: ReadonlySet<A>, that: ReadonlySet<A>): ReadonlySet<A>
}
/**
 * @since 2.5.0
 */
export declare function reduce<A>(O: Ord<A>): <B>(b: B, f: (b: B, a: A) => B) => (fa: ReadonlySet<A>) => B
/**
 * @since 2.5.0
 */
export declare function foldMap<A, M>(O: Ord<A>, M: Monoid<M>): (f: (a: A) => M) => (fa: ReadonlySet<A>) => M
/**
 * @category folding
 * @since 2.11.0
 */
export declare const reduceRight: <A>(O: Ord<A>) => <B>(b: B, f: (a: A, b: B) => B) => (fa: ReadonlySet<A>) => B
/**
 * Insert a value into a set
 *
 * @since 2.5.0
 */
export declare function insert<A>(E: Eq<A>): (a: A) => (set: ReadonlySet<A>) => ReadonlySet<A>
/**
 * Delete a value from a set
 *
 * @since 2.5.0
 */
export declare const remove: <A>(E: Eq<A>) => (a: A) => (set: ReadonlySet<A>) => ReadonlySet<A>
/**
 * Checks an element is a member of a set;
 * If yes, removes the value from the set
 * If no, inserts the value to the set
 *
 * @since 2.10.0
 */
export declare const toggle: <A>(E: Eq<A>) => (a: A) => (set: ReadonlySet<A>) => ReadonlySet<A>
/**
 * @since 2.5.0
 */
export declare const compact: <A>(E: Eq<A>) => (fa: ReadonlySet<Option<A>>) => ReadonlySet<A>
/**
 * @since 2.5.0
 */
export declare function separate<E, A>(
  EE: Eq<E>,
  EA: Eq<A>
): (fa: ReadonlySet<Either<E, A>>) => Separated<ReadonlySet<E>, ReadonlySet<A>>
/**
 * @since 2.5.0
 */
export declare function filterMap<B>(E: Eq<B>): <A>(f: (a: A) => Option<B>) => (fa: ReadonlySet<A>) => ReadonlySet<B>
/**
 * @since 2.5.0
 */
export declare const empty: ReadonlySet<never>
/**
 * Test whether a `ReadonlySet` is empty.
 *
 * @since 2.10.0
 */
export declare const isEmpty: <A>(set: ReadonlySet<A>) => boolean
/**
 * Calculate the number of elements in a `ReadonlySet`.
 *
 * @since 2.10.0
 */
export declare const size: <A>(set: ReadonlySet<A>) => number
/**
 * @since 2.5.0
 */
export declare const some: <A>(predicate: Predicate<A>) => (set: ReadonlySet<A>) => boolean
/**
 * @since 2.5.0
 */
export declare function every<A, B extends A>(refinement: Refinement<A, B>): Refinement<ReadonlySet<A>, ReadonlySet<B>>
export declare function every<A>(predicate: Predicate<A>): Predicate<ReadonlySet<A>>
/**
 * `true` if and only if every element in the first set is an element of the second set
 *
 * @since 2.5.0
 */
export declare function isSubset<A>(E: Eq<A>): {
  (that: ReadonlySet<A>): (me: ReadonlySet<A>) => boolean
  (me: ReadonlySet<A>, that: ReadonlySet<A>): boolean
}
/**
 * Test if a value is a member of a set
 *
 * @since 2.5.0
 */
export declare function elem<A>(E: Eq<A>): {
  (a: A): (set: ReadonlySet<A>) => boolean
  (a: A, set: ReadonlySet<A>): boolean
}
/**
 * Get a sorted `ReadonlyArray` of the values contained in a `ReadonlySet`.
 *
 * @category conversions
 * @since 2.5.0
 */
export declare const toReadonlyArray: <A>(O: Ord<A>) => (set: ReadonlySet<A>) => ReadonlyArray<A>
/**
 * @category type lambdas
 * @since 2.11.0
 */
export declare const URI = 'ReadonlySet'
/**
 * @category type lambdas
 * @since 2.11.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: ReadonlySet<A>
  }
}
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getShow<A>(S: Show<A>): Show<ReadonlySet<A>>
/**
 * @category instances
 * @since 2.5.0
 */
export declare function getEq<A>(E: Eq<A>): Eq<ReadonlySet<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getUnionSemigroup: <A>(E: Eq<A>) => Semigroup<ReadonlySet<A>>
/**
 * @category instances
 * @since 2.5.0
 */
export declare const getUnionMonoid: <A>(E: Eq<A>) => Monoid<ReadonlySet<A>>
/**
 * @category instances
 * @since 2.5.0
 */
export declare const getIntersectionSemigroup: <A>(E: Eq<A>) => Semigroup<ReadonlySet<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getDifferenceMagma: <A>(E: Eq<A>) => Magma<ReadonlySet<A>>
/**
 * Use [`fromReadonlyArray`](#fromreadonlyarray) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const fromArray: <A>(E: Eq<A>) => (as: ReadonlyArray<A>) => ReadonlySet<A>
