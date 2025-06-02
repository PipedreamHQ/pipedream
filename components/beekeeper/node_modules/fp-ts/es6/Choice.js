import { identity } from './function';
export function split(P, C) {
    return function (pab, pcd) { return C.compose(P.right(pcd), P.left(pab)); };
}
export function fanIn(P, C) {
    var splitPC = split(P, C);
    return function (pac, pbc) {
        return C.compose(P.promap(C.id(), function (cc) { return (cc._tag === 'Left' ? cc.left : cc.right); }, identity), splitPC(pac, pbc));
    };
}
export function splitChoice(F) {
    return split(F, F);
}
export function fanin(F) {
    return fanIn(F, F);
}
