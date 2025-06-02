import { fromEquals } from './Eq';
import { flow, identity, pipe, SK } from './function';
import { flap as flap_ } from './Functor';
import * as _ from './internal';
import { separated } from './Separated';
import * as S from './string';
import { wiltDefault, witherDefault } from './Witherable';
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
export var fromRecord = function (r) { return Object.assign({}, r); };
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
export var toRecord = function (r) { return Object.assign({}, r); };
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
export var size = function (r) { return Object.keys(r).length; };
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
export var isEmpty = function (r) {
    for (var k in r) {
        if (_.has.call(r, k)) {
            return false;
        }
    }
    return true;
};
var keys_ = function (O) {
    return function (r) {
        return Object.keys(r).sort(O.compare);
    };
};
/**
 * @since 2.5.0
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
export var toReadonlyArray = 
/*#__PURE__*/ collect(S.Ord)(function (k, a) { return [k, a]; });
export function toUnfoldable(U) {
    return function (r) {
        var sas = toReadonlyArray(r);
        var len = sas.length;
        return U.unfold(0, function (b) { return (b < len ? _.some([sas[b], b + 1]) : _.none); });
    };
}
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
export var upsertAt = function (k, a) {
    return function (r) {
        if (_.has.call(r, k) && r[k] === a) {
            return r;
        }
        var out = Object.assign({}, r);
        out[k] = a;
        return out;
    };
};
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
export var has = function (k, r) { return _.has.call(r, k); };
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
export var updateAt = function (k, a) {
    return function (r) {
        if (!has(k, r)) {
            return _.none;
        }
        if (r[k] === a) {
            return _.some(r);
        }
        var out = Object.assign({}, r);
        out[k] = a;
        return _.some(out);
    };
};
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
export var modifyAt = function (k, f) {
    return function (r) {
        if (!has(k, r)) {
            return _.none;
        }
        var next = f(r[k]);
        if (next === r[k]) {
            return _.some(r);
        }
        var out = Object.assign({}, r);
        out[k] = next;
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
export function isSubrecord(E) {
    return function (me, that) {
        if (that === undefined) {
            var isSubrecordE_1 = isSubrecord(E);
            return function (that) { return isSubrecordE_1(that, me); };
        }
        for (var k in me) {
            if (!_.has.call(that, k) || !E.equals(me[k], that[k])) {
                return false;
            }
        }
        return true;
    };
}
export function lookup(k, r) {
    if (r === undefined) {
        return function (r) { return lookup(k, r); };
    }
    return _.has.call(r, k) ? _.some(r[k]) : _.none;
}
/**
 * @since 2.5.0
 */
export var empty = {};
export function mapWithIndex(f) {
    return function (r) {
        var out = {};
        for (var k in r) {
            if (_.has.call(r, k)) {
                out[k] = f(k, r[k]);
            }
        }
        return out;
    };
}
export function map(f) {
    return mapWithIndex(function (_, a) { return f(a); });
}
export function reduceWithIndex() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 2) {
        return reduceWithIndex(S.Ord).apply(void 0, args);
    }
    var keysO = keys_(args[0]);
    return function (b, f) { return function (fa) {
        var out = b;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = f(k, out, fa[k]);
        }
        return out;
    }; };
}
export function foldMapWithIndex(O) {
    if ('compare' in O) {
        var keysO_1 = keys_(O);
        return function (M) {
            return function (f) {
                return function (fa) {
                    var out = M.empty;
                    var ks = keysO_1(fa);
                    var len = ks.length;
                    for (var i = 0; i < len; i++) {
                        var k = ks[i];
                        out = M.concat(out, f(k, fa[k]));
                    }
                    return out;
                };
            };
        };
    }
    return foldMapWithIndex(S.Ord)(O);
}
export function reduceRightWithIndex() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 2) {
        return reduceRightWithIndex(S.Ord).apply(void 0, args);
    }
    var keysO = keys_(args[0]);
    return function (b, f) { return function (fa) {
        var out = b;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = len - 1; i >= 0; i--) {
            var k = ks[i];
            out = f(k, fa[k], out);
        }
        return out;
    }; };
}
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
export var singleton = function (k, a) {
    var _a;
    return (_a = {}, _a[k] = a, _a);
};
export function traverseWithIndex(F) {
    var traverseWithIndexOF = _traverseWithIndex(S.Ord)(F);
    return function (f) { return function (ta) { return traverseWithIndexOF(ta, f); }; };
}
export function traverse(F) {
    var traverseOF = _traverse(S.Ord)(F);
    return function (f) { return function (ta) { return traverseOF(ta, f); }; };
}
export function sequence(F) {
    return _sequence(S.Ord)(F);
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
export function partitionMapWithIndex(f) {
    return function (r) {
        var left = {};
        var right = {};
        for (var k in r) {
            if (_.has.call(r, k)) {
                var e = f(k, r[k]);
                switch (e._tag) {
                    case 'Left':
                        left[k] = e.left;
                        break;
                    case 'Right':
                        right[k] = e.right;
                        break;
                }
            }
        }
        return separated(left, right);
    };
}
export function partitionWithIndex(predicateWithIndex) {
    return function (r) {
        var left = {};
        var right = {};
        for (var k in r) {
            if (_.has.call(r, k)) {
                var a = r[k];
                if (predicateWithIndex(k, a)) {
                    right[k] = a;
                }
                else {
                    left[k] = a;
                }
            }
        }
        return separated(left, right);
    };
}
export function filterMapWithIndex(f) {
    return function (r) {
        var out = {};
        for (var k in r) {
            if (_.has.call(r, k)) {
                var ob = f(k, r[k]);
                if (_.isSome(ob)) {
                    out[k] = ob.value;
                }
            }
        }
        return out;
    };
}
export function filterWithIndex(predicateWithIndex) {
    return function (fa) {
        var out = {};
        var changed = false;
        for (var key in fa) {
            if (_.has.call(fa, key)) {
                var a = fa[key];
                if (predicateWithIndex(key, a)) {
                    out[key] = a;
                }
                else {
                    changed = true;
                }
            }
        }
        return changed ? out : fa;
    };
}
export function fromFoldable(M, F) {
    var fromFoldableMapM = fromFoldableMap(M, F);
    return function (fka) { return fromFoldableMapM(fka, identity); };
}
export function fromFoldableMap(M, F) {
    return function (ta, f) {
        return F.reduce(ta, {}, function (r, a) {
            var _a = f(a), k = _a[0], b = _a[1];
            r[k] = _.has.call(r, k) ? M.concat(r[k], b) : b;
            return r;
        });
    };
}
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
export var toEntries = toReadonlyArray;
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
export var fromEntries = function (fa) {
    var out = {};
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var a = fa_1[_i];
        out[a[0]] = a[1];
    }
    return out;
};
export function every(predicate) {
    return function (r) {
        for (var k in r) {
            if (!predicate(r[k])) {
                return false;
            }
        }
        return true;
    };
}
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
export function some(predicate) {
    return function (r) {
        for (var k in r) {
            if (predicate(r[k])) {
                return true;
            }
        }
        return false;
    };
}
export function elem(E) {
    return function (a, fa) {
        if (fa === undefined) {
            var elemE_1 = elem(E);
            return function (fa) { return elemE_1(a, fa); };
        }
        for (var k in fa) {
            if (E.equals(fa[k], a)) {
                return true;
            }
        }
        return false;
    };
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
export var union = function (M) {
    return function (second) {
        return function (first) {
            if (isEmpty(first)) {
                return second;
            }
            if (isEmpty(second)) {
                return first;
            }
            var out = {};
            for (var k in first) {
                if (has(k, second)) {
                    out[k] = M.concat(first[k], second[k]);
                }
                else {
                    out[k] = first[k];
                }
            }
            for (var k in second) {
                if (!has(k, out)) {
                    out[k] = second[k];
                }
            }
            return out;
        };
    };
};
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
export var intersection = function (M) {
    return function (second) {
        return function (first) {
            if (isEmpty(first) || isEmpty(second)) {
                return empty;
            }
            var out = {};
            for (var k in first) {
                if (has(k, second)) {
                    out[k] = M.concat(first[k], second[k]);
                }
            }
            return out;
        };
    };
};
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
export var difference = function (second) {
    return function (first) {
        if (isEmpty(first)) {
            return second;
        }
        if (isEmpty(second)) {
            return first;
        }
        var out = {};
        for (var k in first) {
            if (!has(k, second)) {
                out[k] = first[k];
            }
        }
        for (var k in second) {
            if (!has(k, first)) {
                out[k] = second[k];
            }
        }
        return out;
    };
};
/** @internal */
export var _map = function (fa, f) { return pipe(fa, map(f)); };
/** @internal */
/* istanbul ignore next */
export var _mapWithIndex = function (fa, f) { return pipe(fa, mapWithIndex(f)); };
/** @internal */
/* istanbul ignore next */
export var _reduce = function (O) {
    var reduceO = reduce(O);
    return function (fa, b, f) { return pipe(fa, reduceO(b, f)); };
};
/** @internal */
export var _foldMap = function (O) { return function (M) {
    var foldMapM = foldMap(O)(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
}; };
/** @internal */
/* istanbul ignore next */
export var _reduceRight = function (O) {
    var reduceRightO = reduceRight(O);
    return function (fa, b, f) { return pipe(fa, reduceRightO(b, f)); };
};
/** @internal */
/* istanbul ignore next */
export var _filter = function (fa, predicate) {
    return pipe(fa, filter(predicate));
};
/** @internal */
/* istanbul ignore next */
export var _filterMap = function (fa, f) { return pipe(fa, filterMap(f)); };
/** @internal */
/* istanbul ignore next */
export var _partition = function (fa, predicate) { return pipe(fa, partition(predicate)); };
/** @internal */
/* istanbul ignore next */
export var _partitionMap = function (fa, f) { return pipe(fa, partitionMap(f)); };
/** @internal */
/* istanbul ignore next */
export var _reduceWithIndex = function (O) {
    var reduceWithIndexO = reduceWithIndex(O);
    return function (fa, b, f) { return pipe(fa, reduceWithIndexO(b, f)); };
};
/** @internal */
export var _foldMapWithIndex = function (O) {
    var foldMapWithIndexO = foldMapWithIndex(O);
    return function (M) {
        var foldMapWithIndexM = foldMapWithIndexO(M);
        return function (fa, f) { return pipe(fa, foldMapWithIndexM(f)); };
    };
};
/** @internal */
/* istanbul ignore next */
export var _reduceRightWithIndex = function (O) {
    var reduceRightWithIndexO = reduceRightWithIndex(O);
    return function (fa, b, f) { return pipe(fa, reduceRightWithIndexO(b, f)); };
};
/** @internal */
/* istanbul ignore next */
export var _partitionMapWithIndex = function (fa, f) { return pipe(fa, partitionMapWithIndex(f)); };
/** @internal */
/* istanbul ignore next */
export var _partitionWithIndex = function (fa, predicateWithIndex) {
    return pipe(fa, partitionWithIndex(predicateWithIndex));
};
/** @internal */
/* istanbul ignore next */
export var _filterMapWithIndex = function (fa, f) { return pipe(fa, filterMapWithIndex(f)); };
/** @internal */
/* istanbul ignore next */
export var _filterWithIndex = function (fa, predicateWithIndex) { return pipe(fa, filterWithIndex(predicateWithIndex)); };
/** @internal */
export var _traverse = function (O) {
    var traverseWithIndexO = _traverseWithIndex(O);
    return function (F) {
        var traverseWithIndexOF = traverseWithIndexO(F);
        return function (ta, f) { return traverseWithIndexOF(ta, flow(SK, f)); };
    };
};
/** @internal */
export var _sequence = function (O) {
    var traverseO = _traverse(O);
    return function (F) {
        var traverseOF = traverseO(F);
        return function (ta) { return traverseOF(ta, identity); };
    };
};
var _traverseWithIndex = function (O) {
    return function (F) {
        var keysO = keys_(O);
        return function (ta, f) {
            var ks = keysO(ta);
            if (ks.length === 0) {
                return F.of(empty);
            }
            var fr = F.of({});
            var _loop_1 = function (key) {
                fr = F.ap(F.map(fr, function (r) { return function (b) {
                    var _a;
                    return Object.assign({}, r, (_a = {}, _a[key] = b, _a));
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
export var filter = function (predicate) {
    return filterWithIndex(function (_, a) { return predicate(a); });
};
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
export var filterMap = function (f) { return filterMapWithIndex(function (_, a) { return f(a); }); };
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
export var partition = function (predicate) {
    return partitionWithIndex(function (_, a) { return predicate(a); });
};
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
export var partitionMap = function (f) {
    return partitionMapWithIndex(function (_, a) { return f(a); });
};
export function reduce() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 1) {
        var reduceWithIndexO_1 = reduceWithIndex(args[0]);
        return function (b, f) { return reduceWithIndexO_1(b, function (_, b, a) { return f(b, a); }); };
    }
    return reduce(S.Ord).apply(void 0, args);
}
export function foldMap(O) {
    if ('compare' in O) {
        var foldMapWithIndexO_1 = foldMapWithIndex(O);
        return function (M) {
            var foldMapWithIndexM = foldMapWithIndexO_1(M);
            return function (f) { return foldMapWithIndexM(function (_, a) { return f(a); }); };
        };
    }
    return foldMap(S.Ord)(O);
}
export function reduceRight() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 1) {
        var reduceRightWithIndexO_1 = reduceRightWithIndex(args[0]);
        return function (b, f) { return reduceRightWithIndexO_1(b, function (_, b, a) { return f(b, a); }); };
    }
    return reduceRight(S.Ord).apply(void 0, args);
}
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
export var compact = function (r) {
    var out = {};
    for (var k in r) {
        if (_.has.call(r, k)) {
            var oa = r[k];
            if (_.isSome(oa)) {
                out[k] = oa.value;
            }
        }
    }
    return out;
};
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
export var separate = function (r) {
    var left = {};
    var right = {};
    for (var k in r) {
        if (_.has.call(r, k)) {
            var e = r[k];
            if (_.isLeft(e)) {
                left[k] = e.left;
            }
            else {
                right[k] = e.right;
            }
        }
    }
    return separated(left, right);
};
/**
 * @category type lambdas
 * @since 2.5.0
 */
export var URI = 'ReadonlyRecord';
export function getShow(O) {
    if ('compare' in O) {
        return function (S) { return ({
            show: function (r) {
                var elements = collect(O)(function (k, a) { return "".concat(JSON.stringify(k), ": ").concat(S.show(a)); })(r).join(', ');
                return elements === '' ? '{}' : "{ ".concat(elements, " }");
            }
        }); };
    }
    return getShow(S.Ord)(O);
}
export function getEq(E) {
    var isSubrecordE = isSubrecord(E);
    return fromEquals(function (x, y) { return isSubrecordE(x)(y) && isSubrecordE(y)(x); });
}
export function getMonoid(S) {
    return {
        concat: function (first, second) {
            if (isEmpty(first)) {
                return second;
            }
            if (isEmpty(second)) {
                return first;
            }
            var r = Object.assign({}, first);
            for (var k in second) {
                if (_.has.call(second, k)) {
                    r[k] = _.has.call(first, k) ? S.concat(first[k], second[k]) : second[k];
                }
            }
            return r;
        },
        empty: empty
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
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
 * Produces a `Foldable` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * Produces a `FoldableWithIndex1` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * Produces a `Traversable` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * Produces a `TraversableWithIndex` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
export var getUnionSemigroup = function (S) {
    var unionS = union(S);
    return {
        concat: function (first, second) { return unionS(second)(first); }
    };
};
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
export var getUnionMonoid = function (S) { return ({
    concat: getUnionSemigroup(S).concat,
    empty: empty
}); };
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
export var getIntersectionSemigroup = function (S) {
    var intersectionS = intersection(S);
    return {
        concat: function (first, second) { return intersectionS(second)(first); }
    };
};
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
 * Use `getTraversableWithIndex` instead.
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
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var insertAt = upsertAt;
export function hasOwnProperty(k, r) {
    return _.has.call(r === undefined ? this : r, k);
}
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RR.Functor` instead of `RR.readonlyRecord`
 * (where `RR` is from `import RR from 'fp-ts/ReadonlyRecord'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var readonlyRecord = {
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
