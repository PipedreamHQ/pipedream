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
exports.stringify = exports.draw = exports.WithRefine = exports.WithUnion = exports.WithUnknownContainers = exports.Schemable = exports.Category = exports.Alt = exports.Functor = exports.URI = exports.id = exports.compose = exports.alt = exports.map = exports.readonly = exports.lazy = exports.sum = exports.fromSum = exports.intersect = exports.union = exports.tuple = exports.fromTuple = exports.record = exports.fromRecord = exports.array = exports.fromArray = exports.partial = exports.fromPartial = exports.type = exports.struct = exports.fromType = exports.fromStruct = exports.nullable = exports.parse = exports.refine = exports.withMessage = exports.mapLeftWithInput = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.literal = exports.fromGuard = exports.fromRefinement = exports.failure = exports.success = exports.error = exports.ap = exports.SE = void 0;
var E = __importStar(require("fp-ts/lib/Either"));
var function_1 = require("fp-ts/lib/function");
var pipeable_1 = require("fp-ts/lib/pipeable");
var DE = __importStar(require("./DecodeError"));
var FS = __importStar(require("./FreeSemigroup"));
var G = __importStar(require("./Guard"));
var K = __importStar(require("./Kleisli"));
// -------------------------------------------------------------------------------------
// Kleisli config
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
exports.SE = 
/*#__PURE__*/
DE.getSemigroup();
/**
 * @internal
 */
var ap = function (fab, fa) {
    return E.isLeft(fab)
        ? E.isLeft(fa)
            ? E.left(exports.SE.concat(fab.left, fa.left))
            : fab
        : E.isLeft(fa)
            ? fa
            : E.right(fab.right(fa.right));
};
exports.ap = ap;
var M = {
    URI: E.URI,
    _E: undefined,
    map: function (fa, f) { return (0, pipeable_1.pipe)(fa, E.map(f)); },
    ap: exports.ap,
    of: E.right,
    chain: function (ma, f) { return (0, pipeable_1.pipe)(ma, E.chain(f)); },
    throwError: E.left,
    bimap: function (fa, f, g) { return (0, pipeable_1.pipe)(fa, E.bimap(f, g)); },
    mapLeft: function (fa, f) { return (0, pipeable_1.pipe)(fa, E.mapLeft(f)); },
    alt: function (me, that) {
        if (E.isRight(me)) {
            return me;
        }
        var ea = that();
        return E.isLeft(ea) ? E.left(exports.SE.concat(me.left, ea.left)) : ea;
    }
};
/**
 * @category DecodeError
 * @since 2.2.7
 */
var error = function (actual, message) { return FS.of(DE.leaf(actual, message)); };
exports.error = error;
/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.success = E.right;
/**
 * @category DecodeError
 * @since 2.2.7
 */
var failure = function (actual, message) {
    return E.left((0, exports.error)(actual, message));
};
exports.failure = failure;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.8
 */
var fromRefinement = function (refinement, expected) {
    return K.fromRefinement(M)(refinement, function (u) { return (0, exports.error)(u, expected); });
};
exports.fromRefinement = fromRefinement;
/**
 * @category constructors
 * @since 2.2.8
 */
var fromGuard = function (guard, expected) {
    return (0, exports.fromRefinement)(guard.is, expected);
};
exports.fromGuard = fromGuard;
/**
 * @category constructors
 * @since 2.2.7
 */
exports.literal = 
/*#__PURE__*/
K.literal(M)(function (u, values) { return (0, exports.error)(u, values.map(function (value) { return JSON.stringify(value); }).join(' | ')); });
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.7
 */
