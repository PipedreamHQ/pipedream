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
import { Refinement } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT'
/**
 * @since 2.2.0
 */
export type Literal = string | number | boolean | null
/**
 * @since 2.2.3
 */
export interface Schemable<S> {
  readonly URI: S
  readonly literal: <A extends readonly [L, ...ReadonlyArray<L>], L extends Literal = Literal>(
    ...values: A
  ) => HKT<S, A[number]>
  readonly string: HKT<S, string>
  readonly number: HKT<S, number>
  readonly boolean: HKT<S, boolean>
  readonly nullable: <A>(or: HKT<S, A>) => HKT<S, null | A>
  /** @deprecated */
  readonly type: <A>(properties: {
    [K in keyof A]: HKT<S, A[K]>
  }) => HKT<
    S,
    {
      [K in keyof A]: A[K]
    }
  >
  readonly struct: <A>(properties: {
    [K in keyof A]: HKT<S, A[K]>
  }) => HKT<
    S,
    {
      [K in keyof A]: A[K]
    }
  >
  readonly partial: <A>(properties: {
    [K in keyof A]: HKT<S, A[K]>
  }) => HKT<
    S,
    Partial<{
      [K in keyof A]: A[K]
    }>
  >
  readonly record: <A>(codomain: HKT<S, A>) => HKT<S, Record<string, A>>
  readonly array: <A>(item: HKT<S, A>) => HKT<S, Array<A>>
  readonly tuple: <A extends ReadonlyArray<unknown>>(
    ...components: {
      [K in keyof A]: HKT<S, A[K]>
    }
  ) => HKT<S, A>
  readonly intersect: <B>(right: HKT<S, B>) => <A>(left: HKT<S, A>) => HKT<S, A & B>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(members: {
    [K in keyof A]: HKT<S, A[K] & Record<T, K>>
  }) => HKT<S, A[keyof A]>
  readonly lazy: <A>(id: string, f: () => HKT<S, A>) => HKT<S, A>
  readonly readonly: <A>(sa: HKT<S, A>) => HKT<S, Readonly<A>>
}
/**
 * @since 2.2.3
 */
export interface Schemable1<S extends URIS> {
  readonly URI: S
  readonly literal: <A extends readonly [L, ...ReadonlyArray<L>], L extends Literal = Literal>(
    ...values: A
  ) => Kind<S, A[number]>
  readonly string: Kind<S, string>
  readonly number: Kind<S, number>
  readonly boolean: Kind<S, boolean>
  readonly nullable: <A>(or: Kind<S, A>) => Kind<S, null | A>
  /** @deprecated */
  readonly type: <A>(properties: {
    [K in keyof A]: Kind<S, A[K]>
  }) => Kind<
    S,
    {
      [K in keyof A]: A[K]
    }
  >
  readonly struct: <A>(properties: {
    [K in keyof A]: Kind<S, A[K]>
  }) => Kind<
    S,
    {
      [K in keyof A]: A[K]
    }
  >
  readonly partial: <A>(properties: {
    [K in keyof A]: Kind<S, A[K]>
  }) => Kind<
    S,
    Partial<{
      [K in keyof A]: A[K]
    }>
  >
  readonly record: <A>(codomain: Kind<S, A>) => Kind<S, Record<string, A>>
  readonly array: <A>(item: Kind<S, A>) => Kind<S, Array<A>>
  readonly tuple: <A extends ReadonlyArray<unknown>>(
    ...components: {
      [K in keyof A]: Kind<S, A[K]>
    }
  ) => Kind<S, A>
  readonly intersect: <B>(right: Kind<S, B>) => <A>(left: Kind<S, A>) => Kind<S, A & B>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(members: {
    [K in keyof A]: Kind<S, A[K] & Record<T, K>>
  }) => Kind<S, A[keyof A]>
  readonly lazy: <A>(id: string, f: () => Kind<S, A>) => Kind<S, A>
  readonly readonly: <A>(sa: Kind<S, A>) => Kind<S, Readonly<A>>
}
/**
 * @since 2.2.8
 */
