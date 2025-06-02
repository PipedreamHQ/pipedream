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
import * as A from 'fp-ts/es6/Array';
import * as E from 'fp-ts/es6/Eq';
import { identity } from 'fp-ts/es6/function';
import * as R from 'fp-ts/es6/Record';
import { memoize } from './Schemable';
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.2
 */
export var string = E.eqString;
/**
 * @category primitives
 * @since 2.2.2
 */
export var number = E.eqNumber;
/**
 * @category primitives
 * @since 2.2.2
 */
export var boolean = E.eqBoolean;
/**
 * @category primitives
 * @since 2.2.2
 */
export var UnknownArray = E.fromEquals(function (x, y) { return x.length === y.length; });
/**
 * @category primitives
 * @since 2.2.2
 */
export var UnknownRecord = E.fromEquals(function (x, y) {
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
export function nullable(or) {
    return {
        equals: function (x, y) { return (x === null || y === null ? x === y : or.equals(x, y)); }
    };
}
/**
 * @category combinators
 * @since 2.2.15
 */
export var struct = E.getStructEq;
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.2
 * @deprecated
 */
export var type = struct;
/**
 * @category combinators
 * @since 2.2.2
 */
export function partial(properties) {
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
/**
 * @category combinators
 * @since 2.2.2
 */
export var record = R.getEq;
/**
 * @category combinators
 * @since 2.2.2
 */
export var array = A.getEq;
/**
 * @category combinators
 * @since 2.2.2
 */
export var tuple = E.getTupleEq;
/**
 * @category combinators
 * @since 2.2.2
 */
export var intersect = function (right) {
    return function (left) { return ({
        equals: function (x, y) { return left.equals(x, y) && right.equals(x, y); }
    }); };
};
/**
 * @category combinators
 * @since 2.2.2
 */
export function sum(tag) {
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
/**
 * @category combinators
 * @since 2.2.2
 */
export function lazy(f) {
    var get = memoize(f);
    return {
        equals: function (x, y) { return get().equals(x, y); }
    };
}
/**
 * @category combinators
 * @since 2.2.15
 */
export var readonly = identity;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.8
 */
export var Schemable = {
    URI: E.URI,
    literal: function () { return E.eqStrict; },
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
    lazy: function (_, f) { return lazy(f); },
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
export var WithRefine = {
    refine: function () { return function (from) { return from; }; }
};
