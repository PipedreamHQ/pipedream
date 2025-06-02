/**
 * @since 2.0.0
 */
import { Alt, Alt1, Alt2, Alt2C, Alt3, Alt3C, Alt4 } from './Alt'
import { Apply, Apply1, Apply2, Apply2C, Apply3, Apply3C, Apply4 } from './Apply'
import { Bifunctor, Bifunctor2, Bifunctor2C, Bifunctor3, Bifunctor3C, Bifunctor4 } from './Bifunctor'
import { Chain, Chain1, Chain2, Chain2C, Chain3, Chain3C, Chain4 } from './Chain'
import {
  Compactable,
  Compactable1,
  Compactable2,
  Compactable2C,
  Compactable3,
  Compactable3C,
  Compactable4
} from './Compactable'
import {
  Contravariant,
  Contravariant1,
  Contravariant2,
  Contravariant2C,
  Contravariant3,
  Contravariant3C,
  Contravariant4
} from './Contravariant'
import { Either } from './Either'
import { Extend, Extend1, Extend2, Extend2C, Extend3, Extend3C, Extend4 } from './Extend'
import {
  Filterable,
  Filterable1,
  Filterable2,
  Filterable2C,
  Filterable3,
  Filterable3C,
  Filterable4
} from './Filterable'
import {
  FilterableWithIndex,
  FilterableWithIndex1,
  FilterableWithIndex2,
  FilterableWithIndex2C,
  FilterableWithIndex3,
  FilterableWithIndex3C,
  FilterableWithIndex4,
  PredicateWithIndex,
  RefinementWithIndex
} from './FilterableWithIndex'
import { Foldable, Foldable1, Foldable2, Foldable2C, Foldable3, Foldable3C, Foldable4 } from './Foldable'
import {
  FoldableWithIndex,
  FoldableWithIndex1,
  FoldableWithIndex2,
  FoldableWithIndex2C,
  FoldableWithIndex3,
  FoldableWithIndex3C,
  FoldableWithIndex4
} from './FoldableWithIndex'
import { LazyArg, pipe as pipeFromFunctionModule } from './function'
import { Functor, Functor1, Functor2, Functor2C, Functor3, Functor3C, Functor4 } from './Functor'
import {
  FunctorWithIndex,
  FunctorWithIndex1,
  FunctorWithIndex2,
  FunctorWithIndex2C,
  FunctorWithIndex3,
  FunctorWithIndex3C,
  FunctorWithIndex4
} from './FunctorWithIndex'
import { HKT, HKT2, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import {
  MonadThrow,
  MonadThrow1,
  MonadThrow2,
  MonadThrow2C,
  MonadThrow3,
  MonadThrow3C,
  MonadThrow4
} from './MonadThrow'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Predicate } from './Predicate'
import { Profunctor, Profunctor2, Profunctor2C, Profunctor3, Profunctor3C, Profunctor4 } from './Profunctor'
import { Refinement } from './Refinement'
import {
  Semigroupoid,
  Semigroupoid2,
  Semigroupoid2C,
  Semigroupoid3,
  Semigroupoid3C,
  Semigroupoid4
} from './Semigroupoid'
import { Separated } from './Separated'
/**
 * Returns a pipeable `map`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function map<F extends URIS4>(
  F: Functor4<F>
): <A, B>(f: (a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function map<F extends URIS3>(
  F: Functor3<F>
): <A, B>(f: (a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function map<F extends URIS3, E>(
  F: Functor3C<F, E>
): <A, B>(f: (a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function map<F extends URIS2>(
  F: Functor2<F>
): <A, B>(f: (a: A) => B) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function map<F extends URIS2, E>(
  F: Functor2C<F, E>
): <A, B>(f: (a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function map<F extends URIS>(F: Functor1<F>): <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
export declare function map<F>(F: Functor<F>): <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `contramap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function contramap<F extends URIS4>(
  F: Contravariant4<F>
): <A, B>(f: (b: B) => A) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function contramap<F extends URIS3>(
  F: Contravariant3<F>
): <A, B>(f: (b: B) => A) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function contramap<F extends URIS3, E>(
  F: Contravariant3C<F, E>
): <A, B>(f: (b: B) => A) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function contramap<F extends URIS2>(
  F: Contravariant2<F>
): <A, B>(f: (b: B) => A) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function contramap<F extends URIS2, E>(
  F: Contravariant2C<F, E>
): <A, B>(f: (b: B) => A) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function contramap<F extends URIS>(
  F: Contravariant1<F>
): <A, B>(f: (b: B) => A) => (fa: Kind<F, A>) => Kind<F, B>
export declare function contramap<F>(F: Contravariant<F>): <A, B>(f: (b: B) => A) => (fa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `mapWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function mapWithIndex<F extends URIS4, I>(
  F: FunctorWithIndex4<F, I>
): <A, B>(f: (i: I, a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function mapWithIndex<F extends URIS3, I>(
  F: FunctorWithIndex3<F, I>
): <A, B>(f: (i: I, a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function mapWithIndex<F extends URIS3, I, E>(
  F: FunctorWithIndex3C<F, I, E>
): <A, B>(f: (i: I, a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function mapWithIndex<F extends URIS2, I>(
  F: FunctorWithIndex2<F, I>
): <A, B>(f: (i: I, a: A) => B) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function mapWithIndex<F extends URIS2, I, E>(
  F: FunctorWithIndex2C<F, I, E>
): <A, B>(f: (i: I, a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function mapWithIndex<F extends URIS, I>(
  F: FunctorWithIndex1<F, I>
): <A, B>(f: (i: I, a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
export declare function mapWithIndex<F, I>(
  F: FunctorWithIndex<F, I>
): <A, B>(f: (i: I, a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `ap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function ap<F extends URIS4>(
  F: Apply4<F>
): <S, R, E, A>(fa: Kind4<F, S, R, E, A>) => <B>(fab: Kind4<F, S, R, E, (a: A) => B>) => Kind4<F, S, R, E, B>
export declare function ap<F extends URIS3>(
  F: Apply3<F>
): <R, E, A>(fa: Kind3<F, R, E, A>) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>
export declare function ap<F extends URIS3, E>(
  F: Apply3C<F, E>
): <R, A>(fa: Kind3<F, R, E, A>) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>
export declare function ap<F extends URIS2>(
  F: Apply2<F>
): <E, A>(fa: Kind2<F, E, A>) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>
export declare function ap<F extends URIS2, E>(
  F: Apply2C<F, E>
): <A>(fa: Kind2<F, E, A>) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>
export declare function ap<F extends URIS>(
  F: Apply1<F>
): <A>(fa: Kind<F, A>) => <B>(fab: Kind<F, (a: A) => B>) => Kind<F, B>
export declare function ap<F>(F: Apply<F>): <A>(fa: HKT<F, A>) => <B>(fab: HKT<F, (a: A) => B>) => HKT<F, B>
/**
 * Returns a pipeable `chain`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function chain<F extends URIS4>(
  F: Chain4<F>
): <A, S, R, E, B>(f: (a: A) => Kind4<F, S, R, E, B>) => (fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function chain<F extends URIS3>(
  F: Chain3<F>
): <A, R, E, B>(f: (a: A) => Kind3<F, R, E, B>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function chain<F extends URIS3, E>(
  F: Chain3C<F, E>
): <A, R, B>(f: (a: A) => Kind3<F, R, E, B>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function chain<F extends URIS2>(
  F: Chain2<F>
): <A, E, B>(f: (a: A) => Kind2<F, E, B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function chain<F extends URIS2, E>(
  F: Chain2C<F, E>
): <A, B>(f: (a: A) => Kind2<F, E, B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function chain<F extends URIS>(
  F: Chain1<F>
): <A, B>(f: (a: A) => Kind<F, B>) => (fa: Kind<F, A>) => Kind<F, B>
export declare function chain<F>(F: Chain<F>): <A, B>(f: (a: A) => HKT<F, B>) => (fa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `bimap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function bimap<F extends URIS4>(
  F: Bifunctor4<F>
): <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => <S, R>(fea: Kind4<F, S, R, E, A>) => Kind4<F, S, R, G, B>
export declare function bimap<F extends URIS3>(
  F: Bifunctor3<F>
): <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => <R>(fea: Kind3<F, R, E, A>) => Kind3<F, R, G, B>
export declare function bimap<F extends URIS3, E>(
  F: Bifunctor3C<F, E>
): <G, A, B>(f: (e: E) => G, g: (a: A) => B) => <R>(fea: Kind3<F, R, E, A>) => Kind3<F, R, G, B>
export declare function bimap<F extends URIS2>(
  F: Bifunctor2<F>
): <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fea: Kind2<F, E, A>) => Kind2<F, G, B>
export declare function bimap<F extends URIS2, E>(
  F: Bifunctor2C<F, E>
): <G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fea: Kind2<F, E, A>) => Kind2<F, G, B>
export declare function bimap<F>(
  F: Bifunctor<F>
): <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fea: HKT2<F, E, A>) => HKT2<F, G, B>
/**
 * Returns a pipeable `mapLeft`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function mapLeft<F extends URIS4>(
  F: Bifunctor4<F>
): <E, G>(f: (e: E) => G) => <S, R, A>(fea: Kind4<F, S, R, E, A>) => Kind4<F, S, R, G, A>
export declare function mapLeft<F extends URIS3>(
  F: Bifunctor3<F>
): <E, G>(f: (e: E) => G) => <R, A>(fea: Kind3<F, R, E, A>) => Kind3<F, R, G, A>
export declare function mapLeft<F extends URIS3, E>(
  F: Bifunctor3C<F, E>
): <E, G>(f: (e: E) => G) => <R, A>(fea: Kind3<F, R, E, A>) => Kind3<F, R, G, A>
export declare function mapLeft<F extends URIS2>(
  F: Bifunctor2<F>
): <E, G>(f: (e: E) => G) => <A>(fea: Kind2<F, E, A>) => Kind2<F, G, A>
export declare function mapLeft<F extends URIS2, E>(
  F: Bifunctor2C<F, E>
): <E, G>(f: (e: E) => G) => <A>(fea: Kind2<F, E, A>) => Kind2<F, G, A>
export declare function mapLeft<F>(F: Bifunctor<F>): <E, G>(f: (e: E) => G) => <A>(fea: HKT2<F, E, A>) => HKT2<F, G, A>
/**
 * Returns a pipeable `extend`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function extend<F extends URIS4>(
  F: Extend4<F>
): <S, R, E, A, B>(f: (wa: Kind4<F, S, R, E, A>) => B) => (wa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function extend<F extends URIS3>(
  F: Extend3<F>
): <R, E, A, B>(f: (wa: Kind3<F, R, E, A>) => B) => (wa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function extend<F extends URIS3, E>(
  F: Extend3C<F, E>
): <R, A, B>(f: (wa: Kind3<F, R, E, A>) => B) => (wa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function extend<F extends URIS2>(
  F: Extend2<F>
): <E, A, B>(f: (wa: Kind2<F, E, A>) => B) => (wa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function extend<F extends URIS2, E>(
  F: Extend2C<F, E>
): <A, B>(f: (wa: Kind2<F, E, A>) => B) => (wa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function extend<F extends URIS>(
  F: Extend1<F>
): <A, B>(f: (wa: Kind<F, A>) => B) => (wa: Kind<F, A>) => Kind<F, B>
export declare function extend<F>(F: Extend<F>): <A, B>(f: (wa: HKT<F, A>) => B) => (wa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `reduce`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function reduce<F extends URIS4>(
  F: Foldable4<F>
): <A, B>(b: B, f: (b: B, a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
export declare function reduce<F extends URIS3>(
  F: Foldable3<F>
): <A, B>(b: B, f: (b: B, a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
export declare function reduce<F extends URIS3, E>(
  F: Foldable3C<F, E>
): <A, B>(b: B, f: (b: B, a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => B
export declare function reduce<F extends URIS2>(
  F: Foldable2<F>
): <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: Kind2<F, E, A>) => B
export declare function reduce<F extends URIS2, E>(
  F: Foldable2C<F, E>
): <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Kind2<F, E, A>) => B
export declare function reduce<F extends URIS>(
  F: Foldable1<F>
): <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Kind<F, A>) => B
export declare function reduce<F>(F: Foldable<F>): <A, B>(b: B, f: (b: B, a: A) => B) => (fa: HKT<F, A>) => B
/**
 * Returns a pipeable `foldMap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function foldMap<F extends URIS4>(
  F: Foldable4<F>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => M
export declare function foldMap<F extends URIS3>(
  F: Foldable3<F>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <R, E>(fa: Kind3<F, R, E, A>) => M
export declare function foldMap<F extends URIS3, E>(
  F: Foldable3C<F, E>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <R>(fa: Kind3<F, R, E, A>) => M
export declare function foldMap<F extends URIS2>(
  F: Foldable2<F>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: Kind2<F, E, A>) => M
export declare function foldMap<F extends URIS2, E>(
  F: Foldable2C<F, E>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Kind2<F, E, A>) => M
export declare function foldMap<F extends URIS>(
  F: Foldable1<F>
): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Kind<F, A>) => M
export declare function foldMap<F>(F: Foldable<F>): <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: HKT<F, A>) => M
/**
 * Returns a pipeable `reduceRight`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function reduceRight<F extends URIS4>(
  F: Foldable4<F>
): <A, B>(b: B, f: (a: A, b: B) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
export declare function reduceRight<F extends URIS3>(
  F: Foldable3<F>
): <A, B>(b: B, f: (a: A, b: B) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
export declare function reduceRight<F extends URIS3, E>(
  F: Foldable3C<F, E>
): <A, B>(b: B, f: (a: A, b: B) => B) => <R>(fa: Kind3<F, R, E, A>) => B
export declare function reduceRight<F extends URIS2>(
  F: Foldable2<F>
): <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: Kind2<F, E, A>) => B
export declare function reduceRight<F extends URIS2, E>(
  F: Foldable2C<F, E>
): <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Kind2<F, E, A>) => B
export declare function reduceRight<F extends URIS>(
  F: Foldable1<F>
): <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Kind<F, A>) => B
export declare function reduceRight<F>(F: Foldable<F>): <A, B>(b: B, f: (a: A, b: B) => B) => (fa: HKT<F, A>) => B
/**
 * Returns a pipeable `reduceWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function reduceWithIndex<F extends URIS4, I>(
  F: FoldableWithIndex4<F, I>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
export declare function reduceWithIndex<F extends URIS3, I>(
  F: FoldableWithIndex3<F, I>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
export declare function reduceWithIndex<F extends URIS3, I, E>(
  F: FoldableWithIndex3C<F, I, E>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => B
export declare function reduceWithIndex<F extends URIS2, I>(
  F: FoldableWithIndex2<F, I>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <E>(fa: Kind2<F, E, A>) => B
export declare function reduceWithIndex<F extends URIS2, I, E>(
  F: FoldableWithIndex2C<F, I, E>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => (fa: Kind2<F, E, A>) => B
export declare function reduceWithIndex<F extends URIS, I>(
  F: FoldableWithIndex1<F, I>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => (fa: Kind<F, A>) => B
export declare function reduceWithIndex<F, I>(
  F: FoldableWithIndex<F, I>
): <A, B>(b: B, f: (i: I, b: B, a: A) => B) => (fa: HKT<F, A>) => B
/**
 * Returns a pipeable `foldMapWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function foldMapWithIndex<F extends URIS4, I>(
  F: FoldableWithIndex4<F, I>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => M
export declare function foldMapWithIndex<F extends URIS3, I>(
  F: FoldableWithIndex3<F, I>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <R, E>(fa: Kind3<F, R, E, A>) => M
export declare function foldMapWithIndex<F extends URIS3, I, E>(
  F: FoldableWithIndex3C<F, I, E>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <R>(fa: Kind3<F, R, E, A>) => M
export declare function foldMapWithIndex<F extends URIS2, I>(
  F: FoldableWithIndex2<F, I>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <E>(fa: Kind2<F, E, A>) => M
export declare function foldMapWithIndex<F extends URIS2, I, E>(
  F: FoldableWithIndex2C<F, I, E>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => (fa: Kind2<F, E, A>) => M
export declare function foldMapWithIndex<F extends URIS, I>(
  F: FoldableWithIndex1<F, I>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => (fa: Kind<F, A>) => M
export declare function foldMapWithIndex<F, I>(
  F: FoldableWithIndex<F, I>
): <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => (fa: HKT<F, A>) => M
/**
 * Returns a pipeable `reduceRightWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function reduceRightWithIndex<F extends URIS4, I>(
  F: FoldableWithIndex4<F, I>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
export declare function reduceRightWithIndex<F extends URIS3, I>(
  F: FoldableWithIndex3<F, I>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
export declare function reduceRightWithIndex<F extends URIS3, I, E>(
  F: FoldableWithIndex3C<F, I, E>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <R>(fa: Kind3<F, R, E, A>) => B
export declare function reduceRightWithIndex<F extends URIS2, I>(
  F: FoldableWithIndex2<F, I>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <E>(fa: Kind2<F, E, A>) => B
export declare function reduceRightWithIndex<F extends URIS2, I, E>(
  F: FoldableWithIndex2C<F, I, E>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => (fa: Kind2<F, E, A>) => B
export declare function reduceRightWithIndex<F extends URIS, I>(
  F: FoldableWithIndex1<F, I>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => (fa: Kind<F, A>) => B
export declare function reduceRightWithIndex<F, I>(
  F: FoldableWithIndex<F, I>
): <A, B>(b: B, f: (i: I, a: A, b: B) => B) => (fa: HKT<F, A>) => B
/**
 * Returns a pipeable `alt`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function alt<F extends URIS4>(
  F: Alt4<F>
): <S, R, E, A>(that: LazyArg<Kind4<F, S, R, E, A>>) => (fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
export declare function alt<F extends URIS3>(
  F: Alt3<F>
): <R, E, A>(that: LazyArg<Kind3<F, R, E, A>>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
export declare function alt<F extends URIS3, E>(
  F: Alt3C<F, E>
): <R, A>(that: LazyArg<Kind3<F, R, E, A>>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
export declare function alt<F extends URIS2>(
  F: Alt2<F>
): <E, A>(that: LazyArg<Kind2<F, E, A>>) => (fa: Kind2<F, E, A>) => Kind2<F, E, A>
export declare function alt<F extends URIS2, E>(
  F: Alt2C<F, E>
): <A>(that: LazyArg<Kind2<F, E, A>>) => (fa: Kind2<F, E, A>) => Kind2<F, E, A>
export declare function alt<F extends URIS>(
  F: Alt1<F>
): <A>(that: LazyArg<Kind<F, A>>) => (fa: Kind<F, A>) => Kind<F, A>
export declare function alt<F>(F: Alt<F>): <A>(that: LazyArg<HKT<F, A>>) => (fa: HKT<F, A>) => HKT<F, A>
/**
 * Returns a pipeable `filter`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function filter<F extends URIS4>(
  F: Filterable4<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
  <A>(predicate: Predicate<A>): <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
}
export declare function filter<F extends URIS3>(
  F: Filterable3<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  <A>(predicate: Predicate<A>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
}
export declare function filter<F extends URIS3, E>(
  F: Filterable3C<F, E>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  <A>(predicate: Predicate<A>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
}
export declare function filter<F extends URIS2>(
  F: Filterable2<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
  <A>(predicate: Predicate<A>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, A>
}
export declare function filter<F extends URIS2, E>(
  F: Filterable2C<F, E>
): {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind2<F, E, A>) => Kind2<F, E, B>
  <A>(predicate: Predicate<A>): (fa: Kind2<F, E, A>) => Kind2<F, E, A>
}
export declare function filter<F extends URIS>(
  F: Filterable1<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind<F, A>) => Kind<F, B>
  <A>(predicate: Predicate<A>): (fa: Kind<F, A>) => Kind<F, A>
}
export declare function filter<F>(F: Filterable<F>): {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: HKT<F, A>) => HKT<F, B>
  <A>(predicate: Predicate<A>): (fa: HKT<F, A>) => HKT<F, A>
}
/**
 * Returns a pipeable `filterMap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function filterMap<F extends URIS4>(
  F: Filterable4<F>
): <A, B>(f: (a: A) => Option<B>) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function filterMap<F extends URIS3>(
  F: Filterable3<F>
): <A, B>(f: (a: A) => Option<B>) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function filterMap<F extends URIS3, E>(
  F: Filterable3C<F, E>
): <A, B>(f: (a: A) => Option<B>) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function filterMap<F extends URIS2>(
  F: Filterable2<F>
): <A, B>(f: (a: A) => Option<B>) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function filterMap<F extends URIS2, E>(
  F: Filterable2C<F, E>
): <A, B>(f: (a: A) => Option<B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function filterMap<F extends URIS>(
  F: Filterable1<F>
): <A, B>(f: (a: A) => Option<B>) => (fa: Kind<F, A>) => Kind<F, B>
export declare function filterMap<F>(F: Filterable<F>): <A, B>(f: (a: A) => Option<B>) => (fa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `partition`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function partition<F extends URIS4>(
  F: Filterable4<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <S, R, E>(
    fa: Kind4<F, S, R, E, A>
  ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, B>>
  <A>(predicate: Predicate<A>): <S, R, E>(
    fa: Kind4<F, S, R, E, A>
  ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, A>>
}
export declare function partition<F extends URIS3>(
  F: Filterable3<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <R, E>(
    fa: Kind3<F, R, E, A>
  ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
  <A>(predicate: Predicate<A>): <R, E>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
}
export declare function partition<F extends URIS3, E>(
  F: Filterable3C<F, E>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <R>(
    fa: Kind3<F, R, E, A>
  ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
  <A>(predicate: Predicate<A>): <R>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
}
export declare function partition<F extends URIS2>(
  F: Filterable2<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
  <A>(predicate: Predicate<A>): <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
}
export declare function partition<F extends URIS2, E>(
  F: Filterable2C<F, E>
): {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
  <A>(predicate: Predicate<A>): (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
}
export declare function partition<F extends URIS>(
  F: Filterable1<F>
): {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, B>>
  <A>(predicate: Predicate<A>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, A>>
}
export declare function partition<F>(F: Filterable<F>): {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, B>>
  <A>(predicate: Predicate<A>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, A>>
}
/**
 * Returns a pipeable `partitionMap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function partitionMap<F extends URIS4>(
  F: Filterable4<F>
): <A, B, C>(
  f: (a: A) => Either<B, C>
) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Separated<Kind4<F, S, R, E, B>, Kind4<F, S, R, E, C>>
export declare function partitionMap<F extends URIS3>(
  F: Filterable3<F>
): <A, B, C>(
  f: (a: A) => Either<B, C>
) => <R, E>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
export declare function partitionMap<F extends URIS3, E>(
  F: Filterable3C<F, E>
): <A, B, C>(f: (a: A) => Either<B, C>) => <R>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
export declare function partitionMap<F extends URIS2>(
  F: Filterable2<F>
): <A, B, C>(f: (a: A) => Either<B, C>) => <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
export declare function partitionMap<F extends URIS2, E>(
  F: Filterable2C<F, E>
): <A, B, C>(f: (a: A) => Either<B, C>) => (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
export declare function partitionMap<F extends URIS>(
  F: Filterable1<F>
): <A, B, C>(f: (a: A) => Either<B, C>) => (fa: Kind<F, A>) => Separated<Kind<F, B>, Kind<F, C>>
export declare function partitionMap<F>(
  F: Filterable<F>
): <A, B, C>(f: (a: A) => Either<B, C>) => (fa: HKT<F, A>) => Separated<HKT<F, B>, HKT<F, C>>
/**
 * Returns a pipeable `filterWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function filterWithIndex<F extends URIS4, I>(
  F: FilterableWithIndex4<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <S, R, E>(
    fa: Kind4<F, S, R, E, A>
  ) => Kind4<F, S, R, E, B>
  <A>(predicate: PredicateWithIndex<I, A>): <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
}
export declare function filterWithIndex<F extends URIS3, I>(
  F: FilterableWithIndex3<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  <A>(predicate: PredicateWithIndex<I, A>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
}
export declare function filterWithIndex<F extends URIS3, I, E>(
  F: FilterableWithIndex3C<F, I, E>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  <A>(predicate: PredicateWithIndex<I, A>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
}
export declare function filterWithIndex<F extends URIS2, I>(
  F: FilterableWithIndex2<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
  <A>(predicate: PredicateWithIndex<I, A>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, A>
}
export declare function filterWithIndex<F extends URIS2, E, I>(
  F: FilterableWithIndex2C<F, I, E>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): (fa: Kind2<F, E, A>) => Kind2<F, E, B>
  <A>(predicate: PredicateWithIndex<I, A>): (fa: Kind2<F, E, A>) => Kind2<F, E, A>
}
export declare function filterWithIndex<F extends URIS, I>(
  F: FilterableWithIndex1<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): (fa: Kind<F, A>) => Kind<F, B>
  <A>(predicate: PredicateWithIndex<I, A>): (fa: Kind<F, A>) => Kind<F, A>
}
export declare function filterWithIndex<F, I>(
  F: FilterableWithIndex<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): (fa: HKT<F, A>) => HKT<F, B>
  <A>(predicate: PredicateWithIndex<I, A>): (fa: HKT<F, A>) => HKT<F, A>
}
/**
 * Returns a pipeable `filterMapWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function filterMapWithIndex<F extends URIS4, I>(
  F: FilterableWithIndex4<F, I>
): <A, B>(f: (i: I, a: A) => Option<B>) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
export declare function filterMapWithIndex<F extends URIS3, I>(
  F: FilterableWithIndex3<F, I>
): <A, B>(f: (i: I, a: A) => Option<B>) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function filterMapWithIndex<F extends URIS3, I, E>(
  F: FilterableWithIndex3C<F, I, E>
): <A, B>(f: (i: I, a: A) => Option<B>) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
export declare function filterMapWithIndex<F extends URIS2, I>(
  F: FilterableWithIndex2<F, I>
): <A, B>(f: (i: I, a: A) => Option<B>) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function filterMapWithIndex<F extends URIS2, I, E>(
  F: FilterableWithIndex2C<F, I, E>
): <A, B>(f: (i: I, a: A) => Option<B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
export declare function filterMapWithIndex<F extends URIS, I>(
  F: FilterableWithIndex1<F, I>
): <A, B>(f: (i: I, a: A) => Option<B>) => (fa: Kind<F, A>) => Kind<F, B>
export declare function filterMapWithIndex<F, I>(
  F: FilterableWithIndex<F, I>
): <A, B>(f: (i: I, a: A) => Option<B>) => (fa: HKT<F, A>) => HKT<F, B>
/**
 * Returns a pipeable `partitionWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function partitionWithIndex<F extends URIS4, I>(
  F: FilterableWithIndex4<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <S, R, E>(
    fa: Kind4<F, S, R, E, A>
  ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, B>>
  <A>(predicate: PredicateWithIndex<I, A>): <S, R, E>(
    fa: Kind4<F, S, R, E, A>
  ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, A>>
}
export declare function partitionWithIndex<F extends URIS3, I>(
  F: FilterableWithIndex3<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <R, E>(
    fa: Kind3<F, R, E, A>
  ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
  <A>(predicate: PredicateWithIndex<I, A>): <R, E>(
    fa: Kind3<F, R, E, A>
  ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
}
export declare function partitionWithIndex<F extends URIS3, I, E>(
  F: FilterableWithIndex3C<F, I, E>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <R>(
    fa: Kind3<F, R, E, A>
  ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
  <A>(predicate: PredicateWithIndex<I, A>): <R>(
    fa: Kind3<F, R, E, A>
  ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
}
export declare function partitionWithIndex<F extends URIS2, I>(
  F: FilterableWithIndex2<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): <E>(
    fa: Kind2<F, E, A>
  ) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
  <A>(predicate: PredicateWithIndex<I, A>): <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
}
export declare function partitionWithIndex<F extends URIS2, I, E>(
  F: FilterableWithIndex2C<F, I, E>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): (
    fa: Kind2<F, E, A>
  ) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
  <A>(predicate: PredicateWithIndex<I, A>): (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
}
export declare function partitionWithIndex<F extends URIS, I>(
  F: FilterableWithIndex1<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, B>>
  <A>(predicate: PredicateWithIndex<I, A>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, A>>
}
export declare function partitionWithIndex<F, I>(
  F: FilterableWithIndex<F, I>
): {
  <A, B extends A>(refinement: RefinementWithIndex<I, A, B>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, B>>
  <A>(predicate: PredicateWithIndex<I, A>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, A>>
}
/**
 * Returns a pipeable `partitionMapWithIndex`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function partitionMapWithIndex<F extends URIS4, I>(
  F: FilterableWithIndex4<F, I>
): <A, B, C>(
  f: (i: I, a: A) => Either<B, C>
) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Separated<Kind4<F, S, R, E, B>, Kind4<F, S, R, E, C>>
export declare function partitionMapWithIndex<F extends URIS3, I>(
  F: FilterableWithIndex3<F, I>
): <A, B, C>(
  f: (i: I, a: A) => Either<B, C>
) => <R, E>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
export declare function partitionMapWithIndex<F extends URIS3, I, E>(
  F: FilterableWithIndex3C<F, I, E>
): <A, B, C>(
  f: (i: I, a: A) => Either<B, C>
) => <R>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
export declare function partitionMapWithIndex<F extends URIS2, I>(
  F: FilterableWithIndex2<F, I>
): <A, B, C>(f: (i: I, a: A) => Either<B, C>) => <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
export declare function partitionMapWithIndex<F extends URIS2, I, E>(
  F: FilterableWithIndex2C<F, I, E>
): <A, B, C>(f: (i: I, a: A) => Either<B, C>) => (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
export declare function partitionMapWithIndex<F extends URIS, I>(
  F: FilterableWithIndex1<F, I>
): <A, B, C>(f: (i: I, a: A) => Either<B, C>) => (fa: Kind<F, A>) => Separated<Kind<F, B>, Kind<F, C>>
export declare function partitionMapWithIndex<F, I>(
  F: FilterableWithIndex<F, I>
): <A, B, C>(f: (i: I, a: A) => Either<B, C>) => (fa: HKT<F, A>) => Separated<HKT<F, B>, HKT<F, C>>
/**
 * Returns a pipeable `promap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function promap<F extends URIS4>(
  F: Profunctor4<F>
): <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => <S, R>(fbc: Kind4<F, S, R, E, A>) => Kind4<F, S, R, D, B>
export declare function promap<F extends URIS3>(
  F: Profunctor3<F>
): <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => <R>(fbc: Kind3<F, R, E, A>) => Kind3<F, R, D, B>
export declare function promap<F extends URIS3, E>(
  F: Profunctor3C<F, E>
): <A, D, B>(f: (d: D) => E, g: (a: A) => B) => <R>(fbc: Kind3<F, R, E, A>) => Kind3<F, R, D, B>
export declare function promap<F extends URIS2>(
  F: Profunctor2<F>
): <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: Kind2<F, E, A>) => Kind2<F, D, B>
export declare function promap<F extends URIS2, E>(
  F: Profunctor2C<F, E>
): <A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: Kind2<F, E, A>) => Kind2<F, D, B>
export declare function promap<F>(
  F: Profunctor<F>
): <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: HKT2<F, E, A>) => HKT2<F, D, B>
/**
 * Returns a pipeable `compose`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export declare function compose<F extends URIS4>(
  F: Semigroupoid4<F>
): <S, R, E, A>(ea: Kind4<F, S, R, E, A>) => <B>(ab: Kind4<F, S, R, A, B>) => Kind4<F, S, R, E, B>
export declare function compose<F extends URIS3>(
  F: Semigroupoid3<F>
): <R, E, A>(ea: Kind3<F, R, E, A>) => <B>(ab: Kind3<F, R, A, B>) => Kind3<F, R, E, B>
export declare function compose<F extends URIS3, E>(
  F: Semigroupoid3C<F, E>
): <R, A>(ea: Kind3<F, R, E, A>) => <B>(ab: Kind3<F, R, A, B>) => Kind3<F, R, E, B>
export declare function compose<F extends URIS2>(
  F: Semigroupoid2<F>
): <E, A>(ea: Kind2<F, E, A>) => <B>(ab: Kind2<F, A, B>) => Kind2<F, E, B>
export declare function compose<F extends URIS2, E>(
  F: Semigroupoid2C<F, E>
): <A>(ea: Kind2<F, E, A>) => <B>(ab: Kind2<F, A, B>) => Kind2<F, E, B>
export declare function compose<F>(
  F: Semigroupoid<F>
): <E, A>(ea: HKT2<F, E, A>) => <B>(ab: HKT2<F, A, B>) => HKT2<F, E, B>
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctor<F> {
  readonly map: <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctor1<F extends URIS> {
  readonly map: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctor2<F extends URIS2> {
  readonly map: <A, B>(f: (a: A) => B) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctor2C<F extends URIS2, E> {
  readonly map: <A, B>(f: (a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctor3<F extends URIS3> {
  readonly map: <A, B>(f: (a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableFunctor3C<F extends URIS3, E> {
  readonly map: <A, B>(f: (a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctor4<F extends URIS4> {
  readonly map: <A, B>(f: (a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableContravariant<F> {
  readonly contramap: <A, B>(f: (b: B) => A) => (fa: HKT<F, A>) => HKT<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableContravariant1<F extends URIS> {
  readonly contramap: <A, B>(f: (b: B) => A) => (fa: Kind<F, A>) => Kind<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableContravariant2<F extends URIS2> {
  readonly contramap: <A, B>(f: (b: B) => A) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableContravariant2C<F extends URIS2, E> {
  readonly contramap: <A, B>(f: (b: B) => A) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableContravariant3<F extends URIS3> {
  readonly contramap: <A, B>(f: (b: B) => A) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableContravariant3C<F extends URIS3, E> {
  readonly contramap: <A, B>(f: (b: B) => A) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableContravariant4<F extends URIS4> {
  readonly contramap: <A, B>(f: (b: B) => A) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex<F, I> extends PipeableFunctor<F> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex1<F extends URIS, I> extends PipeableFunctor1<F> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex2<F extends URIS2, I> extends PipeableFunctor2<F> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex2C<F extends URIS2, I, E> extends PipeableFunctor2C<F, E> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex3<F extends URIS3, I> extends PipeableFunctor3<F> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex3C<F extends URIS3, I, E> extends PipeableFunctor3C<F, E> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFunctorWithIndex4<F extends URIS4, I> extends PipeableFunctor4<F> {
  readonly mapWithIndex: <A, B>(f: (i: I, a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableApply<F> extends PipeableFunctor<F> {
  readonly ap: <A>(fa: HKT<F, A>) => <B>(fab: HKT<F, (a: A) => B>) => HKT<F, B>
  readonly apFirst: <B>(fb: HKT<F, B>) => <A>(fa: HKT<F, A>) => HKT<F, A>
  readonly apSecond: <B>(fb: HKT<F, B>) => <A>(fa: HKT<F, A>) => HKT<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableApply1<F extends URIS> extends PipeableFunctor1<F> {
  readonly ap: <A>(fa: Kind<F, A>) => <B>(fab: Kind<F, (a: A) => B>) => Kind<F, B>
  readonly apFirst: <B>(fb: Kind<F, B>) => <A>(fa: Kind<F, A>) => Kind<F, A>
  readonly apSecond: <B>(fb: Kind<F, B>) => <A>(fa: Kind<F, A>) => Kind<F, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableApply2<F extends URIS2> extends PipeableFunctor2<F> {
  readonly ap: <E, A>(fa: Kind2<F, E, A>) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>
  readonly apFirst: <E, B>(fb: Kind2<F, E, B>) => <A>(fa: Kind2<F, E, A>) => Kind2<F, E, A>
  readonly apSecond: <E, B>(fb: Kind2<F, E, B>) => <A>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableApply2C<F extends URIS2, E> extends PipeableFunctor2C<F, E> {
  readonly ap: <A>(fa: Kind2<F, E, A>) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>
  readonly apFirst: <B>(fb: Kind2<F, E, B>) => <A>(fa: Kind2<F, E, A>) => Kind2<F, E, A>
  readonly apSecond: <B>(fb: Kind2<F, E, B>) => <A>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableApply3<F extends URIS3> extends PipeableFunctor3<F> {
  readonly ap: <R, E, A>(fa: Kind3<F, R, E, A>) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>
  readonly apFirst: <R, E, B>(fb: Kind3<F, R, E, B>) => <A>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly apSecond: <R, E, B>(fb: Kind3<F, R, E, B>) => <A>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableApply3C<F extends URIS3, E> extends PipeableFunctor3C<F, E> {
  readonly ap: <R, A>(fa: Kind3<F, R, E, A>) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>
  readonly apFirst: <R, B>(fb: Kind3<F, R, E, B>) => <A>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly apSecond: <R, B>(fb: Kind3<F, R, E, B>) => <A>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableApply4<F extends URIS4> extends PipeableFunctor4<F> {
  readonly ap: <S, R, E, A>(
    fa: Kind4<F, S, R, E, A>
  ) => <B>(fab: Kind4<F, S, R, E, (a: A) => B>) => Kind4<F, S, R, E, B>
  readonly apFirst: <S, R, E, B>(fb: Kind4<F, S, R, E, B>) => <A>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  readonly apSecond: <S, R, E, B>(fb: Kind4<F, S, R, E, B>) => <A>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableChain<F> extends PipeableApply<F> {
  readonly chain: <A, B>(f: (a: A) => HKT<F, B>) => (ma: HKT<F, A>) => HKT<F, B>
  readonly chainFirst: <A, B>(f: (a: A) => HKT<F, B>) => (ma: HKT<F, A>) => HKT<F, A>
  readonly flatten: <A>(mma: HKT<F, HKT<F, A>>) => HKT<F, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableChain1<F extends URIS> extends PipeableApply1<F> {
  readonly chain: <A, B>(f: (a: A) => Kind<F, B>) => (ma: Kind<F, A>) => Kind<F, B>
  readonly chainFirst: <A, B>(f: (a: A) => Kind<F, B>) => (ma: Kind<F, A>) => Kind<F, A>
  readonly flatten: <A>(mma: Kind<F, Kind<F, A>>) => Kind<F, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableChain2<F extends URIS2> extends PipeableApply2<F> {
  readonly chain: <E, A, B>(f: (a: A) => Kind2<F, E, B>) => (ma: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly chainFirst: <E, A, B>(f: (a: A) => Kind2<F, E, B>) => (ma: Kind2<F, E, A>) => Kind2<F, E, A>
  readonly flatten: <E, A>(mma: Kind2<F, E, Kind2<F, E, A>>) => Kind2<F, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableChain2C<F extends URIS2, E> extends PipeableApply2C<F, E> {
  readonly chain: <A, B>(f: (a: A) => Kind2<F, E, B>) => (ma: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly chainFirst: <A, B>(f: (a: A) => Kind2<F, E, B>) => (ma: Kind2<F, E, A>) => Kind2<F, E, A>
  readonly flatten: <A>(mma: Kind2<F, E, Kind2<F, E, A>>) => Kind2<F, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableChain3<F extends URIS3> extends PipeableApply3<F> {
  readonly chain: <R, E, A, B>(f: (a: A) => Kind3<F, R, E, B>) => (ma: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  readonly chainFirst: <R, E, A, B>(f: (a: A) => Kind3<F, R, E, B>) => (ma: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly flatten: <R, E, A>(mma: Kind3<F, R, E, Kind3<F, R, E, A>>) => Kind3<F, R, E, A>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableChain3C<F extends URIS3, E> extends PipeableApply3C<F, E> {
  readonly chain: <R, A, B>(f: (a: A) => Kind3<F, R, E, B>) => (ma: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  readonly chainFirst: <R, A, B>(f: (a: A) => Kind3<F, R, E, B>) => (ma: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly flatten: <R, A>(mma: Kind3<F, R, E, Kind3<F, R, E, A>>) => Kind3<F, R, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableChain4<F extends URIS4> extends PipeableApply4<F> {
  readonly chain: <S, R, E, A, B>(
    f: (a: A) => Kind4<F, S, R, E, B>
  ) => (ma: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
  readonly chainFirst: <S, R, E, A, B>(
    f: (a: A) => Kind4<F, S, R, E, B>
  ) => (ma: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  readonly flatten: <S, R, E, A>(mma: Kind4<F, S, R, E, Kind4<F, S, R, E, A>>) => Kind4<F, S, R, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableExtend<F> extends PipeableFunctor<F> {
  readonly extend: <A, B>(f: (wa: HKT<F, A>) => B) => (wa: HKT<F, A>) => HKT<F, B>
  readonly duplicate: <A>(wa: HKT<F, A>) => HKT<F, HKT<F, A>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableExtend1<F extends URIS> extends PipeableFunctor1<F> {
  readonly extend: <A, B>(f: (wa: Kind<F, A>) => B) => (wa: Kind<F, A>) => Kind<F, B>
  readonly duplicate: <A>(wa: Kind<F, A>) => Kind<F, Kind<F, A>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableExtend2<F extends URIS2> extends PipeableFunctor2<F> {
  readonly extend: <E, A, B>(f: (wa: Kind2<F, E, A>) => B) => (wa: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly duplicate: <E, A>(wa: Kind2<F, E, A>) => Kind2<F, E, Kind2<F, E, A>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableExtend2C<F extends URIS2, E> extends PipeableFunctor2C<F, E> {
  readonly extend: <A, B>(f: (wa: Kind2<F, E, A>) => B) => (wa: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly duplicate: <A>(wa: Kind2<F, E, A>) => Kind2<F, E, Kind2<F, E, A>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableExtend3<F extends URIS3> extends PipeableFunctor3<F> {
  readonly extend: <R, E, A, B>(f: (wa: Kind3<F, R, E, A>) => B) => (wa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  readonly duplicate: <R, E, A>(wa: Kind3<F, R, E, A>) => Kind3<F, R, E, Kind3<F, R, E, A>>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableExtend3C<F extends URIS3, E> extends PipeableFunctor3C<F, E> {
  readonly extend: <R, A, B>(f: (wa: Kind3<F, R, E, A>) => B) => (wa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  readonly duplicate: <R, A>(wa: Kind3<F, R, E, A>) => Kind3<F, R, E, Kind3<F, R, E, A>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableExtend4<F extends URIS4> extends PipeableFunctor4<F> {
  readonly extend: <S, R, E, A, B>(
    f: (wa: Kind4<F, S, R, E, A>) => B
  ) => (wa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
  readonly duplicate: <S, R, E, A>(wa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, Kind4<F, S, R, E, A>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableBifunctor<F> {
  readonly bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: HKT2<F, E, A>) => HKT2<F, G, B>
  readonly mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: HKT2<F, E, A>) => HKT2<F, G, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableBifunctor2<F extends URIS2> {
  readonly bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, G, B>
  readonly mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: Kind2<F, E, A>) => Kind2<F, G, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableBifunctor3<F extends URIS3> {
  readonly bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, G, B>
  readonly mapLeft: <E, G>(f: (e: E) => G) => <R, A>(fa: Kind3<F, R, E, A>) => Kind3<F, R, G, A>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableBifunctor3C<F extends URIS3, E> {
  readonly bimap: <G, A, B>(f: (e: E) => G, g: (a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, G, B>
  readonly mapLeft: <G>(f: (e: E) => G) => <R, A>(fa: Kind3<F, R, E, A>) => Kind3<F, R, G, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableBifunctor4<F extends URIS4> {
  readonly bimap: <E, G, A, B>(
    f: (e: E) => G,
    g: (a: A) => B
  ) => <S, R>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, G, B>
  readonly mapLeft: <E, G>(f: (e: E) => G) => <S, R, A>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, G, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldable<F> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: HKT<F, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: HKT<F, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: HKT<F, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldable1<F extends URIS> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Kind<F, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Kind<F, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Kind<F, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldable2<F extends URIS2> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: Kind2<F, E, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: Kind2<F, E, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: Kind2<F, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldable2C<F extends URIS2, E> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Kind2<F, E, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Kind2<F, E, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Kind2<F, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldable3<F extends URIS3> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <R, E>(fa: Kind3<F, R, E, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableFoldable3C<F extends URIS3, E> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <R>(fa: Kind3<F, R, E, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <R>(fa: Kind3<F, R, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldable4<F extends URIS4> {
  readonly reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => M
  readonly reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex<F, I> extends PipeableFoldable<F> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => (fa: HKT<F, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => (fa: HKT<F, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => (fa: HKT<F, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex1<F extends URIS, I> extends PipeableFoldable1<F> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => (fa: Kind<F, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => (fa: Kind<F, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => (fa: Kind<F, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex2<F extends URIS2, I> extends PipeableFoldable2<F> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <E>(fa: Kind2<F, E, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <E>(fa: Kind2<F, E, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <E>(fa: Kind2<F, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex2C<F extends URIS2, I, E> extends PipeableFoldable2C<F, E> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => (fa: Kind2<F, E, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => (fa: Kind2<F, E, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => (fa: Kind2<F, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex3<F extends URIS3, I> extends PipeableFoldable3<F> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <R, E>(fa: Kind3<F, R, E, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <R, E>(fa: Kind3<F, R, E, A>) => B
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex3C<F extends URIS3, I, E> extends PipeableFoldable3C<F, E> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <R>(fa: Kind3<F, R, E, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <R>(fa: Kind3<F, R, E, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <R>(fa: Kind3<F, R, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFoldableWithIndex4<F extends URIS4, I> extends PipeableFoldable4<F> {
  readonly reduceWithIndex: <A, B>(b: B, f: (i: I, b: B, a: A) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
  readonly foldMapWithIndex: <M>(M: Monoid<M>) => <A>(f: (i: I, a: A) => M) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => M
  readonly reduceRightWithIndex: <A, B>(b: B, f: (i: I, a: A, b: B) => B) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => B
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableAlt<F> {
  readonly alt: <A>(that: LazyArg<HKT<F, A>>) => (fa: HKT<F, A>) => HKT<F, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableAlt1<F extends URIS> {
  readonly alt: <A>(that: LazyArg<Kind<F, A>>) => (fa: Kind<F, A>) => Kind<F, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableAlt2<F extends URIS2> {
  readonly alt: <E, A>(that: LazyArg<Kind2<F, E, A>>) => (fa: Kind2<F, E, A>) => Kind2<F, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableAlt2C<F extends URIS2, E> {
  readonly alt: <A>(that: LazyArg<Kind2<F, E, A>>) => (fa: Kind2<F, E, A>) => Kind2<F, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableAlt3<F extends URIS3> {
  readonly alt: <R, E, A>(that: LazyArg<Kind3<F, R, E, A>>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableAlt3C<F extends URIS3, E> {
  readonly alt: <R, A>(that: LazyArg<Kind3<F, R, E, A>>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableAlt4<F extends URIS4> {
  readonly alt: <S, R, E, A>(that: LazyArg<Kind4<F, S, R, E, A>>) => (fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableCompactable<F> {
  readonly compact: <A>(fa: HKT<F, Option<A>>) => HKT<F, A>
  readonly separate: <A, B>(fa: HKT<F, Either<A, B>>) => Separated<HKT<F, A>, HKT<F, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableCompactable1<F extends URIS> {
  readonly compact: <A>(fa: Kind<F, Option<A>>) => Kind<F, A>
  readonly separate: <A, B>(fa: Kind<F, Either<A, B>>) => Separated<Kind<F, A>, Kind<F, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableCompactable2<F extends URIS2> {
  readonly compact: <E, A>(fa: Kind2<F, E, Option<A>>) => Kind2<F, E, A>
  readonly separate: <E, A, B>(fa: Kind2<F, E, Either<A, B>>) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableCompactable2C<F extends URIS2, E> {
  readonly compact: <A>(fa: Kind2<F, E, Option<A>>) => Kind2<F, E, A>
  readonly separate: <A, B>(fa: Kind2<F, E, Either<A, B>>) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableCompactable3<F extends URIS3> {
  readonly compact: <R, E, A>(fa: Kind3<F, R, E, Option<A>>) => Kind3<F, R, E, A>
  readonly separate: <R, E, A, B>(fa: Kind3<F, R, E, Either<A, B>>) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableCompactable3C<F extends URIS3, E> {
  readonly compact: <R, A>(fa: Kind3<F, R, E, Option<A>>) => Kind3<F, R, E, A>
  readonly separate: <R, A, B>(fa: Kind3<F, R, E, Either<A, B>>) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableCompactable4<F extends URIS4> {
  readonly compact: <S, R, E, A>(fa: Kind4<F, S, R, E, Option<A>>) => Kind4<F, S, R, E, A>
  readonly separate: <S, R, E, A, B>(
    fa: Kind4<F, S, R, E, Either<A, B>>
  ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, B>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterable<F> extends PipeableCompactable<F> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): (fa: HKT<F, A>) => HKT<F, B>
    <A>(predicate: Predicate<A>): (fa: HKT<F, A>) => HKT<F, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: HKT<F, A>) => HKT<F, B>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, B>>
    <A>(predicate: Predicate<A>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, A>>
  }
  readonly partitionMap: <A, B, C>(f: (a: A) => Either<B, C>) => (fa: HKT<F, A>) => Separated<HKT<F, B>, HKT<F, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterable1<F extends URIS> extends PipeableCompactable1<F> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind<F, A>) => Kind<F, B>
    <A>(predicate: Predicate<A>): (fa: Kind<F, A>) => Kind<F, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: Kind<F, A>) => Kind<F, B>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, B>>
    <A>(predicate: Predicate<A>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, A>>
  }
  readonly partitionMap: <A, B, C>(f: (a: A) => Either<B, C>) => (fa: Kind<F, A>) => Separated<Kind<F, B>, Kind<F, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterable2<F extends URIS2> extends PipeableCompactable2<F> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
    <A>(predicate: Predicate<A>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
    <A>(predicate: Predicate<A>): <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
  }
  readonly partitionMap: <A, B, C>(
    f: (a: A) => Either<B, C>
  ) => <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterable2C<F extends URIS2, E> extends PipeableCompactable2C<F, E> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind2<F, E, A>) => Kind2<F, E, B>
    <A>(predicate: Predicate<A>): (fa: Kind2<F, E, A>) => Kind2<F, E, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
    <A>(predicate: Predicate<A>): (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
  }
  readonly partitionMap: <A, B, C>(
    f: (a: A) => Either<B, C>
  ) => (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterable3<F extends URIS3> extends PipeableCompactable3<F> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
    <A>(predicate: Predicate<A>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): <R, E>(
      fa: Kind3<F, R, E, A>
    ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
    <A>(predicate: Predicate<A>): <R, E>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
  }
  readonly partitionMap: <A, B, C>(
    f: (a: A) => Either<B, C>
  ) => <R, E>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableFilterable3C<F extends URIS3, E> extends PipeableCompactable3C<F, E> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
    <A>(predicate: Predicate<A>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): <R>(
      fa: Kind3<F, R, E, A>
    ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
    <A>(predicate: Predicate<A>): <R>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
  }
  readonly partitionMap: <A, B, C>(
    f: (a: A) => Either<B, C>
  ) => <R>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterable4<F extends URIS4> extends PipeableCompactable4<F> {
  readonly filter: {
    <A, B extends A>(refinement: Refinement<A, B>): <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
    <A>(predicate: Predicate<A>): <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  }
  readonly filterMap: <A, B>(f: (a: A) => Option<B>) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  readonly partition: {
    <A, B extends A>(refinement: Refinement<A, B>): <S, R, E>(
      fa: Kind4<F, S, R, E, A>
    ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, B>>
    <A>(predicate: Predicate<A>): <S, R, E>(
      fa: Kind4<F, S, R, E, A>
    ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, A>>
  }
  readonly partitionMap: <A, B, C>(
    f: (a: A) => Either<B, C>
  ) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Separated<Kind4<F, S, R, E, B>, Kind4<F, S, R, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex<F, I> extends PipeableFilterable<F> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): (fa: HKT<F, A>) => HKT<F, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): (fa: HKT<F, A>) => HKT<F, A>
  }
  readonly filterMapWithIndex: <A, B>(f: (i: I, a: A) => Option<B>) => (fa: HKT<F, A>) => HKT<F, B>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): (
      fa: HKT<F, A>
    ) => Separated<HKT<F, A>, HKT<F, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): (fa: HKT<F, A>) => Separated<HKT<F, A>, HKT<F, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => (fa: HKT<F, A>) => Separated<HKT<F, B>, HKT<F, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex1<F extends URIS, I> extends PipeableFilterable1<F> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): (fa: Kind<F, A>) => Kind<F, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): (fa: Kind<F, A>) => Kind<F, A>
  }
  readonly filterMapWithIndex: <A, B>(f: (i: I, a: A) => Option<B>) => (fa: Kind<F, A>) => Kind<F, B>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): (
      fa: Kind<F, A>
    ) => Separated<Kind<F, A>, Kind<F, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): (fa: Kind<F, A>) => Separated<Kind<F, A>, Kind<F, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => (fa: Kind<F, A>) => Separated<Kind<F, B>, Kind<F, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex2<F extends URIS2, I> extends PipeableFilterable2<F> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <E>(fa: Kind2<F, E, A>) => Kind2<F, E, A>
  }
  readonly filterMapWithIndex: <A, B>(f: (i: I, a: A) => Option<B>) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <E>(
      fa: Kind2<F, E, A>
    ) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <E>(
      fa: Kind2<F, E, A>
    ) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => <E>(fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex2C<F extends URIS2, I, E> extends PipeableFilterable2C<F, E> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): (fa: Kind2<F, E, A>) => Kind2<F, E, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): (fa: Kind2<F, E, A>) => Kind2<F, E, A>
  }
  readonly filterMapWithIndex: <A, B>(f: (i: I, a: A) => Option<B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): (
      fa: Kind2<F, E, A>
    ) => Separated<Kind2<F, E, A>, Kind2<F, E, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, A>, Kind2<F, E, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => (fa: Kind2<F, E, A>) => Separated<Kind2<F, E, B>, Kind2<F, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex3<F extends URIS3, I> extends PipeableFilterable3<F> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <R, E>(
      fa: Kind3<F, R, E, A>
    ) => Kind3<F, R, E, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  }
  readonly filterMapWithIndex: <A, B>(
    f: (i: I, a: A) => Option<B>
  ) => <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <R, E>(
      fa: Kind3<F, R, E, A>
    ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <R, E>(
      fa: Kind3<F, R, E, A>
    ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => <R, E>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex3C<F extends URIS3, I, E> extends PipeableFilterable3C<F, E> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <R, E>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  }
  readonly filterMapWithIndex: <A, B>(f: (i: I, a: A) => Option<B>) => <R>(fa: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <R>(
      fa: Kind3<F, R, E, A>
    ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <R>(
      fa: Kind3<F, R, E, A>
    ) => Separated<Kind3<F, R, E, A>, Kind3<F, R, E, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => <R>(fa: Kind3<F, R, E, A>) => Separated<Kind3<F, R, E, B>, Kind3<F, R, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableFilterableWithIndex4<F extends URIS4, I> extends PipeableFilterable4<F> {
  readonly filterWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <S, R, E>(
      fa: Kind4<F, S, R, E, A>
    ) => Kind4<F, S, R, E, B>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  }
  readonly filterMapWithIndex: <A, B>(
    f: (i: I, a: A) => Option<B>
  ) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  readonly partitionWithIndex: {
    <A, B extends A>(refinementWithIndex: RefinementWithIndex<I, A, B>): <S, R, E>(
      fa: Kind4<F, S, R, E, A>
    ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, B>>
    <A>(predicateWithIndex: PredicateWithIndex<I, A>): <S, R, E>(
      fa: Kind4<F, S, R, E, A>
    ) => Separated<Kind4<F, S, R, E, A>, Kind4<F, S, R, E, A>>
  }
  readonly partitionMapWithIndex: <A, B, C>(
    f: (i: I, a: A) => Either<B, C>
  ) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => Separated<Kind4<F, S, R, E, B>, Kind4<F, S, R, E, C>>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableProfunctor<F> {
  readonly promap: <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: HKT2<F, E, A>) => HKT2<F, D, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableProfunctor2<F extends URIS2> extends PipeableFunctor2<F> {
  readonly promap: <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: Kind2<F, E, A>) => Kind2<F, D, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableProfunctor2C<F extends URIS2, E> extends PipeableFunctor2C<F, E> {
  readonly promap: <A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: Kind2<F, E, A>) => Kind2<F, D, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableProfunctor3<F extends URIS3> extends PipeableFunctor3<F> {
  readonly promap: <R, E, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: Kind3<F, R, E, A>) => Kind3<F, R, D, B>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableProfunctor3C<F extends URIS3, E> extends PipeableFunctor3C<F, E> {
  readonly promap: <R, A, D, B>(f: (d: D) => E, g: (a: A) => B) => (fbc: Kind3<F, R, E, A>) => Kind3<F, R, D, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableProfunctor4<F extends URIS4> extends PipeableFunctor4<F> {
  readonly promap: <S, R, E, A, D, B>(
    f: (d: D) => E,
    g: (a: A) => B
  ) => (fbc: Kind4<F, S, R, E, A>) => Kind4<F, S, R, D, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableSemigroupoid<F> {
  readonly compose: <E, A>(la: HKT2<F, E, A>) => <B>(ab: HKT2<F, A, B>) => HKT2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableSemigroupoid2<F extends URIS2> {
  readonly compose: <E, A>(la: Kind2<F, E, A>) => <B>(ab: Kind2<F, A, B>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableSemigroupoid2C<F extends URIS2, E> {
  readonly compose: <A>(la: Kind2<F, E, A>) => <B>(ab: Kind2<F, A, B>) => Kind2<F, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableSemigroupoid3<F extends URIS3> {
  readonly compose: <R, E, A>(la: Kind3<F, R, E, A>) => <B>(ab: Kind3<F, R, A, B>) => Kind3<F, R, E, B>
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableSemigroupoid3C<F extends URIS3, E> {
  readonly compose: <R, A>(la: Kind3<F, R, E, A>) => <B>(ab: Kind3<F, R, A, B>) => Kind3<F, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableSemigroupoid4<F extends URIS4> {
  readonly compose: <S, R, E, A>(la: Kind4<F, S, R, E, A>) => <B>(ab: Kind4<F, S, R, A, B>) => Kind4<F, S, R, E, B>
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableMonadThrow<F> {
  readonly fromOption: <E>(onNone: LazyArg<E>) => <A>(ma: Option<A>) => HKT<F, A>
  readonly fromEither: <E, A>(ma: Either<E, A>) => HKT<F, A>
  readonly fromPredicate: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => HKT<F, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => HKT<F, A>
  }
  readonly filterOrElse: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: HKT<F, A>) => HKT<F, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: HKT<F, A>) => HKT<F, A>
  }
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableMonadThrow1<F extends URIS> {
  readonly fromOption: <E>(onNone: LazyArg<E>) => <A>(ma: Option<A>) => Kind<F, A>
  readonly fromEither: <E, A>(ma: Either<E, A>) => Kind<F, A>
  readonly fromPredicate: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Kind<F, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Kind<F, A>
  }
  readonly filterOrElse: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: Kind<F, A>) => Kind<F, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: Kind<F, A>) => Kind<F, A>
  }
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableMonadThrow2<F extends URIS2> {
  readonly fromOption: <E>(onNone: LazyArg<E>) => <A>(ma: Option<A>) => Kind2<F, E, A>
  readonly fromEither: <E, A>(ma: Either<E, A>) => Kind2<F, E, A>
  readonly fromPredicate: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, A>
  }
  readonly filterOrElse: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: Kind2<F, E, A>) => Kind2<F, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: Kind2<F, E, A>) => Kind2<F, E, A>
  }
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableMonadThrow2C<F extends URIS2, E> {
  readonly fromOption: (onNone: LazyArg<E>) => <A>(ma: Option<A>) => Kind2<F, E, A>
  readonly fromEither: <A>(ma: Either<E, A>) => Kind2<F, E, A>
  readonly fromPredicate: {
    <A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, B>
    <A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, A>
  }
  readonly filterOrElse: {
    <A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: Kind2<F, E, A>) => Kind2<F, E, B>
    <A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: Kind2<F, E, A>) => Kind2<F, E, A>
  }
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableMonadThrow3<F extends URIS3> {
  readonly fromOption: <E>(onNone: LazyArg<E>) => <R, A>(ma: Option<A>) => Kind3<F, R, E, A>
  readonly fromEither: <R, E, A>(ma: Either<E, A>) => Kind3<F, R, E, A>
  readonly fromPredicate: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <U>(a: A) => Kind3<F, U, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => Kind3<F, R, E, A>
  }
  readonly filterOrElse: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
      ma: Kind3<F, R, E, A>
    ) => Kind3<F, R, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  }
}
/**
 * @since 2.2.0
 * @deprecated
 */
