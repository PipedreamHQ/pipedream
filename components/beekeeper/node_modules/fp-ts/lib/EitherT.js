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
exports.right = right;
exports.left = left;
exports.rightF = rightF;
exports.leftF = leftF;
exports.fromNullable = fromNullable;
exports.fromNullableK = fromNullableK;
exports.chainNullableK = chainNullableK;
exports.map = map;
exports.ap = ap;
exports.chain = chain;
exports.flatMap = flatMap;
exports.alt = alt;
exports.bimap = bimap;
exports.mapBoth = mapBoth;
exports.mapLeft = mapLeft;
exports.mapError = mapError;
exports.altValidation = altValidation;
exports.match = match;
exports.matchE = matchE;
exports.getOrElse = getOrElse;
exports.orElse = orElse;
exports.orElseFirst = orElseFirst;
exports.tapError = tapError;
exports.orLeft = orLeft;
exports.swap = swap;
exports.toUnion = toUnion;
exports.getEitherM = getEitherM;
var Apply_1 = require("./Apply");
var E = __importStar(require("./Either"));
var function_1 = require("./function");
var Functor_1 = require("./Functor");
function right(F) {
    return (0, function_1.flow)(E.right, F.of);
}
function left(F) {
    return (0, function_1.flow)(E.left, F.of);
}
function rightF(F) {
    return function (fa) { return F.map(fa, E.right); };
}
function leftF(F) {
    return function (fe) { return F.map(fe, E.left); };
}
function fromNullable(F) {
    return function (e) { return (0, function_1.flow)(E.fromNullable(e), F.of); };
}
function fromNullableK(F) {
    var fromNullableF = fromNullable(F);
    return function (e) {
        var fromNullableFE = fromNullableF(e);
        return function (f) { return (0, function_1.flow)(f, fromNullableFE); };
    };
}
function chainNullableK(M) {
    var chainM = chain(M);
    var fromNullableKM = fromNullableK(M);
    return function (e) {
        var fromNullableKMe = fromNullableKM(e);
        return function (f) { return chainM(fromNullableKMe(f)); };
    };
}
function map(F) {
    return (0, Functor_1.map)(F, E.Functor);
}
function ap(F) {
    return (0, Apply_1.ap)(F, E.Apply);
}
function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
function flatMap(M) {
    return function (ma, f) { return M.chain(ma, function (e) { return (E.isLeft(e) ? M.of(e) : f(e.right)); }); };
}
function alt(M) {
    return function (second) { return function (first) { return M.chain(first, function (e) { return (E.isLeft(e) ? second() : M.of(e)); }); }; };
}
function bimap(F) {
    var mapBothF = mapBoth(F);
    return function (f, g) { return function (self) { return mapBothF(self, f, g); }; };
}
/** @internal */
function mapBoth(F) {
    return function (self, f, g) { return F.map(self, E.bimap(f, g)); };
}
function mapLeft(F) {
    var mapErrorF = mapError(F);
    return function (f) { return function (self) { return mapErrorF(self, f); }; };
}
/** @internal */
function mapError(F) {
    return function (self, f) { return F.map(self, E.mapLeft(f)); };
}
function altValidation(M, S) {
    return function (second) { return function (first) {
        return M.chain(first, E.match(function (e1) {
            return M.map(second(), E.mapLeft(function (e2) { return S.concat(e1, e2); }));
        }, right(M)));
    }; };
}
function match(F) {
    return function (onLeft, onRight) { return function (ma) { return F.map(ma, E.match(onLeft, onRight)); }; };
}
function matchE(M) {
    return function (onLeft, onRight) { return function (ma) { return M.chain(ma, E.match(onLeft, onRight)); }; };
}
function getOrElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, E.match(onLeft, M.of)); }; };
}
function orElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? onLeft(e.left) : M.of(e)); }); }; };
}
function orElseFirst(M) {
    var tapErrorM = tapError(M);
    return function (onLeft) { return function (ma) { return tapErrorM(ma, onLeft); }; };
}
/** @internal */
function tapError(M) {
    var orElseM = orElse(M);
    return function (ma, onLeft) {
        return (0, function_1.pipe)(ma, orElseM(function (e) { return M.map(onLeft(e), function (eb) { return (E.isLeft(eb) ? eb : E.left(e)); }); }));
    };
}
function orLeft(M) {
    return function (onLeft) { return function (ma) {
        return M.chain(ma, E.match(function (e) { return M.map(onLeft(e), E.left); }, function (a) { return M.of(E.right(a)); }));
    }; };
}
function swap(F) {
    return function (ma) { return F.map(ma, E.swap); };
}
function toUnion(F) {
    return function (fa) { return F.map(fa, E.toUnion); };
}
/** @deprecated  */
/* istanbul ignore next */
function getEitherM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    var _alt = alt(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _getOrElse = getOrElse(M);
    var _orElse = orElse(M);
    return {
        map: function (fa, f) { return (0, function_1.pipe)(fa, _map(f)); },
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, _ap(fa)); },
        of: right(M),
        chain: function (ma, f) { return (0, function_1.pipe)(ma, _chain(f)); },
        alt: function (fa, that) { return (0, function_1.pipe)(fa, _alt(that)); },
        bimap: function (fea, f, g) { return (0, function_1.pipe)(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return (0, function_1.pipe)(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight) { return (0, function_1.pipe)(fa, _fold(onLeft, onRight)); },
        getOrElse: function (fa, onLeft) { return (0, function_1.pipe)(fa, _getOrElse(onLeft)); },
        orElse: function (fa, f) { return (0, function_1.pipe)(fa, _orElse(f)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M)
    };
}
