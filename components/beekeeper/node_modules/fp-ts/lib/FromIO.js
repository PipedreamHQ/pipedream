"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIOK = fromIOK;
exports.chainIOK = chainIOK;
exports.chainFirstIOK = chainFirstIOK;
exports.tapIO = tapIO;
/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */
var Chain_1 = require("./Chain");
var function_1 = require("./function");
function fromIOK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromIO); };
}
function chainIOK(F, M) {
    return function (f) {
        var g = (0, function_1.flow)(f, F.fromIO);
        return function (first) { return M.chain(first, g); };
    };
}
function chainFirstIOK(F, M) {
    var tapIOM = tapIO(F, M);
    return function (f) { return function (first) { return tapIOM(first, f); }; };
}
/** @internal */
function tapIO(F, M) {
    var chainFirstM = (0, Chain_1.tap)(M);
    return function (self, f) { return chainFirstM(self, (0, function_1.flow)(f, F.fromIO)); };
}
