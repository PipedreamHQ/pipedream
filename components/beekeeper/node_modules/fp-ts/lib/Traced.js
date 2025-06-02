"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traced = exports.flap = exports.Functor = exports.URI = exports.map = void 0;
exports.tracks = tracks;
exports.listen = listen;
exports.listens = listens;
exports.censor = censor;
exports.getComonad = getComonad;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
// TODO: curry in v3
/**
 * Extracts a value at a relative position which depends on the current value.
 *
 * @since 2.0.0
 */
function tracks(M, f) {
    return function (wa) { return wa(f(wa(M.empty))); };
}
/**
 * Get the current position
 *
 * @since 2.0.0
 */
function listen(wa) {
    return function (e) { return [wa(e), e]; };
}
/**
 * Get a value which depends on the current position
 *
 * @since 2.0.0
 */
function listens(f) {
    return function (wa) { return function (e) { return [wa(e), f(e)]; }; };
}
/**
 * Apply a function to the current position
 *
 * @since 2.0.0
 */
function censor(f) {
    return function (wa) { return function (e) { return wa(f(e)); }; };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getComonad(monoid) {
    function extend(wa, f) {
        return function (p1) { return f(function (p2) { return wa(monoid.concat(p1, p2)); }); };
    }
    function extract(wa) {
        return wa(monoid.empty);
    }
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        extend: extend,
        extract: extract
    };
}
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return function (p) { return f(fa(p)); }; }; };
exports.map = map;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Traced';
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
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.traced = exports.Functor;
