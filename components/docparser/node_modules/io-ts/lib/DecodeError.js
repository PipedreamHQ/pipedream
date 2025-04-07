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
exports.getSemigroup = exports.fold = exports.wrap = exports.lazy = exports.member = exports.index = exports.key = exports.leaf = exports.optional = exports.required = void 0;
var FS = __importStar(require("./FreeSemigroup"));
/**
 * @category model
 * @since 2.2.7
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const
exports.required = 'required';
/**
 * @category model
 * @since 2.2.7
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const
exports.optional = 'optional';
/**
 * @category constructors
 * @since 2.2.7
 */
var leaf = function (actual, error) { return ({ _tag: 'Leaf', actual: actual, error: error }); };
exports.leaf = leaf;
/**
 * @category constructors
 * @since 2.2.7
 */
var key = function (key, kind, errors) { return ({
    _tag: 'Key',
    key: key,
    kind: kind,
    errors: errors
}); };
exports.key = key;
/**
 * @category constructors
 * @since 2.2.7
 */
var index = function (index, kind, errors) { return ({
    _tag: 'Index',
    index: index,
    kind: kind,
    errors: errors
}); };
exports.index = index;
/**
 * @category constructors
 * @since 2.2.7
 */
var member = function (index, errors) { return ({
    _tag: 'Member',
    index: index,
    errors: errors
}); };
exports.member = member;
/**
 * @category constructors
 * @since 2.2.7
 */
var lazy = function (id, errors) { return ({
    _tag: 'Lazy',
    id: id,
    errors: errors
}); };
exports.lazy = lazy;
/**
 * @category constructors
 * @since 2.2.9
 */
var wrap = function (error, errors) { return ({
    _tag: 'Wrap',
    error: error,
    errors: errors
}); };
exports.wrap = wrap;
/**
 * @category destructors
 * @since 2.2.7
 */
var fold = function (patterns) {
    var f = function (e) {
        switch (e._tag) {
            case 'Leaf':
                return patterns.Leaf(e.actual, e.error);
            case 'Key':
                return patterns.Key(e.key, e.kind, e.errors);
            case 'Index':
                return patterns.Index(e.index, e.kind, e.errors);
            case 'Member':
                return patterns.Member(e.index, e.errors);
            case 'Lazy':
                return patterns.Lazy(e.id, e.errors);
            case 'Wrap':
                return patterns.Wrap(e.error, e.errors);
        }
    };
    return f;
};
exports.fold = fold;
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return FS.getSemigroup();
}
exports.getSemigroup = getSemigroup;