export interface PipeableMonadThrow3C<F extends URIS3, E> {
  readonly fromOption: (onNone: LazyArg<E>) => <R, A>(ma: Option<A>) => Kind3<F, R, E, A>
  readonly fromEither: <R, A>(ma: Either<E, A>) => Kind3<F, R, E, A>
  readonly fromPredicate: {
    <A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <U>(a: A) => Kind3<F, U, E, B>
    <A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => Kind3<F, R, E, A>
  }
  readonly filterOrElse: {
    <A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
      ma: Kind3<F, R, E, A>
    ) => Kind3<F, R, E, B>
    <A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
  }
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export interface PipeableMonadThrow4<F extends URIS4> {
  readonly fromOption: <E>(onNone: LazyArg<E>) => <S, R, A>(ma: Option<A>) => Kind4<F, S, R, E, A>
  readonly fromEither: <S, R, E, A>(ma: Either<E, A>) => Kind4<F, S, R, E, A>
  readonly fromPredicate: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(a: A) => Kind4<F, S, R, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => Kind4<F, S, R, E, A>
  }
  readonly filterOrElse: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
      ma: Kind4<F, S, R, E, A>
    ) => Kind4<F, S, R, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(ma: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
  }
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare function pipeable<F extends URIS4, I>(
  I: {
    readonly URI: F
  } & I
): (I extends Chain4<F>
  ? PipeableChain4<F>
  : I extends Apply4<F>
  ? PipeableApply4<F>
  : I extends Functor4<F>
  ? PipeableFunctor4<F>
  : {}) &
  (I extends Contravariant4<F> ? PipeableContravariant4<F> : {}) &
  (I extends FunctorWithIndex4<F, infer Ix> ? PipeableFunctorWithIndex4<F, Ix> : {}) &
  (I extends Bifunctor4<F> ? PipeableBifunctor4<F> : {}) &
  (I extends Extend4<F> ? PipeableExtend4<F> : {}) &
  (I extends FoldableWithIndex4<F, infer Ix>
    ? PipeableFoldableWithIndex4<F, Ix>
    : I extends Foldable4<F>
    ? PipeableFoldable4<F>
    : {}) &
  (I extends Alt4<F> ? PipeableAlt4<F> : {}) &
  (I extends FilterableWithIndex4<F, infer Ix>
    ? PipeableFilterableWithIndex4<F, Ix>
    : I extends Filterable4<F>
    ? PipeableFilterable4<F>
    : I extends Compactable4<F>
    ? PipeableCompactable4<F>
    : {}) &
  (I extends Profunctor4<F> ? PipeableProfunctor4<F> : {}) &
  (I extends Semigroupoid4<F> ? PipeableSemigroupoid4<F> : {}) &
  (I extends MonadThrow4<F> ? PipeableMonadThrow4<F> : {})
