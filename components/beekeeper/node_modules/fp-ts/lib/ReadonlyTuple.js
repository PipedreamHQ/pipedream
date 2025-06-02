"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readonlyTuple = exports.Traversable = exports.Foldable = exports.Comonad = exports.Semigroupoid = exports.Bifunctor = exports.mapLeft = exports.map = exports.flap = exports.Functor = exports.URI = exports.sequence = exports.traverse = exports.reduceRight = exports.foldMap = exports.reduce = exports.duplicate = exports.extract = exports.extend = exports.compose = exports.mapSnd = exports.mapFst = exports.bimap = exports.swap = void 0;
exports.fst = fst;
exports.snd = snd;
exports.getApply = getApply;
exports.getApplicative = getApplicative;
exports.getChain = getChain;
exports.getMonad = getMonad;
exports.getChainRec = getChainRec;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
function fst(ea) {
    return ea[0];
}
/**
 * @since 2.5.0
 */
function snd(ea) {
    return ea[1];
}
/**
 * @since 2.5.0
 */
var swap = function (ea) { return [snd(ea), fst(ea)]; };
exports.swap = swap;
/**
 * @category instances
 * @since 2.5.0
 */
function getApply(S) {
    return {
        URI: exports.URI,
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
 * @since 2.5.0
 */
function getApplicative(M) {
    var A = getApply(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: of(M)
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
function getChain(S) {
    var A = getApply(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: function (ma, f) {
            var _a = f(fst(ma)), b = _a[0], s = _a[1];
            return [b, S.concat(snd(ma), s)];
        }
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
function getMonad(M) {
    var C = getChain(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: C.ap,
        chain: C.chain,
        of: of(M)
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
function getChainRec(M) {
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
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: C.ap,
        chain: C.chain,
        chainRec: chainRec
    };
}
/* istanbul ignore next */
var _compose = function (bc, ab) { return (0, function_1.pipe)(bc, (0, exports.compose)(ab)); };
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapFst)(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return (0, function_1.pipe)(fa, (0, exports.bimap)(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapSnd)(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
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
 * @since 2.5.0
 */
var bimap = function (f, g) { return function (fa) { return [g(fst(fa)), f(snd(fa))]; }; };
exports.bimap = bimap;
/**
 * Map a function over the first component of a `ReadonlyTuple`.
 *
 * This is the `map` operation of the `Functor` instance.
 *
 * @category mapping
 * @since 2.10.0
 */
var mapFst = function (f) { return function (fa) {
    return [f(fst(fa)), snd(fa)];
}; };
exports.mapFst = mapFst;
/**
 * Map a function over the second component of a `ReadonlyTuple`.
 *
 * This is the `mapLeft` operation of the `Bifunctor` instance.
 *
 * @category mapping
 * @since 2.10.0
 */
var mapSnd = function (f) { return function (fa) {
    return [fst(fa), f(snd(fa))];
}; };
exports.mapSnd = mapSnd;
/**
 * @since 2.5.0
 */
var compose = function (ab) { return function (bc) {
    return [fst(bc), snd(ab)];
}; };
exports.compose = compose;
/**
 * @since 2.5.0
 */
var extend = function (f) { return function (wa) {
    return [f(wa), snd(wa)];
}; };
exports.extend = extend;
/**
 * @category Extract
 * @since 2.6.2
 */
exports.extract = fst;
/**
 * @since 2.5.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * @category folding
 * @since 2.5.0
 */
var reduce = function (b, f) { return function (fa) {
    return f(b, fst(fa));
}; };
exports.reduce = reduce;
/**
 * @category folding
 * @since 2.5.0
 */
var foldMap = function () {
    return function (f) { return function (fa) { return f(fst(fa)); }; };
};
exports.foldMap = foldMap;
/**
 * @category folding
 * @since 2.5.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return f(fst(fa), b);
}; };
exports.reduceRight = reduceRight;
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) { return function (ta) { return F.map(f(fst(ta)), function (b) { return [b, snd(ta)]; }); }; };
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (fas) {
        return F.map(fst(fas), function (a) { return [a, snd(fas)]; });
    };
};
exports.sequence = sequence;
/**
 * @category type lambdas
 * @since 2.5.0
 */
exports.URI = 'ReadonlyTuple';
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
 * Alias of [`mapFst`](#mapfst).
 *
 * @category mapping
 * @since 2.5.0
 */
exports.map = exports.mapFst;
/**
 * Alias of [`mapSnd`](#mapsnd).
 *
 * @category error handling
 * @since 2.5.0
 */
exports.mapLeft = exports.mapSnd;
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
 * @since 2.7.0
 */
exports.Semigroupoid = {
    URI: exports.URI,
    compose: _compose
};
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readonlyTuple`
 * (where `RT` is from `import RT from 'fp-ts/ReadonlyTuple'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.readonlyTuple = {
    URI: exports.URI,
    compose: _compose,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    extract: exports.extract,
    extend: _extend,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
