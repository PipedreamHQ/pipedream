"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.Comonad = exports.flap = exports.Functor = exports.URI = exports.map = exports.duplicate = exports.extract = exports.extend = void 0;
exports.seek = seek;
exports.seeks = seeks;
exports.peeks = peeks;
exports.experiment = experiment;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
/**
 * Reposition the focus at the specified position
 *
 * @since 2.0.0
 */
function seek(s) {
    return function (wa) { return ({ peek: wa.peek, pos: s }); };
}
/**
 * Reposition the focus at the specified position, which depends on the current position
 *
 * @since 2.0.0
 */
function seeks(f) {
    return function (wa) { return ({ peek: wa.peek, pos: f(wa.pos) }); };
}
/**
 * Extract a value from a position which depends on the current position
 *
 * @since 2.0.0
 */
function peeks(f) {
    return function (wa) { return wa.peek(f(wa.pos)); };
}
function experiment(F) {
    return function (f) { return function (wa) { return F.map(f(wa.pos), function (s) { return wa.peek(s); }); }; };
}
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
/**
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) { return ({
    peek: function (s) { return f({ peek: wa.peek, pos: s }); },
    pos: wa.pos
}); }; };
exports.extend = extend;
/**
 * @category Extract
 * @since 2.6.2
 */
var extract = function (wa) { return wa.peek(wa.pos); };
exports.extract = extract;
/**
 * @since 2.0.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return ({
    peek: function (s) { return f(fa.peek(s)); },
    pos: fa.pos
}); }; };
exports.map = map;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Store';
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
 * @since 2.7.0
 */
exports.Comonad = {
    URI: exports.URI,
    map: _map,
    extend: _extend,
    extract: exports.extract
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Comonad` instance, pass `S.Comonad` instead of `S.store`
 * (where `S` is from `import S from 'fp-ts/Store'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.store = exports.Comonad;
