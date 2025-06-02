export function altAll(F) {
    return function (startWith) { return function (as) { return as.reduce(function (acc, a) { return F.alt(acc, function () { return a; }); }, startWith); }; };
}
