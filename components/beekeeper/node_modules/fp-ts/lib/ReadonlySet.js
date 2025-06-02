"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromArray = exports.getDifferenceMagma = exports.getIntersectionSemigroup = exports.getUnionMonoid = exports.getUnionSemigroup = exports.URI = exports.toReadonlyArray = exports.some = exports.size = exports.isEmpty = exports.empty = exports.compact = exports.toggle = exports.remove = exports.reduceRight = exports.fromReadonlyArray = exports.singleton = exports.fromSet = void 0;
exports.toSet = toSet;
exports.map = map;
exports.chain = chain;
exports.filter = filter;
exports.partition = partition;
exports.union = union;
exports.intersection = intersection;
exports.partitionMap = partitionMap;
exports.difference = difference;
exports.reduce = reduce;
exports.foldMap = foldMap;
exports.insert = insert;
exports.separate = separate;
exports.filterMap = filterMap;
exports.every = every;
exports.isSubset = isSubset;
exports.elem = elem;
exports.getShow = getShow;
exports.getEq = getEq;
var Eq_1 = require("./Eq");
var function_1 = require("./function");
var Predicate_1 = require("./Predicate");
var Separated_1 = require("./Separated");
/**
 * @category conversions
 * @since 2.5.0
 */
var fromSet = function (s) { return new Set(s); };
exports.fromSet = fromSet;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.5.0
 */
var singleton = function (a) { return new Set([a]); };
exports.singleton = singleton;
/**
 * Create a `ReadonlySet` from a `ReadonlyArray`
 *
 * @category conversions
 * @since 2.10.0
 */