/** @deprecated */
export declare function pipeable<F extends URIS3, I>(
  I: {
    readonly URI: F
  } & I
): (I extends Chain3<F>
  ? PipeableChain3<F>
  : I extends Apply3<F>
  ? PipeableApply3<F>
  : I extends Functor3<F>
  ? PipeableFunctor3<F>
  : {}) &
  (I extends Contravariant3<F> ? PipeableContravariant3<F> : {}) &
  (I extends FunctorWithIndex3<F, infer Ix> ? PipeableFunctorWithIndex3<F, Ix> : {}) &
  (I extends Bifunctor3<F> ? PipeableBifunctor3<F> : {}) &
  (I extends Extend3<F> ? PipeableExtend3<F> : {}) &
  (I extends FoldableWithIndex3<F, infer Ix>
    ? PipeableFoldableWithIndex3<F, Ix>
    : I extends Foldable3<F>
    ? PipeableFoldable3<F>
    : {}) &
  (I extends Alt3<F> ? PipeableAlt3<F> : {}) &
  (I extends FilterableWithIndex3<F, infer Ix>
    ? PipeableFilterableWithIndex3<F, Ix>
    : I extends Filterable3<F>
    ? PipeableFilterable3<F>
    : I extends Compactable3<F>
    ? PipeableCompactable3<F>
    : {}) &
  (I extends Profunctor3<F> ? PipeableProfunctor3<F> : {}) &
  (I extends Semigroupoid3<F> ? PipeableSemigroupoid3<F> : {}) &
  (I extends MonadThrow3<F> ? PipeableMonadThrow3<F> : {})
