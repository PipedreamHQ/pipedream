import { identity } from 'fp-ts/es6/function';
import { intersect_, memoize } from './Schemable';
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.3
 */
export function nullable(or) {
    return {
        encode: function (a) { return (a === null ? null : or.encode(a)); }
    };
}
/**
 * @category combinators
 * @since 2.2.15
 */
export function struct(properties) {
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
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.3
 * @deprecated
 */
export var type = struct;
/**
 * @category combinators
 * @since 2.2.3
 */
export function partial(properties) {
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
/**
 * @category combinators
 * @since 2.2.3
 */
export function record(codomain) {
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
/**
 * @category combinators
 * @since 2.2.3
 */
export function array(item) {
    return {
        encode: function (as) { return as.map(item.encode); }
    };
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return {
        encode: function (as) { return components.map(function (c, i) { return c.encode(as[i]); }); }
    };
}
/**
 * @category combinators
 * @since 2.2.3
 */
export var intersect = function (right) {
    return function (left) { return ({
        encode: function (ab) { return intersect_(left.encode(ab), right.encode(ab)); }
    }); };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export function sum(tag) {
    return function (members) {
        return {
            encode: function (a) { return members[a[tag]].encode(a); }
        };
    };
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function lazy(f) {
    var get = memoize(f);
    return {
        encode: function (a) { return get().encode(a); }
    };
}
/**
 * @category combinators
 * @since 2.2.16
 */
export var readonly = identity;
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
export var contramap = function (f) { return function (fa) {
    return contramap_(fa, f);
}; };
/**
 * @category Semigroupoid
 * @since 2.2.3
 */
export var compose = function (ea) { return function (ab) {
    return compose_(ab, ea);
}; };
/**
 * @category Category
 * @since 2.2.3
 */
export function id() {
    return {
        encode: identity
    };
}
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.3
 */
export var URI = 'io-ts/Encoder';
/**
 * @category instances
 * @since 2.2.8
 */
export var Contravariant = {
    URI: URI,
    contramap: contramap_
};
/**
 * @category instances
 * @since 2.2.8
 */
export var Category = {
    URI: URI,
    compose: compose_,
    id: id
};
