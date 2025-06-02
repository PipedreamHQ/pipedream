"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromTheseK = fromTheseK;
/**
 * The `FromThese` type class represents those data types which support errors and warnings.
 *
 * @since 2.11.0
 */
var function_1 = require("./function");
function fromTheseK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromThese); };
}
