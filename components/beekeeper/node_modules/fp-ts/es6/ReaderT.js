import { flow, pipe } from './function';
export function of(F) {
    return function (a) { return function () { return F.of(a); }; };
}
export function map(F) {
    return function (f) { return function (fa) { return function (r) { return F.map(fa(r), f); }; }; };
}
export function ap(F) {
    return function (fa) { return function (fab) { return function (r) { return F.ap(fab(r), fa(r)); }; }; };
}
export function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
export function flatMap(M) {
    return function (ma, f) { return function (r) { return M.chain(ma(r), function (a) { return f(a)(r); }); }; };
}
export function fromReader(F) {
    return function (ma) { return flow(ma, F.of); };
}
export function fromNaturalTransformation(nt) {
    return function (f) { return flow(f, nt); };
}
/** @deprecated */
/* istanbul ignore next */
export function getReaderM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    return {
        map: function (fa, f) { return pipe(fa, _map(f)); },
        ap: function (fab, fa) { return pipe(fab, _ap(fa)); },
        of: of(M),
        chain: function (ma, f) { return pipe(ma, _chain(f)); },
        ask: function () { return M.of; },
        asks: function (f) { return flow(f, M.of); },
        local: function (ma, f) { return function (q) { return ma(f(q)); }; },
        fromReader: fromReader(M),
        fromM: function (ma) { return function () { return ma; }; }
    };
}
