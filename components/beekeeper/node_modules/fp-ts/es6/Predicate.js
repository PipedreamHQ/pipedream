import { constFalse, constTrue, flow, pipe } from './function';
var contramap_ = function (predicate, f) { return pipe(predicate, contramap(f)); };
/**
 * @since 2.11.0
 */
export var contramap = function (f) {
    return function (predicate) {
        return flow(f, predicate);
    };
};
/**
 * @category type lambdas
 * @since 2.11.0
 */
export var URI = 'Predicate';
/**
 * @category instances
 * @since 2.11.0
 */
export var getSemigroupAny = function () { return ({
    concat: function (first, second) { return pipe(first, or(second)); }
}); };
/**
 * @category instances
 * @since 2.11.0
 */
export var getMonoidAny = function () { return ({
    concat: getSemigroupAny().concat,
    empty: constFalse
}); };
/**
 * @category instances
 * @since 2.11.0
 */
export var getSemigroupAll = function () { return ({
    concat: function (first, second) { return pipe(first, and(second)); }
}); };
/**
 * @category instances
 * @since 2.11.0
 */
export var getMonoidAll = function () { return ({
    concat: getSemigroupAll().concat,
    empty: constTrue
}); };
/**
 * @category instances
 * @since 2.11.0
 */
export var Contravariant = {
    URI: URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export var not = function (predicate) {
    return function (a) {
        return !predicate(a);
    };
};
/**
 * @since 2.11.0
 */
export var or = function (second) {
    return function (first) {
        return function (a) {
            return first(a) || second(a);
        };
    };
};
/**
 * @since 2.11.0
 */
export var and = function (second) {
    return function (first) {
        return function (a) {
            return first(a) && second(a);
        };
    };
};
