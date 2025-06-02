"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writer = exports.execWriter = exports.evalWriter = exports.execute = exports.evaluate = exports.flap = exports.Functor = exports.getApplicative = exports.getApply = exports.getPointed = exports.URI = exports.map = exports.censor = exports.listens = exports.pass = exports.listen = exports.tell = void 0;
exports.getChain = getChain;
exports.getMonad = getMonad;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Appends a value to the accumulator
 *
 * @category constructors
 * @since 2.0.0
 */
var tell = function (w) { return function () { return [undefined, w]; }; };
exports.tell = tell;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Modifies the result to include the changes to the accumulator
 *
 * @since 2.0.0
 */
var listen = function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [[a, w], w];
}; };
exports.listen = listen;
/**
 * Applies the returned function to the accumulator
 *
 * @since 2.0.0
 */
var pass = function (fa) { return function () {
    var _a = fa(), _b = _a[0], a = _b[0], f = _b[1], w = _a[1];
    return [a, f(w)];
}; };
exports.pass = pass;
/**
 * Projects a value from modifications made to the accumulator during an action
 *
 * @since 2.0.0
 */
var listens = function (f) { return function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [[a, f(w)], w];
}; }; };
exports.listens = listens;
/**
 * Modify the final accumulator value by applying a function
 *
 * @since 2.0.0
 */
var censor = function (f) { return function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [a, f(w)];
}; }; };
exports.censor = censor;
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return function () {
    var _a = fa(), a = _a[0], w = _a[1];
    return [f(a), w];
}; }; };
exports.map = map;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Writer';
/**
 * @category instances
 * @since 2.10.0
 */
var getPointed = function (M) { return ({
    URI: exports.URI,
    _E: undefined,
    of: function (a) { return function () { return [a, M.empty]; }; }
}); };
exports.getPointed = getPointed;
/**
 * @category instances
 * @since 2.10.0
 */
var getApply = function (S) { return ({
    URI: exports.URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) { return function () {
        var _a = fab(), f = _a[0], w1 = _a[1];
        var _b = fa(), a = _b[0], w2 = _b[1];
        return [f(a), S.concat(w1, w2)];
    }; }
}); };
exports.getApply = getApply;
/**
 * @category instances
 * @since 2.10.0
 */
var getApplicative = function (M) {
    var A = (0, exports.getApply)(M);
    var P = (0, exports.getPointed)(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: P.of
    };
};
exports.getApplicative = getApplicative;
/**
 * @category instances
 * @since 2.10.0
 */
function getChain(S) {
    var A = (0, exports.getApply)(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: function (fa, f) { return function () {
            var _a = fa(), a = _a[0], w1 = _a[1];
            var _b = f(a)(), b = _b[0], w2 = _b[1];
            return [b, S.concat(w1, w2)];
        }; }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getMonad(M) {
    var A = (0, exports.getApplicative)(M);
    var C = getChain(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: A.of,
        chain: C.chain
    };
}
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var evaluate = function (fa) { return fa()[0]; };
exports.evaluate = evaluate;
/**
 * @since 2.8.0
 */
var execute = function (fa) { return fa()[1]; };
exports.execute = execute;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var evalWriter = function (fa) { return fa()[0]; };
exports.evalWriter = evalWriter;
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var execWriter = function (fa) { return fa()[1]; };
exports.execWriter = execWriter;
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.writer = exports.Functor;