exports.string = 
/*#__PURE__*/
(0, exports.fromGuard)(G.string, 'string');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.number = 
/*#__PURE__*/
(0, exports.fromGuard)(G.number, 'number');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.boolean = 
/*#__PURE__*/
(0, exports.fromGuard)(G.boolean, 'boolean');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.UnknownArray = 
/*#__PURE__*/
(0, exports.fromGuard)(G.UnknownArray, 'Array<unknown>');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.UnknownRecord = 
/*#__PURE__*/
(0, exports.fromGuard)(G.UnknownRecord, 'Record<string, unknown>');
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
exports.mapLeftWithInput = 
/*#__PURE__*/
K.mapLeftWithInput(M);
/**
 * @category combinators
 * @since 2.2.9
 */
var withMessage = function (message) {
    return (0, exports.mapLeftWithInput)(function (input, e) { return FS.of(DE.wrap(message(input, e), e)); });
};
exports.withMessage = withMessage;
/**
 * @category combinators
 * @since 2.2.7
 */
var refine = function (refinement, id) { return K.refine(M)(refinement, function (a) { return (0, exports.error)(a, id); }); };
exports.refine = refine;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.parse = 
/*#__PURE__*/
K.parse(M);
/**
 * @category combinators
 * @since 2.2.7
 */
exports.nullable = 
/*#__PURE__*/
K.nullable(M)(function (u, e) { return FS.concat(FS.of(DE.member(0, (0, exports.error)(u, 'null'))), FS.of(DE.member(1, e))); });
/**
 * @category combinators
 * @since 2.2.15
 */
var fromStruct = function (properties) {
    return K.fromStruct(M)(function (k, e) { return FS.of(DE.key(k, DE.required, e)); })(properties);
};
exports.fromStruct = fromStruct;
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
exports.fromType = exports.fromStruct;
/**
 * @category combinators
 * @since 2.2.15
 */
var struct = function (properties) { return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)((0, exports.fromStruct)(properties))); };
exports.struct = struct;
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
exports.type = exports.struct;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromPartial = function (properties) {
    return K.fromPartial(M)(function (k, e) { return FS.of(DE.key(k, DE.optional, e)); })(properties);
};
exports.fromPartial = fromPartial;
/**
 * @category combinators
 * @since 2.2.7
 */
var partial = function (properties) { return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)((0, exports.fromPartial)(properties))); };
exports.partial = partial;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromArray = function (item) {
    return K.fromArray(M)(function (i, e) { return FS.of(DE.index(i, DE.optional, e)); })(item);
};
exports.fromArray = fromArray;
/**
 * @category combinators
 * @since 2.2.7
 */
var array = function (item) {
    return (0, pipeable_1.pipe)(exports.UnknownArray, (0, exports.compose)((0, exports.fromArray)(item)));
};
exports.array = array;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromRecord = function (codomain) {
    return K.fromRecord(M)(function (k, e) { return FS.of(DE.key(k, DE.optional, e)); })(codomain);
};
exports.fromRecord = fromRecord;
/**
 * @category combinators
 * @since 2.2.7
 */
var record = function (codomain) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)((0, exports.fromRecord)(codomain)));
};
exports.record = record;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromTuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return K.fromTuple(M)(function (i, e) { return FS.of(DE.index(i, DE.required, e)); }).apply(void 0, components);
};
exports.fromTuple = fromTuple;
/**
 * @category combinators
 * @since 2.2.7
 */
var tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return (0, pipeable_1.pipe)(exports.UnknownArray, (0, exports.compose)(exports.fromTuple.apply(void 0, components)));
};
exports.tuple = tuple;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.union = 
/*#__PURE__*/
K.union(M)(function (i, e) { return FS.of(DE.member(i, e)); });
/**
 * @category combinators
 * @since 2.2.7
 */
exports.intersect = 
/*#__PURE__*/
K.intersect(M);
/**
 * @category combinators
 * @since 2.2.8
 */
var fromSum = function (tag) {
    return function (members) {
        return K.fromSum(M)(function (tag, value, keys) {
            return FS.of(DE.key(tag, DE.required, (0, exports.error)(value, keys.length === 0 ? 'never' : keys.map(function (k) { return JSON.stringify(k); }).join(' | '))));
        })(tag)(members);
    };
};
exports.fromSum = fromSum;
/**
 * @category combinators
 * @since 2.2.7
 */
