/**
 * @since 2.11.0
 */
import { Monoid } from './Monoid'
import { Semigroup } from './Semigroup'
/**
 * @since 2.11.0
 */
export interface Endomorphism<A> {
  (a: A): A
}
/**
 * @category type lambdas
 * @since 2.11.0
 */
export declare const URI = 'Endomorphism'
/**
 * @category type lambdas
 * @since 2.11.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Endomorphism<A>
  }
}
/**
 * Endomorphism form a `Semigroup` where the `concat` operation is the usual function composition.
 *
 * @category instances
 * @since 2.11.0
 */
export declare const getSemigroup: <A = never>() => Semigroup<Endomorphism<A>>
/**
 * Endomorphism form a `Monoid` where the `empty` value is the `identity` function.
 *
 * @category instances
 * @since 2.11.0
 */
export declare const getMonoid: <A = never>() => Monoid<Endomorphism<A>>
