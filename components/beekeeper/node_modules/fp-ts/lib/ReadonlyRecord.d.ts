/**
 * The `ReadonlyRecord.ts` module enables dealing in a functional way with
 * Typescript's `Readonly<Record<K, T>>` type. That is similar to the
 * `Record.ts` module, but for a record with all properties
 * declared as `readonly`.
 *
 * @since 2.5.0
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
import { Compactable1 } from './Compactable'
import { Either } from './Either'
import { Eq } from './Eq'
import { Filterable1 } from './Filterable'
import { FilterableWithIndex1, PredicateWithIndex, RefinementWithIndex } from './FilterableWithIndex'
import { Foldable as FoldableHKT, Foldable1, Foldable2, Foldable3 } from './Foldable'
import { FoldableWithIndex1 } from './FoldableWithIndex'
import { Functor1 } from './Functor'
import { FunctorWithIndex1 } from './FunctorWithIndex'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Magma } from './Magma'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Ord } from './Ord'
import { Predicate } from './Predicate'
import { Refinement } from './Refinement'
import * as Se from './Semigroup'
import { Separated } from './Separated'
import { Show } from './Show'
import { Traversable1 } from './Traversable'
import { TraversableWithIndex1 } from './TraversableWithIndex'
import { Unfoldable, Unfoldable1 } from './Unfoldable'
import { PipeableWilt1, PipeableWither1, Witherable1 } from './Witherable'
import Semigroup = Se.Semigroup
/**
 * @category model
 * @since 2.5.0
 */
export type ReadonlyRecord<K extends string, T> = Readonly<Record<K, T>>
/**
 * Builds a `ReadonlyRecord` by copying a `Record`.
 *
 * @example
 * import { ReadonlyRecord, fromRecord } from "fp-ts/ReadonlyRecord"
 *
 * const x: Record<string, number> = { a: 1, b: 2 };
 * const y: ReadonlyRecord<string, number> = fromRecord(x);
 * assert.deepStrictEqual(x,y);
 * // `y.a = 5` gives compiler error
 *
 * @category conversions
 * @since 2.5.0
 */
export declare const fromRecord: <K extends string, A>(r: Record<K, A>) => ReadonlyRecord<K, A>
/**
 * Builds a mutable `Record` from a `ReadonlyRecord`.
 *
 * @example
 * import { ReadonlyRecord, toRecord } from "fp-ts/ReadonlyRecord"
 *
 * const x: ReadonlyRecord<string, number> = { a: 1, b: 2 };
 * const y: Record<string, number> = toRecord(x);
 * assert.deepStrictEqual(x,y);
 * y.a = 5; // it's ok, y is mutable
 *
 * @category conversions
 * @since 2.5.0
 */
export declare const toRecord: <K extends string, A>(r: ReadonlyRecord<K, A>) => Record<K, A>
/**
 * Calculate the number of key/value pairs in a `ReadonlyRecord`,
 *
 * @example
 * import { size } from "fp-ts/ReadonlyRecord";
 *
 * assert.deepStrictEqual(size({ a: true, b: 2, c: "three" }), 3);
 *
 * @since 2.5.0
 */
export declare const size: <A>(r: ReadonlyRecord<string, A>) => number
/**
 * Test whether a `ReadonlyRecord` is empty.
 *
 * @example
 * import { isEmpty } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(isEmpty({}), true);
 * assert.deepStrictEqual(isEmpty({ a: 3 }), false);
 * @since 2.5.0
 */
export declare const isEmpty: <A>(r: ReadonlyRecord<string, A>) => boolean
/**
 * @since 2.5.0
 */
export declare const keys: <K extends string>(r: ReadonlyRecord<K, unknown>) => ReadonlyArray<K>
/**
 * Map a `ReadonlyRecord` into an `ReadonlyArray`.
 *
 * @example
 * import { collect } from 'fp-ts/ReadonlyRecord'
 * import { Ord } from 'fp-ts/string'
 *
 * const f = <A>(k: string, a: A) => `${k.toUpperCase()}-${a}`;
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(collect(Ord)(f)(x), ["A-foo", "B-false", "C-3"]);
 *
 * @since 2.5.0
 */
export declare function collect(
  O: Ord<string>
): <K extends string, A, B>(f: (k: K, a: A) => B) => (r: ReadonlyRecord<K, A>) => ReadonlyArray<B>
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function collect<K extends string, A, B>(
  f: (k: K, a: A) => B
): (r: ReadonlyRecord<K, A>) => ReadonlyArray<B>
/**
 * Get a sorted `ReadonlyArray` of the key/value pairs contained in a `ReadonlyRecord`.
 *
 * @example
 * import { toReadonlyArray } from 'fp-ts/ReadonlyRecord'
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(toReadonlyArray(x), [
 *   ["a", "foo"],
 *   ["b", false],
 *   ["c", 3],
 * ]);
 *
 * @category conversions
 * @since 2.5.0
 */
export declare const toReadonlyArray: <K extends string, A>(r: ReadonlyRecord<K, A>) => ReadonlyArray<readonly [K, A]>
/**
 * Unfolds a `ReadonlyRecord` into a list of key/value pairs.
 *
 * Given an `Unfoldable` class type `U` such as `array` or `readonlyArray`,
 * it uses the `unfold` function to create an instance of `U`,
 * providing an iterating function that iterates over each
 * key/value pair in the record sorted alphabetically by key.
 *
 * @example
 * import { array, readonlyArray } from 'fp-ts'
 * import { toUnfoldable } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(toUnfoldable(array)({ b: 2, a: 1 }),[ [ 'a', 1 ], [ 'b', 2 ]])
 * assert.deepStrictEqual(toUnfoldable(readonlyArray)({ b: 2, a: 1 }),[ [ 'a', 1 ], [ 'b', 2 ]])
 *
 * @category conversions
 * @since 2.5.0
 */
