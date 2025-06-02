/**
 * @since 2.0.0
 */
export var log = function (a) {
    return function () {
        return console.log(a);
    };
};
/**
 * @since 2.0.0
 */
export var warn = function (a) {
    return function () {
        return console.warn(a);
    };
};
/**
 * @since 2.0.0
 */
export var error = function (a) {
    return function () {
        return console.error(a);
    };
};
/**
 * @since 2.0.0
 */
export var info = function (a) {
    return function () {
        return console.info(a);
    };
};
