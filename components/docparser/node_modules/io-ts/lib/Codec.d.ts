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
import { Refinement } from 'fp-ts/lib/function'
import { Invariant3 } from 'fp-ts/lib/Invariant'
import * as D from './Decoder'
import * as E from './Encoder'
import * as S from './Schemable'
/**
 * Laws:
 *
 * 1. `pipe(codec.decode(u), E.fold(() => u, codec.encode)) = u` for all `u` in `unknown`
 * 2. `codec.decode(codec.encode(a)) = E.right(a)` for all `a` in `A`
 *
 * @category model
 * @since 2.2.3
 */
export interface Codec<I, O, A> extends D.Decoder<I, A>, E.Encoder<O, A> {}
/**
 * @category constructors
 * @since 2.2.3
 */
export declare function make<I, O, A>(decoder: D.Decoder<I, A>, encoder: E.Encoder<O, A>): Codec<I, O, A>
/**
 * @category constructors
 * @since 2.2.3
 */
export declare function fromDecoder<I, A>(decoder: D.Decoder<I, A>): Codec<I, A, A>
/**
 * @category constructors
 * @since 2.2.3
 */
export declare function literal<A extends readonly [L, ...ReadonlyArray<L>], L extends S.Literal = S.Literal>(
  ...values: A
): Codec<unknown, A[number], A[number]>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const string: Codec<unknown, string, string>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const number: Codec<unknown, number, number>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const boolean: Codec<unknown, boolean, boolean>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const UnknownArray: Codec<unknown, Array<unknown>, Array<unknown>>
/**
 * @category primitives
 * @since 2.2.3
 */
export declare const UnknownRecord: Codec<unknown, Record<string, unknown>, Record<string, unknown>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const mapLeftWithInput: <I>(
  f: (i: I, e: D.DecodeError) => D.DecodeError
) => <O, A>(codec: Codec<I, O, A>) => Codec<I, O, A>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare const refine: <A, B extends A>(
  refinement: Refinement<A, B>,
  id: string
) => <I, O>(from: Codec<I, O, A>) => Codec<I, O, B>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function nullable<I, O, A>(or: Codec<I, O, A>): Codec<null | I, null | O, null | A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare function fromStruct<P extends Record<string, Codec<any, any, any>>>(
  properties: P
): Codec<
  {
    [K in keyof P]: InputOf<P[K]>
  },
  {
    [K in keyof P]: OutputOf<P[K]>
  },
  {
    [K in keyof P]: TypeOf<P[K]>
  }
>
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
export declare const fromType: typeof fromStruct
/**
 * @category combinators
 * @since 2.2.15
 */
export declare function struct<P extends Record<string, Codec<unknown, any, any>>>(
  properties: P
): Codec<
  unknown,
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
 * @since 2.2.8
 */
export declare function fromPartial<P extends Record<string, Codec<any, any, any>>>(
  properties: P
): Codec<
  Partial<{
    [K in keyof P]: InputOf<P[K]>
  }>,
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
export declare function partial<P extends Record<string, Codec<unknown, any, any>>>(
  properties: P
): Codec<
  unknown,
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
export declare function fromArray<I, O, A>(item: Codec<I, O, A>): Codec<Array<I>, Array<O>, Array<A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function array<O, A>(item: Codec<unknown, O, A>): Codec<unknown, Array<O>, Array<A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function fromRecord<I, O, A>(
  codomain: Codec<I, O, A>
): Codec<Record<string, I>, Record<string, O>, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function record<O, A>(
  codomain: Codec<unknown, O, A>
): Codec<unknown, Record<string, O>, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromTuple: <C extends readonly Codec<any, any, any>[]>(
  ...components: C
) => Codec<
  { [K in keyof C]: import('./Kleisli').InputOf<'Either', C[K]> },
  { [K_1 in keyof C]: E.OutputOf<C[K_1]> },
  { [K_2 in keyof C]: E.TypeOf<C[K_2]> }
>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function tuple<C extends ReadonlyArray<Codec<unknown, any, any>>>(
  ...components: C
): Codec<
  unknown,
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
export declare const intersect: <IB, OB, B>(
  right: Codec<IB, OB, B>
) => <IA, OA, A>(left: Codec<IA, OA, A>) => Codec<IA & IB, OA & OB, A & B>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const fromSum: <T extends string>(
  tag: T
) => <MS extends Record<string, Codec<any, any, any>>>(
  members: MS
) => Codec<import('./Kleisli').InputOf<'Either', MS[keyof MS]>, E.OutputOf<MS[keyof MS]>, E.TypeOf<MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function sum<T extends string>(
  tag: T
): <M extends Record<string, Codec<unknown, any, any>>>(
  members: M
) => Codec<unknown, OutputOf<M[keyof M]>, TypeOf<M[keyof M]>>
/**
 * @category combinators
 * @since 2.2.3
 */
export declare function lazy<I, O, A>(id: string, f: () => Codec<I, O, A>): Codec<I, O, A>
/**
 * @category combinators
 * @since 2.2.16
 */
export declare const readonly: <I, O, A>(codec: Codec<I, O, A>) => Codec<I, O, Readonly<A>>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare const compose: <L, A extends L, P extends A, B>(
  to: Codec<L, P, B>
) => <I, O>(from: Codec<I, O, A>) => Codec<I, O, B>
/**
 * @category Invariant
 * @since 2.2.3
 */
export declare const imap: <I, O, A, B>(f: (a: A) => B, g: (b: B) => A) => (fa: Codec<I, O, A>) => Codec<I, O, B>
/**
 * @category instances
 * @since 2.2.3
 */
export declare const URI = 'io-ts/Codec'
/**
 * @category instances
 * @since 2.2.3
 */
export type URI = typeof URI
declare module 'fp-ts/lib/HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: Codec<R, E, A>
  }
}
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Invariant: Invariant3<URI>
/**
 * @since 2.2.8
 */
export type InputOf<C> = D.InputOf<C>
/**
 * @since 2.2.3
 */
export type OutputOf<C> = E.OutputOf<C>
/**
 * @since 2.2.3
 */
export type TypeOf<C> = E.TypeOf<C>
