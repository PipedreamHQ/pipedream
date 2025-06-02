"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.map_ = exports.insertAt = exports.empty = exports.difference = exports.intersection = exports.union = exports.Filterable = exports.Compactable = exports.flap = exports.Functor = exports.getTraversableWithIndex = exports.getFoldableWithIndex = exports.reduceRightWithIndex = exports.foldMapWithIndex = exports.reduceWithIndex = exports.getFoldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.getDifferenceMagma = exports.getIntersectionSemigroup = exports.getUnionMonoid = exports.getUnionSemigroup = exports.URI = exports.separate = exports.partitionMap = exports.partition = exports.mapWithIndex = exports.map = exports.filterMap = exports.filter = exports.compact = exports.filterMapWithIndex = exports.partitionMapWithIndex = exports.singleton = exports.getEq = exports.isSubmap = exports.lookup = exports.modifyAt = exports.updateAt = exports.deleteAt = exports.upsertAt = exports.values = exports.keys = exports.elem = exports.member = exports.isEmpty = exports.size = exports.getShow = void 0;
exports.collect = collect;
exports.toArray = toArray;
exports.toUnfoldable = toUnfoldable;
exports.pop = pop;
exports.lookupWithKey = lookupWithKey;
exports.getMonoid = getMonoid;
exports.fromFoldable = fromFoldable;
exports.partitionWithIndex = partitionWithIndex;
exports.filterWithIndex = filterWithIndex;
exports.getFilterableWithIndex = getFilterableWithIndex;
exports.getWitherable = getWitherable;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var O = __importStar(require("./Option"));
var RM = __importStar(require("./ReadonlyMap"));
var Separated_1 = require("./Separated");
var Witherable_1 = require("./Witherable");
/**
 * @category instances
 * @since 2.0.0
 */
exports.getShow = RM.getShow;
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.0.0
 */
exports.size = RM.size;
/**
 * Test whether or not a map is empty
 *
 * @since 2.0.0
 */
exports.isEmpty = RM.isEmpty;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a key exists in a map
 *
 * @since 2.0.0
 */
exports.member = RM.member;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a value is a member of a map
 *
 * @since 2.0.0
 */
exports.elem = RM.elem;
/**
 * Get a sorted `Array` of the keys contained in a `Map`.
 *
 * @since 2.0.0
 */
var keys = function (O) {
    return function (m) {
        return Array.from(m.keys()).sort(O.compare);
    };
};
exports.keys = keys;
/**
 * Get a sorted `Array` of the values contained in a `Map`.
 *
 * @since 2.0.0
 */
var values = function (O) {
    return function (m) {
        return Array.from(m.values()).sort(O.compare);
    };
};
exports.values = values;
/**
 * @since 2.0.0
 */
function collect(O) {
    var keysO = (0, exports.keys)(O);
    return function (f) {
        return function (m) {
            var out = [];
            var ks = keysO(m);
            for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
                var key = ks_1[_i];
                out.push(f(key, m.get(key)));
            }
            return out;
        };
    };
}
/**
 * Get a sorted `Array` of the key/value pairs contained in a `Map`.
 *
 * @since 2.0.0
 */
function toArray(O) {
    return collect(O)(function (k, a) { return [k, a]; });
}
function toUnfoldable(ord, U) {
    var toArrayO = toArray(ord);
    return function (d) {
        var kas = toArrayO(d);
        var len = kas.length;
        return U.unfold(0, function (b) { return (b < len ? _.some([kas[b], b + 1]) : _.none); });
    };
}
/**
 * Insert or replace a key/value pair in a `Map`.
 *
 * @since 2.0.0
 */
var upsertAt = function (E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, a) {
        var lookupWithKeyEk = lookupWithKeyE(k);
        return function (m) {
            var found = lookupWithKeyEk(m);
            if (_.isNone(found)) {
                var out = new Map(m);
                out.set(k, a);
                return out;
            }
            else if (found.value[1] !== a) {
                var out = new Map(m);
                out.set(found.value[0], a);
                return out;
            }
            return m;
        };
    };
};
exports.upsertAt = upsertAt;
/**
 * Delete a key and value from a map
 *
 * @since 2.0.0
 */
var deleteAt = function (E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (_.isSome(found)) {
            var r = new Map(m);
            r.delete(found.value[0]);
            return r;
        }
        return m;
    }; };
};
exports.deleteAt = deleteAt;
/**
 * @since 2.0.0
 */
var updateAt = function (E) {
    var modifyAtE = (0, exports.modifyAt)(E);
    return function (k, a) { return modifyAtE(k, function () { return a; }); };
};
exports.updateAt = updateAt;
/**
 * @since 2.0.0
 */
