/**
 * `Compactable` represents data structures which can be _compacted_/_filtered_. This is a generalization of
 * `catOptions` as a new function `compact`. `compact` has relations with `Functor`, `Applicative`,
 * `Monad`, `Alternative`, and `Traversable` in that we can use these classes to provide the ability to
 * operate on a data type by eliminating intermediate `None`s. This is useful for representing the filtering out of
 * values, or failure.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Compactable.purs
 *
 * @since 2.0.0
 */
import { Either } from './Either'
import {
  Functor,
  Functor1,
  Functor2,
  Functor2C,
  Functor3C,
  FunctorComposition,
  FunctorComposition2C1,
  FunctorComposition11,
  FunctorComposition12,
  FunctorComposition12C,
  FunctorComposition21,
  FunctorComposition22,
  FunctorComposition22C,
  FunctorComposition23,
  FunctorComposition23C
} from './Functor'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Option } from './Option'
import * as S from './Separated'
/**
 * @category model
 * @since 2.0.0
 */
export interface Compactable<F> {
  readonly URI: F
  /**
   * Compacts a data structure unwrapping inner Option
   */
  readonly compact: <A>(fa: HKT<F, Option<A>>) => HKT<F, A>
  /**
   * Separates a data structure moving inner Left to the left side and inner Right to the right side of Separated
   */
  readonly separate: <A, B>(fa: HKT<F, Either<A, B>>) => S.Separated<HKT<F, A>, HKT<F, B>>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Compactable1<F extends URIS> {
  readonly URI: F
  readonly compact: <A>(fa: Kind<F, Option<A>>) => Kind<F, A>
  readonly separate: <A, B>(fa: Kind<F, Either<A, B>>) => S.Separated<Kind<F, A>, Kind<F, B>>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Compactable2<F extends URIS2> {
  readonly URI: F
  readonly compact: <E, A>(fa: Kind2<F, E, Option<A>>) => Kind2<F, E, A>
  readonly separate: <E, A, B>(fa: Kind2<F, E, Either<A, B>>) => S.Separated<Kind2<F, E, A>, Kind2<F, E, B>>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Compactable2C<F extends URIS2, E> {
  readonly URI: F
  readonly _E: E
  readonly compact: <A>(fa: Kind2<F, E, Option<A>>) => Kind2<F, E, A>
  readonly separate: <A, B>(fa: Kind2<F, E, Either<A, B>>) => S.Separated<Kind2<F, E, A>, Kind2<F, E, B>>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Compactable3<F extends URIS3> {
  readonly URI: F
  readonly compact: <R, E, A>(fa: Kind3<F, R, E, Option<A>>) => Kind3<F, R, E, A>
  readonly separate: <R, E, A, B>(fa: Kind3<F, R, E, Either<A, B>>) => S.Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
}
/**
 * @category model
 * @since 2.2.0
 */
export interface Compactable3C<F extends URIS3, E> {
  readonly URI: F
  readonly _E: E
  readonly compact: <R, A>(fa: Kind3<F, R, E, Option<A>>) => Kind3<F, R, E, A>
  readonly separate: <R, A, B>(fa: Kind3<F, R, E, Either<A, B>>) => S.Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
}
/**
 * @category model
 * @since 2.0.0
 */
export interface Compactable4<F extends URIS4> {
  readonly URI: F
  readonly compact: <S, R, E, A>(fa: Kind4<F, S, R, E, Option<A>>) => Kind4<F, S, R, E, A>
  readonly separate: <S, R, E, A, B>(
    fa: Kind4<F, S, R, E, Either<A, B>>
  ) => S.Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, B>>
}
/**
 * `compact` composition.
 *
 * @since 2.10.0
 */
export declare function compact<F extends URIS2, G extends URIS2, E>(
  F: Functor2<F>,
  G: Compactable2C<G, E>
): <FE, A>(fa: Kind2<F, FE, Kind2<G, E, Option<A>>>) => Kind2<F, FE, Kind2<G, E, A>>
export declare function compact<F extends URIS, G extends URIS2, E>(
  F: Functor1<F>,
  G: Compactable2C<G, E>
): <A>(fa: Kind<F, Kind2<G, E, Option<A>>>) => Kind<F, Kind2<G, E, A>>
export declare function compact<F extends URIS, G extends URIS>(
  F: Functor1<F>,
  G: Compactable1<G>
): <A>(fa: Kind<F, Kind<G, Option<A>>>) => Kind<F, Kind<G, A>>
export declare function compact<F, G>(
  F: Functor<F>,
  G: Compactable<G>
): <A>(fa: HKT<F, HKT<G, Option<A>>>) => HKT<F, HKT<G, A>>
/**
 * `separate` composition.
 *
 * @since 2.10.0
 */
export declare function separate<F extends URIS2, G extends URIS2, E>(
  F: Functor2<F>,
  C: Compactable2C<G, E>,
  G: Functor2<G>
): <FE, A, B>(
  fge: Kind2<F, FE, Kind2<G, E, Either<A, B>>>
) => S.Separated<Kind2<F, FE, Kind2<G, E, A>>, Kind2<F, FE, Kind2<G, E, B>>>
export declare function separate<F extends URIS, G extends URIS2, E>(
  F: Functor1<F>,
  C: Compactable2C<G, E>,
  G: Functor2<G>
): <A, B>(fge: Kind<F, Kind2<G, E, Either<A, B>>>) => S.Separated<Kind<F, Kind2<G, E, A>>, Kind<F, Kind2<G, E, B>>>
export declare function separate<F extends URIS, G extends URIS>(
  F: Functor1<F>,
  C: Compactable1<G>,
  G: Functor1<G>
): <A, B>(fge: Kind<F, Kind<G, Either<A, B>>>) => S.Separated<Kind<F, Kind<G, A>>, Kind<F, Kind<G, B>>>
export declare function separate<F, G>(
  F: Functor<F>,
  C: Compactable<G>,
  G: Functor<G>
): <A, B>(fge: HKT<F, HKT<G, Either<A, B>>>) => S.Separated<HKT<F, HKT<G, A>>, HKT<F, HKT<G, B>>>
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition<F, G> extends FunctorComposition<F, G> {
  readonly compact: <A>(fga: HKT<F, HKT<G, Option<A>>>) => HKT<F, HKT<G, A>>
  readonly separate: <A, B>(fge: HKT<F, HKT<G, Either<A, B>>>) => Separated<HKT<F, HKT<G, A>>, HKT<F, HKT<G, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition11<F extends URIS, G extends URIS> extends FunctorComposition11<F, G> {
  readonly compact: <A>(fga: Kind<F, Kind<G, Option<A>>>) => Kind<F, Kind<G, A>>
  readonly separate: <A, B>(fge: Kind<F, Kind<G, Either<A, B>>>) => Separated<Kind<F, Kind<G, A>>, Kind<F, Kind<G, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition12<F extends URIS, G extends URIS2> extends FunctorComposition12<F, G> {
  readonly compact: <E, A>(fga: Kind<F, Kind2<G, E, Option<A>>>) => Kind<F, Kind2<G, E, A>>
  readonly separate: <E, A, B>(
    fge: Kind<F, Kind2<G, E, Either<A, B>>>
  ) => Separated<Kind<F, Kind2<G, E, A>>, Kind<F, Kind2<G, E, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition12C<F extends URIS, G extends URIS2, E> extends FunctorComposition12C<F, G, E> {
  readonly compact: <A>(fga: Kind<F, Kind2<G, E, Option<A>>>) => Kind<F, Kind2<G, E, A>>
  readonly separate: <A, B>(
    fge: Kind<F, Kind2<G, E, Either<A, B>>>
  ) => Separated<Kind<F, Kind2<G, E, A>>, Kind<F, Kind2<G, E, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition21<F extends URIS2, G extends URIS> extends FunctorComposition21<F, G> {
  readonly compact: <FE, A>(fga: Kind2<F, FE, Kind<G, Option<A>>>) => Kind2<F, FE, Kind<G, A>>
  readonly separate: <FE, A, B>(
    fge: Kind2<F, FE, Kind<G, Either<A, B>>>
  ) => Separated<Kind2<F, FE, Kind<G, A>>, Kind2<F, FE, Kind<G, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition2C1<F extends URIS2, G extends URIS, E> extends FunctorComposition2C1<F, G, E> {
  readonly compact: <A>(fga: Kind2<F, E, Kind<G, Option<A>>>) => Kind2<F, E, Kind<G, A>>
  readonly separate: <A, B>(
    fge: Kind2<F, E, Kind<G, Either<A, B>>>
  ) => Separated<Kind2<F, E, Kind<G, A>>, Kind2<F, E, Kind<G, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition22<F extends URIS2, G extends URIS2> extends FunctorComposition22<F, G> {
  readonly compact: <FE, GE, A>(fga: Kind2<F, FE, Kind2<G, GE, Option<A>>>) => Kind2<F, FE, Kind2<G, GE, A>>
  readonly separate: <FE, GE, A, B>(
    fge: Kind2<F, FE, Kind2<G, GE, Either<A, B>>>
  ) => Separated<Kind2<F, FE, Kind2<G, GE, A>>, Kind2<F, FE, Kind2<G, GE, B>>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface CompactableComposition22C<F extends URIS2, G extends URIS2, E> extends FunctorComposition22C<F, G, E> {
  readonly compact: <FE, A>(fga: Kind2<F, FE, Kind2<G, E, Option<A>>>) => Kind2<F, FE, Kind2<G, E, A>>
  readonly separate: <FE, A, B>(
    fge: Kind2<F, FE, Kind2<G, E, Either<A, B>>>
  ) => Separated<Kind2<F, FE, Kind2<G, E, A>>, Kind2<F, FE, Kind2<G, E, B>>>
}
/**
 * @category zone of death
 * @since 2.2.0
 * @deprecated
 */
export interface CompactableComposition23<F extends URIS2, G extends URIS3> extends FunctorComposition23<F, G> {
  readonly compact: <R, FE, GE, A>(fga: Kind2<F, FE, Kind3<G, R, GE, Option<A>>>) => Kind2<F, FE, Kind3<G, R, GE, A>>
  readonly separate: <R, FE, GE, A, B>(
    fge: Kind2<F, FE, Kind3<G, R, GE, Either<A, B>>>
  ) => Separated<Kind2<F, FE, Kind3<G, R, GE, A>>, Kind2<F, FE, Kind3<G, R, GE, B>>>
}
/**
 * @category zone of death
 * @since 2.2.0
 * @deprecated
 */
export interface CompactableComposition23C<F extends URIS2, G extends URIS3, E> extends FunctorComposition23C<F, G, E> {
  readonly compact: <FE, R, A>(fga: Kind2<F, FE, Kind3<G, R, E, Option<A>>>) => Kind2<F, FE, Kind3<G, R, E, A>>
  readonly separate: <FE, R, A, B>(
    fge: Kind2<F, FE, Kind3<G, R, E, Either<A, B>>>
  ) => Separated<Kind2<F, FE, Kind3<G, R, E, A>>, Kind2<F, FE, Kind3<G, R, E, B>>>
}
/**
 * Use [`compact`](#compact) and [`separate`](#separate) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function getCompactableComposition<F extends URIS2, G extends URIS3, E>(
  F: Functor2<F>,
  G: Compactable3C<G, E> & Functor3C<G, E>
): CompactableComposition23C<F, G, E>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS2, G extends URIS2, E>(
  F: Functor2<F>,
  G: Compactable2C<G, E> & Functor2C<G, E>
): CompactableComposition22C<F, G, E>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS2, G extends URIS2>(
  F: Functor2<F>,
  G: Compactable2<G> & Functor2<G>
): CompactableComposition22<F, G>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS2, G extends URIS, E>(
  F: Functor2C<F, E>,
  G: Compactable1<G> & Functor1<G>
): CompactableComposition2C1<F, G, E>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS2, G extends URIS>(
  F: Functor2<F>,
  G: Compactable1<G> & Functor1<G>
): CompactableComposition21<F, G>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS, G extends URIS2, E>(
  F: Functor1<F>,
  G: Compactable2C<G, E> & Functor2C<G, E>
): CompactableComposition12<F, G>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS, G extends URIS2>(
  F: Functor1<F>,
  G: Compactable2<G> & Functor2<G>
): CompactableComposition12<F, G>
/** @deprecated */
export declare function getCompactableComposition<F extends URIS, G extends URIS>(
  F: Functor1<F>,
  G: Compactable1<G> & Functor1<G>
): CompactableComposition11<F, G>
/** @deprecated */
export declare function getCompactableComposition<F, G>(
  F: Functor<F>,
  G: Compactable<G> & Functor<G>
): CompactableComposition<F, G>
/**
 * Use [`Separated`](./Separated.ts.html#separated) instead.
 *
 * @since 2.0.0
 * @deprecated
 */
export interface Separated<A, B> {
  readonly left: A
  readonly right: B
}