/** @deprecated */
export declare function pipeable<F extends URIS3, I, E>(
  I: {
    readonly URI: F
  } & I
): (I extends Chain3C<F, E>
  ? PipeableChain3C<F, E>
  : I extends Apply3C<F, E>
  ? PipeableApply3C<F, E>
  : I extends Functor3C<F, E>
  ? PipeableFunctor3C<F, E>
  : {}) &
  (I extends Contravariant3C<F, E> ? PipeableContravariant3C<F, E> : {}) &
  (I extends FunctorWithIndex3C<F, infer Ix, E> ? PipeableFunctorWithIndex3C<F, Ix, E> : {}) &
  (I extends Bifunctor3C<F, E> ? PipeableBifunctor3C<F, E> : {}) &
  (I extends Extend3C<F, E> ? PipeableExtend3C<F, E> : {}) &
  (I extends FoldableWithIndex3C<F, infer Ix, E>
    ? PipeableFoldableWithIndex3C<F, Ix, E>
    : I extends Foldable3C<F, E>
    ? PipeableFoldable3C<F, E>
    : {}) &
  (I extends Alt3C<F, E> ? PipeableAlt3C<F, E> : {}) &
  (I extends FilterableWithIndex3C<F, infer Ix, E>
    ? PipeableFilterableWithIndex3C<F, Ix, E>
    : I extends Filterable3C<F, E>
    ? PipeableFilterable3C<F, E>
    : I extends Compactable3C<F, E>
    ? PipeableCompactable3C<F, E>
    : {}) &
  (I extends Profunctor3C<F, E> ? PipeableProfunctor3C<F, E> : {}) &
  (I extends Semigroupoid3C<F, E> ? PipeableSemigroupoid3C<F, E> : {}) &
  (I extends MonadThrow3C<F, E> ? PipeableMonadThrow3C<F, E> : {})
