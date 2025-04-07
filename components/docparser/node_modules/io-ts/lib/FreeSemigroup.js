"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemigroup = exports.fold = exports.concat = exports.of = void 0;
/**
 * @category constructors
 * @since 2.2.7
 */
var of = function (a) { return ({ _tag: 'Of', value: a }); };
exports.of = of;
/**
 * @category constructors
 * @since 2.2.7
 */
var concat = function (left, right) { return ({
    _tag: 'Concat',
    left: left,
    right: right
}); };
exports.concat = concat;
/**
 * @category destructors
 * @since 2.2.7
 */
var fold = function (onOf, onConcat) {
    return function (f) {
        switch (f._tag) {
            case 'Of':
                return onOf(f.value);
            case 'Concat':
                return onConcat(f.left, f.right);
        }
    };
};
exports.fold = fold;
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return { concat: exports.concat };
}
exports.getSemigroup = getSemigroup;
