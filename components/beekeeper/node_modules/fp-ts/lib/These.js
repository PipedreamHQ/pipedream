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
Object.defineProperty(exports, "__esModule", { value: true });
exports.these = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.toTuple = exports.toTuple2 = exports.exists = exports.elem = exports.fromOptionK = exports.fromOption = exports.fromPredicate = exports.FromEither = exports.Traversable = exports.Foldable = exports.FromThese = exports.Bifunctor = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.of = exports.sequence = exports.traverse = exports.reduceRight = exports.foldMap = exports.reduce = exports.map = exports.mapLeft = exports.bimap = exports.fromOptions = exports.getApply = exports.swap = exports.fold = exports.match = exports.foldW = exports.matchW = exports.isRight = exports.isLeft = void 0;
exports.isBoth = isBoth;
exports.left = left;
exports.right = right;
exports.both = both;
exports.getShow = getShow;
exports.getEq = getEq;
exports.getSemigroup = getSemigroup;
exports.getApplicative = getApplicative;
exports.getChain = getChain;
exports.getMonad = getMonad;
exports.getLeft = getLeft;
exports.getRight = getRight;
exports.leftOrBoth = leftOrBoth;
exports.rightOrBoth = rightOrBoth;
exports.getLeftOnly = getLeftOnly;
exports.getRightOnly = getRightOnly;
var Eq_1 = require("./Eq");
var FromEither_1 = require("./FromEither");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the these is an instance of `Left`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
var isLeft = function (fa) { return fa._tag === 'Left'; };
exports.isLeft = isLeft;
/**
 * Returns `true` if the these is an instance of `Right`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
var isRight = function (fa) { return fa._tag === 'Right'; };
exports.isRight = isRight;
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
function isBoth(fa) {
    return fa._tag === 'Both';
}
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
function left(left) {
    return { _tag: 'Left', left: left };
}
/**
 * @category constructors
 * @since 2.0.0
 */
function right(right) {
    return { _tag: 'Right', right: right };
}
/**
 * @category constructors
 * @since 2.0.0
 */