var modifyAt = function (E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, f) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (_.isNone(found)) {
            return _.none;
        }
        var r = new Map(m);
        r.set(found.value[0], f(found.value[1]));
        return _.some(r);
    }; };
};
exports.modifyAt = modifyAt;
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 *
 * @since 2.0.0
 */
function pop(E) {
    var lookupE = (0, exports.lookup)(E);
    var deleteAtE = (0, exports.deleteAt)(E);
    return function (k) {
        var deleteAtEk = deleteAtE(k);
        return function (m) {
            return (0, function_1.pipe)(lookupE(k, m), O.map(function (a) { return [a, deleteAtEk(m)]; }));
        };
    };
}
function lookupWithKey(E) {
    return function (k, m) {
        if (m === undefined) {
            var lookupWithKeyE_1 = lookupWithKey(E);
            return function (m) { return lookupWithKeyE_1(k, m); };
        }
        var entries = m.entries();
        var e;
        while (!(e = entries.next()).done) {
            var _a = e.value, ka = _a[0], a = _a[1];
            if (E.equals(ka, k)) {
                return _.some([ka, a]);
            }
        }
        return _.none;
    };
}
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Map`.
 *
 * @since 2.0.0
 */
exports.lookup = RM.lookup;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not one `Map` contains all of the keys and values contained in another `Map`
 *
 * @since 2.0.0
 */
exports.isSubmap = RM.isSubmap;
/**
 * @category instances
 * @since 2.0.0
 */
exports.getEq = RM.getEq;
/**
 * Gets `Monoid` instance for Maps given `Semigroup` instance for their values
 *
 * @category instances
 * @since 2.0.0
 */
function getMonoid(SK, SA) {
    var lookupWithKeyS = lookupWithKey(SK);
    return {
        concat: function (mx, my) {
            if ((0, exports.isEmpty)(mx)) {
                return my;
            }
            if ((0, exports.isEmpty)(my)) {
                return mx;
            }
            var r = new Map(mx);
            var entries = my.entries();
            var e;
            while (!(e = entries.next()).done) {
                var _a = e.value, k = _a[0], a = _a[1];
                var mxOptA = lookupWithKeyS(k, mx);
                if (_.isSome(mxOptA)) {
                    r.set(mxOptA.value[0], SA.concat(mxOptA.value[1], a));
                }
                else {
                    r.set(k, a);
                }
            }
            return r;
        },
        empty: new Map()
    };
}
/**
 * Create a map with one key/value pair
 *
 * @since 2.0.0
 */
var singleton = function (k, a) { return new Map([[k, a]]); };
exports.singleton = singleton;
function fromFoldable(E, M, F) {
    return function (fka) {
        var lookupWithKeyE = lookupWithKey(E);
        return F.reduce(fka, new Map(), function (b, _a) {
            var k = _a[0], a = _a[1];
            var bOpt = lookupWithKeyE(k, b);
            if (_.isSome(bOpt)) {
                b.set(bOpt.value[0], M.concat(bOpt.value[1], a));
            }
            else {
                b.set(k, a);
            }
            return b;
        });
    };
}
var _mapWithIndex = function (fa, f) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    while (!(e = entries.next()).done) {
        var _a = e.value, key = _a[0], a = _a[1];
        m.set(key, f(key, a));
    }
    return m;
};
/**
 * @since 2.10.0
 */
var partitionMapWithIndex = function (f) {
    return function (fa) {
        var left = new Map();
        var right = new Map();
        var entries = fa.entries();
        var e;
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], a = _a[1];
            var ei = f(k, a);
            if (_.isLeft(ei)) {
                left.set(k, ei.left);
            }
            else {
                right.set(k, ei.right);
            }
        }
        return (0, Separated_1.separated)(left, right);
    };
};
exports.partitionMapWithIndex = partitionMapWithIndex;
function partitionWithIndex(predicateWithIndex) {
    return function (fa) {
        var left = new Map();
        var right = new Map();
        var entries = fa.entries();
        var e;
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], a = _a[1];
            if (predicateWithIndex(k, a)) {
                right.set(k, a);
            }
            else {
                left.set(k, a);
            }
        }
        return (0, Separated_1.separated)(left, right);
    };
}
/**
 * @since 2.10.0
 */
var filterMapWithIndex = function (f) {
    return function (fa) {
        var m = new Map();
        var entries = fa.entries();
        var e;
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], a = _a[1];
            var o = f(k, a);
            if (_.isSome(o)) {
                m.set(k, o.value);
            }
        }
        return m;
    };
};
exports.filterMapWithIndex = filterMapWithIndex;
function filterWithIndex(p) {
    return function (m) {
        var out = new Map();
        var entries = m.entries();
        var e;
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], a = _a[1];
            if (p(k, a)) {
                out.set(k, a);
            }
        }
        return out;
    };
}
var _map = function (fa, f) { return _mapWithIndex(fa, function (_, a) { return f(a); }); };
var _filter = function (fa, p) {
    return _filterWithIndex(fa, function (_, a) { return p(a); });
};
var _filterMap = function (fa, f) { return _filterMapWithIndex(fa, function (_, a) { return f(a); }); };
var _partition = function (fa, predicate) {
    return _partitionWithIndex(fa, function (_, a) { return predicate(a); });
};
var _partitionMap = function (fa, f) { return _partitionMapWithIndex(fa, function (_, a) { return f(a); }); };
var _filterWithIndex = function (fa, p) { return (0, function_1.pipe)(fa, filterWithIndex(p)); };
var _filterMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMapWithIndex)(f)); };
var _partitionWithIndex = function (fa, p) { return (0, function_1.pipe)(fa, partitionWithIndex(p)); };
var _partitionMapWithIndex = function (fa, f) {
    return (0, function_1.pipe)(fa, (0, exports.partitionMapWithIndex)(f));
};
/**
 * @category filtering
 * @since 2.0.0
 */
var compact = function (fa) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], oa = _a[1];
        if (_.isSome(oa)) {
            m.set(k, oa.value);
        }
    }
    return m;
};
exports.compact = compact;
/**
 * @category filtering
 * @since 2.0.0
 */
var filter = function (predicate) {
    return function (fa) {
        return _filter(fa, predicate);
    };
};
exports.filter = filter;
/**
 * @category filtering
 * @since 2.0.0
 */
var filterMap = function (f) { return function (fa) {
    return _filterMap(fa, f);
}; };
exports.filterMap = filterMap;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return _map(fa, f); }; };
exports.map = map;
/**
 * @category mapping
 * @since 2.7.1
 */
var mapWithIndex = function (f) { return function (fa) {
    return _mapWithIndex(fa, f);
}; };
exports.mapWithIndex = mapWithIndex;
/**
 * @category filtering
 * @since 2.0.0
 */
var partition = function (predicate) {
    return function (fa) {
        return _partition(fa, predicate);
    };
};
exports.partition = partition;
/**
 * @category filtering
 * @since 2.0.0
 */
var partitionMap = function (f) { return function (fa) { return _partitionMap(fa, f); }; };
exports.partitionMap = partitionMap;
/**
 * @category filtering
 * @since 2.0.0
 */
var separate = function (fa) {
    var left = new Map();
    var right = new Map();
    var entries = fa.entries();
    var e;
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], ei = _a[1];
        if (_.isLeft(ei)) {
            left.set(k, ei.left);
        }
        else {
            right.set(k, ei.right);
        }
    }
    return (0, Separated_1.separated)(left, right);
};
exports.separate = separate;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Map';
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionSemigroup = function (E, S) {
    var unionES = (0, exports.union)(E, S);
    return {
        concat: function (first, second) { return unionES(second)(first); }
    };
};
exports.getUnionSemigroup = getUnionSemigroup;
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionMonoid = function (E, S) { return ({
    concat: (0, exports.getUnionSemigroup)(E, S).concat,
    empty: new Map()
}); };
exports.getUnionMonoid = getUnionMonoid;
/**
 * @category instances
 * @since 2.11.0
 */
var getIntersectionSemigroup = function (E, S) {
    var intersectionES = (0, exports.intersection)(E, S);
    return {
        concat: function (first, second) { return intersectionES(second)(first); }
    };
};
exports.getIntersectionSemigroup = getIntersectionSemigroup;
/**
 * @category instances
 * @since 2.11.0
 */
var getDifferenceMagma = function (E) {
    return function () {
        var differenceE = (0, exports.difference)(E);
        return {
            concat: function (first, second) { return differenceE(second)(first); }
        };
    };
};
exports.getDifferenceMagma = getDifferenceMagma;
/**
 * @category filtering
 * @since 2.0.0
 */
function getFilterableWithIndex() {
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        mapWithIndex: _mapWithIndex,
        compact: exports.compact,
        separate: exports.separate,
        filter: _filter,
        filterMap: _filterMap,
        partition: _partition,
        partitionMap: _partitionMap,
        partitionMapWithIndex: _partitionMapWithIndex,
        partitionWithIndex: _partitionWithIndex,
        filterMapWithIndex: _filterMapWithIndex,
        filterWithIndex: _filterWithIndex
    };
}
/**
 * @category filtering
 * @since 2.0.0
 */
function getWitherable(O) {
    var TWI = (0, exports.getTraversableWithIndex)(O);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: exports.compact,
        separate: exports.separate,
        filter: _filter,
        filterMap: _filterMap,
        partition: _partition,
        partitionMap: _partitionMap,
        reduce: TWI.reduce,
        foldMap: TWI.foldMap,
        reduceRight: TWI.reduceRight,
        traverse: TWI.traverse,
        sequence: TWI.sequence,
        mapWithIndex: _mapWithIndex,
        reduceWithIndex: TWI.reduceWithIndex,
        foldMapWithIndex: TWI.foldMapWithIndex,
        reduceRightWithIndex: TWI.reduceRightWithIndex,
        traverseWithIndex: TWI.traverseWithIndex,
        wilt: (0, Witherable_1.wiltDefault)(TWI, exports.Compactable),
        wither: (0, Witherable_1.witherDefault)(TWI, exports.Compactable)
    };
}
/**
 * @category folding
 * @since 2.11.0
 */
exports.reduce = RM.reduce;
/**
 * @category folding
 * @since 2.11.0
 */
exports.foldMap = RM.foldMap;
/**
 * @category folding
 * @since 2.11.0
 */
exports.reduceRight = RM.reduceRight;
/**
 * @category folding
 * @since 2.11.0
 */
var getFoldable = function (O) {
    return __assign(__assign({}, RM.getFoldable(O)), { URI: exports.URI });
};
exports.getFoldable = getFoldable;
/**
 * @category folding
 * @since 2.11.0
 */
exports.reduceWithIndex = RM.reduceWithIndex;
/**
 * @category folding
 * @since 2.11.0
 */
exports.foldMapWithIndex = RM.foldMapWithIndex;
/**
 * @category folding
 * @since 2.11.0
 */
exports.reduceRightWithIndex = RM.reduceRightWithIndex;
/**
 * @category folding
 * @since 2.10.0
 */
var getFoldableWithIndex = function (O) {
    return __assign(__assign({}, RM.getFoldableWithIndex(O)), { URI: exports.URI });
};
exports.getFoldableWithIndex = getFoldableWithIndex;
/**
 * @category traversing
 * @since 2.10.0
 */
var getTraversableWithIndex = function (O) {
    var FWI = (0, exports.getFoldableWithIndex)(O);
    var keysO = (0, exports.keys)(O);
    var traverseWithIndex = function (F) {
        return function (ta, f) {
            var fm = F.of(new Map());
            var ks = keysO(ta);
            var len = ks.length;
            var _loop_1 = function (i) {
                var key = ks[i];
                var a = ta.get(key);
                fm = F.ap(F.map(fm, function (m) { return function (b) { return m.set(key, b); }; }), f(key, a));
            };
            for (var i = 0; i < len; i++) {
                _loop_1(i);
            }
            return fm;
        };
    };
    var traverse = function (F) {
        var traverseWithIndexF = traverseWithIndex(F);
        return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
    };
    var sequence = function (F) {
        var traverseWithIndexF = traverseWithIndex(F);
        return function (ta) { return traverseWithIndexF(ta, function (_, a) { return a; }); };
    };
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        mapWithIndex: _mapWithIndex,
        reduce: FWI.reduce,
        foldMap: FWI.foldMap,
        reduceRight: FWI.reduceRight,
        reduceWithIndex: FWI.reduceWithIndex,
        foldMapWithIndex: FWI.foldMapWithIndex,
        reduceRightWithIndex: FWI.reduceRightWithIndex,
        traverse: traverse,
        sequence: sequence,
        traverseWithIndex: traverseWithIndex
    };
};
exports.getTraversableWithIndex = getTraversableWithIndex;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Filterable = {
    URI: exports.URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
var copy = function (m) { return new Map(m); };
/**
 * @since 2.11.0
 */
var union = function (E, M) {
    var unionEM = RM.union(E, M);
    return function (second) { return function (first) {
        if ((0, exports.isEmpty)(first)) {
            return copy(second);
        }
        if ((0, exports.isEmpty)(second)) {
            return copy(first);
        }
        return unionEM(second)(first);
    }; };
};
exports.union = union;
/**
 * @since 2.11.0
 */
var intersection = function (E, M) {
    var intersectionEM = RM.intersection(E, M);
    return function (second) { return function (first) {
        if ((0, exports.isEmpty)(first) || (0, exports.isEmpty)(second)) {
            return new Map();
        }
        return intersectionEM(second)(first);
    }; };
};
exports.intersection = intersection;
/**
 * @since 2.11.0
 */
var difference = function (E) {
    var differenceE = RM.difference(E);
    return function (second) {
        return function (first) {
            if ((0, exports.isEmpty)(first)) {
                return copy(second);
            }
            if ((0, exports.isEmpty)(second)) {
                return copy(first);
            }
            return differenceE(second)(first);
        };
    };
};
exports.difference = difference;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use a `new Map()` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.empty = new Map();
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.insertAt = exports.upsertAt;
/**
 * Use [`Filterable`](#filterable) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.map_ = exports.Filterable;
