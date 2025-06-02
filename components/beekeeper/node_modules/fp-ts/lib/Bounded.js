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
exports.boundedNumber = exports.reverse = exports.clamp = void 0;
/**
 * The `Bounded` type class represents totally ordered types that have an upper and lower boundary.
 *
 * Instances should satisfy the following law in addition to the `Ord` laws:
 *
 * - Bounded: `bottom <= a <= top`
 *
 * @since 2.0.0
 */
var O = __importStar(require("./Ord"));
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Clamp a value between bottom and top values.
 *
 * @category utils
 * @since 2.12.0
 */
var clamp = function (B) { return O.clamp(B)(B.bottom, B.top); };
exports.clamp = clamp;
/**
 * Reverses the Ord of a bound and swaps top and bottom values.
 *
 * @category utils
 * @since 2.12.0
 */
var reverse = function (B) {
    var R = O.reverse(B);
    return {
        equals: R.equals,
        compare: R.compare,
        top: B.bottom,
        bottom: B.top
    };
};
exports.reverse = reverse;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Bounded`](./number.ts.html#bounded) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.boundedNumber = {
    equals: O.ordNumber.equals,
    compare: O.ordNumber.compare,
    top: Infinity,
    bottom: -Infinity
};
