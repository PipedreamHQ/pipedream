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
exports.alt = exports.map = exports.id = exports.compose = exports.lazy = exports.fromSum = exports.intersect = exports.union = exports.fromTuple = exports.fromRecord = exports.fromArray = exports.fromPartial = exports.fromType = exports.fromStruct = exports.nullable = exports.parse = exports.refine = exports.mapLeftWithInput = exports.literal = exports.fromRefinement = void 0;
var E = __importStar(require("fp-ts/lib/Either"));
var G = __importStar(require("./Guard"));
var S = __importStar(require("./Schemable"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
function fromRefinement(M) {
    return function (refinement, onError) { return ({
        decode: function (i) { return (refinement(i) ? M.of(i) : M.throwError(onError(i))); }
    }); };
}
exports.fromRefinement = fromRefinement;
/**
 * @category constructors
 * @since 2.2.7
 */
function literal(M) {
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
exports.literal = literal;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
function mapLeftWithInput(M) {
    return function (f) { return function (decoder) { return ({
        decode: function (i) { return M.mapLeft(decoder.decode(i), function (e) { return f(i, e); }); }
    }); }; };
}
exports.mapLeftWithInput = mapLeftWithInput;
/**
 * @category combinators
 * @since 2.2.7
 */
function refine(M) {
    return function (refinement, onError) { return function (from) { return compose(M)(fromRefinement(M)(refinement, onError))(from); }; };
}
exports.refine = refine;
/**
 * @category combinators
 * @since 2.2.7
 */
function parse(M) {
    return function (decode) { return function (from) { return compose(M)({ decode: decode })(from); }; };
}
exports.parse = parse;
/**
 * @category combinators
 * @since 2.2.7
 */
function nullable(M) {
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
exports.nullable = nullable;
/**
 * @category combinators
 * @since 2.2.15
 */
function fromStruct(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return traverse(properties, function (key, decoder) {
                return M.mapLeft(decoder.decode(i[key]), function (e) { return onPropertyError(key, e); });
            });
        }
    }); }; };
}
exports.fromStruct = fromStruct;
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
exports.fromType = fromStruct;
/**
 * @category combinators
 * @since 2.2.7
 */
function fromPartial(M) {
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
exports.fromPartial = fromPartial;
/**
 * @category combinators
 * @since 2.2.7
 */
function fromArray(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onItemError) { return function (item) { return ({
        decode: function (is) { return traverse(is, function (index, i) { return M.mapLeft(item.decode(i), function (e) { return onItemError(index, e); }); }); }
    }); }; };
}
exports.fromArray = fromArray;
/**
 * @category combinators
 * @since 2.2.7
 */
function fromRecord(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onKeyError) { return function (codomain) { return ({
        decode: function (ir) { return traverse(ir, function (key, i) { return M.mapLeft(codomain.decode(i), function (e) { return onKeyError(key, e); }); }); }
    }); }; };
}
exports.fromRecord = fromRecord;
/**
 * @category combinators
 * @since 2.2.7
 */
function fromTuple(M) {
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
exports.fromTuple = fromTuple;
/**
 * @category combinators
 * @since 2.2.7
 */
function union(M) {
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
exports.union = union;
/**
 * @category combinators
 * @since 2.2.7
 */
function intersect(M) {
    return function (right) {
        return function (left) { return ({
            decode: function (i) {
                return M.ap(M.map(left.decode(i), function (a) { return function (b) { return S.intersect_(a, b); }; }), right.decode(i));
            }
        }); };
    };
}
exports.intersect = intersect;
/**
 * @category combinators
 * @since 2.2.7
 */
function fromSum(M) {
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
exports.fromSum = fromSum;
/**
 * @category combinators
 * @since 2.2.7
 */
function lazy(M) {
    return function (onError) {
        return function (id, f) {
            var get = S.memoize(f);
            return {
                decode: function (u) { return M.mapLeft(get().decode(u), function (e) { return onError(id, e); }); }
            };
        };
    };
}
exports.lazy = lazy;
/**
 * @category combinators
 * @since 2.2.7
 */
function compose(M) {
    return function (ab) { return function (ia) { return ({
        decode: function (i) { return M.chain(ia.decode(i), ab.decode); }
    }); }; };
}
exports.compose = compose;
/**
 * @category combinators
 * @since 2.2.8
 */
function id(M) {
    return function () { return ({
        decode: M.of
    }); };
}
exports.id = id;
/**
 * @category combinators
 * @since 2.2.7
 */
function map(F) {
    return function (f) { return function (ia) { return ({
        decode: function (i) { return F.map(ia.decode(i), f); }
    }); }; };
}
exports.map = map;
/**
 * @category combinators
 * @since 2.2.7
 */
function alt(A) {
    return function (that) { return function (me) { return ({
        decode: function (i) { return A.alt(me.decode(i), function () { return that().decode(i); }); }
    }); }; };
}
exports.alt = alt;
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
