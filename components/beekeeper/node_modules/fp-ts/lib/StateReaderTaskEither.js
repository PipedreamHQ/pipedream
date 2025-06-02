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
exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.URI = exports.throwError = exports.alt = exports.altW = exports.flatten = exports.flattenW = exports.flatMapState = exports.flatMapReaderTaskEither = exports.flatMapOption = exports.flatMapEither = exports.flatMapIOEither = exports.flatMapReader = exports.flatMapTask = exports.flatMapIO = exports.flatMapTaskEither = exports.flatMap = exports.of = exports.apW = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.chainReaderTaskEitherK = exports.chainReaderTaskEitherKW = exports.fromReaderTaskEitherK = exports.fromTaskEitherK = exports.fromIOEitherK = exports.asksStateReaderTaskEither = exports.asksStateReaderTaskEitherW = exports.local = exports.fromReaderTaskEither = exports.fromReaderEither = exports.fromIOEither = exports.fromTaskEither = exports.fromState = exports.fromTask = exports.fromIO = exports.fromReader = exports.fromEither = exports.leftState = exports.rightState = exports.right = exports.left = void 0;
exports.chainTaskEitherKW = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.chainOptionKW = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.chainFirstReaderKW = exports.chainFirstReaderK = exports.chainReaderKW = exports.chainReaderK = exports.fromReaderK = exports.asks = exports.ask = exports.Alt = exports.Bifunctor = exports.tapReader = exports.tapTask = exports.tapIO = exports.tapEither = exports.tap = exports.FromReader = exports.FromTask = exports.FromIO = exports.FromEither = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.chainStateK = exports.fromStateK = exports.gets = exports.modify = exports.put = exports.get = exports.FromState = exports.Chain = exports.Applicative = exports.apSecondW = exports.apSecond = exports.apFirstW = void 0;
exports.execState = exports.evalState = exports.stateReaderTaskEitherSeq = exports.stateReaderTaskEither = exports.chainFirstW = exports.chainFirst = exports.chainW = exports.chain = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.let = exports.bindTo = exports.execute = exports.evaluate = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.chainIOEitherK = exports.chainIOEitherKW = exports.chainTaskEitherK = void 0;
exports.rightTask = rightTask;
exports.leftTask = leftTask;
exports.rightReader = rightReader;
exports.leftReader = leftReader;
exports.rightIO = rightIO;
exports.leftIO = leftIO;
exports.run = run;
var Apply_1 = require("./Apply");
var chainable = __importStar(require("./Chain"));
var E = __importStar(require("./Either"));
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromReader_1 = require("./FromReader");
var FromState_1 = require("./FromState");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var R = __importStar(require("./Reader"));
var RTE = __importStar(require("./ReaderTaskEither"));
var ST = __importStar(require("./StateT"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var left = function (e) { return function () { return RTE.left(e); }; };
exports.left = left;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = ST.of(RTE.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
function rightTask(ma) {
    return (0, exports.fromReaderTaskEither)(RTE.rightTask(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
function leftTask(me) {
    return (0, exports.fromReaderTaskEither)(RTE.leftTask(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
function rightReader(ma) {
    return (0, exports.fromReaderTaskEither)(RTE.rightReader(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
function leftReader(me) {
    return (0, exports.fromReaderTaskEither)(RTE.leftReader(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
function rightIO(ma) {
    return (0, exports.fromReaderTaskEither)(RTE.rightIO(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
function leftIO(me) {
    return (0, exports.fromReaderTaskEither)(RTE.leftIO(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
var rightState = function (sa) {
    return (0, function_1.flow)(sa, RTE.right);
};
exports.rightState = rightState;
/**
 * @category constructors
 * @since 2.0.0
 */
var leftState = function (me) { return function (s) {
    return RTE.left(me(s)[0]);
}; };
exports.leftState = leftState;
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromEither = 
/*#__PURE__*/ E.match(function (e) { return (0, exports.left)(e); }, exports.right);
/**
 * @category conversions
 * @since 2.11.0
 */
exports.fromReader = rightReader;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromIO = rightIO;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromTask = rightTask;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromState = 
/*#__PURE__*/ ST.fromState(RTE.Pointed);
/**
 * @category conversions
 * @since 2.0.0
 */
var fromTaskEither = function (ma) {
    return (0, exports.fromReaderTaskEither)(RTE.fromTaskEither(ma));
};
exports.fromTaskEither = fromTaskEither;
/**
 * @category conversions
 * @since 2.0.0
 */
var fromIOEither = function (ma) {
    return (0, exports.fromReaderTaskEither)(RTE.fromIOEither(ma));
};
exports.fromIOEither = fromIOEither;
/**
 * @category conversions
 * @since 2.0.0
 */
var fromReaderEither = function (ma) {
    return (0, exports.fromReaderTaskEither)(RTE.fromReaderEither(ma));
};
exports.fromReaderEither = fromReaderEither;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromReaderTaskEither = 
/*#__PURE__*/ ST.fromF(RTE.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.11.0
 */
var local = function (f) {
    return function (ma) {
        return (0, function_1.flow)(ma, R.local(f));
    };
};
exports.local = local;
/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category constructors
 * @since 2.11.0
 */
var asksStateReaderTaskEitherW = function (f) {
    return function (s) {
        return function (r) {
            return f(r)(s)(r);
        };
    };
};
exports.asksStateReaderTaskEitherW = asksStateReaderTaskEitherW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
exports.asksStateReaderTaskEither = exports.asksStateReaderTaskEitherW;
/**
 * @category lifting
 * @since 2.4.0
 */
var fromIOEitherK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.fromIOEither)(f.apply(void 0, a));
    };
};
exports.fromIOEitherK = fromIOEitherK;
/**
 * @category lifting
 * @since 2.4.0
 */
var fromTaskEitherK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.fromTaskEither)(f.apply(void 0, a));
    };
};
exports.fromTaskEitherK = fromTaskEitherK;
/**
 * @category lifting
 * @since 2.4.0
 */
var fromReaderTaskEitherK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.fromReaderTaskEither)(f.apply(void 0, a));
    };
};
exports.fromReaderTaskEitherK = fromReaderTaskEitherK;
/**
 * Alias of `flatMapReaderTaskEither`.
 *
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
var chainReaderTaskEitherKW = function (f) {
    return function (ma) {
        return (0, exports.flatMap)(ma, (0, exports.fromReaderTaskEitherK)(f));
    };
};
exports.chainReaderTaskEitherKW = chainReaderTaskEitherKW;
/**
 * Alias of `flatMapReaderTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainReaderTaskEitherK = exports.chainReaderTaskEitherKW;
/* istanbul ignore next */
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function (s) {
    return (0, function_1.pipe)(fa(s), RTE.alt(function () { return that()(s); }));
}; };
var _bimap = function (fea, f, g) { return function (s) {
    return (0, function_1.pipe)(fea(s), RTE.bimap(f, function (_a) {
        var a = _a[0], s = _a[1];
        return [g(a), s];
    }));
}; };
var _mapLeft = function (fea, f) { return function (s) { return (0, function_1.pipe)(fea(s), RTE.mapLeft(f)); }; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
exports.map = ST.map(RTE.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.6.2
 */
var bimap = function (f, g) { return function (fa) {
    return _bimap(fa, f, g);
}; };
exports.bimap = bimap;
/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.6.2
 */
var mapLeft = function (f) { return function (fa) {
    return _mapLeft(fa, f);
}; };
exports.mapLeft = mapLeft;
/**
 * @since 2.0.0
 */
exports.ap = ST.ap(RTE.Chain);
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
/** @internal */
var _FromEither = {
    fromEither: exports.fromEither
};
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, ST.flatMap(RTE.Monad));
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapTaskEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, function (a) { return (0, exports.fromTaskEitherK)(f)(a); }); });
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
exports.flatMapIOEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, function (a) { return (0, exports.fromIOEitherK)(f)(a); }); });
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapEither = (0, function_1.dual)(2, _.flatMapEither(_FromEither, _FlatMap));
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapOption = _.flatMapOption(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapReaderTaskEither = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, function (a) { return (0, exports.fromReaderTaskEitherK)(f)(a); }); });
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapState = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, (0, exports.fromStateK)(f)); });
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
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
var altW = function (that) {
    return function (fa) {
        return function (r) {
            return (0, function_1.pipe)(fa(r), RTE.altW(function () { return that()(r); }));
        };
    };
};
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.6.2
 */
exports.alt = exports.altW;
/**
 * @since 2.7.0
 */
exports.throwError = exports.left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'StateReaderTaskEither';
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Right` value of this `StateReaderTaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Right` value of this `StateReaderTaskEither` to the void constant value.
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
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apSecondW = exports.apSecond;
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
 * @since 2.11.0
 */
exports.FromState = {
    URI: exports.URI,
    fromState: exports.fromState
};
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.get = (0, FromState_1.get)(exports.FromState);
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.put = (0, FromState_1.put)(exports.FromState);
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.modify = 
/*#__PURE__*/ (0, FromState_1.modify)(exports.FromState);
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
exports.gets = 
/*#__PURE__*/ (0, FromState_1.gets)(exports.FromState);
/**
 * @category lifting
 * @since 2.11.0
 */
exports.fromStateK = (0, FromState_1.fromStateK)(exports.FromState);
/**
 * Alias of `flatMapState`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainStateK = (0, FromState_1.chainStateK)(exports.FromState, exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap,
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
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap,
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
 * @category combinators
 * @since 2.16.0
 */
exports.tapEither = (0, function_1.dual)(2, (0, FromEither_1.tapEither)(exports.FromEither, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
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
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
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
 * @since 2.11.0
 */
exports.ask = (0, FromReader_1.ask)(exports.FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
 */
exports.asks = 
/*#__PURE__*/ (0, FromReader_1.asks)(exports.FromReader);
/**
 * @category lifting
 * @since 2.11.0
 */
exports.fromReaderK = (0, FromReader_1.fromReaderK)(exports.FromReader);
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
 * Less strict version of [`chainReaderK`](#chainReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainReaderKW = exports.flatMapReader;
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
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainFirstReaderKW = exports.tapReader;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromOption = (0, FromEither_1.fromOption)(exports.FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromOptionK = (0, FromEither_1.fromOptionK)(exports.FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainOptionK = (0, FromEither_1.chainOptionK)(exports.FromEither, exports.Chain);
/**
 * Use `flatMapOption`.
 *
 * Less strict version of [`chainOptionK`](#chainoptionk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.13.2
 */
exports.chainOptionKW = exports.chainOptionK;
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
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
 * @category lifting
 * @since 2.4.4
 */
exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
/**
 * @category filtering
 * @since 2.4.4
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
 * Alias of `flatMapTaskEither`.
 *
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
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
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
exports.evaluate = 
/*#__PURE__*/ ST.evaluate(RTE.Functor);
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
exports.execute = 
/*#__PURE__*/ ST.execute(RTE.Functor);
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports.let = let_;
/**
 * @since 2.8.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
exports.bindW = exports.bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.apSW = exports.apS;
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function (as) {
        return function (s) {
            return function (r) {
                return function () {
                    return _.tail(as).reduce(function (acc, a, i) {
                        return acc.then(function (ebs) {
                            return _.isLeft(ebs)
                                ? acc
                                : f(i + 1, a)(ebs.right[1])(r)().then(function (eb) {
                                    if (_.isLeft(eb)) {
                                        return eb;
                                    }
                                    var _a = eb.right, b = _a[0], s = _a[1];
                                    ebs.right[0].push(b);
                                    ebs.right[1] = s;
                                    return ebs;
                                });
                        });
                    }, f(0, _.head(as))(s)(r)().then(E.map(function (_a) {
                        var b = _a[0], s = _a[1];
                        return [[b], s];
                    })));
                };
            };
        };
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : (0, exports.of)(_.emptyReadonlyArray)); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEither`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.stateReaderTaskEither = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEitherSeq`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.stateReaderTaskEitherSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
var evalState = function (fsa, s) {
    return (0, function_1.pipe)(fsa(s), RTE.map(function (_a) {
        var a = _a[0];
        return a;
    }));
};
exports.evalState = evalState;
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
var execState = function (fsa, s) {
    return (0, function_1.pipe)(fsa(s), RTE.map(function (_a) {
        var _ = _a[0], s = _a[1];
        return s;
    }));
};
exports.execState = execState;
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
function run(ma, s, r) {
    return ma(s)(r)();
}
