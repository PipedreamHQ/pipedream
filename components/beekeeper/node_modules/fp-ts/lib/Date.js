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
exports.now = exports.create = exports.Ord = exports.eqYear = exports.eqMonth = exports.eqDate = exports.Eq = void 0;
var function_1 = require("./function");
var N = __importStar(require("./number"));
var O = __importStar(require("./Ord"));
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
exports.Eq = {
    equals: function (first, second) { return first.valueOf() === second.valueOf(); }
};
/**
 * @category instances
 * @since 2.6.0
 */
exports.eqDate = {
    equals: function (x, y) { return x.getDate() === y.getDate(); }
};
/**
 * @category instances
 * @since 2.6.0
 */
exports.eqMonth = {
    equals: function (x, y) { return x.getMonth() === y.getMonth(); }
};
/**
 * @category instances
 * @since 2.6.0
 */
exports.eqYear = {
    equals: function (x, y) { return x.getFullYear() === y.getFullYear(); }
};
/**
 * @example
 * import { Ord } from 'fp-ts/Date'
 *
 * assert.deepStrictEqual(Ord.compare(new Date(1, 1, 2020), new Date(1, 1, 2021)), -1)
 *
 * @category instances
 * @since 2.10.0
 */
exports.Ord = (0, function_1.pipe)(N.Ord, 
/*#__PURE__*/ O.contramap(function (date) { return date.valueOf(); }));
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Returns the current `Date`
 *
 * @category constructors
 * @since 2.0.0
 */
var create = function () { return new Date(); };
exports.create = create;
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 *
 * @since 2.0.0
 */
var now = function () { return new Date().getTime(); };
exports.now = now;
