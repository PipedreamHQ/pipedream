/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export var matchW = function (onLessThan, onEqual, onGreaterThan) {
    return function (o) {
        return o === -1 ? onLessThan() : o === 0 ? onEqual() : onGreaterThan();
    };
};
/**
 * @category pattern matching
 * @since 2.10.0
 */
export var match = matchW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export var reverse = function (o) { return (o === -1 ? 1 : o === 1 ? -1 : 0); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
export var Eq = {
    equals: function (x, y) { return x === y; }
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Semigroup = {
    concat: function (x, y) { return (x !== 0 ? x : y); }
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Monoid = {
    concat: Semigroup.concat,
    empty: 0
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export var sign = function (n) { return (n <= -1 ? -1 : n >= 1 ? 1 : 0); };
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
export var invert = reverse;
/**
 * Use [`Semigroup`](#semigroup) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var semigroupOrdering = Semigroup;
/**
 * Use [`Eq`](#eq) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var eqOrdering = Eq;
/**
 * Use [`Monoid`](#monoid) instead
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export var monoidOrdering = Monoid;
