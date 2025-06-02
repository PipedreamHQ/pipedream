import { identity } from './function';
export function split(S, C) {
    return function (pab, pcd) {
        return C.compose(S.second(pcd), S.first(pab));
    };
}
export function fanOut(S, C) {
    var splitSC = split(S, C);
    return function (pab, pac) {
        return C.compose(splitSC(pab, pac), S.promap(C.id(), identity, function (a) { return [a, a]; }));
    };
}
export function splitStrong(F) {
    return split(F, F);
}
export function fanout(F) {
    return fanOut(F, F);
}
