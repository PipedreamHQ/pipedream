import { Refinement } from 'fp-ts/es6/function'
import * as t from './index'
import * as S from './Schemable'
/**
 * @category model
 * @since 2.2.3
 */
export interface Type<A> extends t.Type<A, unknown, unknown> {}
/**
 * @category constructors
 * @since 2.2.3
 */
export declare const literal: <A extends readonly [L, ...L[]], L extends S.Literal = S.Literal>(
  ...values: A
) => Type<A[number]>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const string: Type<string>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const number: Type<number>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const boolean: Type<boolean>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const UnknownArray: Type<Array<unknown>>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const UnknownRecord: Type<Record<string, unknown>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const refine: <A, B extends A>(refinement: Refinement<A, B>, id: string) => (from: Type<A>) => Type<B>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const nullable: <A>(or: Type<A>) => Type<A | null>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const struct: <A>(properties: { [K in keyof A]: Type<A[K]> }) => Type<{ [K_1 in keyof A]: A[K_1] }>
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.3
 * @deprecated
 */
export declare const type: <A>(properties: { [K in keyof A]: Type<A[K]> }) => Type<{ [K_1 in keyof A]: A[K_1] }>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const partial: <A>(properties: { [K in keyof A]: Type<A[K]> }) => Type<
  Partial<{ [K_1 in keyof A]: A[K_1] }>
>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const record: <A>(codomain: Type<A>) => Type<Record<string, A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const array: <A>(item: Type<A>) => Type<A[]>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const tuple: <A extends readonly unknown[]>(...components: { [K in keyof A]: Type<A[K]> }) => Type<A>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const intersect: <B>(right: Type<B>) => <A>(left: Type<A>) => Type<A & B>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const lazy: <A>(id: string, f: () => Type<A>) => Type<A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const readonly: <A>(type: Type<A>) => Type<Readonly<A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const sum: <T extends string>(
  _tag: T
) => <A>(members: { [K in keyof A]: Type<A[K] & Record<T, K>> }) => Type<A[keyof A]>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const union: <A extends readonly [unknown, ...unknown[]]>(
  ...members: { [K in keyof A]: Type<A[K]> }
) => Type<A[number]>
/**
 * @category instances
 * @since 2.2.3
 */
export declare const URI = 'io-ts/Type'
/**
 * @category instances
 * @since 2.2.3
 */
export type URI = typeof URI
declare module 'fp-ts/es6/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Type<A>
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
