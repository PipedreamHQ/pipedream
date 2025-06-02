"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.altAll = altAll;
exports.getAlternativeMonoid = getAlternativeMonoid;
/**
 * The `Alternative` type class extends the `Alt` type class with a value that should be the left and right identity for `alt`.
 *
 * It is similar to `Monoid`, except that it applies to types of kind `* -> *`, like `Array` or `Option`, rather than
 * concrete types like `string` or `number`.
 *
 * `Alternative` instances should satisfy the following laws:
 *
 * 1. Left identity: `A.alt(zero, fa) <-> fa`
 * 2. Right identity: `A.alt(fa, zero) <-> fa`
 * 3. Annihilation: `A.map(zero, f) <-> zero`
 * 4. Distributivity: `A.ap(A.alt(fab, gab), fa) <-> A.alt(A.ap(fab, fa), A.ap(gab, fa))`
 * 5. Annihilation: `A.ap(zero, fa) <-> zero`
 *
 * @since 2.0.0
 */
var Alt_1 = require("./Alt");
var Apply_1 = require("./Apply");
function altAll(F) {
    return (0, Alt_1.altAll)(F)(F.zero());
}
function getAlternativeMonoid(F) {
    var f = (0, Apply_1.getApplySemigroup)(F);
    return function (S) {
        var SF = f(S);
        return {
            concat: function (first, second) {
                return F.alt(SF.concat(first, second), function () { return F.alt(first, function () { return second; }); });
            },
            empty: F.zero()
        };
    };
}