export declare function toUnfoldable<F extends URIS>(
  U: Unfoldable1<F>
): <K extends string, A>(r: ReadonlyRecord<K, A>) => Kind<F, readonly [K, A]>
export declare function toUnfoldable<F>(
  U: Unfoldable<F>
): <K extends string, A>(r: ReadonlyRecord<K, A>) => HKT<F, readonly [K, A]>
/**
 * Insert or replace a key/value pair in a `ReadonlyRecord`.
 *
 * @example
 * import { upsertAt } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(upsertAt("a", 5)({ a: 1, b: 2 }), { a: 5, b: 2 });
 * assert.deepStrictEqual(upsertAt("c", 5)({ a: 1, b: 2 }), { a: 1, b: 2, c: 5 });
 *
 * @since 2.10.0
 */
export declare const upsertAt: <A>(k: string, a: A) => (r: ReadonlyRecord<string, A>) => ReadonlyRecord<string, A>
/**
 * Test whether or not a key exists in a `ReadonlyRecord`.
 *
 * Note. This function is not pipeable because is a `Refinement`.
 *
 * @example
 * import { has } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(has("a", { a: 1, b: 2 }), true);
 * assert.deepStrictEqual(has("c", { a: 1, b: 2 }), false);
 *
 * @since 2.10.0
 */
export declare const has: <K extends string>(k: string, r: ReadonlyRecord<K, unknown>) => k is K
/**
 * Delete a key and value from a `ReadonlyRecord`.
 *
 * @example
 * import { deleteAt } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(deleteAt("a")({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(deleteAt("c")({ a: 1, b: 2 }), { a: 1, b: 2 });
 *
 * @since 2.5.0
 */
export declare function deleteAt<K extends string>(
  k: K
): <KS extends string, A>(r: ReadonlyRecord<KS, A>) => ReadonlyRecord<string extends K ? string : Exclude<KS, K>, A>
/**
 * Replace a key/value pair in a `ReadonlyRecord`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { updateAt } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(updateAt("a", 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(updateAt("c", 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.5.0
 */
export declare const updateAt: <A>(
  k: string,
  a: A
) => <K extends string>(r: ReadonlyRecord<K, A>) => Option<ReadonlyRecord<K, A>>
/**
 * Applies a mapping function to one specific key/value pair in a `ReadonlyRecord`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { modifyAt } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(modifyAt("a", (x: number) => x * 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(modifyAt("c", (x: number) => x * 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.5.0
 */
export declare const modifyAt: <A>(
  k: string,
  f: (a: A) => A
) => <K extends string>(r: ReadonlyRecord<K, A>) => Option<ReadonlyRecord<K, A>>
/**
 * Delete a key and value from a `ReadonlyRecord`, returning the value as well as the subsequent `ReadonlyRecord`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `ReadonlyRecord`
 * with the entry removed, otherwise it returns `None`
 *
 * @example
 * import { pop } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(pop("a")({ a: 1, b: 2, c: 3 }), option.some([1, { b: 2, c: 3 }]));
 * assert.deepStrictEqual(pop("x")({ a: 1, b: 2, c: 3 }), option.none);
 *
 * @since 2.5.0
 */
export declare function pop<K extends string>(
  k: K
): <KS extends string, A>(
  r: ReadonlyRecord<KS, A>
) => Option<readonly [A, ReadonlyRecord<string extends K ? string : Exclude<KS, K>, A>]>
/**
 * Test whether one `ReadonlyRecord` contains all of the keys and values
 * contained in another `ReadonlyRecord`.
 *
 * @example
 * import { isSubrecord } from 'fp-ts/ReadonlyRecord'
 * import { string } from 'fp-ts'
 *
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar", c: "baz" })({ a: "foo", b: "bar", c: "baz" }),
 *   true
 * );
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar", c: "baz" })({ a: "foo", c: "baz" }),
 *   true
 * );
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar", c: "baz" })({ a: "foo", b: "not-bar", c: "baz" }),
 *   false
 * );
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar" })({ a: "foo", b: "bar", c: "baz" }),
 *   false
 * );
 *
 * @since 2.5.0
 */
export declare function isSubrecord<A>(E: Eq<A>): {
  (that: ReadonlyRecord<string, A>): (me: ReadonlyRecord<string, A>) => boolean
  (me: ReadonlyRecord<string, A>, that: ReadonlyRecord<string, A>): boolean
}
/**
 * Lookup the value for a key in a `ReadonlyRecord`.
 *
 * @returns If the specified key exists it returns an `Option` containing the value,
 * otherwise it returns `None`
 *
 * @example
 * import { lookup } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(lookup("b")({ a: "foo", b: "bar" }), option.some("bar"));
 * assert.deepStrictEqual(lookup("c")({ a: "foo", b: "bar" }), option.none);
 *
 * @since 2.5.0
 */
export declare function lookup(k: string): <A>(r: ReadonlyRecord<string, A>) => Option<A>
export declare function lookup<A>(k: string, r: ReadonlyRecord<string, A>): Option<A>
/**
 * @since 2.5.0
 */
export declare const empty: ReadonlyRecord<string, never>
/**
 * Map a `ReadonlyRecord` passing the keys to the iterating function.
 *
 * @example
 * import { mapWithIndex } from "fp-ts/ReadonlyRecord";
 *
 * const f = (k: string, n: number) => `${k.toUpperCase()}-${n}`;
 * assert.deepStrictEqual(mapWithIndex(f)({ a: 3, b: 5 }), { a: "A-3", b: "B-5" });
 *
 * @since 2.5.0
 */
