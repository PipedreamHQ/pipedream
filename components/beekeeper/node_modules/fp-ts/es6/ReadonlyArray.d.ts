/**
 * @since 2.5.0
 */
import { Alt1 } from './Alt'
import { Alternative1 } from './Alternative'
import { Applicative1 } from './Applicative'
import { Apply1 } from './Apply'
import { Chain1 } from './Chain'
import { ChainRec1 } from './ChainRec'
import { Compactable1 } from './Compactable'
import { Either } from './Either'
import { Eq } from './Eq'
import { Extend1 } from './Extend'
import { Filterable1 } from './Filterable'
import { FilterableWithIndex1, PredicateWithIndex, RefinementWithIndex } from './FilterableWithIndex'
import { Foldable1 } from './Foldable'
import { FoldableWithIndex1 } from './FoldableWithIndex'
import { FromEither1 } from './FromEither'
import { LazyArg } from './function'
import { Functor1 } from './Functor'
import { FunctorWithIndex1 } from './FunctorWithIndex'
import { Magma } from './Magma'
import { Monad1 } from './Monad'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Ord } from './Ord'
import { Pointed1 } from './Pointed'
import { Predicate } from './Predicate'
import * as RNEA from './ReadonlyNonEmptyArray'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import { Separated } from './Separated'
import { Show } from './Show'
import { PipeableTraverse1, Traversable1 } from './Traversable'
import { PipeableTraverseWithIndex1, TraversableWithIndex1 } from './TraversableWithIndex'
import { Unfoldable1 } from './Unfoldable'
import { PipeableWilt1, PipeableWither1, Witherable1 } from './Witherable'
import { Zero1 } from './Zero'
import ReadonlyNonEmptyArray = RNEA.ReadonlyNonEmptyArray
/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @example
 * import { isEmpty } from 'fp-ts/ReadonlyArray'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @category refinements
 * @since 2.5.0
 */
export declare const isEmpty: <A>(as: ReadonlyArray<A>) => as is readonly []
/**
 * Test whether a `ReadonlyArray` is non empty.
 *
 * @category refinements
 * @since 2.5.0
 */
export declare const isNonEmpty: <A>(as: ReadonlyArray<A>) => as is ReadonlyNonEmptyArray<A>
/**
 * Prepend an element to the front of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
export declare const prepend: <A>(head: A) => (tail: ReadonlyArray<A>) => ReadonlyNonEmptyArray<A>
/**
 * Less strict version of [`prepend`](#prepend).
 *
 * @since 2.11.0
 */
export declare const prependW: <B>(head: B) => <A>(tail: ReadonlyArray<A>) => ReadonlyNonEmptyArray<A | B>
/**
 * Append an element to the end of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
export declare const append: <A>(end: A) => (init: ReadonlyArray<A>) => ReadonlyNonEmptyArray<A>
/**
 * Less strict version of [`append`](#append).
 *
 * @since 2.11.0
 */
export declare const appendW: <B>(end: B) => <A>(init: ReadonlyArray<A>) => ReadonlyNonEmptyArray<A | B>
/**
 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyArray'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.5.0
 */
export declare const makeBy: <A>(n: number, f: (i: number) => A) => ReadonlyArray<A>
/**
 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.5.0
 */
export declare const replicate: <A>(n: number, a: A) => ReadonlyArray<A>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare function fromPredicate<A, B extends A>(refinement: Refinement<A, B>): (a: A) => ReadonlyArray<B>
export declare function fromPredicate<A>(predicate: Predicate<A>): <B extends A>(b: B) => ReadonlyArray<B>
export declare function fromPredicate<A>(predicate: Predicate<A>): (a: A) => ReadonlyArray<A>
/**
 * @category conversions
 * @since 2.11.0
 */
export declare const fromOption: <A>(fa: Option<A>) => ReadonlyArray<A>
/**
 * Transforms an `Either` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.11.0
 */
export declare const fromEither: <A>(fa: Either<unknown, A>) => ReadonlyArray<A>
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export declare const matchW: <B, A, C>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (as: ReadonlyNonEmptyArray<A>) => C
) => (as: ReadonlyArray<A>) => B | C
/**
 * @category pattern matching
 * @since 2.11.0
 */
