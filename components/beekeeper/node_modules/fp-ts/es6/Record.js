var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as A from './Array';
import { pipe } from './function';
import { flap as flap_ } from './Functor';
import * as _ from './internal';
import * as RR from './ReadonlyRecord';
import * as Se from './Semigroup';
import * as S from './string';
import { wiltDefault, witherDefault } from './Witherable';
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * Calculate the number of key/value pairs in a `Record`.
 *
 * @example
 * import { size } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(size({ a: true, b: 2, c: "three" }), 3);
 *
 * @since 2.0.0
 */
export var size = RR.size;
/**
 * Test whether a `Record` is empty.
 *
 * @example
 * import { isEmpty } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(isEmpty({}), true);
 * assert.deepStrictEqual(isEmpty({ a: 3 }), false);
 *
 * @since 2.0.0
 */
export var isEmpty = RR.isEmpty;
var keys_ = function (O) {
    return function (r) {
        return Object.keys(r).sort(O.compare);
    };
};
/**
 * The keys of a `Record`, sorted alphabetically.
 *
 * @example
 * import { keys } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(keys({ c: 1, a: 2, b: 3 }), ["a", "b", "c"]);
 *
 * @since 2.0.0
 */
export var keys = /*#__PURE__*/ keys_(S.Ord);
export function collect(O) {
    if (typeof O === 'function') {
        return collect(S.Ord)(O);
    }
    var keysO = keys_(O);
    return function (f) {
        return function (r) {
            var out = [];
            for (var _i = 0, _a = keysO(r); _i < _a.length; _i++) {
                var key = _a[_i];
                out.push(f(key, r[key]));
            }
            return out;
        };
    };
}
/**
 * Get a sorted `Array` of the key/value pairs contained in a `Record`.
 * Sorted alphabetically by key.
 *
 * @example
 * import { toArray } from 'fp-ts/Record'
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(toArray(x), [
 *   ["a", "foo"],
 *   ["b", false],
 *   ["c", 3],
 * ]);
 *
 * @category conversions
 * @since 2.0.0
 */
export var toArray = /*#__PURE__*/ collect(S.Ord)(function (k, a) { return [
    k,
    a
]; });
export function toUnfoldable(U) {
    return function (r) {
        var sas = toArray(r);
        var len = sas.length;
        return U.unfold(0, function (b) { return (b < len ? _.some([sas[b], b + 1]) : _.none); });
    };
}
/**
 * Insert or replace a key/value pair in a `Record`.
 *
 * @example
 * import { upsertAt } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(upsertAt("a", 5)({ a: 1, b: 2 }), { a: 5, b: 2 });
 * assert.deepStrictEqual(upsertAt("c", 5)({ a: 1, b: 2 }), { a: 1, b: 2, c: 5 });
 *
 * @since 2.10.0
 */
export var upsertAt = RR.upsertAt;
/**
 * Test whether or not a key exists in a `Record`.
 *
 * Note. This function is not pipeable because is a `Refinement`.
 *
 * @example
 * import { has } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(has("a", { a: 1, b: 2 }), true);
 * assert.deepStrictEqual(has("c", { a: 1, b: 2 }), false);
 *
 * @since 2.10.0
 */
export var has = RR.has;
export function deleteAt(k) {
    return function (r) {
        if (!_.has.call(r, k)) {
            return r;
        }
        var out = Object.assign({}, r);
        delete out[k];
        return out;
    };
}
/**
 * Replace a key/value pair in a `Record`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { updateAt } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(updateAt("a", 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(updateAt("c", 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.0.0
 */
export var updateAt = function (k, a) {
    return modifyAt(k, function () { return a; });
};
/**
 * Applies a mapping function to one spcific key/value pair in a `Record`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { modifyAt } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(modifyAt("a", (x: number) => x * 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(modifyAt("c", (x: number) => x * 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.0.0
 */
