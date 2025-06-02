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
exports.tapIO = exports.tapEither = exports.tap = exports.FromIO = exports.FromEither = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.URI = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.separate = exports.compact = exports.none = exports.zero = exports.altW = exports.alt = exports.flatten = exports.flatMap = exports.of = exports.ap = exports.map = exports.fromOptionK = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.toNullable = exports.toUndefined = exports.getOrElseW = exports.getOrElse = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromIOEither = exports.fromIO = exports.fromEither = exports.fromOption = exports.fromPredicate = exports.some = void 0;
exports.chainFirst = exports.chain = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.chainOptionK = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.flatMapNullable = exports.flatMapEither = exports.flatMapOption = exports.flatMapIO = exports.Filterable = exports.Compactable = exports.MonadIO = exports.Monad = exports.Alternative = exports.guard = exports.Zero = exports.Alt = void 0;
var Apply_1 = require("./Apply");
var chainable = __importStar(require("./Chain"));
var Compactable_1 = require("./Compactable");
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var I = __importStar(require("./IO"));
var O = __importStar(require("./Option"));
var OT = __importStar(require("./OptionT"));
var Zero_1 = require("./Zero");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.12.0
 */
exports.some = OT.some(I.Pointed);
/**
 * @category lifting
 * @since 2.12.0
 */
exports.fromPredicate = OT.fromPredicate(I.Pointed);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromOption = I.of;
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromEither = OT.fromEither(I.Pointed);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromIO = OT.fromF(I.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromIOEither = I.map(O.fromEither);
/**
 * @category pattern matching
 * @since 2.12.0
 */
exports.match = OT.match(I.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
exports.matchW = exports.match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`IO`).
 *
 * @category pattern matching
 * @since 2.12.0
 */
exports.matchE = 
/*#__PURE__*/ OT.matchE(I.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.12.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
exports.matchEW = exports.matchE;
/**
 * @category error handling
 * @since 2.12.0
 */
exports.getOrElse = OT.getOrElse(I.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.12.0
 */
exports.getOrElseW = exports.getOrElse;
/**
 * @category conversions
 * @since 2.12.0
 */
exports.toUndefined = I.map(O.toUndefined);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.toNullable = I.map(O.toNullable);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromNullable = OT.fromNullable(I.Pointed);
/**
 * @category lifting
 * @since 2.12.0
 */
exports.fromNullableK = OT.fromNullableK(I.Pointed);
/**
 * Alias of `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainNullableK = OT.chainNullableK(I.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category lifting
 * @since 2.12.0
 */
exports.fromOptionK = 
/*#__PURE__*/ OT.fromOptionK(I.Pointed);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.12.0
 */
exports.map = OT.map(I.Functor);
/**
 * @since 2.12.0
 */
exports.ap = OT.ap(I.Apply);
/**
 * @category constructors
 * @since 2.12.0
 */
exports.of = exports.some;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, OT.flatMap(I.Monad));
/**
 * @category sequencing
 * @since 2.12.0
 */
exports.flatten = (0, exports.flatMap)(function_1.identity);
/**
 * @category error handling
 * @since 2.12.0
 */
exports.alt = OT.alt(I.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.12.0
 */
exports.altW = exports.alt;
/**
 * @since 2.12.0
 */
exports.zero = OT.zero(I.Pointed);
/**
 * @category constructors
 * @since 2.12.0
 */
exports.none = (0, exports.zero)();
/**
 * @category filtering
 * @since 2.12.0
 */
exports.compact = (0, Compactable_1.compact)(I.Functor, O.Compactable);
/**
 * @category filtering
 * @since 2.12.0
 */
exports.separate = (0, Compactable_1.separate)(I.Functor, O.Compactable, O.Functor);
/**
 * @category filtering
 * @since 2.12.0
 */
exports.filter = (0, Filterable_1.filter)(I.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.12.0
 */
exports.filterMap = (0, Filterable_1.filterMap)(I.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.12.0
 */
exports.partition = (0, Filterable_1.partition)(I.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.12.0
 */
exports.partitionMap = (0, Filterable_1.partitionMap)(I.Functor, O.Filterable);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
/* istanbul ignore next */
var _filter = function (fa, predicate) { return (0, function_1.pipe)(fa, (0, exports.filter)(predicate)); };
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
 * @since 2.12.0
 */
exports.URI = 'IOOption';
/**
 * @category instances
 * @since 2.12.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Some` value of this `IOOption` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Some` value of this `IOOption` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
/**
 * @category mapping
 * @since 2.12.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * @category instances
 * @since 2.12.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.12.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.12.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * @category instances
 * @since 2.12.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
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
 * import * as IOO from 'fp-ts/IOOption'
 * import * as O from 'fp-ts/Option'
 * import * as E from 'fp-ts/Either'
 *
 * const compute = (value: number) => pipe(
 *   IOO.of(value),
 *   IOO.tapEither((value) => value > 0 ? E.right('ok') : E.left('error')),
 * )
 *
 * assert.deepStrictEqual(compute(1)(), O.of(1))
 * assert.deepStrictEqual(compute(-1)(), O.none)
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
 * import * as IOO from 'fp-ts/IOOption'
 * import * as O from 'fp-ts/Option'
 * import * as Console from 'fp-ts/Console'
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effectA = pipe(
 *   IOO.of('fp-ts'),
 *   IOO.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * // No output to the stdout
 * const effectB = pipe(
 *   IOO.none as IOO.IOOption<string>,
 *   IOO.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(effectA(), O.of('fp-ts'))
 *   assert.deepStrictEqual(effectB(), O.none)
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapIO = (0, function_1.dual)(2, (0, FromIO_1.tapIO)(exports.FromIO, exports.Chain));
/**
 * @category instances
 * @since 2.12.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.12.0
 */
exports.Zero = {
    URI: exports.URI,
    zero: exports.zero
};
/**
 * @category do notation
 * @since 2.12.0
 */
exports.guard = (0, Zero_1.guard)(exports.Zero, exports.Pointed);
/**
 * @category instances
 * @since 2.12.0
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
 * @since 2.12.0
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
 * @since 2.12.0
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
 * @since 2.12.0
 */
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.12.0
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
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/** @internal */
var _FromIO = {
    fromIO: exports.FromIO.fromIO
};
/** @internal */
var _FromEither = {
    fromEither: exports.fromEither
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
exports.flatMapOption = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, (0, exports.fromOptionK)(f)); });
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapEither = _.flatMapEither(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapNullable = (0, function_1.dual)(2, function (self, f) { return (0, exports.flatMap)(self, (0, exports.fromNullableK)(f)); });
/**
 * @category lifting
 * @since 2.12.0
 */
exports.fromIOK = 
/*#__PURE__*/ (0, FromIO_1.fromIOK)(exports.FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainIOK = exports.flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstIOK = exports.tapIO;
/**
 * @category lifting
 * @since 2.12.0
 */
exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainEitherK = exports.flatMapEither;
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherK = exports.tapEither;
/**
 * Alias of `flatMapOption`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainOptionK = exports.flatMapOption;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.12.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.12.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports.let = let_;
/**
 * @category do notation
 * @since 2.12.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * @category do notation
 * @since 2.12.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
/**
 * @since 2.12.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.12.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return (0, function_1.flow)(I.traverseReadonlyNonEmptyArrayWithIndex(f), I.map(O.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.12.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirst = exports.tap;
