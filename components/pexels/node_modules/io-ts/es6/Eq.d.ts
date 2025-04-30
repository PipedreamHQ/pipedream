import * as E from 'fp-ts/es6/Eq'
import { Schemable1, WithRefine1, WithUnknownContainers1 } from './Schemable'
import Eq = E.Eq
/**
 * @since 2.2.3
 */
export type URI = E.URI
/**
 * @since 2.2.2
 */
export type TypeOf<E> = E extends Eq<infer A> ? A : never
/**
 * @category primitives
 * @since 2.2.2
 */
export declare const string: Eq<string>
/**
 * @category primitives
 * @since 2.2.2
 */
export declare const number: Eq<number>
/**
 * @category primitives
 * @since 2.2.2
 */
export declare const boolean: Eq<boolean>
/**
 * @category primitives
 * @since 2.2.2
 */
export declare const UnknownArray: Eq<Array<unknown>>
/**
 * @category primitives
 * @since 2.2.2
 */
export declare const UnknownRecord: Eq<Record<string, unknown>>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare function nullable<A>(or: Eq<A>): Eq<null | A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const struct: <A>(eqs: {
  [K in keyof A]: Eq<A[K]>
}) => Eq<{
  [K in keyof A]: A[K]
}>
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.2
 * @deprecated
 */
export declare const type: <A>(eqs: { [K in keyof A]: E.Eq<A[K]> }) => E.Eq<{ [K_1 in keyof A]: A[K_1] }>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare function partial<A>(properties: {
  [K in keyof A]: Eq<A[K]>
}): Eq<
  Partial<{
    [K in keyof A]: A[K]
  }>
>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare const record: <A>(codomain: Eq<A>) => Eq<Record<string, A>>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare const array: <A>(eq: Eq<A>) => Eq<Array<A>>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare const tuple: <A extends ReadonlyArray<unknown>>(
  ...components: {
    [K in keyof A]: Eq<A[K]>
  }
) => Eq<A>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare const intersect: <B>(right: E.Eq<B>) => <A>(left: E.Eq<A>) => E.Eq<A & B>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare function sum<T extends string>(
  tag: T
): <A>(members: {
  [K in keyof A]: Eq<A[K] & Record<T, K>>
}) => Eq<A[keyof A]>
/**
 * @category combinators
 * @since 2.2.2
 */
export declare function lazy<A>(f: () => Eq<A>): Eq<A>
/**
 * @category combinators
 * @since 2.2.15
 */
export declare const readonly: <A>(eq: Eq<A>) => Eq<Readonly<A>>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const Schemable: Schemable1<E.URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithUnknownContainers: WithUnknownContainers1<E.URI>
/**
 * @category instances
 * @since 2.2.8
 */
export declare const WithRefine: WithRefine1<E.URI>