export declare const match: <B, A>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (as: ReadonlyNonEmptyArray<A>) => B
) => (as: ReadonlyArray<A>) => B
/**
 * Less strict version of [`matchLeft`](#matchleft).
 *
 * @category pattern matching
 * @since 2.11.0
 */
export declare const matchLeftW: <B, A, C>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (head: A, tail: ReadonlyArray<A>) => C
) => (as: ReadonlyArray<A>) => B | C
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @example
 * import { matchLeft } from 'fp-ts/ReadonlyArray'
 *
 * const len: <A>(as: ReadonlyArray<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchLeft: <B, A>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (head: A, tail: ReadonlyArray<A>) => B
) => (as: ReadonlyArray<A>) => B
/**
 * Alias of [`matchLeft`](#matchleft).
 *
 * @category pattern matching
 * @since 2.5.0
 */
export declare const foldLeft: <A, B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (head: A, tail: ReadonlyArray<A>) => B
) => (as: ReadonlyArray<A>) => B
/**
 * Less strict version of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.11.0
 */
export declare const matchRightW: <B, A, C>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (init: ReadonlyArray<A>, last: A) => C
) => (as: ReadonlyArray<A>) => B | C
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchRight: <B, A>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (init: ReadonlyArray<A>, last: A) => B
) => (as: ReadonlyArray<A>) => B
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.5.0
 */
export declare const foldRight: <A, B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (init: ReadonlyArray<A>, last: A) => B
) => (as: ReadonlyArray<A>) => B
/**
 * @category sequencing
 * @since 2.7.0
 */
export declare const chainWithIndex: <A, B>(
  f: (i: number, a: A) => ReadonlyArray<B>
) => (as: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * Same as `reduce` but it carries over the intermediate steps.
 *
 * @example
 * import { scanLeft } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @since 2.5.0
 */
export declare const scanLeft: <A, B>(b: B, f: (b: B, a: A) => B) => (as: ReadonlyArray<A>) => ReadonlyNonEmptyArray<B>
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @since 2.5.0
 */
export declare const scanRight: <A, B>(b: B, f: (a: A, b: B) => B) => (as: ReadonlyArray<A>) => ReadonlyNonEmptyArray<B>
/**
 * Calculate the number of elements in a `ReadonlyArray`.
 *
 * @since 2.10.0
 */
export declare const size: <A>(as: ReadonlyArray<A>) => number
/**
 * Test whether an array contains a particular index
 *
 * @since 2.5.0
 */
export declare const isOutOfBound: <A>(i: number, as: ReadonlyArray<A>) => boolean
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { lookup } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(1)), some(2))
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(3)), none)
 *
 * @since 2.5.0
 */
export declare function lookup(i: number): <A>(as: ReadonlyArray<A>) => Option<A>
export declare function lookup<A>(i: number, as: ReadonlyArray<A>): Option<A>
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.5.0
 */
export declare const head: <A>(as: ReadonlyArray<A>) => Option<A>
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.5.0
 */
export declare const last: <A>(as: ReadonlyArray<A>) => Option<A>
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 2.5.0
 */
export declare const tail: <A>(as: ReadonlyArray<A>) => Option<ReadonlyArray<A>>
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 2.5.0
 */
export declare const init: <A>(as: ReadonlyArray<A>) => Option<ReadonlyArray<A>>
/**
 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeLeft(2)), [1, 2])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeLeft(4)), input)
 * assert.strictEqual(pipe(input, RA.takeLeft(-1)), input)
 *
 * @since 2.5.0
 */
export declare const takeLeft: (n: number) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeRight(2)), [2, 3])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeRight(4)), input)
 * assert.strictEqual(pipe(input, RA.takeRight(-1)), input)
 *
 * @since 2.5.0
 */
export declare const takeRight: (n: number) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { takeLeftWhile } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(takeLeftWhile((n: number) => n % 2 === 0)([2, 4, 3, 6]), [2, 4])
 *
 * @since 2.5.0
 */
export declare function takeLeftWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => ReadonlyArray<B>
export declare function takeLeftWhile<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
export declare function takeLeftWhile<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * @since 2.5.0
 */
