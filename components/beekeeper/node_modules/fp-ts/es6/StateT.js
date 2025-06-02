import { pipe } from './function';
import { snd } from './ReadonlyTuple';
export function of(F) {
    return function (a) { return function (s) { return F.of([a, s]); }; };
}
export function map(F) {
    return function (f) { return function (fa) { return function (s) { return F.map(fa(s), function (_a) {
        var a = _a[0], s1 = _a[1];
        return [f(a), s1];
    }); }; }; };
}
export function ap(M) {
    return function (fa) { return function (fab) { return function (s) { return M.chain(fab(s), function (_a) {
        var f = _a[0], s = _a[1];
        return M.map(fa(s), function (_a) {
            var a = _a[0], s = _a[1];
            return [f(a), s];
        });
    }); }; }; };
}
export function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
/** @internal */
export function flatMap(M) {
    return function (ma, f) { return function (s) { return M.chain(ma(s), function (_a) {
        var a = _a[0], s1 = _a[1];
        return f(a)(s1);
    }); }; };
}
export function fromState(F) {
    return function (sa) { return function (s) { return F.of(sa(s)); }; };
}
export function fromF(F) {
    return function (ma) { return function (s) { return F.map(ma, function (a) { return [a, s]; }); }; };
}
export function evaluate(F) {
    return function (s) { return function (ma) { return F.map(ma(s), function (_a) {
        var a = _a[0];
        return a;
    }); }; };
}
export function execute(F) {
    return function (s) { return function (ma) { return F.map(ma(s), snd); }; };
}
/** @deprecated */
/* istanbul ignore next */
export function getStateM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    var _evaluate = evaluate(M);
    var _execute = execute(M);
    return {
        map: function (fa, f) { return pipe(fa, _map(f)); },
        ap: function (fab, fa) { return pipe(fab, _ap(fa)); },
        of: of(M),
        chain: function (ma, f) { return pipe(ma, _chain(f)); },
        get: function () { return function (s) { return M.of([s, s]); }; },
        put: function (s) { return function () { return M.of([undefined, s]); }; },
        modify: function (f) { return function (s) { return M.of([undefined, f(s)]); }; },
        gets: function (f) { return function (s) { return M.of([f(s), s]); }; },
        fromState: fromState(M),
        fromM: fromF(M),
        evalState: function (fa, s) { return pipe(fa, _evaluate(s)); },
        execState: function (fa, s) { return pipe(fa, _execute(s)); }
    };
}
