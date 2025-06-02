import { pipe } from './function';
import { getFunctorComposition, map } from './Functor';
import { getLeft, getRight } from './Option';
import * as S from './Separated';
export function compact(F, G) {
    return function (fga) { return F.map(fga, G.compact); };
}
export function separate(F, C, G) {
    var _compact = compact(F, C);
    var _map = map(F, G);
    return function (fge) { return S.separated(_compact(pipe(fge, _map(getLeft))), _compact(pipe(fge, _map(getRight)))); };
}
/** @deprecated */
export function getCompactableComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    return {
        map: map,
        compact: compact(F, G),
        separate: separate(F, G, G)
    };
}
