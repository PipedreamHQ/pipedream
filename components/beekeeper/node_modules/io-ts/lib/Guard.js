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
exports.WithRefine = exports.WithUnion = exports.WithUnknownContainers = exports.Schemable = exports.URI = exports.id = exports.compose = exports.zero = exports.alt = exports.readonly = exports.lazy = exports.sum = exports.union = exports.intersect = exports.tuple = exports.record = exports.array = exports.partial = exports.type = exports.struct = exports.nullable = exports.refine = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.literal = void 0;
/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.0
 */
var function_1 = require("fp-ts/lib/function");
var pipeable_1 = require("fp-ts/lib/pipeable");
var S = __importStar(require("./Schemable"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.0
 */
var literal = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return values.findIndex(function (a) { return a === u; }) !== -1; }
    });
};
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.0
 */
exports.string = {
    is: function (u) { return typeof u === 'string'; }
};
/**
 * Note: `NaN` is excluded.
 *
 * @category primitives
 * @since 2.2.0
 */
exports.number = {
    is: function (u) { return typeof u === 'number' && !isNaN(u); }
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.boolean = {
    is: function (u) { return typeof u === 'boolean'; }
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.UnknownArray = {
    is: Array.isArray
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.UnknownRecord = {
    is: function (u) { return u !== null && typeof u === 'object' && !Array.isArray(u); }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.0
 */
var refine = function (refinement) {
    return function (from) { return ({
        is: function (i) { return from.is(i) && refinement(i); }
    }); };
};
exports.refine = refine;
/**
 * @category combinators
 * @since 2.2.0
 */
var nullable = function (or) { return ({
    is: function (i) { return i === null || or.is(i); }
}); };
exports.nullable = nullable;
/**
 * @category combinators
 * @since 2.2.15
 */
var struct = function (properties) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.refine)(function (r) {
        for (var k in properties) {
            if (!(k in r) || !properties[k].is(r[k])) {
                return false;
            }
        }
        return true;
    }));
};
exports.struct = struct;
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.0
 * @deprecated
 */
exports.type = exports.struct;
/**
 * @category combinators
 * @since 2.2.0
 */
var partial = function (properties) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.refine)(function (r) {
        for (var k in properties) {
            var v = r[k];
            if (v !== undefined && !properties[k].is(v)) {
                return false;
            }
        }
        return true;
    }));
};
exports.partial = partial;
/**
 * @category combinators
 * @since 2.2.0
 */
var array = function (item) {
    return (0, pipeable_1.pipe)(exports.UnknownArray, (0, exports.refine)(function (us) { return us.every(item.is); }));
};
exports.array = array;
/**
 * @category combinators
 * @since 2.2.0
 */
var record = function (codomain) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.refine)(function (r) {
        for (var k in r) {
            if (!codomain.is(r[k])) {
                return false;
            }
        }
        return true;
    }));
};
exports.record = record;
/**
 * @category combinators
 * @since 2.2.0
 */
var tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return Array.isArray(u) && u.length === components.length && components.every(function (c, i) { return c.is(u[i]); }); }
    });
};
exports.tuple = tuple;
/**
 * @category combinators
 * @since 2.2.0
 */
var intersect = function (right) {
    return function (left) { return ({
        is: function (u) { return left.is(u) && right.is(u); }
    }); };
};
exports.intersect = intersect;
/**
 * @category combinators
 * @since 2.2.0
 */
var union = function () {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return members.some(function (m) { return m.is(u); }); }
    });
};
exports.union = union;
/**
 * @category combinators
 * @since 2.2.0
 */
var sum = function (tag) {
    return function (members) {
        return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.refine)(function (r) {
            var v = r[tag];
            if (v in members) {
                return members[v].is(r);
            }
            return false;
        }));
    };
};
exports.sum = sum;
/**
 * @category combinators
 * @since 2.2.0
 */
var lazy = function (f) {
    var get = S.memoize(f);
    return {
        is: function (u) { return get().is(u); }
    };
};
exports.lazy = lazy;
/**
 * @category combinators
 * @since 2.2.15
 */
exports.readonly = function_1.identity;
/**
 * @category combinators
 * @since 2.2.8
 */
var alt = function (that) {
    return function (me) { return ({
        is: function (i) { return me.is(i) || that().is(i); }
    }); };
};
exports.alt = alt;
/**
 * @category combinators
 * @since 2.2.8
 */
var zero = function () { return ({
    is: function (_) { return false; }
}); };
exports.zero = zero;
/**
 * @category combinators
 * @since 2.2.8
 */
var compose = function (to) {
    return function (from) { return ({
        is: function (i) { return from.is(i) && to.is(i); }
    }); };
};
exports.compose = compose;
/**
 * @category combinators
 * @since 2.2.8
 */
var id = function () { return ({
    is: function (_) { return true; }
}); };
exports.id = id;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.0
 */
exports.URI = 'io-ts/Guard';
/**
 * @category instances
 * @since 2.2.8
 */
exports.Schemable = {
    URI: exports.URI,
    literal: exports.literal,
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    nullable: exports.nullable,
    type: exports.type,
    struct: exports.struct,
    partial: exports.partial,
    record: exports.record,
    array: exports.array,
    tuple: exports.tuple,
    intersect: exports.intersect,
    sum: exports.sum,
    lazy: function (_, f) { return (0, exports.lazy)(f); },
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
exports.WithUnion = {
    union: exports.union
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.WithRefine = {
    refine: exports.refine
};
