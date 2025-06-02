"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = guard;
function guard(F, P) {
    return function (b) { return (b ? P.of(undefined) : F.zero()); };
}