export var modifyAt = function (k, f) {
    return function (r) {
        if (!has(k, r)) {
            return _.none;
        }
        var out = Object.assign({}, r);
        out[k] = f(r[k]);
        return _.some(out);
    };
};
export function pop(k) {
    var deleteAtk = deleteAt(k);
    return function (r) {
        var oa = lookup(k, r);
        return _.isNone(oa) ? _.none : _.some([oa.value, deleteAtk(r)]);
    };
}
// TODO: remove non-curried overloading in v3
/**
 * Test whether one `Record` contains all of the keys and values
 * contained in another `Record`.
 *
 * @example
 * import { isSubrecord } from 'fp-ts/Record'
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
 * @since 2.0.0
 */
export var isSubrecord = RR.isSubrecord;
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Record`.
 *
 * @returns If the specified key exists it returns an `Option` containing the value,
 * otherwise it returns `None`
 *
 * @example
 * import { lookup } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(lookup("b")({ a: "foo", b: "bar" }), option.some("bar"));
 * assert.deepStrictEqual(lookup("c")({ a: "foo", b: "bar" }), option.none);
 *
 * @since 2.0.0
 */
export var lookup = RR.lookup;
/**
 * Map a `Record` passing the key/value pairs to the iterating function.
 *
 * @example
 * import { mapWithIndex } from "fp-ts/Record";
 *
 * const f = (k: string, n: number) => `${k.toUpperCase()}-${n}`;
 * assert.deepStrictEqual(mapWithIndex(f)({ a: 3, b: 5 }), { a: "A-3", b: "B-5" });
 *
 * @since 2.0.0
 */
export var mapWithIndex = RR.mapWithIndex;
/**
 * Map a `Record` passing the values to the iterating function.
 *
 * @example
 * import { map } from "fp-ts/Record";
 *
 * const f = (n: number) => `-${n}-`;
 * assert.deepStrictEqual(map(f)({ a: 3, b: 5 }), { a: "-3-", b: "-5-" });
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = RR.map;
export function reduceWithIndex() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.length === 1 ? RR.reduceWithIndex(args[0]) : RR.reduceWithIndex(S.Ord).apply(void 0, args);
}
export function foldMapWithIndex(O) {
    return 'compare' in O ? RR.foldMapWithIndex(O) : RR.foldMapWithIndex(S.Ord)(O);
}
export function reduceRightWithIndex() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.length === 1 ? RR.reduceRightWithIndex(args[0]) : RR.reduceRightWithIndex(S.Ord).apply(void 0, args);
}
/**
 * Create a `Record` with one key/value pair.
 *
 * @example
 * import { singleton } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(singleton("a", 1), { a: 1 });
 *
 * @since 2.0.0
 */
export var singleton = RR.singleton;
export function traverseWithIndex(F) {
    return RR.traverseWithIndex(F);
}
export function traverse(F) {
    return RR.traverse(F);
}
export function sequence(F) {
    return RR.sequence(F);
}
/**
 * @category filtering
 * @since 2.6.5
 */
export var wither = function (F) {
    var traverseF = traverse(F);
    return function (f) { return function (fa) { return F.map(pipe(fa, traverseF(f)), compact); }; };
};
/**
 * @category filtering
 * @since 2.6.5
 */
export var wilt = function (F) {
    var traverseF = traverse(F);
    return function (f) { return function (fa) { return F.map(pipe(fa, traverseF(f)), separate); }; };
};
/**
 * Maps a `Record` with a function returning an `Either` and
 * partitions the resulting `Record` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMapWithIndex } from "fp-ts/Record"
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
 * @since 2.0.0
 */
export var partitionMapWithIndex = RR.partitionMapWithIndex;
export function partitionWithIndex(predicateWithIndex) {
    return RR.partitionWithIndex(predicateWithIndex);
}
/**
 * Maps a `Record` with an iterating function that takes key and value and
 * returns an `Option`, keeping only the `Some` values and discarding `None`s.
 *
 * @example
 * import { filterMapWithIndex } from "fp-ts/Record"
 * import { option } from "fp-ts"
 *
 * const f = (key: string, a: number) => (a >= 0 ? option.some(`${key}${a}`) : option.none);
 * assert.deepStrictEqual(filterMapWithIndex(f)({ a: -1, b: 2, c: 3 }), {
 *   b: "b2",
 *   c: "c3",
 * });
 *
 * @since 2.0.0
 */
export var filterMapWithIndex = RR.filterMapWithIndex;
export function filterWithIndex(predicateWithIndex) {
    return RR.filterWithIndex(predicateWithIndex);
}
export function fromFoldable(M, F) {
    return RR.fromFoldable(M, F);
}
/**
 * Alias of [`toArray`](#toArray).
 *
 * @example
 * import { toEntries } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(toEntries({ b: 2, a: 1 }), [['a', 1], ['b', 2]])
 *
 * @since 2.12.0
 * @category conversions
 */
export var toEntries = toArray;
/**
 * Converts an `Array` of `[key, value]` tuples into a `Record`.
 *
 * @example
 * import { fromEntries } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(fromEntries([['a', 1], ['b', 2], ['a', 3]]), { b: 2, a: 3 })
 *
 * @since 2.12.0
 * @category conversions
 */
export var fromEntries = function (fa) { return fromFoldable(Se.last(), A.Foldable)(fa); };
export function fromFoldableMap(M, F) {
    return RR.fromFoldableMap(M, F);
}
/**
 * Test if every value in a `Record` satisfies the predicate.
 *
 * @example
 * import { every } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(every((n: number) => n >= 0)({ a: 1, b: 2 }), true);
 * assert.deepStrictEqual(every((n: number) => n >= 0)({ a: 1, b: -1 }), false);
 *
 * @since 2.0.0
 */
export var every = RR.every;
/**
 * Test if at least one value in a `Record` satisfies the predicate.
 *
 * @example
 * import { some } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: 1, b: -2 }), true);
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: -1, b: -2 }), false);
 *
 * @since 2.0.0
 */
export var some = RR.some;
// TODO: remove non-curried overloading in v3
/**
 * Given an `Eq` checks if a `Record` contains an entry with
 * value equal to a provided value.
 *
 * @example
 * import { elem } from "fp-ts/Record"
 * import { number } from "fp-ts"
 *
 * assert.deepStrictEqual(elem(number.Eq)(123, { foo: 123, bar: 234 }), true);
 * assert.deepStrictEqual(elem(number.Eq)(-7, { foo: 123, bar: 234 }), false);
 *
 * @since 2.0.0
 */
export var elem = RR.elem;
/**
 * Union of two `Record`s.
 * Takes two `Record`s and produces a `Record` combining all the
 * entries of the two inputs.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements with the same key.
 *
 * @example
 * import { union } from "fp-ts/Record";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(union(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4, b: 2, c: 3 });
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(union(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1, b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export var union = function (M) {
    var unionM = RR.union(M);
    return function (second) { return function (first) {
        if (isEmpty(first)) {
            return __assign({}, second);
        }
        if (isEmpty(second)) {
            return __assign({}, first);
        }
        return unionM(second)(first);
    }; };
};
/**
 * Intersection of two `Record`s.
 * Takes two `Record`s and produces a `Record` combining only the
 * entries of the two inputswith the same key.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements.
 *
 * @example
 * import { intersection } from "fp-ts/Record";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(intersection(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4});
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(intersection(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1});
 *
 * @since 2.11.0
 */
export var intersection = function (M) {
    return function (second) {
        return function (first) {
            if (isEmpty(first) || isEmpty(second)) {
                return {};
            }
            return RR.intersection(M)(second)(first);
        };
    };
};
/**
 * Difference between two `Record`s.
 * Takes two `Record`s and produces a `Record` composed by the
 * entries of the two inputs, removing the entries with the same
 * key in both inputs.
 *
 * @example
 * import { difference } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(difference({ a: 1 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3, c: 3 })({ a: 1, b: 2 }), { b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export var difference = function (second) {
    return function (first) {
        if (isEmpty(first)) {
            return __assign({}, second);
        }
        if (isEmpty(second)) {
            return __assign({}, first);
        }
        return RR.difference(second)(first);
    };
};
var _map = RR._map;
var _mapWithIndex = RR._mapWithIndex;
var _reduce = RR._reduce;
var _foldMap = RR._foldMap;
var _reduceRight = RR._reduceRight;
var _filter = RR._filter;
var _filterMap = RR._filterMap;
var _partition = RR._partition;
var _partitionMap = RR._partitionMap;
var _reduceWithIndex = RR._reduceWithIndex;
var _foldMapWithIndex = RR._foldMapWithIndex;
var _reduceRightWithIndex = RR._reduceRightWithIndex;
var _partitionMapWithIndex = RR._partitionMapWithIndex;
var _partitionWithIndex = RR._partitionWithIndex;
var _filterMapWithIndex = RR._filterMapWithIndex;
var _filterWithIndex = RR._filterWithIndex;
var _traverse = RR._traverse;
var _sequence = RR._sequence;
var _traverseWithIndex = function (O) {
    return function (F) {
        var keysO = keys_(O);
        return function (ta, f) {
            var ks = keysO(ta);
            if (ks.length === 0) {
                return F.of({});
            }
            var fr = F.of({});
            var _loop_1 = function (key) {
                fr = F.ap(F.map(fr, function (r) { return function (b) {
                    r[key] = b;
                    return r;
                }; }), f(key, ta[key]));
            };
            for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
                var key = ks_1[_i];
                _loop_1(key);
            }
            return fr;
        };
    };
};
/**
 * Given a `Predicate`, it produces a new `Record` keeping only the entries with a
 * value that satisfies the provided predicate.
 *
 * @example
 * import { filter } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(filter((s: string) => s.length < 4)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo",
 *   b: "bar",
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export var filter = RR.filter;
/**
 * Maps a `Record` with an iterating function that returns an `Option`
 * and it keeps only the `Some` values discarding the `None`s.
 *
 * @example
 * import { filterMap } from "fp-ts/Record"
 * import { option } from "fp-ts"
 *
 * const f = (s: string) => s.length < 4 ? option.some(`${s} is short`): option.none
 * assert.deepStrictEqual(filterMap(f)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo is short",
 *   b: "bar is short",
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export var filterMap = RR.filterMap;
/**
 * Partition a `Record` into two parts according to a `Predicate`.
 *
 * @example
 * import { partition } from "fp-ts/Record"
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
 * @since 2.0.0
 */
export var partition = RR.partition;
/**
 * Maps a `Record` with a function returning an `Either` and
 * partitions the resulting `Record` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMap } from "fp-ts/Record"
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
 * @since 2.0.0
 */
export var partitionMap = RR.partitionMap;
export function reduce() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.length === 1 ? RR.reduce(args[0]) : RR.reduce(S.Ord).apply(void 0, args);
}
export function foldMap(O) {
    return 'compare' in O ? RR.foldMap(O) : RR.foldMap(S.Ord)(O);
}
export function reduceRight() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.length === 1 ? RR.reduceRight(args[0]) : RR.reduceRight(S.Ord).apply(void 0, args);
}
/**
 * Compact a `Record` of `Option`s discarding the `None` values and
 * keeping the `Some` values.
 *
 * @example
 * import { compact } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(compact({ a: option.some("foo"), b: option.none, c: option.some("bar") }), {
 *   a: "foo",
 *   c: "bar",
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export var compact = RR.compact;
/**
 * Separate a `Record` of `Either`s into `Left`s and `Right`s.
 *
 * @example
 * import { separate } from 'fp-ts/Record'
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
 * @since 2.0.0
 */
export var separate = RR.separate;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Record';
export function getShow(O) {
    return 'compare' in O ? RR.getShow(O) : RR.getShow(S.Ord)(O);
}
/**
 * Given an `Eq` for the base type, it produces an `Eq`
 * for a `Record` of that base type.
 *
 * @example
 * import { getEq } from "fp-ts/Record";
 * import { string } from "fp-ts";
 * import { Eq } from "fp-ts/Eq";
 *
 * const eq: Eq<Record<string, string>> = getEq(string.Eq);
 * assert.deepStrictEqual(eq.equals({ a: "foo" }, { b: "bar" }), false);
 * assert.deepStrictEqual(eq.equals({ a: "foo" }, { a: "foo" }), true);
 *
 * @category instances
 * @since 2.0.0
 */
export var getEq = RR.getEq;
/**
 * Returns a `Monoid` instance for `Record`s, given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `Record`s comining the
 * overlapping entries with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getMonoid } from 'fp-ts/Record'
 *
 * const M = getMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.0.0
 */
export var getMonoid = RR.getMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
/**
 * Takes a value and a `Record` of functions and returns a
 * `Record` by applying each function to the input value.
 *
 * @example
 * import { flap } from "fp-ts/Record"
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
export var flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.7.0
 */
export var FunctorWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex
};
/**
 * Produces a `Foldable` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category folding
 * @since 2.11.0
 */
export var getFoldable = function (O) { return ({
    URI: URI,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O)
}); };
/**
 * Produces a `FoldableWithIndex1` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category folding
 * @since 2.11.0
 */
export var getFoldableWithIndex = function (O) { return ({
    URI: URI,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    reduceWithIndex: _reduceWithIndex(O),
    foldMapWithIndex: _foldMapWithIndex(O),
    reduceRightWithIndex: _reduceRightWithIndex(O)
}); };
/**
 * @category instances
 * @since 2.7.0
 */
export var Compactable = {
    URI: URI,
    compact: compact,
    separate: separate
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Filterable = {
    URI: URI,
    map: _map,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instances
 * @since 2.7.0
 */
export var FilterableWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex
};
/**
 * Produces a `Traversable` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category traversing
 * @since 2.11.0
 */
export var getTraversable = function (O) { return ({
    URI: URI,
    map: _map,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    traverse: _traverse(O),
    sequence: _sequence(O)
}); };
/**
 * Produces a `TraversableWithIndex` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category traversing
 * @since 2.11.0
 */
export var getTraversableWithIndex = function (O) { return ({
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    reduceWithIndex: _reduceWithIndex(O),
    foldMapWithIndex: _foldMapWithIndex(O),
    reduceRightWithIndex: _reduceRightWithIndex(O),
    traverse: _traverse(O),
    sequence: _sequence(O),
    traverseWithIndex: _traverseWithIndex(O)
}); };
/**
 * @category filtering
 * @since 2.11.0
 */
export var getWitherable = function (O) {
    var T = getTraversable(O);
    return {
        URI: URI,
        map: _map,
        reduce: _reduce(O),
        foldMap: _foldMap(O),
        reduceRight: _reduceRight(O),
        traverse: T.traverse,
        sequence: T.sequence,
        compact: compact,
        separate: separate,
        filter: _filter,
        filterMap: _filterMap,
        partition: _partition,
        partitionMap: _partitionMap,
        wither: witherDefault(T, Compactable),
        wilt: wiltDefault(T, Compactable)
    };
};
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `Record` of the base type.
 * The resulting `Semigroup` concatenates two `Record`s by
 * `union`.
 *
 * @example
 * import { getUnionSemigroup } from "fp-ts/Record"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sRecord: Semigroup<Record<string, number>> = getUnionSemigroup(sNumber);
 * assert.deepStrictEqual(sRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { a: 1, b: -1, c: 4 });
 *
 * @category instances
 * @since 2.11.0
 */
export var getUnionSemigroup = function (S) {
    var unionS = union(S);
    return {
        concat: function (first, second) { return unionS(second)(first); }
    };
};
/**
 * Same as `getMonoid`.
 * Returns a `Monoid` instance for `Record`s given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `Record`s combining the
 * entries that have the same key with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getUnionMonoid } from 'fp-ts/Record'
 *
 * const M = getUnionMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.11.0
 */
export var getUnionMonoid = function (S) { return ({
    concat: getUnionSemigroup(S).concat,
    empty: {}
}); };
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `Record` of the base type.
 * The resulting `Semigroup` concatenates two `Record`s by
 * `intersection`.
 *
 * @example
 * import { getIntersectionSemigroup } from "fp-ts/Record"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sRecord: Semigroup<Record<string, number>> = getIntersectionSemigroup(sNumber);
 * assert.deepStrictEqual(sRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { b: -1 });
 *
 * @category instances
 * @since 2.11.0
 */
export var getIntersectionSemigroup = function (S) {
    var intersectionS = intersection(S);
    return {
        concat: function (first, second) { return intersectionS(second)(first); }
    };
};
/**
 * Produces a `Magma` with a `concat` function that combines
 * two `Record`s by making the `difference`.
 *
 * @example
 * import { getDifferenceMagma, difference } from "fp-ts/Record"
 * import { Magma } from "fp-ts/Magma"
 *
 * const r1 = { a: 3, c: 3 };
 * const r2 = { a: 1, b: 2 };
 * const m: Magma<Record<string, number>> = getDifferenceMagma<number>();
 * assert.deepStrictEqual(m.concat(r1, r2), difference(r2)(r1));
 * assert.deepStrictEqual(m.concat(r1, r2), { c: 3, b: 2 });
 *
 * @category instances
 * @since 2.11.0
 */
export var getDifferenceMagma = function () { return ({
    concat: function (first, second) { return difference(second)(first); }
}); };
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `getFoldable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export var Foldable = {
    URI: URI,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord)
};
/**
 * Use `getFoldableWithIndex` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export var FoldableWithIndex = {
    URI: URI,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    reduceWithIndex: /*#__PURE__*/ _reduceWithIndex(S.Ord),
    foldMapWithIndex: /*#__PURE__*/ _foldMapWithIndex(S.Ord),
    reduceRightWithIndex: /*#__PURE__*/ _reduceRightWithIndex(S.Ord)
};
/**
 * Use `getTraversable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export var Traversable = {
    URI: URI,
    map: _map,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence: sequence
};
/**
 * Use the `getTraversableWithIndex` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export var TraversableWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    reduceWithIndex: /*#__PURE__*/ _reduceWithIndex(S.Ord),
    foldMapWithIndex: /*#__PURE__*/ _foldMapWithIndex(S.Ord),
    reduceRightWithIndex: /*#__PURE__*/ _reduceRightWithIndex(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence: sequence,
    traverseWithIndex: /*#__PURE__*/ _traverseWithIndex(S.Ord)
};
var _wither = /*#__PURE__*/ witherDefault(Traversable, Compactable);
var _wilt = /*#__PURE__*/ wiltDefault(Traversable, Compactable);
/**
 * Use `getWitherable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export var Witherable = {
    URI: URI,
    map: _map,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence: sequence,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: _wither,
    wilt: _wilt
};
/**
 * Use a new `{}` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var empty = {};
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var insertAt = upsertAt;
/**
 * Use [`has`](#has) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var hasOwnProperty = RR.hasOwnProperty;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `R.Functor` instead of `R.record`
 * (where `R` is from `import R from 'fp-ts/Record'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var record = {
    URI: URI,
    map: _map,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence: sequence,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    mapWithIndex: _mapWithIndex,
    reduceWithIndex: /*#__PURE__*/ _reduceWithIndex(S.Ord),
    foldMapWithIndex: /*#__PURE__*/ _foldMapWithIndex(S.Ord),
    reduceRightWithIndex: /*#__PURE__*/ _reduceRightWithIndex(S.Ord),
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    traverseWithIndex: /*#__PURE__*/ _traverseWithIndex(S.Ord),
    wither: _wither,
    wilt: _wilt
};
