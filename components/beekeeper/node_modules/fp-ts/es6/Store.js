import { identity, pipe } from './function';
import { flap as flap_ } from './Functor';
/**
 * Reposition the focus at the specified position
 *
 * @since 2.0.0
 */
export function seek(s) {
    return function (wa) { return ({ peek: wa.peek, pos: s }); };
}
/**
 * Reposition the focus at the specified position, which depends on the current position
 *
 * @since 2.0.0
 */
export function seeks(f) {
    return function (wa) { return ({ peek: wa.peek, pos: f(wa.pos) }); };
}
/**
 * Extract a value from a position which depends on the current position
 *
 * @since 2.0.0
 */
export function peeks(f) {
    return function (wa) { return wa.peek(f(wa.pos)); };
}
export function experiment(F) {
    return function (f) { return function (wa) { return F.map(f(wa.pos), function (s) { return wa.peek(s); }); }; };
}
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return pipe(wa, extend(f)); };
/**
 * @since 2.0.0
 */
export var extend = function (f) { return function (wa) { return ({
    peek: function (s) { return f({ peek: wa.peek, pos: s }); },
    pos: wa.pos
}); }; };
/**
 * @category Extract
 * @since 2.6.2
 */
export var extract = function (wa) { return wa.peek(wa.pos); };
/**
 * @since 2.0.0
 */
export var duplicate = /*#__PURE__*/ extend(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return ({
    peek: function (s) { return f(fa.peek(s)); },
    pos: fa.pos
}); }; };
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Store';
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
 * @since 2.7.0
 */
export var Comonad = {
    URI: URI,
    map: _map,
    extend: _extend,
    extract: extract
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
export var store = Comonad;
