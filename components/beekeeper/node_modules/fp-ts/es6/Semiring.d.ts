/**
 * @category model
 * @since 2.0.0
 */
export interface Semiring<A> {
  readonly add: (x: A, y: A) => A
  readonly zero: A
  readonly mul: (x: A, y: A) => A
  readonly one: A
}
/**
 * Use [`getSemiring`](./function.ts.html#getsemiring) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getFunctionSemiring: <A, B>(S: Semiring<B>) => Semiring<(a: A) => B>
