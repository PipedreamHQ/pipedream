/**
 * Lift a computation from the `Reader` monad.
 *
 * @since 2.11.0
 */
import { tap } from './Chain';
import { flow } from './function';
import * as R from './Reader';
export function ask(F) {
    return function () { return F.fromReader(R.ask()); };
}
export function asks(F) {
    return F.fromReader;
}
export function fromReaderK(F) {
    return function (f) { return flow(f, F.fromReader); };
}
export function chainReaderK(F, M) {
    var fromReaderKF = fromReaderK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromReaderKF(f)); }; };
}
export function chainFirstReaderK(F, M) {
    var tapM = tapReader(F, M);
    return function (f) { return function (self) { return tapM(self, f); }; };
}
/** @internal */
export function tapReader(F, M) {
    var tapM = tap(M);
    return function (self, f) { return tapM(self, flow(f, F.fromReader)); };
}
