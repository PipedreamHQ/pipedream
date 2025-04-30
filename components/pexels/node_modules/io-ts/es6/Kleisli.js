import * as E from 'fp-ts/es6/Either';
import * as G from './Guard';
import * as S from './Schemable';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
export function fromRefinement(M) {
    return function (refinement, onError) { return ({
        decode: function (i) { return (refinement(i) ? M.of(i) : M.throwError(onError(i))); }
    }); };
}
/**
 * @category constructors
 * @since 2.2.7
 */
export function literal(M) {
    return function (onError) {
        return function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            return ({
                decode: function (i) { return (G.literal.apply(G, values).is(i) ? M.of(i) : M.throwError(onError(i, values))); }
            });
        };
    };
}
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
export function mapLeftWithInput(M) {
    return function (f) { return function (decoder) { return ({
        decode: function (i) { return M.mapLeft(decoder.decode(i), function (e) { return f(i, e); }); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function refine(M) {
    return function (refinement, onError) { return function (from) { return compose(M)(fromRefinement(M)(refinement, onError))(from); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function parse(M) {
    return function (decode) { return function (from) { return compose(M)({ decode: decode })(from); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function nullable(M) {
    return function (onError) {
        return function (or) { return ({
            decode: function (i) {
                return i === null
                    ? M.of(null)
                    : M.bimap(or.decode(i), function (e) { return onError(i, e); }, function (a) { return a; });
            }
        }); };
    };
}
/**
 * @category combinators
 * @since 2.2.15
 */
export function fromStruct(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return traverse(properties, function (key, decoder) {
                return M.mapLeft(decoder.decode(i[key]), function (e) { return onPropertyError(key, e); });
            });
        }
    }); }; };
}
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
export var fromType = fromStruct;
/**
 * @category combinators
 * @since 2.2.7
 */
export function fromPartial(M) {
    var traverse = traverseRecordWithIndex(M);
    var undefinedProperty = M.of(E.right(undefined));
    var skipProperty = M.of(E.left(undefined));
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return M.map(traverse(properties, function (key, decoder) {
                var ikey = i[key];
                if (ikey === undefined) {
                    return key in i
                        ? // don't strip undefined properties
                            undefinedProperty
                        : // don't add missing properties
                            skipProperty;
                }
                return M.bimap(decoder.decode(ikey), function (e) { return onPropertyError(key, e); }, function (a) { return E.right(a); });
            }), compactRecord);
        }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function fromArray(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onItemError) { return function (item) { return ({
        decode: function (is) { return traverse(is, function (index, i) { return M.mapLeft(item.decode(i), function (e) { return onItemError(index, e); }); }); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function fromRecord(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onKeyError) { return function (codomain) { return ({
        decode: function (ir) { return traverse(ir, function (key, i) { return M.mapLeft(codomain.decode(i), function (e) { return onKeyError(key, e); }); }); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function fromTuple(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onIndexError) {
        return function () {
            var components = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                components[_i] = arguments[_i];
            }
            return ({
                decode: function (is) {
                    return traverse(components, function (index, decoder) {
                        return M.mapLeft(decoder.decode(is[index]), function (e) { return onIndexError(index, e); });
                    });
                }
            });
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function union(M) {
    return function (onMemberError) {
        return function () {
            var members = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                members[_i] = arguments[_i];
            }
            return ({
                decode: function (i) {
                    var out = M.mapLeft(members[0].decode(i), function (e) { return onMemberError(0, e); });
                    var _loop_1 = function (index) {
                        out = M.alt(out, function () { return M.mapLeft(members[index].decode(i), function (e) { return onMemberError(index, e); }); });
                    };
                    for (var index = 1; index < members.length; index++) {
                        _loop_1(index);
                    }
                    return out;
                }
            });
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function intersect(M) {
    return function (right) {
        return function (left) { return ({
            decode: function (i) {
                return M.ap(M.map(left.decode(i), function (a) { return function (b) { return S.intersect_(a, b); }; }), right.decode(i));
            }
        }); };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function fromSum(M) {
    return function (onTagError) {
        return function (tag) {
            return function (members) {
                var keys = Object.keys(members);
                return {
                    decode: function (ir) {
                        var v = ir[tag];
                        if (Object.prototype.hasOwnProperty.call(members, v)) {
                            return members[v].decode(ir);
                        }
                        return M.throwError(onTagError(tag, v, keys));
                    }
                };
            };
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function lazy(M) {
    return function (onError) {
        return function (id, f) {
            var get = S.memoize(f);
            return {
                decode: function (u) { return M.mapLeft(get().decode(u), function (e) { return onError(id, e); }); }
            };
        };
    };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function compose(M) {
    return function (ab) { return function (ia) { return ({
        decode: function (i) { return M.chain(ia.decode(i), ab.decode); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.8
 */
export function id(M) {
    return function () { return ({
        decode: M.of
    }); };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function map(F) {
    return function (f) { return function (ia) { return ({
        decode: function (i) { return F.map(ia.decode(i), f); }
    }); }; };
}
/**
 * @category combinators
 * @since 2.2.7
 */
export function alt(A) {
    return function (that) { return function (me) { return ({
        decode: function (i) { return A.alt(me.decode(i), function () { return that().decode(i); }); }
    }); }; };
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
var traverseArrayWithIndex = function (M) {
    return function (as, f) {
        return as.reduce(function (mbs, a, i) {
            return M.ap(M.map(mbs, function (bs) { return function (b) {
                bs.push(b);
                return bs;
            }; }), f(i, a));
        }, M.of([]));
    };
};
var traverseRecordWithIndex = function (M) {
    return function (r, f) {
        var ks = Object.keys(r);
        if (ks.length === 0) {
            return M.of({});
        }
        var fr = M.of({});
        var _loop_2 = function (key) {
            fr = M.ap(M.map(fr, function (r) { return function (b) {
                r[key] = b;
                return r;
            }; }), f(key, r[key]));
        };
        for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
            var key = ks_1[_i];
            _loop_2(key);
        }
        return fr;
    };
};
var compactRecord = function (r) {
    var out = {};
    for (var k in r) {
        var rk = r[k];
        if (E.isRight(rk)) {
            out[k] = rk.right;
        }
    }
    return out;
};
