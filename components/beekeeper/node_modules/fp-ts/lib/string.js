"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endsWith = exports.startsWith = exports.includes = exports.split = exports.size = exports.isEmpty = exports.slice = exports.trimRight = exports.trimLeft = exports.trim = exports.replace = exports.toLowerCase = exports.toUpperCase = exports.isString = exports.Show = exports.Ord = exports.Monoid = exports.empty = exports.Semigroup = exports.Eq = void 0;
var ReadonlyNonEmptyArray_1 = require("./ReadonlyNonEmptyArray");
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Eq.equals('a', 'a'), true)
 * assert.deepStrictEqual(S.Eq.equals('a', 'b'), false)
 *
 * @category instances
 * @since 2.10.0
 */
exports.Eq = {
    equals: function (first, second) { return first === second; }
};
/**
 * `string` semigroup under concatenation.
 *
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Semigroup.concat('a', 'b'), 'ab')
 *
 * @category instances
 * @since 2.10.0
 */
exports.Semigroup = {
    concat: function (first, second) { return first + second; }
};
/**
 * An empty `string`.
 *
 * @since 2.10.0
 */
exports.empty = '';
/**
 * `string` monoid under concatenation.
 *
 * The `empty` value is `''`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Monoid.concat('a', 'b'), 'ab')
 * assert.deepStrictEqual(S.Monoid.concat('a', S.Monoid.empty), 'a')
 *
 * @category instances
 * @since 2.10.0
 */
exports.Monoid = {
    concat: exports.Semigroup.concat,
    empty: exports.empty
};
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Ord.compare('a', 'a'), 0)
 * assert.deepStrictEqual(S.Ord.compare('a', 'b'), -1)
 * assert.deepStrictEqual(S.Ord.compare('b', 'a'), 1)
 *
 * @category instances
 * @since 2.10.0
 */
exports.Ord = {
    equals: exports.Eq.equals,
    compare: function (first, second) { return (first < second ? -1 : first > second ? 1 : 0); }
};
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Show.show('a'), '"a"')
 *
 * @category instances
 * @since 2.10.0
 */
exports.Show = {
    show: function (s) { return JSON.stringify(s); }
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.isString('a'), true)
 * assert.deepStrictEqual(S.isString(1), false)
 *
 * @category refinements
 * @since 2.11.0
 */
var isString = function (u) { return typeof u === 'string'; };
exports.isString = isString;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
 *
 * @since 2.11.0
 */
var toUpperCase = function (s) { return s.toUpperCase(); };
exports.toUpperCase = toUpperCase;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
 *
 * @since 2.11.0
 */
var toLowerCase = function (s) { return s.toLowerCase(); };
exports.toLowerCase = toLowerCase;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
 *
 * @since 2.11.0
 */
var replace = function (searchValue, replaceValue) {
    return function (s) {
        return s.replace(searchValue, replaceValue);
    };
};
exports.replace = replace;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trim), 'a')
 *
 * @since 2.11.0
 */
var trim = function (s) { return s.trim(); };
exports.trim = trim;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimLeft), 'a ')
 *
 * @since 2.11.0
 */
var trimLeft = function (s) { return s.trimLeft(); };
exports.trimLeft = trimLeft;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimRight), ' a')
 *
 * @since 2.11.0
 */
var trimRight = function (s) { return s.trimRight(); };
exports.trimRight = trimRight;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
 *
 * @since 2.11.0
 */
var slice = function (start, end) {
    return function (s) {
        return s.slice(start, end);
    };
};
exports.slice = slice;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Test whether a `string` is empty.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('', S.isEmpty), true)
 * assert.deepStrictEqual(pipe('a', S.isEmpty), false)
 *
 * @since 2.10.0
 */
var isEmpty = function (s) { return s.length === 0; };
exports.isEmpty = isEmpty;
/**
 * Calculate the number of characters in a `string`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.size), 3)
 *
 * @since 2.10.0
 */
var size = function (s) { return s.length; };
exports.size = size;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
 * assert.deepStrictEqual(pipe('', S.split('')), [''])
 *
 * @since 2.11.0
 */
var split = function (separator) {
    return function (s) {
        var out = s.split(separator);
        return (0, ReadonlyNonEmptyArray_1.isNonEmpty)(out) ? out : [s];
    };
};
exports.split = split;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.includes('b')), true)
 * assert.deepStrictEqual(pipe('abc', S.includes('d')), false)
 *
 * @since 2.11.0
 */
var includes = function (searchString, position) {
    return function (s) {
        return s.includes(searchString, position);
    };
};
exports.includes = includes;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.startsWith('a')), true)
 * assert.deepStrictEqual(pipe('bc', S.startsWith('a')), false)
 *
 * @since 2.11.0
 */
var startsWith = function (searchString, position) {
    return function (s) {
        return s.startsWith(searchString, position);
    };
};
exports.startsWith = startsWith;
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.endsWith('c')), true)
 * assert.deepStrictEqual(pipe('ab', S.endsWith('c')), false)
 *
 * @since 2.11.0
 */
var endsWith = function (searchString, position) {
    return function (s) {
        return s.endsWith(searchString, position);
    };
};
exports.endsWith = endsWith;