export interface Spanned<I, R> {
  readonly init: ReadonlyArray<I>
  readonly rest: ReadonlyArray<R>
}
/**
 * Split an array into two parts:
 * 1. the longest initial subarray for which all elements satisfy the specified predicate
 * 2. the remaining elements
 *
 * @example
 * import { spanLeft } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(spanLeft((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]), { init: [1, 3], rest: [2, 4, 5] })
 *
 * @since 2.5.0
 */
export declare function spanLeft<A, B extends A>(refinement: Refinement<A, B>): (as: ReadonlyArray<A>) => Spanned<B, A>
export declare function spanLeft<A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => Spanned<B, B>
export declare function spanLeft<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Spanned<A, A>
/**
 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropLeft(2)), [3])
 * assert.strictEqual(pipe(input, RA.dropLeft(0)), input)
 * assert.strictEqual(pipe(input, RA.dropLeft(-1)), input)
 *
 * @since 2.5.0
 */
export declare const dropLeft: (n: number) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropRight(2)), [1])
 * assert.strictEqual(pipe(input, RA.dropRight(0)), input)
 * assert.strictEqual(pipe(input, RA.dropRight(-1)), input)
 *
 * @since 2.5.0
 */
export declare const dropRight: (n: number) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { dropLeftWhile } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(dropLeftWhile((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]), [2, 4, 5])
 *
 * @since 2.5.0
 */
export declare function dropLeftWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => ReadonlyArray<B>
export declare function dropLeftWhile<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
export declare function dropLeftWhile<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.5.0
 */
export declare const findIndex: <A>(predicate: Predicate<A>) => (as: ReadonlyArray<A>) => Option<number>
/**
 * Find the first element which satisfies a predicate (or a refinement) function
 *
 * @example
 * import { findFirst } from 'fp-ts/ReadonlyArray'
 * import { some } from 'fp-ts/Option'
 *
 * type X = {
 *   readonly a: number
 *   readonly b: number
 * }
 *
 * assert.deepStrictEqual(findFirst((x: X) => x.a === 1)([{ a: 1, b: 1 }, { a: 1, b: 2 }]), some({ a: 1, b: 1 }))
 *
 * @since 2.5.0
 */
export declare function findFirst<A, B extends A>(refinement: Refinement<A, B>): (as: ReadonlyArray<A>) => Option<B>
export declare function findFirst<A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => Option<B>
export declare function findFirst<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A>
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 2.5.0
 */
export declare const findFirstMap: <A, B>(f: (a: A) => Option<B>) => (as: ReadonlyArray<A>) => Option<B>
/**
 * Find the last element which satisfies a predicate function
 *
 * @example
 * import { findLast } from 'fp-ts/ReadonlyArray'
 * import { some } from 'fp-ts/Option'
 *
 * type X = {
 *   readonly a: number
 *   readonly b: number
 * }
 *
 * assert.deepStrictEqual(findLast((x: X) => x.a === 1)([{ a: 1, b: 1 }, { a: 1, b: 2 }]), some({ a: 1, b: 2 }))
 *
 * @since 2.5.0
 */
export declare function findLast<A, B extends A>(refinement: Refinement<A, B>): (as: ReadonlyArray<A>) => Option<B>
export declare function findLast<A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => Option<B>
export declare function findLast<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A>
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 2.5.0
 */
export declare const findLastMap: <A, B>(f: (a: A) => Option<B>) => (as: ReadonlyArray<A>) => Option<B>
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.5.0
 */
export declare const findLastIndex: <A>(predicate: Predicate<A>) => (as: ReadonlyArray<A>) => Option<number>
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/ReadonlyArray'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.5.0
 */
export declare const insertAt: <A>(i: number, a: A) => (as: ReadonlyArray<A>) => Option<ReadonlyNonEmptyArray<A>>
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.5.0
 */
export declare const updateAt: <A>(i: number, a: A) => (as: ReadonlyArray<A>) => Option<ReadonlyArray<A>>
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.5.0
 */
export declare const deleteAt: (i: number) => <A>(as: ReadonlyArray<A>) => Option<ReadonlyArray<A>>
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.5.0
 */
