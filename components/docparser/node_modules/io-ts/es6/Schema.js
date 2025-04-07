import { memoize } from './Schemable';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.0
 */
export function make(schema) {
    return memoize(schema);
}
export function interpreter(S) {
    return function (schema) { return schema(S); };
}
