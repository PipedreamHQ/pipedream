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
import { Alt2C } from 'fp-ts/lib/Alt'
import { Applicative2C } from 'fp-ts/lib/Applicative'
import { Apply2C } from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { Lazy, Refinement } from 'fp-ts/lib/function'
import { Functor2C } from 'fp-ts/lib/Functor'
import { Kind2, URIS2 } from 'fp-ts/lib/HKT'
import { Monad2C } from 'fp-ts/lib/Monad'
import { MonadThrow2C } from 'fp-ts/lib/MonadThrow'
import * as S from './Schemable'
/**
 * @category model
 * @since 2.2.7
 */
export interface Kleisli<M extends URIS2, I, E, A> {
  readonly decode: (i: I) => Kind2<M, E, A>
}
/**
 * @category constructors
 * @since 2.2.7
 */
export declare function fromRefinement<M extends URIS2, E>(
  M: MonadThrow2C<M, E>
): <I, A extends I>(refinement: Refinement<I, A>, onError: (i: I) => E) => Kleisli<M, I, E, A>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare function literal<M extends URIS2, E>(
  M: MonadThrow2C<M, E>
): <I>(
  onError: (i: I, values: readonly [S.Literal, ...ReadonlyArray<S.Literal>]) => E
) => <A extends readonly [L, ...ReadonlyArray<L>], L extends S.Literal = S.Literal>(
  ...values: A
) => Kleisli<M, I, E, A[number]>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function mapLeftWithInput<M extends URIS2>(
  M: Bifunctor2<M>
): <I, E>(f: (i: I, e: E) => E) => <A>(decoder: Kleisli<M, I, E, A>) => Kleisli<M, I, E, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function refine<M extends URIS2, E>(
  M: MonadThrow2C<M, E> & Bifunctor2<M>
): <A, B extends A>(
  refinement: (a: A) => a is B,
  onError: (a: A) => E
) => <I>(from: Kleisli<M, I, E, A>) => Kleisli<M, I, E, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function parse<M extends URIS2, E>(
  M: Monad2C<M, E>
): <A, B>(decode: (a: A) => Kind2<M, E, B>) => <I>(from: Kleisli<M, I, E, A>) => Kleisli<M, I, E, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function nullable<M extends URIS2, E>(
  M: Applicative2C<M, E> & Bifunctor2<M>
): <I>(onError: (i: I, e: E) => E) => <A>(or: Kleisli<M, I, E, A>) => Kleisli<M, null | I, E, null | A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare function fromStruct<M extends URIS2, E>(
  M: Applicative2C<M, E> & Bifunctor2<M>
): (onPropertyError: (key: string, e: E) => E) => <P extends Record<string, Kleisli<M, any, E, any>>>(
  properties: P
) => Kleisli<
  M,
  {
    [K in keyof P]: InputOf<M, P[K]>
  },
  E,
  {
    [K in keyof P]: TypeOf<M, P[K]>
  }
>
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
export declare const fromType: typeof fromStruct
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function fromPartial<M extends URIS2, E>(
  M: Applicative2C<M, E> & Bifunctor2<M>
): (onPropertyError: (key: string, e: E) => E) => <P extends Record<string, Kleisli<M, any, E, any>>>(
  properties: P
) => Kleisli<
  M,
  Partial<{
    [K in keyof P]: InputOf<M, P[K]>
  }>,
  E,
  Partial<{
    [K in keyof P]: TypeOf<M, P[K]>
  }>
>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function fromArray<M extends URIS2, E>(
  M: Applicative2C<M, E> & Bifunctor2<M>
): (onItemError: (index: number, e: E) => E) => <I, A>(item: Kleisli<M, I, E, A>) => Kleisli<M, Array<I>, E, Array<A>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function fromRecord<M extends URIS2, E>(
  M: Applicative2C<M, E> & Bifunctor2<M>
): (
  onKeyError: (key: string, e: E) => E
) => <I, A>(codomain: Kleisli<M, I, E, A>) => Kleisli<M, Record<string, I>, E, Record<string, A>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function fromTuple<M extends URIS2, E>(
  M: Applicative2C<M, E> & Bifunctor2<M>
): (onIndexError: (index: number, e: E) => E) => <C extends ReadonlyArray<Kleisli<M, any, E, any>>>(
  ...components: C
) => Kleisli<
  M,
  {
    [K in keyof C]: InputOf<M, C[K]>
  },
  E,
  {
    [K in keyof C]: TypeOf<M, C[K]>
  }
>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function union<M extends URIS2, E>(
  M: Alt2C<M, E> & Bifunctor2<M>
): (
  onMemberError: (index: number, e: E) => E
) => <MS extends readonly [Kleisli<M, any, E, any>, ...Array<Kleisli<M, any, E, any>>]>(
  ...members: MS
) => Kleisli<M, InputOf<M, MS[keyof MS]>, E, TypeOf<M, MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function intersect<M extends URIS2, E>(
  M: Apply2C<M, E>
): <IB, B>(right: Kleisli<M, IB, E, B>) => <IA, A>(left: Kleisli<M, IA, E, A>) => Kleisli<M, IA & IB, E, A & B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function fromSum<M extends URIS2, E>(
  M: MonadThrow2C<M, E>
): (
  onTagError: (tag: string, value: unknown, tags: ReadonlyArray<string>) => E
) => <T extends string>(
  tag: T
) => <MS extends Record<string, Kleisli<M, any, E, any>>>(
  members: MS
) => Kleisli<M, InputOf<M, MS[keyof MS]>, E, TypeOf<M, MS[keyof MS]>>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function lazy<M extends URIS2>(
  M: Bifunctor2<M>
): <E>(onError: (id: string, e: E) => E) => <I, A>(id: string, f: () => Kleisli<M, I, E, A>) => Kleisli<M, I, E, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function compose<M extends URIS2, E>(
  M: Monad2C<M, E>
): <A, B>(ab: Kleisli<M, A, E, B>) => <I>(ia: Kleisli<M, I, E, A>) => Kleisli<M, I, E, B>
/**
 * @category combinators
 * @since 2.2.8
 */
export declare function id<M extends URIS2, E>(M: Applicative2C<M, E>): <A>() => Kleisli<M, A, E, A>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function map<F extends URIS2, E>(
  F: Functor2C<F, E>
): <A, B>(f: (a: A) => B) => <I>(ia: Kleisli<F, I, E, A>) => Kleisli<F, I, E, B>
/**
 * @category combinators
 * @since 2.2.7
 */
export declare function alt<F extends URIS2, E>(
  A: Alt2C<F, E>
): <I, A>(that: Lazy<Kleisli<F, I, E, A>>) => (me: Kleisli<F, I, E, A>) => Kleisli<F, I, E, A>
/**
 * @since 2.2.7
 */
export type TypeOf<M extends URIS2, KD> = KD extends Kleisli<M, any, any, infer A> ? A : never
/**
 * @since 2.2.7
 */
export type InputOf<M extends URIS2, KD> = KD extends Kleisli<M, infer I, any, any> ? I : never
