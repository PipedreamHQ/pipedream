import { fromEquals } from './Eq';
import { fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither';
import { identity, pipe } from './function';
import { flap as flap_ } from './Functor';
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the these is an instance of `Left`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export var isLeft = function (fa) { return fa._tag === 'Left'; };
/**
 * Returns `true` if the these is an instance of `Right`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export var isRight = function (fa) { return fa._tag === 'Right'; };
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export function isBoth(fa) {
    return fa._tag === 'Both';
}
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export function left(left) {
    return { _tag: 'Left', left: left };
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function right(right) {
    return { _tag: 'Right', right: right };
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function both(left, right) {
    return { _tag: 'Both', left: left, right: right };
}
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export var matchW = function (onLeft, onRight, onBoth) {
    return function (fa) {
        switch (fa._tag) {
            case 'Left':
                return onLeft(fa.left);
            case 'Right':
                return onRight(fa.right);
            case 'Both':
                return onBoth(fa.left, fa.right);
        }
    };
};
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export var foldW = matchW;
/**
 * @category pattern matching
 * @since 2.10.0
 */
export var match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export var fold = match;
/**
 * @since 2.4.0
 */
export var swap = match(right, left, function (e, a) { return both(a, e); });
/**
 * @category instances
 * @since 2.0.0
 */
export function getShow(SE, SA) {
    return {
        show: match(function (l) { return "left(".concat(SE.show(l), ")"); }, function (a) { return "right(".concat(SA.show(a), ")"); }, function (l, a) { return "both(".concat(SE.show(l), ", ").concat(SA.show(a), ")"); })
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getEq(EE, EA) {
    return fromEquals(function (x, y) {
        return isLeft(x)
            ? isLeft(y) && EE.equals(x.left, y.left)
            : isRight(x)
                ? isRight(y) && EA.equals(x.right, y.right)
                : isBoth(y) && EE.equals(x.left, y.left) && EA.equals(x.right, y.right);
    });
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getSemigroup(SE, SA) {
    return {
        concat: function (x, y) {
            return isLeft(x)
                ? isLeft(y)
                    ? left(SE.concat(x.left, y.left))
                    : isRight(y)
                        ? both(x.left, y.right)
                        : both(SE.concat(x.left, y.left), y.right)
                : isRight(x)
                    ? isLeft(y)
                        ? both(y.left, x.right)
                        : isRight(y)
                            ? right(SA.concat(x.right, y.right))
                            : both(y.left, SA.concat(x.right, y.right))
                    : isLeft(y)
                        ? both(SE.concat(x.left, y.left), x.right)
                        : isRight(y)
                            ? both(x.left, SA.concat(x.right, y.right))
                            : both(SE.concat(x.left, y.left), SA.concat(x.right, y.right));
        }
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
export var getApply = function (S) { return ({
    URI: URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
        return isLeft(fab)
            ? isLeft(fa)
                ? left(S.concat(fab.left, fa.left))
                : isRight(fa)
                    ? left(fab.left)
                    : left(S.concat(fab.left, fa.left))
            : isRight(fab)
                ? isLeft(fa)
                    ? left(fa.left)
                    : isRight(fa)
                        ? right(fab.right(fa.right))
                        : both(fa.left, fab.right(fa.right))
                : isLeft(fa)
                    ? left(S.concat(fab.left, fa.left))
                    : isRight(fa)
                        ? both(fab.left, fab.right(fa.right))
                        : both(S.concat(fab.left, fa.left), fab.right(fa.right));
    }
}); };
/**
 * @category instances
 * @since 2.7.0
 */
export function getApplicative(S) {
    var A = getApply(S);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: of
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
export function getChain(S) {
    var A = getApply(S);
    var chain = function (ma, f) {
        if (isLeft(ma)) {
            return ma;
        }
        if (isRight(ma)) {
            return f(ma.right);
        }
        var fb = f(ma.right);
        return isLeft(fb)
            ? left(S.concat(ma.left, fb.left))
            : isRight(fb)
                ? both(ma.left, fb.right)
                : both(S.concat(ma.left, fb.left), fb.right);
    };
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: chain
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getMonad(S) {
    var C = getChain(S);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        of: of,
        ap: C.ap,
        chain: C.chain,
        throwError: left
    };
}
/**
 * Returns an `E` value if possible
 *
 * @example
 * import { getLeft, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(both('a', 1)), some('a'))
 *
 * @category conversions
 * @since 2.0.0
 */
export function getLeft(fa) {
    return isLeft(fa) ? _.some(fa.left) : isRight(fa) ? _.none : _.some(fa.left);
}
/**
 * Returns an `A` value if possible
 *
 * @example
 * import { getRight, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getRight(left('a')), none)
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(both('a', 1)), some(1))
 *
 * @category conversions
 * @since 2.0.0
 */
export function getRight(fa) {
    return isLeft(fa) ? _.none : isRight(fa) ? _.some(fa.right) : _.some(fa.right);
}
// TODO: make lazy in v3
/**
 * @example
 * import { leftOrBoth, left, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(leftOrBoth('a')(none), left('a'))
 * assert.deepStrictEqual(leftOrBoth('a')(some(1)), both('a', 1))
 *
 * @category constructors
 * @since 2.0.0
 */
export function leftOrBoth(e) {
    return function (ma) { return (_.isNone(ma) ? left(e) : both(e, ma.value)); };
}
// TODO: make lazy in v3
/**
 * @example
 * import { rightOrBoth, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(rightOrBoth(1)(none), right(1))
 * assert.deepStrictEqual(rightOrBoth(1)(some('a')), both('a', 1))
 *
 * @category constructors
 * @since 2.0.0
 */
export function rightOrBoth(a) {
    return function (me) { return (_.isNone(me) ? right(a) : both(me.value, a)); };
}
/**
 * Returns the `E` value if and only if the value is constructed with `Left`
 *
 * @example
 * import { getLeftOnly, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getLeftOnly(left('a')), some('a'))
 * assert.deepStrictEqual(getLeftOnly(right(1)), none)
 * assert.deepStrictEqual(getLeftOnly(both('a', 1)), none)
 *
 * @category conversions
 * @since 2.0.0
 */
export function getLeftOnly(fa) {
    return isLeft(fa) ? _.some(fa.left) : _.none;
}
/**
 * Returns the `A` value if and only if the value is constructed with `Right`
 *
 * @example
 * import { getRightOnly, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getRightOnly(left('a')), none)
 * assert.deepStrictEqual(getRightOnly(right(1)), some(1))
 * assert.deepStrictEqual(getRightOnly(both('a', 1)), none)
 *
 * @category conversions
 * @since 2.0.0
 */
export function getRightOnly(fa) {
    return isRight(fa) ? _.some(fa.right) : _.none;
}
/**
 * Takes a pair of `Option`s and attempts to create a `These` from them
 *
 * @example
 * import { fromOptions, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromOptions(none, none), none)
 * assert.deepStrictEqual(fromOptions(some('a'), none), some(left('a')))
 * assert.deepStrictEqual(fromOptions(none, some(1)), some(right(1)))
 * assert.deepStrictEqual(fromOptions(some('a'), some(1)), some(both('a', 1)))
 *
 * @category conversions
 * @since 2.0.0
 */
export var fromOptions = function (fe, fa) {
    return _.isNone(fe)
        ? _.isNone(fa)
            ? _.none
            : _.some(right(fa.value))
        : _.isNone(fa)
            ? _.some(left(fe.value))
            : _.some(both(fe.value, fa.value));
};
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return pipe(fa, bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return pipe(fa, mapLeft(f)); };
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
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export var bimap = function (f, g) { return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : isRight(fa) ? right(g(fa.right)) : both(f(fa.left), g(fa.right));
}; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
export var mapLeft = function (f) { return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : isBoth(fa) ? both(f(fa.left), fa.right) : fa;
}; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) {
    return isLeft(fa) ? fa : isRight(fa) ? right(f(fa.right)) : both(fa.left, f(fa.right));
}; };
/**
 * @category folding
 * @since 2.0.0
 */
export var reduce = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(b, fa.right);
}; };
/**
 * @category folding
 * @since 2.0.0
 */
export var foldMap = function (M) { return function (f) { return function (fa) {
    return isLeft(fa) ? M.empty : f(fa.right);
}; }; };
/**
 * @category folding
 * @since 2.0.0
 */
export var reduceRight = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(fa.right, b);
}; };
/**
 * @category traversing
 * @since 2.6.3
 */