export declare const modifyAt: <A>(i: number, f: (a: A) => A) => (as: ReadonlyArray<A>) => Option<ReadonlyArray<A>>
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @since 2.5.0
 */
export declare const reverse: <A>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/ReadonlyArray'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @since 2.5.0
 */
export declare const rights: <E, A>(as: ReadonlyArray<Either<E, A>>) => ReadonlyArray<A>
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/ReadonlyArray'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @since 2.5.0
 */
export declare const lefts: <E, A>(as: ReadonlyArray<Either<E, A>>) => ReadonlyArray<E>
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @since 2.5.0
 */
export declare const sort: <B>(O: Ord<B>) => <A extends B>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @since 2.5.0
 */
export declare const zipWith: <A, B, C>(
  fa: ReadonlyArray<A>,
  fb: ReadonlyArray<B>,
  f: (a: A, b: B) => C
) => ReadonlyArray<C>
/**
 * Takes two arrays and returns an array of corresponding pairs. If one input array is short, excess elements of the
 * longer array are discarded
 *
 * @example
 * import { zip } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], zip(['a', 'b', 'c', 'd'])), [[1, 'a'], [2, 'b'], [3, 'c']])
 *
 * @since 2.5.0
 */
export declare function zip<B>(bs: ReadonlyArray<B>): <A>(as: ReadonlyArray<A>) => ReadonlyArray<readonly [A, B]>
export declare function zip<A, B>(as: ReadonlyArray<A>, bs: ReadonlyArray<B>): ReadonlyArray<readonly [A, B]>
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.5.0
 */
export declare const unzip: <A, B>(as: ReadonlyArray<readonly [A, B]>) => readonly [ReadonlyArray<A>, ReadonlyArray<B>]
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
export declare const prependAll: <A>(middle: A) => (as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export declare const intersperse: <A>(middle: A) => (as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Rotate a `ReadonlyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @since 2.5.0
 */
export declare const rotate: (n: number) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Test if a value is a member of an array. Takes a `Eq<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `ReadonlyArray<A>`.
 *
 * @example
 * import { elem } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(2)), true)
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(0)), false)
 *
 * @since 2.5.0
 */
export declare function elem<A>(E: Eq<A>): {
  (a: A): (as: ReadonlyArray<A>) => boolean
  (a: A, as: ReadonlyArray<A>): boolean
}
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.5.0
 */
