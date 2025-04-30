/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.3
 */
import * as E from 'fp-ts/es6/Either';
import { identity } from 'fp-ts/es6/function';
import { pipe } from 'fp-ts/es6/pipeable';
import * as t from './index';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.3
 */
export var literal = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return t.union(values.map(function (v) { return t.literal(v); }));
};
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.3
 */
export var string = t.string;
/**
 * @category primitives
 * @since 2.2.3
 */
export var number = new t.Type(t.number.name, t.number.is, function (u, c) {
    return pipe(t.number.decode(u), E.chain(function (n) { return (isNaN(n) ? t.failure(u, c) : t.success(n)); }));
}, t.number.encode);
/**
 * @category primitives
 * @since 2.2.3
 */
export var boolean = t.boolean;
/**
 * @category primitives
 * @since 2.2.3
 */
export var UnknownArray = t.UnknownArray;
/**
 * @category primitives
 * @since 2.2.3
 */
export var UnknownRecord = t.UnknownRecord;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.3
 */
export var refine = function (refinement, id) {
    return function (from) {
        // tslint:disable-next-line: deprecation
        return (t.refinement(from, refinement, id));
    };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export var nullable = function (or) { return t.union([t.null, or]); };
/**
 * @category combinators
 * @since 2.2.15
 */
export var struct = function (properties) {
    return t.type(properties);
};
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
export var partial = function (properties) {
    return t.partial(properties);
};
/**
 * @category combinators
 * @since 2.2.3
 */
export var record = function (codomain) { return t.record(t.string, codomain); };
/**
 * @category combinators
 * @since 2.2.3
 */
export var array = function (item) { return t.array(item); };
/**
 * @category combinators
 * @since 2.2.3
 */
export var tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return t.tuple(components);
};
/**
 * @category combinators
 * @since 2.2.3
 */
export var intersect = function (right) {
    return function (left) {
        return t.intersection([left, right]);
    };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export var lazy = function (id, f) { return t.recursion(id, f); };
/**
 * @category combinators
 * @since 2.2.15
 */
export var readonly = identity;
/**
 * @category combinators
 * @since 2.2.3
 */
export var sum = function (_tag) {
    return function (members) {
        return t.union(Object.values(members));
    };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export var union = function () {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return t.union(members);
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.3
 */
export var URI = 'io-ts/Type';
/**
 * @category instances
 * @since 2.2.8
 */
export var Schemable = {
    URI: URI,
    literal: literal,
    string: string,
    number: number,
    boolean: boolean,
    nullable: nullable,
    type: type,
    struct: struct,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersect: intersect,
    sum: sum,
    lazy: lazy,
    readonly: readonly
};
/**
 * @category instances
 * @since 2.2.8
 */
export var WithUnknownContainers = {
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord
};
/**
 * @category instances
 * @since 2.2.8
 */
export var WithUnion = {
    union: union
};
/**
 * @category instances
 * @since 2.2.8
 */
export var WithRefine = {
    refine: refine
};
