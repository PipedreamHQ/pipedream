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
import { Alt2 } from 'fp-ts/es6/Alt'
import { Category2 } from 'fp-ts/es6/Category'
import { Refinement } from 'fp-ts/es6/function'
import { Functor2 } from 'fp-ts/es6/Functor'
import * as TE from 'fp-ts/es6/TaskEither'
import * as D from './Decoder'
import * as G from './Guard'
import * as K from './Kleisli'
import * as S from './Schemable'
/**
 * @category model
 * @since 2.2.8
 */
export interface TaskDecoder<I, A> extends K.Kleisli<TE.URI, I, DecodeError, A> {}
/**
 * @category DecodeError
 * @since 2.2.7
 */
export type DecodeError = D.DecodeError
/**
 * @category DecodeError
 * @since 2.2.7
 */
export declare const error: (actual: unknown, message: string) => DecodeError
/**
 * @category DecodeError
 * @since 2.2.7
 */
export declare const success: <A>(a: A) => TE.TaskEither<DecodeError, A>
/**
 * @category DecodeError
 * @since 2.2.7
 */
export declare const failure: <A = never>(actual: unknown, message: string) => TE.TaskEither<D.DecodeError, A>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const fromDecoder: <I, A>(decoder: D.Decoder<I, A>) => TaskDecoder<I, A>
/**
 * @category constructors
 * @since 2.2.8
 */
export declare const fromRefinement: <I, A extends I>(
  refinement: Refinement<I, A>,
  expected: string
) => TaskDecoder<I, A>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const fromGuard: <I, A extends I>(guard: G.Guard<I, A>, expected: string) => TaskDecoder<I, A>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const literal: <A extends readonly [L, ...ReadonlyArray<L>], L extends S.Literal = S.Literal>(
  ...values: A
) => TaskDecoder<unknown, A[number]>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const string: TaskDecoder<unknown, string>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const number: TaskDecoder<unknown, number>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const boolean: TaskDecoder<unknown, boolean>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const UnknownArray: TaskDecoder<unknown, Array<unknown>>
/**
 * @category primitives
 * @since 2.2.7
 */
export declare const UnknownRecord: TaskDecoder<unknown, Record<string, unknown>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const mapLeftWithInput: <I>(
  f: (input: I, e: DecodeError) => DecodeError
) => <A>(decoder: TaskDecoder<I, A>) => TaskDecoder<I, A>
/**
 * @category combinators
 * @since 2.2.9
 */
export declare const withMessage: <I>(
  message: (input: I, e: DecodeError) => string
) => <A>(decoder: TaskDecoder<I, A>) => TaskDecoder<I, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const refine: <A, B extends A>(
  refinement: Refinement<A, B>,
  id: string
) => <I>(from: TaskDecoder<I, A>) => TaskDecoder<I, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const parse: <A, B>(
  parser: (a: A) => TE.TaskEither<DecodeError, B>
) => <I>(from: TaskDecoder<I, A>) => TaskDecoder<I, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const nullable: <I, A>(or: TaskDecoder<I, A>) => TaskDecoder<null | I, null | A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const fromStruct: <P extends Record<string, TaskDecoder<any, any>>>(
  properties: P
) => TaskDecoder<
  { [K in keyof P]: K.InputOf<'TaskEither', P[K]> },
  { [K_1 in keyof P]: K.TypeOf<'TaskEither', P[K_1]> }
>
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
export declare const fromType: <P extends Record<string, TaskDecoder<any, any>>>(
  properties: P
) => TaskDecoder<
  { [K in keyof P]: K.InputOf<'TaskEither', P[K]> },
  { [K_1 in keyof P]: K.TypeOf<'TaskEither', P[K_1]> }
>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const struct: <A>(properties: { [K in keyof A]: TaskDecoder<unknown, A[K]> }) => TaskDecoder<
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
export declare const type: <A>(properties: { [K in keyof A]: TaskDecoder<unknown, A[K]> }) => TaskDecoder<
  unknown,
  { [K_1 in keyof A]: A[K_1] }
