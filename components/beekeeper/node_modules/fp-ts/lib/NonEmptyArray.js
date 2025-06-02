"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceRightWithIndex = exports.reduceRight = exports.reduceWithIndex = exports.reduce = exports.mapWithIndex = exports.map = exports.flatten = exports.duplicate = exports.extend = exports.flatMap = exports.ap = exports.alt = exports.altW = exports.chunksOf = exports.splitAt = exports.chop = exports.chainWithIndex = exports.foldMap = exports.foldMapWithIndex = exports.intersperse = exports.prependAll = exports.unzip = exports.zipWith = exports.of = exports.copy = exports.modifyAt = exports.updateAt = exports.insertAt = exports.sort = exports.groupBy = exports.reverse = exports.unappend = exports.unprepend = exports.range = exports.replicate = exports.makeBy = exports.fromArray = exports.fromReadonlyNonEmptyArray = exports.rotate = exports.union = exports.sortBy = exports.uniq = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.append = exports.appendW = exports.prepend = exports.prependW = exports.isOutOfBound = exports.isNonEmpty = void 0;
exports.snoc = exports.unsnoc = exports.uncons = exports.filterWithIndex = exports.chain = exports.intercalate = exports.updateLast = exports.modifyLast = exports.updateHead = exports.modifyHead = exports.matchRight = exports.matchLeft = exports.concatAll = exports.max = exports.min = exports.init = exports.last = exports.tail = exports.head = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.Comonad = exports.Alt = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.Monad = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getUnionSemigroup = exports.getEq = exports.getSemigroup = exports.getShow = exports.URI = exports.extract = exports.traverseWithIndex = exports.sequence = exports.traverse = void 0;
exports.nonEmptyArray = exports.fold = exports.prependToAll = void 0;
exports.concatW = concatW;
exports.concat = concat;
exports.group = group;
exports.zip = zip;
exports.groupSort = groupSort;
exports.filter = filter;
exports.cons = cons;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var Ord_1 = require("./Ord");
var RNEA = __importStar(require("./ReadonlyNonEmptyArray"));
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var isNonEmpty = function (as) { return as.length > 0; };
exports.isNonEmpty = isNonEmpty;
/**
 * @internal
 */
var isOutOfBound = function (i, as) { return i < 0 || i >= as.length; };
exports.isOutOfBound = isOutOfBound;
/**
 * @internal
 */
var prependW = function (head) {
    return function (tail) {
        return __spreadArray([head], tail, true);
    };
};
exports.prependW = prependW;
/**
 * @internal
 */
exports.prepend = exports.prependW;
/**
 * @internal
 */
var appendW = function (end) {
    return function (init) {
        return __spreadArray(__spreadArray([], init, true), [end], false);
    };
};
exports.appendW = appendW;
/**
 * @internal
 */
exports.append = exports.appendW;
/**
 * @internal
 */
var unsafeInsertAt = function (i, a, as) {
    if ((0, exports.isNonEmpty)(as)) {
        var xs = (0, exports.fromReadonlyNonEmptyArray)(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
exports.unsafeInsertAt = unsafeInsertAt;
/**
 * @internal
 */
var unsafeUpdateAt = function (i, a, as) {
    var xs = (0, exports.fromReadonlyNonEmptyArray)(as);
    xs[i] = a;
    return xs;
};
exports.unsafeUpdateAt = unsafeUpdateAt;
/**
 * Remove duplicates from a `NonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.11.0
 */
var uniq = function (E) {
    return function (as) {
        if (as.length === 1) {
            return (0, exports.copy)(as);
        }
        var out = [(0, exports.head)(as)];
        var rest = (0, exports.tail)(as);
        var _loop_1 = function (a) {
            if (out.every(function (o) { return !E.equals(o, a); })) {
                out.push(a);
            }
        };
        for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
            var a = rest_1[_i];
            _loop_1(a);
        }
        return out;
    };
};
exports.uniq = uniq;
/**
 * Sort the elements of a `NonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 *
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = NEA.sortBy([byName, byAge])
 *
 * const persons: NEA.NonEmptyArray<Person> = [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 },
 *   { name: 'b', age: 2 }
 * ]
 *
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.11.0
 */
var sortBy = function (ords) {
    if ((0, exports.isNonEmpty)(ords)) {
        var M = (0, Ord_1.getMonoid)();
        return (0, exports.sort)(ords.reduce(M.concat, M.empty));
    }
    return exports.copy;
};
exports.sortBy = sortBy;
/**
 * @since 2.11.0
 */
var union = function (E) {
    var uniqE = (0, exports.uniq)(E);
    return function (second) { return function (first) { return uniqE((0, function_1.pipe)(first, concat(second))); }; };
};
exports.union = union;
/**
 * Rotate a `NonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @since 2.11.0
 */
var rotate = function (n) {
    return function (as) {
        var len = as.length;
        var m = Math.round(n) % len;
        if ((0, exports.isOutOfBound)(Math.abs(m), as) || m === 0) {
            return (0, exports.copy)(as);
        }
        if (m < 0) {
            var _a = (0, exports.splitAt)(-m)(as), f = _a[0], s = _a[1];
            return (0, function_1.pipe)(s, concat(f));
        }
        else {
            return (0, exports.rotate)(m - len)(as);
        }
    };
};
exports.rotate = rotate;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromReadonlyNonEmptyArray = _.fromReadonlyNonEmptyArray;
/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @category conversions
 * @since 2.0.0
 */
var fromArray = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(as) : _.none); };
exports.fromArray = fromArray;
/**
 * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
var makeBy = function (f) {
    return function (n) {
        var j = Math.max(0, Math.floor(n));
        var out = [f(0)];
        for (var i = 1; i < j; i++) {
            out.push(f(i));
        }
        return out;
    };
};
exports.makeBy = makeBy;
/**
 * Create a `NonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
var replicate = function (a) { return (0, exports.makeBy)(function () { return a; }); };
exports.replicate = replicate;
/**
 * Create a `NonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
var range = function (start, end) {
    return start <= end ? (0, exports.makeBy)(function (i) { return start + i; })(end - start + 1) : [start];
};
exports.range = range;
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3]), [1, [2, 3]])
 *
 * @since 2.9.0
 */