export declare function mapWithIndex<K extends string, A, B>(
  f: (k: K, a: A) => B
): (fa: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
/**
 * Map a `ReadonlyRecord` passing the values to the iterating function.
 *
 * @example
 * import { map } from "fp-ts/ReadonlyRecord";
 *
 * const f = (n: number) => `-${n}-`;
 * assert.deepStrictEqual(map(f)({ a: 3, b: 5 }), { a: "-3-", b: "-5-" });
 *
 * @since 2.5.0
 */
export declare function map<A, B>(f: (a: A) => B): <K extends string>(fa: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
/**
 * Reduces a `ReadonlyRecord` passing each key/value pair to the iterating function.
 * Entries are processed in the order, sorted by key according to
 * the given `Ord`.
 *
 * @example
 * import { reduceWithIndex } from "fp-ts/ReadonlyRecord";
 * import { Ord } from "fp-ts/string";
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(reduceWithIndex(Ord)([] as string[], (k, b, a) => [...b, `${k}-${a}`])(x), [
 *   "a-foo",
 *   "b-false",
 *   "c-3",
 * ]);
 *
 * @since 2.5.0
 */
export declare function reduceWithIndex(
  O: Ord<string>
): <K extends string, A, B>(b: B, f: (k: K, b: B, a: A) => B) => (fa: ReadonlyRecord<K, A>) => B
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function reduceWithIndex<K extends string, A, B>(
  b: B,
  f: (k: K, b: B, a: A) => B
): (fa: ReadonlyRecord<K, A>) => B
/**
 * Map and fold a `ReadonlyRecord`.
 * Map the `ReadonlyRecord` passing each key/value pair to the iterating function.
 * Then fold the results using the provided `Monoid`.
 *
 * @example
 * import { foldMapWithIndex } from "fp-ts/ReadonlyRecord";
 * import { Ord } from "fp-ts/string";
 * import { Monoid } from "fp-ts/Monoid";
 *
 * const m: Monoid<string> = { empty: "", concat: (x: string, y: string) => (x ? `${x} -> ${y}` : `${y}`) };
 * const f = (k:string, a: number) => `${k}-${a}`
 * const x = { c: 3, a: 1, b: 2 };
 * assert.deepStrictEqual(foldMapWithIndex(Ord)(m)(f)(x), "a-1 -> b-2 -> c-3");
 *
 * @since 2.5.0
 */
export declare function foldMapWithIndex(
  O: Ord<string>
): <M>(M: Monoid<M>) => <K extends string, A>(f: (k: K, a: A) => M) => (fa: ReadonlyRecord<K, A>) => M
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function foldMapWithIndex<M>(
  M: Monoid<M>
): <K extends string, A>(f: (k: K, a: A) => M) => (fa: ReadonlyRecord<K, A>) => M
/**
 * Same as `reduceWithIndex`, but reduce starting from the right
 * (i.e. in reverse order, from the last to the first entry according to
 * the given `Ord`).
 *
 * @example
 * import { reduceRightWithIndex } from "fp-ts/ReadonlyRecord";
 * import { Ord } from "fp-ts/string";
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(reduceRightWithIndex(Ord)([] as string[], (k, a, b) => [...b, `${k}-${a}`])(x), [
 *   "c-3",
 *   "b-false",
 *   "a-foo",
 * ]);
 *
 * @since 2.5.0
 */
export declare function reduceRightWithIndex(
  O: Ord<string>
): <K extends string, A, B>(b: B, f: (k: K, a: A, b: B) => B) => (fa: ReadonlyRecord<K, A>) => B
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function reduceRightWithIndex<K extends string, A, B>(
  b: B,
  f: (k: K, a: A, b: B) => B
): (fa: ReadonlyRecord<K, A>) => B
/**
 * Create a `ReadonlyRecord` with one key/value pair.
 *
 * @example
 * import { singleton } from "fp-ts/ReadonlyRecord";
 *
 * assert.deepStrictEqual(singleton("a", 1), { a: 1 });
 *
 * @category constructors
 * @since 2.5.0
 */
export declare const singleton: <A>(k: string, a: A) => ReadonlyRecord<string, A>
/**
 * @since 2.5.0
 */
export declare function traverseWithIndex<F extends URIS4>(
  F: Applicative4<F>
): <K extends string, S, R, E, A, B>(
  f: (k: K, a: A) => Kind4<F, S, R, E, B>
) => (ta: ReadonlyRecord<K, A>) => Kind4<F, S, R, E, ReadonlyRecord<K, B>>
export declare function traverseWithIndex<F extends URIS3>(
  F: Applicative3<F>
): <K extends string, R, E, A, B>(
  f: (k: K, a: A) => Kind3<F, R, E, B>
) => (ta: ReadonlyRecord<K, A>) => Kind3<F, R, E, ReadonlyRecord<K, B>>
export declare function traverseWithIndex<F extends URIS3, E>(
  F: Applicative3C<F, E>
): <K extends string, R, A, B>(
  f: (k: K, a: A) => Kind3<F, R, E, B>
) => (ta: ReadonlyRecord<K, A>) => Kind3<F, R, E, ReadonlyRecord<K, B>>
export declare function traverseWithIndex<F extends URIS2>(
  F: Applicative2<F>
): <K extends string, E, A, B>(
  f: (k: K, a: A) => Kind2<F, E, B>
) => (ta: ReadonlyRecord<K, A>) => Kind2<F, E, ReadonlyRecord<K, B>>
export declare function traverseWithIndex<F extends URIS2, E>(
  F: Applicative2C<F, E>
): <K extends string, A, B>(
  f: (k: K, a: A) => Kind2<F, E, B>
) => (ta: ReadonlyRecord<K, A>) => Kind2<F, E, ReadonlyRecord<K, B>>
export declare function traverseWithIndex<F extends URIS>(
  F: Applicative1<F>
): <K extends string, A, B>(
  f: (k: K, a: A) => Kind<F, B>
) => (ta: ReadonlyRecord<K, A>) => Kind<F, ReadonlyRecord<K, B>>
export declare function traverseWithIndex<F>(
  F: Applicative<F>
): <K extends string, A, B>(f: (k: K, a: A) => HKT<F, B>) => (ta: ReadonlyRecord<K, A>) => HKT<F, ReadonlyRecord<K, B>>
/**
 * @since 2.5.0
 */
export declare function traverse<F extends URIS4>(
  F: Applicative4<F>
): <S, R, E, A, B>(
  f: (a: A) => Kind4<F, S, R, E, B>
) => <K extends string>(ta: ReadonlyRecord<K, A>) => Kind4<F, S, R, E, ReadonlyRecord<K, B>>
export declare function traverse<F extends URIS3>(
  F: Applicative3<F>
): <R, E, A, B>(
  f: (a: A) => Kind3<F, R, E, B>
) => <K extends string>(ta: ReadonlyRecord<K, A>) => Kind3<F, R, E, ReadonlyRecord<K, B>>
export declare function traverse<F extends URIS3, E>(
  F: Applicative3C<F, E>
): <R, A, B>(
  f: (a: A) => Kind3<F, R, E, B>
) => <K extends string>(ta: ReadonlyRecord<K, A>) => Kind3<F, R, E, ReadonlyRecord<K, B>>
export declare function traverse<F extends URIS2>(
  F: Applicative2<F>
): <E, A, B>(
  f: (a: A) => Kind2<F, E, B>
) => <K extends string>(ta: ReadonlyRecord<K, A>) => Kind2<F, E, ReadonlyRecord<K, B>>
export declare function traverse<F extends URIS2, E>(
  F: Applicative2C<F, E>
): <A, B>(
  f: (a: A) => Kind2<F, E, B>
) => <K extends string>(ta: ReadonlyRecord<K, A>) => Kind2<F, E, ReadonlyRecord<K, B>>
export declare function traverse<F extends URIS>(
  F: Applicative1<F>
): <A, B>(f: (a: A) => Kind<F, B>) => <K extends string>(ta: ReadonlyRecord<K, A>) => Kind<F, ReadonlyRecord<K, B>>
export declare function traverse<F>(
  F: Applicative<F>
): <A, B>(f: (a: A) => HKT<F, B>) => <K extends string>(ta: ReadonlyRecord<K, A>) => HKT<F, ReadonlyRecord<K, B>>
/**
 * `ReadonlyRecord` sequencing,
 * i.e., take a `ReadonlyRecord` in which elements are monads
 * and return a monad of a `ReadonlyRecord` of the base types.
 * The following example for instance shows sequencing
 * a `ReadonlyRecord<string, Option<number>>`
 * into an `Option<ReadonlyRecord<string, number>>`.
 *
 * `sequence` in `ReadonlyRecord` is equivalent to `sequenceS` in `Apply.ts`.
 *
 * @example
 * import { sequence } from "fp-ts/ReadonlyRecord";
 * import { option } from "fp-ts";
 * import { sequenceS } from "fp-ts/Apply";
 *
 * assert.deepStrictEqual(
 *   sequence(option.Applicative)({ a: option.some(1), b: option.some(2) }),
 *   option.some({ a: 1, b: 2 })
 * );
 * assert.deepStrictEqual(sequence(option.Applicative)({ a: option.some(1), b: option.none }), option.none);
 * assert.deepStrictEqual(
 *   sequence(option.Applicative)({ a: option.some(1), b: option.some(2) }),
 *   sequenceS(option.Applicative)({ a: option.some(1), b: option.some(2) })
 * );
 *
 * @since 2.5.0
 */
export declare function sequence<F extends URIS3>(
  F: Applicative3<F>
): <K extends string, R, E, A>(ta: ReadonlyRecord<K, Kind3<F, R, E, A>>) => Kind3<F, R, E, ReadonlyRecord<K, A>>
export declare function sequence<F extends URIS3, E>(
  F: Applicative3C<F, E>
): <K extends string, R, A>(ta: ReadonlyRecord<K, Kind3<F, R, E, A>>) => Kind3<F, R, E, ReadonlyRecord<K, A>>
export declare function sequence<F extends URIS2>(
  F: Applicative2<F>
): <K extends string, E, A>(ta: ReadonlyRecord<K, Kind2<F, E, A>>) => Kind2<F, E, ReadonlyRecord<K, A>>
export declare function sequence<F extends URIS2, E>(
  F: Applicative2C<F, E>
): <K extends string, A>(ta: ReadonlyRecord<K, Kind2<F, E, A>>) => Kind2<F, E, ReadonlyRecord<K, A>>
export declare function sequence<F extends URIS>(
  F: Applicative1<F>
): <K extends string, A>(ta: ReadonlyRecord<K, Kind<F, A>>) => Kind<F, ReadonlyRecord<K, A>>
export declare function sequence<F>(
  F: Applicative<F>
): <K extends string, A>(ta: ReadonlyRecord<K, HKT<F, A>>) => HKT<F, ReadonlyRecord<K, A>>
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
 * Maps a `ReadonlyRecord` with a function returning an `Either` and
 * partitions the resulting `ReadonlyRecord` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMapWithIndex } from "fp-ts/ReadonlyRecord"
 * import { either } from "fp-ts"
 *
 * const f = (key: string, a: number) =>
 *   a >= 0 ? either.right(`${key} is >= 0 (${a})`) : either.left(`${key} is < 0 (${a})`);
 * assert.deepStrictEqual(partitionMapWithIndex(f)({ a: -1, b: 2, c: 123 }), {
 *   left: {
 *     a: "a is < 0 (-1)",
 *   },
 *   right: {
 *     b: "b is >= 0 (2)",
 *     c: "c is >= 0 (123)",
 *   },
 * });
 *
 * @since 2.5.0
 */
export declare function partitionMapWithIndex<K extends string, A, B, C>(
  f: (key: K, a: A) => Either<B, C>
): (fa: ReadonlyRecord<K, A>) => Separated<ReadonlyRecord<string, B>, ReadonlyRecord<string, C>>
/**
 * Partition a `ReadonlyRecord` into two parts according to a predicate
 * that takes a key and a value.
 *
 * @example
 * import { partitionWithIndex } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(
 *   partitionWithIndex((key: string, a: number) => key.length <= 1 && a > 0)({ a: -1, b: 2, ccc: 7 }),
 *   {
 *     left: {
 *       a: -1,
 *       ccc: 7,
 *     },
 *     right: {
 *       b: 2,
 *     },
 *   }
 * );
 *
 * @since 2.5.0
 */
export declare function partitionWithIndex<K extends string, A, B extends A>(
  refinementWithIndex: RefinementWithIndex<K, A, B>
): (fa: ReadonlyRecord<K, A>) => Separated<ReadonlyRecord<string, A>, ReadonlyRecord<string, B>>
export declare function partitionWithIndex<K extends string, A>(
  predicateWithIndex: PredicateWithIndex<K, A>
): <B extends A>(fb: ReadonlyRecord<K, B>) => Separated<ReadonlyRecord<string, B>, ReadonlyRecord<string, B>>
export declare function partitionWithIndex<K extends string, A>(
  predicateWithIndex: PredicateWithIndex<K, A>
): (fa: ReadonlyRecord<K, A>) => Separated<ReadonlyRecord<string, A>, ReadonlyRecord<string, A>>
/**
 * Maps a `ReadonlyRecord` with an iterating function that takes key and value and
 * returns an `Option`, keeping only the `Some` values and discarding `None`s.
 *
 * @example
 * import { filterMapWithIndex } from "fp-ts/ReadonlyRecord"
 * import { option } from "fp-ts"
 *
 * const f = (key: string, a: number) => (a >= 0 ? option.some(`${key}${a}`) : option.none);
 * assert.deepStrictEqual(filterMapWithIndex(f)({ a: -1, b: 2, c: 3 }), {
 *   b: "b2",
 *   c: "c3",
 * });
 *
 * @since 2.5.0
 */
export declare function filterMapWithIndex<K extends string, A, B>(
  f: (key: K, a: A) => Option<B>
): (fa: ReadonlyRecord<K, A>) => ReadonlyRecord<string, B>
/**
 * Produce a new `ReadonlyRecord` keeping only the entries that satisfy
 * a predicate taking key and value as input.
 *
 * @example
 * import { filterWithIndex } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(
 *   filterWithIndex((s: string, v: number) => s.length <= 1 && v > 0)({ a: 1, b: -2, ccc: 3 }),
 *   {
 *     a: 1,
 *   }
 * );
 *
 * @since 2.5.0
 */
export declare function filterWithIndex<K extends string, A, B extends A>(
  refinementWithIndex: RefinementWithIndex<K, A, B>
): (fa: ReadonlyRecord<K, A>) => ReadonlyRecord<string, B>
export declare function filterWithIndex<K extends string, A>(
  predicateWithIndex: PredicateWithIndex<K, A>
): <B extends A>(fb: ReadonlyRecord<K, B>) => ReadonlyRecord<string, B>
export declare function filterWithIndex<K extends string, A>(
  predicateWithIndex: PredicateWithIndex<K, A>
): (fa: ReadonlyRecord<K, A>) => ReadonlyRecord<string, A>
/**
 * Create a `ReadonlyRecord` from a foldable collection of key/value pairs, using the
 * specified `Magma` to combine values for duplicate keys.
 *
 * @since 2.5.0
 */
export declare function fromFoldable<F extends URIS3, A>(
  M: Magma<A>,
  F: Foldable3<F>
): <R, E>(fka: Kind3<F, R, E, readonly [string, A]>) => ReadonlyRecord<string, A>
export declare function fromFoldable<F extends URIS2, A>(
  M: Magma<A>,
  F: Foldable2<F>
): <E>(fka: Kind2<F, E, readonly [string, A]>) => ReadonlyRecord<string, A>
export declare function fromFoldable<F extends URIS, A>(
  M: Magma<A>,
  F: Foldable1<F>
): (fka: Kind<F, readonly [string, A]>) => ReadonlyRecord<string, A>
export declare function fromFoldable<F, A>(
  M: Magma<A>,
  F: FoldableHKT<F>
): (fka: HKT<F, readonly [string, A]>) => ReadonlyRecord<string, A>
/**
 * Create a `ReadonlyRecord` from a foldable collection using the specified functions to:
 *
 * - map to key/value pairs
 * - combine values for duplicate keys.
 *
 * @example
 * import { last } from 'fp-ts/Semigroup'
 * import { Foldable, zip } from 'fp-ts/ReadonlyArray'
 * import { identity } from 'fp-ts/function'
 * import { ReadonlyRecord, fromFoldableMap } from 'fp-ts/ReadonlyRecord'
 *
 * export const zipObject = <K extends string, A>(keys: ReadonlyArray<K>, values: ReadonlyArray<A>): ReadonlyRecord<K, A> =>
 *   fromFoldableMap(last<A>(), Foldable)(zip(keys, values), identity)
 *
 * assert.deepStrictEqual(zipObject(['a', 'b'], [1, 2, 3]), { a: 1, b: 2 })
 *
 * interface User {
 *   readonly id: string
 *   readonly name: string
 * }
 *
 * const users: ReadonlyArray<User> = [
 *   { id: 'id1', name: 'name1' },
 *   { id: 'id2', name: 'name2' },
 *   { id: 'id1', name: 'name3' }
 * ]
 *
 * assert.deepStrictEqual(fromFoldableMap(last<User>(), Foldable)(users, user => [user.id, user]), {
 *   id1: { id: 'id1', name: 'name3' },
 *   id2: { id: 'id2', name: 'name2' }
 * })
 *
 * @since 2.5.0
 */
export declare function fromFoldableMap<F extends URIS3, B>(
  M: Magma<B>,
  F: Foldable3<F>
): <R, E, A>(fa: Kind3<F, R, E, A>, f: (a: A) => readonly [string, B]) => ReadonlyRecord<string, B>
export declare function fromFoldableMap<F extends URIS2, B>(
  M: Magma<B>,
  F: Foldable2<F>
): <E, A>(fa: Kind2<F, E, A>, f: (a: A) => readonly [string, B]) => ReadonlyRecord<string, B>
export declare function fromFoldableMap<F extends URIS, B>(
  M: Magma<B>,
  F: Foldable1<F>
): <A>(fa: Kind<F, A>, f: (a: A) => readonly [string, B]) => ReadonlyRecord<string, B>
export declare function fromFoldableMap<F, B>(
  M: Magma<B>,
  F: FoldableHKT<F>
): <A>(fa: HKT<F, A>, f: (a: A) => readonly [string, B]) => ReadonlyRecord<string, B>
/**
 * Alias of [`toReadonlyArray`](#toreadonlyarray).
 *
 * @example
 * import { toEntries } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(toEntries({ b: 2, a: 1 }), [['a', 1], ['b', 2]])
 *
 * @category conversions
 * @since 2.12.0
 */
export declare const toEntries: <K extends string, A>(r: ReadonlyRecord<K, A>) => ReadonlyArray<readonly [K, A]>
/**
 * Converts a `ReadonlyArray` of `[key, value]` tuples into a `ReadonlyRecord`.
 *
 * @example
 * import { fromEntries } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(fromEntries([['a', 1], ['b', 2], ['a', 3]]), { b: 2, a: 3 })
 *
 * @since 2.12.0
 * @category conversions
 */
export declare const fromEntries: <A>(fa: ReadonlyArray<readonly [string, A]>) => ReadonlyRecord<string, A>
/**
 * Test if every value in a `ReadonlyRecord` satisfies the predicate.
 *
 * @example
 * import { every } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(every((n: number) => n >= 0)({ a: 1, b: 2 }), true);
 * assert.deepStrictEqual(every((n: number) => n >= 0)({ a: 1, b: -1 }), false);
 *
 * @since 2.5.0
 */
export declare function every<A, B extends A>(
  refinement: Refinement<A, B>
): Refinement<ReadonlyRecord<string, A>, ReadonlyRecord<string, B>>
export declare function every<A>(predicate: Predicate<A>): Predicate<ReadonlyRecord<string, A>>
/**
 * Test if at least one value in a `ReadonlyRecord` satisfies the predicate.
 *
 * @example
 * import { some } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: 1, b: -2 }), true);
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: -1, b: -2 }), false);
 *
 * @since 2.5.0
 */
export declare function some<A>(predicate: (a: A) => boolean): (r: ReadonlyRecord<string, A>) => boolean
/**
 * Given an `Eq` checks if a `ReadonlyRecord` contains an entry with
 * value equal to a provided value.
 *
 * @example
 * import { elem } from "fp-ts/ReadonlyRecord"
 * import { number } from "fp-ts"
 *
 * assert.deepStrictEqual(elem(number.Eq)(123, { foo: 123, bar: 234 }), true);
 * assert.deepStrictEqual(elem(number.Eq)(-7, { foo: 123, bar: 234 }), false);
 *
 * @since 2.5.0
 */
export declare function elem<A>(E: Eq<A>): {
  (a: A): (fa: ReadonlyRecord<string, A>) => boolean
  (a: A, fa: ReadonlyRecord<string, A>): boolean
}
/**
 * Union of two `ReadonlyRecord`s.
 * Takes two `ReadonlyRecord`s and produces a `ReadonlyRecord` combining all the
 * entries of the two inputs.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements with the same key.
 *
 * @example
 * import { union } from "fp-ts/ReadonlyRecord";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(union(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4, b: 2, c: 3 });
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(union(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1, b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export declare const union: <A>(
  M: Magma<A>
) => (second: ReadonlyRecord<string, A>) => (first: ReadonlyRecord<string, A>) => ReadonlyRecord<string, A>
/**
 * Intersection of two `ReadonlyRecord`s.
 * Takes two `ReadonlyRecord`s and produces a `ReadonlyRecord` combining only the
 * entries of the two inputswith the same key.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements.
 *
 * @example
 * import { intersection } from "fp-ts/ReadonlyRecord";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(intersection(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4});
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(intersection(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1});
 *
 * @since 2.11.0
 */
export declare const intersection: <A>(
  M: Magma<A>
) => (second: ReadonlyRecord<string, A>) => (first: ReadonlyRecord<string, A>) => ReadonlyRecord<string, A>
/**
 * Difference between two `ReadonlyRecord`s.
 * Takes two `ReadonlyRecord`s and produces a `ReadonlyRecord` composed by the
 * entries of the two inputs, removing the entries with the same
 * key in both inputs.
 *
 * @example
 * import { difference } from "fp-ts/ReadonlyRecord";
 *
 * assert.deepStrictEqual(difference({ a: 1 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3, c: 3 })({ a: 1, b: 2 }), { b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export declare const difference: <A>(
  second: ReadonlyRecord<string, A>
) => (first: ReadonlyRecord<string, A>) => ReadonlyRecord<string, A>
/**
 * Given a `Predicate`, it produces a new `ReadonlyRecord` keeping only the entries with a
 * value that satisfies the provided predicate.
 *
 * @example
 * import { filter } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(filter((s: string) => s.length < 4)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo",
 *   b: "bar",
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: ReadonlyRecord<string, A>) => ReadonlyRecord<string, B>
  <A>(predicate: Predicate<A>): <B extends A>(fb: ReadonlyRecord<string, B>) => ReadonlyRecord<string, B>
  <A>(predicate: Predicate<A>): (fa: ReadonlyRecord<string, A>) => ReadonlyRecord<string, A>
}
/**
 * Maps a `ReadonlyRecord` with an iterating function that returns an `Option`
 * and it keeps only the `Some` values discarding the `None`s.
 *
 * @example
 * import { filterMap } from "fp-ts/ReadonlyRecord"
 * import { option } from "fp-ts"
 *
 * const f = (s: string) => s.length < 4 ? option.some(`${s} is short`): option.none
 * assert.deepStrictEqual(filterMap(f)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo is short",
 *   b: "bar is short",
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export declare const filterMap: <A, B>(
  f: (a: A) => Option<B>
) => (fa: ReadonlyRecord<string, A>) => ReadonlyRecord<string, B>
/**
 * Partition a `ReadonlyRecord` into two parts according to a `Predicate`.
 *
 * @example
 * import { partition } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(partition((s: string) => s.length < 4)({ a: "foo", b: "bar", c: "verylong" }), {
 *   left:{
 *     c: "verylong"
 *   },
 *   right: {
 *     a: "foo",
 *     b: "bar",
 *   },
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    fa: ReadonlyRecord<string, A>
  ) => Separated<ReadonlyRecord<string, A>, ReadonlyRecord<string, B>>
  <A>(predicate: Predicate<A>): <B extends A>(
    fb: ReadonlyRecord<string, B>
  ) => Separated<ReadonlyRecord<string, B>, ReadonlyRecord<string, B>>
  <A>(predicate: Predicate<A>): (
    fa: ReadonlyRecord<string, A>
  ) => Separated<ReadonlyRecord<string, A>, ReadonlyRecord<string, A>>
}
/**
 * Maps a `ReadonlyRecord` with a function returning an `Either` and
 * partitions the resulting `ReadonlyRecord` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMap } from "fp-ts/ReadonlyRecord"
 * import { either } from "fp-ts"
 *
 * const f = (s: string) => (s.length < 4 ? either.right(`${s} is short`) : either.left(`${s} is not short`));
 * assert.deepStrictEqual(partitionMap(f)({ a: "foo", b: "bar", c: "verylong" }), {
 *   left: {
 *     c: "verylong is not short",
 *   },
 *   right: {
 *     a: "foo is short",
 *     b: "bar is short",
 *   },
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: ReadonlyRecord<string, A>) => Separated<ReadonlyRecord<string, B>, ReadonlyRecord<string, C>>
/**
 * Reduces a `ReadonlyRecord` passing each value to the iterating function.
 * Entries are processed in order, sorted by key according to
 * the given `Ord`.
 *
 * @example
 * import { reduce } from "fp-ts/ReadonlyRecord";
 * import { Ord } from "fp-ts/string";
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(reduce(Ord)([] as string[], (b, a) => [...b, `-${a}-`])(x), [
 *   "-foo-",
 *   "-false-",
 *   "-3-",
 * ]);
 *
 * @category folding
 * @since 2.5.0
 */
export declare function reduce(
  O: Ord<string>
): <A, B>(b: B, f: (b: B, a: A) => B) => (fa: ReadonlyRecord<string, A>) => B
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function reduce<A, B>(b: B, f: (b: B, a: A) => B): (fa: ReadonlyRecord<string, A>) => B
/**
 * Map and fold a `ReadonlyRecord`.
 * Map the `ReadonlyRecord` passing each value to the iterating function.
 * Then fold the results using the provided `Monoid`.
 *
 * @example
 * import { foldMap } from "fp-ts/ReadonlyRecord";
 * import { Ord } from "fp-ts/string";
 * import { Monoid } from "fp-ts/Monoid";
 *
 * const m: Monoid<string> = { empty: "", concat: (x: string, y: string) => (x ? `${x} -> ${y}` : `${y}`) };
 * const f = (a: number) => `-${a}-`;
 * const x = { c: 3, a: 1, b: 2 };
 * assert.deepStrictEqual(foldMap(Ord)(m)(f)(x), "-1- -> -2- -> -3-");
 *
 * @category folding
 * @since 2.5.0
 */
export declare function foldMap(
  O: Ord<string>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: ReadonlyRecord<string, A>) => M
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function foldMap<M>(M: Monoid<M>): <A>(f: (a: A) => M) => (fa: ReadonlyRecord<string, A>) => M
/**
 * Same as `reduce` but entries are processed _from the right_,
 * i.e. in reverse order, from the last to the first entry, according to
 * the given `Ord`.
 *
 * @example
 * import { reduceRight } from "fp-ts/ReadonlyRecord";
 * import { Ord } from "fp-ts/string";
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(reduceRight(Ord)([] as string[], (a, b) => [...b, `-${a}-`])(x), [
 *   "-3-",
 *   "-false-",
 *   "-foo-",
 * ]);
 *
 * @category folding
 * @since 2.5.0
 */
export declare function reduceRight(
  O: Ord<string>
): <A, B>(b: B, f: (a: A, b: B) => B) => (fa: ReadonlyRecord<string, A>) => B
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @deprecated
 */
export declare function reduceRight<A, B>(b: B, f: (a: A, b: B) => B): (fa: ReadonlyRecord<string, A>) => B
/**
 * Compact a `ReadonlyRecord` of `Option`s discarding the `None` values and
 * keeping the `Some` values.
 *
 * @example
 * import { compact } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(compact({ a: option.some("foo"), b: option.none, c: option.some("bar") }), {
 *   a: "foo",
 *   c: "bar",
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export declare const compact: <A>(r: ReadonlyRecord<string, Option<A>>) => ReadonlyRecord<string, A>
/**
 * Separate a `ReadonlyRecord` of `Either`s into `Left`s and `Right`s.
 *
 * @example
 * import { separate } from 'fp-ts/ReadonlyRecord'
 * import { either } from 'fp-ts'
 *
 * assert.deepStrictEqual(
 *   separate({ a: either.right("foo"), b: either.left("bar"), c: either.right("baz") }),
 *   {
 *     right: {
 *       a: "foo",
 *       c: "baz",
 *     },
 *     left: {
 *       b: "bar",
 *     },
 *   }
 * );
 *
 * @category filtering
 * @since 2.5.0
 */
export declare const separate: <A, B>(
  r: ReadonlyRecord<string, Either<A, B>>
) => Separated<ReadonlyRecord<string, A>, ReadonlyRecord<string, B>>
/**
 * @category type lambdas
 * @since 2.5.0
 */
export declare const URI = 'ReadonlyRecord'
/**
 * @category type lambdas
 * @since 2.5.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: ReadonlyRecord<string, A>
  }
}
/**
 * Produces a `Show` for a `ReadonlyRecord`, given a `Show` for the base type
 * (a `Show` produces a human-readable representation of an instance).
 * `ReadonlyRecord` entries are sorted by key with the provided `Ord`.
 *
 * @example
 * import { getShow, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Show } from "fp-ts/Show"
 * import { Ord } from "fp-ts/string"
 *
 * const sNumber: Show<number> = { show: (n: number) => `${n}` };
 * const sRecord: Show<ReadonlyRecord<string, number>> = getShow(Ord)(sNumber);
 * assert.deepStrictEqual(sRecord.show({ b: 2, a: 1 }), '{ "a": 1, "b": 2 }');
 *
 * @category instances
 * @since 2.5.0
 */
export declare function getShow(O: Ord<string>): <A>(S: Show<A>) => Show<ReadonlyRecord<string, A>>
/**
 * Use the overload constrained by `Ord` instead.
 *
 * @category zone of death
 * @deprecated
 */
export declare function getShow<A>(S: Show<A>): Show<ReadonlyRecord<string, A>>
/**
 * Given an `Eq` for the base type, it produces an `Eq`
 * for a `ReadonlyRecord` of that base type.
 *
 * @example
 * import { getEq, ReadonlyRecord } from "fp-ts/ReadonlyRecord";
 * import { string } from "fp-ts";
 * import { Eq } from "fp-ts/Eq";
 *
 * const eq: Eq<ReadonlyRecord<string, string>> = getEq(string.Eq);
 * assert.deepStrictEqual(eq.equals({ a: "foo" }, { b: "bar" }), false);
 * assert.deepStrictEqual(eq.equals({ a: "foo" }, { a: "foo" }), true);
 *
 * @category instances
 * @since 2.5.0
 */
export declare function getEq<K extends string, A>(E: Eq<A>): Eq<ReadonlyRecord<K, A>>
/**
 * Returns a `Monoid` instance for `ReadonlyRecord`s, given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `ReadonlyRecord`s comining the
 * overlapping entries with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getMonoid } from 'fp-ts/ReadonlyRecord'
 *
 * const M = getMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.5.0
 */
export declare function getMonoid<K extends string, A>(S: Semigroup<A>): Monoid<ReadonlyRecord<K, A>>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const Functor: Functor1<URI>
/**
 * Takes a value and a `ReadonlyRecord` of functions and returns a
 * `ReadonlyRecord` by applying each function to the input value.
 *
 * @example
 * import { flap } from "fp-ts/ReadonlyRecord"
 *
 * const fab = { x: (n: number) => `${n} times 2`, y: (n: number) => `${n * 2}` };
 * assert.deepStrictEqual(flap(3)(fab), {
 *   x: "3 times 2",
 *   y: "6",
 * });
 *
 * @category mapping
 * @since 2.10.0
 */
export declare const flap: <A>(a: A) => <B>(fab: Kind<'ReadonlyRecord', (a: A) => B>) => Kind<'ReadonlyRecord', B>
/**
 * @category instances
 * @since 2.7.0
 */
export declare const FunctorWithIndex: FunctorWithIndex1<URI, string>
/**
 * Produces a `Foldable` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
 *
 * @category folding
 * @since 2.11.0
 */
export declare const getFoldable: (O: Ord<string>) => Foldable1<URI>
/**
 * Produces a `FoldableWithIndex1` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
 *
 * @category folding
 * @since 2.11.0
 */
export declare const getFoldableWithIndex: (O: Ord<string>) => FoldableWithIndex1<URI, string>
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
export declare const FilterableWithIndex: FilterableWithIndex1<URI, string>
/**
 * Produces a `Traversable` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const getTraversable: (O: Ord<string>) => Traversable1<URI>
/**
 * Produces a `TraversableWithIndex` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
 *
 * @category traversing
 * @since 2.11.0
 */
export declare const getTraversableWithIndex: (O: Ord<string>) => TraversableWithIndex1<URI, string>
/**
 * @category filtering
 * @since 2.11.0
 */
export declare const getWitherable: (O: Ord<string>) => Witherable1<URI>
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `ReadonlyRecord` of the base type.
 * The resulting `Semigroup` concatenates two `ReadonlyRecord`s by
 * `union`.
 *
 * @example
 * import { getUnionSemigroup, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sReadonlyRecord: Semigroup<ReadonlyRecord<string, number>> = getUnionSemigroup(sNumber);
 * assert.deepStrictEqual(sReadonlyRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { a: 1, b: -1, c: 4 });
 *
 * @category instances
 * @since 2.11.0
 */
export declare const getUnionSemigroup: <A>(S: Semigroup<A>) => Semigroup<ReadonlyRecord<string, A>>
/**
 * Same as `getMonoid`.
 * Returns a `Monoid` instance for `ReadonlyRecord`s given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `ReadonlyRecord`s combining the
 * entries that have the same key with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getUnionMonoid } from 'fp-ts/ReadonlyRecord'
 *
 * const M = getUnionMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.11.0
 */
export declare const getUnionMonoid: <A>(S: Semigroup<A>) => Monoid<ReadonlyRecord<string, A>>
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `ReadonlyRecord` of the base type.
 * The resulting `Semigroup` concatenates two `ReadonlyRecord`s by
 * `intersection`.
 *
 * @example
 * import { getIntersectionSemigroup, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sReadonlyRecord: Semigroup<ReadonlyRecord<string, number>> = getIntersectionSemigroup(sNumber);
 * assert.deepStrictEqual(sReadonlyRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { b: -1 });
 *
 * @category instances
 * @since 2.11.0
 */
export declare const getIntersectionSemigroup: <A>(S: Semigroup<A>) => Semigroup<ReadonlyRecord<string, A>>
/**
 * Produces a `Magma` with a `concat` function that combines
 * two `ReadonlyRecord`s by making the `difference`.
 *
 * @example
 * import { getDifferenceMagma, difference, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Magma } from "fp-ts/Magma"
 *
 * const r1 = { a: 3, c: 3 };
 * const r2 = { a: 1, b: 2 };
 * const m: Magma<ReadonlyRecord<string, number>> = getDifferenceMagma<number>();
 * assert.deepStrictEqual(m.concat(r1, r2), difference(r2)(r1));
 * assert.deepStrictEqual(m.concat(r1, r2), { c: 3, b: 2 });
 *
 * @category instances
 * @since 2.11.0
 */
export declare const getDifferenceMagma: <A>() => Magma<ReadonlyRecord<string, A>>
/**
 * Use `getFoldable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const Foldable: Foldable1<URI>
/**
 * Use `getFoldableWithIndex` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const FoldableWithIndex: FoldableWithIndex1<URI, string>
/**
 * Use `getTraversable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const Traversable: Traversable1<URI>
/**
 * Use `getTraversableWithIndex` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const TraversableWithIndex: TraversableWithIndex1<URI, string>
/**
 * Use `getWitherable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export declare const Witherable: Witherable1<URI>
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const insertAt: <A>(k: string, a: A) => (r: ReadonlyRecord<string, A>) => ReadonlyRecord<string, A>
/**
 * Use [`has`](#has) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare function hasOwnProperty<K extends string>(k: string, r: ReadonlyRecord<K, unknown>): k is K
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RR.Functor` instead of `RR.readonlyRecord`
 * (where `RR` is from `import RR from 'fp-ts/ReadonlyRecord'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export declare const readonlyRecord: FunctorWithIndex1<URI, string> &
  FoldableWithIndex1<URI, string> &
  FilterableWithIndex1<URI, string> &
  TraversableWithIndex1<URI, string> &
  Witherable1<URI>