/** @deprecated */
export declare function pipeable<F extends URIS2, I, E>(
  I: {
    readonly URI: F
    readonly _E: E
  } & I
): (I extends Chain2C<F, E>
  ? PipeableChain2C<F, E>
  : I extends Apply2C<F, E>
  ? PipeableApply2C<F, E>
  : I extends Functor2C<F, E>
  ? PipeableFunctor2C<F, E>
  : {}) &
  (I extends Contravariant2C<F, E> ? PipeableContravariant2C<F, E> : {}) &
  (I extends FunctorWithIndex2C<F, infer Ix, E> ? PipeableFunctorWithIndex2C<F, Ix, E> : {}) &
  (I extends Extend2C<F, E> ? PipeableExtend2C<F, E> : {}) &
  (I extends FoldableWithIndex2C<F, infer Ix, E>
    ? PipeableFoldableWithIndex2C<F, Ix, E>
    : I extends Foldable2C<F, E>
    ? PipeableFoldable2C<F, E>
    : {}) &
  (I extends Alt2C<F, E> ? PipeableAlt2C<F, E> : {}) &
  (I extends FilterableWithIndex2C<F, infer Ix, E>
    ? PipeableFilterableWithIndex2C<F, Ix, E>
    : I extends Filterable2C<F, E>
    ? PipeableFilterable2C<F, E>
    : I extends Compactable2C<F, E>
    ? PipeableCompactable2C<F, E>
    : {}) &
  (I extends Profunctor2C<F, E> ? PipeableProfunctor2C<F, E> : {}) &
  (I extends Semigroupoid2C<F, E> ? PipeableSemigroupoid2C<F, E> : {}) &
  (I extends MonadThrow2C<F, E> ? PipeableMonadThrow2C<F, E> : {})
