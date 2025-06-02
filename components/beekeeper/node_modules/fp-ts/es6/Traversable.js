import { getFoldableComposition } from './Foldable';
import { pipe } from './function';
import { getFunctorComposition } from './Functor';
export function traverse(T, G) {
    return function (F) {
        var traverseT = T.traverse(F);
        var traverseG = G.traverse(F);
        return function (f) { return function (fga) { return traverseT(fga, function (ga) { return traverseG(ga, f); }); }; };
    };
}
export function sequence(T, G) {
    return function (F) {
        var sequenceT = T.sequence(F);
        var sequenceG = G.sequence(F);
        return function (fgha) { return sequenceT(T.map(fgha, sequenceG)); };
    };
}
/** @deprecated */
export function getTraversableComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    var FC = getFoldableComposition(F, G);
    var _traverse = traverse(F, G);
    var _sequence = sequence(F, G);
    return {
        map: map,
        reduce: FC.reduce,
        foldMap: FC.foldMap,
        reduceRight: FC.reduceRight,
        traverse: function (H) {
            var traverseH = _traverse(H);
            return function (fga, f) { return pipe(fga, traverseH(f)); };
        },
        sequence: function (H) {
            var sequenceH = _sequence(H);
            return function (fgha) { return pipe(fgha, sequenceH); };
        }
    };
}
