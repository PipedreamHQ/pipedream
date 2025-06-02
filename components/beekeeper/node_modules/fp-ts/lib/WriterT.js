"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWriterM = getWriterM;
function getWriterM(M) {
    var map = function (fa, f) {
        return function () {
            return M.map(fa(), function (_a) {
                var a = _a[0], w = _a[1];
                return [f(a), w];
            });
        };
    };
    return {
        map: map,
        evalWriter: function (fa) { return M.map(fa(), function (_a) {
            var a = _a[0];
            return a;
        }); },
        execWriter: function (fa) { return M.map(fa(), function (_a) {
            var _ = _a[0], w = _a[1];
            return w;
        }); },
        tell: function (w) { return function () { return M.of([undefined, w]); }; },
        listen: function (fa) { return function () { return M.map(fa(), function (_a) {
            var a = _a[0], w = _a[1];
            return [[a, w], w];
        }); }; },
        pass: function (fa) { return function () { return M.map(fa(), function (_a) {
            var _b = _a[0], a = _b[0], f = _b[1], w = _a[1];
            return [a, f(w)];
        }); }; },
        listens: function (fa, f) { return function () { return M.map(fa(), function (_a) {
            var a = _a[0], w = _a[1];
            return [[a, f(w)], w];
        }); }; },
        censor: function (fa, f) { return function () { return M.map(fa(), function (_a) {
            var a = _a[0], w = _a[1];
            return [a, f(w)];
        }); }; },
        getMonad: function (W) {
            return {
                _E: undefined,
                map: map,
                of: function (a) { return function () { return M.of([a, W.empty]); }; },
                ap: function (mab, ma) { return function () { return M.chain(mab(), function (_a) {
                    var f = _a[0], w1 = _a[1];
                    return M.map(ma(), function (_a) {
                        var a = _a[0], w2 = _a[1];
                        return [f(a), W.concat(w1, w2)];
                    });
                }); }; },
                chain: function (ma, f) { return function () { return M.chain(ma(), function (_a) {
                    var a = _a[0], w1 = _a[1];
                    return M.map(f(a)(), function (_a) {
                        var b = _a[0], w2 = _a[1];
                        return [b, W.concat(w1, w2)];
                    });
                }); }; }
            };
        }
    };
}