export declare const uniq: <A>(E: Eq<A>) => (as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/ReadonlyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.5.0
 */
export declare const sortBy: <B>(ords: ReadonlyArray<Ord<B>>) => <A extends B>(as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
 * `ReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
 * value and the tail of the `ReadonlyArray`.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>) => {
 *   return RA.chop(as => {
 *     const { init, rest } = pipe(as, RA.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @since 2.5.0
 */
export declare const chop: <A, B>(
  f: (as: ReadonlyNonEmptyArray<A>) => readonly [B, ReadonlyArray<A>]
) => (as: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @since 2.5.0
 */
export declare const splitAt: (n: number) => <A>(as: ReadonlyArray<A>) => readonly [ReadonlyArray<A>, ReadonlyArray<A>]
/**
 * Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that:
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `as`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @since 2.5.0
 */
export declare const chunksOf: (n: number) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyNonEmptyArray<A>>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromOptionK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => (...a: A) => ReadonlyArray<B>
/**
 * `ReadonlyArray` comprehension.
 *
 * ```
 * [ f(x, y, ...) | x ← xs, y ← ys, ..., g(x, y, ...) ]
 * ```
 *
 * @example
 * import { comprehension } from 'fp-ts/ReadonlyArray'
 * import { tuple } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(comprehension([[1, 2, 3], ['a', 'b']], tuple, (a, b) => (a + b.length) % 2 === 0), [
 *   [1, 'a'],
 *   [1, 'b'],
 *   [3, 'a'],
 *   [3, 'b']
 * ])
 *
 * @since 2.5.0
 */
export declare function comprehension<A, B, C, D, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>, ReadonlyArray<C>, ReadonlyArray<D>],
  f: (a: A, b: B, c: C, d: D) => R,
  g?: (a: A, b: B, c: C, d: D) => boolean
): ReadonlyArray<R>
export declare function comprehension<A, B, C, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>, ReadonlyArray<C>],
  f: (a: A, b: B, c: C) => R,
  g?: (a: A, b: B, c: C) => boolean
): ReadonlyArray<R>
export declare function comprehension<A, B, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>],
  f: (a: A, b: B) => R,
  g?: (a: A, b: B) => boolean
): ReadonlyArray<R>
export declare function comprehension<A, R>(
  input: readonly [ReadonlyArray<A>],
  f: (a: A) => R,
  g?: (a: A) => boolean
): ReadonlyArray<R>
/**
 * @since 2.11.0
 */
export declare const concatW: <B>(second: ReadonlyArray<B>) => <A>(first: ReadonlyArray<A>) => ReadonlyArray<A | B>
/**
 * @since 2.11.0
 */
export declare const concat: <A>(second: ReadonlyArray<A>) => (first: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * Creates an array of unique values, in order, from all given arrays using a `Eq` for equality comparisons
 *
 * @example
 * import { union } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2], union(N.Eq)([2, 3])), [1, 2, 3])
 *
 * @since 2.5.0
 */
export declare function union<A>(E: Eq<A>): {
  (xs: ReadonlyArray<A>): (ys: ReadonlyArray<A>) => ReadonlyArray<A>
  (xs: ReadonlyArray<A>, ys: ReadonlyArray<A>): ReadonlyArray<A>
}
/**
 * Creates an array of unique values that are included in all given arrays using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { intersection } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2], intersection(N.Eq)([2, 3])), [2])
 *
 * @since 2.5.0
 */
export declare function intersection<A>(E: Eq<A>): {
  (xs: ReadonlyArray<A>): (ys: ReadonlyArray<A>) => ReadonlyArray<A>
  (xs: ReadonlyArray<A>, ys: ReadonlyArray<A>): ReadonlyArray<A>
}
/**
 * Creates an array of array values not included in the other given array using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { difference } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2], difference(N.Eq)([2, 3])), [1])
 *
 * @since 2.5.0
 */
export declare function difference<A>(E: Eq<A>): {
  (xs: ReadonlyArray<A>): (ys: ReadonlyArray<A>) => ReadonlyArray<A>
  (xs: ReadonlyArray<A>, ys: ReadonlyArray<A>): ReadonlyArray<A>
}
/**
 * @category constructors
 * @since 2.5.0
 */
export declare const of: <A>(a: A) => ReadonlyArray<A>
/**
 * @since 2.7.0
 */
export declare const zero: <A>() => ReadonlyArray<A>
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
export declare const altW: <B>(that: LazyArg<ReadonlyArray<B>>) => <A>(fa: ReadonlyArray<A>) => ReadonlyArray<A | B>
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `ReadonlyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.5.0
 */
export declare const alt: <A>(that: LazyArg<ReadonlyArray<A>>) => (fa: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * @since 2.5.0
 */
export declare const ap: <A>(fa: ReadonlyArray<A>) => <B>(fab: ReadonlyArray<(a: A) => B>) => ReadonlyArray<B>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
export declare const flatMap: {
  <A, B>(f: (a: A, i: number) => ReadonlyArray<B>): (ma: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(ma: ReadonlyArray<A>, f: (a: A, i: number) => ReadonlyArray<B>): ReadonlyArray<B>
}
/**
 * @category sequencing
 * @since 2.5.0
 */
export declare const flatten: <A>(mma: ReadonlyArray<ReadonlyArray<A>>) => ReadonlyArray<A>
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.5.0
 */
export declare const map: <A, B>(f: (a: A) => B) => (fa: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * @category mapping
 * @since 2.5.0
 */
export declare const mapWithIndex: <A, B>(f: (i: number, a: A) => B) => (fa: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const separate: <A, B>(fa: ReadonlyArray<Either<A, B>>) => Separated<ReadonlyArray<A>, ReadonlyArray<B>>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (as: ReadonlyArray<A>) => ReadonlyArray<B>
  <A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
  <A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => ReadonlyArray<A>
}
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const filterMapWithIndex: <A, B>(
  f: (i: number, a: A) => Option<B>
) => (fa: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const compact: <A>(fa: ReadonlyArray<Option<A>>) => ReadonlyArray<A>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    as: ReadonlyArray<A>
  ) => Separated<ReadonlyArray<A>, ReadonlyArray<B>>
  <A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => Separated<ReadonlyArray<B>, ReadonlyArray<B>>
  <A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Separated<ReadonlyArray<A>, ReadonlyArray<A>>
}
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const partitionWithIndex: {
  <A, B extends A>(refinementWithIndex: RefinementWithIndex<number, A, B>): (
    as: ReadonlyArray<A>
  ) => Separated<ReadonlyArray<A>, ReadonlyArray<B>>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): <B extends A>(
    bs: ReadonlyArray<B>
  ) => Separated<ReadonlyArray<B>, ReadonlyArray<B>>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): (
    as: ReadonlyArray<A>
  ) => Separated<ReadonlyArray<A>, ReadonlyArray<A>>
}
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: ReadonlyArray<A>) => Separated<ReadonlyArray<B>, ReadonlyArray<C>>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const partitionMapWithIndex: <A, B, C>(
  f: (i: number, a: A) => Either<B, C>
) => (fa: ReadonlyArray<A>) => Separated<ReadonlyArray<B>, ReadonlyArray<C>>
/**
 * @category filtering
 * @since 2.5.0
 */
export declare const filterWithIndex: {
  <A, B extends A>(refinementWithIndex: RefinementWithIndex<number, A, B>): (as: ReadonlyArray<A>) => ReadonlyArray<B>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
  <A>(predicateWithIndex: PredicateWithIndex<number, A>): (as: ReadonlyArray<A>) => ReadonlyArray<A>
}
/**
 * @since 2.5.0
 */
export declare const extend: <A, B>(f: (fa: ReadonlyArray<A>) => B) => (wa: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * @since 2.5.0
 */
export declare const duplicate: <A>(wa: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>
/**
 * @category folding
 * @since 2.5.0
 */
export declare const foldMapWithIndex: <M>(
  M: Monoid<M>
) => <A>(f: (i: number, a: A) => M) => (fa: ReadonlyArray<A>) => M
/**
 * @category folding
 * @since 2.5.0
 */
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: ReadonlyArray<A>) => B
/**
 * @category folding
 * @since 2.5.0
 */
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: ReadonlyArray<A>) => M
/**
 * @category folding
 * @since 2.5.0
 */
export declare const reduceWithIndex: <A, B>(b: B, f: (i: number, b: B, a: A) => B) => (fa: ReadonlyArray<A>) => B
/**
 * @category folding
 * @since 2.5.0
 */
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: ReadonlyArray<A>) => B
/**
 * @category folding
 * @since 2.5.0
 */
