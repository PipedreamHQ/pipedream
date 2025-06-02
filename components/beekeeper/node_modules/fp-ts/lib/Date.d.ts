/**
 * @since 2.0.0
 */
import * as E from './Eq'
import { IO } from './IO'
import * as O from './Ord'
/**
 * @category instances
 * @since 2.10.0
 */
export declare const Eq: E.Eq<Date>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const eqDate: E.Eq<Date>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const eqMonth: E.Eq<Date>
/**
 * @category instances
 * @since 2.6.0
 */
export declare const eqYear: E.Eq<Date>
/**
 * @example
 * import { Ord } from 'fp-ts/Date'
 *
 * assert.deepStrictEqual(Ord.compare(new Date(1, 1, 2020), new Date(1, 1, 2021)), -1)
 *
 * @category instances
 * @since 2.10.0
 */
export declare const Ord: O.Ord<Date>
/**
 * Returns the current `Date`
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const create: IO<Date>
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 *
 * @since 2.0.0
 */
export declare const now: IO<number>
