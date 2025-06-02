"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = void 0;
exports.reduce = reduce;
exports.foldMap = foldMap;
exports.reduceRight = reduceRight;
exports.reduceM = reduceM;
exports.intercalate = intercalate;
exports.toReadonlyArray = toReadonlyArray;
exports.traverse_ = traverse_;
exports.foldM = foldM;
exports.getFoldableComposition = getFoldableComposition;
var function_1 = require("./function");
function reduce(F, G) {
    return function (b, f) { return function (fga) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); }; };
}
function foldMap(F, G) {
    return function (M) {
        var foldMapF = F.foldMap(M);
        var foldMapG = G.foldMap(M);
        return function (f) { return function (fga) { return foldMapF(fga, function (ga) { return foldMapG(ga, f); }); }; };
    };
}
function reduceRight(F, G) {
    return function (b, f) { return function (fga) { return F.reduceRight(fga, b, function (ga, b) { return G.reduceRight(ga, b, f); }); }; };
}
function reduceM(M, F) {
    return function (b, f) { return function (fa) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); }; };
}
function intercalate(M, F) {
    return function (middle, fm) {
        var go = function (_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, middle), x) };
        };
        return F.reduce(fm, { init: true, acc: M.empty }, go).acc;
    };
}
function toReadonlyArray(F) {
    return function (fa) {
        return F.reduce(fa, [], function (acc, a) {
            acc.push(a);
            return acc;
        });
    };
}
function traverse_(M, F) {
    var applyFirst = function (mu, mb) { return M.ap(M.map(mu, function_1.constant), mb); };
    var mu = M.of(undefined);
    return function (fa, f) { return F.reduce(fa, mu, function (mu, a) { return applyFirst(mu, f(a)); }); };
}
function foldM(M, F) {
    return function (fa, b, f) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
/**
 * Use [`toReadonlyArray`](#toreadonlyarray) instead
 *
 * @category zone of death
 * @since 2.8.0
 * @deprecated
 */
exports.toArray = toReadonlyArray;
/** @deprecated */
function getFoldableComposition(F, G) {
    var _reduce = reduce(F, G);
    var _foldMap = foldMap(F, G);
    var _reduceRight = reduceRight(F, G);
    return {
        reduce: function (fga, b, f) { return (0, function_1.pipe)(fga, _reduce(b, f)); },
        foldMap: function (M) {
            var foldMapM = _foldMap(M);
            return function (fga, f) { return (0, function_1.pipe)(fga, foldMapM(f)); };
        },
        reduceRight: function (fga, b, f) { return (0, function_1.pipe)(fga, _reduceRight(b, f)); }
    };
}
