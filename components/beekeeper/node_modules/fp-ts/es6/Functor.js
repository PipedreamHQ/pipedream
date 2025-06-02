/**
 * A `Functor` is a type constructor which supports a mapping operation `map`.
 *
 * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.map(fa, a => a) <-> fa`
 * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
 *
 * @since 2.0.0
 */
import { pipe } from './function';
export function map(F, G) {
    return function (f) { return function (fa) { return F.map(fa, function (ga) { return G.map(ga, f); }); }; };
}
export function flap(F) {
    return function (a) { return function (fab) { return F.map(fab, function (f) { return f(a); }); }; };
}
export function bindTo(F) {
    return function (name) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return (_a = {}, _a[name] = a, _a);
    }); }; };
}
function let_(F) {
    return function (name, f) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = f(a), _a));
    }); }; };
}
export { 
/**
 * @since 2.13.0
 */
let_ as let };
/** @deprecated */
export function getFunctorComposition(F, G) {
    var _map = map(F, G);
    return {
        map: function (fga, f) { return pipe(fga, _map(f)); }
    };
}
/** @internal */
export function as(F) {
    return function (self, b) { return F.map(self, function () { return b; }); };
}
/** @internal */
export function asUnit(F) {
    var asM = as(F);
    return function (self) { return asM(self, undefined); };
}
