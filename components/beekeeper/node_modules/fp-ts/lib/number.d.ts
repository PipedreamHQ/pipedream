/**
 * @since 2.10.0
 */
import * as B from './Bounded'
import * as E from './Eq'
import * as F from './Field'
import { Magma } from './Magma'
import { Monoid } from './Monoid'
import * as O from './Ord'
import { Refinement } from './Refinement'
import { Semigroup } from './Semigroup'
import * as S from './Show'
/**
 * @category refinements
 * @since 2.11.0
 */
export declare const isNumber: Refinement<unknown, number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Eq: E.Eq<number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Ord: O.Ord<number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Bounded: B.Bounded<number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Show: S.Show<number>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const MagmaSub: Magma<number>
/**
 * `number` semigroup under addition.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupSum.concat(2, 3), 5)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const SemigroupSum: Semigroup<number>
/**
 * `number` semigroup under multiplication.
 *
 * @example
 * import { SemigroupProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupProduct.concat(2, 3), 6)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const SemigroupProduct: Semigroup<number>
/**
 * `number` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @example
 * import { MonoidSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidSum.concat(2, MonoidSum.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const MonoidSum: Monoid<number>
/**
 * `number` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @example
 * import { MonoidProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidProduct.concat(2, MonoidProduct.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const MonoidProduct: Monoid<number>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Field: F.Field<number>
