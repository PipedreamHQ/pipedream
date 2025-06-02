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
exports.throwError = exports.of = exports.altW = exports.alt = exports.flatten = exports.flattenW = exports.flatMap = exports.apW = exports.ap = exports.mapLeft = exports.mapError = exports.bimap = exports.mapBoth = exports.map = exports.fromIOEitherK = exports.chainTaskOptionK = exports.chainTaskOptionKW = exports.fromTaskOptionK = exports.swap = exports.orLeft = exports.orElseFirstTaskK = exports.orElseFirstIOK = exports.tapError = exports.orElseW = exports.orElse = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.toUnion = exports.tryCatchK = exports.tryCatch = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromTaskOption = exports.fromIOEither = exports.fromEither = exports.fromTask = exports.fromIO = exports.leftIO = exports.rightIO = exports.leftTask = exports.rightTask = exports.right = exports.left = void 0;
exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.flatMapTaskOption = exports.flatMapIOEither = exports.flatMapTask = exports.flatMapIO = exports.flatMapEither = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.chainOptionKW = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.Alt = exports.Bifunctor = exports.tapTask = exports.tapIO = exports.tapEither = exports.tap = exports.FromTask = exports.FromIO = exports.FromEither = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.getCompactable = exports.URI = void 0;
exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.taskEitherSeq = exports.taskEither = exports.orElseFirstW = exports.orElseFirst = exports.chainFirstW = exports.chainFirst = exports.chainW = exports.chain = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.let = exports.bindTo = exports.Do = exports.bracketW = exports.bracket = exports.chainIOEitherK = exports.chainIOEitherKW = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = void 0;
exports.getApplicativeTaskValidation = getApplicativeTaskValidation;
exports.getAltTaskValidation = getAltTaskValidation;
exports.getFilterable = getFilterable;
exports.taskify = taskify;
exports.getTaskValidation = getTaskValidation;
var Applicative_1 = require("./Applicative");
var Apply_1 = require("./Apply");
var chainable = __importStar(require("./Chain"));
var Compactable_1 = require("./Compactable");
var E = __importStar(require("./Either"));
var ET = __importStar(require("./EitherT"));
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var T = __importStar(require("./Task"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = ET.left(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = ET.right(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightTask = ET.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftTask = ET.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = (0, function_1.flow)(T.fromIO, exports.rightTask);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = (0, function_1.flow)(T.fromIO, exports.leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromIO = exports.rightIO;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromTask = exports.rightTask;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromEither = T.of;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromIOEither = T.fromIO;
/**
 * @category conversions
 * @since 2.11.0
 */
var fromTaskOption = function (onNone) {
    return T.map(E.fromOption(onNone));
};
exports.fromTaskOption = fromTaskOption;
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/ ET.match(T.Functor);
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
exports.matchE = ET.matchE(T.Monad);
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
exports.getOrElse = 
/*#__PURE__*/ ET.getOrElse(T.Monad);
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
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onRejected) {
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var reason_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, f().then(_.right)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    reason_1 = _a.sent();
                    return [2 /*return*/, _.left(onRejected(reason_1))];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
exports.tryCatch = tryCatch;
/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
var tryCatchK = function (f, onRejected) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.tryCatch)(function () { return f.apply(void 0, a); }, onRejected);
    };
};
exports.tryCatchK = tryCatchK;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.toUnion = ET.toUnion(T.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromNullable = ET.fromNullable(T.Pointed);
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.fromNullableK = ET.fromNullableK(T.Pointed);
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainNullableK = 
/*#__PURE__*/ ET.chainNullableK(T.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElse = 
/*#__PURE__*/ ET.orElse(T.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
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
exports.tapError = (0, function_1.dual)(2, ET.tapError(T.Monad));
/**
 * @category error handling
 * @since 2.12.0
 */
var orElseFirstIOK = function (onLeft) { return (0, exports.tapError)((0, exports.fromIOK)(onLeft)); };
exports.orElseFirstIOK = orElseFirstIOK;
/**
 * @category error handling
 * @since 2.12.0
 */
var orElseFirstTaskK = function (onLeft) { return (0, exports.tapError)((0, exports.fromTaskK)(onLeft)); };
exports.orElseFirstTaskK = orElseFirstTaskK;
/**
 * @category error handling
 * @since 2.11.0
 */
exports.orLeft = 
/*#__PURE__*/ ET.orLeft(T.Monad);
/**
 * @since 2.0.0
 */
exports.swap = ET.swap(T.Functor);
/**
 * @category lifting
 * @since 2.11.0
 */
var fromTaskOptionK = function (onNone) {
    var from = (0, exports.fromTaskOption)(onNone);
    return function (f) { return (0, function_1.flow)(f, from); };
};
exports.fromTaskOptionK = fromTaskOptionK;
/**
 * Use `flatMapTaskOption`.
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.12.3
 */
var chainTaskOptionKW = function (onNone) {
    return function (f) {
        return function (ma) {
            return (0, exports.flatMap)(ma, (0, exports.fromTaskOptionK)(onNone)(f));
        };
    };
};
exports.chainTaskOptionKW = chainTaskOptionKW;
/**
 * Use `flatMapTaskOption`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainTaskOptionK = exports.chainTaskOptionKW;
/**
 * @category lifting
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return (0, function_1.flow)(f, exports.fromIOEither); };
exports.fromIOEitherK = fromIOEitherK;
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
exports.map = ET.map(T.Functor);
/**
 * Returns a `TaskEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @example
 * import * as TaskEither from 'fp-ts/TaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 * const g = (n: number) => n * 2
 *
 * async function test() {
 *   assert.deepStrictEqual(await TaskEither.mapBoth(TaskEither.right(1), f, g)(), Either.right(2))
 *   assert.deepStrictEqual(await TaskEither.mapBoth(TaskEither.left('err'), f, g)(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
exports.mapBoth = (0, function_1.dual)(3, ET.mapBoth(T.Functor));
/**
 * Alias of `mapBoth`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.bimap = exports.mapBoth;
/**
 * Returns a `TaskEither` with its error channel mapped using the specified function.
 *
 * @example
 * import * as TaskEither from 'fp-ts/TaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 *
 * async function test() {
 *   assert.deepStrictEqual(await TaskEither.mapError(TaskEither.right(1), f)(), Either.right(1))
 *   assert.deepStrictEqual(await TaskEither.mapError(TaskEither.left('err'), f)(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
exports.mapError = (0, function_1.dual)(2, ET.mapError(T.Functor));
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
exports.ap = 
/*#__PURE__*/ ET.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, ET.flatMap(T.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
exports.flattenW = 
/*#__PURE__*/ (0, exports.flatMap)(function_1.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
exports.alt = 
/*#__PURE__*/ ET.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
exports.altW = exports.alt;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.of = exports.right;
/**
 * @since 2.7.0
 */
exports.throwError = exports.left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'TaskEither';
/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 * import * as T from 'fp-ts/Task'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * interface User {
 *   readonly id: string
 *   readonly name: string
 * }
 *
 * const remoteDatabase: ReadonlyArray<User> = [
 *   { id: 'id1', name: 'John' },
 *   { id: 'id2', name: 'Mary' },
 *   { id: 'id3', name: 'Joey' }
 * ]
 *
 * const fetchUser = (id: string): TE.TaskEither<string, User> =>
 *   pipe(
 *     remoteDatabase,
 *     RA.findFirst((user) => user.id === id),
 *     TE.fromOption(() => `${id} not found`)
 *   )
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(TE.ApplicativePar)(fetchUser))(),
 *     E.left('id4 not found') // <= first error
 *   )
 *
 *   const Applicative = TE.getApplicativeTaskValidation(
 *     T.ApplyPar,
 *     pipe(string.Semigroup, S.intercalate(', '))
 *   )
 *
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(Applicative)(fetchUser))(),
 *     E.left('id4 not found, id5 not found') // <= all errors
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.7.0
 */
function getApplicativeTaskValidation(A, S) {
    var ap = (0, Apply_1.ap)(A, E.getApplicativeValidation(S));
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
function getAltTaskValidation(S) {
    var alt = ET.altValidation(T.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return (0, function_1.pipe)(fa, alt(that)); }
    };
}
/**
 * @category filtering
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: (0, Compactable_1.compact)(T.Functor, C),
        separate: (0, Compactable_1.separate)(T.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category filtering
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = (0, exports.getCompactable)(M);
    var filter = (0, Filterable_1.filter)(T.Functor, F);
    var filterMap = (0, Filterable_1.filterMap)(T.Functor, F);
    var partition = (0, Filterable_1.partition)(T.Functor, F);
    var partitionMap = (0, Filterable_1.partitionMap)(T.Functor, F);
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
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Right` value of this `TaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Right` value of this `TaskEither` to the void constant value.
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
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
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
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
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
 * import * as TE from 'fp-ts/TaskEither'
 *
 * const checkString = (value: string) => pipe(
 *   TE.of(value),
 *   TE.tapEither(() => value.length > 0 ? E.right('ok') : E.left('error'))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await checkString('')(), E.left('error'))
 *   assert.deepStrictEqual(await checkString('fp-ts')(), E.right('fp-ts'))
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
 * import * as TE from 'fp-ts/TaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as Console from 'fp-ts/Console'
 *
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effectA = TE.tapIO(
 *   TE.of(1),
 *   (value) => Console.log(`Hello, ${value}`)
 * )
 *
 * // No output to the stdout
 * const effectB = pipe(
 *   TE.left('error'),
 *   TE.tapIO((value) => Console.log(`Hello, ${value}`))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effectA(), E.of(1))
 *   assert.deepStrictEqual(await effectB(), E.left('error'))
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
 * import * as TE from 'fp-ts/TaskEither'
 * import * as T from 'fp-ts/Task'
 * import * as E from 'fp-ts/Either'
 *
 *
 * const effect = TE.tapIO(
 *   TE.of(1),
 *   (value) => T.of(value + 1)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(), E.of(1))
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
exports.fromOptionK = 
/*#__PURE__*/ (0, FromEither_1.fromOptionK)(exports.FromEither);
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
    fromIO: exports.FromIO.fromIO
};
/** @internal */
var _FromTask = {
    fromTask: exports.fromTask
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
 * @since 2.15.0
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
exports.flatMapIOEither = (0, function_1.dual)(2, function (self, f) {
    return (0, exports.flatMap)(self, (0, exports.fromIOEitherK)(f));
});
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapTaskOption = (0, function_1.dual)(3, function (self, f, onNone) {
    return (0, exports.flatMap)(self, function (a) { return (0, exports.fromTaskOption)(function () { return onNone(a); })(f(a)); });
});
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
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherKW = exports.tapEither;
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
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstTaskK = exports.tapTask;
/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
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
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) { return (e != null ? resolve(_.left(e)) : resolve(_.right(r))); };
                f.apply(null, args.concat(cbResolver));
            });
        };
    };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) { return (0, exports.bracketW)(acquire, use, release); };
