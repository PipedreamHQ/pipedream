/**
 * @since 1.0.0
 */
import { fold } from 'fp-ts/es6/Either';
import { getFunctionName } from '.';
function stringify(v) {
    if (typeof v === 'function') {
        return getFunctionName(v);
    }
    if (typeof v === 'number' && !isFinite(v)) {
        if (isNaN(v)) {
            return 'NaN';
        }
        return v > 0 ? 'Infinity' : '-Infinity';
    }
    return JSON.stringify(v);
}
function getContextPath(context) {
    return context.map(function (_a) {
        var key = _a.key, type = _a.type;
        return "".concat(key, ": ").concat(type.name);
    }).join('/');
}
function getMessage(e) {
    return e.message !== undefined
        ? e.message
        : "Invalid value ".concat(stringify(e.value), " supplied to ").concat(getContextPath(e.context));
}
/**
 * @since 1.0.0
 */
export function failure(es) {
    return es.map(getMessage);
}
/**
 * @since 1.0.0
 */
export function success() {
    return ['No errors!'];
}
/**
 * @since 1.0.0
 */
export var PathReporter = {
    report: fold(failure, success)
};