/** @deprecated */
export declare function pipeable<F extends URIS2, I>(
  I: {
    readonly URI: F
  } & I
): (I extends Chain2<F>
  ? PipeableChain2<F>
  : I extends Apply2<F>
  ? PipeableApply2<F>
  : I extends Functor2<F>
  ? PipeableFunctor2<F>
  : {}) &
  (I extends Contravariant2<F> ? PipeableContravariant2<F> : {}) &
  (I extends FunctorWithIndex2<F, infer Ix> ? PipeableFunctorWithIndex2<F, Ix> : {}) &
  (I extends Bifunctor2<F> ? PipeableBifunctor2<F> : {}) &
  (I extends Extend2<F> ? PipeableExtend2<F> : {}) &
  (I extends FoldableWithIndex2<F, infer Ix>
    ? PipeableFoldableWithIndex2<F, Ix>
    : I extends Foldable2<F>
    ? PipeableFoldable2<F>
    : {}) &
  (I extends Alt2<F> ? PipeableAlt2<F> : {}) &
  (I extends FilterableWithIndex2<F, infer Ix>
    ? PipeableFilterableWithIndex2<F, Ix>
    : I extends Filterable2<F>
    ? PipeableFilterable2<F>
    : I extends Compactable2<F>
    ? PipeableCompactable2<F>
    : {}) &
  (I extends Profunctor2<F> ? PipeableProfunctor2<F> : {}) &
  (I extends Semigroupoid2<F> ? PipeableSemigroupoid2<F> : {}) &
  (I extends MonadThrow2<F> ? PipeableMonadThrow2<F> : {})
