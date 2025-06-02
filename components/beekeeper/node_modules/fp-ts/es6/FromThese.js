/**
 * The `FromThese` type class represents those data types which support errors and warnings.
 *
 * @since 2.11.0
 */
import { flow } from './function';
export function fromTheseK(F) {
    return function (f) { return flow(f, F.fromThese); };
}
