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
import { Semigroup } from 'fp-ts/es6/Semigroup'
import * as FS from './FreeSemigroup'
/**
 * @category model
 * @since 2.2.7
 */
export interface Leaf<E> {
  readonly _tag: 'Leaf'
  readonly actual: unknown
  readonly error: E
}
/**
 * @category model
 * @since 2.2.7
 */
export declare const required: 'required'
/**
 * @category model
 * @since 2.2.7
 */
export declare const optional: 'optional'
/**
 * @category model
 * @since 2.2.7
 */
export type Kind = 'required' | 'optional'
/**
 * @category model
 * @since 2.2.7
 */
export interface Key<E> {
  readonly _tag: 'Key'
  readonly key: string
  readonly kind: Kind
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}
/**
 * @category model
 * @since 2.2.7
 */
export interface Index<E> {
  readonly _tag: 'Index'
  readonly index: number
  readonly kind: Kind
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}
/**
 * @category model
 * @since 2.2.7
 */
export interface Member<E> {
  readonly _tag: 'Member'
  readonly index: number
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}
/**
 * @category model
 * @since 2.2.7
 */
export interface Lazy<E> {
  readonly _tag: 'Lazy'
  readonly id: string
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}
/**
 * @category model
 * @since 2.2.9
 */
export interface Wrap<E> {
  readonly _tag: 'Wrap'
  readonly error: E
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}
/**
 * @category model
 * @since 2.2.7
 */
export type DecodeError<E> = Leaf<E> | Key<E> | Index<E> | Member<E> | Lazy<E> | Wrap<E>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const leaf: <E>(actual: unknown, error: E) => DecodeError<E>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const key: <E>(key: string, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>) => DecodeError<E>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const index: <E>(index: number, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>) => DecodeError<E>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const member: <E>(index: number, errors: FS.FreeSemigroup<DecodeError<E>>) => DecodeError<E>
/**
 * @category constructors
 * @since 2.2.7
 */
export declare const lazy: <E>(id: string, errors: FS.FreeSemigroup<DecodeError<E>>) => DecodeError<E>
/**
 * @category constructors
 * @since 2.2.9
 */
export declare const wrap: <E>(error: E, errors: FS.FreeSemigroup<DecodeError<E>>) => DecodeError<E>
/**
 * @category destructors
 * @since 2.2.7
 */
export declare const fold: <E, R>(patterns: {
  Leaf: (input: unknown, error: E) => R
  Key: (key: string, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>) => R
  Index: (index: number, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>) => R
  Member: (index: number, errors: FS.FreeSemigroup<DecodeError<E>>) => R
  Lazy: (id: string, errors: FS.FreeSemigroup<DecodeError<E>>) => R
  Wrap: (error: E, errors: FS.FreeSemigroup<DecodeError<E>>) => R
}) => (e: DecodeError<E>) => R
/**
 * @category instances
 * @since 2.2.7
 */
export declare function getSemigroup<E = never>(): Semigroup<FS.FreeSemigroup<DecodeError<E>>>
