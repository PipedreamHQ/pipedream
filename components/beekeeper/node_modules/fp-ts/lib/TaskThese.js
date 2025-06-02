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
exports.getSemigroup = exports.taskThese = exports.toTuple = exports.bifunctorTaskThese = exports.functorTaskThese = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.toTuple2 = exports.fromTaskK = exports.FromTask = exports.fromIOK = exports.FromIO = exports.fromTheseK = exports.FromThese = exports.fromPredicate = exports.fromOptionK = exports.fromOption = exports.FromEither = exports.Bifunctor = exports.Pointed = exports.flap = exports.Functor = exports.getApply = exports.URI = exports.of = exports.mapLeft = exports.bimap = exports.map = exports.swap = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromTask = exports.fromIOEither = exports.fromIO = exports.fromThese = exports.fromEither = exports.leftIO = exports.rightIO = exports.leftTask = exports.rightTask = exports.both = exports.right = exports.left = void 0;
exports.getApplicative = getApplicative;
exports.getChain = getChain;
exports.getMonad = getMonad;
var Apply_1 = require("./Apply");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromTask_1 = require("./FromTask");
var FromThese_1 = require("./FromThese");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var T = __importStar(require("./Task"));
var TH = __importStar(require("./These"));
var TT = __importStar(require("./TheseT"));
/**
 * @category constructors
 * @since 2.4.0
 */
exports.left = TT.left(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
exports.right = TT.right(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
exports.both = TT.both(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
exports.rightTask = TT.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.4.0
 */
exports.leftTask = TT.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.4.0
 */
exports.rightIO = (0, function_1.flow)(T.fromIO, exports.rightTask);
/**
 * @category constructors
 * @since 2.4.0
 */
exports.leftIO = (0, function_1.flow)(T.fromIO, exports.leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromEither = T.of;
/**
 * @category conversions
 * @since 2.11.0
 */
exports.fromThese = T.of;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromIO = exports.rightIO;
/**
 * @category conversions
 * @since 2.4.0
 */
exports.fromIOEither = T.fromIO;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromTask = exports.rightTask;
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = TT.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchE = TT.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.4.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchEW = exports.fold;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @since 2.4.0
 */
exports.swap = TT.swap(T.Functor);
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return (0, function_1.pipe)(fa, (0, exports.bimap)(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapLeft)(f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.4.0
 */
exports.map = TT.map(T.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.4.0
 */
exports.bimap = 
/*#__PURE__*/ TT.bimap(T.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.4.0
 */
exports.mapLeft = TT.mapLeft(T.Functor);
/**
 * @category constructors
 * @since 2.7.0
 */
exports.of = exports.right;
/**
 * @category type lambdas
 * @since 2.4.0
 */
exports.URI = 'TaskThese';
/**
 * @category instances
 * @since 2.10.0
 */
var getApply = function (A, S) {
    var ap = TT.ap(A, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, ap(fa)); }
    };
};
exports.getApply = getApply;
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicative(A, S) {
    var ap = (0, exports.getApply)(A, S).ap;
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: ap,
        of: exports.of
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
function getChain(S) {
    var A = (0, exports.getApply)(T.ApplicativePar, S);
    var chain = TT.chain(T.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: function (ma, f) { return (0, function_1.pipe)(ma, chain(f)); }
    };
}
/**
 * @category instances
 * @since 2.4.0
 */
function getMonad(S) {
    var A = getApplicative(T.ApplicativePar, S);
    var C = getChain(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: exports.of,
        chain: C.chain,
        fromIO: exports.fromIO,
        fromTask: exports.fromTask
    };
}
/**
 * @category instances
 * @since 2.10.0
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
 * @since 2.10.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
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
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromThese = {
    URI: exports.URI,
    fromThese: exports.fromThese
};
/**
 * @category lifting
 * @since 2.11.0
 */
exports.fromTheseK = (0, FromThese_1.fromTheseK)(exports.FromThese);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromIOK = (0, FromIO_1.fromIOK)(exports.FromIO);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromTaskK = (0, FromTask_1.fromTaskK)(exports.FromTask);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
exports.toTuple2 = 
/*#__PURE__*/ TT.toTuple2(T.Functor);
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (S) {
    var g = TH.traverseReadonlyNonEmptyArrayWithIndex(S);
    return function (f) { return (0, function_1.flow)(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(g(function_1.SK))); };
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
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
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (S) {
    return function (f) {
        return function (as) {
            return function () {
                return _.tail(as).reduce(function (acc, a, i) {
                    return acc.then(function (ebs) {
                        return TH.isLeft(ebs)
                            ? acc
                            : f(i + 1, a)().then(function (eb) {
                                if (TH.isLeft(eb)) {
                                    return eb;
                                }
                                if (TH.isBoth(eb)) {
                                    var right_1 = ebs.right;
                                    right_1.push(eb.right);
                                    return TH.isBoth(ebs) ? TH.both(S.concat(ebs.left, eb.left), right_1) : TH.both(eb.left, right_1);
                                }
                                ebs.right.push(eb.right);
                                return ebs;
                            });
                    });
                }, f(0, _.head(as))().then(TH.map(_.singleton)));
            };
        };
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (S) {
    return function (f) {
        var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndexSeq)(S)(f);
        return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
    };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
exports.functorTaskThese = {
    URI: exports.URI,
    map: _map
};
/**
 * Use [`Bifunctor`](#bifunctor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
exports.bifunctorTaskThese = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Use [`toTuple2`](#totuple2) instead.
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
var toTuple = function (e, a) {
    return (0, exports.toTuple2)(function () { return e; }, function () { return a; });
};
exports.toTuple = toTuple;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TT.Functor` instead of `TT.taskThese`
 * (where `TT` is from `import TT from 'fp-ts/TaskThese'`)
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
exports.taskThese = {
    URI: exports.URI,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
var getSemigroup = function (SE, SA) {
    return (0, Apply_1.getApplySemigroup)(T.ApplySeq)(TH.getSemigroup(SE, SA));
};
exports.getSemigroup = getSemigroup;
