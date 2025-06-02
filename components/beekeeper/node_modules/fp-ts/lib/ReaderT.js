"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.of = of;
exports.map = map;
exports.ap = ap;
exports.chain = chain;
exports.flatMap = flatMap;
exports.fromReader = fromReader;
exports.fromNaturalTransformation = fromNaturalTransformation;
exports.getReaderM = getReaderM;
var function_1 = require("./function");
function of(F) {
    return function (a) { return function () { return F.of(a); }; };
}
function map(F) {
    return function (f) { return function (fa) { return function (r) { return F.map(fa(r), f); }; }; };
}
function ap(F) {
    return function (fa) { return function (fab) { return function (r) { return F.ap(fab(r), fa(r)); }; }; };
}
function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
function flatMap(M) {
    return function (ma, f) { return function (r) { return M.chain(ma(r), function (a) { return f(a)(r); }); }; };
}
function fromReader(F) {
    return function (ma) { return (0, function_1.flow)(ma, F.of); };
}
function fromNaturalTransformation(nt) {
    return function (f) { return (0, function_1.flow)(f, nt); };
}
/** @deprecated */
/* istanbul ignore next */
function getReaderM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    return {
        map: function (fa, f) { return (0, function_1.pipe)(fa, _map(f)); },
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, _ap(fa)); },
        of: of(M),
        chain: function (ma, f) { return (0, function_1.pipe)(ma, _chain(f)); },
        ask: function () { return M.of; },
        asks: function (f) { return (0, function_1.flow)(f, M.of); },
        local: function (ma, f) { return function (q) { return ma(f(q)); }; },
        fromReader: fromReader(M),
        fromM: function (ma) { return function () { return ma; }; }
    };
}
