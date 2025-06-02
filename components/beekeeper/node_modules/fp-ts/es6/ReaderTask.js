/**
 * @since 2.3.0
 */
import { getApplicativeMonoid } from './Applicative';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup as getApplySemigroup_ } from './Apply';
import * as chainable from './Chain';
import { fromIOK as fromIOK_, tapIO as tapIO_ } from './FromIO';
import { ask as ask_, asks as asks_, fromReaderK as fromReaderK_, tapReader as tapReader_ } from './FromReader';
import { fromTaskK as fromTaskK_, tapTask as tapTask_ } from './FromTask';
import { dual, flow, identity, pipe, SK } from './function';
import { as as as_, asUnit as asUnit_, bindTo as bindTo_, flap as flap_, let as let__ } from './Functor';
import * as _ from './internal';
import * as R from './Reader';
import * as RT from './ReaderT';
import * as T from './Task';
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.3.0
 */
export var fromReader = /*#__PURE__*/ RT.fromReader(T.Pointed);
/**
 * @category conversions
 * @since 2.3.0
 */
export var fromTask = R.of;
/**
 * @category conversions
 * @since 2.3.0
 */
export var fromIO = /*#__PURE__*/ flow(T.fromIO, fromTask);
/**
 * @category conversions
 * @since 2.13.0
 */
export var fromReaderIO = R.map(T.fromIO);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.3.0
 */
export var local = R.local;
/**
 * Less strict version of [`asksReaderTask`](#asksreadertask).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export var asksReaderTaskW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export var asksReaderTask = asksReaderTaskW;
var _map = function (fa, f) { return pipe(fa, map(f)); };
var _apPar = function (fab, fa) { return pipe(fab, ap(fa)); };
var _apSeq = function (fab, fa) { return flatMap(fab, function (f) { return pipe(fa, map(f)); }); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.3.0
 */
export var map = /*#__PURE__*/ RT.map(T.Functor);
/**
 * @since 2.3.0
 */
export var ap = 
/*#__PURE__*/ RT.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.8.0
 */
export var apW = ap;
/**
 * @category constructors
 * @since 2.3.0
 */
export var of = /*#__PURE__*/ RT.of(T.Pointed);
/**
 * @category sequencing
 * @since 2.14.0
 */
export var flatMap = /*#__PURE__*/ dual(2, RT.flatMap(T.Monad));
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
 * @since 2.3.0
 */
export var flatten = flattenW;
/**
 * @category type lambdas
 * @since 2.3.0
 */