var unprepend = function (as) { return [(0, exports.head)(as), (0, exports.tail)(as)]; };
exports.unprepend = unprepend;
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @since 2.9.0
 */
var unappend = function (as) { return [(0, exports.init)(as), (0, exports.last)(as)]; };
exports.unappend = unappend;
function concatW(second) {
    return function (first) { return first.concat(second); };
}
function concat(x, y) {
    return y ? x.concat(y) : function (y) { return y.concat(x); };
}
/**
 * @since 2.0.0
 */
var reverse = function (as) { return __spreadArray([(0, exports.last)(as)], as.slice(0, -1).reverse(), true); };
exports.reverse = reverse;
function group(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return [];
        }
        var out = [];
        var head = as[0];
        var nea = [head];
        for (var i = 1; i < len; i++) {
            var a = as[i];
            if (E.equals(a, head)) {
                nea.push(a);
            }
            else {
                out.push(nea);
                head = a;
                nea = [head];
            }
        }
        out.push(nea);
        return out;
    };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @since 2.0.0
 */
var groupBy = function (f) {
    return function (as) {
        var out = {};
        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            var k = f(a);
            if (_.has.call(out, k)) {
                out[k].push(a);
            }
            else {
                out[k] = [a];
            }
        }
        return out;
    };
};
exports.groupBy = groupBy;
/**
 * @since 2.0.0
 */
var sort = function (O) {
    return function (as) {
        return as.slice().sort(O.compare);
    };
};
exports.sort = sort;
/**
 * @since 2.0.0
 */
var insertAt = function (i, a) {
    return function (as) {
        return i < 0 || i > as.length ? _.none : _.some((0, exports.unsafeInsertAt)(i, a, as));
    };
};
exports.insertAt = insertAt;
/**
 * @since 2.0.0
 */
var updateAt = function (i, a) {
    return (0, exports.modifyAt)(i, function () { return a; });
};
exports.updateAt = updateAt;
/**
 * @since 2.0.0
 */
var modifyAt = function (i, f) {
    return function (as) {
        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeUpdateAt)(i, f(as[i]), as));
    };
};
exports.modifyAt = modifyAt;
/**
 * @since 2.0.0
 */
exports.copy = exports.fromReadonlyNonEmptyArray;
/**
 * @category constructors
 * @since 2.0.0
 */
var of = function (a) { return [a]; };
exports.of = of;
/**
 * @since 2.5.1
 */
var zipWith = function (as, bs, f) {
    var cs = [f(as[0], bs[0])];
    var len = Math.min(as.length, bs.length);
    for (var i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
exports.zipWith = zipWith;
function zip(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip(bs, as); };
    }
    return (0, exports.zipWith)(as, bs, function (a, b) { return [a, b]; });
}
/**
 * @since 2.5.1
 */
