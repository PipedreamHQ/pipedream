/**
 * @since 2.0.0
 */
import * as E from './Eq'
import * as M from './Monoid'
import * as S from './Semigroup'
/**
 * @category model
 * @since 2.0.0
 */
export type Ordering = -1 | 0 | 1
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export declare const matchW: <A, B, C>(
  onLessThan: () => A,
  onEqual: () => B,
  onGreaterThan: () => C
) => (o: Ordering) => A | B | C
/**
 * @category pattern matching
 * @since 2.10.0
 */
export declare const match: <A>(onLessThan: () => A, onEqual: () => A, onGreaterThan: () => A) => (o: Ordering) => A
/**
 * @since 2.10.0
 */
export declare const reverse: (o: Ordering) => Ordering
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Eq: E.Eq<Ordering>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Semigroup: S.Semigroup<Ordering>
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Monoid: M.Monoid<Ordering>
/**
 * @since 2.0.0
 */
export declare const sign: (n: number) => Ordering
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const invert: (o: Ordering) => Ordering
/**
 * Use [`Semigroup`](#semigroup) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const semigroupOrdering: S.Semigroup<Ordering>
/**
 * Use [`Eq`](#eq) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const eqOrdering: E.Eq<Ordering>
/**
 * Use [`Monoid`](#monoid) instead
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export declare const monoidOrdering: M.Monoid<Ordering>
