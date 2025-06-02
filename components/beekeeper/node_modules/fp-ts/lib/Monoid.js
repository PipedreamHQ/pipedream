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
exports.monoidProduct = exports.monoidSum = exports.monoidString = exports.getEndomorphismMonoid = exports.getFunctionMonoid = exports.monoidAny = exports.monoidAll = exports.fold = exports.getMeetMonoid = exports.getJoinMonoid = exports.getDualMonoid = exports.getStructMonoid = exports.getTupleMonoid = exports.monoidVoid = exports.concatAll = exports.tuple = exports.struct = exports.reverse = exports.max = exports.min = void 0;
var Endomorphism_1 = require("./Endomorphism");
var function_1 = require("./function");
var _ = __importStar(require("./internal"));
var Se = __importStar(require("./Semigroup"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a monoid where `concat` will return the minimum, based on the provided bounded order.
 *
 * The `empty` value is the `top` value.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as M from 'fp-ts/Monoid'
 *
 * const M1 = M.min(N.Bounded)
 *
 * assert.deepStrictEqual(M1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
var min = function (B) { return ({
    concat: Se.min(B).concat,
    empty: B.top
}); };
exports.min = min;
/**
 * Get a monoid where `concat` will return the maximum, based on the provided bounded order.
 *
 * The `empty` value is the `bottom` value.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as M from 'fp-ts/Monoid'
 *
 * const M1 = M.max(N.Bounded)
 *
 * assert.deepStrictEqual(M1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
var max = function (B) { return ({
    concat: Se.max(B).concat,
    empty: B.bottom
}); };
exports.max = max;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Monoid`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Monoid'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Monoid).concat('a', 'b'), 'ba')
 *
 * @since 2.10.0
 */
var reverse = function (M) { return ({
    concat: Se.reverse(M).concat,
    empty: M.empty
}); };
exports.reverse = reverse;
/**
 * Given a struct of monoids returns a monoid for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const M = struct<Point>({
 *   x: N.MonoidSum,
 *   y: N.MonoidSum
 * })
 *
 * assert.deepStrictEqual(M.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @since 2.10.0
 */
var struct = function (monoids) {
    var empty = {};
    for (var k in monoids) {
        if (_.has.call(monoids, k)) {
            empty[k] = monoids[k].empty;
        }
    }
    return {
        concat: Se.struct(monoids).concat,
        empty: empty
    };
};
exports.struct = struct;
/**
 * Given a tuple of monoids returns a monoid for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Monoid'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const M1 = tuple(S.Monoid, N.MonoidSum)
 * assert.deepStrictEqual(M1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const M2 = tuple(S.Monoid, N.MonoidSum, B.MonoidAll)
 * assert.deepStrictEqual(M2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @since 2.10.0
 */
var tuple = function () {
    var monoids = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        monoids[_i] = arguments[_i];
    }
    return ({
        concat: Se.tuple.apply(Se, monoids).concat,
        empty: monoids.map(function (m) { return m.empty; })
    });
};
exports.tuple = tuple;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the monoid `empty` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(concatAll(N.MonoidSum)([1, 2, 3]), 6)
 * assert.deepStrictEqual(concatAll(N.MonoidSum)([]), 0)
 *
 * @since 2.10.0
 */
var concatAll = function (M) { return Se.concatAll(M)(M.empty); };
exports.concatAll = concatAll;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Monoid`](./void.ts.html#monoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.monoidVoid = {
    concat: Se.semigroupVoid.concat,
    empty: undefined
};
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleMonoid = exports.tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getStructMonoid = exports.struct;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getDualMonoid = exports.reverse;
/**
 * Use [`max`](#max) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getJoinMonoid = exports.max;
/**
 * Use [`min`](#min) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getMeetMonoid = exports.min;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.fold = exports.concatAll;
/**
 * Use [`MonoidAll`](./boolean.ts.html#monoidall) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.monoidAll = {
    concat: Se.semigroupAll.concat,
    empty: true
};
/**
 * Use [`MonoidAny`](./boolean.ts.html#monoidany) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.monoidAny = {
    concat: Se.semigroupAny.concat,
    empty: false
};
/**
 * Use [`getMonoid`](./function.ts.html#getmonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getFunctionMonoid = function_1.getMonoid;
/**
 * Use [`getEndomorphismMonoid`](./function.ts.html#getendomorphismmonoid) instead.
 *
 * **Note**. The execution order in [`getEndomorphismMonoid`](./function.ts.html#getendomorphismmonoid) is reversed.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getEndomorphismMonoid = function () { return (0, exports.reverse)((0, Endomorphism_1.getMonoid)()); };
exports.getEndomorphismMonoid = getEndomorphismMonoid;
/**
 * Use [`Monoid`](./string.ts.html#monoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.monoidString = {
    concat: Se.semigroupString.concat,
    empty: ''
};
/**
 * Use [`MonoidSum`](./number.ts.html#monoidsum) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.monoidSum = {
    concat: Se.semigroupSum.concat,
    empty: 0
};
/**
 * Use [`MonoidProduct`](./number.ts.html#monoidproduct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.monoidProduct = {
    concat: Se.semigroupProduct.concat,
    empty: 1
};
