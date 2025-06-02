import { flow } from './function';
import * as S from './State';
export function get(F) {
    return function () { return F.fromState(S.get()); };
}
export function put(F) {
    return function (s) { return F.fromState(S.put(s)); };
}
export function modify(F) {
    return flow(S.modify, F.fromState);
}
export function gets(F) {
    return flow(S.gets, F.fromState);
}
export function fromStateK(F) {
    return function (f) { return flow(f, F.fromState); };
}
export function chainStateK(F, M) {
    var fromStateKF = fromStateK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromStateKF(f)); }; };
}
