"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpreter = exports.make = void 0;
var Schemable_1 = require("./Schemable");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.0
 */
function make(schema) {
    return (0, Schemable_1.memoize)(schema);
}
exports.make = make;
function interpreter(S) {
    return function (schema) { return schema(S); };
}
exports.interpreter = interpreter;
