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
exports.getValidationM = getValidationM;
/**
 * @since 2.0.0
 */
var Applicative_1 = require("./Applicative");
var E = __importStar(require("./Either"));
var _ = __importStar(require("./internal"));
/** @deprecated */
function getValidationM(S, M) {
    var A = (0, Applicative_1.getApplicativeComposition)(M, E.getApplicativeValidation(S));
    return {
        map: A.map,
        ap: A.ap,
        of: A.of,
        chain: function (ma, f) { return M.chain(ma, function (e) { return (_.isLeft(e) ? M.of(_.left(e.left)) : f(e.right)); }); },
        alt: function (me, that) {
            return M.chain(me, function (e1) {
                return _.isRight(e1) ? M.of(e1) : M.map(that(), function (e2) { return (_.isLeft(e2) ? _.left(S.concat(e1.left, e2.left)) : e2); });
            });
        }
    };
}
