"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = split;
exports.fanOut = fanOut;
exports.splitStrong = splitStrong;
exports.fanout = fanout;
var function_1 = require("./function");
function split(S, C) {
    return function (pab, pcd) {
        return C.compose(S.second(pcd), S.first(pab));
    };
}
function fanOut(S, C) {
    var splitSC = split(S, C);
    return function (pab, pac) {
        return C.compose(splitSC(pab, pac), S.promap(C.id(), function_1.identity, function (a) { return [a, a]; }));
    };
}
function splitStrong(F) {
    return split(F, F);
}
function fanout(F) {
    return fanOut(F, F);
}
