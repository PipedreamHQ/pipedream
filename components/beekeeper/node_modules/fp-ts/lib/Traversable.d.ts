/**
 * `Traversable` represents data structures which can be _traversed_ accumulating results and effects in some
 * `Applicative` functor.
 *
 * - `traverse` runs an action for every element in a data structure, and accumulates the results.
 * - `sequence` runs the actions _contained_ in a data structure, and accumulates the results.
 *
 * The `traverse` and `sequence` functions should be compatible in the following sense:
 *
 * - `traverse(A)(xs, f) <-> sequence(A)(A.map(xs, f))`
 * - `sequence(A)(xs) <-> traverse(A)(xs, identity)`
 *
 * where `A` is an `Applicative` instance
 *
 * `Traversable` instances should also be compatible with the corresponding `Foldable` instances, in the following sense:
 *
 * ```ts
 * import { getApplicative, make } from 'fp-ts/Const'
 *
 * const A = getApplicative(M)
 *
 * foldMap(M)(xs, f) = traverse(A)(xs, a => make(f(a)))
 * ```
 *
 * where `M` is a `Monoid` instance
 *
 * @since 2.0.0
 */
import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4
} from './Applicative'
import {
  Foldable,
  Foldable1,
  Foldable2,
  Foldable2C,
  Foldable3,
  FoldableComposition,
  FoldableComposition11
} from './Foldable'
import { Functor, Functor1, Functor2, Functor2C, Functor3, FunctorComposition, FunctorComposition11 } from './Functor'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @category model
 * @since 2.0.0
 */
