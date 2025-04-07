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
exports.WithRefine = exports.WithUnknownContainers = exports.Schemable = exports.readonly = exports.lazy = exports.sum = exports.intersect = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.struct = exports.nullable = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = void 0;
/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.2
 */
var A = __importStar(require("fp-ts/lib/Array"));
var E = __importStar(require("fp-ts/lib/Eq"));
var function_1 = require("fp-ts/lib/function");
var R = __importStar(require("fp-ts/lib/Record"));
var Schemable_1 = require("./Schemable");
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.2
 */
exports.string = E.eqString;
/**
 * @category primitives
 * @since 2.2.2
 */
exports.number = E.eqNumber;
/**
 * @category primitives
 * @since 2.2.2
 */
exports.boolean = E.eqBoolean;
/**
 * @category primitives
 * @since 2.2.2
 */
exports.UnknownArray = E.fromEquals(function (x, y) { return x.length === y.length; });
/**
 * @category primitives
 * @since 2.2.2
 */
exports.UnknownRecord = E.fromEquals(function (x, y) {
    for (var k in x) {
        if (!(k in y)) {
            return false;
        }
    }
    for (var k in y) {
        if (!(k in x)) {
            return false;
        }
    }
    return true;
});
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.2
 */
function nullable(or) {
    return {
        equals: function (x, y) { return (x === null || y === null ? x === y : or.equals(x, y)); }
    };
}
exports.nullable = nullable;
/**
 * @category combinators
 * @since 2.2.15
 */
exports.struct = E.getStructEq;
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.2
 * @deprecated
 */
exports.type = exports.struct;
/**
 * @category combinators
 * @since 2.2.2
 */
function partial(properties) {
    return {
        equals: function (x, y) {
            for (var k in properties) {
                var xk = x[k];
                var yk = y[k];
                if (!(xk === undefined || yk === undefined ? xk === yk : properties[k].equals(xk, yk))) {
                    return false;
                }
            }
            return true;
        }
    };
}
exports.partial = partial;
/**
 * @category combinators
 * @since 2.2.2
 */
exports.record = R.getEq;
/**
 * @category combinators
 * @since 2.2.2
 */
exports.array = A.getEq;
/**
 * @category combinators
 * @since 2.2.2
 */
exports.tuple = E.getTupleEq;
/**
 * @category combinators
 * @since 2.2.2
 */
var intersect = function (right) {
    return function (left) { return ({
        equals: function (x, y) { return left.equals(x, y) && right.equals(x, y); }
    }); };
};
exports.intersect = intersect;
/**
 * @category combinators
 * @since 2.2.2
 */
function sum(tag) {
    return function (members) {
        return {
            equals: function (x, y) {
                var vx = x[tag];
                var vy = y[tag];
                if (vx !== vy) {
                    return false;
                }
                return members[vx].equals(x, y);
            }
        };
    };
}
exports.sum = sum;
/**
 * @category combinators
 * @since 2.2.2
 */
function lazy(f) {
    var get = (0, Schemable_1.memoize)(f);
    return {
        equals: function (x, y) { return get().equals(x, y); }
    };
}
exports.lazy = lazy;
/**
 * @category combinators
 * @since 2.2.15
 */
exports.readonly = function_1.identity;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.8
 */
exports.Schemable = {
    URI: E.URI,
    literal: function () { return E.eqStrict; },
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    nullable: nullable,
    type: exports.type,
    struct: exports.struct,
    partial: partial,
    record: exports.record,
    array: exports.array,
    tuple: exports.tuple,
    intersect: exports.intersect,
    sum: sum,
    lazy: function (_, f) { return lazy(f); },
    readonly: exports.readonly
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.WithUnknownContainers = {
    UnknownArray: exports.UnknownArray,
    UnknownRecord: exports.UnknownRecord
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.WithRefine = {
    refine: function () { return function (from) { return from; }; }
};
