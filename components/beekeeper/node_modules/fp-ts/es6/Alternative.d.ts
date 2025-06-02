/**
 * The `Alternative` type class extends the `Alt` type class with a value that should be the left and right identity for `alt`.
 *
 * It is similar to `Monoid`, except that it applies to types of kind `* -> *`, like `Array` or `Option`, rather than
 * concrete types like `string` or `number`.
 *
 * `Alternative` instances should satisfy the following laws:
 *
 * 1. Left identity: `A.alt(zero, fa) <-> fa`
 * 2. Right identity: `A.alt(fa, zero) <-> fa`
 * 3. Annihilation: `A.map(zero, f) <-> zero`
 * 4. Distributivity: `A.ap(A.alt(fab, gab), fa) <-> A.alt(A.ap(fab, fa), A.ap(gab, fa))`
 * 5. Annihilation: `A.ap(zero, fa) <-> zero`
 *
 * @since 2.0.0
 */
import { Alt, Alt1, Alt2, Alt2C, Alt3, Alt3C, Alt4 } from './Alt'
import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4
} from './Applicative'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
import { Monoid } from './Monoid'
import { Semigroup } from './Semigroup'
import { Zero, Zero1, Zero2, Zero2C, Zero3, Zero3C, Zero4 } from './Zero'
/**
 * @category model
 * @since 2.0.0
 */
export interface Alternative<F> extends Applicative<F>, Alt<F>, Zero<F> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Alternative1<F extends URIS> extends Applicative1<F>, Alt1<F>, Zero1<F> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Alternative2<F extends URIS2> extends Applicative2<F>, Alt2<F>, Zero2<F> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Alternative2C<F extends URIS2, E> extends Applicative2C<F, E>, Alt2C<F, E>, Zero2C<F, E> {}
/**
 * @category model
 * @since 2.0.0
 */
export interface Alternative3<F extends URIS3> extends Applicative3<F>, Alt3<F>, Zero3<F> {}
/**
 * @category model
 * @since 2.10.0
 */
export interface Alternative3C<F extends URIS3, E> extends Applicative3C<F, E>, Alt3C<F, E>, Zero3C<F, E> {}
/**
 * @category model
 * @since 2.10.0
 */
export interface Alternative4<F extends URIS4> extends Applicative4<F>, Alt4<F>, Zero4<F> {}
/**
 * @since 2.11.0
 */
export declare function altAll<F extends URIS4>(
  F: Alternative4<F>
): <S, R, E, A>(as: ReadonlyArray<Kind4<F, S, R, E, A>>) => Kind4<F, S, R, E, A>
export declare function altAll<F extends URIS3>(
  F: Alternative3<F>
): <R, E, A>(as: ReadonlyArray<Kind3<F, R, E, A>>) => Kind3<F, R, E, A>
export declare function altAll<F extends URIS3, E>(
  F: Alternative3C<F, E>
): <R, A>(as: ReadonlyArray<Kind3<F, R, E, A>>) => Kind3<F, R, E, A>
export declare function altAll<F extends URIS2>(
  F: Alternative2<F>
): <E, A>(as: ReadonlyArray<Kind2<F, E, A>>) => Kind2<F, E, A>
export declare function altAll<F extends URIS2, E>(
  F: Alternative2C<F, E>
): <A>(as: ReadonlyArray<Kind2<F, E, A>>) => Kind2<F, E, A>
export declare function altAll<F extends URIS>(F: Alternative1<F>): <A>(as: ReadonlyArray<Kind<F, A>>) => Kind<F, A>
export declare function altAll<F>(F: Alternative<F>): <A>(as: ReadonlyArray<HKT<F, A>>) => HKT<F, A>
/**
 * Lift a semigroup into a monoid alternative 'F', the inner values are concatenated using the provided `Semigroup`.
 * @since 2.13.0
 */
export declare function getAlternativeMonoid<F extends URIS4>(
  F: Alternative4<F>
): <A, S, R, E>(S: Semigroup<A>) => Monoid<Kind4<F, S, R, E, A>>
export declare function getAlternativeMonoid<F extends URIS3>(
  F: Alternative3<F>
): <A, R, E>(S: Semigroup<A>) => Monoid<Kind3<F, R, E, A>>
export declare function getAlternativeMonoid<F extends URIS3, E>(
  F: Alternative3C<F, E>
): <A, R>(S: Semigroup<A>) => Monoid<Kind3<F, R, E, A>>
export declare function getAlternativeMonoid<F extends URIS2>(
  F: Alternative2<F>
): <A, E>(S: Semigroup<A>) => Monoid<Kind2<F, E, A>>
export declare function getAlternativeMonoid<F extends URIS2, E>(
  F: Alternative2C<F, E>
): <A>(S: Semigroup<A>) => Monoid<Kind2<F, E, A>>
export declare function getAlternativeMonoid<F extends URIS>(
  F: Alternative1<F>
): <A>(S: Semigroup<A>) => Monoid<Kind<F, A>>
export declare function getAlternativeMonoid<F>(F: Alternative<F>): <A>(S: Semigroup<A>) => Monoid<HKT<F, A>>
