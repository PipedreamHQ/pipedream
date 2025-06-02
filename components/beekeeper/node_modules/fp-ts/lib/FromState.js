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
exports.get = get;
exports.put = put;
exports.modify = modify;
exports.gets = gets;
exports.fromStateK = fromStateK;
exports.chainStateK = chainStateK;
var function_1 = require("./function");
var S = __importStar(require("./State"));
function get(F) {
    return function () { return F.fromState(S.get()); };
}
function put(F) {
    return function (s) { return F.fromState(S.put(s)); };
}
function modify(F) {
    return (0, function_1.flow)(S.modify, F.fromState);
}
function gets(F) {
    return (0, function_1.flow)(S.gets, F.fromState);
}
function fromStateK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromState); };
}
function chainStateK(F, M) {
    var fromStateKF = fromStateK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromStateKF(f)); }; };
}