/** @deprecated */
export declare function pipeable<F extends URIS, I>(
  I: {
    readonly URI: F
  } & I
): (I extends Chain1<F>
  ? PipeableChain1<F>
  : I extends Apply1<F>
  ? PipeableApply1<F>
  : I extends Functor1<F>
  ? PipeableFunctor1<F>
  : {}) &
  (I extends Contravariant1<F> ? PipeableContravariant1<F> : {}) &
  (I extends FunctorWithIndex1<F, infer Ix> ? PipeableFunctorWithIndex1<F, Ix> : {}) &
  (I extends Extend1<F> ? PipeableExtend1<F> : {}) &
  (I extends FoldableWithIndex1<F, infer Ix>
    ? PipeableFoldableWithIndex1<F, Ix>
    : I extends Foldable1<F>
    ? PipeableFoldable1<F>
    : {}) &
  (I extends Alt1<F> ? PipeableAlt1<F> : {}) &
  (I extends FilterableWithIndex1<F, infer Ix>
    ? PipeableFilterableWithIndex1<F, Ix>
    : I extends Filterable1<F>
    ? PipeableFilterable1<F>
    : I extends Compactable1<F>
    ? PipeableCompactable1<F>
    : {}) &
  (I extends MonadThrow1<F> ? PipeableMonadThrow1<F> : {})
