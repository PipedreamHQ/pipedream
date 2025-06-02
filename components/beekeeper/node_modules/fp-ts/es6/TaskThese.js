import { getApplySemigroup } from './Apply';
import { fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither';
import { fromIOK as fromIOK_ } from './FromIO';
import { fromTaskK as fromTaskK_ } from './FromTask';
import { fromTheseK as fromTheseK_ } from './FromThese';
import { flow, pipe, SK } from './function';
import { flap as flap_ } from './Functor';
import * as _ from './internal';
import * as T from './Task';
import * as TH from './These';
import * as TT from './TheseT';
/**
 * @category constructors
 * @since 2.4.0
 */
export var left = /*#__PURE__*/ TT.left(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
export var right = /*#__PURE__*/ TT.right(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
export var both = /*#__PURE__*/ TT.both(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
export var rightTask = /*#__PURE__*/ TT.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.4.0
 */
export var leftTask = /*#__PURE__*/ TT.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.4.0
 */
export var rightIO = /*#__PURE__*/ flow(T.fromIO, rightTask);
/**
 * @category constructors
 * @since 2.4.0
 */
export var leftIO = /*#__PURE__*/ flow(T.fromIO, leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.10.0
 */
export var fromEither = T.of;
/**
 * @category conversions
 * @since 2.11.0
 */
export var fromThese = T.of;
/**
 * @category conversions
 * @since 2.7.0
 */
export var fromIO = rightIO;
/**
 * @category conversions
 * @since 2.4.0
 */
export var fromIOEither = T.fromIO;
/**
 * @category conversions
 * @since 2.7.0
 */
export var fromTask = rightTask;
/**
 * @category pattern matching
 * @since 2.10.0
 */
export var match = /*#__PURE__*/ TT.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export var matchW = match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export var matchE = /*#__PURE__*/ TT.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.4.0
 */
export var fold = matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export var matchEW = fold;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export var foldW = matchEW;
/**
 * @since 2.4.0
 */
export var swap = /*#__PURE__*/ TT.swap(T.Functor);
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return pipe(fa, bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return pipe(fa, mapLeft(f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.4.0
 */
export var map = /*#__PURE__*/ TT.map(T.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.4.0
 */
export var bimap = 
/*#__PURE__*/ TT.bimap(T.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.4.0
 */
export var mapLeft = /*#__PURE__*/ TT.mapLeft(T.Functor);
/**
 * @category constructors
 * @since 2.7.0
 */
export var of = right;
/**
 * @category type lambdas
 * @since 2.4.0
 */
export var URI = 'TaskThese';
/**
 * @category instances
 * @since 2.10.0
 */
export var getApply = function (A, S) {
    var ap = TT.ap(A, S);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return pipe(fab, ap(fa)); }
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
export function getApplicative(A, S) {
    var ap = getApply(A, S).ap;
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: ap,
        of: of
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
export function getChain(S) {
    var A = getApply(T.ApplicativePar, S);
    var chain = TT.chain(T.Monad, S);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: function (ma, f) { return pipe(ma, chain(f)); }
    };
}
/**
 * @category instances
 * @since 2.4.0
 */
export function getMonad(S) {
    var A = getApplicative(T.ApplicativePar, S);
    var C = getChain(S);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: of,
        chain: C.chain,
        fromIO: fromIO,
        fromTask: fromTask
    };
}
/**
 * @category instances
 * @since 2.10.0
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
 * @since 2.10.0
 */
export var Bifunctor = {
    URI: URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.10.0
 */
export var FromEither = {
    URI: URI,
    fromEither: fromEither
};
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
/**
 * @category lifting
 * @since 2.10.0
 */
export var fromPredicate = /*#__PURE__*/ fromPredicate_(FromEither);
/**
 * @category instances
 * @since 2.11.0
 */
export var FromThese = {
    URI: URI,
    fromThese: fromThese
};
/**
 * @category lifting
 * @since 2.11.0
 */
export var fromTheseK = /*#__PURE__*/ fromTheseK_(FromThese);
/**
 * @category instances
 * @since 2.10.0
 */
export var FromIO = {
    URI: URI,
    fromIO: fromIO
};
/**
 * @category lifting
 * @since 2.10.0
 */
export var fromIOK = /*#__PURE__*/ fromIOK_(FromIO);
/**
 * @category instances
 * @since 2.10.0
 */
export var FromTask = {
    URI: URI,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category lifting
 * @since 2.10.0
 */
export var fromTaskK = /*#__PURE__*/ fromTaskK_(FromTask);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export var toTuple2 = 
/*#__PURE__*/ TT.toTuple2(T.Functor);
/**
 * @since 2.11.0
 */
export var ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (S) {
    var g = TH.traverseReadonlyNonEmptyArrayWithIndex(S);
    return function (f) { return flow(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(g(SK))); };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
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
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndexSeq = function (S) {
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
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndexSeq = function (S) {
    return function (f) {
        var g = traverseReadonlyNonEmptyArrayWithIndexSeq(S)(f);
        return function (as) { return (_.isNonEmpty(as) ? g(as) : ApT); };
    };
};
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
export var functorTaskThese = {
    URI: URI,
    map: _map
};
/**
 * Use [`Bifunctor`](#bifunctor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export var bifunctorTaskThese = {
    URI: URI,
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
export var toTuple = function (e, a) {
    return toTuple2(function () { return e; }, function () { return a; });
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TT.Functor` instead of `TT.taskThese`
 * (where `TT` is from `import TT from 'fp-ts/TaskThese'`)
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export var taskThese = {
    URI: URI,
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
export var getSemigroup = function (SE, SA) {
    return getApplySemigroup(T.ApplySeq)(TH.getSemigroup(SE, SA));
};
