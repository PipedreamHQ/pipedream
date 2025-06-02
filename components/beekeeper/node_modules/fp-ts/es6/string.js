import { isNonEmpty } from './ReadonlyNonEmptyArray';
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
export var Eq = {
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
export var Semigroup = {
    concat: function (first, second) { return first + second; }
};
/**
 * An empty `string`.
 *
 * @since 2.10.0
 */
export var empty = '';
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
export var Monoid = {
    concat: Semigroup.concat,
    empty: empty
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
export var Ord = {
    equals: Eq.equals,
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
export var Show = {
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
export var isString = function (u) { return typeof u === 'string'; };
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
export var toUpperCase = function (s) { return s.toUpperCase(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
 *
 * @since 2.11.0
 */
export var toLowerCase = function (s) { return s.toLowerCase(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
 *
 * @since 2.11.0
 */
export var replace = function (searchValue, replaceValue) {
    return function (s) {
        return s.replace(searchValue, replaceValue);
    };
};
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trim), 'a')
 *
 * @since 2.11.0
 */
export var trim = function (s) { return s.trim(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimLeft), 'a ')
 *
 * @since 2.11.0
 */
export var trimLeft = function (s) { return s.trimLeft(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimRight), ' a')
 *
 * @since 2.11.0
 */
export var trimRight = function (s) { return s.trimRight(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
 *
 * @since 2.11.0
 */
export var slice = function (start, end) {
    return function (s) {
        return s.slice(start, end);
    };
};
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
export var isEmpty = function (s) { return s.length === 0; };
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
export var size = function (s) { return s.length; };
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
export var split = function (separator) {
    return function (s) {
        var out = s.split(separator);
        return isNonEmpty(out) ? out : [s];
    };
};
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
export var includes = function (searchString, position) {
    return function (s) {
        return s.includes(searchString, position);
    };
};
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
export var startsWith = function (searchString, position) {
    return function (s) {
        return s.startsWith(searchString, position);
    };
};
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
export var endsWith = function (searchString, position) {
    return function (s) {
        return s.endsWith(searchString, position);
    };
};