var sum = function (tag) {
    return function (members) {
        return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)((0, exports.fromSum)(tag)(members)));
    };
};
exports.sum = sum;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.lazy = 
/*#__PURE__*/
K.lazy(M)(function (id, e) { return FS.of(DE.lazy(id, e)); });
/**
 * @category combinators
 * @since 2.2.15
 */
exports.readonly = function_1.identity;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var map_ = function (fa, f) { return (0, pipeable_1.pipe)(fa, (0, exports.map)(f)); };
var alt_ = function (me, that) { return (0, pipeable_1.pipe)(me, (0, exports.alt)(that)); };
var compose_ = function (ab, la) { return (0, pipeable_1.pipe)(la, (0, exports.compose)(ab)); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 2.2.7
 */
exports.map = 
/*#__PURE__*/
K.map(M);
/**
 * @category Alt
 * @since 2.2.7
 */
exports.alt = 
/*#__PURE__*/
K.alt(M);
/**
 * @category Semigroupoid
 * @since 2.2.8
 */
exports.compose = 
/*#__PURE__*/
K.compose(M);
/**
 * @category Category
 * @since 2.2.8
 */
exports.id = 
/*#__PURE__*/
K.id(M);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.7
 */
exports.URI = 'io-ts/Decoder';
/**
 * @category instances
 * @since 2.2.8
 */
exports.Functor = {
    URI: exports.URI,
    map: map_
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.Alt = {
    URI: exports.URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.Category = {
    URI: exports.URI,
    compose: compose_,
    id: exports.id
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.Schemable = {
    URI: exports.URI,
    literal: exports.literal,
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    nullable: exports.nullable,
    type: exports.type,
    struct: exports.struct,
    partial: exports.partial,
    record: exports.record,
    array: exports.array,
    tuple: exports.tuple,
    intersect: exports.intersect,
    sum: exports.sum,
    lazy: exports.lazy,
    readonly: exports.readonly
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.WithUnknownContainers = {
    UnknownArray: exports.UnknownArray,
    UnknownRecord: exports.UnknownRecord
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.WithUnion = {
    union: exports.union
};
/**
 * @category instances
 * @since 2.2.8
 */
exports.WithRefine = {
    refine: exports.refine
};
var empty = [];
var make = function (value, forest) {
    if (forest === void 0) { forest = empty; }
    return ({
        value: value,
        forest: forest
    });
};
var drawTree = function (tree) { return tree.value + drawForest('\n', tree.forest); };
var drawForest = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += drawForest(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
var toTree = DE.fold({
    Leaf: function (input, error) { return make("cannot decode ".concat(JSON.stringify(input), ", should be ").concat(error)); },
    Key: function (key, kind, errors) { return make("".concat(kind, " property ").concat(JSON.stringify(key)), toForest(errors)); },
    Index: function (index, kind, errors) { return make("".concat(kind, " index ").concat(index), toForest(errors)); },
    Member: function (index, errors) { return make("member ".concat(index), toForest(errors)); },
    Lazy: function (id, errors) { return make("lazy type ".concat(id), toForest(errors)); },
    Wrap: function (error, errors) { return make(error, toForest(errors)); }
});
var toForest = function (e) {
    var stack = [];
    var focus = e;
    var res = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        switch (focus._tag) {
            case 'Of':
                {
                    res.push(toTree(focus.value));
                    var tmp = stack.pop();
                    if (tmp === undefined) {
                        return res;
                    }
                    else {
                        focus = tmp;
                    }
                }
                break;
            case 'Concat':
                stack.push(focus.right);
                focus = focus.left;
                break;
        }
    }
};
/**
 * @since 2.2.7
 */
var draw = function (e) { return toForest(e).map(drawTree).join('\n'); };
exports.draw = draw;
/**
 * @internal
 */
exports.stringify = 
/*#__PURE__*/
E.fold(exports.draw, function (a) { return JSON.stringify(a, null, 2); });
