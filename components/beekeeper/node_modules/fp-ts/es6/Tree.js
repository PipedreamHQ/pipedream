import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply';
import * as A from './Array';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import { fromEquals } from './Eq';
import { dual, identity, pipe } from './function';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor';
import * as _ from './internal';
/**
 * @category constructors
 * @since 2.0.0
 */
export function make(value, forest) {
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
export function getShow(S) {
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
export function getEq(E) {
    // eslint-disable-next-line prefer-const
    var SA;
    var R = fromEquals(function (x, y) { return E.equals(x.value, y.value) && SA.equals(x.forest, y.forest); });
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
export function drawForest(forest) {
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
export function drawTree(tree) {
    return tree.value + drawForest(tree.forest);
}
/**
 * Build a (possibly infinite) tree from a seed value in breadth-first order.
 *
 * @category constructors
 * @since 2.0.0
 */
export function unfoldTree(b, f) {
    var _a = f(b), a = _a[0], bs = _a[1];
    return { value: a, forest: unfoldForest(bs, f) };
}
/**
 * Build a (possibly infinite) forest from a list of seed values in breadth-first order.
 *
 * @category constructors
 * @since 2.0.0
 */
export function unfoldForest(bs, f) {
    return bs.map(function (b) { return unfoldTree(b, f); });
}
export function unfoldTreeM(M) {
    var unfoldForestMM = unfoldForestM(M);
    return function (b, f) { return M.chain(f(b), function (_a) {
        var a = _a[0], bs = _a[1];
        return M.map(unfoldForestMM(bs, f), function (ts) { return ({ value: a, forest: ts }); });
    }); };
}
export function unfoldForestM(M) {
    var traverseM = A.traverse(M);
    return function (bs, f) {
        return pipe(bs, traverseM(function (b) { return unfoldTreeM(M)(b, f); }));
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
export function fold(f) {
    var go = function (tree) { return f(tree.value, tree.forest.map(go)); };
    return go;
}
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
var _ap = function (fab, fa) { return flatMap(fab, function (f) { return pipe(fa, map(f)); }); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return pipe(fa, reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = foldMap(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return pipe(fa, reduceRight(b, f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return pipe(wa, extend(f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = traverse(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/**
 * @since 2.0.0
 */
export var ap = function (fa) { return function (fab) { return _ap(fab, fa); }; };
/**
 * @category sequencing
 * @since 2.14.0
 */
export var flatMap = /*#__PURE__*/ dual(2, function (ma, f) {
    var _a = f(ma.value), value = _a.value, forest = _a.forest;
    var concat = A.getMonoid().concat;
    return {
        value: value,
        forest: concat(forest, ma.forest.map(flatMap(f)))
    };
});
/**
 * @since 2.0.0
 */
export var extend = function (f) { return function (wa) { return ({
    value: f(wa),
    forest: wa.forest.map(extend(f))
}); }; };
/**
 * @since 2.0.0
 */
export var duplicate = /*#__PURE__*/ extend(identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
export var flatten = /*#__PURE__*/ flatMap(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return ({
    value: f(fa.value),
    forest: fa.forest.map(map(f))
}); }; };
/**
 * @category folding
 * @since 2.0.0
 */
export var reduce = function (b, f) {
    return function (fa) {
        var r = f(b, fa.value);
        var len = fa.forest.length;
        for (var i = 0; i < len; i++) {
            r = pipe(fa.forest[i], reduce(r, f));
        }
        return r;
    };
};
/**
 * @category folding
 * @since 2.0.0
 */
export var foldMap = function (M) { return function (f) {
    return reduce(M.empty, function (acc, a) { return M.concat(acc, f(a)); });
}; };
/**
 * @category folding
 * @since 2.0.0
 */
export var reduceRight = function (b, f) {
    return function (fa) {
        var r = b;
        var len = fa.forest.length;
        for (var i = len - 1; i >= 0; i--) {
            r = pipe(fa.forest[i], reduceRight(r, f));
        }
        return f(fa.value, r);
    };
};
/**
 * @category Extract
 * @since 2.6.2
 */
export var extract = function (wa) { return wa.value; };
/**
 * @category traversing
 * @since 2.6.3
 */
export var traverse = function (F) {
    var traverseF = A.traverse(F);
    var out = function (f) {
        return function (ta) {
            return F.ap(F.map(f(ta.value), function (value) { return function (forest) { return ({
                value: value,
                forest: forest
            }); }; }), pipe(ta.forest, traverseF(out(f))));
        };
    };
    return out;
};
/**
 * @category traversing
 * @since 2.6.3
 */
export var sequence = function (F) { return traverse(F)(identity); };
/**
 * @category constructors
 * @since 2.7.0
 */
export var of = function (a) { return make(a); };
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Tree';
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
 * @since 2.10.0
 */
export var Pointed = {
    URI: URI,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export var apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export var apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * @category instances
 * @since 2.7.0
 */
export var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: flatMap
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @since 2.0.0
 */
export var chainFirst = /*#__PURE__*/ chainFirst_(Chain);
/**
 * @category instances
 * @since 2.7.0
 */
export var Foldable = {
    URI: URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Traversable = {
    URI: URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Comonad = {
    URI: URI,
    map: _map,
    extend: _extend,
    extract: extract
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
export var Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
export var bindTo = /*#__PURE__*/ bindTo_(Functor);
var let_ = /*#__PURE__*/ let__(Functor);
export { 
/**
 * @category do notation
 * @since 2.13.0
 */
let_ as let };
/**
 * @category do notation
 * @since 2.8.0
 */
export var bind = /*#__PURE__*/ bind_(Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
export var apS = /*#__PURE__*/ apS_(Apply);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export function elem(E) {
    var go = function (a, fa) { return E.equals(a, fa.value) || fa.forest.some(function (tree) { return go(a, tree); }); };
    return go;
}
/**
 * @since 2.11.0
 */
export var exists = function (predicate) {
    return function (ma) {
        return predicate(ma.value) || ma.forest.some(exists(predicate));
    };
};
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export var chain = flatMap;
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
export var tree = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    extract: extract,
    extend: _extend
};
