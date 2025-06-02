/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */
import { compact, separate } from './Compactable';
import { pipe } from './function';
import { getFunctorComposition } from './Functor';
import { getLeft, getRight } from './Option';
import { not } from './Predicate';
import { separated } from './Separated';
export function filter(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
export function filterMap(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
export function partition(F, G) {
    var _filter = filter(F, G);
    return function (predicate) {
        var left = _filter(not(predicate));
        var right = _filter(predicate);
        return function (fgb) { return separated(left(fgb), right(fgb)); };
    };
}
export function partitionMap(F, G) {
    var _filterMap = filterMap(F, G);
    return function (f) { return function (fga) {
        return separated(pipe(fga, _filterMap(function (a) { return getLeft(f(a)); })), pipe(fga, _filterMap(function (a) { return getRight(f(a)); })));
    }; };
}
/** @deprecated */
export function getFilterableComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    var _compact = compact(F, G);
    var _separate = separate(F, G, G);
    var _filter = filter(F, G);
    var _filterMap = filterMap(F, G);
    var _partition = partition(F, G);
    var _partitionMap = partitionMap(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return pipe(fga, _filter(f)); },
        filterMap: function (fga, f) { return pipe(fga, _filterMap(f)); },
        partition: function (fga, p) { return pipe(fga, _partition(p)); },
        partitionMap: function (fga, f) { return pipe(fga, _partitionMap(f)); }
    };
}
