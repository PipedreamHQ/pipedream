/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.3
 */
import { Category2 } from 'fp-ts/lib/Category'
import { Contravariant2 } from 'fp-ts/lib/Contravariant'
/**
 * @category model
 * @since 2.2.3
 */
export interface Encoder<O, A> {
  readonly encode: (a: A) => O
}
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function nullable<O, A>(or: Encoder<O, A>): Encoder<null | O, null | A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare function struct<P extends Record<string, Encoder<any, any>>>(
  properties: P
): Encoder<
  {
    [K in keyof P]: OutputOf<P[K]>
  },
  {
    [K in keyof P]: TypeOf<P[K]>
  }
>
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.3
 * @deprecated
 */
export declare const type: typeof struct
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function partial<P extends Record<string, Encoder<any, any>>>(
  properties: P
): Encoder<
  Partial<{
    [K in keyof P]: OutputOf<P[K]>
  }>,
  Partial<{
    [K in keyof P]: TypeOf<P[K]>
  }>
>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function record<O, A>(codomain: Encoder<O, A>): Encoder<Record<string, O>, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function array<O, A>(item: Encoder<O, A>): Encoder<Array<O>, Array<A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function tuple<C extends ReadonlyArray<Encoder<any, any>>>(
  ...components: C
): Encoder<
  {
    [K in keyof C]: OutputOf<C[K]>
  },
  {
    [K in keyof C]: TypeOf<C[K]>
  }
>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const intersect: <P, B>(right: Encoder<P, B>) => <O, A>(left: Encoder<O, A>) => Encoder<O & P, A & B>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function sum<T extends string>(
  tag: T
): <MS extends Record<string, Encoder<any, any>>>(members: MS) => Encoder<OutputOf<MS[keyof MS]>, TypeOf<MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function lazy<O, A>(f: () => Encoder<O, A>): Encoder<O, A>
/**
 * @category combinators
 * @since 2.2.16
 */
export declare const readonly: <O, A>(decoder: Encoder<O, A>) => Encoder<O, Readonly<A>>
/**
 * @category Contravariant
 * @since 2.2.3
 */
export declare const contramap: <A, B>(f: (b: B) => A) => <E>(fa: Encoder<E, A>) => Encoder<E, B>
/**
 * @category Semigroupoid
 * @since 2.2.3
 */
export declare const compose: <E, A>(ea: Encoder<E, A>) => <B>(ab: Encoder<A, B>) => Encoder<E, B>
/**
 * @category Category
 * @since 2.2.3
 */
export declare function id<A>(): Encoder<A, A>
/**
 * @category instances
 * @since 2.2.3
 */
export declare const URI = 'io-ts/Encoder'
/**
 * @category instances
 * @since 2.2.3
 */
export type URI = typeof URI
declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Encoder<E, A>
  }
}
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Contravariant: Contravariant2<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Category: Category2<URI>
/**
 * @since 2.2.3
 */
export type TypeOf<E> = E extends Encoder<any, infer A> ? A : never
/**
 * @since 2.2.3
 */
export type OutputOf<E> = E extends Encoder<infer O, any> ? O : never
