/**
 * A `Foldable` with an additional index.
 * A `FoldableWithIndex` instance must be compatible with its `Foldable` instance
 *
 * ```ts
 * reduce(fa, b, f) = reduceWithIndex(fa, b, (_, b, a) => f(b, a))
 * foldMap(M)(fa, f) = foldMapWithIndex(M)(fa, (_, a) => f(a))
 * reduceRight(fa, b, f) = reduceRightWithIndex(fa, b, (_, a, b) => f(a, b))
 * ```
 *
 * @since 2.0.0
 */
import { getFoldableComposition } from './Foldable';
import { pipe } from './function';
export function reduceWithIndex(F, G) {
    return function (b, f) { return function (fga) {
        return F.reduceWithIndex(fga, b, function (i, b, ga) { return G.reduceWithIndex(ga, b, function (j, b, a) { return f([i, j], b, a); }); });
    }; };
}
export function foldMapWithIndex(F, G) {
    return function (M) {
        var foldMapWithIndexF = F.foldMapWithIndex(M);
        var foldMapWithIndexG = G.foldMapWithIndex(M);
        return function (f) { return function (fga) { return foldMapWithIndexF(fga, function (i, ga) { return foldMapWithIndexG(ga, function (j, a) { return f([i, j], a); }); }); }; };
    };
}
export function reduceRightWithIndex(F, G) {
    return function (b, f) { return function (fga) {
        return F.reduceRightWithIndex(fga, b, function (i, ga, b) { return G.reduceRightWithIndex(ga, b, function (j, a, b) { return f([i, j], a, b); }); });
    }; };
}
/** @deprecated */
export function getFoldableWithIndexComposition(F, G) {
    var FC = getFoldableComposition(F, G);
    var _reduceWithIndex = reduceWithIndex(F, G);
    var _foldMapWithIndex = foldMapWithIndex(F, G);
    var _reduceRightWithIndex = reduceRightWithIndex(F, G);
    return {
        reduce: FC.reduce,
        foldMap: FC.foldMap,
        reduceRight: FC.reduceRight,
        reduceWithIndex: function (fga, b, f) { return pipe(fga, _reduceWithIndex(b, f)); },
        foldMapWithIndex: function (M) {
            var foldMapWithIndexM = _foldMapWithIndex(M);
            return function (fga, f) { return pipe(fga, foldMapWithIndexM(f)); };
        },
        reduceRightWithIndex: function (fga, b, f) { return pipe(fga, _reduceRightWithIndex(b, f)); }
    };
}
