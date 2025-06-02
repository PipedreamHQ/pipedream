import { identity, pipe } from './function';
import { flap as flap_ } from './Functor';
import * as RT from './ReadonlyTuple';
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export var fst = RT.fst;
/**
 * @since 2.0.0
 */
export var snd = RT.snd;
/**
 * @since 2.0.0
 */
export var swap = function (ea) { return [snd(ea), fst(ea)]; };
/**
 * @category instances
 * @since 2.0.0
 */
export function getApply(S) {
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return [fst(fab)(fst(fa)), S.concat(snd(fab), snd(fa))]; }
    };
}
var of = function (M) {
    return function (a) {
        return [a, M.empty];
    };
};
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
        of: of(M)
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getChain(S) {
    var A = getApply(S);
    return {
        URI: URI,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        chain: function (ma, f) {
            var _a = f(fst(ma)), b = _a[0], s = _a[1];
            return [b, S.concat(snd(ma), s)];
        }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getMonad(M) {
    var C = getChain(M);
    return {
        URI: URI,
        _E: undefined,
        map: C.map,
        ap: C.ap,
        chain: C.chain,
        of: of(M)
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getChainRec(M) {
    var chainRec = function (a, f) {
        var result = f(a);
        var acc = M.empty;
        var s = fst(result);
        while (s._tag === 'Left') {
            acc = M.concat(acc, snd(result));
            result = f(s.left);
            s = fst(result);
        }
        return [s.right, M.concat(acc, snd(result))];
    };
    var C = getChain(M);
    return {
        URI: URI,
        _E: undefined,
        map: C.map,
        ap: C.ap,
        chain: C.chain,
        chainRec: chainRec
    };
}
/* istanbul ignore next */
var _compose = function (bc, ab) { return pipe(bc, compose(ab)); };
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, mapFst(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return pipe(fa, bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return pipe(fa, mapSnd(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return pipe(wa, extend(f)); };
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
function _traverse(F) {
    var traverseF = traverse(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
}
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export var bimap = function (f, g) { return function (fa) {
    return [g(fst(fa)), f(snd(fa))];
}; };
/**
 * Map a function over the first component of a `Tuple`.
 *
 * This is the `map` operation of the `Functor` instance.
 *
 * @category mapping
 * @since 2.0.0
 */
export var mapFst = function (f) { return function (fa) { return [f(fst(fa)), snd(fa)]; }; };
/**
 * Map a function over the second component of a `Tuple`.
 *
 * This is the `mapLeft` operation of the `Bifunctor` instance.
 *
 * @category mapping
 * @since 2.10.0
 */
export var mapSnd = function (f) { return function (fa) { return [fst(fa), f(snd(fa))]; }; };
/**
 * @since 2.0.0
 */
export var compose = function (ab) { return function (bc) { return [fst(bc), snd(ab)]; }; };
/**
 * @since 2.0.0
 */
export var extend = function (f) { return function (wa) { return [f(wa), snd(wa)]; }; };
/**
 * @since 2.0.0
 */
export var duplicate = /*#__PURE__*/ extend(identity);
/**
 * @category Extract
 * @since 2.6.2
 */
export var extract = RT.extract;
/**
 * @category folding
 * @since 2.0.0
 */
export var foldMap = RT.foldMap;
/**
 * @category folding
 * @since 2.0.0
 */
export var reduce = RT.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
export var reduceRight = RT.reduceRight;
/**
 * @category traversing
 * @since 2.6.3
 */
export var traverse = function (F) {
    return function (f) { return function (ta) { return F.map(f(fst(ta)), function (b) { return [b, snd(ta)]; }); }; };
};
/**
 * @category traversing
 * @since 2.6.3
 */
export var sequence = function (F) {
    return function (fas) {
        return F.map(fst(fas), function (a) { return [a, snd(fas)]; });
    };
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Tuple';
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
export var Bifunctor = {
    URI: URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Semigroupoid = {
    URI: URI,
    compose: _compose
};
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`mapFst`](#mapfst) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var map = mapFst;
/**
 * Use [`mapSnd`](#mapsnd) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var mapLeft = mapSnd;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.tuple`
 * (where `T` is from `import T from 'fp-ts/Tuple'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var tuple = {
    URI: URI,
    compose: _compose,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    extract: extract,
    extend: _extend,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
