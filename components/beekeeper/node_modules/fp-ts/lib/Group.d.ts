/**
 * A `Group` is a `Monoid` with inverses. Instances must satisfy the following law in addition to the monoid laws:
 *
 * - Inverse: `concat(inverse(a), a) <-> empty = concat(a, inverse(a))`
 *
 * @since 2.0.0
 */
import { Monoid } from './Monoid'
/**
 * @category model
 * @since 2.0.0
 */
export interface Group<A> extends Monoid<A> {
  readonly inverse: (a: A) => A
}
