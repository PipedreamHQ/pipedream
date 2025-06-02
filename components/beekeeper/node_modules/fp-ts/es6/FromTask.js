/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.10.0
 */
import { tap } from './Chain';
import { flow } from './function';
export function fromTaskK(F) {
    return function (f) { return flow(f, F.fromTask); };
}
export function chainTaskK(F, M) {
    return function (f) {
        var g = flow(f, F.fromTask);
        return function (first) { return M.chain(first, g); };
    };
}
export function chainFirstTaskK(F, M) {
    var tapTaskM = tapTask(F, M);
    return function (f) { return function (first) { return tapTaskM(first, f); }; };
}
/** @internal */
export function tapTask(F, M) {
    var tapM = tap(M);
    return function (self, f) { return tapM(self, flow(f, F.fromTask)); };
}
