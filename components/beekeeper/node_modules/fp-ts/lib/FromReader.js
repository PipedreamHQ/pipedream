"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = ask;
exports.asks = asks;
exports.fromReaderK = fromReaderK;
exports.chainReaderK = chainReaderK;
exports.chainFirstReaderK = chainFirstReaderK;
exports.tapReader = tapReader;
/**
 * Lift a computation from the `Reader` monad.
 *
 * @since 2.11.0
 */
var Chain_1 = require("./Chain");
var function_1 = require("./function");
var R = __importStar(require("./Reader"));
function ask(F) {
    return function () { return F.fromReader(R.ask()); };
}
function asks(F) {
    return F.fromReader;
}
function fromReaderK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromReader); };
}
function chainReaderK(F, M) {
    var fromReaderKF = fromReaderK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromReaderKF(f)); }; };
}
function chainFirstReaderK(F, M) {
    var tapM = tapReader(F, M);
    return function (f) { return function (self) { return tapM(self, f); }; };
}
/** @internal */
function tapReader(F, M) {
    var tapM = (0, Chain_1.tap)(M);
    return function (self, f) { return tapM(self, (0, function_1.flow)(f, F.fromReader)); };
}
