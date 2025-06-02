import { identity, pipe, unsafeCoerce } from './function';
import { flap as flap_ } from './Functor';
/**
 * @category constructors
 * @since 2.0.0
 */
export var make = unsafeCoerce;
/**
 * @category instances
 * @since 2.0.0
 */
export function getShow(S) {
    return {
        show: function (c) { return "make(".concat(S.show(c), ")"); }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export var getEq = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getOrd = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getBounded = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getSemigroup = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getMonoid = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getSemiring = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getRing = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getHeytingAlgebra = identity;
/**
 * @category instances
 * @since 2.6.0
 */
export var getBooleanAlgebra = identity;
/**
 * @category instances
 * @since 2.0.0
 */
export function getApply(S) {
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return make(S.concat(fab, fa)); }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getApplicative(M) {
    var A = getApply(M);
    return {
        URI: URI,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        of: function () { return make(M.empty); }
    };
}
var _contramap = function (fa, f) { return pipe(fa, contramap(f)); };
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return pipe(fa, bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return pipe(fa, mapLeft(f)); };
/**
 * @since 2.0.0
 */
export var contramap = function () { return unsafeCoerce; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function () { return unsafeCoerce; };
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.6.2
 */
export var bimap = function (f) { return function (fa) {
    return make(f(fa));
}; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.6.2
 */
export var mapLeft = function (f) { return function (fa) { return make(f(fa)); }; };
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Const';
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
export var Contravariant = {
    URI: URI,
    contramap: _contramap
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `C.Functor` instead of `C.const_`
 * (where `C` is from `import C from 'fp-ts/Const'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var const_ = {
    URI: URI,
    map: _map,
    contramap: _contramap,
    bimap: _bimap,
    mapLeft: _mapLeft
};
