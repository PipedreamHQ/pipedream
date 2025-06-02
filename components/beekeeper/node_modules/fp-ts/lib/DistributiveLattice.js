"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinMaxDistributiveLattice = getMinMaxDistributiveLattice;
var Ord_1 = require("./Ord");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
function getMinMaxDistributiveLattice(O) {
    return {
        meet: (0, Ord_1.min)(O),
        join: (0, Ord_1.max)(O)
    };
}
