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
import { pipe } from './function';
import { flap as flap_ } from './Functor';
import * as _ from './internal';
import * as O from './Option';
import * as RM from './ReadonlyMap';
import { separated } from './Separated';
import { wiltDefault, witherDefault } from './Witherable';
/**
 * @category instances
 * @since 2.0.0
 */
export var getShow = RM.getShow;
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.0.0
 */
export var size = RM.size;
/**
 * Test whether or not a map is empty
 *
 * @since 2.0.0
 */
export var isEmpty = RM.isEmpty;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a key exists in a map
 *
 * @since 2.0.0
 */
export var member = RM.member;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a value is a member of a map
 *
 * @since 2.0.0
 */
export var elem = RM.elem;
/**
 * Get a sorted `Array` of the keys contained in a `Map`.
 *
 * @since 2.0.0
 */
export var keys = function (O) {
    return function (m) {
        return Array.from(m.keys()).sort(O.compare);
    };
};
/**
 * Get a sorted `Array` of the values contained in a `Map`.
 *
 * @since 2.0.0
 */
export var values = function (O) {
    return function (m) {
        return Array.from(m.values()).sort(O.compare);
    };
};
/**
 * @since 2.0.0
 */
export function collect(O) {
    var keysO = keys(O);
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
export function toArray(O) {
    return collect(O)(function (k, a) { return [k, a]; });
}
export function toUnfoldable(ord, U) {
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
export var upsertAt = function (E) {
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
/**
 * Delete a key and value from a map
 *
 * @since 2.0.0
 */
export var deleteAt = function (E) {
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
/**
 * @since 2.0.0
 */
export var updateAt = function (E) {
    var modifyAtE = modifyAt(E);
    return function (k, a) { return modifyAtE(k, function () { return a; }); };
};
/**
 * @since 2.0.0
 */
export var modifyAt = function (E) {
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
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 *
 * @since 2.0.0
 */
export function pop(E) {
    var lookupE = lookup(E);
    var deleteAtE = deleteAt(E);
    return function (k) {
        var deleteAtEk = deleteAtE(k);
        return function (m) {
            return pipe(lookupE(k, m), O.map(function (a) { return [a, deleteAtEk(m)]; }));
        };
    };
}
export function lookupWithKey(E) {
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
export var lookup = RM.lookup;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not one `Map` contains all of the keys and values contained in another `Map`
 *
 * @since 2.0.0
 */
export var isSubmap = RM.isSubmap;
/**
 * @category instances
 * @since 2.0.0
 */
export var getEq = RM.getEq;
/**
 * Gets `Monoid` instance for Maps given `Semigroup` instance for their values
 *
 * @category instances
 * @since 2.0.0
 */
export function getMonoid(SK, SA) {
    var lookupWithKeyS = lookupWithKey(SK);
    return {
        concat: function (mx, my) {
            if (isEmpty(mx)) {
                return my;
            }
            if (isEmpty(my)) {
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
export var singleton = function (k, a) { return new Map([[k, a]]); };
export function fromFoldable(E, M, F) {
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
export var partitionMapWithIndex = function (f) {
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
        return separated(left, right);
    };
};
export function partitionWithIndex(predicateWithIndex) {
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
        return separated(left, right);
    };
}
/**
 * @since 2.10.0
 */
export var filterMapWithIndex = function (f) {
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
export function filterWithIndex(p) {
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
var _filterWithIndex = function (fa, p) { return pipe(fa, filterWithIndex(p)); };
var _filterMapWithIndex = function (fa, f) { return pipe(fa, filterMapWithIndex(f)); };
var _partitionWithIndex = function (fa, p) { return pipe(fa, partitionWithIndex(p)); };
var _partitionMapWithIndex = function (fa, f) {
    return pipe(fa, partitionMapWithIndex(f));
};
/**
 * @category filtering
 * @since 2.0.0
 */
export var compact = function (fa) {
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
/**
 * @category filtering
 * @since 2.0.0
 */
export var filter = function (predicate) {
    return function (fa) {
        return _filter(fa, predicate);
    };
};
/**
 * @category filtering
 * @since 2.0.0
 */
export var filterMap = function (f) { return function (fa) {
    return _filterMap(fa, f);
}; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return _map(fa, f); }; };
/**
 * @category mapping
 * @since 2.7.1
 */
export var mapWithIndex = function (f) { return function (fa) {
    return _mapWithIndex(fa, f);
}; };
/**
 * @category filtering
 * @since 2.0.0
 */
export var partition = function (predicate) {
    return function (fa) {
        return _partition(fa, predicate);
    };
};
/**
 * @category filtering
 * @since 2.0.0
 */
export var partitionMap = function (f) { return function (fa) { return _partitionMap(fa, f); }; };
/**
 * @category filtering
 * @since 2.0.0
 */
export var separate = function (fa) {
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
    return separated(left, right);
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Map';
/**
 * @category instances
 * @since 2.11.0
 */
export var getUnionSemigroup = function (E, S) {
    var unionES = union(E, S);
    return {
        concat: function (first, second) { return unionES(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
export var getUnionMonoid = function (E, S) { return ({
    concat: getUnionSemigroup(E, S).concat,
    empty: new Map()
}); };
/**
 * @category instances
 * @since 2.11.0
 */
export var getIntersectionSemigroup = function (E, S) {
    var intersectionES = intersection(E, S);
    return {
        concat: function (first, second) { return intersectionES(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
export var getDifferenceMagma = function (E) {
    return function () {
        var differenceE = difference(E);
        return {
            concat: function (first, second) { return differenceE(second)(first); }
        };
    };
};
/**
 * @category filtering
 * @since 2.0.0
 */
export function getFilterableWithIndex() {
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        mapWithIndex: _mapWithIndex,
        compact: compact,
        separate: separate,
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
export function getWitherable(O) {
    var TWI = getTraversableWithIndex(O);
    return {
        URI: URI,
        _E: undefined,
        map: _map,
        compact: compact,
        separate: separate,
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
        wilt: wiltDefault(TWI, Compactable),
        wither: witherDefault(TWI, Compactable)
    };
}
/**
 * @category folding
 * @since 2.11.0
 */
export var reduce = RM.reduce;
/**
 * @category folding
 * @since 2.11.0
 */
export var foldMap = RM.foldMap;
/**
 * @category folding
 * @since 2.11.0
 */
export var reduceRight = RM.reduceRight;
/**
 * @category folding
 * @since 2.11.0
 */
export var getFoldable = function (O) {
    return __assign(__assign({}, RM.getFoldable(O)), { URI: URI });
};
/**
 * @category folding
 * @since 2.11.0
 */
export var reduceWithIndex = RM.reduceWithIndex;
/**
 * @category folding
 * @since 2.11.0
 */
export var foldMapWithIndex = RM.foldMapWithIndex;
/**
 * @category folding
 * @since 2.11.0
 */
export var reduceRightWithIndex = RM.reduceRightWithIndex;
/**
 * @category folding
 * @since 2.10.0
 */
export var getFoldableWithIndex = function (O) {
    return __assign(__assign({}, RM.getFoldableWithIndex(O)), { URI: URI });
};
/**
 * @category traversing
 * @since 2.10.0
 */
export var getTraversableWithIndex = function (O) {
    var FWI = getFoldableWithIndex(O);
    var keysO = keys(O);
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
        URI: URI,
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
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
export var flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.7.0
 */
export var Compactable = {
    URI: URI,
    compact: compact,
    separate: separate
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Filterable = {
    URI: URI,
    map: _map,
    compact: compact,
    separate: separate,
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
export var union = function (E, M) {
    var unionEM = RM.union(E, M);
    return function (second) { return function (first) {
        if (isEmpty(first)) {
            return copy(second);
        }
        if (isEmpty(second)) {
            return copy(first);
        }
        return unionEM(second)(first);
    }; };
};
/**
 * @since 2.11.0
 */
export var intersection = function (E, M) {
    var intersectionEM = RM.intersection(E, M);
    return function (second) { return function (first) {
        if (isEmpty(first) || isEmpty(second)) {
            return new Map();
        }
        return intersectionEM(second)(first);
    }; };
};
/**
 * @since 2.11.0
 */
export var difference = function (E) {
    var differenceE = RM.difference(E);
    return function (second) {
        return function (first) {
            if (isEmpty(first)) {
                return copy(second);
            }
            if (isEmpty(second)) {
                return copy(first);
            }
            return differenceE(second)(first);
        };
    };
};
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
export var empty = new Map();
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var insertAt = upsertAt;
/**
 * Use [`Filterable`](#filterable) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var map_ = Filterable;
