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
exports.some = some;
exports.zero = zero;
exports.fromF = fromF;
exports.fromNullable = fromNullable;
exports.fromNullableK = fromNullableK;
exports.chainNullableK = chainNullableK;
exports.fromOptionK = fromOptionK;
exports.chainOptionK = chainOptionK;
exports.fromPredicate = fromPredicate;
exports.fromEither = fromEither;
exports.match = match;
exports.matchE = matchE;
exports.getOrElse = getOrElse;
exports.map = map;
exports.ap = ap;
exports.chain = chain;
exports.flatMap = flatMap;
exports.alt = alt;
exports.getOptionM = getOptionM;
var Apply_1 = require("./Apply");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var O = __importStar(require("./Option"));
function some(F) {
    return (0, function_1.flow)(O.some, F.of);
}
function zero(F) {
    return (0, function_1.constant)(F.of(O.none));
}
function fromF(F) {
    return function (ma) { return F.map(ma, O.some); };
}
function fromNullable(F) {
    return (0, function_1.flow)(O.fromNullable, F.of);
}
function fromNullableK(F) {
    var fromNullableF = fromNullable(F);
    return function (f) { return (0, function_1.flow)(f, fromNullableF); };
}
function chainNullableK(M) {
    var chainM = chain(M);
    var fromNullableKM = fromNullableK(M);
    return function (f) { return chainM(fromNullableKM(f)); };
}
function fromOptionK(F) {
    return function (f) { return (0, function_1.flow)(f, F.of); };
}
function chainOptionK(M) {
    var chainM = chain(M);
    var fromOptionKM = fromOptionK(M);
    return function (f) { return chainM(fromOptionKM(f)); };
}
function fromPredicate(F) {
    return function (predicate) {
        return function (a) {
            return F.of(O.fromPredicate(predicate)(a));
        };
    };
}
function fromEither(F) {
    return (0, function_1.flow)(O.fromEither, F.of);
}
function match(F) {
    return function (onNone, onSome) { return function (ma) { return F.map(ma, O.match(onNone, onSome)); }; };
}
function matchE(M) {
    return function (onNone, onSome) { return function (ma) { return M.chain(ma, O.match(onNone, onSome)); }; };
}
function getOrElse(M) {
    return function (onNone) { return function (fa) { return M.chain(fa, O.match(onNone, M.of)); }; };
}
function map(F) {
    return (0, Functor_1.map)(F, O.Functor);
}
function ap(F) {
    return (0, Apply_1.ap)(F, O.Apply);
}
function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
function flatMap(M) {
    var zeroM = zero(M);
    return function (ma, f) {
        return M.chain(ma, O.match(function () { return zeroM(); }, f));
    };
}
function alt(M) {
    var _some = some(M);
    return function (second) { return function (first) { return M.chain(first, O.match(second, _some)); }; };
}
/** @deprecated */
function getOptionM(M) {
    var apM = ap(M);
    var mapM = map(M);
    var chainM = chain(M);
    var altM = alt(M);
    var foldM = matchE(M);
    var getOrElseM = getOrElse(M);
    var zeroM = zero(M);
    return {
        map: function (fa, f) { return (0, function_1.pipe)(fa, mapM(f)); },
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, apM(fa)); },
        of: some(M),
        chain: function (ma, f) { return (0, function_1.pipe)(ma, chainM(f)); },
        alt: function (fa, that) { return (0, function_1.pipe)(fa, altM(that)); },
        fold: function (fa, onNone, onSome) { return (0, function_1.pipe)(fa, foldM(onNone, onSome)); },
        getOrElse: function (fa, onNone) { return (0, function_1.pipe)(fa, getOrElseM(onNone)); },
        fromM: fromF(M),
        none: function () { return zeroM(); }
    };
}