export var URI = 'ReaderTask';
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export var as = dual(2, as_(Functor));
/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export var asUnit = asUnit_(Functor);
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
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
export var ApplyPar = {
    URI: URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.3.0
 */
export var apFirst = /*#__PURE__*/ apFirst_(ApplyPar);
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.16.10
 */
export var apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.3.0
 */
export var apSecond = /*#__PURE__*/ apSecond_(ApplyPar);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.16.10
 */
export var apSecondW = apSecond;
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
export var ApplicativePar = {
    URI: URI,
    map: _map,
    ap: _apPar,
    of: of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
export var ApplySeq = {
    URI: URI,
    map: _map,
    ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
export var ApplicativeSeq = {
    URI: URI,
    map: _map,
    ap: _apSeq,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Chain = {
    URI: URI,
    map: _map,
    ap: _apPar,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    of: of,
    ap: _apPar,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
export var MonadIO = {
    URI: URI,
    map: _map,
    of: of,
    ap: _apPar,
    chain: flatMap,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
export var MonadTask = {
    URI: URI,
    map: _map,
    of: of,
    ap: _apPar,
    chain: flatMap,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
export var FromIO = {
    URI: URI,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
export var FromTask = {
    URI: URI,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category instances
 * @since 2.11.0
 */
export var FromReader = {
    URI: URI,
    fromReader: fromReader
};
/** @internal */
var _FlatMap = {
    flatMap: flatMap
};
/** @internal */
var _FromIO = {
    fromIO: FromIO.fromIO
};
/** @internal */
var _FromTask = {
    fromTask: fromTask
};
/** @internal */
var _FromReader = {
    fromReader: fromReader
};
/**
 * @category sequencing
 * @since 2.16.0
 */
export var flatMapIO = _.flatMapIO(_FromIO, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
export var flatMapTask = _.flatMapTask(_FromTask, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
export var flatMapReader = _.flatMapReader(_FromReader, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
export var flatMapReaderIO = /*#__PURE__*/ dual(2, function (self, f) {
    return flatMap(self, fromReaderIOK(f));
});
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export var tap = /*#__PURE__*/ dual(2, chainable.tap(Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RT from 'fp-ts/ReaderTask'
 * import * as Console from 'fp-ts/Console'
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effect = pipe(
 *   RT.ask<string>(),
 *   RT.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect('fp-ts')(), 'fp-ts')
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export var tapIO = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export var tapReader = /*#__PURE__*/ dual(2, tapReader_(FromReader, Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RT from 'fp-ts/ReaderTask'
 * import * as T from 'fp-ts/Task'
 *
 * const effect = pipe(
 *   RT.ask<number>(),
 *   RT.tapTask((value) => T.of(value + 1)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(1)(), 1)
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export var tapTask = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export var tapReaderIO = /*#__PURE__*/ dual(2, function (self, f) {
    return tap(self, fromReaderIOK(f));
});
/**
 * @category lifting
 * @since 2.4.0
 */
export var fromIOK = /*#__PURE__*/ fromIOK_(FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.4.0
 */
export var chainIOK = flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export var chainFirstIOK = tapIO;
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.3.0
 */
export var ask = /*#__PURE__*/ ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderTask`.
 *
 * @category constructors
 * @since 2.3.0
 */
export var asks = /*#__PURE__*/ asks_(FromReader);
/**
 * @category lifting
 * @since 2.11.0
 */
export var fromReaderK = /*#__PURE__*/ fromReaderK_(FromReader);
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export var chainReaderK = flatMapReader;
/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export var chainReaderKW = flatMapReader;
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export var chainFirstReaderK = tapReader;
/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export var chainFirstReaderKW = tapReader;
/**
 * @category lifting
 * @since 2.13.0
 */
export var fromReaderIOK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return fromReaderIO(f.apply(void 0, a));
    };
};
/**
 * Alias of `flatMapReaderIO`.
 *
 * Less strict version of [`chainReaderIOK`](#chainreaderiok).
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainReaderIOKW = flatMapReaderIO;
/**
 * Alias of `flatMapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainReaderIOK = flatMapReaderIO;
/**
 * Alias of `tapReaderIO`.
 *
 * Less strict version of [`chainFirstReaderIOK`](#chainfirstreaderiok).
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainFirstReaderIOKW = tapReaderIO;
/**
 * Alias of `tapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainFirstReaderIOK = tapReaderIO;
/**
 * @category lifting
 * @since 2.4.0
 */
export var fromTaskK = /*#__PURE__*/ fromTaskK_(FromTask);
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.4.0
 */
export var chainTaskK = flatMapTask;
/**
 * Alias of `tapTask`.
 * @category legacy
 * @since 2.10.0
 */
export var chainFirstTaskK = tapTask;
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
 * @since 2.8.0
 */
export var apS = /*#__PURE__*/ apS_(ApplyPar);
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
    return flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(T.traverseReadonlyNonEmptyArrayWithIndex(SK)));
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
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
    return flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(T.traverseReadonlyNonEmptyArrayWithIndexSeq(SK)));
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndexSeq(f);
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
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
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
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
export var traverseSeqArrayWithIndex = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
export var traverseSeqArray = function (f) { return traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.3.0
 */
export var chain = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.7
 */
export var chainW = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.3.0
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
 * Use `traverseReadonlyArrayWithIndexSeq` instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export var sequenceSeqArray = 
/*#__PURE__*/ traverseSeqArray(identity);
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readerTask`
 * (where `RT` is from `import RT from 'fp-ts/ReaderTask'`)
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export var readerTask = {
    URI: URI,
    map: _map,
    of: of,
    ap: _apPar,
    chain: flatMap,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readerTaskSeq`
 * (where `RT` is from `import RT from 'fp-ts/ReaderTask'`)
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export var readerTaskSeq = {
    URI: URI,
    map: _map,
    of: of,
    ap: _apSeq,
    chain: flatMap,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export var getSemigroup = 
/*#__PURE__*/ getApplySemigroup_(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export var getMonoid = 
/*#__PURE__*/ getApplicativeMonoid(ApplicativeSeq);
/**
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
/* istanbul ignore next */
export function run(ma, r) {
    return ma(r)();
}
