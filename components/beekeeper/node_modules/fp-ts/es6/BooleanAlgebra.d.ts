import { HeytingAlgebra } from './HeytingAlgebra'
/**
 * @category model
 * @since 2.0.0
 */
export interface BooleanAlgebra<A> extends HeytingAlgebra<A> {}
/**
 * Every boolean algebras has a dual algebra, which involves reversing one/zero as well as join/meet.
 *
 * @since 2.10.0
 */
export declare const reverse: <A>(B: BooleanAlgebra<A>) => BooleanAlgebra<A>
/**
 * @category instances
 * @since 2.0.0
 */
export declare const booleanAlgebraVoid: BooleanAlgebra<void>
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getDualBooleanAlgebra: <A>(B: BooleanAlgebra<A>) => BooleanAlgebra<A>
/**
 * Use [`BooleanAlgebra`](./boolean.ts.html#booleanalgebra) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const booleanAlgebraBoolean: BooleanAlgebra<boolean>
/**
 * Use [`getBooleanAlgebra`](./function.ts.html#getbooleanalgebra) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export declare const getFunctionBooleanAlgebra: <B>(
  B: BooleanAlgebra<B>
) => <A = never>() => BooleanAlgebra<(a: A) => B>
