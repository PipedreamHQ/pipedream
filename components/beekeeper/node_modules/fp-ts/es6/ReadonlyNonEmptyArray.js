var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import { fromEquals } from './Eq';
import { dual, flow, identity, pipe, SK } from './function';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor';
import * as _ from './internal';
import { getMonoid } from './Ord';
import * as Se from './Semigroup';
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
export var empty = _.emptyReadonlyArray;
/**
 * @internal
 */
export var isNonEmpty = _.isNonEmpty;
/**
 * @internal
 */
export var isOutOfBound = function (i, as) { return i < 0 || i >= as.length; };
/**
 * @internal
 */
export var prependW = function (head) {
    return function (tail) {
        return __spreadArray([head], tail, true);
    };
};
/**
 * @internal
 */
export var prepend = prependW;
/**
 * @internal
 */
export var appendW = function (end) {
    return function (init) {
        return __spreadArray(__spreadArray([], init, true), [end], false);
    };
};
/**
 * @internal
 */
export var append = appendW;
/**
 * @internal
 */
export var unsafeInsertAt = function (i, a, as) {
    if (isNonEmpty(as)) {
        var xs = _.fromReadonlyNonEmptyArray(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
/**
 * @internal
 */
export var unsafeUpdateAt = function (i, a, as) {
    if (as[i] === a) {
        return as;
    }
    else {
        var xs = _.fromReadonlyNonEmptyArray(as);
        xs[i] = a;
        return xs;
    }
};
/**
 * Remove duplicates from a `ReadonlyNonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.11.0
 */
export var uniq = function (E) {
    return function (as) {
        if (as.length === 1) {
            return as;
        }
        var out = [head(as)];
        var rest = tail(as);
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
/**
 * Sort the elements of a `ReadonlyNonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
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
 * const sortByNameByAge = RNEA.sortBy([byName, byAge])
 *
 * const persons: RNEA.ReadonlyNonEmptyArray<Person> = [
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
export var sortBy = function (ords) {
    if (isNonEmpty(ords)) {
        var M = getMonoid();
        return sort(ords.reduce(M.concat, M.empty));
    }
    return identity;
};
/**
 * @since 2.11.0
 */
export var union = function (E) {
    var uniqE = uniq(E);
    return function (second) { return function (first) { return uniqE(pipe(first, concat(second))); }; };
};
/**
 * Rotate a `ReadonlyNonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @since 2.11.0
 */
export var rotate = function (n) {
    return function (as) {
        var len = as.length;
        var m = Math.round(n) % len;
        if (isOutOfBound(Math.abs(m), as) || m === 0) {
            return as;
        }
        if (m < 0) {
            var _a = splitAt(-m)(as), f = _a[0], s = _a[1];
            return pipe(s, concat(f));
        }
        else {
            return rotate(m - len)(as);
        }
    };
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Return a `ReadonlyNonEmptyArray` from a `ReadonlyArray` returning `none` if the input is empty.
 *
 * @category conversions
 * @since 2.5.0
 */
export var fromReadonlyArray = function (as) {
    return isNonEmpty(as) ? _.some(as) : _.none;
};
/**
 * Return a `ReadonlyNonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
export var makeBy = function (f) {
    return function (n) {
        var j = Math.max(0, Math.floor(n));
        var out = [f(0)];
        for (var i = 1; i < j; i++) {
            out.push(f(i));
        }
        return out;
    };
};
/**
 * Create a `ReadonlyNonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
export var replicate = function (a) { return makeBy(function () { return a; }); };
/**
 * Create a `ReadonlyNonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
export var range = function (start, end) {
    return start <= end ? makeBy(function (i) { return start + i; })(end - start + 1) : [start];
};
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
 *
 * @since 2.9.0
 */
export var unprepend = function (as) { return [head(as), tail(as)]; };
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @since 2.9.0
 */
export var unappend = function (as) { return [init(as), last(as)]; };
/**
 * @category conversions
 * @since 2.5.0
 */
export var fromArray = function (as) { return fromReadonlyArray(as.slice()); };
export function concatW(second) {
    return function (first) { return first.concat(second); };
}
export function concat(x, y) {
    return y ? x.concat(y) : function (y) { return y.concat(x); };
}
/**
 * @since 2.5.0
 */
export var reverse = function (as) {
    return as.length === 1 ? as : __spreadArray([last(as)], as.slice(0, -1).reverse(), true);
};
export function group(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return empty;
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
 * import { groupBy } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @since 2.5.0
 */
export var groupBy = function (f) {
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
/**
 * @since 2.5.0
 */
export var sort = function (O) {
    return function (as) {
        return as.length === 1 ? as : as.slice().sort(O.compare);
    };
};
/**
 * @since 2.5.0
 */
export var updateAt = function (i, a) {
    return modifyAt(i, function () { return a; });
};
/**
 * @since 2.5.0
 */
export var modifyAt = function (i, f) {
    return function (as) {
        return isOutOfBound(i, as) ? _.none : _.some(unsafeUpdateAt(i, f(as[i]), as));
    };
};
/**
 * @since 2.5.1
 */
export var zipWith = function (as, bs, f) {
    var cs = [f(as[0], bs[0])];
    var len = Math.min(as.length, bs.length);
    for (var i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
export function zip(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip(bs, as); };
    }
    return zipWith(as, bs, function (a, b) { return [a, b]; });
}
/**
 * @since 2.5.1
 */
export var unzip = function (abs) {
    var fa = [abs[0][0]];
    var fb = [abs[0][1]];
    for (var i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
export var prependAll = function (middle) {
    return function (as) {
        var out = [middle, as[0]];
        for (var i = 1; i < as.length; i++) {
            out.push(middle, as[i]);
        }
        return out;
    };
};
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export var intersperse = function (middle) {
    return function (as) {
        var rest = tail(as);
        return isNonEmpty(rest) ? pipe(rest, prependAll(middle), prepend(head(as))) : as;
    };
};
/**
 * @category sequencing
 * @since 2.10.0
 */
export var chainWithIndex = function (f) {
    return function (as) {
        var out = _.fromReadonlyNonEmptyArray(f(0, head(as)));
        for (var i = 1; i < as.length; i++) {
            var bs = f(i, as[i]);
            for (var j = 0; j < bs.length; j++) {
                out.push(bs[j]);
            }
        }
        return out;
    };
};
/**
 * A useful recursion pattern for processing a `ReadonlyNonEmptyArray` to produce a new `ReadonlyNonEmptyArray`, often used for "chopping" up the input
 * `ReadonlyNonEmptyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyNonEmptyArray` and produce a
 * value and the tail of the `ReadonlyNonEmptyArray`.
 *
 * @since 2.10.0
 */
export var chop = function (f) {
    return function (as) {
        var _a = f(as), b = _a[0], rest = _a[1];
        var out = [b];
        var next = rest;
        while (isNonEmpty(next)) {
            var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
            out.push(b_1);
            next = rest_2;
        }
        return out;
    };
};
/**
 * Splits a `ReadonlyNonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @since 2.10.0
 */
export var splitAt = function (n) {
    return function (as) {
        var m = Math.max(1, n);
        return m >= as.length ? [as, empty] : [pipe(as.slice(1, m), prepend(head(as))), as.slice(m)];
    };
};
/**
 * Splits a `ReadonlyNonEmptyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyNonEmptyArray`.
 *
 * @since 2.10.0
 */
export var chunksOf = function (n) { return chop(splitAt(n)); };
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _mapWithIndex = function (fa, f) { return pipe(fa, mapWithIndex(f)); };
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return pipe(wa, extend(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return pipe(fa, reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = foldMap(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return pipe(fa, reduceRight(b, f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = traverse(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt = function (fa, that) { return pipe(fa, alt(that)); };
/* istanbul ignore next */
var _reduceWithIndex = function (fa, b, f) {
    return pipe(fa, reduceWithIndex(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex = function (M) {
    var foldMapWithIndexM = foldMapWithIndex(M);
    return function (fa, f) { return pipe(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex = function (fa, b, f) {
    return pipe(fa, reduceRightWithIndex(b, f));
};
/* istanbul ignore next */
var _traverseWithIndex = function (F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return pipe(ta, traverseWithIndexF(f)); };
};
/**
 * @category constructors
 * @since 2.5.0
 */
export var of = _.singleton;
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3] as RNEA.ReadonlyNonEmptyArray<number>,
 *     RNEA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
export var altW = function (that) {
    return function (as) {
        return pipe(as, concatW(that()));
    };
};
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `ReadonlyNonEmptyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RNEA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.6.2
 */
export var alt = altW;
/**
 * @since 2.5.0
 */
export var ap = function (as) { return flatMap(function (f) { return pipe(as, map(f)); }); };
/**
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RNEA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
export var flatMap = /*#__PURE__*/ dual(2, function (ma, f) {
    return pipe(ma, chainWithIndex(function (i, a) { return f(a, i); }));
});
/**
 * @since 2.5.0
 */
export var extend = function (f) {
    return function (as) {
        var next = tail(as);
        var out = [f(as)];
        while (isNonEmpty(next)) {
            out.push(f(next));
            next = tail(next);
        }
        return out;
    };
};
/**
 * @since 2.5.0
 */
export var duplicate = 
/*#__PURE__*/ extend(identity);
/**
 * @category sequencing
 * @since 2.5.0
 */
export var flatten = 
/*#__PURE__*/ flatMap(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.5.0
 */
export var map = function (f) {
    return mapWithIndex(function (_, a) { return f(a); });
};
/**
 * @category mapping
 * @since 2.5.0
 */
export var mapWithIndex = function (f) {
    return function (as) {
        var out = [f(0, head(as))];
        for (var i = 1; i < as.length; i++) {
            out.push(f(i, as[i]));
        }
        return out;
    };
};
/**
 * @category folding
 * @since 2.5.0
 */
export var reduce = function (b, f) {
    return reduceWithIndex(b, function (_, b, a) { return f(b, a); });
};
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category folding
 * @since 2.5.0
 */
export var foldMap = function (S) {
    return function (f) {
        return function (as) {
            return as.slice(1).reduce(function (s, a) { return S.concat(s, f(a)); }, f(as[0]));
        };
    };
};
/**
 * @category folding
 * @since 2.5.0
 */
export var reduceRight = function (b, f) {
    return reduceRightWithIndex(b, function (_, b, a) { return f(b, a); });
};
/**
 * @category folding
 * @since 2.5.0
 */
export var reduceWithIndex = function (b, f) {
    return function (as) {
        return as.reduce(function (b, a, i) { return f(i, b, a); }, b);
    };
};
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category folding
 * @since 2.5.0
 */
export var foldMapWithIndex = function (S) {
    return function (f) {
        return function (as) {
            return as.slice(1).reduce(function (s, a, i) { return S.concat(s, f(i + 1, a)); }, f(0, as[0]));
        };
    };
};
/**
 * @category folding
 * @since 2.5.0
 */
export var reduceRightWithIndex = function (b, f) {
    return function (as) {
        return as.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
    };
};
/**
 * @category traversing
 * @since 2.6.3
 */
export var traverse = function (F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @category traversing
 * @since 2.6.3
 */
export var sequence = function (F) { return traverseWithIndex(F)(SK); };
/**
 * @category sequencing
 * @since 2.6.3
 */
export var traverseWithIndex = function (F) {
    return function (f) {
        return function (as) {
            var out = F.map(f(0, head(as)), of);
            for (var i = 1; i < as.length; i++) {
                out = F.ap(F.map(out, function (bs) { return function (b) { return pipe(bs, append(b)); }; }), f(i, as[i]));
            }
            return out;
        };
    };
};
/**
 * @category Comonad
 * @since 2.6.3
 */
export var extract = _.head;
/**
 * @category type lambdas
 * @since 2.5.0
 */
export var URI = 'ReadonlyNonEmptyArray';
/**
 * @category instances
 * @since 2.5.0
 */
export var getShow = function (S) { return ({
    show: function (as) { return "[".concat(as.map(S.show).join(', '), "]"); }
}); };
/**
 * Builds a `Semigroup` instance for `ReadonlyNonEmptyArray`
 *
 * @category instances
 * @since 2.5.0
 */
export var getSemigroup = function () { return ({
    concat: concat
}); };
/**
 * @example
 * import { getEq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.5.0
 */
export var getEq = function (E) {
    return fromEquals(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
/**
 * @since 2.11.0
 */
export var getUnionSemigroup = function (E) {
    var unionE = union(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
export var flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
export var Pointed = {
    URI: URI,
    of: of
};
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
 * @category instances
 * @since 2.10.0
 */
export var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.5.0
 */
export var apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.5.0
 */
export var apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * @category instances
 * @since 2.7.0
 */
export var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: flatMap
};
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
 *
 * @category sequencing
 * @since 2.5.0
 */
export var chainFirst = /*#__PURE__*/ chainFirst_(Chain);
/**
 * @category instances
 * @since 2.7.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Foldable = {
    URI: URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
export var FoldableWithIndex = {
    URI: URI,
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
export var Traversable = {
    URI: URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
export var TraversableWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Comonad = {
    URI: URI,
    map: _map,
    extend: _extend,
    extract: extract
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
export var Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
export var bindTo = /*#__PURE__*/ bindTo_(Functor);
var let_ = /*#__PURE__*/ let__(Functor);
export { 
/**
 * @category do notation
 * @since 2.13.0
 */
let_ as let };
/**
 * @category do notation
 * @since 2.8.0
 */
export var bind = /*#__PURE__*/ bind_(Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
export var apS = /*#__PURE__*/ apS_(Apply);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
export var head = extract;
/**
 * @since 2.5.0
 */
export var tail = _.tail;
/**
 * @since 2.5.0
 */
export var last = function (as) { return as[as.length - 1]; };
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.5.0
 */
export var init = function (as) { return as.slice(0, -1); };
/**
 * @since 2.5.0
 */
export var min = function (O) {
    var S = Se.min(O);
    return function (as) { return as.reduce(S.concat); };
};
/**
 * @since 2.5.0
 */
export var max = function (O) {
    var S = Se.max(O);
    return function (as) { return as.reduce(S.concat); };
};
/**
 * @since 2.10.0
 */
export var concatAll = function (S) {
    return function (as) {
        return as.reduce(S.concat);
    };
};
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export var matchLeft = function (f) {
    return function (as) {
        return f(head(as), tail(as));
    };
};
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export var matchRight = function (f) {
    return function (as) {
        return f(init(as), last(as));
    };
};
/**
 * Apply a function to the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export var modifyHead = function (f) {
    return function (as) {
        return __spreadArray([f(head(as))], tail(as), true);
    };
};
/**
 * Change the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export var updateHead = function (a) { return modifyHead(function () { return a; }); };
/**
 * Apply a function to the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export var modifyLast = function (f) {
    return function (as) {
        return pipe(init(as), append(f(last(as))));
    };
};
/**
 * Change the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export var updateLast = function (a) { return modifyLast(function () { return a; }); };
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`, then folds the results using the provided `Semigroup`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
export var intercalate = function (S) {
    var concatAllS = concatAll(S);
    return function (middle) { return flow(intersperse(middle), concatAllS); };
};
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.5.0
 */
export var chain = flatMap;
export function groupSort(O) {
    var sortO = sort(O);
    var groupO = group(O);
    return function (as) { return (isNonEmpty(as) ? groupO(sortO(as)) : empty); };
}
export function filter(predicate) {
    return filterWithIndex(function (_, a) { return predicate(a); });
}
/**
 * Use [`filterWithIndex`](./ReadonlyArray.ts.html#filterwithindex) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var filterWithIndex = function (predicate) {
    return function (as) {
        return fromReadonlyArray(as.filter(function (a, i) { return predicate(i, a); }));
    };
};
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export var uncons = unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export var unsnoc = unappend;
export function cons(head, tail) {
    return tail === undefined ? prepend(head) : pipe(tail, prepend(head));
}
/**
 * Use [`append`](./ReadonlyArray.ts.html#append) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var snoc = function (init, end) { return pipe(init, concat([end])); };
/**
 * Use [`insertAt`](./ReadonlyArray.ts.html#insertat) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var insertAt = function (i, a) {
    return function (as) {
        return i < 0 || i > as.length ? _.none : _.some(unsafeInsertAt(i, a, as));
    };
};
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export var prependToAll = prependAll;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var fold = concatAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RNEA.Functor` instead of `RNEA.readonlyNonEmptyArray`
 * (where `RNEA` is from `import RNEA from 'fp-ts/ReadonlyNonEmptyArray'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export var readonlyNonEmptyArray = {
    URI: URI,
    of: of,
    map: _map,
    mapWithIndex: _mapWithIndex,
    ap: _ap,
    chain: flatMap,
    extend: _extend,
    extract: extract,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    alt: _alt
};
