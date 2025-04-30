/**
 * @category constructors
 * @since 2.2.7
 */
export var of = function (a) { return ({ _tag: 'Of', value: a }); };
/**
 * @category constructors
 * @since 2.2.7
 */
export var concat = function (left, right) { return ({
    _tag: 'Concat',
    left: left,
    right: right
}); };
/**
 * @category destructors
 * @since 2.2.7
 */
export var fold = function (onOf, onConcat) {
    return function (f) {
        switch (f._tag) {
            case 'Of':
                return onOf(f.value);
            case 'Concat':
                return onConcat(f.left, f.right);
        }
    };
};
/**
 * @category instances
 * @since 2.2.7
 */
export function getSemigroup() {
    return { concat: concat };
}
