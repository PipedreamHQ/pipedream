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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplySeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.URI = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.separate = exports.compact = exports.none = exports.zero = exports.altW = exports.alt = exports.flatten = exports.flatMapTask = exports.flatMapIO = exports.flatMap = exports.of = exports.ap = exports.map = exports.chainOptionK = exports.fromOptionK = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromTaskEither = exports.fromTask = exports.fromIO = exports.fromEither = exports.fromOption = exports.fromPredicate = exports.some = void 0;
exports.chainFirst = exports.chain = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.Filterable = exports.Compactable = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Alternative = exports.guard = exports.Zero = exports.Alt = exports.tapTask = exports.tapIO = exports.tapEither = exports.tap = exports.FromTask = exports.FromIO = exports.FromEither = exports.Chain = exports.ApplicativeSeq = void 0;
var Apply_1 = require("./Apply");
var chainable = __importStar(require("./Chain"));
var Compactable_1 = require("./Compactable");
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var O = __importStar(require("./Option"));
var OT = __importStar(require("./OptionT"));
var T = __importStar(require("./Task"));
var Zero_1 = require("./Zero");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
exports.some = OT.some(T.Pointed);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromPredicate = OT.fromPredicate(T.Pointed);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromOption = T.of;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromEither = OT.fromEither(T.Pointed);
/**
 * @category conversions
 * @since 2.10.0
 */
var fromIO = function (ma) { return (0, exports.fromTask)(T.fromIO(ma)); };
exports.fromIO = fromIO;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromTask = OT.fromF(T.Functor);
/**
 * @category conversions
 * @since 2.11.0
 */
