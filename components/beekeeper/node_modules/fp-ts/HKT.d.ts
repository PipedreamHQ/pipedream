/**
 * Type defunctionalization (as describe in [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf))
 *
 * @since 2.0.0
 */
/**
 * `* -> *` constructors
 * @since 2.0.0
 */
export interface HKT<URI, A> {
  readonly _URI: URI
  readonly _A: A
}
/**
 * `* -> * -> *` constructors
 * @since 2.0.0
 */
export interface HKT2<URI, E, A> extends HKT<URI, A> {
  readonly _E: E
}
/**
 * `* -> * -> * -> *` constructors
 * @since 2.0.0
 */
export interface HKT3<URI, R, E, A> extends HKT2<URI, E, A> {
  readonly _R: R
}
/**
 * `* -> * -> * -> * -> *` constructors
 * @since 2.0.0
 */
export interface HKT4<URI, S, R, E, A> extends HKT3<URI, R, E, A> {
  readonly _S: S
}
/**
 * `* -> *` constructors
 * @since 2.0.0
 */
export interface URItoKind<A> {}
/**
 * `* -> * -> *` constructors
 * @since 2.0.0
 */
export interface URItoKind2<E, A> {}
/**
 * `* -> * -> * -> *` constructors
 * @since 2.0.0
 */
export interface URItoKind3<R, E, A> {}
/**
 * `* -> * -> * -> * -> *` constructors
 * @since 2.0.0
 */
export interface URItoKind4<S, R, E, A> {}
/**
 * `* -> *` constructors
 * @since 2.0.0
 */
export type URIS = keyof URItoKind<any>
/**
 * `* -> * -> *` constructors
 * @since 2.0.0
 */
export type URIS2 = keyof URItoKind2<any, any>
/**
 * `* -> * -> * -> *` constructors
 * @since 2.0.0
 */
export type URIS3 = keyof URItoKind3<any, any, any>
/**
 * `* -> * -> * -> * -> *` constructors
 * @since 2.0.0
 */
export type URIS4 = keyof URItoKind4<any, any, any, any>
/**
 * `* -> *` constructors
 * @since 2.0.0
 */
export type Kind<URI extends URIS, A> = URI extends URIS ? URItoKind<A>[URI] : any
/**
 * `* -> * -> *` constructors
 * @since 2.0.0
 */
export type Kind2<URI extends URIS2, E, A> = URI extends URIS2 ? URItoKind2<E, A>[URI] : any
/**
 * `* -> * -> * -> *` constructors
 * @since 2.0.0
 */
export type Kind3<URI extends URIS3, R, E, A> = URI extends URIS3 ? URItoKind3<R, E, A>[URI] : any
/**
 * `* -> * -> * -> * -> *` constructors
 * @since 2.0.0
 */
export type Kind4<URI extends URIS4, S, R, E, A> = URI extends URIS4 ? URItoKind4<S, R, E, A>[URI] : any