var fromReadonlyArray = function (E) {
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
exports.fromReadonlyArray = fromReadonlyArray;
/**
 * @category conversions
 * @since 2.5.0
 */
function toSet(s) {
    return new Set(s);
}
/**
 * Projects a Set through a function
 *
 * @since 2.5.0
 */
function map(E) {
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
 * @since 2.5.0
 */
function chain(E) {
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
function filter(predicate) {
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
function partition(predicate) {
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
        return (0, Separated_1.separated)(left, right);
    };
}
function union(E) {
    var elemE = elem(E);
    return function (me, that) {
        if (that === undefined) {
            var unionE_1 = union(E);
            return function (that) { return unionE_1(me, that); };
        }
        if ((0, exports.isEmpty)(me)) {
            return that;
        }
        if ((0, exports.isEmpty)(that)) {
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
function intersection(E) {
    var elemE = elem(E);
    return function (me, that) {
        if (that === undefined) {
            var intersectionE_1 = intersection(E);
            return function (that) { return intersectionE_1(that, me); };
        }
        if ((0, exports.isEmpty)(me) || (0, exports.isEmpty)(that)) {
            return exports.empty;
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
 * @since 2.5.0
 */
function partitionMap(EB, EC) {
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
            return (0, Separated_1.separated)(left, right);
        };
    };
}
function difference(E) {
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
 * @since 2.5.0
 */
function reduce(O) {
    var toReadonlyArrayO = (0, exports.toReadonlyArray)(O);
    return function (b, f) { return function (fa) { return toReadonlyArrayO(fa).reduce(f, b); }; };
}
/**
 * @since 2.5.0
 */
function foldMap(O, M) {
    var toReadonlyArrayO = (0, exports.toReadonlyArray)(O);
    return function (f) { return function (fa) { return toReadonlyArrayO(fa).reduce(function (b, a) { return M.concat(b, f(a)); }, M.empty); }; };
}
/**
 * @category folding
 * @since 2.11.0
 */
var reduceRight = function (O) {
    var toReadonlyArrayO = (0, exports.toReadonlyArray)(O);
    return function (b, f) { return function (fa) { return toReadonlyArrayO(fa).reduceRight(function (b, a) { return f(a, b); }, b); }; };
};
exports.reduceRight = reduceRight;
/**
 * Insert a value into a set
 *
 * @since 2.5.0
 */
function insert(E) {
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
 * @since 2.5.0
 */
var remove = function (E) {
    return function (a) {
        return function (set) {
            return filter(function (ax) { return !E.equals(a, ax); })(set);
        };
    };
};
exports.remove = remove;
/**
 * Checks an element is a member of a set;
 * If yes, removes the value from the set
 * If no, inserts the value to the set
 *
 * @since 2.10.0
 */
var toggle = function (E) {
    var elemE = elem(E);
    var removeE = (0, exports.remove)(E);
    var insertE = insert(E);
    return function (a) { return function (set) { return (elemE(a, set) ? removeE : insertE)(a)(set); }; };
};
exports.toggle = toggle;
/**
 * @since 2.5.0
 */
var compact = function (E) { return filterMap(E)(function_1.identity); };
exports.compact = compact;
/**
 * @since 2.5.0
 */
function separate(EE, EA) {
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
        return (0, Separated_1.separated)(left, right);
    };
}
/**
 * @since 2.5.0
 */
function filterMap(E) {
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
 * @since 2.5.0
 */
exports.empty = new Set();
/**
 * Test whether a `ReadonlySet` is empty.
 *
 * @since 2.10.0
 */
var isEmpty = function (set) { return set.size === 0; };
exports.isEmpty = isEmpty;
/**
 * Calculate the number of elements in a `ReadonlySet`.
 *
 * @since 2.10.0
 */
var size = function (set) { return set.size; };
exports.size = size;
/**
 * @since 2.5.0
 */
var some = function (predicate) {
    return function (set) {
        var values = set.values();
        var e;
        var found = false;
        while (!found && !(e = values.next()).done) {
            found = predicate(e.value);
        }
        return found;
    };
};
exports.some = some;
function every(predicate) {
    return (0, Predicate_1.not)((0, exports.some)((0, Predicate_1.not)(predicate)));
}
function isSubset(E) {
    var elemE = elem(E);
    return function (me, that) {
        if (that === undefined) {
            var isSubsetE_1 = isSubset(E);
            return function (that) { return isSubsetE_1(that, me); };
        }
        return every(function (a) { return elemE(a, that); })(me);
    };
}
function elem(E) {
    return function (a, set) {
        if (set === undefined) {
            var elemE_1 = elem(E);
            return function (set) { return elemE_1(a, set); };
        }
        var values = set.values();
        var e;
        var found = false;
        while (!found && !(e = values.next()).done) {
            found = E.equals(a, e.value);
        }
        return found;
    };
}
/**
 * Get a sorted `ReadonlyArray` of the values contained in a `ReadonlySet`.
 *
 * @category conversions
 * @since 2.5.0
 */
var toReadonlyArray = function (O) {
    return function (set) {
        var out = [];
        set.forEach(function (e) { return out.push(e); });
        return out.sort(O.compare);
    };
};
exports.toReadonlyArray = toReadonlyArray;
/**
 * @category type lambdas
 * @since 2.11.0
 */
exports.URI = 'ReadonlySet';
/**
 * @category instances
 * @since 2.5.0
 */
function getShow(S) {
    return {
        show: function (s) {
            var entries = [];
            s.forEach(function (a) {
                entries.push(S.show(a));
            });
            return "new Set([".concat(entries.sort().join(', '), "])");
        }
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
function getEq(E) {
    var subsetE = isSubset(E);
    return (0, Eq_1.fromEquals)(function (x, y) { return subsetE(x, y) && subsetE(y, x); });
}
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionSemigroup = function (E) { return ({
    concat: union(E)
}); };
exports.getUnionSemigroup = getUnionSemigroup;
/**
 * @category instances
 * @since 2.5.0
 */
var getUnionMonoid = function (E) { return ({
    concat: (0, exports.getUnionSemigroup)(E).concat,
    empty: exports.empty
}); };
exports.getUnionMonoid = getUnionMonoid;
/**
 * @category instances
 * @since 2.5.0
 */
var getIntersectionSemigroup = function (E) { return ({
    concat: intersection(E)
}); };
exports.getIntersectionSemigroup = getIntersectionSemigroup;
/**
 * @category instances
 * @since 2.11.0
 */
var getDifferenceMagma = function (E) { return ({
    concat: difference(E)
}); };
exports.getDifferenceMagma = getDifferenceMagma;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`fromReadonlyArray`](#fromreadonlyarray) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.fromArray = exports.fromReadonlyArray;
