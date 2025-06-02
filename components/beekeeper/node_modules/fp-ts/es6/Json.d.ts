/**
 * @since 2.10.0
 */
import { Either } from './Either'
/**
 * @since 2.10.0
 */
export type Json = boolean | number | string | null | JsonArray | JsonRecord
/**
 * @since 2.10.0
 */
export interface JsonRecord {
  readonly [key: string]: Json
}
/**
 * @since 2.10.0
 */
export interface JsonArray extends ReadonlyArray<Json> {}
/**
 * Converts a JavaScript Object Notation (JSON) string into a `Json` type.
 *
 * @example
 * import * as J from 'fp-ts/Json'
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('{"a":1}', J.parse), E.right({ a: 1 }))
 * assert.deepStrictEqual(pipe('{"a":}', J.parse), E.left(new SyntaxError(`Unexpected token '}', "{"a":}" is not valid JSON`)))
 *
 * @since 2.10.0
 */
export declare const parse: (s: string) => Either<unknown, Json>
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import * as J from 'fp-ts/Json'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(J.stringify({ a: 1 }), E.right('{"a":1}'))
 * const circular: any = { ref: null }
 * circular.ref = circular
 * assert.deepStrictEqual(
 *   pipe(
 *     J.stringify(circular),
 *     E.mapLeft(e => e instanceof Error && e.message.includes('Converting circular structure to JSON'))
 *   ),
 *   E.left(true)
 * )
 *
 *  @since 2.10.0
 */
export declare const stringify: <A>(a: A) => Either<unknown, string>
