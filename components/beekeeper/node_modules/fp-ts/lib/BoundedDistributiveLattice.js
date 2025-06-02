"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinMaxBoundedDistributiveLattice = getMinMaxBoundedDistributiveLattice;
var DistributiveLattice_1 = require("./DistributiveLattice");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
function getMinMaxBoundedDistributiveLattice(O) {
    var L = (0, DistributiveLattice_1.getMinMaxDistributiveLattice)(O);
    return function (min, max) { return ({
        join: L.join,
        meet: L.meet,
        zero: min,
        one: max
    }); };
}
