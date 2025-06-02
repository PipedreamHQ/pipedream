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
exports.both = both;
exports.rightF = rightF;
exports.leftF = leftF;
exports.map = map;
exports.ap = ap;
exports.chain = chain;
exports.bimap = bimap;
exports.mapLeft = mapLeft;
exports.match = match;
exports.matchE = matchE;
exports.swap = swap;
exports.toTuple2 = toTuple2;
exports.getTheseM = getTheseM;
/**
 * @since 2.4.0
 */
var Apply_1 = require("./Apply");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var T = __importStar(require("./These"));
function right(F) {
    return (0, function_1.flow)(T.right, F.of);
}
function left(F) {
    return (0, function_1.flow)(T.left, F.of);
}
function both(F) {
    return (0, function_1.flow)(T.both, F.of);
}
function rightF(F) {
    return function (fa) { return F.map(fa, T.right); };
}
function leftF(F) {
    return function (fe) { return F.map(fe, T.left); };
}
function map(F) {
    return (0, Functor_1.map)(F, T.Functor);
}
function ap(F, S) {
    return (0, Apply_1.ap)(F, T.getApply(S));
}
function chain(M, S) {
    var _left = left(M);
    return function (f) { return function (ma) {
        return M.chain(ma, T.match(_left, f, function (e1, a) {
            return M.map(f(a), T.match(function (e2) { return T.left(S.concat(e1, e2)); }, function (b) { return T.both(e1, b); }, function (e2, b) { return T.both(S.concat(e1, e2), b); }));
        }));
    }; };
}
function bimap(F) {
    return function (f, g) { return function (fea) { return F.map(fea, T.bimap(f, g)); }; };
}
function mapLeft(F) {
    return function (f) { return function (fea) { return F.map(fea, T.mapLeft(f)); }; };
}
function match(F) {
    return function (onLeft, onRight, onBoth) { return function (ma) { return F.map(ma, T.match(onLeft, onRight, onBoth)); }; };
}
function matchE(M) {
    return function (onLeft, onRight, onBoth) { return function (ma) { return M.chain(ma, T.match(onLeft, onRight, onBoth)); }; };
}
function swap(F) {
    return function (ma) { return F.map(ma, T.swap); };
}
function toTuple2(F) {
    return function (e, a) { return function (fa) { return F.map(fa, T.toTuple2(e, a)); }; };
}
/** @deprecated */
/* istanbul ignore next */
function getTheseM(M) {
    var _map = map(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _toTuple2 = toTuple2(M);
    var of = right(M);
    var mapT = function (fa, f) { return (0, function_1.pipe)(fa, _map(f)); };
    return {
        map: mapT,
        bimap: function (fea, f, g) { return (0, function_1.pipe)(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return (0, function_1.pipe)(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight, onBoth) { return (0, function_1.pipe)(fa, _fold(onLeft, onRight, onBoth)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M),
        right: right(M),
        both: both(M),
        toTuple: function (fa, e, a) {
            return (0, function_1.pipe)(fa, _toTuple2(function () { return e; }, function () { return a; }));
        },
        getMonad: function (S) {
            var _ap = ap(M, S);
            var _chain = chain(M, S);
            return {
                _E: undefined,
                map: mapT,
                of: of,
                ap: function (fab, fa) { return (0, function_1.pipe)(fab, _ap(fa)); },
                chain: function (ma, f) { return (0, function_1.pipe)(ma, _chain(f)); }
            };
        }
    };
}