/** @deprecated */
export declare function pipeable<F, I>(
  I: {
    readonly URI: F
  } & I
): (I extends Chain<F>
  ? PipeableChain<F>
  : I extends Apply<F>
  ? PipeableApply<F>
  : I extends Functor<F>
  ? PipeableFunctor<F>
  : {}) &
  (I extends Contravariant<F> ? PipeableContravariant<F> : {}) &
  (I extends FunctorWithIndex<F, infer Ix> ? PipeableFunctorWithIndex<F, Ix> : {}) &
  (I extends Bifunctor<F> ? PipeableBifunctor<F> : {}) &
  (I extends Extend<F> ? PipeableExtend<F> : {}) &
  (I extends FoldableWithIndex<F, infer Ix>
    ? PipeableFoldableWithIndex<F, Ix>
    : I extends Foldable<F>
    ? PipeableFoldable<F>
    : {}) &
  (I extends Alt<F> ? PipeableAlt<F> : {}) &
  (I extends FilterableWithIndex<F, infer Ix>
    ? PipeableFilterableWithIndex<F, Ix>
    : I extends Filterable<F>
    ? PipeableFilterable<F>
    : I extends Compactable<F>
    ? PipeableCompactable<F>
    : {}) &
  (I extends Profunctor<F> ? PipeableProfunctor<F> : {}) &
  (I extends Semigroupoid<F> ? PipeableSemigroupoid<F> : {}) &
  (I extends MonadThrow<F> ? PipeableMonadThrow<F> : {})
/**
 * Use [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe) from `function` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
export declare const pipe: typeof pipeFromFunctionModule