var unzip = function (abs) {
    var fa = [abs[0][0]];
    var fb = [abs[0][1]];
    for (var i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
exports.unzip = unzip;
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
var prependAll = function (middle) {
    return function (as) {
        var out = [middle, as[0]];
        for (var i = 1; i < as.length; i++) {
            out.push(middle, as[i]);
        }
        return out;
    };
};
exports.prependAll = prependAll;
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
var intersperse = function (middle) {
    return function (as) {
        var rest = (0, exports.tail)(as);
        return (0, exports.isNonEmpty)(rest) ? (0, function_1.pipe)(rest, (0, exports.prependAll)(middle), (0, exports.prepend)((0, exports.head)(as))) : (0, exports.copy)(as);
    };
};
exports.intersperse = intersperse;
/**
 * @category folding
 * @since 2.0.0
 */
exports.foldMapWithIndex = RNEA.foldMapWithIndex;
/**
 * @category folding
 * @since 2.0.0
 */
exports.foldMap = RNEA.foldMap;
/**
 * @category sequencing
 * @since 2.10.0
 */
var chainWithIndex = function (f) {
    return function (as) {
        var out = (0, exports.fromReadonlyNonEmptyArray)(f(0, (0, exports.head)(as)));
        for (var i = 1; i < as.length; i++) {
            var bs = f(i, as[i]);
            for (var j = 0; j < bs.length; j++) {
                out.push(bs[j]);
            }
        }
        return out;
    };
};
exports.chainWithIndex = chainWithIndex;
/**
 * @since 2.10.0
 */
var chop = function (f) {
    return function (as) {
        var _a = f(as), b = _a[0], rest = _a[1];
        var out = [b];
        var next = rest;
        while ((0, exports.isNonEmpty)(next)) {
            var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
            out.push(b_1);
            next = rest_2;
        }
        return out;
    };
};
exports.chop = chop;
/**
 * Splits a `NonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @since 2.10.0
 */
var splitAt = function (n) {
    return function (as) {
        var m = Math.max(1, n);
        return m >= as.length ? [(0, exports.copy)(as), []] : [(0, function_1.pipe)(as.slice(1, m), (0, exports.prepend)((0, exports.head)(as))), as.slice(m)];
    };
};
exports.splitAt = splitAt;
/**
 * @since 2.10.0
 */
var chunksOf = function (n) { return (0, exports.chop)((0, exports.splitAt)(n)); };
exports.chunksOf = chunksOf;
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/* istanbul ignore next */
var _mapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapWithIndex)(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = (0, exports.foldMap)(M);
    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = (0, exports.traverse)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
/* istanbul ignore next */
var _reduceWithIndex = function (fa, b, f) {
    return (0, function_1.pipe)(fa, (0, exports.reduceWithIndex)(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex = function (M) {
    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex = function (fa, b, f) {
    return (0, function_1.pipe)(fa, (0, exports.reduceRightWithIndex)(b, f));
};
/* istanbul ignore next */
var _traverseWithIndex = function (F) {
    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseWithIndexF(f)); };
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3] as NEA.NonEmptyArray<number>,
 *     NEA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
var altW = function (that) {
    return function (as) {
        return (0, function_1.pipe)(as, concatW(that()));
    };
};
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `NonEmptyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     NEA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.6.2
 */
exports.alt = exports.altW;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @since 2.0.0
 */
var ap = function (as) {
    return (0, exports.flatMap)(function (f) { return (0, function_1.pipe)(as, (0, exports.map)(f)); });
};
exports.ap = ap;
/**
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     NEA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    return (0, function_1.pipe)(ma, (0, exports.chainWithIndex)(function (i, a) { return f(a, i); }));
});
/**
 * @since 2.0.0
 */
var extend = function (f) {
    return function (as) {
        var next = (0, exports.tail)(as);
        var out = [f(as)];
        while ((0, exports.isNonEmpty)(next)) {
            out.push(f(next));
            next = (0, exports.tail)(next);
        }
        return out;
    };
};
exports.extend = extend;
/**
 * @since 2.5.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * @category sequencing
 * @since 2.5.0
 */
exports.flatten = (0, exports.flatMap)(function_1.identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return (0, exports.mapWithIndex)(function (_, a) { return f(a); }); };
exports.map = map;
/**
 * @category mapping
 * @since 2.0.0
 */
var mapWithIndex = function (f) {
    return function (as) {
        var out = [f(0, (0, exports.head)(as))];
        for (var i = 1; i < as.length; i++) {
            out.push(f(i, as[i]));
        }
        return out;
    };
};
exports.mapWithIndex = mapWithIndex;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduce = RNEA.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduceWithIndex = RNEA.reduceWithIndex;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduceRight = RNEA.reduceRight;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduceRightWithIndex = RNEA.reduceRightWithIndex;
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) { return (0, exports.traverseWithIndex)(F)(function (_, a) { return a; }); };
exports.sequence = sequence;
/**
 * @category sequencing
 * @since 2.6.3
 */
var traverseWithIndex = function (F) {
    return function (f) {
        return function (as) {
            var out = F.map(f(0, (0, exports.head)(as)), exports.of);
            for (var i = 1; i < as.length; i++) {
                out = F.ap(F.map(out, function (bs) { return function (b) { return (0, function_1.pipe)(bs, (0, exports.append)(b)); }; }), f(i, as[i]));
            }
            return out;
        };
    };
};
exports.traverseWithIndex = traverseWithIndex;
/**
 * @since 2.7.0
 */
exports.extract = RNEA.head;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'NonEmptyArray';
/**
 * @category instances
 * @since 2.0.0
 */
exports.getShow = RNEA.getShow;
/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function () { return ({
    concat: concat
}); };
exports.getSemigroup = getSemigroup;
/**
 * @example
 * import { getEq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.0.0
 */
exports.getEq = RNEA.getEq;
/**
 * @since 2.11.0
 */
var getUnionSemigroup = function (E) {
    var unionE = (0, exports.union)(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
exports.getUnionSemigroup = getUnionSemigroup;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.FunctorWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.5.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.5.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category sequencing
 * @since 2.5.0
 */
exports.chainFirst = 
/*#__PURE__*/ (0, Chain_1.chainFirst)(exports.Chain);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.FoldableWithIndex = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.TraversableWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Comonad = {
    URI: exports.URI,
    map: _map,
    extend: _extend,
    extract: exports.extract
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = (0, Chain_1.bind)(exports.Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
exports.head = RNEA.head;
/**
 * @since 2.0.0
 */
var tail = function (as) { return as.slice(1); };
exports.tail = tail;
/**
 * @since 2.0.0
 */
exports.last = RNEA.last;
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.2.0
 */
var init = function (as) { return as.slice(0, -1); };
exports.init = init;
/**
 * @since 2.0.0
 */
exports.min = RNEA.min;
/**
 * @since 2.0.0
 */
exports.max = RNEA.max;
/**
 * @since 2.10.0
 */
var concatAll = function (S) {
    return function (as) {
        return as.reduce(S.concat);
    };
};
exports.concatAll = concatAll;
/**
 * Break an `Array` into its first element and remaining elements.
 *
 * @category pattern matching
 * @since 2.11.0
 */
var matchLeft = function (f) {
    return function (as) {
        return f((0, exports.head)(as), (0, exports.tail)(as));
    };
};
exports.matchLeft = matchLeft;
/**
 * Break an `Array` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.11.0
 */
var matchRight = function (f) {
    return function (as) {
        return f((0, exports.init)(as), (0, exports.last)(as));
    };
};
exports.matchRight = matchRight;
/**
 * Apply a function to the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyHead = function (f) {
    return function (as) {
        return __spreadArray([f((0, exports.head)(as))], (0, exports.tail)(as), true);
    };
};
exports.modifyHead = modifyHead;
/**
 * Change the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
var updateHead = function (a) { return (0, exports.modifyHead)(function () { return a; }); };
exports.updateHead = updateHead;
/**
 * Apply a function to the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyLast = function (f) {
    return function (as) {
        return (0, function_1.pipe)((0, exports.init)(as), (0, exports.append)(f((0, exports.last)(as))));
    };
};
exports.modifyLast = modifyLast;
/**
 * Change the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
var updateLast = function (a) { return (0, exports.modifyLast)(function () { return a; }); };
exports.updateLast = updateLast;
/**
 * Places an element in between members of a `NonEmptyArray`, then folds the results using the provided `Semigroup`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
exports.intercalate = RNEA.intercalate;
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chain = exports.flatMap;
function groupSort(O) {
    var sortO = (0, exports.sort)(O);
    var groupO = group(O);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? groupO(sortO(as)) : []); };
}
function filter(predicate) {
    return (0, exports.filterWithIndex)(function (_, a) { return predicate(a); });
}
/**
 * Use [`filterWithIndex`](./Array.ts.html#filterwithindex) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var filterWithIndex = function (predicate) {
    return function (as) {
        return (0, exports.fromArray)(as.filter(function (a, i) { return predicate(i, a); }));
    };
};
exports.filterWithIndex = filterWithIndex;
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
exports.uncons = exports.unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
exports.unsnoc = exports.unappend;
function cons(head, tail) {
    return tail === undefined ? (0, exports.prepend)(head) : (0, function_1.pipe)(tail, (0, exports.prepend)(head));
}
/**
 * Use [`append`](./Array.ts.html#append) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var snoc = function (init, end) { return (0, function_1.pipe)(init, (0, exports.append)(end)); };
exports.snoc = snoc;
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
exports.prependToAll = exports.prependAll;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.fold = RNEA.concatAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `NEA.Functor` instead of `NEA.nonEmptyArray`
 * (where `NEA` is from `import NEA from 'fp-ts/NonEmptyArray'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.nonEmptyArray = {
    URI: exports.URI,
    of: exports.of,
    map: _map,
    mapWithIndex: _mapWithIndex,
    ap: _ap,
    chain: exports.flatMap,
    extend: _extend,
    extract: exports.extract,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    alt: _alt
};
