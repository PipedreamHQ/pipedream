import { pipe } from './function';
import { flap as flap_ } from './Functor';
// TODO: curry in v3
/**
 * Extracts a value at a relative position which depends on the current value.
 *
 * @since 2.0.0
 */
export function tracks(M, f) {
    return function (wa) { return wa(f(wa(M.empty))); };
}
/**
 * Get the current position
 *
 * @since 2.0.0
 */
export function listen(wa) {
    return function (e) { return [wa(e), e]; };
}
/**
 * Get a value which depends on the current position
 *
 * @since 2.0.0
 */
export function listens(f) {
    return function (wa) { return function (e) { return [wa(e), f(e)]; }; };
}
/**
 * Apply a function to the current position
 *
 * @since 2.0.0
 */
export function censor(f) {
    return function (wa) { return function (e) { return wa(f(e)); }; };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getComonad(monoid) {
    function extend(wa, f) {
        return function (p1) { return f(function (p2) { return wa(monoid.concat(p1, p2)); }); };
    }
    function extract(wa) {
        return wa(monoid.empty);
    }
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        extend: extend,
        extract: extract
    };
}
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return function (p) { return f(fa(p)); }; }; };
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Traced';
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
export var traced = Functor;
