import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply';
import * as chainable from './Chain';
import { fromIOK as fromIOK_, tapIO as tapIO_ } from './FromIO';
import { ask as ask_, asks as asks_, fromReaderK as fromReaderK_, tapReader as tapReader_ } from './FromReader';
import { dual, flow, identity, pipe, SK } from './function';
import { as as as_, asUnit as asUnit_, bindTo as bindTo_, flap as flap_ } from './Functor';
import * as _ from './internal';
import * as I from './IO';
import * as R from './Reader';
import * as RT from './ReaderT';
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.13.0
 */
export var fromReader = /*#__PURE__*/ RT.fromReader(I.Pointed);
/**
 * @category conversions
 * @since 2.13.0
 */
export var fromIO = R.of;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.13.0
 */
export var local = R.local;
/**
 * Less strict version of [`asksReaderIO`](#asksreaderio).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.13.0
 */
export var asksReaderIOW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.13.0
 */
export var asksReaderIO = asksReaderIOW;
var _map = function (fa, f) { return pipe(fa, map(f)); };
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.13.0
 */
export var map = /*#__PURE__*/ RT.map(I.Functor);
/**
 * @since 2.13.0
 */
export var ap = 
/*#__PURE__*/ RT.ap(I.Apply);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.13.0
 */
export var apW = ap;
/**
 * @category constructors
 * @since 2.13.0
 */
export var of = /*#__PURE__*/ RT.of(I.Pointed);
/**
 * @category sequencing
 * @since 2.14.0
 */
export var flatMap = /*#__PURE__*/ dual(2, RT.flatMap(I.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.13.0
 */
export var flattenW = 
/*#__PURE__*/ flatMap(identity);
/**
 * @category sequencing
 * @since 2.13.0
 */
export var flatten = flattenW;
/**
 * @category type lambdas
 * @since 2.13.0
 */
export var URI = 'ReaderIO';
/**
 * @category instances
 * @since 2.13.0
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
 * @since 2.13.0
 */
export var flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.13.0
 */
export var Pointed = {
    URI: URI,
    of: of
};
/**
 * @category instances
 * @since 2.13.0
 */
export var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.13.0
 */
export var apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.13.0
 */
export var apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * @category instances
 * @since 2.13.0
 */
export var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.13.0
 */
export var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.13.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.13.0
 */
export var MonadIO = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: flatMap,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.13.0
 */
export var FromIO = {
    URI: URI,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.13.0
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
export var flatMapReader = /*#__PURE__*/ _.flatMapReader(_FromReader, _FlatMap);
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
 * import * as RIO from 'fp-ts/ReaderIO'
 * import * as Console from 'fp-ts/Console'
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effect = pipe(
 *   RIO.ask<string>(),
 *   RIO.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(effect('fp-ts')(), 'fp-ts')
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
 * @category lifting
 * @since 2.13.0
 */
export var fromIOK = /*#__PURE__*/ fromIOK_(FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainIOK = flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainFirstIOK = tapIO;
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.13.0
 */
export var ask = /*#__PURE__*/ ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderIO`.
 *
 * @category constructors
 * @since 2.13.0
 */
export var asks = /*#__PURE__*/ asks_(FromReader);
/**
 * @category lifting
 * @since 2.13.0
 */
export var fromReaderK = /*#__PURE__*/ fromReaderK_(FromReader);
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.13.0
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
 * @since 2.13.0
 */
export var chainReaderKW = flatMapReader;
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.13.0
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
 * @since 2.13.0
 */
export var chainFirstReaderKW = tapReader;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.13.0
 */
export var Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.13.0
 */
export var bindTo = /*#__PURE__*/ bindTo_(Functor);
/**
 * @category do notation
 * @since 2.13.0
 */
export var bind = /*#__PURE__*/ chainable.bind(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.13.0
 */
export var bindW = bind;
/**
 * @category do notation
 * @since 2.13.0
 */
export var apS = /*#__PURE__*/ apS_(Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.13.0
 */
export var apSW = apS;
/**
 * @since 2.13.0
 */
export var ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(I.traverseReadonlyNonEmptyArrayWithIndex(SK)));
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : ApT); };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export var traverseArray = function (f) { return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
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
 * @since 2.13.0
 */
export var chain = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainW = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainFirst = tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export var chainFirstW = tap;
