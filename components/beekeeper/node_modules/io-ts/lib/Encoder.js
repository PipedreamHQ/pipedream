"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Contravariant = exports.URI = exports.id = exports.compose = exports.contramap = exports.readonly = exports.lazy = exports.sum = exports.intersect = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.struct = exports.nullable = void 0;
var function_1 = require("fp-ts/lib/function");
var Schemable_1 = require("./Schemable");
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.3
 */
function nullable(or) {
    return {
        encode: function (a) { return (a === null ? null : or.encode(a)); }
    };
}
exports.nullable = nullable;
/**
 * @category combinators
 * @since 2.2.15
 */
function struct(properties) {
    return {
        encode: function (a) {
            var o = {};
            for (var k in properties) {
                o[k] = properties[k].encode(a[k]);
            }
            return o;
        }
    };
}
exports.struct = struct;
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.3
 * @deprecated
 */
exports.type = struct;
/**
 * @category combinators
 * @since 2.2.3
 */
function partial(properties) {
    return {
        encode: function (a) {
            var o = {};
            for (var k in properties) {
                var v = a[k];
                // don't add missing properties
                if (k in a) {
                    // don't strip undefined properties
                    o[k] = v === undefined ? undefined : properties[k].encode(v);
                }
            }
            return o;
        }
    };
}
exports.partial = partial;
/**
 * @category combinators
 * @since 2.2.3
 */
function record(codomain) {
    return {
        encode: function (r) {
            var o = {};
            for (var k in r) {
                o[k] = codomain.encode(r[k]);
            }
            return o;
        }
    };
}
exports.record = record;
/**
 * @category combinators
 * @since 2.2.3
 */
function array(item) {
    return {
        encode: function (as) { return as.map(item.encode); }
    };
}
exports.array = array;
/**
 * @category combinators
 * @since 2.2.3
 */
function tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return {
        encode: function (as) { return components.map(function (c, i) { return c.encode(as[i]); }); }
    };
}
exports.tuple = tuple;
/**
 * @category combinators
 * @since 2.2.3
 */
var intersect = function (right) {
    return function (left) { return ({
        encode: function (ab) { return (0, Schemable_1.intersect_)(left.encode(ab), right.encode(ab)); }
    }); };
};
exports.intersect = intersect;
/**
 * @category combinators
 * @since 2.2.3
 */
function sum(tag) {
    return function (members) {
        return {
            encode: function (a) { return members[a[tag]].encode(a); }
        };
    };
}
exports.sum = sum;
/**
 * @category combinators
 * @since 2.2.3
 */
function lazy(f) {
    var get = (0, Schemable_1.memoize)(f);
    return {
        encode: function (a) { return get().encode(a); }
    };
}
exports.lazy = lazy;
/**
 * @category combinators
 * @since 2.2.16
 */
exports.readonly = function_1.identity;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var contramap_ = function (ea, f) { return ({
    encode: function (b) { return ea.encode(f(b)); }
}); };
var compose_ = function (ab, ea) { return contramap_(ea, ab.encode); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.2.3
 */
var contramap = function (f) { return function (fa) {
    return contramap_(fa, f);
}; };
exports.contramap = contramap;
/**
 * @category Semigroupoid
 * @since 2.2.3
 */
var compose = function (ea) { return function (ab) {
    return compose_(ab, ea);
}; };
exports.compose = compose;
/**
 * @category Category
 * @since 2.2.3
 */
function id() {
    return {
        encode: function_1.identity
    };
}
exports.id = id;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.3
 */
exports.URI = 'io-ts/Encoder';
/**
 * @category instances
 * @since 2.2.8
 */
exports.Contravariant = {
    URI: exports.URI,
    contramap: contramap_
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.Category = {
    URI: exports.URI,
    compose: compose_,
    id: id
};
