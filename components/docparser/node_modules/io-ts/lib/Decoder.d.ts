/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.7
 */
import { Alt2 } from 'fp-ts/lib/Alt'
import { Category2 } from 'fp-ts/lib/Category'
import * as E from 'fp-ts/lib/Either'
import { Refinement } from 'fp-ts/lib/function'
import { Functor2 } from 'fp-ts/lib/Functor'
import * as DE from './DecodeError'
import * as FS from './FreeSemigroup'
import * as G from './Guard'
import * as K from './Kleisli'
import * as S from './Schemable'
/**
 * @category model
 * @since 2.2.8
 */
export interface Decoder<I, A> extends K.Kleisli<E.URI, I, DecodeError, A> {}
/**
 * @category DecodeError
 * @since 2.2.7
 */
export type DecodeError = FS.FreeSemigroup<DE.DecodeError<string>>
/**
 * @category DecodeError
 * @since 2.2.7
 */
export declare const error: (actual: unknown, message: string) => DecodeError
/**
 * @category DecodeError
 * @since 2.2.7
 */
export declare const success: <A>(a: A) => E.Either<DecodeError, A>
/**
 * @category DecodeError
 * @since 2.2.7
 */
export declare const failure: <A = never>(actual: unknown, message: string) => E.Either<DecodeError, A>
/**
 * @category constructors
 * @since 2.2.8
 */
export declare const fromRefinement: <I, A extends I>(refinement: Refinement<I, A>, expected: string) => Decoder<I, A>
/**
 * @category constructors
 * @since 2.2.8
 */
export declare const fromGuard: <I, A extends I>(guard: G.Guard<I, A>, expected: string) => Decoder<I, A>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const literal: <A extends readonly [L, ...ReadonlyArray<L>], L extends S.Literal = S.Literal>(
  ...values: A
) => Decoder<unknown, A[number]>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const string: Decoder<unknown, string>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const number: Decoder<unknown, number>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const boolean: Decoder<unknown, boolean>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const UnknownArray: Decoder<unknown, Array<unknown>>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const UnknownRecord: Decoder<unknown, Record<string, unknown>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const mapLeftWithInput: <I>(
  f: (input: I, e: DecodeError) => DecodeError
) => <A>(decoder: Decoder<I, A>) => Decoder<I, A>
/**
 * @category combinators
 * @since 2.2.9
 */
export declare const withMessage: <I>(
  message: (input: I, e: DecodeError) => string
) => <A>(decoder: Decoder<I, A>) => Decoder<I, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const refine: <A, B extends A>(
  refinement: Refinement<A, B>,
  id: string
) => <I>(from: Decoder<I, A>) => Decoder<I, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const parse: <A, B>(
  parser: (a: A) => E.Either<DecodeError, B>
) => <I>(from: Decoder<I, A>) => Decoder<I, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const nullable: <I, A>(or: Decoder<I, A>) => Decoder<null | I, null | A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const fromStruct: <P extends Record<string, Decoder<any, any>>>(
  properties: P
) => Decoder<{ [K in keyof P]: K.InputOf<'Either', P[K]> }, { [K_1 in keyof P]: K.TypeOf<'Either', P[K_1]> }>
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
export declare const fromType: <P extends Record<string, Decoder<any, any>>>(
  properties: P
) => Decoder<{ [K in keyof P]: K.InputOf<'Either', P[K]> }, { [K_1 in keyof P]: K.TypeOf<'Either', P[K_1]> }>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const struct: <A>(properties: { [K in keyof A]: Decoder<unknown, A[K]> }) => Decoder<
  unknown,
  { [K_1 in keyof A]: A[K_1] }
>
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
export declare const type: <A>(properties: { [K in keyof A]: Decoder<unknown, A[K]> }) => Decoder<
  unknown,
  { [K_1 in keyof A]: A[K_1] }
>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromPartial: <P extends Record<string, Decoder<any, any>>>(
  properties: P
) => Decoder<
  Partial<{ [K in keyof P]: K.InputOf<'Either', P[K]> }>,
  Partial<{ [K_1 in keyof P]: K.TypeOf<'Either', P[K_1]> }>
>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const partial: <A>(properties: { [K in keyof A]: Decoder<unknown, A[K]> }) => Decoder<
  unknown,
  Partial<{ [K_1 in keyof A]: A[K_1] }>
>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromArray: <I, A>(item: Decoder<I, A>) => Decoder<I[], A[]>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const array: <A>(item: Decoder<unknown, A>) => Decoder<unknown, A[]>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromRecord: <I, A>(codomain: Decoder<I, A>) => Decoder<Record<string, I>, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const record: <A>(codomain: Decoder<unknown, A>) => Decoder<unknown, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromTuple: <C extends readonly Decoder<any, any>[]>(
  ...components: C
) => Decoder<{ [K in keyof C]: K.InputOf<'Either', C[K]> }, { [K_1 in keyof C]: K.TypeOf<'Either', C[K_1]> }>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const tuple: <A extends readonly unknown[]>(
  ...components: { [K in keyof A]: Decoder<unknown, A[K]> }
) => Decoder<unknown, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const union: <MS extends readonly [Decoder<any, any>, ...Array<Decoder<any, any>>]>(
  ...members: MS
) => Decoder<InputOf<MS[keyof MS]>, TypeOf<MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const intersect: <IB, B>(
  right: Decoder<IB, B>
) => <IA, A>(left: Decoder<IA, A>) => Decoder<IA & IB, A & B>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromSum: <T extends string>(
  tag: T
) => <MS extends Record<string, Decoder<any, any>>>(
  members: MS
) => Decoder<K.InputOf<'Either', MS[keyof MS]>, K.TypeOf<'Either', MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const sum: <T extends string>(
  tag: T
) => <A>(members: { [K in keyof A]: Decoder<unknown, A[K] & Record<T, K>> }) => Decoder<unknown, A[keyof A]>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const lazy: <I, A>(id: string, f: () => Decoder<I, A>) => Decoder<I, A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const readonly: <I, A>(decoder: Decoder<I, A>) => Decoder<I, Readonly<A>>
/**
 * @category Functor
 * @since 2.2.7
 */
export declare const map: <A, B>(f: (a: A) => B) => <I>(fa: Decoder<I, A>) => Decoder<I, B>
/**
 * @category Alt
 * @since 2.2.7
 */
export declare const alt: <I, A>(that: () => Decoder<I, A>) => (me: Decoder<I, A>) => Decoder<I, A>
/**
 * @category Semigroupoid
 * @since 2.2.8
 */
export declare const compose: <A, B>(to: Decoder<A, B>) => <I>(from: Decoder<I, A>) => Decoder<I, B>
/**
 * @category Category
 * @since 2.2.8
 */
export declare const id: <A>() => Decoder<A, A>
/**
 * @category instances
 * @since 2.2.7
 */
export declare const URI = 'io-ts/Decoder'
/**
 * @category instances
 * @since 2.2.7
 */
export type URI = typeof URI
declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Decoder<E, A>
  }
}
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Functor: Functor2<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Alt: Alt2<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Category: Category2<URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Schemable: S.Schemable2C<URI, unknown>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithUnknownContainers: S.WithUnknownContainers2C<URI, unknown>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithUnion: S.WithUnion2C<URI, unknown>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithRefine: S.WithRefine2C<URI, unknown>
/**
 * @since 2.2.8
 */
export type InputOf<D> = K.InputOf<E.URI, D>
/**
 * @since 2.2.7
 */
export type TypeOf<D> = K.TypeOf<E.URI, D>
/**
 * @since 2.2.7
 */
export declare const draw: (e: DecodeError) => string
