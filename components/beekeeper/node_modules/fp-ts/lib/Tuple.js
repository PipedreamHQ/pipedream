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
exports.tuple = exports.mapLeft = exports.map = exports.Traversable = exports.Foldable = exports.Comonad = exports.Semigroupoid = exports.Bifunctor = exports.flap = exports.Functor = exports.URI = exports.sequence = exports.traverse = exports.reduceRight = exports.reduce = exports.foldMap = exports.extract = exports.duplicate = exports.extend = exports.compose = exports.mapSnd = exports.mapFst = exports.bimap = exports.swap = exports.snd = exports.fst = void 0;
exports.getApply = getApply;
exports.getApplicative = getApplicative;
exports.getChain = getChain;
exports.getMonad = getMonad;
exports.getChainRec = getChainRec;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var RT = __importStar(require("./ReadonlyTuple"));
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
exports.fst = RT.fst;
/**
 * @since 2.0.0
 */
exports.snd = RT.snd;
/**
 * @since 2.0.0
 */
var swap = function (ea) { return [(0, exports.snd)(ea), (0, exports.fst)(ea)]; };
exports.swap = swap;
/**
 * @category instances
 * @since 2.0.0
 */
function getApply(S) {
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return [(0, exports.fst)(fab)((0, exports.fst)(fa)), S.concat((0, exports.snd)(fab), (0, exports.snd)(fa))]; }
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
function getApplicative(M) {
    var A = getApply(M);
    return {
        URI: exports.URI,
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
function getChain(S) {
    var A = getApply(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        chain: function (ma, f) {
            var _a = f((0, exports.fst)(ma)), b = _a[0], s = _a[1];
            return [b, S.concat((0, exports.snd)(ma), s)];
        }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getMonad(M) {
    var C = getChain(M);
    return {
        URI: exports.URI,
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
function getChainRec(M) {
    var chainRec = function (a, f) {
        var result = f(a);
        var acc = M.empty;
        var s = (0, exports.fst)(result);
        while (s._tag === 'Left') {
            acc = M.concat(acc, (0, exports.snd)(result));
            result = f(s.left);
            s = (0, exports.fst)(result);
        }
        return [s.right, M.concat(acc, (0, exports.snd)(result))];
    };
    var C = getChain(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: C.map,
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
function _traverse(F) {
    var traverseF = (0, exports.traverse)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
}
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) {
    return [g((0, exports.fst)(fa)), f((0, exports.snd)(fa))];
}; };
exports.bimap = bimap;
/**
 * Map a function over the first component of a `Tuple`.
 *
 * This is the `map` operation of the `Functor` instance.
 *
 * @category mapping
 * @since 2.0.0
 */
var mapFst = function (f) { return function (fa) { return [f((0, exports.fst)(fa)), (0, exports.snd)(fa)]; }; };
exports.mapFst = mapFst;
/**
 * Map a function over the second component of a `Tuple`.
 *
 * This is the `mapLeft` operation of the `Bifunctor` instance.
 *
 * @category mapping
 * @since 2.10.0
 */
var mapSnd = function (f) { return function (fa) { return [(0, exports.fst)(fa), f((0, exports.snd)(fa))]; }; };
exports.mapSnd = mapSnd;
/**
 * @since 2.0.0
 */
var compose = function (ab) { return function (bc) { return [(0, exports.fst)(bc), (0, exports.snd)(ab)]; }; };
exports.compose = compose;
/**
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) { return [f(wa), (0, exports.snd)(wa)]; }; };
exports.extend = extend;
/**
 * @since 2.0.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * @category Extract
 * @since 2.6.2
 */
exports.extract = RT.extract;
/**
 * @category folding
 * @since 2.0.0
 */
exports.foldMap = RT.foldMap;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduce = RT.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduceRight = RT.reduceRight;
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) { return function (ta) { return F.map(f((0, exports.fst)(ta)), function (b) { return [b, (0, exports.snd)(ta)]; }); }; };
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (fas) {
        return F.map((0, exports.fst)(fas), function (a) { return [a, (0, exports.snd)(fas)]; });
    };
};
exports.sequence = sequence;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Tuple';
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
 * Use [`mapFst`](#mapfst) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.map = exports.mapFst;
/**
 * Use [`mapSnd`](#mapsnd) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.mapLeft = exports.mapSnd;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.tuple`
 * (where `T` is from `import T from 'fp-ts/Tuple'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.tuple = {
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
