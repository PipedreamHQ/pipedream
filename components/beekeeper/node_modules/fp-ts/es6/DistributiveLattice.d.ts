/**
 * A `DistributiveLattice` must satisfy the following laws in addition to `Lattice` laws:
 *
 * - Distributivity for meet: `a ∨ (b ∧ c) <-> (a ∨ b) ∧ (a ∨ c)`
 * - Distributivity for join: `a ∧ (b ∨ c) <-> (a ∧ b) ∨ (a ∧ c)`
 *
 * @since 2.0.0
 */
import { Lattice } from './Lattice'
import { Ord } from './Ord'
/**
 * @category model
 * @since 2.0.0
 */
export interface DistributiveLattice<A> extends Lattice<A> {}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare function getMinMaxDistributiveLattice<A>(O: Ord<A>): DistributiveLattice<A>
