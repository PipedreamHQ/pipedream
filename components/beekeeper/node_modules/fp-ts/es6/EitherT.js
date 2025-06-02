import { ap as ap_ } from './Apply';
import * as E from './Either';
import { flow, pipe } from './function';
import { map as map_ } from './Functor';
export function right(F) {
    return flow(E.right, F.of);
}
export function left(F) {
    return flow(E.left, F.of);
}
export function rightF(F) {
    return function (fa) { return F.map(fa, E.right); };
}
export function leftF(F) {
    return function (fe) { return F.map(fe, E.left); };
}
export function fromNullable(F) {
    return function (e) { return flow(E.fromNullable(e), F.of); };
}
export function fromNullableK(F) {
    var fromNullableF = fromNullable(F);
    return function (e) {
        var fromNullableFE = fromNullableF(e);
        return function (f) { return flow(f, fromNullableFE); };
    };
}
export function chainNullableK(M) {
    var chainM = chain(M);
    var fromNullableKM = fromNullableK(M);
    return function (e) {
        var fromNullableKMe = fromNullableKM(e);
        return function (f) { return chainM(fromNullableKMe(f)); };
    };
}
export function map(F) {
    return map_(F, E.Functor);
}
export function ap(F) {
    return ap_(F, E.Apply);
}
export function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
export function flatMap(M) {
    return function (ma, f) { return M.chain(ma, function (e) { return (E.isLeft(e) ? M.of(e) : f(e.right)); }); };
}
export function alt(M) {
    return function (second) { return function (first) { return M.chain(first, function (e) { return (E.isLeft(e) ? second() : M.of(e)); }); }; };
}
export function bimap(F) {
    var mapBothF = mapBoth(F);
    return function (f, g) { return function (self) { return mapBothF(self, f, g); }; };
}
/** @internal */
export function mapBoth(F) {
    return function (self, f, g) { return F.map(self, E.bimap(f, g)); };
}
export function mapLeft(F) {
    var mapErrorF = mapError(F);
    return function (f) { return function (self) { return mapErrorF(self, f); }; };
}
/** @internal */
export function mapError(F) {
    return function (self, f) { return F.map(self, E.mapLeft(f)); };
}
export function altValidation(M, S) {
    return function (second) { return function (first) {
        return M.chain(first, E.match(function (e1) {
            return M.map(second(), E.mapLeft(function (e2) { return S.concat(e1, e2); }));
        }, right(M)));
    }; };
}
export function match(F) {
    return function (onLeft, onRight) { return function (ma) { return F.map(ma, E.match(onLeft, onRight)); }; };
}
export function matchE(M) {
    return function (onLeft, onRight) { return function (ma) { return M.chain(ma, E.match(onLeft, onRight)); }; };
}
export function getOrElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, E.match(onLeft, M.of)); }; };
}
export function orElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? onLeft(e.left) : M.of(e)); }); }; };
}
export function orElseFirst(M) {
    var tapErrorM = tapError(M);
    return function (onLeft) { return function (ma) { return tapErrorM(ma, onLeft); }; };
}
/** @internal */
export function tapError(M) {
    var orElseM = orElse(M);
    return function (ma, onLeft) {
        return pipe(ma, orElseM(function (e) { return M.map(onLeft(e), function (eb) { return (E.isLeft(eb) ? eb : E.left(e)); }); }));
    };
}
export function orLeft(M) {
    return function (onLeft) { return function (ma) {
        return M.chain(ma, E.match(function (e) { return M.map(onLeft(e), E.left); }, function (a) { return M.of(E.right(a)); }));
    }; };
}
export function swap(F) {
    return function (ma) { return F.map(ma, E.swap); };
}
export function toUnion(F) {
    return function (fa) { return F.map(fa, E.toUnion); };
}
/** @deprecated  */
/* istanbul ignore next */
export function getEitherM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    var _alt = alt(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _getOrElse = getOrElse(M);
    var _orElse = orElse(M);
    return {
        map: function (fa, f) { return pipe(fa, _map(f)); },
        ap: function (fab, fa) { return pipe(fab, _ap(fa)); },
        of: right(M),
        chain: function (ma, f) { return pipe(ma, _chain(f)); },
        alt: function (fa, that) { return pipe(fa, _alt(that)); },
        bimap: function (fea, f, g) { return pipe(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return pipe(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight) { return pipe(fa, _fold(onLeft, onRight)); },
        getOrElse: function (fa, onLeft) { return pipe(fa, _getOrElse(onLeft)); },
        orElse: function (fa, f) { return pipe(fa, _orElse(f)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M)
    };
}
