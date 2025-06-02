"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = split;
exports.fanIn = fanIn;
exports.splitChoice = splitChoice;
exports.fanin = fanin;
var function_1 = require("./function");
function split(P, C) {
    return function (pab, pcd) { return C.compose(P.right(pcd), P.left(pab)); };
}
function fanIn(P, C) {
    var splitPC = split(P, C);
    return function (pac, pbc) {
        return C.compose(P.promap(C.id(), function (cc) { return (cc._tag === 'Left' ? cc.left : cc.right); }, function_1.identity), splitPC(pac, pbc));
    };
}
function splitChoice(F) {
    return split(F, F);
}
function fanin(F) {
    return fanIn(F, F);
}
