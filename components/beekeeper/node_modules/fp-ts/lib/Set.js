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
exports.subset = exports.toArray = exports.elem = exports.isSubset = exports.every = exports.some = exports.size = exports.isEmpty = exports.empty = exports.compact = exports.fromArray = exports.toggle = exports.remove = exports.singleton = exports.reduceRight = exports.foldMap = exports.reduce = exports.getDifferenceMagma = exports.getIntersectionSemigroup = exports.getUnionMonoid = exports.getUnionSemigroup = exports.getEq = exports.getShow = void 0;
exports.map = map;
exports.chain = chain;
exports.filter = filter;
exports.partition = partition;
exports.union = union;
exports.intersection = intersection;
exports.partitionMap = partitionMap;
exports.difference = difference;
exports.insert = insert;
exports.separate = separate;
exports.filterMap = filterMap;
var function_1 = require("./function");
var RS = __importStar(require("./ReadonlySet"));
var Separated_1 = require("./Separated");
/**
 * @category instances
 * @since 2.0.0
 */
exports.getShow = RS.getShow;
/**
 * @category instances
 * @since 2.0.0
 */
exports.getEq = RS.getEq;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @since 2.0.0
 */
function map(E) {
    var elemE = (0, exports.elem)(E);
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
function chain(E) {
    var elemE = (0, exports.elem)(E);
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
    var elemE = (0, exports.elem)(E);
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
    var elemE = (0, exports.elem)(E);
    return function (me, that) {
        if (that === undefined) {
            var intersectionE_1 = intersection(E);
            return function (that) { return intersectionE_1(that, me); };
        }
        if ((0, exports.isEmpty)(me) || (0, exports.isEmpty)(that)) {
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
function partitionMap(EB, EC) {
    return function (f) {
        return function (set) {
            var values = set.values();
            var e;
            var left = new Set();
            var right = new Set();
            var hasB = (0, exports.elem)(EB);
            var hasC = (0, exports.elem)(EC);
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
    var elemE = (0, exports.elem)(E);
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
var getUnionSemigroup = function (E) { return ({
    concat: union(E)
}); };
exports.getUnionSemigroup = getUnionSemigroup;
/**
 * @category instances
 * @since 2.0.0
 */
var getUnionMonoid = function (E) { return ({
    concat: (0, exports.getUnionSemigroup)(E).concat,
    empty: new Set()
}); };
exports.getUnionMonoid = getUnionMonoid;
/**
 * @category instances
 * @since 2.0.0
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
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduce = RS.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
exports.foldMap = RS.foldMap;
/**
 * @category folding
 * @since 2.11.0
 */
exports.reduceRight = RS.reduceRight;
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.0.0
 */
var singleton = function (a) { return new Set([a]); };
exports.singleton = singleton;
/**
 * Insert a value into a set
 *
 * @since 2.0.0
 */
function insert(E) {
    var elemE = (0, exports.elem)(E);
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
 * @since 2.5.0
 */
var toggle = function (E) {
    var elemE = (0, exports.elem)(E);
    var removeE = (0, exports.remove)(E);
    var insertE = insert(E);
    return function (a) { return function (set) { return (elemE(a, set) ? removeE : insertE)(a)(set); }; };
};
exports.toggle = toggle;
/**
 * Create a set from an array
 *
 * @category conversions
 * @since 2.0.0
 */
var fromArray = function (E) {
    return function (as) {
        var len = as.length;
        var out = new Set();
        var has = (0, exports.elem)(E);
        for (var i = 0; i < len; i++) {
            var a = as[i];
            if (!has(a, out)) {
                out.add(a);
            }
        }
        return out;
    };
};
exports.fromArray = fromArray;
/**
 * @since 2.0.0
 */
var compact = function (E) { return filterMap(E)(function_1.identity); };
exports.compact = compact;
/**
 * @since 2.0.0
 */
function separate(EE, EA) {
    return function (fa) {
        var elemEE = (0, exports.elem)(EE);
        var elemEA = (0, exports.elem)(EA);
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
 * @since 2.0.0
 */
function filterMap(E) {
    var elemE = (0, exports.elem)(E);
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
exports.empty = new Set();
/**
 * Test whether a `Set` is empty.
 *
 * @since 2.10.0
 */
var isEmpty = function (set) { return set.size === 0; };
exports.isEmpty = isEmpty;
/**
 * Calculate the number of elements in a `Set`.
 *
 * @since 2.10.0
 */
var size = function (set) { return set.size; };
exports.size = size;
/**
 * @since 2.0.0
 */
exports.some = RS.some;
/**
 * @since 2.0.0
 */
exports.every = RS.every;
/**
 * @since 2.10.0
 */
exports.isSubset = RS.isSubset;
// TODO: remove non-curried overloading in v3
/**
 * Test if a value is a member of a set
 *
 * @since 2.0.0
 */
exports.elem = RS.elem;
/**
 * Get a sorted `Array` of the values contained in a `Set`.
 *
 * @category conversions
 * @since 2.0.0
 */
var toArray = function (O) {
    return function (set) {
        var out = [];
        set.forEach(function (e) { return out.push(e); });
        return out.sort(O.compare);
    };
};
exports.toArray = toArray;
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
exports.subset = RS.isSubset;
