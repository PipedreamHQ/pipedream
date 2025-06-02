/**
 * The `Show` type class represents those types which can be converted into
 * a human-readable `string` representation.
 *
 * While not required, it is recommended that for any expression `x`, the
 * string `show(x)` be executable TypeScript code which evaluates to the same
 * value as the expression `x`.
 *
 * @since 2.0.0
 */
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export var struct = function (shows) { return ({
    show: function (a) {
        var s = '{';
        for (var k in shows) {
            if (_.has.call(shows, k)) {
                s += " ".concat(k, ": ").concat(shows[k].show(a[k]), ",");
            }
        }
        if (s.length > 1) {
            s = s.slice(0, -1) + ' ';
        }
        s += '}';
        return s;
    }
}); };
/**
 * @since 2.10.0
 */
export var tuple = function () {
    var shows = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        shows[_i] = arguments[_i];
    }
    return ({
        show: function (t) { return "[".concat(t.map(function (a, i) { return shows[i].show(a); }).join(', '), "]"); }
    });
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var getTupleShow = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var getStructShow = struct;
/**
 * Use [`Show`](./boolean.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var showBoolean = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * Use [`Show`](./string.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var showString = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * Use [`Show`](./number.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var showNumber = {
    show: function (a) { return JSON.stringify(a); }
};