>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromPartial: <P extends Record<string, TaskDecoder<any, any>>>(
  properties: P
) => TaskDecoder<
  Partial<{ [K in keyof P]: K.InputOf<'TaskEither', P[K]> }>,
  Partial<{ [K_1 in keyof P]: K.TypeOf<'TaskEither', P[K_1]> }>
>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const partial: <A>(properties: { [K in keyof A]: TaskDecoder<unknown, A[K]> }) => TaskDecoder<
  unknown,
  Partial<{ [K_1 in keyof A]: A[K_1] }>
>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromArray: <I, A>(item: TaskDecoder<I, A>) => TaskDecoder<I[], A[]>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const array: <A>(item: TaskDecoder<unknown, A>) => TaskDecoder<unknown, A[]>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromRecord: <I, A>(
  codomain: TaskDecoder<I, A>
) => TaskDecoder<Record<string, I>, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const record: <A>(codomain: TaskDecoder<unknown, A>) => TaskDecoder<unknown, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromTuple: <C extends readonly TaskDecoder<any, any>[]>(
  ...components: C
) => TaskDecoder<
  { [K in keyof C]: K.InputOf<'TaskEither', C[K]> },
  { [K_1 in keyof C]: K.TypeOf<'TaskEither', C[K_1]> }
>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const tuple: <A extends readonly unknown[]>(
  ...components: { [K in keyof A]: TaskDecoder<unknown, A[K]> }
) => TaskDecoder<unknown, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const union: <MS extends readonly [TaskDecoder<any, any>, ...Array<TaskDecoder<any, any>>]>(
  ...members: MS
) => TaskDecoder<InputOf<MS[keyof MS]>, TypeOf<MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const intersect: <IB, B>(
  right: TaskDecoder<IB, B>
) => <IA, A>(left: TaskDecoder<IA, A>) => TaskDecoder<IA & IB, A & B>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromSum: <T extends string>(
  tag: T
) => <MS extends Record<string, TaskDecoder<any, any>>>(
  members: MS
) => TaskDecoder<K.InputOf<'TaskEither', MS[keyof MS]>, K.TypeOf<'TaskEither', MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const sum: <T extends string>(
  tag: T
) => <A>(members: { [K in keyof A]: TaskDecoder<unknown, A[K] & Record<T, K>> }) => TaskDecoder<unknown, A[keyof A]>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare const lazy: <I, A>(id: string, f: () => TaskDecoder<I, A>) => TaskDecoder<I, A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const readonly: <I, A>(decoder: TaskDecoder<I, A>) => TaskDecoder<I, Readonly<A>>
/**
 * @category Functor
 * @since 2.2.7
 */
export declare const map: <A, B>(f: (a: A) => B) => <I>(fa: TaskDecoder<I, A>) => TaskDecoder<I, B>
/**
 * @category Alt
 * @since 2.2.7
 */
export declare const alt: <I, A>(that: () => TaskDecoder<I, A>) => (me: TaskDecoder<I, A>) => TaskDecoder<I, A>
/**
 * @category Semigroupoid
 * @since 2.2.8
 */
export declare const compose: <A, B>(to: TaskDecoder<A, B>) => <I>(from: TaskDecoder<I, A>) => TaskDecoder<I, B>
/**
 * @category Category
 * @since 2.2.8
 */
export declare const id: <A>() => TaskDecoder<A, A>
/**
 * @category instances
 * @since 2.2.7
 */
export declare const URI = 'io-ts/TaskDecoder'
/**
 * @category instances
 * @since 2.2.7
 */
export type URI = typeof URI
declare module 'fp-ts/es6/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: TaskDecoder<E, A>
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
 * @since 2.2.7
 */
export type TypeOf<KTD> = K.TypeOf<TE.URI, KTD>
/**
 * @since 2.2.8
 */
export type InputOf<KTD> = K.InputOf<TE.URI, KTD>
/**
 * @since 2.2.7
 */
export declare const draw: (e: DecodeError) => string