export interface Traversable<T> extends Functor<T>, Foldable<T> {
  /**
   * Runs an action for every element in a data structure and accumulates the results
   */
  readonly traverse: Traverse<T>
  readonly sequence: Sequence<T>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Traversable1<T extends URIS> extends Functor1<T>, Foldable1<T> {
  readonly traverse: Traverse1<T>
  readonly sequence: Sequence1<T>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Traversable2<T extends URIS2> extends Functor2<T>, Foldable2<T> {
  readonly traverse: Traverse2<T>
  readonly sequence: Sequence2<T>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Traversable2C<T extends URIS2, TL> extends Functor2C<T, TL>, Foldable2C<T, TL> {
  readonly traverse: Traverse2C<T, TL>
  readonly sequence: Sequence2C<T, TL>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Traversable3<T extends URIS3> extends Functor3<T>, Foldable3<T> {
  readonly traverse: Traverse3<T>
  readonly sequence: Sequence3<T>
}
/**
 * @since 2.0.0
 */
export interface Traverse<T> {
  <F extends URIS4>(F: Applicative4<F>): <A, S, R, E, B>(
    ta: HKT<T, A>,
    f: (a: A) => Kind4<F, S, R, E, B>
  ) => Kind4<F, S, R, E, HKT<T, B>>
  <F extends URIS3>(F: Applicative3<F>): <A, R, E, B>(
    ta: HKT<T, A>,
    f: (a: A) => Kind3<F, R, E, B>
  ) => Kind3<F, R, E, HKT<T, B>>
  <F extends URIS3, E>(F: Applicative3C<F, E>): <A, R, B>(
    ta: HKT<T, A>,
    f: (a: A) => Kind3<F, R, E, B>
  ) => Kind3<F, R, E, HKT<T, B>>
  <F extends URIS2>(F: Applicative2<F>): <A, E, B>(ta: HKT<T, A>, f: (a: A) => Kind2<F, E, B>) => Kind2<F, E, HKT<T, B>>
  <F extends URIS2, E>(F: Applicative2C<F, E>): <A, B>(
    ta: HKT<T, A>,
    f: (a: A) => Kind2<F, E, B>
  ) => Kind2<F, E, HKT<T, B>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(ta: HKT<T, A>, f: (a: A) => Kind<F, B>) => Kind<F, HKT<T, B>>
  <F>(F: Applicative<F>): <A, B>(ta: HKT<T, A>, f: (a: A) => HKT<F, B>) => HKT<F, HKT<T, B>>
}
/**
 * @since 2.0.0
 */
export interface Traverse1<T extends URIS> {
  <F extends URIS4>(F: Applicative4<F>): <A, S, R, E, B>(
    ta: Kind<T, A>,
    f: (a: A) => Kind4<F, S, R, E, B>
  ) => Kind4<F, S, R, E, Kind<T, B>>
  <F extends URIS3>(F: Applicative3<F>): <A, R, E, B>(
    ta: Kind<T, A>,
    f: (a: A) => Kind3<F, R, E, B>
  ) => Kind3<F, R, E, Kind<T, B>>
  <F extends URIS3, E>(F: Applicative3C<F, E>): <A, R, B>(
    ta: Kind<T, A>,
    f: (a: A) => Kind3<F, R, E, B>
  ) => Kind3<F, R, E, Kind<T, B>>
  <F extends URIS2>(F: Applicative2<F>): <A, E, B>(
    ta: Kind<T, A>,
    f: (a: A) => Kind2<F, E, B>
  ) => Kind2<F, E, Kind<T, B>>
  <F extends URIS2, E>(F: Applicative2C<F, E>): <A, B>(
    ta: Kind<T, A>,
    f: (a: A) => Kind2<F, E, B>
  ) => Kind2<F, E, Kind<T, B>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(ta: Kind<T, A>, f: (a: A) => Kind<F, B>) => Kind<F, Kind<T, B>>
  <F>(F: Applicative<F>): <A, B>(ta: Kind<T, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind<T, B>>
}
/**
 * @since 2.0.0
 */
export interface Traverse2<T extends URIS2> {
  <F extends URIS4>(F: Applicative4<F>): <TE, A, S, R, FE, B>(
    ta: Kind2<T, TE, A>,
    f: (a: A) => Kind4<F, S, R, FE, B>
  ) => Kind4<F, S, R, FE, Kind2<T, TE, B>>
  <F extends URIS3>(F: Applicative3<F>): <TE, A, R, FE, B>(
    ta: Kind2<T, TE, A>,
    f: (a: A) => Kind3<F, R, FE, B>
  ) => Kind3<F, R, FE, Kind2<T, TE, B>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <TE, A, R, B>(
    ta: Kind2<T, TE, A>,
    f: (a: A) => Kind3<F, R, FE, B>
  ) => Kind3<F, R, FE, Kind2<T, TE, B>>
  <F extends URIS2>(F: Applicative2<F>): <TE, A, FE, B>(
    ta: Kind2<T, TE, A>,
    f: (a: A) => Kind2<F, FE, B>
  ) => Kind2<F, FE, Kind2<T, TE, B>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <TE, A, B>(
    ta: Kind2<T, TE, A>,
    f: (a: A) => Kind2<F, FE, B>
  ) => Kind2<F, FE, Kind2<T, TE, B>>
  <F extends URIS>(F: Applicative1<F>): <E, A, B>(
    ta: Kind2<T, E, A>,
    f: (a: A) => Kind<F, B>
  ) => Kind<F, Kind2<T, E, B>>
  <F>(F: Applicative<F>): <E, A, B>(ta: Kind2<T, E, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind2<T, E, B>>
}
/**
 * @since 2.0.0
 */
export interface Traverse2C<T extends URIS2, E> {
  <F extends URIS4>(F: Applicative4<F>): <A, S, R, FE, B>(
    ta: Kind2<T, E, A>,
    f: (a: A) => Kind4<F, S, R, FE, B>
  ) => Kind4<F, S, R, FE, Kind2<T, E, B>>
  <F extends URIS3>(F: Applicative3<F>): <A, R, FE, B>(
    ta: Kind2<T, E, A>,
    f: (a: A) => Kind3<F, R, FE, B>
  ) => Kind3<F, R, FE, Kind2<T, E, B>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <A, R, B>(
    ta: Kind2<T, E, A>,
    f: (a: A) => Kind3<F, R, FE, B>
  ) => Kind3<F, R, FE, Kind2<T, E, B>>
  <F extends URIS2>(F: Applicative2<F>): <A, FE, B>(
    ta: Kind2<T, E, A>,
    f: (a: A) => Kind2<F, FE, B>
  ) => Kind2<F, FE, Kind2<T, E, B>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A, B>(
    ta: Kind2<T, E, A>,
    f: (a: A) => Kind2<F, FE, B>
  ) => Kind2<F, FE, Kind2<T, E, B>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(ta: Kind2<T, E, A>, f: (a: A) => Kind<F, B>) => Kind<F, Kind2<T, E, B>>
  <F>(F: Applicative<F>): <A, B>(ta: Kind2<T, E, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind2<T, E, B>>
}
/**
 * @since 2.0.0
 */
export interface Traverse3<T extends URIS3> {
  <F extends URIS4>(F: Applicative4<F>): <TR, TE, A, S, FR, FE, B>(
    ta: Kind3<T, TR, TE, A>,
    f: (a: A) => Kind4<F, S, FR, FE, B>
  ) => Kind4<F, S, FR, FE, Kind3<T, TR, TE, B>>
  <F extends URIS3>(F: Applicative3<F>): <TR, TE, A, FR, FE, B>(
    ta: Kind3<T, TR, TE, A>,
    f: (a: A) => Kind3<F, FR, FE, B>
  ) => Kind3<F, FR, FE, Kind3<T, TR, TE, B>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <TR, TE, A, FR, B>(
    ta: Kind3<T, TR, TE, A>,
    f: (a: A) => Kind3<F, FR, FE, B>
  ) => Kind3<F, FR, FE, Kind3<T, TR, TE, B>>
  <F extends URIS2>(F: Applicative2<F>): <TR, A, TE, FE, B>(
    ta: Kind3<T, TR, TE, A>,
    f: (a: A) => Kind2<F, FE, B>
  ) => Kind2<F, FE, Kind3<T, TR, TE, B>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <R, TE, A, B>(
    ta: Kind3<T, R, TE, A>,
    f: (a: A) => Kind2<F, FE, B>
  ) => Kind2<F, FE, Kind3<T, R, TE, B>>
  <F extends URIS>(F: Applicative1<F>): <R, E, A, B>(
    ta: Kind3<T, R, E, A>,
    f: (a: A) => Kind<F, B>
  ) => Kind<F, Kind3<T, R, E, B>>
  <F>(F: Applicative<F>): <R, E, A, B>(ta: Kind3<T, R, E, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind3<T, R, E, B>>
}
/**
 * @since 2.0.0
 */
export interface Sequence<T> {
  <F extends URIS4>(F: Applicative4<F>): <S, R, E, A>(ta: HKT<T, Kind4<F, S, R, E, A>>) => Kind4<F, S, R, E, HKT<T, A>>
  <F extends URIS3>(F: Applicative3<F>): <R, E, A>(ta: HKT<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, HKT<T, A>>
  <F extends URIS3, E>(F: Applicative3C<F, E>): <R, A>(ta: HKT<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, HKT<T, A>>
  <F extends URIS2>(F: Applicative2<F>): <E, A>(ta: HKT<T, Kind2<F, E, A>>) => Kind2<F, E, HKT<T, A>>
  <F extends URIS2, E>(F: Applicative2C<F, E>): <A>(ta: HKT<T, Kind2<F, E, A>>) => Kind2<F, E, HKT<T, A>>
  <F extends URIS>(F: Applicative1<F>): <A>(ta: HKT<T, Kind<F, A>>) => Kind<F, HKT<T, A>>
  <F>(F: Applicative<F>): <A>(ta: HKT<T, HKT<F, A>>) => HKT<F, HKT<T, A>>
}
/**
 * @since 2.0.0
 */
export interface Sequence1<T extends URIS> {
  <F extends URIS4>(F: Applicative4<F>): <S, R, E, A>(
    ta: Kind<T, Kind4<F, S, R, E, A>>
  ) => Kind4<F, S, R, E, Kind<T, A>>
  <F extends URIS3>(F: Applicative3<F>): <R, E, A>(ta: Kind<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, Kind<T, A>>
  <F extends URIS3, E>(F: Applicative3C<F, E>): <R, A>(ta: Kind<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, Kind<T, A>>
  <F extends URIS2>(F: Applicative2<F>): <E, A>(ta: Kind<T, Kind2<F, E, A>>) => Kind2<F, E, Kind<T, A>>
  <F extends URIS2, E>(F: Applicative2C<F, E>): <A>(ta: Kind<T, Kind2<F, E, A>>) => Kind2<F, E, Kind<T, A>>
  <F extends URIS>(F: Applicative1<F>): <A>(ta: Kind<T, Kind<F, A>>) => Kind<F, Kind<T, A>>
  <F>(F: Applicative<F>): <A>(ta: Kind<T, HKT<F, A>>) => HKT<F, Kind<T, A>>
}
/**
 * @since 2.0.0
 */
export interface Sequence2<T extends URIS2> {
  <F extends URIS4>(F: Applicative4<F>): <TE, S, R, FE, A>(
    ta: Kind2<T, TE, Kind4<F, S, R, FE, A>>
  ) => Kind4<F, S, R, FE, Kind2<T, TE, A>>
  <F extends URIS3>(F: Applicative3<F>): <TE, R, FE, A>(
    ta: Kind2<T, TE, Kind3<F, R, FE, A>>
  ) => Kind3<F, R, FE, Kind2<T, TE, A>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <TE, R, A>(
    ta: Kind2<T, TE, Kind3<F, R, FE, A>>
  ) => Kind3<F, R, FE, Kind2<T, TE, A>>
  <F extends URIS2>(F: Applicative2<F>): <TE, FE, A>(ta: Kind2<T, TE, Kind2<F, FE, A>>) => Kind2<F, FE, Kind2<T, TE, A>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <TE, A>(
    ta: Kind2<T, TE, Kind2<F, FE, A>>
  ) => Kind2<F, FE, Kind2<T, TE, A>>
  <F extends URIS>(F: Applicative1<F>): <E, A>(ta: Kind2<T, E, Kind<F, A>>) => Kind<F, Kind2<T, E, A>>
  <F>(F: Applicative<F>): <E, A>(ta: Kind2<T, E, HKT<F, A>>) => HKT<F, Kind2<T, E, A>>
}
/**
 * @since 2.0.0
 */
export interface Sequence2C<T extends URIS2, E> {
  <F extends URIS4>(F: Applicative4<F>): <S, R, FE, A>(
    ta: Kind2<T, E, Kind4<F, S, R, FE, A>>
  ) => Kind4<F, S, R, FE, Kind2<T, E, A>>
  <F extends URIS3>(F: Applicative3<F>): <R, FE, A>(
    ta: Kind2<T, E, Kind3<F, R, FE, A>>
  ) => Kind3<F, R, FE, Kind2<T, E, A>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <R, A>(
    ta: Kind2<T, E, Kind3<F, R, FE, A>>
  ) => Kind3<F, R, FE, Kind2<T, E, A>>
  <F extends URIS2>(F: Applicative2<F>): <FE, A>(ta: Kind2<T, E, Kind2<F, FE, A>>) => Kind2<F, FE, Kind2<T, E, A>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A>(ta: Kind2<T, E, Kind2<F, FE, A>>) => Kind2<F, FE, Kind2<T, E, A>>
  <F extends URIS>(F: Applicative1<F>): <A>(ta: Kind2<T, E, Kind<F, A>>) => Kind<F, Kind2<T, E, A>>
  <F>(F: Applicative<F>): <A>(ta: Kind2<T, E, HKT<F, A>>) => HKT<F, Kind2<T, E, A>>
}
/**
 * @since 2.0.0
 */
export interface Sequence3<T extends URIS3> {
  <F extends URIS4>(F: Applicative4<F>): <TR, TE, S, FR, FE, A>(
    ta: Kind3<T, TR, TE, Kind4<F, S, FR, FE, A>>
  ) => Kind4<F, S, FR, FE, Kind3<T, TR, TE, A>>
  <F extends URIS3>(F: Applicative3<F>): <TR, TE, FR, FE, A>(
    ta: Kind3<T, TR, TE, Kind3<F, FR, FE, A>>
  ) => Kind3<F, FR, FE, Kind3<T, TR, TE, A>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <TR, TE, FR, A>(
    ta: Kind3<T, TR, TE, Kind3<F, FR, FE, A>>
  ) => Kind3<F, FR, FE, Kind3<T, TR, TE, A>>
  <F extends URIS2>(F: Applicative2<F>): <R, TE, FE, A>(
    ta: Kind3<T, R, TE, Kind2<F, FE, A>>
  ) => Kind2<F, FE, Kind3<T, R, TE, A>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <R, TE, A>(
    ta: Kind3<T, R, TE, Kind2<F, FE, A>>
  ) => Kind2<F, FE, Kind3<T, R, TE, A>>
  <F extends URIS>(F: Applicative1<F>): <R, E, A>(ta: Kind3<T, R, E, Kind<F, A>>) => Kind<F, Kind3<T, R, E, A>>
  <F>(F: Applicative<F>): <R, E, A>(ta: Kind3<T, R, E, HKT<F, A>>) => HKT<F, Kind3<T, R, E, A>>
}
/**
 * `traverse` composition.
 *
 * @since 2.10.0
 */
export declare function traverse<T extends URIS, G extends URIS2>(
  T: Traversable1<T>,
  G: Traversable2<G>
): {
  <F extends URIS4>(F: Applicative4<F>): <A, S, R, FE, B>(
    f: (a: A) => Kind4<F, S, R, FE, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => Kind4<F, S, R, FE, Kind<T, Kind2<G, GE, B>>>
  <F extends URIS3>(F: Applicative3<F>): <A, R, FE, B>(
    f: (a: A) => Kind3<F, R, FE, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => Kind3<F, R, FE, Kind<T, Kind2<G, GE, B>>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <A, R, B>(
    f: (a: A) => Kind3<F, R, FE, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => Kind3<F, R, FE, Kind<T, Kind2<G, GE, B>>>
  <F extends URIS2>(F: Applicative2<F>): <A, FE, B>(
    f: (a: A) => Kind2<F, FE, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => Kind2<F, FE, Kind<T, Kind2<G, GE, B>>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A, B>(
    f: (a: A) => Kind2<F, FE, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => Kind2<F, FE, Kind<T, Kind2<G, GE, B>>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(
    f: (a: A) => Kind<F, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => Kind<F, Kind<T, Kind2<G, GE, B>>>
  <F>(F: Applicative<F>): <A, B>(
    f: (a: A) => HKT<F, B>
  ) => <GE>(tga: Kind<T, Kind2<G, GE, A>>) => HKT<F, Kind<T, Kind2<G, GE, B>>>
}
export declare function traverse<T extends URIS, G extends URIS>(
  T: Traversable1<T>,
  G: Traversable1<G>
): {
  <F extends URIS4>(F: Applicative4<F>): <A, S, R, E, B>(
    f: (a: A) => Kind4<F, S, R, E, B>
  ) => (tga: Kind<T, Kind<G, A>>) => Kind4<F, S, R, E, Kind<T, Kind<G, B>>>
  <F extends URIS3>(F: Applicative3<F>): <A, R, E, B>(
    f: (a: A) => Kind3<F, R, E, B>
  ) => (tga: Kind<T, Kind<G, A>>) => Kind3<F, R, E, Kind<T, Kind<G, B>>>
  <F extends URIS3, E>(F: Applicative3C<F, E>): <A, R, B>(
    f: (a: A) => Kind3<F, R, E, B>
  ) => (tga: Kind<T, Kind<G, A>>) => Kind3<F, R, E, Kind<T, Kind<G, B>>>
  <F extends URIS2>(F: Applicative2<F>): <A, E, B>(
    f: (a: A) => Kind2<F, E, B>
  ) => (tga: Kind<T, Kind<G, A>>) => Kind2<F, E, Kind<T, Kind<G, B>>>
  <F extends URIS2, E>(F: Applicative2C<F, E>): <A, B>(
    f: (a: A) => Kind2<F, E, B>
  ) => (tga: Kind<T, Kind<G, A>>) => Kind2<F, E, Kind<T, Kind<G, B>>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(
    f: (a: A) => Kind<F, B>
  ) => (tga: Kind<T, Kind<G, A>>) => Kind<F, Kind<T, Kind<G, B>>>
  <F>(F: Applicative<F>): <A, B>(f: (a: A) => HKT<F, B>) => (tga: Kind<T, Kind<G, A>>) => HKT<F, Kind<T, Kind<G, B>>>
}
export declare function traverse<T, G>(
  T: Traversable<T>,
  G: Traversable<G>
): <F>(F: Applicative<F>) => <A, B>(f: (a: A) => HKT<F, B>) => (tga: HKT<T, HKT<G, A>>) => HKT<F, HKT<T, HKT<G, B>>>
/**
 * `sequence` composition.
 *
 * @since 2.10.0
 */
export declare function sequence<T extends URIS, G extends URIS2>(
  T: Traversable1<T>,
  G: Traversable2<G>
): {
  <F extends URIS4>(F: Applicative4<F>): <GE, S, R, FE, A>(
    tgfa: Kind<T, Kind2<G, GE, Kind4<F, S, R, FE, A>>>
  ) => Kind4<F, S, R, FE, Kind<T, Kind2<G, GE, A>>>
  <F extends URIS3>(F: Applicative3<F>): <GE, R, FE, A>(
    tgfa: Kind<T, Kind2<G, GE, Kind3<F, R, FE, A>>>
  ) => Kind3<F, R, FE, Kind<T, Kind2<G, GE, A>>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <GE, R, A>(
    tgfa: Kind<T, Kind2<G, GE, Kind3<F, R, FE, A>>>
  ) => Kind3<F, R, FE, Kind<T, Kind2<G, GE, A>>>
  <F extends URIS2>(F: Applicative2<F>): <GE, FE, A>(
    tgfa: Kind<T, Kind2<G, GE, Kind2<F, FE, A>>>
  ) => Kind2<F, FE, Kind<T, Kind2<G, GE, A>>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <GE, A>(
    tgfa: Kind<T, Kind2<G, GE, Kind2<F, FE, A>>>
  ) => Kind2<F, FE, Kind<T, Kind2<G, GE, A>>>
  <F extends URIS>(F: Applicative1<F>): <GE, A>(
    tgfa: Kind<T, Kind2<G, GE, Kind<F, A>>>
  ) => Kind<F, Kind<T, Kind2<G, GE, A>>>
  <F>(F: Applicative<F>): <A>(tgfa: HKT<T, HKT<G, HKT<F, A>>>) => HKT<F, HKT<T, HKT<G, A>>>
}
export declare function sequence<T extends URIS, G extends URIS>(
  T: Traversable1<T>,
  G: Traversable1<G>
): {
  <F extends URIS4>(F: Applicative4<F>): <S, R, E, A>(
    tgfa: Kind<T, Kind<G, Kind4<F, S, R, E, A>>>
  ) => Kind4<F, S, R, E, Kind<T, Kind<G, A>>>
  <F extends URIS3>(F: Applicative3<F>): <R, E, A>(
    tgfa: Kind<T, Kind<G, Kind3<F, R, E, A>>>
  ) => Kind3<F, R, E, Kind<T, Kind<G, A>>>
  <F extends URIS3, E>(F: Applicative3C<F, E>): <R, A>(
    tgfa: Kind<T, Kind<G, Kind3<F, R, E, A>>>
  ) => Kind3<F, R, E, Kind<T, Kind<G, A>>>
  <F extends URIS2>(F: Applicative2<F>): <E, A>(
    tgfa: Kind<T, Kind<G, Kind2<F, E, A>>>
  ) => Kind2<F, E, Kind<T, Kind<G, A>>>
  <F extends URIS2, E>(F: Applicative2C<F, E>): <A>(
    tgfa: Kind<T, Kind<G, Kind2<F, E, A>>>
  ) => Kind2<F, E, Kind<T, Kind<G, A>>>
  <F extends URIS>(F: Applicative1<F>): <A>(tgfa: Kind<T, Kind<G, Kind<F, A>>>) => Kind<F, Kind<T, Kind<G, A>>>
  <F>(F: Applicative<F>): <A>(tgfa: HKT<T, HKT<G, HKT<F, A>>>) => HKT<F, HKT<T, HKT<G, A>>>
}
export declare function sequence<T, G>(
  T: Traversable<T>,
  G: Traversable<G>
): <F>(F: Applicative<F>) => <A>(tgfa: HKT<T, HKT<G, HKT<F, A>>>) => HKT<F, HKT<T, HKT<G, A>>>
/**
 * @since 2.6.3
 */
export interface PipeableTraverse1<T extends URIS> {
  <F extends URIS3>(F: Applicative3<F>): <A, FR, FE, B>(
    f: (a: A) => Kind3<F, FR, FE, B>
  ) => (ta: Kind<T, A>) => Kind3<F, FR, FE, Kind<T, B>>
  <F extends URIS3, FE>(F: Applicative3C<F, FE>): <A, FR, B>(
    f: (a: A) => Kind3<F, FR, FE, B>
  ) => (ta: Kind<T, A>) => Kind3<F, FR, FE, Kind<T, B>>
  <F extends URIS2>(F: Applicative2<F>): <A, FE, B>(
    f: (a: A) => Kind2<F, FE, B>
  ) => (ta: Kind<T, A>) => Kind2<F, FE, Kind<T, B>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A, B>(
    f: (a: A) => Kind2<F, FE, B>
  ) => (ta: Kind<T, A>) => Kind2<F, FE, Kind<T, B>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(f: (a: A) => Kind<F, B>) => (ta: Kind<T, A>) => Kind<F, Kind<T, B>>
  <F>(F: Applicative<F>): <A, B>(f: (a: A) => HKT<F, B>) => (ta: Kind<T, A>) => HKT<F, Kind<T, B>>
}
/**
 * @since 2.6.3
 */
export interface PipeableTraverse2<T extends URIS2> {
  <F extends URIS3>(F: Applicative3<F>): <A, FR, FE, B>(
    f: (a: A) => Kind3<F, FR, FE, B>
  ) => <TE>(ta: Kind2<T, TE, A>) => Kind3<F, FR, FE, Kind2<T, TE, B>>
  <F extends URIS2>(F: Applicative2<F>): <A, FE, B>(
    f: (a: A) => Kind2<F, FE, B>
  ) => <TE>(ta: Kind2<T, TE, A>) => Kind2<F, FE, Kind2<T, TE, B>>
  <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A, B>(
    f: (a: A) => Kind2<F, FE, B>
  ) => <TE>(ta: Kind2<T, TE, A>) => Kind2<F, FE, Kind2<T, TE, B>>
  <F extends URIS>(F: Applicative1<F>): <A, B>(
    f: (a: A) => Kind<F, B>
  ) => <TE>(ta: Kind2<T, TE, A>) => Kind<F, Kind2<T, TE, B>>
  <F>(F: Applicative<F>): <A, B>(f: (a: A) => HKT<F, B>) => <TE>(ta: Kind2<T, TE, A>) => HKT<F, Kind2<T, TE, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface TraversableComposition<F, G> extends FoldableComposition<F, G>, FunctorComposition<F, G> {
  readonly traverse: <H>(
    H: Applicative<H>
  ) => <A, B>(fga: HKT<F, HKT<G, A>>, f: (a: A) => HKT<H, B>) => HKT<H, HKT<F, HKT<G, B>>>
  readonly sequence: <H>(H: Applicative<H>) => <A>(fga: HKT<F, HKT<G, HKT<H, A>>>) => HKT<H, HKT<F, HKT<G, A>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface TraverseComposition11<F extends URIS, G extends URIS> {
  <H extends URIS3>(H: Applicative3<H>): <R, E, A, B>(
    fga: Kind<F, Kind<G, A>>,
    f: (a: A) => Kind3<H, R, E, B>
  ) => Kind3<H, R, E, Kind<F, Kind<G, B>>>
  <H extends URIS2>(H: Applicative2<H>): <E, A, B>(
    fga: Kind<F, Kind<G, A>>,
    f: (a: A) => Kind2<H, E, B>
  ) => Kind2<H, E, Kind<F, Kind<G, B>>>
  <H extends URIS2, E>(H: Applicative2C<H, E>): <A, B>(
    fga: Kind<F, Kind<G, A>>,
    f: (a: A) => Kind2<H, E, B>
  ) => Kind2<H, E, Kind<F, Kind<G, B>>>
  <H extends URIS>(H: Applicative1<H>): <A, B>(
    fga: Kind<F, Kind<G, A>>,
    f: (a: A) => Kind<H, B>
  ) => Kind<H, Kind<F, Kind<G, B>>>
  <H>(H: Applicative<H>): <A, B>(fga: Kind<F, Kind<G, A>>, f: (a: A) => HKT<H, B>) => HKT<H, Kind<F, Kind<G, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface SequenceComposition11<F extends URIS, G extends URIS> {
  <H extends URIS3>(H: Applicative3<H>): <R, E, A>(
    fga: Kind<F, Kind<G, Kind3<H, R, E, A>>>
  ) => Kind3<H, R, E, Kind<F, Kind<G, A>>>
  <H extends URIS2>(H: Applicative2<H>): <E, A>(
    fga: Kind<F, Kind<G, Kind2<H, E, A>>>
  ) => Kind2<H, E, Kind<F, Kind<G, A>>>
  <H extends URIS2, E>(H: Applicative2C<H, E>): <A>(
    fga: Kind<F, Kind<G, Kind2<H, E, A>>>
  ) => Kind2<H, E, Kind<F, Kind<G, A>>>
  <H extends URIS>(H: Applicative1<H>): <A>(fga: Kind<F, Kind<G, Kind<H, A>>>) => Kind<H, Kind<F, Kind<G, A>>>
  <H>(H: Applicative<H>): <A>(fga: Kind<F, Kind<G, HKT<H, A>>>) => HKT<H, Kind<F, Kind<G, A>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface TraversableComposition11<F extends URIS, G extends URIS>
  extends FoldableComposition11<F, G>,
    FunctorComposition11<F, G> {
  readonly traverse: TraverseComposition11<F, G>
  readonly sequence: SequenceComposition11<F, G>
}
/**
 * Use
 * - [`traverse`](#traverse)
 * - [`sequence`](#sequence)
 *
 * instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function getTraversableComposition<F extends URIS, G extends URIS>(
  F: Traversable1<F>,
  G: Traversable1<G>
): TraversableComposition11<F, G>
/** @deprecated */
export declare function getTraversableComposition<F, G>(
  F: Traversable<F>,
  G: Traversable<G>
): TraversableComposition<F, G>
