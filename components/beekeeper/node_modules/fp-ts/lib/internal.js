"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMapReader = exports.flatMapTask = exports.flatMapIO = exports.flatMapEither = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.fromReadonlyNonEmptyArray = exports.has = exports.emptyRecord = exports.emptyReadonlyArray = exports.tail = exports.head = exports.isNonEmpty = exports.singleton = exports.right = exports.left = exports.isRight = exports.isLeft = exports.some = exports.none = exports.isSome = exports.isNone = void 0;
var function_1 = require("./function");
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
var isNone = function (fa) { return fa._tag === 'None'; };
exports.isNone = isNone;
/** @internal */
var isSome = function (fa) { return fa._tag === 'Some'; };
exports.isSome = isSome;
/** @internal */
exports.none = { _tag: 'None' };
/** @internal */
var some = function (a) { return ({ _tag: 'Some', value: a }); };
exports.some = some;
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
var isLeft = function (ma) { return ma._tag === 'Left'; };
exports.isLeft = isLeft;
/** @internal */
var isRight = function (ma) { return ma._tag === 'Right'; };
exports.isRight = isRight;
/** @internal */
var left = function (e) { return ({ _tag: 'Left', left: e }); };
exports.left = left;
/** @internal */
var right = function (a) { return ({ _tag: 'Right', right: a }); };
exports.right = right;
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var singleton = function (a) { return [a]; };
exports.singleton = singleton;
/** @internal */
var isNonEmpty = function (as) { return as.length > 0; };
exports.isNonEmpty = isNonEmpty;
/** @internal */
var head = function (as) { return as[0]; };
exports.head = head;
/** @internal */
var tail = function (as) { return as.slice(1); };
exports.tail = tail;
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
exports.emptyReadonlyArray = [];
/** @internal */
exports.emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
exports.has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var fromReadonlyNonEmptyArray = function (as) { return __spreadArray([as[0]], as.slice(1), true); };
exports.fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray;
/** @internal */
var liftNullable = function (F) {
    return function (f, onNullable) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither(o == null ? (0, exports.left)(onNullable.apply(void 0, a)) : (0, exports.right)(o));
        };
    };
};
exports.liftNullable = liftNullable;
/** @internal */
var liftOption = function (F) {
    return function (f, onNone) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither((0, exports.isNone)(o) ? (0, exports.left)(onNone.apply(void 0, a)) : (0, exports.right)(o.value));
        };
    };
};
exports.liftOption = liftOption;
/** @internal */
var flatMapNullable = function (F, M) {
    return /*#__PURE__*/ (0, function_1.dual)(3, function (self, f, onNullable) {
        return M.flatMap(self, (0, exports.liftNullable)(F)(f, onNullable));
    });
};
exports.flatMapNullable = flatMapNullable;
/** @internal */
var flatMapOption = function (F, M) {
    return /*#__PURE__*/ (0, function_1.dual)(3, function (self, f, onNone) { return M.flatMap(self, (0, exports.liftOption)(F)(f, onNone)); });
};
exports.flatMapOption = flatMapOption;
/** @internal */
var flatMapEither = function (F, M) {
    return /*#__PURE__*/ (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromEither(f(a)); });
    });
};
exports.flatMapEither = flatMapEither;
/** @internal */
var flatMapIO = function (F, M) {
    return /*#__PURE__*/ (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromIO(f(a)); });
    });
};
exports.flatMapIO = flatMapIO;
/** @internal */
var flatMapTask = function (F, M) {
    return /*#__PURE__*/ (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromTask(f(a)); });
    });
};
exports.flatMapTask = flatMapTask;
/** @internal */
var flatMapReader = function (F, M) {
    return /*#__PURE__*/ (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromReader(f(a)); });
    });
};
exports.flatMapReader = flatMapReader;
