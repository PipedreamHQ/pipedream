/**
 * Boolean algebras are Heyting algebras with the additional constraint that the law of the excluded middle is true
 * (equivalently, double-negation is true).
 *
 * Instances should satisfy the following laws in addition to the `HeytingAlgebra` laws:
 *
 * - Excluded middle: `a ∨ ¬a <-> 1`
 *
 * Boolean algebras generalize classical logic: one is equivalent to "true" and zero is equivalent to "false".
 *
 * @since 2.0.0
 */
import { getBooleanAlgebra } from './function';
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Every boolean algebras has a dual algebra, which involves reversing one/zero as well as join/meet.
 *
 * @since 2.10.0
 */
export var reverse = function (B) { return ({
    meet: function (x, y) { return B.join(x, y); },
    join: function (x, y) { return B.meet(x, y); },
    zero: B.one,
    one: B.zero,
    implies: function (x, y) { return B.join(B.not(x), y); },
    not: B.not
}); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var booleanAlgebraVoid = {
    meet: function () { return undefined; },
    join: function () { return undefined; },
    zero: undefined,
    one: undefined,
    implies: function () { return undefined; },
    not: function () { return undefined; }
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var getDualBooleanAlgebra = reverse;
/**
 * Use [`BooleanAlgebra`](./boolean.ts.html#booleanalgebra) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var booleanAlgebraBoolean = {
    meet: function (x, y) { return x && y; },
    join: function (x, y) { return x || y; },
    zero: false,
    one: true,
    implies: function (x, y) { return !x || y; },
    not: function (x) { return !x; }
};
/**
 * Use [`getBooleanAlgebra`](./function.ts.html#getbooleanalgebra) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var getFunctionBooleanAlgebra = getBooleanAlgebra;