exports.bracket = bracket;
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
var bracketW = function (acquire, use, release) {
    return (0, exports.flatMap)(acquire, function (a) { return T.flatMap(use(a), function (e) { return (0, exports.flatMap)(release(a, e), function () { return T.of(e); }); }); });
};
exports.bracketW = bracketW;
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
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
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
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
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
    return (0, function_1.flow)(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(E.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
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
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
    return function (as) {
        return function () {
            return _.tail(as).reduce(function (acc, a, i) {
                return acc.then(function (ebs) {
                    return _.isLeft(ebs)
                        ? acc
                        : f(i + 1, a)().then(function (eb) {
                            if (_.isLeft(eb)) {
                                return eb;
                            }
                            ebs.right.push(eb.right);
                            return ebs;
                        });
                });
            }, f(0, _.head(as))().then(E.map(_.singleton)));
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
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
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
var traverseSeqArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndexSeq)(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
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
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEither`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskEither = {
    URI: exports.URI,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEitherSeq`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskEitherSeq = {
    URI: exports.URI,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: exports.flatMap,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
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
    return (0, Apply_1.getApplySemigroup)(T.ApplySeq)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function getTaskValidation(SE) {
    var applicativeTaskValidation = getApplicativeTaskValidation(T.ApplicativePar, SE);
    var altTaskValidation = getAltTaskValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: applicativeTaskValidation.ap,
        of: exports.of,
        chain: exports.flatMap,
        bimap: exports.mapBoth,
        mapLeft: exports.mapError,
        alt: altTaskValidation.alt,
        fromIO: exports.fromIO,
        fromTask: exports.fromTask,
        throwError: exports.throwError
    };
}
