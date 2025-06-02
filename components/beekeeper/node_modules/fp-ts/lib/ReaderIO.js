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
exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.chainFirstReaderKW = exports.chainFirstReaderK = exports.chainReaderKW = exports.chainReaderK = exports.fromReaderK = exports.asks = exports.ask = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.tapReader = exports.tapIO = exports.tap = exports.flatMapReader = exports.flatMapIO = exports.FromReader = exports.FromIO = exports.MonadIO = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.URI = exports.flatten = exports.flattenW = exports.flatMap = exports.of = exports.apW = exports.ap = exports.map = exports.asksReaderIO = exports.asksReaderIOW = exports.local = exports.fromIO = exports.fromReader = void 0;
exports.chainFirstW = exports.chainFirst = exports.chainW = exports.chain = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = void 0;
var Apply_1 = require("./Apply");
var chainable = __importStar(require("./Chain"));
var FromIO_1 = require("./FromIO");
var FromReader_1 = require("./FromReader");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var I = __importStar(require("./IO"));
var R = __importStar(require("./Reader"));
var RT = __importStar(require("./ReaderT"));
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.13.0
 */
exports.fromReader = RT.fromReader(I.Pointed);
/**
 * @category conversions
 * @since 2.13.0
 */
exports.fromIO = R.of;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.13.0
 */
exports.local = R.local;
/**
 * Less strict version of [`asksReaderIO`](#asksreaderio).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.13.0
 */
exports.asksReaderIOW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.13.0
 */
exports.asksReaderIO = exports.asksReaderIOW;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.13.0
 */
exports.map = RT.map(I.Functor);
/**
 * @since 2.13.0
 */
exports.ap = 
/*#__PURE__*/ RT.ap(I.Apply);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.13.0
 */
exports.apW = exports.ap;
/**
 * @category constructors
 * @since 2.13.0
 */
exports.of = RT.of(I.Pointed);
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, RT.flatMap(I.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.13.0
 */
exports.flattenW = 
/*#__PURE__*/ (0, exports.flatMap)(function_1.identity);
/**
 * @category sequencing
 * @since 2.13.0
 */
exports.flatten = exports.flattenW;
/**
 * @category type lambdas
 * @since 2.13.0
 */
exports.URI = 'ReaderIO';
/**
 * @category instances
 * @since 2.13.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
/**
 * @category mapping
 * @since 2.13.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * @category instances
 * @since 2.13.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.13.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.13.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.13.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * @category instances
 * @since 2.13.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.13.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.13.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.13.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.13.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.13.0
 */
exports.FromReader = {
    URI: exports.URI,
    fromReader: exports.fromReader
};
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/** @internal */
var _FromIO = {
    fromIO: exports.FromIO.fromIO
};
/** @internal */
var _FromReader = {
    fromReader: exports.fromReader
};
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapIO = _.flatMapIO(_FromIO, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapReader = _.flatMapReader(_FromReader, _FlatMap);
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
exports.tap = (0, function_1.dual)(2, chainable.tap(exports.Chain));
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
exports.tapIO = (0, function_1.dual)(2, (0, FromIO_1.tapIO)(exports.FromIO, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapReader = (0, function_1.dual)(2, (0, FromReader_1.tapReader)(exports.FromReader, exports.Chain));
/**
 * @category lifting
 * @since 2.13.0
 */
exports.fromIOK = (0, FromIO_1.fromIOK)(exports.FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainIOK = exports.flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainFirstIOK = exports.tapIO;
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.13.0
 */
exports.ask = (0, FromReader_1.ask)(exports.FromReader);
/**
 * Projects a value from the global context in a `ReaderIO`.
 *
 * @category constructors
 * @since 2.13.0
 */
exports.asks = (0, FromReader_1.asks)(exports.FromReader);
/**
 * @category lifting
 * @since 2.13.0
 */
exports.fromReaderK = (0, FromReader_1.fromReaderK)(exports.FromReader);
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainReaderK = exports.flatMapReader;
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
exports.chainReaderKW = exports.flatMapReader;
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainFirstReaderK = exports.tapReader;
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
exports.chainFirstReaderKW = exports.tapReader;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.13.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.13.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
/**
 * @category do notation
 * @since 2.13.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.13.0
 */
exports.bindW = exports.bind;
/**
 * @category do notation
 * @since 2.13.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.13.0
 */
exports.apSW = exports.apS;
/**
 * @since 2.13.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return (0, function_1.flow)(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(I.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
var traverseArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainW = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainFirst = exports.tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainFirstW = exports.tap;