export var traverse = function (F) {
    return function (f) {
        return function (ta) {
            return isLeft(ta) ? F.of(ta) : isRight(ta) ? F.map(f(ta.right), right) : F.map(f(ta.right), function (b) { return both(ta.left, b); });
        };
    };
};
/**
 * @category traversing
 * @since 2.6.3
 */
export var sequence = function (F) {
    return function (ta) {
        return isLeft(ta) ? F.of(ta) : isRight(ta) ? F.map(ta.right, right) : F.map(ta.right, function (b) { return both(ta.left, b); });
    };
};
/**
 * @category constructors
 * @since 2.0.0
 */
export var of = right;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'These';
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
export var Bifunctor = {
    URI: URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.11.0
 */
export var FromThese = {
    URI: URI,
    fromThese: identity
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
 * @since 2.10.0
 */
export var FromEither = {
    URI: URI,
    fromEither: identity
};
/**
 * @category lifting
 * @since 2.13.0
 */
export var fromPredicate = /*#__PURE__*/ fromPredicate_(FromEither);
/**
 * @category conversions
 * @since 2.10.0
 */
export var fromOption = 
/*#__PURE__*/ fromOption_(FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
export var fromOptionK = 
/*#__PURE__*/ fromOptionK_(FromEither);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export var elem = function (E) {
    return function (a) {
        return function (ma) {
            return isLeft(ma) ? false : E.equals(a, ma.right);
        };
    };
};
/**
 * @since 2.11.0
 */
export var exists = function (predicate) {
    return function (ma) {
        return isLeft(ma) ? false : predicate(ma.right);
    };
};
/**
 * @example
 * import { toTuple2, left, right, both } from 'fp-ts/These'
 *
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(left('b')), ['b', 1])
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(right(2)), ['a', 2])
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(both('b', 2)), ['b', 2])
 *
 * @category conversions
 * @since 2.10.0
 */
export var toTuple2 = function (e, a) {
    return function (fa) {
        return isLeft(fa) ? [fa.left, a()] : isRight(fa) ? [e(), fa.right] : [fa.left, fa.right];
    };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`toTuple2`](#totuple2) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var toTuple = function (e, a) {
    return toTuple2(function () { return e; }, function () { return a; });
};
/**
 * @since 2.11.0
 */
export var ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (S) {
    return function (f) {
        return function (as) {
            var e = _.none;
            var t = f(0, _.head(as));
            if (isLeft(t)) {
                return t;
            }
            if (isBoth(t)) {
                e = _.some(t.left);
            }
            var out = [t.right];
            for (var i = 1; i < as.length; i++) {
                var t_1 = f(i, as[i]);
                if (isLeft(t_1)) {
                    return t_1;
                }
                if (isBoth(t_1)) {
                    e = _.isNone(e) ? _.some(t_1.left) : _.some(S.concat(e.value, t_1.left));
                }
                out.push(t_1.right);
            }
            return _.isNone(e) ? right(out) : both(e.value, out);
        };
    };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndex = function (S) {
    return function (f) {
        var g = traverseReadonlyNonEmptyArrayWithIndex(S)(f);
        return function (as) { return (_.isNonEmpty(as) ? g(as) : ApT); };
    };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.these`
 * (where `T` is from `import T from 'fp-ts/These'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var these = {
    URI: URI,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
