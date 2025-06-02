"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = filter;
exports.filterMap = filterMap;
exports.partition = partition;
exports.partitionMap = partitionMap;
exports.getFilterableComposition = getFilterableComposition;
/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */
var Compactable_1 = require("./Compactable");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var Option_1 = require("./Option");
var Predicate_1 = require("./Predicate");
var Separated_1 = require("./Separated");
function filter(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
function filterMap(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
function partition(F, G) {
    var _filter = filter(F, G);
    return function (predicate) {
        var left = _filter((0, Predicate_1.not)(predicate));
        var right = _filter(predicate);
        return function (fgb) { return (0, Separated_1.separated)(left(fgb), right(fgb)); };
    };
}
function partitionMap(F, G) {
    var _filterMap = filterMap(F, G);
    return function (f) { return function (fga) {
        return (0, Separated_1.separated)((0, function_1.pipe)(fga, _filterMap(function (a) { return (0, Option_1.getLeft)(f(a)); })), (0, function_1.pipe)(fga, _filterMap(function (a) { return (0, Option_1.getRight)(f(a)); })));
    }; };
}
/** @deprecated */
function getFilterableComposition(F, G) {
    var map = (0, Functor_1.getFunctorComposition)(F, G).map;
    var _compact = (0, Compactable_1.compact)(F, G);
    var _separate = (0, Compactable_1.separate)(F, G, G);
    var _filter = filter(F, G);
    var _filterMap = filterMap(F, G);
    var _partition = partition(F, G);
    var _partitionMap = partitionMap(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return (0, function_1.pipe)(fga, _filter(f)); },
        filterMap: function (fga, f) { return (0, function_1.pipe)(fga, _filterMap(f)); },
        partition: function (fga, p) { return (0, function_1.pipe)(fga, _partition(p)); },
        partitionMap: function (fga, f) { return (0, function_1.pipe)(fga, _partitionMap(f)); }
    };
}
