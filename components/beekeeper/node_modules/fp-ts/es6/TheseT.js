/**
 * @since 2.4.0
 */
import { ap as ap_ } from './Apply';
import { flow, pipe } from './function';
import { map as map_ } from './Functor';
import * as T from './These';
export function right(F) {
    return flow(T.right, F.of);
}
export function left(F) {
    return flow(T.left, F.of);
}
export function both(F) {
    return flow(T.both, F.of);
}
export function rightF(F) {
    return function (fa) { return F.map(fa, T.right); };
}
export function leftF(F) {
    return function (fe) { return F.map(fe, T.left); };
}
export function map(F) {
    return map_(F, T.Functor);
}
export function ap(F, S) {
    return ap_(F, T.getApply(S));
}
export function chain(M, S) {
    var _left = left(M);
    return function (f) { return function (ma) {
        return M.chain(ma, T.match(_left, f, function (e1, a) {
            return M.map(f(a), T.match(function (e2) { return T.left(S.concat(e1, e2)); }, function (b) { return T.both(e1, b); }, function (e2, b) { return T.both(S.concat(e1, e2), b); }));
        }));
    }; };
}
export function bimap(F) {
    return function (f, g) { return function (fea) { return F.map(fea, T.bimap(f, g)); }; };
}
export function mapLeft(F) {
    return function (f) { return function (fea) { return F.map(fea, T.mapLeft(f)); }; };
}
export function match(F) {
    return function (onLeft, onRight, onBoth) { return function (ma) { return F.map(ma, T.match(onLeft, onRight, onBoth)); }; };
}
export function matchE(M) {
    return function (onLeft, onRight, onBoth) { return function (ma) { return M.chain(ma, T.match(onLeft, onRight, onBoth)); }; };
}
export function swap(F) {
    return function (ma) { return F.map(ma, T.swap); };
}
export function toTuple2(F) {
    return function (e, a) { return function (fa) { return F.map(fa, T.toTuple2(e, a)); }; };
}
/** @deprecated */
/* istanbul ignore next */
export function getTheseM(M) {
    var _map = map(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _toTuple2 = toTuple2(M);
    var of = right(M);
    var mapT = function (fa, f) { return pipe(fa, _map(f)); };
    return {
        map: mapT,
        bimap: function (fea, f, g) { return pipe(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return pipe(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight, onBoth) { return pipe(fa, _fold(onLeft, onRight, onBoth)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M),
        right: right(M),
        both: both(M),
        toTuple: function (fa, e, a) {
            return pipe(fa, _toTuple2(function () { return e; }, function () { return a; }));
        },
        getMonad: function (S) {
            var _ap = ap(M, S);
            var _chain = chain(M, S);
            return {
                _E: undefined,
                map: mapT,
                of: of,
                ap: function (fab, fa) { return pipe(fab, _ap(fa)); },
                chain: function (ma, f) { return pipe(ma, _chain(f)); }
            };
        }
    };
}
