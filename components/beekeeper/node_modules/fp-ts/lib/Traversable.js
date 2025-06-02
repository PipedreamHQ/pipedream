"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = traverse;
exports.sequence = sequence;
exports.getTraversableComposition = getTraversableComposition;
var Foldable_1 = require("./Foldable");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
function traverse(T, G) {
    return function (F) {
        var traverseT = T.traverse(F);
        var traverseG = G.traverse(F);
        return function (f) { return function (fga) { return traverseT(fga, function (ga) { return traverseG(ga, f); }); }; };
    };
}
function sequence(T, G) {
    return function (F) {
        var sequenceT = T.sequence(F);
        var sequenceG = G.sequence(F);
        return function (fgha) { return sequenceT(T.map(fgha, sequenceG)); };
    };
}
/** @deprecated */
function getTraversableComposition(F, G) {
    var map = (0, Functor_1.getFunctorComposition)(F, G).map;
    var FC = (0, Foldable_1.getFoldableComposition)(F, G);
    var _traverse = traverse(F, G);
    var _sequence = sequence(F, G);
    return {
        map: map,
        reduce: FC.reduce,
        foldMap: FC.foldMap,
        reduceRight: FC.reduceRight,
        traverse: function (H) {
            var traverseH = _traverse(H);
            return function (fga, f) { return (0, function_1.pipe)(fga, traverseH(f)); };
        },
        sequence: function (H) {
            var sequenceH = _sequence(H);
            return function (fgha) { return (0, function_1.pipe)(fgha, sequenceH); };
        }
    };
}