exports.fromTaskEither = T.map(O.fromEither);
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/ OT.match(T.Functor);
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
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchE = 
/*#__PURE__*/ OT.matchE(T.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.10.0
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
 * @since 2.10.0
 */
exports.getOrElse = OT.getOrElse(T.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.getOrElseW = exports.getOrElse;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.fromNullable = OT.fromNullable(T.Pointed);
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Option` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatch = function (f) {
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var reason_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, f().then(_.some)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    reason_1 = _a.sent();
                    return [2 /*return*/, _.none];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
exports.tryCatch = tryCatch;
/**
 * Converts a function returning a `Promise` to one returning a `TaskOption`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.tryCatch)(function () { return f.apply(void 0, a); });
    };
};
exports.tryCatchK = tryCatchK;
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromNullableK = OT.fromNullableK(T.Pointed);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.chainNullableK = OT.chainNullableK(T.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromOptionK = OT.fromOptionK(T.Pointed);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.chainOptionK = 
/*#__PURE__*/ OT.chainOptionK(T.Monad);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.10.0
 */
exports.map = OT.map(T.Functor);
/**
 * @since 2.10.0
 */
exports.ap = OT.ap(T.ApplyPar);
/**
 * @category constructors
 * @since 2.10.0
 */
exports.of = exports.some;
/** @internal */
var _FromIO = {
    fromIO: exports.fromIO
};
/** @internal */
var _FromTask = {
    fromTask: exports.fromTask
};
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, OT.flatMap(T.Monad));
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
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
exports.flatMapTask = _.flatMapTask(_FromTask, _FlatMap);
/**
 * @category sequencing
 * @since 2.10.0
 */
exports.flatten = (0, exports.flatMap)(function_1.identity);
/**
 * @category error handling
 * @since 2.10.0
 */
exports.alt = OT.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.altW = exports.alt;
/**
 * @since 2.10.0
 */
exports.zero = OT.zero(T.Pointed);
/**
 * @category constructors
 * @since 2.10.0
 */
exports.none = (0, exports.zero)();
/**
 * @category filtering
 * @since 2.10.0
 */
exports.compact = (0, Compactable_1.compact)(T.Functor, O.Compactable);
/**
 * @category filtering
 * @since 2.10.0
 */
exports.separate = (0, Compactable_1.separate)(T.Functor, O.Compactable, O.Functor);
/**
 * @category filtering
 * @since 2.10.0
 */
exports.filter = (0, Filterable_1.filter)(T.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.10.0
 */
exports.filterMap = 
/*#__PURE__*/ (0, Filterable_1.filterMap)(T.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.10.0
 */
exports.partition = (0, Filterable_1.partition)(T.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.10.0
 */
exports.partitionMap = (0, Filterable_1.partitionMap)(T.Functor, O.Filterable);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
/* istanbul ignore next */
var _filter = function (fa, predicate) {
    return (0, function_1.pipe)(fa, (0, exports.filter)(predicate));
};
/* istanbul ignore next */
var _filterMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMap)(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return (0, function_1.pipe)(fa, (0, exports.partition)(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMap)(f)); };
/**
 * @category type lambdas
 * @since 2.10.0
 */
exports.URI = 'TaskOption';
/**
 * @category instances
 * @since 2.10.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Some` value of this `TaskOption` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Some` value of this `TaskOption` to the void constant value.
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
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.10.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.10.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.ApplyPar);
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
var _apSeq = function (fab, fa) { return (0, exports.flatMap)(fab, function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); }); };
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
 * @since 2.10.0
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
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.11.0
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
 * import * as TO from 'fp-ts/TaskOption'
 * import * as O from 'fp-ts/Option'
 * import * as E from 'fp-ts/Either'
 *
 * const compute = (value: number) => pipe(
 *   TO.of(value),
 *   TO.tapEither((value) => value > 0 ? E.right('ok') : E.left('error')),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await compute(1)(), O.of(1))
 *   assert.deepStrictEqual(await compute(-1)(), O.none)
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
 * import { pipe } from 'fp-ts/function'
 * import * as TO from 'fp-ts/TaskOption'
 * import * as O from 'fp-ts/Option'
 * import * as Console from 'fp-ts/Console'
 *
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effectA = TO.tapIO(
 *   TO.of(1),
 *   (value) => Console.log(`Hello, ${value}`)
 * )
 *
 * // No output to the stdout
 * const effectB = pipe(
 *   TO.none as TO.TaskOption<string>,
 *   TO.tapIO((value) => Console.log(`Hello, ${value}`))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effectA(), O.of(1))
 *   assert.deepStrictEqual(await effectB(), O.none)
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
 * import * as TO from 'fp-ts/TaskOption'
 * import * as O from 'fp-ts/Option'
 * import * as T from 'fp-ts/Task'
 *
 * const effect = TO.tapIO(
 *   TO.of(1),
 *   (value) => T.of(value + 1)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(), O.of(1))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapTask = (0, function_1.dual)(2, (0, FromTask_1.tapTask)(exports.FromTask, exports.Chain));
/**
 * @category instances
 * @since 2.10.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.Zero = {
    URI: exports.URI,
    zero: exports.zero
};
/**
 * @category do notation
 * @since 2.11.0
 */
exports.guard = (0, Zero_1.guard)(exports.Zero, exports.Pointed);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Alternative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    alt: _alt,
    zero: exports.zero
};
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
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Filterable = {
    URI: exports.URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromIOK = 
/*#__PURE__*/ (0, FromIO_1.fromIOK)(exports.FromIO);
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
 * @since 2.12.0
 */
exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
/**
 * @category sequencing
 * @since 2.12.0
 */
exports.chainEitherK = 
/*#__PURE__*/ (0, FromEither_1.chainEitherK)(exports.FromEither, exports.Chain);
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherK = exports.tapEither;
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromTaskK = 
/*#__PURE__*/ (0, FromTask_1.fromTaskK)(exports.FromTask);
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainTaskK = exports.flatMapTask;
/**
 * Alias of `tapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstTaskK = exports.tapTask;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.10.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.10.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.10.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * @category do notation
 * @since 2.10.0
 */
exports.apS = (0, Apply_1.apS)(exports.ApplyPar);
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
    return (0, function_1.flow)(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(O.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
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
    return function (as) {
        return function () {
            return _.tail(as).reduce(function (acc, a, i) {
                return acc.then(function (obs) {
                    return _.isNone(obs)
                        ? acc
                        : f(i + 1, a)().then(function (ob) {
                            if (_.isNone(ob)) {
                                return ob;
                            }
                            obs.value.push(ob.value);
                            return obs;
                        });
                });
            }, f(0, _.head(as))().then(O.map(_.singleton)));
        };
    };
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
 * @since 2.10.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.10.0
 */
var traverseArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.10.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
var traverseSeqArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndexSeq)(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/ (0, exports.traverseSeqArray)(function_1.identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirst = exports.tap;