export declare const reduceRightWithIndex: <A, B>(b: B, f: (i: number, a: A, b: B) => B) => (fa: ReadonlyArray<A>) => B
/**
 * @category traversing
 * @since 2.6.3
 */
export declare const traverse: PipeableTraverse1<URI>
/**
 * @category traversing
 * @since 2.6.3
 */
export declare const sequence: Traversable1<URI>['sequence']
/**
 * @category sequencing
 * @since 2.6.3
 */
export declare const traverseWithIndex: PipeableTraverseWithIndex1<URI, number>
/**
 * @category filtering
 * @since 2.6.5
 */
export declare const wither: PipeableWither1<URI>
/**
 * @category filtering
 * @since 2.6.5
 */
export declare const wilt: PipeableWilt1<URI>
/**
 * @since 2.6.6
 */
export declare const unfold: <A, B>(b: B, f: (b: B) => Option<readonly [A, B]>) => ReadonlyArray<A>
/**
 * @category type lambdas
 * @since 2.5.0
 */
export declare const URI = 'ReadonlyArray'
/**
 * @category type lambdas
 * @since 2.5.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: ReadonlyArray<A>
  }
}
/**
 * @category instances
 * @since 2.5.0
 */
export declare const getShow: <A>(S: Show<A>) => Show<ReadonlyArray<A>>
/**
 * @category instances
 * @since 2.5.0
 */
export declare const getSemigroup: <A = never>() => Semigroup<ReadonlyArray<A>>
/**
 * Returns a `Monoid` for `ReadonlyArray<A>`.
 *
 * @example
 * import { getMonoid } from 'fp-ts/ReadonlyArray'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.5.0
 */
