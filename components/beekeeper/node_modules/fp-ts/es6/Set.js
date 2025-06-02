import { identity } from './function';
import * as RS from './ReadonlySet';
import { separated } from './Separated';
/**
 * @category instances
 * @since 2.0.0
 */
export var getShow = RS.getShow;
/**
 * @category instances
 * @since 2.0.0
 */
export var getEq = RS.getEq;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @since 2.0.0
 */
export function map(E) {
    var elemE = elem(E);
    return function (f) { return function (set) {
        var r = new Set();
        set.forEach(function (e) {
            var v = f(e);
            if (!elemE(v, r)) {
                r.add(v);
            }
        });
        return r;
    }; };
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @since 2.0.0
 */
export function chain(E) {
    var elemE = elem(E);
    return function (f) { return function (set) {
        var r = new Set();
        set.forEach(function (e) {
            f(e).forEach(function (e) {
                if (!elemE(e, r)) {
                    r.add(e);
                }
            });
        });
        return r;
    }; };
}
export function filter(predicate) {
    return function (set) {
        var values = set.values();
        var e;
        var r = new Set();
        while (!(e = values.next()).done) {
            var a = e.value;
            if (predicate(a)) {
                r.add(a);
            }
        }
        return r;
    };
}
export function partition(predicate) {
    return function (set) {
        var values = set.values();
        var e;
        var right = new Set();
        var left = new Set();
        while (!(e = values.next()).done) {
            var a = e.value;
            if (predicate(a)) {
                right.add(a);
            }
            else {
                left.add(a);
            }
        }
        return separated(left, right);
    };
}
export function union(E) {
    var elemE = elem(E);
    return function (me, that) {
        if (that === undefined) {
            var unionE_1 = union(E);
            return function (that) { return unionE_1(me, that); };
        }
        if (isEmpty(me)) {
            return that;
        }
        if (isEmpty(that)) {
            return me;
        }
        var r = new Set(me);
        that.forEach(function (e) {
            if (!elemE(e, r)) {
                r.add(e);
            }
        });
        return r;
    };
}
export function intersection(E) {
    var elemE = elem(E);
    return function (me, that) {
        if (that === undefined) {
            var intersectionE_1 = intersection(E);
            return function (that) { return intersectionE_1(that, me); };
        }
        if (isEmpty(me) || isEmpty(that)) {
            return new Set();
        }
        var r = new Set();
        me.forEach(function (e) {
            if (elemE(e, that)) {
                r.add(e);
            }
        });
        return r;
    };
}
/**
 * @since 2.0.0
 */
export function partitionMap(EB, EC) {
    return function (f) {
        return function (set) {
            var values = set.values();
            var e;
            var left = new Set();
            var right = new Set();
            var hasB = elem(EB);
            var hasC = elem(EC);
            while (!(e = values.next()).done) {
                var v = f(e.value);
                switch (v._tag) {
                    case 'Left':
                        if (!hasB(v.left, left)) {
                            left.add(v.left);
                        }
                        break;
                    case 'Right':
                        if (!hasC(v.right, right)) {
                            right.add(v.right);
                        }
                        break;
                }
            }
            return separated(left, right);
        };
    };
}
export function difference(E) {
    var elemE = elem(E);
    return function (me, that) {
        if (that === undefined) {
            var differenceE_1 = difference(E);
            return function (that) { return differenceE_1(that, me); };
        }
        return filter(function (a) { return !elemE(a, that); })(me);
    };
}
/**
 * @category instances
 * @since 2.11.0
 */
export var getUnionSemigroup = function (E) { return ({
    concat: union(E)
}); };
/**
 * @category instances
 * @since 2.0.0
 */
export var getUnionMonoid = function (E) { return ({
    concat: getUnionSemigroup(E).concat,
    empty: new Set()
}); };
/**
 * @category instances
 * @since 2.0.0
 */
export var getIntersectionSemigroup = function (E) { return ({
    concat: intersection(E)
}); };
/**
 * @category instances
 * @since 2.11.0
 */
export var getDifferenceMagma = function (E) { return ({
    concat: difference(E)
}); };
/**
 * @category folding
 * @since 2.0.0
 */
export var reduce = RS.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
export var foldMap = RS.foldMap;
/**
 * @category folding
 * @since 2.11.0
 */
export var reduceRight = RS.reduceRight;
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.0.0
 */
export var singleton = function (a) { return new Set([a]); };
/**
 * Insert a value into a set
 *
 * @since 2.0.0
 */
export function insert(E) {
    var elemE = elem(E);
    return function (a) { return function (set) {
        if (!elemE(a)(set)) {
            var r = new Set(set);
            r.add(a);
            return r;
        }
        else {
            return set;
        }
    }; };
}
/**
 * Delete a value from a set
 *
 * @since 2.0.0
 */
export var remove = function (E) {
    return function (a) {
        return function (set) {
            return filter(function (ax) { return !E.equals(a, ax); })(set);
        };
    };
};
/**
 * Checks an element is a member of a set;
 * If yes, removes the value from the set
 * If no, inserts the value to the set
 *
 * @since 2.5.0
 */
export var toggle = function (E) {
    var elemE = elem(E);
    var removeE = remove(E);
    var insertE = insert(E);
    return function (a) { return function (set) { return (elemE(a, set) ? removeE : insertE)(a)(set); }; };
};
/**
 * Create a set from an array
 *
 * @category conversions
 * @since 2.0.0
 */
export var fromArray = function (E) {
    return function (as) {
        var len = as.length;
        var out = new Set();
        var has = elem(E);
        for (var i = 0; i < len; i++) {
            var a = as[i];
            if (!has(a, out)) {
                out.add(a);
            }
        }
        return out;
    };
};
/**
 * @since 2.0.0
 */
export var compact = function (E) { return filterMap(E)(identity); };
/**
 * @since 2.0.0
 */
export function separate(EE, EA) {
    return function (fa) {
        var elemEE = elem(EE);
        var elemEA = elem(EA);
        var left = new Set();
        var right = new Set();
        fa.forEach(function (e) {
            switch (e._tag) {
                case 'Left':
                    if (!elemEE(e.left, left)) {
                        left.add(e.left);
                    }
                    break;
                case 'Right':
                    if (!elemEA(e.right, right)) {
                        right.add(e.right);
                    }
                    break;
            }
        });
        return separated(left, right);
    };
}
/**
 * @since 2.0.0
 */
export function filterMap(E) {
    var elemE = elem(E);
    return function (f) { return function (fa) {
        var r = new Set();
        fa.forEach(function (a) {
            var ob = f(a);
            if (ob._tag === 'Some' && !elemE(ob.value, r)) {
                r.add(ob.value);
            }
        });
        return r;
    }; };
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export var empty = new Set();
/**
 * Test whether a `Set` is empty.
 *
 * @since 2.10.0
 */
export var isEmpty = function (set) { return set.size === 0; };
/**
 * Calculate the number of elements in a `Set`.
 *
 * @since 2.10.0
 */
export var size = function (set) { return set.size; };
/**
 * @since 2.0.0
 */
export var some = RS.some;
/**
 * @since 2.0.0
 */
export var every = RS.every;
/**
 * @since 2.10.0
 */
export var isSubset = RS.isSubset;
// TODO: remove non-curried overloading in v3
/**
 * Test if a value is a member of a set
 *
 * @since 2.0.0
 */
export var elem = RS.elem;
/**
 * Get a sorted `Array` of the values contained in a `Set`.
 *
 * @category conversions
 * @since 2.0.0
 */
export var toArray = function (O) {
    return function (set) {
        var out = [];
        set.forEach(function (e) { return out.push(e); });
        return out.sort(O.compare);
    };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`isSubset`](#issubset) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var subset = RS.isSubset;