function both(left, right) {
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
var matchW = function (onLeft, onRight, onBoth) {
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
exports.matchW = matchW;
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = exports.matchW;
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = exports.matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.fold = exports.match;
/**
 * @since 2.4.0
 */
exports.swap = (0, exports.match)(right, left, function (e, a) { return both(a, e); });
/**
 * @category instances
 * @since 2.0.0
 */
function getShow(SE, SA) {
    return {
        show: (0, exports.match)(function (l) { return "left(".concat(SE.show(l), ")"); }, function (a) { return "right(".concat(SA.show(a), ")"); }, function (l, a) { return "both(".concat(SE.show(l), ", ").concat(SA.show(a), ")"); })
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getEq(EE, EA) {
    return (0, Eq_1.fromEquals)(function (x, y) {
        return (0, exports.isLeft)(x)
            ? (0, exports.isLeft)(y) && EE.equals(x.left, y.left)
            : (0, exports.isRight)(x)
                ? (0, exports.isRight)(y) && EA.equals(x.right, y.right)
                : isBoth(y) && EE.equals(x.left, y.left) && EA.equals(x.right, y.right);
    });
}
/**
 * @category instances
 * @since 2.0.0
 */
function getSemigroup(SE, SA) {
    return {
        concat: function (x, y) {
            return (0, exports.isLeft)(x)
                ? (0, exports.isLeft)(y)
                    ? left(SE.concat(x.left, y.left))
                    : (0, exports.isRight)(y)
                        ? both(x.left, y.right)
                        : both(SE.concat(x.left, y.left), y.right)
                : (0, exports.isRight)(x)
                    ? (0, exports.isLeft)(y)
                        ? both(y.left, x.right)
                        : (0, exports.isRight)(y)
                            ? right(SA.concat(x.right, y.right))
                            : both(y.left, SA.concat(x.right, y.right))
                    : (0, exports.isLeft)(y)
                        ? both(SE.concat(x.left, y.left), x.right)
                        : (0, exports.isRight)(y)
                            ? both(x.left, SA.concat(x.right, y.right))
                            : both(SE.concat(x.left, y.left), SA.concat(x.right, y.right));
        }
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
var getApply = function (S) { return ({
    URI: exports.URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
        return (0, exports.isLeft)(fab)
            ? (0, exports.isLeft)(fa)
                ? left(S.concat(fab.left, fa.left))
                : (0, exports.isRight)(fa)
                    ? left(fab.left)
                    : left(S.concat(fab.left, fa.left))
            : (0, exports.isRight)(fab)
                ? (0, exports.isLeft)(fa)
                    ? left(fa.left)
                    : (0, exports.isRight)(fa)
                        ? right(fab.right(fa.right))
                        : both(fa.left, fab.right(fa.right))
                : (0, exports.isLeft)(fa)
                    ? left(S.concat(fab.left, fa.left))
                    : (0, exports.isRight)(fa)
                        ? both(fab.left, fab.right(fa.right))
                        : both(S.concat(fab.left, fa.left), fab.right(fa.right));
    }
}); };
exports.getApply = getApply;
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicative(S) {
    var A = (0, exports.getApply)(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: exports.of
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
function getChain(S) {
    var A = (0, exports.getApply)(S);
    var chain = function (ma, f) {
        if ((0, exports.isLeft)(ma)) {
            return ma;
        }
        if ((0, exports.isRight)(ma)) {
            return f(ma.right);
        }
        var fb = f(ma.right);
        return (0, exports.isLeft)(fb)
            ? left(S.concat(ma.left, fb.left))
            : (0, exports.isRight)(fb)
                ? both(ma.left, fb.right)
                : both(S.concat(ma.left, fb.left), fb.right);
    };
    return {
        URI: exports.URI,
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
function getMonad(S) {
    var C = getChain(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        of: exports.of,
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
function getLeft(fa) {
    return (0, exports.isLeft)(fa) ? _.some(fa.left) : (0, exports.isRight)(fa) ? _.none : _.some(fa.left);
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
function getRight(fa) {
    return (0, exports.isLeft)(fa) ? _.none : (0, exports.isRight)(fa) ? _.some(fa.right) : _.some(fa.right);
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
function leftOrBoth(e) {
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
function rightOrBoth(a) {
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
function getLeftOnly(fa) {
    return (0, exports.isLeft)(fa) ? _.some(fa.left) : _.none;
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
function getRightOnly(fa) {
    return (0, exports.isRight)(fa) ? _.some(fa.right) : _.none;
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
var fromOptions = function (fe, fa) {
    return _.isNone(fe)
        ? _.isNone(fa)
            ? _.none
            : _.some(right(fa.value))
        : _.isNone(fa)
            ? _.some(left(fe.value))
            : _.some(both(fe.value, fa.value));
};
exports.fromOptions = fromOptions;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return (0, function_1.pipe)(fa, (0, exports.bimap)(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapLeft)(f)); };
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
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) {
    return (0, exports.isLeft)(fa) ? left(f(fa.left)) : (0, exports.isRight)(fa) ? right(g(fa.right)) : both(f(fa.left), g(fa.right));
}; };
exports.bimap = bimap;
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
var mapLeft = function (f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? left(f(fa.left)) : isBoth(fa) ? both(f(fa.left), fa.right) : fa;
}; };
exports.mapLeft = mapLeft;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? fa : (0, exports.isRight)(fa) ? right(f(fa.right)) : both(fa.left, f(fa.right));
}; };
exports.map = map;
/**
 * @category folding
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? b : f(b, fa.right);
}; };
exports.reduce = reduce;
/**
 * @category folding
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? M.empty : f(fa.right);
}; }; };
exports.foldMap = foldMap;
/**
 * @category folding
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? b : f(fa.right, b);
}; };
exports.reduceRight = reduceRight;
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) {
        return function (ta) {
            return (0, exports.isLeft)(ta) ? F.of(ta) : (0, exports.isRight)(ta) ? F.map(f(ta.right), right) : F.map(f(ta.right), function (b) { return both(ta.left, b); });
        };
    };
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (ta) {
        return (0, exports.isLeft)(ta) ? F.of(ta) : (0, exports.isRight)(ta) ? F.map(ta.right, right) : F.map(ta.right, function (b) { return both(ta.left, b); });
    };
};
exports.sequence = sequence;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.of = right;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'These';
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
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromThese = {
    URI: exports.URI,
    fromThese: function_1.identity
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
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: function_1.identity
};
/**
 * @category lifting
 * @since 2.13.0
 */
exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromOption = 
/*#__PURE__*/ (0, FromEither_1.fromOption)(exports.FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/ (0, FromEither_1.fromOptionK)(exports.FromEither);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var elem = function (E) {
    return function (a) {
        return function (ma) {
            return (0, exports.isLeft)(ma) ? false : E.equals(a, ma.right);
        };
    };
};
exports.elem = elem;
/**
 * @since 2.11.0
 */
var exists = function (predicate) {
    return function (ma) {
        return (0, exports.isLeft)(ma) ? false : predicate(ma.right);
    };
};
exports.exists = exists;
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
var toTuple2 = function (e, a) {
    return function (fa) {
        return (0, exports.isLeft)(fa) ? [fa.left, a()] : (0, exports.isRight)(fa) ? [e(), fa.right] : [fa.left, fa.right];
    };
};
exports.toTuple2 = toTuple2;
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
var toTuple = function (e, a) {
    return (0, exports.toTuple2)(function () { return e; }, function () { return a; });
};
exports.toTuple = toTuple;
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (S) {
    return function (f) {
        return function (as) {
            var e = _.none;
            var t = f(0, _.head(as));
            if ((0, exports.isLeft)(t)) {
                return t;
            }
            if (isBoth(t)) {
                e = _.some(t.left);
            }
            var out = [t.right];
            for (var i = 1; i < as.length; i++) {
                var t_1 = f(i, as[i]);
                if ((0, exports.isLeft)(t_1)) {
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
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (S) {
    return function (f) {
        var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(S)(f);
        return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
    };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
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
exports.these = {
    URI: exports.URI,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