export declare const getMonoid: <A = never>() => Monoid<ReadonlyArray<A>>
/**
 * Derives an `Eq` over the `ReadonlyArray` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/ReadonlyArray'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.5.0
 */
export declare const getEq: <A>(E: Eq<A>) => Eq<ReadonlyArray<A>>
/**
 * Derives an `Ord` over the `ReadonlyArray` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 *
 * @category instances
 * @since 2.5.0
 */
export declare const getOrd: <A>(O: Ord<A>) => Ord<ReadonlyArray<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getUnionSemigroup: <A>(E: Eq<A>) => Semigroup<ReadonlyArray<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getUnionMonoid: <A>(E: Eq<A>) => Monoid<ReadonlyArray<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getIntersectionSemigroup: <A>(E: Eq<A>) => Semigroup<ReadonlyArray<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getDifferenceMagma: <A>(E: Eq<A>) => Magma<ReadonlyArray<A>>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor1<URI>
/**
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(
  a: A
) => <B>(fab: import('./HKT').Kind<'ReadonlyArray', (a: A) => B>) => import('./HKT').Kind<'ReadonlyArray', B>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Pointed: Pointed1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const FunctorWithIndex: FunctorWithIndex1<URI, number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Apply: Apply1<URI>
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.5.0
 */
export declare const apFirst: <B>(
  second: readonly B[]
) => <A>(first: import('./HKT').Kind<'ReadonlyArray', A>) => import('./HKT').Kind<'ReadonlyArray', A>
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.5.0
 */
