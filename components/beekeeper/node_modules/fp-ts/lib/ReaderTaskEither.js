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
exports.apW = exports.ap = exports.mapLeft = exports.mapError = exports.bimap = exports.mapBoth = exports.map = exports.fromReaderEitherK = exports.fromTaskEitherK = exports.fromIOEitherK = exports.swap = exports.orLeftW = exports.orLeft = exports.tapError = exports.orElseW = exports.orElse = exports.asksReaderTaskEither = exports.asksReaderTaskEitherW = exports.local = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.toUnion = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromReaderEither = exports.fromIOEither = exports.fromTask = exports.fromIO = exports.fromReader = exports.fromEither = exports.leftReaderIO = exports.rightReaderIO = exports.leftIO = exports.rightIO = exports.leftReaderTask = exports.rightReaderTask = exports.leftReader = exports.rightReader = exports.leftTask = exports.rightTask = exports.right = exports.left = exports.fromTaskEither = void 0;
exports.chainFirstTaskEitherKW = exports.chainFirstReaderEitherK = exports.chainFirstReaderEitherKW = exports.chainFirstReaderKW = exports.chainFirstReaderK = exports.fromReaderK = exports.asks = exports.ask = exports.Alt = exports.Bifunctor = exports.tapReaderIO = exports.tapReaderTask = exports.tapTaskEither = exports.tapReaderEither = exports.tapReader = exports.tapTask = exports.tapIO = exports.tapEither = exports.tap = exports.FromReader = exports.FromTask = exports.FromIO = exports.FromEither = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.getCompactable = exports.URI = exports.throwError = exports.altW = exports.alt = exports.flatten = exports.flattenW = exports.flatMap = exports.of = void 0;
exports.chainReaderEitherK = exports.chainReaderEitherKW = exports.chainIOEitherK = exports.chainIOEitherKW = exports.chainReaderIOK = exports.chainReaderIOKW = exports.chainReaderKW = exports.chainReaderK = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainReaderTaskK = exports.chainReaderTaskKW = exports.chainTaskEitherK = exports.chainTaskEitherKW = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.flatMapReaderEither = exports.flatMapIOEither = exports.flatMapReaderIO = exports.flatMapReader = exports.flatMapTask = exports.flatMapIO = exports.flatMapReaderTask = exports.flatMapTaskEither = exports.flatMapEither = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.chainOptionKW = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.chainFirstReaderIOK = exports.chainFirstReaderIOKW = exports.fromReaderIOK = exports.chainFirstReaderTaskK = exports.chainFirstReaderTaskKW = exports.fromReaderTaskK = exports.chainFirstTaskEitherK = void 0;
exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.readerTaskEitherSeq = exports.readerTaskEither = exports.orElseFirstW = exports.orElseFirst = exports.chainFirstW = exports.chainFirst = exports.chainW = exports.chain = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.let = exports.bindTo = exports.Do = void 0;
exports.getFilterable = getFilterable;
exports.getApplicativeReaderTaskValidation = getApplicativeReaderTaskValidation;
exports.getAltReaderTaskValidation = getAltReaderTaskValidation;
exports.bracket = bracket;
exports.bracketW = bracketW;
exports.getReaderTaskValidation = getReaderTaskValidation;
exports.run = run;
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var chainable = __importStar(require("./Chain"));
var Compactable_1 = require("./Compactable");
var E = __importStar(require("./Either"));
var ET = __importStar(require("./EitherT"));
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromReader_1 = require("./FromReader");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var R = __importStar(require("./Reader"));
var RT = __importStar(require("./ReaderTask"));
var T = __importStar(require("./Task"));
var TE = __importStar(require("./TaskEither"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromTaskEither = R.of;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = ET.left(RT.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = ET.right(RT.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightTask = (0, function_1.flow)(TE.rightTask, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftTask = (0, function_1.flow)(TE.leftTask, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
var rightReader = function (ma) {
    return (0, function_1.flow)(ma, TE.right);
};
exports.rightReader = rightReader;
/**
 * @category constructors
 * @since 2.0.0
 */
var leftReader = function (me) {
    return (0, function_1.flow)(me, TE.left);
};
exports.leftReader = leftReader;
/**
 * @category constructors
 * @since 2.5.0
 */
exports.rightReaderTask = 
/*#__PURE__*/ ET.rightF(RT.Functor);
/**
 * @category constructors
 * @since 2.5.0
 */
exports.leftReaderTask = 
/*#__PURE__*/ ET.leftF(RT.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = (0, function_1.flow)(TE.rightIO, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = (0, function_1.flow)(TE.leftIO, exports.fromTaskEither);
/**
 * @category constructors
 * @since 2.13.0
 */
var rightReaderIO = function (ma) {
    return (0, function_1.flow)(ma, TE.rightIO);
};
exports.rightReaderIO = rightReaderIO;
/**
 * @category constructors
 * @since 2.13.0
 */
var leftReaderIO = function (me) {
    return (0, function_1.flow)(me, TE.leftIO);
};
exports.leftReaderIO = leftReaderIO;
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromEither = RT.of;
/**
 * @category conversions
 * @since 2.11.0
 */
exports.fromReader = exports.rightReader;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromIO = exports.rightIO;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromTask = exports.rightTask;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromIOEither = (0, function_1.flow)(TE.fromIOEither, exports.fromTaskEither);
/**
 * @category conversions
 * @since 2.0.0
 */
var fromReaderEither = function (ma) {
    return (0, function_1.flow)(ma, TE.fromEither);
};
exports.fromReaderEither = fromReaderEither;
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = ET.match(RT.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`ReaderTask`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchE = ET.matchE(RT.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchEW = exports.matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @category error handling
 * @since 2.0.0
 */
exports.getOrElse = ET.getOrElse(RT.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
exports.getOrElseW = exports.getOrElse;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.toUnion = ET.toUnion(RT.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromNullable = 
/*#__PURE__*/ ET.fromNullable(RT.Pointed);
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.fromNullableK = ET.fromNullableK(RT.Pointed);
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainNullableK = ET.chainNullableK(RT.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.0.0
 */
exports.local = R.local;
/**
 * Less strict version of [`asksReaderTaskEither`](#asksreadertaskeither).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
exports.asksReaderTaskEitherW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
exports.asksReaderTaskEither = exports.asksReaderTaskEitherW;
/**
 * @category error handling
 * @since 2.0.0
 */
exports.orElse = ET.orElse(RT.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.orElseW = exports.orElse;
/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 2.15.0
 */
exports.tapError = (0, function_1.dual)(2, ET.tapError(RT.Monad));
/**
 * @category error handling
 * @since 2.11.0
 */
exports.orLeft = ET.orLeft(RT.Monad);
/**
 * @category error handling
 * @since 2.16.6
 */
exports.orLeftW = exports.orLeft;
/**
 * @since 2.0.0
 */
exports.swap = ET.swap(RT.Functor);
/**
 * @category lifting
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return (0, function_1.flow)(f, exports.fromIOEither); };
exports.fromIOEitherK = fromIOEitherK;
/**
 * @category lifting
 * @since 2.4.0
 */
var fromTaskEitherK = function (f) { return (0, function_1.flow)(f, exports.fromTaskEither); };
exports.fromTaskEitherK = fromTaskEitherK;
/**
 * @category lifting
 * @since 2.11.0
 */
var fromReaderEitherK = function (f) { return (0, function_1.flow)(f, exports.fromReaderEither); };
exports.fromReaderEitherK = fromReaderEitherK;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _apPar = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
var _apSeq = function (fab, fa) { return (0, exports.flatMap)(fab, function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); }); };
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
exports.map = 
/*#__PURE__*/ ET.map(RT.Functor);
/**
 * Returns a `ReaderTaskEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @example
 * import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 * const g = (n: number) => n * 2
 *
 * async function test() {
 *   assert.deepStrictEqual(await ReaderTaskEither.mapBoth(ReaderTaskEither.right(1), f, g)({})(), Either.right(2))
 *   assert.deepStrictEqual(await ReaderTaskEither.mapBoth(ReaderTaskEither.left('err'), f, g)({})(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
exports.mapBoth = (0, function_1.dual)(3, ET.mapBoth(RT.Functor));
/**
 * Alias of `mapBoth`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.bimap = exports.mapBoth;
/**
 * Returns a `ReaderTaskEither` with its error channel mapped using the specified function.
 *
 * @example
 * import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 *
 * async function test() {
 *   assert.deepStrictEqual(await ReaderTaskEither.mapError(ReaderTaskEither.right(1), f)({})(), Either.right(1))
 *   assert.deepStrictEqual(await ReaderTaskEither.mapError(ReaderTaskEither.left('err'), f)({})(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
exports.mapError = (0, function_1.dual)(2, ET.mapError(RT.Functor));
/**
 * Alias of `mapError`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.mapLeft = exports.mapError;
/**
 * @since 2.0.0
 */
exports.ap = ET.ap(RT.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category constructors
 * @since 2.7.0
 */
exports.of = exports.right;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, ET.flatMap(RT.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
exports.flattenW = (0, exports.flatMap)(function_1.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.alt = ET.alt(RT.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
exports.altW = exports.alt;
/**
 * @since 2.0.0
 */
exports.throwError = exports.left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'ReaderTaskEither';
/**
 * @category filtering
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: (0, Compactable_1.compact)(RT.Functor, C),
        separate: (0, Compactable_1.separate)(RT.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category filtering
 * @since 2.10.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = (0, exports.getCompactable)(M);
    var filter = (0, Filterable_1.filter)(RT.Functor, F);
    var filterMap = (0, Filterable_1.filterMap)(RT.Functor, F);
    var partition = (0, Filterable_1.partition)(RT.Functor, F);
    var partitionMap = (0, Filterable_1.partitionMap)(RT.Functor, F);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: C.compact,
        separate: C.separate,
        filter: function (fa, predicate) { return (0, function_1.pipe)(fa, filter(predicate)); },
        filterMap: function (fa, f) { return (0, function_1.pipe)(fa, filterMap(f)); },
        partition: function (fa, predicate) { return (0, function_1.pipe)(fa, partition(predicate)); },
        partitionMap: function (fa, f) { return (0, function_1.pipe)(fa, partitionMap(f)); }
    };
}
/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getApplicativeValidation`](./Either.ts.html#getapplicativevalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
function getApplicativeReaderTaskValidation(A, S) {
    var ap = (0, Apply_1.ap)(R.Apply, TE.getApplicativeTaskValidation(A, S));
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, ap(fa)); },
        of: exports.of
    };
}
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getAltValidation`](./Either.ts.html#getaltvalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
function getAltReaderTaskValidation(S) {
    var alt = ET.altValidation(RT.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return (0, function_1.pipe)(fa, alt(that)); }
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Right` value of this `ReaderTaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Right` value of this `ReaderTaskEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
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
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.ApplyPar);
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apFirstW = exports.apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.ApplyPar);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apSecondW = exports.apSecond;
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    of: exports.of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of,
    throwError: exports.throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromReader = {
    URI: exports.URI,
    fromReader: exports.fromReader
};
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
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 *
 * const checkString = (value: string) => pipe(
 *   RTE.ask<number>(),
 *   RTE.tapEither((minLength) => value.length > minLength ? E.right('ok') : E.left('error'))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await checkString('')(2)(), E.left('error'))
 *   assert.deepStrictEqual(await checkString('fp-ts')(2)(), E.right(2))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapEither = (0, function_1.dual)(2, (0, FromEither_1.tapEither)(exports.FromEither, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as Console from 'fp-ts/Console'
 *
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effect = RTE.tapIO(
 *   RTE.ask<string>(),
 *   (value) => Console.log(`Hello, ${value}`)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect('fp-ts')(), E.of('fp-ts'))
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
 * @example
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as T from 'fp-ts/Task'
 *
 *
 * const effect = RTE.tapTask(
 *   RTE.ask<number>(),
 *   (value) => T.of(value + 1)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(1)(), E.of(1))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapTask = (0, function_1.dual)(2, (0, FromTask_1.tapTask)(exports.FromTask, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapReader = (0, function_1.dual)(2, (0, FromReader_1.tapReader)(exports.FromReader, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapReaderEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.tap)(self, (0, exports.fromReaderEitherK)(f)); });
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapTaskEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.tap)(self, (0, exports.fromTaskEitherK)(f)); });
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapReaderTask = (0, function_1.dual)(2, function (self, f) { return (0, exports.tap)(self, (0, exports.fromReaderTaskK)(f)); });
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapReaderIO = (0, function_1.dual)(2, function (self, f) {
    return (0, exports.tap)(self, (0, exports.fromReaderIOK)(f));
});
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.ask = (0, FromReader_1.ask)(exports.FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.asks = (0, FromReader_1.asks)(exports.FromReader);
/**
 * @category lifting
 * @since 2.11.0
 */
exports.fromReaderK = (0, FromReader_1.fromReaderK)(exports.FromReader);
/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderK = exports.tapReader;
/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderKW = exports.tapReader;
/**
 * Alias of `tapReaderEither`.
 *
 * Less strict version of [`chainFirstReaderEitherK`](#chainfirstreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderEitherKW = exports.tapReaderEither;
/**
 * Alias of `tapReaderEither`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderEitherK = exports.tapReaderEither;
/**
 * Alias of `tapTaskEither`.
 *
 * Less strict version of [`chainFirstTaskEitherK`](#chainfirsttaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstTaskEitherKW = exports.tapTaskEither;
/**
 * Alias of `tapTaskEither`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstTaskEitherK = exports.tapTaskEither;
/**
 * @category lifting
 * @since 2.11.0
 */
var fromReaderTaskK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.rightReaderTask)(f.apply(void 0, a));
    };
};
exports.fromReaderTaskK = fromReaderTaskK;
/**
 * Alias of `tapReaderTask`.
 *
 * Less strict version of [`chainFirstReaderTaskK`](#chainfirstreadertaskk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderTaskKW = exports.tapReaderTask;
/**
 * Alias of `tapReaderTask`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderTaskK = exports.tapReaderTask;
/**
 * @category lifting
 * @since 2.13.0
 */
var fromReaderIOK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.rightReaderIO)(f.apply(void 0, a));
    };
};
exports.fromReaderIOK = fromReaderIOK;
/**
 * Alias of `tapReaderIO`.
 *
 * Less strict version of [`chainFirstReaderIOK`](#chainfirstreaderiok).
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainFirstReaderIOKW = exports.tapReaderIO;
/**
 * Alias of `tapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainFirstReaderIOK = exports.tapReaderIO;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/ (0, FromEither_1.fromOption)(exports.FromEither);
/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.fromOptionK = (0, FromEither_1.fromOptionK)(exports.FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainOptionK = 
/*#__PURE__*/ (0, FromEither_1.chainOptionK)(exports.FromEither, exports.Chain);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
exports.chainOptionKW = exports.chainOptionK;
/** @internal */
var _FromEither = {
    fromEither: exports.FromEither.fromEither
};
/**
 * @category lifting
 * @since 2.15.0
 */
exports.liftNullable = _.liftNullable(_FromEither);
/**
 * @category lifting
 * @since 2.15.0
 */
exports.liftOption = _.liftOption(_FromEither);
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/** @internal */
var _FromIO = {
    fromIO: exports.fromIO
};
/** @internal */
var _FromTask = {
    fromTask: exports.fromTask
};
/** @internal */
var _FromReader = {
    fromReader: exports.fromReader
};
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapNullable = _.flatMapNullable(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapOption = _.flatMapOption(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapEither = _.flatMapEither(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapTaskEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, (0, exports.fromTaskEitherK)(f)); });
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapReaderTask = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, (0, exports.fromReaderTaskK)(f)); });
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapIO = _.flatMapIO(_FromIO, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapTask = _.flatMapTask(_FromTask, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapReader = _.flatMapReader(_FromReader, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapReaderIO = (0, function_1.dual)(2, function (self, f) {
    return (0, exports.flatMap)(self, (0, exports.fromReaderIOK)(f));
});
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapIOEither = (0, function_1.dual)(2, function (self, f) {
    return (0, exports.flatMap)(self, (0, exports.fromIOEitherK)(f));
});
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapReaderEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, (0, exports.fromReaderEitherK)(f)); });
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainEitherK = exports.flatMapEither;
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.6.1
 */
exports.chainEitherKW = exports.flatMapEither;
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherK = exports.tapEither;
/**
 * Alias of `tapEither`.
 *
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherKW = exports.tapEither;
/**
 * Alias of `flatMapTaskEither`.
 *
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
exports.chainTaskEitherKW = exports.flatMapTaskEither;
/**
 * Alias of `flatMapTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainTaskEitherK = exports.flatMapTaskEither;
/**
 * Alias of `flatMapReaderTask`.
 *
 * Less strict version of [`chainReaderTaskK`](#chainreadertaskk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderTaskKW = exports.flatMapReaderTask;
/**
 * Alias of `flatMapReaderTask`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderTaskK = exports.flatMapReaderTask;
/**
 * @category lifting
 * @since 2.0.0
 */
exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
/**
 * @category filtering
 * @since 2.0.0
 */
exports.filterOrElse = (0, FromEither_1.filterOrElse)(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * @category lifting
 * @since 2.4.0
 */
exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromIOK = (0, FromIO_1.fromIOK)(exports.FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainIOK = exports.flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstIOK = exports.tapIO;
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromTaskK = (0, FromTask_1.fromTaskK)(exports.FromTask);
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainTaskK = exports.flatMapTask;
/**
 * Alias of `tapTask`.
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstTaskK = exports.tapTask;
/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderK = exports.flatMapReader;
/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderKW = exports.flatMapReader;
/**
 * Alias of `flatMapReaderIO`.
 *
 * Less strict version of [`chainReaderIOK`](#chainreaderiok).
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainReaderIOKW = exports.flatMapReaderIO;
/**
 * Alias of `flatMapReaderIO`.
 *
 * @category legacy
 * @since 2.13.0
 */
exports.chainReaderIOK = exports.flatMapReaderIO;
/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
exports.chainIOEitherKW = exports.flatMapIOEither;
/**
 * Alias of `flatMapIOEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainIOEitherK = exports.flatMapIOEither;
/**
 * Alias of `flatMapReaderEither`.
 *
 * Less strict version of [`chainReaderEitherK`](#chainreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderEitherKW = exports.flatMapReaderEither;
/**
 * Alias of `flatMapReaderEither`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderEitherK = exports.flatMapReaderEither;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.4
 */
function bracket(acquire, use, release) {
    return bracketW(acquire, use, release);
}
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
function bracketW(acquire, use, release) {
    return function (r) {
        return TE.bracketW(acquire(r), function (a) { return use(a)(r); }, function (a, e) { return release(a, e)(r); });
    };
}
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
exports.bind = chainable.bind(exports.Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.bindW = exports.bind;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.ApplyPar);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.apSW = exports.apS;
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return (0, function_1.flow)(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(TE.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
    return (0, function_1.flow)(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(TE.traverseReadonlyNonEmptyArrayWithIndexSeq(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndexSeq)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) {
    return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); });
};
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = (0, exports.traverseArray)(function_1.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseSeqArray = function (f) {
    return (0, exports.traverseReadonlyArrayWithIndexSeq)(function (_, a) { return f(a); });
};
exports.traverseSeqArray = traverseSeqArray;
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceSeqArray = (0, exports.traverseSeqArray)(function_1.identity);
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
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
exports.chainW = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chainFirst = exports.tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
exports.chainFirstW = exports.tap;
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.orElseFirst = exports.tapError;
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.orElseFirstW = exports.tapError;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RTE.Functor` instead of `RTE.readerTaskEither`
 * (where `RTE` is from `import RTE from 'fp-ts/ReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.readerTaskEither = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap,
    alt: _alt,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RTE.Functor` instead of `RTE.readerTaskEitherSeq`
 * (where `RTE` is from `import RTE from 'fp-ts/ReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.readerTaskEitherSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: exports.flatMap,
    alt: _alt,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/ (0, Apply_1.getApplySemigroup)(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/ (0, Applicative_1.getApplicativeMonoid)(exports.ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup = function (S) {
    return (0, Apply_1.getApplySemigroup)(RT.ApplySeq)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeReaderTaskValidation`](#getapplicativereadertaskvalidation) and [`getAltReaderTaskValidation`](#getaltreadertaskvalidation) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
function getReaderTaskValidation(SE) {
    var applicativeReaderTaskValidation = getApplicativeReaderTaskValidation(T.ApplicativePar, SE);
    var altReaderTaskValidation = getAltReaderTaskValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        of: exports.of,
        chain: exports.flatMap,
        bimap: exports.mapBoth,
        mapLeft: exports.mapError,
        ap: applicativeReaderTaskValidation.ap,
        alt: altReaderTaskValidation.alt,
        fromIO: exports.fromIO,
        fromTask: exports.fromTask,
        throwError: exports.throwError
    };
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
function run(ma, r) {
    return ma(r)();
}