export interface Schemable2C<S extends URIS2, E> {
  readonly URI: S
  readonly literal: <A extends readonly [L, ...ReadonlyArray<L>], L extends Literal = Literal>(
    ...values: A
  ) => Kind2<S, E, A[number]>
  readonly string: Kind2<S, E, string>
  readonly number: Kind2<S, E, number>
  readonly boolean: Kind2<S, E, boolean>
  readonly nullable: <A>(or: Kind2<S, E, A>) => Kind2<S, E, null | A>
  /** @deprecated */
  readonly type: <A>(properties: {
    [K in keyof A]: Kind2<S, E, A[K]>
  }) => Kind2<
    S,
    E,
    {
      [K in keyof A]: A[K]
    }
  >
  readonly struct: <A>(properties: {
    [K in keyof A]: Kind2<S, E, A[K]>
  }) => Kind2<
    S,
    E,
    {
      [K in keyof A]: A[K]
    }
  >
  readonly partial: <A>(properties: {
    [K in keyof A]: Kind2<S, E, A[K]>
  }) => Kind2<
    S,
    E,
    Partial<{
      [K in keyof A]: A[K]
    }>
  >
  readonly record: <A>(codomain: Kind2<S, E, A>) => Kind2<S, E, Record<string, A>>
  readonly array: <A>(item: Kind2<S, E, A>) => Kind2<S, E, Array<A>>
  readonly tuple: <A extends ReadonlyArray<unknown>>(
    ...components: {
      [K in keyof A]: Kind2<S, E, A[K]>
    }
  ) => Kind2<S, E, A>
  readonly intersect: <B>(right: Kind2<S, E, B>) => <A>(left: Kind2<S, E, A>) => Kind2<S, E, A & B>
  readonly sum: <T extends string>(
    tag: T
  ) => <A>(members: {
    [K in keyof A]: Kind2<S, E, A[K] & Record<T, K>>
  }) => Kind2<S, E, A[keyof A]>
  readonly lazy: <A>(id: string, f: () => Kind2<S, E, A>) => Kind2<S, E, A>
  readonly readonly: <A>(sa: Kind2<S, E, A>) => Kind2<S, E, Readonly<A>>
}
/**
 * @since 2.2.3
 */
export interface WithUnknownContainers<S> {
  readonly UnknownArray: HKT<S, Array<unknown>>
  readonly UnknownRecord: HKT<S, Record<string, unknown>>
}
/**
 * @since 2.2.3
 */
export interface WithUnknownContainers1<S extends URIS> {
  readonly UnknownArray: Kind<S, Array<unknown>>
  readonly UnknownRecord: Kind<S, Record<string, unknown>>
}
/**
 * @since 2.2.8
 */
export interface WithUnknownContainers2C<S extends URIS2, E> {
  readonly UnknownArray: Kind2<S, E, Array<unknown>>
  readonly UnknownRecord: Kind2<S, E, Record<string, unknown>>
}
/**
 * @since 2.2.3
 */
export interface WithUnion<S> {
  readonly union: <A extends readonly [unknown, ...Array<unknown>]>(
    ...members: {
      [K in keyof A]: HKT<S, A[K]>
    }
  ) => HKT<S, A[number]>
}
/**
 * @since 2.2.3
 */
export interface WithUnion1<S extends URIS> {
  readonly union: <A extends readonly [unknown, ...Array<unknown>]>(
    ...members: {
      [K in keyof A]: Kind<S, A[K]>
    }
  ) => Kind<S, A[number]>
}
/**
 * @since 2.2.8
 */
export interface WithUnion2C<S extends URIS2, E> {
  readonly union: <A extends readonly [unknown, ...Array<unknown>]>(
    ...members: {
      [K in keyof A]: Kind2<S, E, A[K]>
    }
  ) => Kind2<S, E, A[number]>
}
/**
 * @since 2.2.3
 */
export interface WithRefine<S> {
  readonly refine: <A, B extends A>(refinement: Refinement<A, B>, id: string) => (from: HKT<S, A>) => HKT<S, B>
}
/**
 * @since 2.2.3
 */
export interface WithRefine1<S extends URIS> {
  readonly refine: <A, B extends A>(refinement: Refinement<A, B>, id: string) => (from: Kind<S, A>) => Kind<S, B>
}
/**
 * @since 2.2.8
 */
export interface WithRefine2C<S extends URIS2, E> {
  readonly refine: <A, B extends A>(
    refinement: Refinement<A, B>,
    id: string
  ) => (from: Kind2<S, E, A>) => Kind2<S, E, B>
}
/**
 * @since 2.2.0
 */
export declare function memoize<A, B>(f: (a: A) => B): (a: A) => B
