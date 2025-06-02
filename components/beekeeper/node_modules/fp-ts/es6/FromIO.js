/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */
import { tap } from './Chain';
import { flow } from './function';
export function fromIOK(F) {
    return function (f) { return flow(f, F.fromIO); };
}
export function chainIOK(F, M) {
    return function (f) {
        var g = flow(f, F.fromIO);
        return function (first) { return M.chain(first, g); };
    };
}
export function chainFirstIOK(F, M) {
    var tapIOM = tapIO(F, M);
    return function (f) { return function (first) { return tapIOM(first, f); }; };
}
/** @internal */
export function tapIO(F, M) {
    var chainFirstM = tap(M);
    return function (self, f) { return chainFirstM(self, flow(f, F.fromIO)); };
}
