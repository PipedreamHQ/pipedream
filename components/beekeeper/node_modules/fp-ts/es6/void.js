import * as Se from './Semigroup';
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.11.0
 */
export var Semigroup = Se.constant(undefined);
/**
 * @category instances
 * @since 2.11.0
 */
export var Monoid = {
    concat: Semigroup.concat,
    empty: undefined
};
