/**
 * A type for natural transformations.
 *
 * A natural transformation is a mapping between type constructors of kind `* -> *` where the mapping
 * operation has no ability to manipulate the inner values.
 *
 * The definition of a natural transformation in category theory states that `F` and `G` should be functors,
 * but the `Functor` constraint is not enforced here; that the types are of kind `* -> *` is enough for our purposes.
 *
 * @since 2.11.0
 */
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @since 2.11.0
 */
export interface NaturalTransformation<F, G> {
  <A>(fa: HKT<F, A>): HKT<G, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation11<F extends URIS, G extends URIS> {
  <A>(fa: Kind<F, A>): Kind<G, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation12<F extends URIS, G extends URIS2> {
  <A, E>(fa: Kind<F, A>): Kind2<G, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation12C<F extends URIS, G extends URIS2, E> {
  <A>(fa: Kind<F, A>): Kind2<G, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation13<F extends URIS, G extends URIS3> {
  <A, R, E>(fa: Kind<F, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation13C<F extends URIS, G extends URIS3, E> {
  <A, R>(fa: Kind<F, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation14<F extends URIS, G extends URIS4> {
  <A, S, R, E>(fa: Kind<F, A>): Kind4<G, S, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation14C<F extends URIS, G extends URIS4, E> {
  <A, S, R>(fa: Kind<F, A>): Kind4<G, S, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation21<F extends URIS2, G extends URIS> {
  <A>(fa: Kind2<F, unknown, A>): Kind<G, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation22<F extends URIS2, G extends URIS2> {
  <E, A>(fa: Kind2<F, E, A>): Kind2<G, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation22C<F extends URIS2, G extends URIS2, E> {
  <A>(fa: Kind2<F, E, A>): Kind2<G, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation23<F extends URIS2, G extends URIS3> {
  <E, A, R>(fa: Kind2<F, E, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation23C<F extends URIS2, G extends URIS3, E> {
  <A, R>(fa: Kind2<F, E, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation24<F extends URIS2, G extends URIS4> {
  <E, A, S, R>(fa: Kind2<F, E, A>): Kind4<G, S, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation23R<F extends URIS2, G extends URIS3> {
  <R, A, E>(fa: Kind2<F, R, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation23RC<F extends URIS2, G extends URIS3, E> {
  <R, A>(fa: Kind2<F, R, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation24R<F extends URIS2, G extends URIS4> {
  <R, A, S, E>(fa: Kind2<F, R, A>): Kind4<G, S, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation24S<F extends URIS2, G extends URIS4> {
  <S, A, R, E>(fa: Kind2<F, S, A>): Kind4<G, S, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation33<F extends URIS3, G extends URIS3> {
  <R, E, A>(fa: Kind3<F, R, E, A>): Kind3<G, R, E, A>
}
/**
 * @since 2.11.0
 */
export interface NaturalTransformation34<F extends URIS3, G extends URIS4> {
  <R, E, A, S>(fa: Kind3<F, R, E, A>): Kind4<G, S, R, E, A>
}
