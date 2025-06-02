"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showNumber = exports.showString = exports.showBoolean = exports.getStructShow = exports.getTupleShow = exports.tuple = exports.struct = void 0;
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
var _ = __importStar(require("./internal"));
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var struct = function (shows) { return ({
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
exports.struct = struct;
/**
 * @since 2.10.0
 */
var tuple = function () {
    var shows = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        shows[_i] = arguments[_i];
    }
    return ({
        show: function (t) { return "[".concat(t.map(function (a, i) { return shows[i].show(a); }).join(', '), "]"); }
    });
};
exports.tuple = tuple;
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
exports.getTupleShow = exports.tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getStructShow = exports.struct;
/**
 * Use [`Show`](./boolean.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.showBoolean = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * Use [`Show`](./string.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.showString = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * Use [`Show`](./number.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.showNumber = {
    show: function (a) { return JSON.stringify(a); }
};