export declare const apSecond: <B>(
  second: readonly B[]
) => <A>(first: import('./HKT').Kind<'ReadonlyArray', A>) => import('./HKT').Kind<'ReadonlyArray', B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Applicative: Applicative1<URI>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Chain: Chain1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Monad: Monad1<URI>
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.chainFirst(() => ['a', 'b'])
 *   ),
 *   [1, 1, 2, 2, 3, 3]
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.chainFirst(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.5.0
 */
export declare const chainFirst: <A, B>(f: (a: A) => ReadonlyArray<B>) => (first: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Unfoldable: Unfoldable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alt: Alt1<URI>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const Zero: Zero1<URI>
/**
 * @category do notation
 * @since 2.11.0
 */
export declare const guard: (b: boolean) => import('./HKT').Kind<'ReadonlyArray', void>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Alternative: Alternative1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Extend: Extend1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Compactable: Compactable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Filterable: Filterable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const FilterableWithIndex: FilterableWithIndex1<URI, number>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Foldable: Foldable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const FoldableWithIndex: FoldableWithIndex1<URI, number>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Traversable: Traversable1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const TraversableWithIndex: TraversableWithIndex1<URI, number>
/**
 * @category sequencing
 * @since 2.11.0
 */
export declare const chainRecDepthFirst: <A, B>(f: (a: A) => ReadonlyArray<Either<A, B>>) => (a: A) => ReadonlyArray<B>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const ChainRecDepthFirst: ChainRec1<URI>
/**
 * @category sequencing
 * @since 2.11.0
 */
export declare const chainRecBreadthFirst: <A, B>(
  f: (a: A) => ReadonlyArray<Either<A, B>>
) => (a: A) => ReadonlyArray<B>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const ChainRecBreadthFirst: ChainRec1<URI>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Witherable: Witherable1<URI>
/**
 * Filter values inside a context.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as T from 'fp-ts/Task'
 *
 * const filterE = RA.filterE(T.ApplicativePar)
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       [-1, 2, 3],
 *       filterE((n) => T.of(n > 0))
 *     )(),
 *     [2, 3]
 *   )
 * }
 * test()
 *
 * @since 2.11.0
 */
export declare const filterE: import('./Witherable').FilterE1<'ReadonlyArray'>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const FromEither: FromEither1<URI>
/**
 * @category lifting
 * @since 2.11.0
 */
export declare const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => ReadonlyArray<B>
/**
 * @category unsafe
 * @since 2.5.0
 */
export declare const unsafeInsertAt: <A>(i: number, a: A, as: ReadonlyArray<A>) => ReadonlyNonEmptyArray<A>
/**
 * @category unsafe
 * @since 2.5.0
 */
export declare const unsafeUpdateAt: <A>(i: number, a: A, as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * @category unsafe
 * @since 2.5.0
 */
export declare const unsafeDeleteAt: <A>(i: number, as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * @category conversions
 * @since 2.5.0
 */
export declare const toArray: <A>(as: ReadonlyArray<A>) => Array<A>
/**
 * @category conversions
 * @since 2.5.0
 */
export declare const fromArray: <A>(as: Array<A>) => ReadonlyArray<A>
/**
 * An empty array
 *
 * @since 2.5.0
 */
export declare const empty: ReadonlyArray<never>
/**
 * Check if a predicate holds true for every array member.
 *
 * @example
 * import { every } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], every(isPositive)), true)
 * assert.deepStrictEqual(pipe([1, 2, -3], every(isPositive)), false)
 *
 * @since 2.9.0
 */
export declare function every<A, B extends A>(
  refinement: Refinement<A, B>
): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
export declare function every<A>(predicate: Predicate<A>): Predicate<ReadonlyArray<A>>
/**
 * Check if a predicate holds true for any array member.
 *
 * @example
 * import { some } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([-1, -2, 3], some(isPositive)), true)
 * assert.deepStrictEqual(pipe([-1, -2, -3], some(isPositive)), false)
 *
 * @since 2.9.0
 */
export declare const some: <A>(predicate: Predicate<A>) => (as: ReadonlyArray<A>) => as is ReadonlyNonEmptyArray<A>
/**
 * Alias of [`some`](#some)
 *
 * @since 2.11.0
 */
export declare const exists: <A>(
  predicate: Predicate<A>
) => (as: ReadonlyArray<A>) => as is RNEA.ReadonlyNonEmptyArray<A>
/**
 * Places an element in between members of a `ReadonlyArray`, then folds the results using the provided `Monoid`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
export declare const intercalate: <A>(M: Monoid<A>) => (middle: A) => (as: ReadonlyArray<A>) => A
/**
 * @category do notation
 * @since 2.9.0
 */
export declare const Do: ReadonlyArray<{}>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bindTo: <N extends string>(
  name: N
) => <A>(
  fa: import('./HKT').Kind<'ReadonlyArray', A>
) => import('./HKT').Kind<'ReadonlyArray', { readonly [K in N]: A }>
declare const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  fa: import('./HKT').Kind<'ReadonlyArray', A>
) => import('./HKT').Kind<'ReadonlyArray', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
export {
  /**
   * @category do notation
   * @since 2.13.0
   */
  let_ as let
}
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => import('./HKT').Kind<'ReadonlyArray', B>
) => (
  ma: import('./HKT').Kind<'ReadonlyArray', A>
) => import('./HKT').Kind<'ReadonlyArray', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * @category do notation
 * @since 2.8.0
 */
export declare const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: readonly B[]
) => (
  fa: import('./HKT').Kind<'ReadonlyArray', A>
) => import('./HKT').Kind<'ReadonlyArray', { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }>
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.5.0
 */
export declare const chain: <A, B>(f: (a: A) => ReadonlyArray<B>) => (ma: ReadonlyArray<A>) => ReadonlyArray<B>
/**
 * Use `ReadonlyNonEmptyArray` module instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const range: (start: number, end: number) => ReadonlyNonEmptyArray<number>
/**
 * Use [`prepend`](#prepend) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const cons: typeof RNEA.cons
/**
 * Use [`append`](#append) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const snoc: <A>(init: ReadonlyArray<A>, end: A) => ReadonlyNonEmptyArray<A>
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export declare const prependToAll: <A>(middle: A) => (as: ReadonlyArray<A>) => ReadonlyArray<A>
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RA.Functor` instead of `RA.readonlyArray`
 * (where `RA` is from `import RA from 'fp-ts/ReadonlyArray'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const readonlyArray: FunctorWithIndex1<URI, number> &
  Monad1<URI> &
  Unfoldable1<URI> &
  Alternative1<URI> &
  Extend1<URI> &
  FilterableWithIndex1<URI, number> &
  FoldableWithIndex1<URI, number> &
  TraversableWithIndex1<URI, number> &
  Witherable1<URI>
