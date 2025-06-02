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
import { dual, identity, pipe } from './function';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor';
import * as _ from './internal';
import { getMonoid } from './Ord';
import * as RNEA from './ReadonlyNonEmptyArray';
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
export var isNonEmpty = function (as) { return as.length > 0; };
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
        var xs = fromReadonlyNonEmptyArray(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
/**
 * @internal
 */
export var unsafeUpdateAt = function (i, a, as) {
    var xs = fromReadonlyNonEmptyArray(as);
    xs[i] = a;
    return xs;
};
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
export var uniq = function (E) {
    return function (as) {
        if (as.length === 1) {
            return copy(as);
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
export var sortBy = function (ords) {
    if (isNonEmpty(ords)) {
        var M = getMonoid();
        return sort(ords.reduce(M.concat, M.empty));
    }
    return copy;
};
/**
 * @since 2.11.0
 */
export var union = function (E) {
    var uniqE = uniq(E);
    return function (second) { return function (first) { return uniqE(pipe(first, concat(second))); }; };
};
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
export var rotate = function (n) {
    return function (as) {
        var len = as.length;
        var m = Math.round(n) % len;
        if (isOutOfBound(Math.abs(m), as) || m === 0) {
            return copy(as);
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
 * @category conversions
 * @since 2.10.0
 */
export var fromReadonlyNonEmptyArray = _.fromReadonlyNonEmptyArray;
/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @category conversions
 * @since 2.0.0
 */
export var fromArray = function (as) { return (isNonEmpty(as) ? _.some(as) : _.none); };
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
export var replicate = function (a) { return makeBy(function () { return a; }); };
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
export var range = function (start, end) {
    return start <= end ? makeBy(function (i) { return start + i; })(end - start + 1) : [start];
};
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
export var unprepend = function (as) { return [head(as), tail(as)]; };
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
export var unappend = function (as) { return [init(as), last(as)]; };
export function concatW(second) {
    return function (first) { return first.concat(second); };
}
export function concat(x, y) {
    return y ? x.concat(y) : function (y) { return y.concat(x); };
}
/**
 * @since 2.0.0
 */
export var reverse = function (as) { return __spreadArray([last(as)], as.slice(0, -1).reverse(), true); };
export function group(E) {
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
 * @since 2.0.0
 */
export var sort = function (O) {
    return function (as) {
        return as.slice().sort(O.compare);
    };
};
/**
 * @since 2.0.0
 */
export var insertAt = function (i, a) {
    return function (as) {
        return i < 0 || i > as.length ? _.none : _.some(unsafeInsertAt(i, a, as));
    };
};
/**
 * @since 2.0.0
 */
export var updateAt = function (i, a) {
    return modifyAt(i, function () { return a; });
};
/**
 * @since 2.0.0
 */
export var modifyAt = function (i, f) {
    return function (as) {
        return isOutOfBound(i, as) ? _.none : _.some(unsafeUpdateAt(i, f(as[i]), as));
    };
};
/**
 * @since 2.0.0
 */
export var copy = fromReadonlyNonEmptyArray;
/**
 * @category constructors
 * @since 2.0.0
 */
export var of = function (a) { return [a]; };
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
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/NonEmptyArray'
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
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export var intersperse = function (middle) {
    return function (as) {
        var rest = tail(as);
        return isNonEmpty(rest) ? pipe(rest, prependAll(middle), prepend(head(as))) : copy(as);
    };
};
/**
 * @category folding
 * @since 2.0.0
 */
export var foldMapWithIndex = RNEA.foldMapWithIndex;
/**
 * @category folding
 * @since 2.0.0
 */
export var foldMap = RNEA.foldMap;
/**
 * @category sequencing
 * @since 2.10.0
 */
export var chainWithIndex = function (f) {
    return function (as) {
        var out = fromReadonlyNonEmptyArray(f(0, head(as)));
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
 * Splits a `NonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @since 2.10.0
 */
export var splitAt = function (n) {
    return function (as) {
        var m = Math.max(1, n);
        return m >= as.length ? [copy(as), []] : [pipe(as.slice(1, m), prepend(head(as))), as.slice(m)];
    };
};
/**
 * @since 2.10.0
 */
export var chunksOf = function (n) { return chop(splitAt(n)); };
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _mapWithIndex = function (fa, f) { return pipe(fa, mapWithIndex(f)); };
/* istanbul ignore next */
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
export var altW = function (that) {
    return function (as) {
        return pipe(as, concatW(that()));
    };
};
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
export var alt = altW;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @since 2.0.0
 */
export var ap = function (as) {
    return flatMap(function (f) { return pipe(as, map(f)); });
};
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
export var flatMap = /*#__PURE__*/ dual(2, function (ma, f) {
    return pipe(ma, chainWithIndex(function (i, a) { return f(a, i); }));
});
/**
 * @since 2.0.0
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
export var duplicate = /*#__PURE__*/ extend(identity);
/**
 * @category sequencing
 * @since 2.5.0
 */
export var flatten = /*#__PURE__*/ flatMap(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return mapWithIndex(function (_, a) { return f(a); }); };
/**
 * @category mapping
 * @since 2.0.0
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
 * @since 2.0.0
 */
export var reduce = RNEA.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
export var reduceWithIndex = RNEA.reduceWithIndex;
/**
 * @category folding
 * @since 2.0.0
 */
export var reduceRight = RNEA.reduceRight;
/**
 * @category folding
 * @since 2.0.0
 */
export var reduceRightWithIndex = RNEA.reduceRightWithIndex;
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
export var sequence = function (F) { return traverseWithIndex(F)(function (_, a) { return a; }); };
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
 * @since 2.7.0
 */
export var extract = RNEA.head;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'NonEmptyArray';
/**
 * @category instances
 * @since 2.0.0
 */
export var getShow = RNEA.getShow;
/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @category instances
 * @since 2.0.0
 */
export var getSemigroup = function () { return ({
    concat: concat
}); };
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
export var getEq = RNEA.getEq;
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
 * @category sequencing
 * @since 2.5.0
 */
export var chainFirst = 
/*#__PURE__*/ chainFirst_(Chain);
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
 * @since 2.0.0
 */
export var head = RNEA.head;
/**
 * @since 2.0.0
 */
export var tail = function (as) { return as.slice(1); };
/**
 * @since 2.0.0
 */
export var last = RNEA.last;
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
export var init = function (as) { return as.slice(0, -1); };
/**
 * @since 2.0.0
 */
export var min = RNEA.min;
/**
 * @since 2.0.0
 */
export var max = RNEA.max;
/**
 * @since 2.10.0
 */
export var concatAll = function (S) {
    return function (as) {
        return as.reduce(S.concat);
    };
};
/**
 * Break an `Array` into its first element and remaining elements.
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
 * Break an `Array` into its initial elements and the last element.
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
 * Apply a function to the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export var modifyHead = function (f) {
    return function (as) {
        return __spreadArray([f(head(as))], tail(as), true);
    };
};
/**
 * Change the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export var updateHead = function (a) { return modifyHead(function () { return a; }); };
/**
 * Apply a function to the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export var modifyLast = function (f) {
    return function (as) {
        return pipe(init(as), append(f(last(as))));
    };
};
/**
 * Change the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
export var updateLast = function (a) { return modifyLast(function () { return a; }); };
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
export var intercalate = RNEA.intercalate;
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export var chain = flatMap;
export function groupSort(O) {
    var sortO = sort(O);
    var groupO = group(O);
    return function (as) { return (isNonEmpty(as) ? groupO(sortO(as)) : []); };
}
export function filter(predicate) {
    return filterWithIndex(function (_, a) { return predicate(a); });
}
/**
 * Use [`filterWithIndex`](./Array.ts.html#filterwithindex) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var filterWithIndex = function (predicate) {
    return function (as) {
        return fromArray(as.filter(function (a, i) { return predicate(i, a); }));
    };
};
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export var uncons = unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export var unsnoc = unappend;
export function cons(head, tail) {
    return tail === undefined ? prepend(head) : pipe(tail, prepend(head));
}
/**
 * Use [`append`](./Array.ts.html#append) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var snoc = function (init, end) { return pipe(init, append(end)); };
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
export var fold = RNEA.concatAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `NEA.Functor` instead of `NEA.nonEmptyArray`
 * (where `NEA` is from `import NEA from 'fp-ts/NonEmptyArray'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var nonEmptyArray = {
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
