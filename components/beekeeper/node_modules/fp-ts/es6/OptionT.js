import { ap as ap_ } from './Apply';
import { constant, flow, pipe } from './function';
import { map as map_ } from './Functor';
import * as O from './Option';
export function some(F) {
    return flow(O.some, F.of);
}
export function zero(F) {
    return constant(F.of(O.none));
}
export function fromF(F) {
    return function (ma) { return F.map(ma, O.some); };
}
export function fromNullable(F) {
    return flow(O.fromNullable, F.of);
}
export function fromNullableK(F) {
    var fromNullableF = fromNullable(F);
    return function (f) { return flow(f, fromNullableF); };
}
export function chainNullableK(M) {
    var chainM = chain(M);
    var fromNullableKM = fromNullableK(M);
    return function (f) { return chainM(fromNullableKM(f)); };
}
export function fromOptionK(F) {
    return function (f) { return flow(f, F.of); };
}
export function chainOptionK(M) {
    var chainM = chain(M);
    var fromOptionKM = fromOptionK(M);
    return function (f) { return chainM(fromOptionKM(f)); };
}
export function fromPredicate(F) {
    return function (predicate) {
        return function (a) {
            return F.of(O.fromPredicate(predicate)(a));
        };
    };
}
export function fromEither(F) {
    return flow(O.fromEither, F.of);
}
export function match(F) {
    return function (onNone, onSome) { return function (ma) { return F.map(ma, O.match(onNone, onSome)); }; };
}
export function matchE(M) {
    return function (onNone, onSome) { return function (ma) { return M.chain(ma, O.match(onNone, onSome)); }; };
}
export function getOrElse(M) {
    return function (onNone) { return function (fa) { return M.chain(fa, O.match(onNone, M.of)); }; };
}
export function map(F) {
    return map_(F, O.Functor);
}
export function ap(F) {
    return ap_(F, O.Apply);
}
export function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
export function flatMap(M) {
    var zeroM = zero(M);
    return function (ma, f) {
        return M.chain(ma, O.match(function () { return zeroM(); }, f));
    };
}
export function alt(M) {
    var _some = some(M);
    return function (second) { return function (first) { return M.chain(first, O.match(second, _some)); }; };
}
/** @deprecated */
export function getOptionM(M) {
    var apM = ap(M);
    var mapM = map(M);
    var chainM = chain(M);
    var altM = alt(M);
    var foldM = matchE(M);
    var getOrElseM = getOrElse(M);
    var zeroM = zero(M);
    return {
        map: function (fa, f) { return pipe(fa, mapM(f)); },
        ap: function (fab, fa) { return pipe(fab, apM(fa)); },
        of: some(M),
        chain: function (ma, f) { return pipe(ma, chainM(f)); },
        alt: function (fa, that) { return pipe(fa, altM(that)); },
        fold: function (fa, onNone, onSome) { return pipe(fa, foldM(onNone, onSome)); },
        getOrElse: function (fa, onNone) { return pipe(fa, getOrElseM(onNone)); },
        fromM: fromF(M),
        none: function () { return zeroM(); }
    };
}
