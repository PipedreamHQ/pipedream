/**
 * The `Reader` monad (also called the Environment monad). Represents a computation, which can read values from a shared environment,
 * pass values from function to function, and execute sub-computations in a modified environment.
 * Using `Reader` monad for such computations is often clearer and easier than using the `State` monad.
 *
 * In this example the `Reader` monad provides access to variable bindings. `Bindings` are a map of `number` variables.
 * The variable count contains number of variables in the bindings. You can see how to run a `Reader` monad and retrieve
 * data from it, how to access the `Reader` data with `ask` and `asks`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 * import * as R from 'fp-ts/Reader'
 * import * as RR from 'fp-ts/ReadonlyRecord'
 *
 * interface Bindings extends RR.ReadonlyRecord<string, number> {}
 *
 * // The Reader monad, which implements this complicated check.
 * const isCountCorrect: R.Reader<Bindings, boolean> = pipe(
 *   R.Do,
 *   R.bind('count', () => R.asks(lookupVar('count'))),
 *   R.bind('bindings', () => R.ask()),
 *   R.map(({ count, bindings }) => count === RR.size(bindings))
 * )
 *
 * // The selector function to use with 'asks'.
 * // Returns value of the variable with specified name.
 * const lookupVar = (name: string) => (bindings: Bindings): number =>
 *   pipe(
 *     bindings,
 *     RR.lookup(name),
 *     O.getOrElse(() => 0)
 *   )
 *
 * const sampleBindings: Bindings = { count: 3, a: 1, b: 2 }
 *
 * assert.deepStrictEqual(isCountCorrect(sampleBindings), true)
 *
 * @since 2.0.0
 */
import { getApplicativeMonoid } from './Applicative';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup } from './Apply';
import * as chainable from './Chain';
import * as E from './Either';
import { constant, dual, flow, identity, pipe } from './function';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor';
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Reads the current context
 *
 * @category constructors
 * @since 2.0.0
 */
export var ask = function () { return identity; };
/**
 * Projects a value from the global context in a Reader
 *
 * @category constructors
 * @since 2.0.0
 */
export var asks = identity;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as R from 'fp-ts/Reader'
 * import * as string from 'fp-ts/string'
 *
 * const calculateContentLen: R.Reader<string, number> = pipe(
 *   R.Do,
 *   R.bind('content', () => R.ask<string>()),
 *   R.map(({ content }) => string.size(content))
 * )
 *
 * // Calls calculateContentLen after adding a prefix to the Reader content.
 * const calculateModifiedContentLen: R.Reader<string, number> = pipe(
 *   calculateContentLen,
 *   R.local((s) => 'Prefix ' + s)
 * )
 *
 * const s = '12345'
 *
 * assert.deepStrictEqual(
 *   "Modified 's' length: " + calculateModifiedContentLen(s) + '\n' + "Original 's' length: " + calculateContentLen(s),
 *   "Modified 's' length: 12\nOriginal 's' length: 5"
 * )
 *
 * @since 2.0.0
 */
export var local = function (f) { return function (ma) { return function (r2) {
    return ma(f(r2));
}; }; };
/**
 * Less strict version of [`asksReader`](#asksreader).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export var asksReaderW = function (f) {
    return function (r) {
        return f(r)(r);
    };
};
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export var asksReader = asksReaderW;
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
var _compose = function (bc, ab) { return pipe(bc, compose(ab)); };
var _promap = function (fea, f, g) { return pipe(fea, promap(f, g)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return function (r) { return f(fa(r)); }; }; };
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.8.0
 */
export var apW = function (fa) { return function (fab) { return function (r) {
    return fab(r)(fa(r));
}; }; };
/**
 * @since 2.0.0
 */
export var ap = apW;
/**
 * @category constructors
 * @since 2.0.0
 */
export var of = constant;
/**
 * @category sequencing
 * @since 2.14.0
 */
export var flatMap = /*#__PURE__*/ dual(2, function (ma, f) {
    return function (r) {
        return f(ma(r))(r);
    };
});
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export var flattenW = 
/*#__PURE__*/ flatMap(identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
export var flatten = flattenW;
/**
 * @since 2.0.0
 */
export var compose = function (ab) { return function (bc) { return flow(ab, bc); }; };
/**
 * @since 2.0.0
 */
export var promap = function (f, g) { return function (fea) { return function (a) {
    return g(fea(f(a)));
}; }; };
/**
 * @category constructors
 * @since 2.0.0
 */
export var id = function () { return identity; };
/**
 * @since 2.10.0
 */
export var first = function (pab) {
    return function (_a) {
        var a = _a[0], c = _a[1];
        return [pab(a), c];
    };
};
/**
 * @since 2.10.0
 */
export var second = function (pbc) {
    return function (_a) {
        var a = _a[0], b = _a[1];
        return [a, pbc(b)];
    };
};
/**
 * @since 2.10.0
 */
export var left = function (pab) { return E.fold(function (a) { return _.left(pab(a)); }, E.right); };
/**
 * @since 2.10.0
 */
export var right = function (pbc) { return E.fold(E.left, function (b) { return _.right(pbc(b)); }); };
/**
 * @category type lambdas
 * @since 2.0.0
 */
export var URI = 'Reader';
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
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.12.0
 */
export var apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export var apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.12.0
 */
export var apSecondW = apSecond;
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
    of: of,
    ap: _ap,
    chain: flatMap
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export var tap = /*#__PURE__*/ dual(2, chainable.tap(Chain));
/**
 * @category instances
 * @since 2.7.0
 */
export var Profunctor = {
    URI: URI,
    map: _map,
    promap: _promap
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Category = {
    URI: URI,
    compose: _compose,
    id: id
};
/**
 * @category instances
 * @since 2.8.3
 */
export var Strong = {
    URI: URI,
    map: _map,
    promap: _promap,
    first: first,
    second: second
};
/**
 * @category instances
 * @since 2.8.3
 */
export var Choice = {
    URI: URI,
    map: _map,
    promap: _promap,
    left: left,
    right: right
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
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
export var bind = /*#__PURE__*/ chainable.bind(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export var bindW = bind;
/**
 * @category do notation
 * @since 2.9.0
 */
export var Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
export var apS = /*#__PURE__*/ apS_(Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export var apSW = apS;
/**
 * @since 2.11.0
 */
export var ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function (as) {
        return function (r) {
            var out = [f(0, _.head(as))(r)];
            for (var i = 1; i < as.length; i++) {
                out.push(f(i, as[i])(r));
            }
            return out;
        };
    };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : ApT); };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export var traverseArray = function (f) { return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export var sequenceArray = 
/*#__PURE__*/ traverseArray(identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export var chainW = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export var chain = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export var chainFirst = tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.11.0
 */
export var chainFirstW = tap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `R.Functor` instead of `R.reader`
 * (where `R` is from `import R from 'fp-ts/Reader'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var reader = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: flatMap,
    promap: _promap,
    compose: _compose,
    id: id,
    first: first,
    second: second,
    left: left,
    right: right
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var getSemigroup = /*#__PURE__*/ getApplySemigroup(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export var getMonoid = /*#__PURE__*/ getApplicativeMonoid(Applicative);
