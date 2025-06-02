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
exports.tree = exports.chain = exports.exists = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.Comonad = exports.Traversable = exports.Foldable = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.of = exports.sequence = exports.traverse = exports.extract = exports.reduceRight = exports.foldMap = exports.reduce = exports.map = exports.flatten = exports.duplicate = exports.extend = exports.flatMap = exports.ap = void 0;
exports.make = make;
exports.getShow = getShow;
exports.getEq = getEq;
exports.drawForest = drawForest;
exports.drawTree = drawTree;
exports.unfoldTree = unfoldTree;
exports.unfoldForest = unfoldForest;
exports.unfoldTreeM = unfoldTreeM;
exports.unfoldForestM = unfoldForestM;
exports.fold = fold;
exports.elem = elem;
var Apply_1 = require("./Apply");
var A = __importStar(require("./Array"));
var Chain_1 = require("./Chain");
var Eq_1 = require("./Eq");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
/**
 * @category constructors
 * @since 2.0.0
 */
function make(value, forest) {
    if (forest === void 0) { forest = []; }
    return {
        value: value,
        forest: forest
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getShow(S) {
    var show = function (t) {
        return A.isEmpty(t.forest)
            ? "make(".concat(S.show(t.value), ")")
            : "make(".concat(S.show(t.value), ", [").concat(t.forest.map(show).join(', '), "])");
    };
    return {
        show: show
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getEq(E) {
    // eslint-disable-next-line prefer-const
    var SA;
    var R = (0, Eq_1.fromEquals)(function (x, y) { return E.equals(x.value, y.value) && SA.equals(x.forest, y.forest); });
    SA = A.getEq(R);
    return R;
}
var draw = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
/**
 * Neat 2-dimensional drawing of a forest
 *
 * @since 2.0.0
 */
function drawForest(forest) {
    return draw('\n', forest);
}
/**
 * Neat 2-dimensional drawing of a tree
 *
 * @example
 * import { make, drawTree } from 'fp-ts/Tree'
 *
 * const fa = make('a', [
 *   make('b'),
 *   make('c'),
 *   make('d', [make('e'), make('f')])
 * ])
 *
 * assert.strictEqual(drawTree(fa), `a
 * ├─ b
 * ├─ c
 * └─ d
 *    ├─ e
 *    └─ f`)
 *
 *
 * @since 2.0.0
 */
function drawTree(tree) {
    return tree.value + drawForest(tree.forest);
}
/**
 * Build a (possibly infinite) tree from a seed value in breadth-first order.
 *
 * @category constructors
 * @since 2.0.0
 */
function unfoldTree(b, f) {
    var _a = f(b), a = _a[0], bs = _a[1];
    return { value: a, forest: unfoldForest(bs, f) };
}
/**
 * Build a (possibly infinite) forest from a list of seed values in breadth-first order.
 *
 * @category constructors
 * @since 2.0.0
 */
function unfoldForest(bs, f) {
    return bs.map(function (b) { return unfoldTree(b, f); });
}
function unfoldTreeM(M) {
    var unfoldForestMM = unfoldForestM(M);
    return function (b, f) { return M.chain(f(b), function (_a) {
        var a = _a[0], bs = _a[1];
        return M.map(unfoldForestMM(bs, f), function (ts) { return ({ value: a, forest: ts }); });
    }); };
}
function unfoldForestM(M) {
    var traverseM = A.traverse(M);
    return function (bs, f) {
        return (0, function_1.pipe)(bs, traverseM(function (b) { return unfoldTreeM(M)(b, f); }));
    };
}
/**
 * Fold a tree into a "summary" value in depth-first order.
 *
 * For each node in the tree, apply `f` to the `value` and the result of applying `f` to each `forest`.
 *
 * This is also known as the catamorphism on trees.
 *
 * @example
 * import { fold, make } from 'fp-ts/Tree'
 * import { concatAll } from 'fp-ts/Monoid'
 * import { MonoidSum } from 'fp-ts/number'
 *
 * const t = make(1, [make(2), make(3)])
 *
 * const sum = concatAll(MonoidSum)
 *
 * // Sum the values in a tree:
 * assert.deepStrictEqual(fold((a: number, bs: Array<number>) => a + sum(bs))(t), 6)
 *
 * // Find the maximum value in the tree:
 * assert.deepStrictEqual(fold((a: number, bs: Array<number>) => bs.reduce((b, acc) => Math.max(b, acc), a))(t), 3)
 *
 * // Count the number of leaves in the tree:
 * assert.deepStrictEqual(fold((_: number, bs: Array<number>) => (bs.length === 0 ? 1 : sum(bs)))(t), 2)
 *
 * @category folding
 * @since 2.6.0
 */
function fold(f) {
    var go = function (tree) { return f(tree.value, tree.forest.map(go)); };
    return go;
}
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _ap = function (fab, fa) { return (0, exports.flatMap)(fab, function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); }); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = (0, exports.foldMap)(M);
    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = (0, exports.traverse)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
};
/**
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) { return _ap(fab, fa); }; };
exports.ap = ap;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    var _a = f(ma.value), value = _a.value, forest = _a.forest;
    var concat = A.getMonoid().concat;
    return {
        value: value,
        forest: concat(forest, ma.forest.map((0, exports.flatMap)(f)))
    };
});
/**
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) { return ({
    value: f(wa),
    forest: wa.forest.map((0, exports.extend)(f))
}); }; };
exports.extend = extend;
/**
 * @since 2.0.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = (0, exports.flatMap)(function_1.identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return ({
    value: f(fa.value),
    forest: fa.forest.map((0, exports.map)(f))
}); }; };
exports.map = map;
/**
 * @category folding
 * @since 2.0.0
 */
var reduce = function (b, f) {
    return function (fa) {
        var r = f(b, fa.value);
        var len = fa.forest.length;
        for (var i = 0; i < len; i++) {
            r = (0, function_1.pipe)(fa.forest[i], (0, exports.reduce)(r, f));
        }
        return r;
    };
};
exports.reduce = reduce;
/**
 * @category folding
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) {
    return (0, exports.reduce)(M.empty, function (acc, a) { return M.concat(acc, f(a)); });
}; };
exports.foldMap = foldMap;
/**
 * @category folding
 * @since 2.0.0
 */
var reduceRight = function (b, f) {
    return function (fa) {
        var r = b;
        var len = fa.forest.length;
        for (var i = len - 1; i >= 0; i--) {
            r = (0, function_1.pipe)(fa.forest[i], (0, exports.reduceRight)(r, f));
        }
        return f(fa.value, r);
    };
};
exports.reduceRight = reduceRight;
/**
 * @category Extract
 * @since 2.6.2
 */
var extract = function (wa) { return wa.value; };
exports.extract = extract;
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseF = A.traverse(F);
    var out = function (f) {
        return function (ta) {
            return F.ap(F.map(f(ta.value), function (value) { return function (forest) { return ({
                value: value,
                forest: forest
            }); }; }), (0, function_1.pipe)(ta.forest, traverseF(out(f))));
        };
    };
    return out;
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) { return (0, exports.traverse)(F)(function_1.identity); };
exports.sequence = sequence;
/**
 * @category constructors
 * @since 2.7.0
 */
var of = function (a) { return make(a); };
exports.of = of;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Tree';
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
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.chainFirst = (0, Chain_1.chainFirst)(exports.Chain);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Comonad = {
    URI: exports.URI,
    map: _map,
    extend: _extend,
    extract: exports.extract
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = (0, Chain_1.bind)(exports.Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
function elem(E) {
    var go = function (a, fa) { return E.equals(a, fa.value) || fa.forest.some(function (tree) { return go(a, tree); }); };
    return go;
}
/**
 * @since 2.11.0
 */
var exists = function (predicate) {
    return function (ma) {
        return predicate(ma.value) || ma.forest.some((0, exports.exists)(predicate));
    };
};
exports.exists = exists;
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chain = exports.flatMap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.tree`
 * (where `T` is from `import T from 'fp-ts/Tree'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.tree = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    extract: exports.extract,
    extend: _extend
};
