/**
 * @since 2.2.0
 */
import * as BA from './BooleanAlgebra'
import * as E from './Eq'
import { LazyArg } from './function'
import { Monoid } from './Monoid'
import * as O from './Ord'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import * as S from './Show'
/**
 * @category refinements
 * @since 2.11.0
 */
export declare const isBoolean: Refinement<unknown, boolean>
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const matchW: <A, B>(onFalse: LazyArg<A>, onTrue: LazyArg<B>) => (value: boolean) => A | B
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const foldW: <A, B>(onFalse: LazyArg<A>, onTrue: LazyArg<B>) => (value: boolean) => A | B
/**
 * Defines the fold over a boolean value.
 * Takes two thunks `onTrue`, `onFalse` and a `boolean` value.
 * If `value` is false, `onFalse()` is returned, otherwise `onTrue()`.
 *
 * @example
 * import { some, map } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 * import { match } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(
 *  pipe(
 *    some(true),
 *    map(match(() => 'false', () => 'true'))
 *  ),
 *  some('true')
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
export declare const match: <A>(onFalse: LazyArg<A>, onTrue: LazyArg<A>) => (value: boolean) => A
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.2.0
 */
export declare const fold: <A>(onFalse: LazyArg<A>, onTrue: LazyArg<A>) => (value: boolean) => A
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Eq: E.Eq<boolean>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const BooleanAlgebra: BA.BooleanAlgebra<boolean>
/**
 * `boolean` semigroup under conjunction.
 *
 * @example
 * import { SemigroupAll } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(SemigroupAll.concat(true, true), true)
 * assert.deepStrictEqual(SemigroupAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const SemigroupAll: Semigroup<boolean>
/**
 * `boolean` semigroup under disjunction.
 *
 * @example
 * import { SemigroupAny } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(SemigroupAny.concat(true, true), true)
 * assert.deepStrictEqual(SemigroupAny.concat(true, false), true)
 * assert.deepStrictEqual(SemigroupAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const SemigroupAny: Semigroup<boolean>
/**
 * `boolean` monoid under conjunction.
 *
 * The `empty` value is `true`.
 *
 * @example
 * import { MonoidAll } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(MonoidAll.concat(true, true), true)
 * assert.deepStrictEqual(MonoidAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const MonoidAll: Monoid<boolean>
/**
 * `boolean` monoid under disjunction.
 *
 * The `empty` value is `false`.
 *
 * @example
 * import { MonoidAny } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(MonoidAny.concat(true, true), true)
 * assert.deepStrictEqual(MonoidAny.concat(true, false), true)
 * assert.deepStrictEqual(MonoidAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const MonoidAny: Monoid<boolean>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Ord: O.Ord<boolean>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Show: S.Show<boolean>
