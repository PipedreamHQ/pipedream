/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.0
 */
import { Refinement } from 'fp-ts/es6/function'
import * as S from './Schemable'
/**
 * @category model
 * @since 2.2.8
 */
export interface Guard<I, A extends I> {
  is: (i: I) => i is A
}
/**
 * @since 2.2.2
 */
export type TypeOf<G> = G extends Guard<any, infer A> ? A : never
/**
 * @since 2.2.8
 */
export type InputOf<G> = G extends Guard<infer I, any> ? I : never
/**
 * @category constructors
 * @since 2.2.0
 */
export declare const literal: <A extends readonly [L, ...L[]], L extends S.Literal = S.Literal>(
  ...values: A
) => Guard<unknown, A[number]>
/**
 * @category primitives
 * @since 2.2.0
 */
export declare const string: Guard<unknown, string>
/**
 * Note: `NaN` is excluded.
 *
 * @category primitives
 * @since 2.2.0
 */
export declare const number: Guard<unknown, number>
/**
 * @category primitives
 * @since 2.2.0
 */
export declare const boolean: Guard<unknown, boolean>
/**
 * @category primitives
 * @since 2.2.0
 */
export declare const UnknownArray: Guard<unknown, Array<unknown>>
/**
 * @category primitives
 * @since 2.2.0
 */
export declare const UnknownRecord: Guard<unknown, Record<string, unknown>>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const refine: <I, A extends I, B extends A>(
  refinement: Refinement<A, B>
) => (from: Guard<I, A>) => Guard<I, B>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const nullable: <I, A extends I>(or: Guard<I, A>) => Guard<I | null, A | null>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const struct: <A>(properties: { [K in keyof A]: Guard<unknown, A[K]> }) => Guard<
  unknown,
  { [K_1 in keyof A]: A[K_1] }
>
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.0
 * @deprecated
 */
export declare const type: <A>(properties: { [K in keyof A]: Guard<unknown, A[K]> }) => Guard<
  unknown,
  { [K_1 in keyof A]: A[K_1] }
>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const partial: <A>(properties: { [K in keyof A]: Guard<unknown, A[K]> }) => Guard<
  unknown,
  Partial<{ [K_1 in keyof A]: A[K_1] }>
>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const array: <A>(item: Guard<unknown, A>) => Guard<unknown, A[]>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const record: <A>(codomain: Guard<unknown, A>) => Guard<unknown, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const tuple: <A extends readonly unknown[]>(
  ...components: { [K in keyof A]: Guard<unknown, A[K]> }
) => Guard<unknown, A>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const intersect: <B>(right: Guard<unknown, B>) => <A>(left: Guard<unknown, A>) => Guard<unknown, A & B>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const union: <A extends readonly [unknown, ...unknown[]]>(
  ...members: { [K in keyof A]: Guard<unknown, A[K]> }
) => Guard<unknown, A[number]>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const sum: <T extends string>(
  tag: T
) => <A>(members: { [K in keyof A]: Guard<unknown, A[K] & Record<T, K>> }) => Guard<unknown, A[keyof A]>
/**
 * @category combinators
 * @since 2.2.0
 */
export declare const lazy: <A>(f: () => Guard<unknown, A>) => Guard<unknown, A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const readonly: <I, A extends I>(guard: Guard<I, A>) => Guard<I, Readonly<A>>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const alt: <I, A extends I>(that: () => Guard<I, A>) => (me: Guard<I, A>) => Guard<I, A>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const zero: <I, A extends I>() => Guard<I, A>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const compose: <I, A extends I, B extends A>(to: Guard<A, B>) => (from: Guard<I, A>) => Guard<I, B>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const id: <A>() => Guard<A, A>
/**
 * @category instances
 * @since 2.2.0
 */
export declare const URI = 'io-ts/Guard'
/**
 * @category instances
 * @since 2.2.0
 */
export type URI = typeof URI
declare module 'fp-ts/es6/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Guard<unknown, A>
  }
}
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Schemable: S.Schemable1<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithUnknownContainers: S.WithUnknownContainers1<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithUnion: S.WithUnion1<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithRefine: S.WithRefine1<URI>
