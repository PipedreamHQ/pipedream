/**
 * @since 2.11.0
 */
import { Contravariant1 } from './Contravariant'
import { Monoid } from './Monoid'
import { Semigroup } from './Semigroup'
/**
 * @since 2.11.0
 */
export interface Predicate<A> {
  (a: A): boolean
}
/**
 * @since 2.11.0
 */
export declare const contramap: <B, A>(f: (b: B) => A) => (predicate: Predicate<A>) => Predicate<B>
/**
 * @category type lambdas
 * @since 2.11.0
 */
export declare const URI = 'Predicate'
/**
 * @category type lambdas
 * @since 2.11.0
 */
export type URI = typeof URI
declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Predicate<A>
  }
}
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getSemigroupAny: <A = never>() => Semigroup<Predicate<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getMonoidAny: <A = never>() => Monoid<Predicate<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getSemigroupAll: <A = never>() => Semigroup<Predicate<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const getMonoidAll: <A = never>() => Monoid<Predicate<A>>
/**
 * @category instances
 * @since 2.11.0
 */
export declare const Contravariant: Contravariant1<URI>
/**
 * @since 2.11.0
 */
export declare const not: <A>(predicate: Predicate<A>) => Predicate<A>
/**
 * @since 2.11.0
 */
export declare const or: <A>(second: Predicate<A>) => (first: Predicate<A>) => Predicate<A>
/**
 * @since 2.11.0
 */
export declare const and: <A>(second: Predicate<A>) => (first: Predicate<A>) => Predicate<A>
