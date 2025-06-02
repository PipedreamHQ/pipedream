/**
 * A `FunctorWithIndex` is a type constructor which supports a mapping operation `mapWithIndex`.
 *
 * `mapWithIndex` can be used to turn functions `i -> a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.mapWithIndex(fa, (_i, a) => a) <-> fa`
 * 2. Composition: `F.mapWithIndex(fa, (_i, a) => bc(ab(a))) <-> F.mapWithIndex(F.mapWithIndex(fa, ab), bc)`
 *
 * @since 2.0.0
 */
import { pipe } from './function';
import { getFunctorComposition } from './Functor';
export function mapWithIndex(F, G) {
    return function (f) { return function (fa) { return F.mapWithIndex(fa, function (i, ga) { return G.mapWithIndex(ga, function (j, a) { return f([i, j], a); }); }); }; };
}
/** @deprecated */
export function getFunctorWithIndexComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    var _mapWithIndex = mapWithIndex(F, G);
    return {
        map: map,
        mapWithIndex: function (fga, f) { return pipe(fga, _mapWithIndex(f)); }
    };
}
