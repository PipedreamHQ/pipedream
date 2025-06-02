var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { dual } from './function';
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
export var isNone = function (fa) { return fa._tag === 'None'; };
/** @internal */
export var isSome = function (fa) { return fa._tag === 'Some'; };
/** @internal */
export var none = { _tag: 'None' };
/** @internal */
export var some = function (a) { return ({ _tag: 'Some', value: a }); };
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
export var isLeft = function (ma) { return ma._tag === 'Left'; };
/** @internal */
export var isRight = function (ma) { return ma._tag === 'Right'; };
/** @internal */
export var left = function (e) { return ({ _tag: 'Left', left: e }); };
/** @internal */
export var right = function (a) { return ({ _tag: 'Right', right: a }); };
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
export var singleton = function (a) { return [a]; };
/** @internal */
export var isNonEmpty = function (as) { return as.length > 0; };
/** @internal */
export var head = function (as) { return as[0]; };
/** @internal */
export var tail = function (as) { return as.slice(1); };
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
export var emptyReadonlyArray = [];
/** @internal */
export var emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
export var has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
export var fromReadonlyNonEmptyArray = function (as) { return __spreadArray([as[0]], as.slice(1), true); };
/** @internal */
export var liftNullable = function (F) {
    return function (f, onNullable) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither(o == null ? left(onNullable.apply(void 0, a)) : right(o));
        };
    };
};
/** @internal */
export var liftOption = function (F) {
    return function (f, onNone) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither(isNone(o) ? left(onNone.apply(void 0, a)) : right(o.value));
        };
    };
};
/** @internal */
export var flatMapNullable = function (F, M) {
    return /*#__PURE__*/ dual(3, function (self, f, onNullable) {
        return M.flatMap(self, liftNullable(F)(f, onNullable));
    });
};
/** @internal */
export var flatMapOption = function (F, M) {
    return /*#__PURE__*/ dual(3, function (self, f, onNone) { return M.flatMap(self, liftOption(F)(f, onNone)); });
};
/** @internal */
export var flatMapEither = function (F, M) {
    return /*#__PURE__*/ dual(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromEither(f(a)); });
    });
};
/** @internal */
export var flatMapIO = function (F, M) {
    return /*#__PURE__*/ dual(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromIO(f(a)); });
    });
};
/** @internal */
export var flatMapTask = function (F, M) {
    return /*#__PURE__*/ dual(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromTask(f(a)); });
    });
};
/** @internal */
export var flatMapReader = function (F, M) {
    return /*#__PURE__*/ dual(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromReader(f(a)); });
    });
};
