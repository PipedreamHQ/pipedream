export function guard(F, P) {
    return function (b) { return (b ? P.of(undefined) : F.zero()); };
}
