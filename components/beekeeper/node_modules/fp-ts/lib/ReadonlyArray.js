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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBy = exports.uniq = exports.rotate = exports.intersperse = exports.prependAll = exports.unzip = exports.zipWith = exports.sort = exports.lefts = exports.rights = exports.reverse = exports.modifyAt = exports.deleteAt = exports.updateAt = exports.insertAt = exports.findLastIndex = exports.findLastMap = exports.findFirstMap = exports.findIndex = exports.dropRight = exports.dropLeft = exports.takeRight = exports.takeLeft = exports.init = exports.tail = exports.last = exports.head = exports.isOutOfBound = exports.size = exports.scanRight = exports.scanLeft = exports.chainWithIndex = exports.foldRight = exports.matchRight = exports.matchRightW = exports.foldLeft = exports.matchLeft = exports.matchLeftW = exports.match = exports.matchW = exports.fromEither = exports.fromOption = exports.replicate = exports.makeBy = exports.appendW = exports.append = exports.prependW = exports.prepend = exports.isNonEmpty = exports.isEmpty = void 0;
exports.getIntersectionSemigroup = exports.getUnionMonoid = exports.getUnionSemigroup = exports.getOrd = exports.getEq = exports.getMonoid = exports.getSemigroup = exports.getShow = exports.URI = exports.unfold = exports.wilt = exports.wither = exports.traverseWithIndex = exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.reduceRight = exports.reduceWithIndex = exports.foldMap = exports.reduce = exports.foldMapWithIndex = exports.duplicate = exports.extend = exports.filterWithIndex = exports.partitionMapWithIndex = exports.partitionMap = exports.partitionWithIndex = exports.partition = exports.compact = exports.filterMap = exports.filterMapWithIndex = exports.filter = exports.separate = exports.mapWithIndex = exports.map = exports.flatten = exports.flatMap = exports.ap = exports.alt = exports.altW = exports.zero = exports.of = exports._chainRecBreadthFirst = exports._chainRecDepthFirst = exports.concat = exports.concatW = exports.fromOptionK = exports.chunksOf = exports.splitAt = exports.chop = void 0;
exports.cons = exports.range = exports.chain = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.intercalate = exports.exists = exports.some = exports.empty = exports.fromArray = exports.toArray = exports.unsafeDeleteAt = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.fromEitherK = exports.FromEither = exports.filterE = exports.Witherable = exports.ChainRecBreadthFirst = exports.chainRecBreadthFirst = exports.ChainRecDepthFirst = exports.chainRecDepthFirst = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.FilterableWithIndex = exports.Filterable = exports.Compactable = exports.Extend = exports.Alternative = exports.guard = exports.Zero = exports.Alt = exports.Unfoldable = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getDifferenceMagma = void 0;
exports.readonlyArray = exports.prependToAll = exports.snoc = void 0;
exports.fromPredicate = fromPredicate;
exports.lookup = lookup;
exports.takeLeftWhile = takeLeftWhile;
exports.spanLeft = spanLeft;
exports.dropLeftWhile = dropLeftWhile;
exports.findFirst = findFirst;
exports.findLast = findLast;
exports.zip = zip;
exports.elem = elem;
exports.comprehension = comprehension;
exports.union = union;
exports.intersection = intersection;
exports.difference = difference;
exports.every = every;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var Eq_1 = require("./Eq");
var FromEither_1 = require("./FromEither");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var N = __importStar(require("./number"));
var Ord_1 = require("./Ord");
var RNEA = __importStar(require("./ReadonlyNonEmptyArray"));
var Separated_1 = require("./Separated");
var Witherable_1 = require("./Witherable");
var Zero_1 = require("./Zero");
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @example
 * import { isEmpty } from 'fp-ts/ReadonlyArray'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @category refinements
 * @since 2.5.0
 */
var isEmpty = function (as) { return as.length === 0; };
exports.isEmpty = isEmpty;
/**
 * Test whether a `ReadonlyArray` is non empty.
 *
 * @category refinements
 * @since 2.5.0
 */
exports.isNonEmpty = RNEA.isNonEmpty;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Prepend an element to the front of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
exports.prepend = RNEA.prepend;
/**
 * Less strict version of [`prepend`](#prepend).
 *
 * @since 2.11.0
 */
exports.prependW = RNEA.prependW;
/**
 * Append an element to the end of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
exports.append = RNEA.append;
/**
 * Less strict version of [`append`](#append).
 *
 * @since 2.11.0
 */
exports.appendW = RNEA.appendW;
/**
 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyArray'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.5.0
 */
var makeBy = function (n, f) { return (n <= 0 ? exports.empty : RNEA.makeBy(f)(n)); };
exports.makeBy = makeBy;
/**
 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.5.0
 */
var replicate = function (n, a) { return (0, exports.makeBy)(n, function () { return a; }); };
exports.replicate = replicate;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? [a] : exports.empty); };
}
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.11.0
 */
var fromOption = function (ma) { return (_.isNone(ma) ? exports.empty : [ma.value]); };
exports.fromOption = fromOption;
/**
 * Transforms an `Either` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.11.0
 */
var fromEither = function (e) { return (_.isLeft(e) ? exports.empty : [e.right]); };
exports.fromEither = fromEither;
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.11.0
 */
var matchW = function (onEmpty, onNonEmpty) {
    return function (as) {
        return (0, exports.isNonEmpty)(as) ? onNonEmpty(as) : onEmpty();
    };
};
exports.matchW = matchW;
/**
 * @category pattern matching
 * @since 2.11.0
 */
exports.match = exports.matchW;
/**
 * Less strict version of [`matchLeft`](#matchleft).
 *
 * @category pattern matching
 * @since 2.11.0
 */
var matchLeftW = function (onEmpty, onNonEmpty) {
    return function (as) {
        return (0, exports.isNonEmpty)(as) ? onNonEmpty(RNEA.head(as), RNEA.tail(as)) : onEmpty();
    };
};
exports.matchLeftW = matchLeftW;
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @example
 * import { matchLeft } from 'fp-ts/ReadonlyArray'
 *
 * const len: <A>(as: ReadonlyArray<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchLeft = exports.matchLeftW;
/**
 * Alias of [`matchLeft`](#matchleft).
 *
 * @category pattern matching
 * @since 2.5.0
 */
exports.foldLeft = exports.matchLeft;
/**
 * Less strict version of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.11.0
 */
var matchRightW = function (onEmpty, onNonEmpty) {
    return function (as) {
        return (0, exports.isNonEmpty)(as) ? onNonEmpty(RNEA.init(as), RNEA.last(as)) : onEmpty();
    };
};
exports.matchRightW = matchRightW;
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchRight = exports.matchRightW;
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.5.0
 */
exports.foldRight = exports.matchRight;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category sequencing
 * @since 2.7.0
 */
var chainWithIndex = function (f) {
    return function (as) {
        if ((0, exports.isEmpty)(as)) {
            return exports.empty;
        }
        var out = [];
        for (var i = 0; i < as.length; i++) {
            var bs = f(i, as[i]);
            for (var j = 0; j < bs.length; j++) {
                out.push(bs[j]);
            }
        }
        return out;
    };
};
exports.chainWithIndex = chainWithIndex;
/**
 * Same as `reduce` but it carries over the intermediate steps.
 *
 * @example
 * import { scanLeft } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @since 2.5.0
 */
var scanLeft = function (b, f) {
    return function (as) {
        var len = as.length;
        var out = new Array(len + 1);
        out[0] = b;
        for (var i = 0; i < len; i++) {
            out[i + 1] = f(out[i], as[i]);
        }
        return out;
    };
};
exports.scanLeft = scanLeft;
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @since 2.5.0
 */
var scanRight = function (b, f) {
    return function (as) {
        var len = as.length;
        var out = new Array(len + 1);
        out[len] = b;
        for (var i = len - 1; i >= 0; i--) {
            out[i] = f(as[i], out[i + 1]);
        }
        return out;
    };
};
exports.scanRight = scanRight;
/**
 * Calculate the number of elements in a `ReadonlyArray`.
 *
 * @since 2.10.0
 */
var size = function (as) { return as.length; };
exports.size = size;
/**
 * Test whether an array contains a particular index
 *
 * @since 2.5.0
 */
exports.isOutOfBound = RNEA.isOutOfBound;
function lookup(i, as) {
    return as === undefined ? function (as) { return lookup(i, as); } : (0, exports.isOutOfBound)(i, as) ? _.none : _.some(as[i]);
}
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.5.0
 */
var head = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(RNEA.head(as)) : _.none); };
exports.head = head;
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.5.0
 */
var last = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(RNEA.last(as)) : _.none); };
exports.last = last;
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 2.5.0
 */
var tail = function (as) {
    return (0, exports.isNonEmpty)(as) ? _.some(RNEA.tail(as)) : _.none;
};
exports.tail = tail;
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 2.5.0
 */
var init = function (as) {
    return (0, exports.isNonEmpty)(as) ? _.some(RNEA.init(as)) : _.none;
};
exports.init = init;
/**
 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeLeft(2)), [1, 2])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeLeft(4)), input)
 * assert.strictEqual(pipe(input, RA.takeLeft(-1)), input)
 *
 * @since 2.5.0
 */
var takeLeft = function (n) {
    return function (as) {
        return (0, exports.isOutOfBound)(n, as) ? as : n === 0 ? exports.empty : as.slice(0, n);
    };
};
exports.takeLeft = takeLeft;
/**
 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeRight(2)), [2, 3])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeRight(4)), input)
 * assert.strictEqual(pipe(input, RA.takeRight(-1)), input)
 *
 * @since 2.5.0
 */
var takeRight = function (n) {
    return function (as) {
        return (0, exports.isOutOfBound)(n, as) ? as : n === 0 ? exports.empty : as.slice(-n);
    };
};
exports.takeRight = takeRight;
function takeLeftWhile(predicate) {
    return function (as) {
        var out = [];
        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            if (!predicate(a)) {
                break;
            }
            out.push(a);
        }
        var len = out.length;
        return len === as.length ? as : len === 0 ? exports.empty : out;
    };
}
var spanLeftIndex = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function spanLeft(predicate) {
    return function (as) {
        var _a = (0, exports.splitAt)(spanLeftIndex(as, predicate))(as), init = _a[0], rest = _a[1];
        return { init: init, rest: rest };
    };
}
/**
 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropLeft(2)), [3])
 * assert.strictEqual(pipe(input, RA.dropLeft(0)), input)
 * assert.strictEqual(pipe(input, RA.dropLeft(-1)), input)
 *
 * @since 2.5.0
 */
var dropLeft = function (n) {
    return function (as) {
        return n <= 0 || (0, exports.isEmpty)(as) ? as : n >= as.length ? exports.empty : as.slice(n, as.length);
    };
};
exports.dropLeft = dropLeft;
/**
 * Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropRight(2)), [1])
 * assert.strictEqual(pipe(input, RA.dropRight(0)), input)
 * assert.strictEqual(pipe(input, RA.dropRight(-1)), input)
 *
 * @since 2.5.0
 */
var dropRight = function (n) {
    return function (as) {
        return n <= 0 || (0, exports.isEmpty)(as) ? as : n >= as.length ? exports.empty : as.slice(0, as.length - n);
    };
};
exports.dropRight = dropRight;
function dropLeftWhile(predicate) {
    return function (as) {
        var i = spanLeftIndex(as, predicate);
        return i === 0 ? as : i === as.length ? exports.empty : as.slice(i);
    };
}
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.5.0
 */
var findIndex = function (predicate) {
    return function (as) {
        for (var i = 0; i < as.length; i++) {
            if (predicate(as[i])) {
                return _.some(i);
            }
        }
        return _.none;
    };
};
exports.findIndex = findIndex;
function findFirst(predicate) {
    return function (as) {
        for (var i = 0; i < as.length; i++) {
            if (predicate(as[i])) {
                return _.some(as[i]);
            }
        }
        return _.none;
    };
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 2.5.0
 */
var findFirstMap = function (f) {
    return function (as) {
        for (var i = 0; i < as.length; i++) {
            var out = f(as[i]);
            if (_.isSome(out)) {
                return out;
            }
        }
        return _.none;
    };
};
exports.findFirstMap = findFirstMap;
function findLast(predicate) {
    return function (as) {
        for (var i = as.length - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return _.some(as[i]);
            }
        }
        return _.none;
    };
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 2.5.0
 */
var findLastMap = function (f) {
    return function (as) {
        for (var i = as.length - 1; i >= 0; i--) {
            var out = f(as[i]);
            if (_.isSome(out)) {
                return out;
            }
        }
        return _.none;
    };
};
exports.findLastMap = findLastMap;
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.5.0
 */
var findLastIndex = function (predicate) {
    return function (as) {
        for (var i = as.length - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return _.some(i);
            }
        }
        return _.none;
    };
};
exports.findLastIndex = findLastIndex;
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/ReadonlyArray'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.5.0
 */
var insertAt = function (i, a) {
    return function (as) {
        return i < 0 || i > as.length ? _.none : _.some(RNEA.unsafeInsertAt(i, a, as));
    };
};
exports.insertAt = insertAt;
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.5.0
 */
var updateAt = function (i, a) {
    return (0, exports.modifyAt)(i, function () { return a; });
};
exports.updateAt = updateAt;
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.5.0
 */
var deleteAt = function (i) {
    return function (as) {
        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeDeleteAt)(i, as));
    };
};
exports.deleteAt = deleteAt;
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.5.0
 */
var modifyAt = function (i, f) {
    return function (as) {
        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeUpdateAt)(i, f(as[i]), as));
    };
};
exports.modifyAt = modifyAt;
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @since 2.5.0
 */
var reverse = function (as) { return (as.length <= 1 ? as : as.slice().reverse()); };
exports.reverse = reverse;
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/ReadonlyArray'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @since 2.5.0
 */
var rights = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Right') {
            r.push(a.right);
        }
    }
    return r;
};
exports.rights = rights;
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/ReadonlyArray'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @since 2.5.0
 */
var lefts = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Left') {
            r.push(a.left);
        }
    }
    return r;
};
exports.lefts = lefts;
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @since 2.5.0
 */
var sort = function (O) {
    return function (as) {
        return as.length <= 1 ? as : as.slice().sort(O.compare);
    };
};
exports.sort = sort;
// TODO: curry and make data-last in v3
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @since 2.5.0
 */
var zipWith = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
exports.zipWith = zipWith;
function zip(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip(bs, as); };
    }
    return (0, exports.zipWith)(as, bs, function (a, b) { return [a, b]; });
}
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.5.0
 */
var unzip = function (as) {
    var fa = [];
    var fb = [];
    for (var i = 0; i < as.length; i++) {
        fa[i] = as[i][0];
        fb[i] = as[i][1];
    }
    return [fa, fb];
};
exports.unzip = unzip;
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
var prependAll = function (middle) {
    var f = RNEA.prependAll(middle);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
};
exports.prependAll = prependAll;
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
var intersperse = function (middle) {
    var f = RNEA.intersperse(middle);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
};
exports.intersperse = intersperse;
/**
 * Rotate a `ReadonlyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @since 2.5.0
 */
var rotate = function (n) {
    var f = RNEA.rotate(n);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
};
exports.rotate = rotate;
function elem(E) {
    return function (a, as) {
        if (as === undefined) {
            var elemE_1 = elem(E);
            return function (as) { return elemE_1(a, as); };
        }
        var predicate = function (element) { return E.equals(element, a); };
        var i = 0;
        for (; i < as.length; i++) {
            if (predicate(as[i])) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.5.0
 */
var uniq = function (E) {
    var f = RNEA.uniq(E);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
};
exports.uniq = uniq;
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/ReadonlyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.5.0
 */
var sortBy = function (ords) {
    var f = RNEA.sortBy(ords);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
};
exports.sortBy = sortBy;
/**
 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
 * `ReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
 * value and the tail of the `ReadonlyArray`.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>) => {
 *   return RA.chop(as => {
 *     const { init, rest } = pipe(as, RA.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @since 2.5.0
 */
var chop = function (f) {
    var g = RNEA.chop(f);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? g(as) : exports.empty); };
};
exports.chop = chop;
/**
 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @since 2.5.0
 */
var splitAt = function (n) {
    return function (as) {
        return n >= 1 && (0, exports.isNonEmpty)(as) ? RNEA.splitAt(n)(as) : (0, exports.isEmpty)(as) ? [as, exports.empty] : [exports.empty, as];
    };
};
exports.splitAt = splitAt;
/**
 * Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that:
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `as`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @since 2.5.0
 */
var chunksOf = function (n) {
    var f = RNEA.chunksOf(n);
    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : exports.empty); };
};
exports.chunksOf = chunksOf;
/**
 * @category lifting
 * @since 2.11.0
 */
var fromOptionK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.fromOption)(f.apply(void 0, a));
    };
};
exports.fromOptionK = fromOptionK;
function comprehension(input, f, g) {
    if (g === void 0) { g = function () { return true; }; }
    var go = function (scope, input) {
        return (0, exports.isNonEmpty)(input)
            ? (0, exports.flatMap)(RNEA.head(input), function (a) { return go((0, function_1.pipe)(scope, (0, exports.append)(a)), RNEA.tail(input)); })
            : g.apply(void 0, scope) ? [f.apply(void 0, scope)]
                : exports.empty;
    };
    return go(exports.empty, input);
}
/**
 * @since 2.11.0
 */
var concatW = function (second) {
    return function (first) {
        return (0, exports.isEmpty)(first) ? second : (0, exports.isEmpty)(second) ? first : first.concat(second);
    };
};
exports.concatW = concatW;
/**
 * @since 2.11.0
 */
exports.concat = exports.concatW;
function union(E) {
    var unionE = RNEA.union(E);
    return function (first, second) {
        if (second === undefined) {
            var unionE_1 = union(E);
            return function (second) { return unionE_1(second, first); };
        }
        return (0, exports.isNonEmpty)(first) && (0, exports.isNonEmpty)(second) ? unionE(second)(first) : (0, exports.isNonEmpty)(first) ? first : second;
    };
}
function intersection(E) {
    var elemE = elem(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var intersectionE_1 = intersection(E);
            return function (ys) { return intersectionE_1(ys, xs); };
        }
        return xs.filter(function (a) { return elemE(a, ys); });
    };
}
function difference(E) {
    var elemE = elem(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var differenceE_1 = difference(E);
            return function (ys) { return differenceE_1(ys, xs); };
        }
        return xs.filter(function (a) { return !elemE(a, ys); });
    };
}
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _mapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapWithIndex)(f)); };
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
var _filter = function (fa, predicate) {
    return (0, function_1.pipe)(fa, (0, exports.filter)(predicate));
};
var _filterMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMap)(f)); };
var _partition = function (fa, predicate) {
    return (0, function_1.pipe)(fa, (0, exports.partition)(predicate));
};
var _partitionMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMap)(f)); };
var _partitionWithIndex = function (fa, predicateWithIndex) { return (0, function_1.pipe)(fa, (0, exports.partitionWithIndex)(predicateWithIndex)); };
var _partitionMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMapWithIndex)(f)); };
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
var _foldMap = function (M) {
    var foldMapM = (0, exports.foldMap)(M);
    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
};
var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
var _reduceWithIndex = function (fa, b, f) {
    return (0, function_1.pipe)(fa, (0, exports.reduceWithIndex)(b, f));
};
var _foldMapWithIndex = function (M) {
    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapWithIndexM(f)); };
};
var _reduceRightWithIndex = function (fa, b, f) {
    return (0, function_1.pipe)(fa, (0, exports.reduceRightWithIndex)(b, f));
};
var _filterMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMapWithIndex)(f)); };
var _filterWithIndex = function (fa, predicateWithIndex) { return (0, function_1.pipe)(fa, (0, exports.filterWithIndex)(predicateWithIndex)); };
var _extend = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.extend)(f)); };
var _traverse = function (F) {
    var traverseF = (0, exports.traverse)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _traverseWithIndex = function (F) {
    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseWithIndexF(f)); };
};
/** @internal */
var _chainRecDepthFirst = function (a, f) { return (0, function_1.pipe)(a, (0, exports.chainRecDepthFirst)(f)); };
exports._chainRecDepthFirst = _chainRecDepthFirst;
/** @internal */
var _chainRecBreadthFirst = function (a, f) { return (0, function_1.pipe)(a, (0, exports.chainRecBreadthFirst)(f)); };
exports._chainRecBreadthFirst = _chainRecBreadthFirst;
/**
 * @category constructors
 * @since 2.5.0
 */
exports.of = RNEA.of;
/**
 * @since 2.7.0
 */
var zero = function () { return exports.empty; };
exports.zero = zero;
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
var altW = function (that) {
    return function (fa) {
        return fa.concat(that());
    };
};
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `ReadonlyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.5.0
 */
exports.alt = exports.altW;
/**
 * @since 2.5.0
 */
var ap = function (fa) {
    return (0, exports.flatMap)(function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); });
};
exports.ap = ap;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    return (0, function_1.pipe)(ma, (0, exports.chainWithIndex)(function (i, a) { return f(a, i); }));
});
/**
 * @category sequencing
 * @since 2.5.0
 */
exports.flatten = (0, exports.flatMap)(function_1.identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.5.0
 */
var map = function (f) { return function (fa) {
    return fa.map(function (a) { return f(a); });
}; };
exports.map = map;
/**
 * @category mapping
 * @since 2.5.0
 */
var mapWithIndex = function (f) { return function (fa) {
    return fa.map(function (a, i) { return f(i, a); });
}; };
exports.mapWithIndex = mapWithIndex;
/**
 * @category filtering
 * @since 2.5.0
 */
var separate = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return (0, Separated_1.separated)(left, right);
};
exports.separate = separate;
/**
 * @category filtering
 * @since 2.5.0
 */
var filter = function (predicate) {
    return function (as) {
        return as.filter(predicate);
    };
};
exports.filter = filter;
/**
 * @category filtering
 * @since 2.5.0
 */
var filterMapWithIndex = function (f) {
    return function (fa) {
        var out = [];
        for (var i = 0; i < fa.length; i++) {
            var optionB = f(i, fa[i]);
            if (_.isSome(optionB)) {
                out.push(optionB.value);
            }
        }
        return out;
    };
};
exports.filterMapWithIndex = filterMapWithIndex;
/**
 * @category filtering
 * @since 2.5.0
 */
var filterMap = function (f) {
    return (0, exports.filterMapWithIndex)(function (_, a) { return f(a); });
};
exports.filterMap = filterMap;
/**
 * @category filtering
 * @since 2.5.0
 */
exports.compact = (0, exports.filterMap)(function_1.identity);
/**
 * @category filtering
 * @since 2.5.0
 */
var partition = function (predicate) {
    return (0, exports.partitionWithIndex)(function (_, a) { return predicate(a); });
};
exports.partition = partition;
/**
 * @category filtering
 * @since 2.5.0
 */
var partitionWithIndex = function (predicateWithIndex) {
    return function (as) {
        var left = [];
        var right = [];
        for (var i = 0; i < as.length; i++) {
            var a = as[i];
            if (predicateWithIndex(i, a)) {
                right.push(a);
            }
            else {
                left.push(a);
            }
        }
        return (0, Separated_1.separated)(left, right);
    };
};
exports.partitionWithIndex = partitionWithIndex;
/**
 * @category filtering
 * @since 2.5.0
 */
var partitionMap = function (f) {
    return (0, exports.partitionMapWithIndex)(function (_, a) { return f(a); });
};
exports.partitionMap = partitionMap;
/**
 * @category filtering
 * @since 2.5.0
 */
var partitionMapWithIndex = function (f) {
    return function (fa) {
        var left = [];
        var right = [];
        for (var i = 0; i < fa.length; i++) {
            var e = f(i, fa[i]);
            if (e._tag === 'Left') {
                left.push(e.left);
            }
            else {
                right.push(e.right);
            }
        }
        return (0, Separated_1.separated)(left, right);
    };
};
exports.partitionMapWithIndex = partitionMapWithIndex;
/**
 * @category filtering
 * @since 2.5.0
 */
var filterWithIndex = function (predicateWithIndex) {
    return function (as) {
        return as.filter(function (a, i) { return predicateWithIndex(i, a); });
    };
};
exports.filterWithIndex = filterWithIndex;
/**
 * @since 2.5.0
 */
var extend = function (f) { return function (wa) {
    return wa.map(function (_, i) { return f(wa.slice(i)); });
}; };
exports.extend = extend;
/**
 * @since 2.5.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * @category folding
 * @since 2.5.0
 */
var foldMapWithIndex = function (M) {
    return function (f) {
        return function (fa) {
            return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
        };
    };
};
exports.foldMapWithIndex = foldMapWithIndex;
/**
 * @category folding
 * @since 2.5.0
 */
var reduce = function (b, f) {
    return (0, exports.reduceWithIndex)(b, function (_, b, a) { return f(b, a); });
};
exports.reduce = reduce;
/**
 * @category folding
 * @since 2.5.0
 */
var foldMap = function (M) {
    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    return function (f) { return foldMapWithIndexM(function (_, a) { return f(a); }); };
};
exports.foldMap = foldMap;
/**
 * @category folding
 * @since 2.5.0
 */
var reduceWithIndex = function (b, f) { return function (fa) {
    var len = fa.length;
    var out = b;
    for (var i = 0; i < len; i++) {
        out = f(i, out, fa[i]);
    }
    return out;
}; };
exports.reduceWithIndex = reduceWithIndex;
/**
 * @category folding
 * @since 2.5.0
 */
var reduceRight = function (b, f) {
    return (0, exports.reduceRightWithIndex)(b, function (_, a, b) { return f(a, b); });
};
exports.reduceRight = reduceRight;
/**
 * @category folding
 * @since 2.5.0
 */
var reduceRightWithIndex = function (b, f) { return function (fa) {
    return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
}; };
exports.reduceRightWithIndex = reduceRightWithIndex;
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (ta) {
        return _reduce(ta, F.of((0, exports.zero)()), function (fas, fa) {
            return F.ap(F.map(fas, function (as) { return function (a) { return (0, function_1.pipe)(as, (0, exports.append)(a)); }; }), fa);
        });
    };
};
exports.sequence = sequence;
/**
 * @category sequencing
 * @since 2.6.3
 */
var traverseWithIndex = function (F) {
    return function (f) {
        return (0, exports.reduceWithIndex)(F.of((0, exports.zero)()), function (i, fbs, a) {
            return F.ap(F.map(fbs, function (bs) { return function (b) { return (0, function_1.pipe)(bs, (0, exports.append)(b)); }; }), f(i, a));
        });
    };
};
exports.traverseWithIndex = traverseWithIndex;
/**
 * @category filtering
 * @since 2.6.5
 */
var wither = function (F) {
    var _witherF = _wither(F);
    return function (f) { return function (fa) { return _witherF(fa, f); }; };
};
exports.wither = wither;
/**
 * @category filtering
 * @since 2.6.5
 */
var wilt = function (F) {
    var _wiltF = _wilt(F);
    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
};
exports.wilt = wilt;
/**
 * @since 2.6.6
 */
var unfold = function (b, f) {
    var out = [];
    var bb = b;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        var mt = f(bb);
        if (_.isSome(mt)) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            out.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return out;
};
exports.unfold = unfold;
/**
 * @category type lambdas
 * @since 2.5.0
 */
exports.URI = 'ReadonlyArray';
/**
 * @category instances
 * @since 2.5.0
 */
var getShow = function (S) { return ({
    show: function (as) { return "[".concat(as.map(S.show).join(', '), "]"); }
}); };
exports.getShow = getShow;
/**
 * @category instances
 * @since 2.5.0
 */
var getSemigroup = function () { return ({
    concat: function (first, second) { return ((0, exports.isEmpty)(first) ? second : (0, exports.isEmpty)(second) ? first : first.concat(second)); }
}); };
exports.getSemigroup = getSemigroup;
/**
 * Returns a `Monoid` for `ReadonlyArray<A>`.
 *
 * @example
 * import { getMonoid } from 'fp-ts/ReadonlyArray'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.5.0
 */
var getMonoid = function () { return ({
    concat: (0, exports.getSemigroup)().concat,
    empty: exports.empty
}); };
exports.getMonoid = getMonoid;
/**
 * Derives an `Eq` over the `ReadonlyArray` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/ReadonlyArray'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.5.0
 */
var getEq = function (E) {
    return (0, Eq_1.fromEquals)(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
exports.getEq = getEq;
/**
 * Derives an `Ord` over the `ReadonlyArray` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 *
 * @category instances
 * @since 2.5.0
 */
var getOrd = function (O) {
    return (0, Ord_1.fromCompare)(function (a, b) {
        var aLen = a.length;
        var bLen = b.length;
        var len = Math.min(aLen, bLen);
        for (var i = 0; i < len; i++) {
            var ordering = O.compare(a[i], b[i]);
            if (ordering !== 0) {
                return ordering;
            }
        }
        return N.Ord.compare(aLen, bLen);
    });
};
exports.getOrd = getOrd;
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionSemigroup = function (E) {
    var unionE = union(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
exports.getUnionSemigroup = getUnionSemigroup;
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionMonoid = function (E) { return ({
    concat: (0, exports.getUnionSemigroup)(E).concat,
    empty: exports.empty
}); };
exports.getUnionMonoid = getUnionMonoid;
/**
 * @category instances
 * @since 2.11.0
 */
var getIntersectionSemigroup = function (E) {
    var intersectionE = intersection(E);
    return {
        concat: function (first, second) { return intersectionE(second)(first); }
    };
};
exports.getIntersectionSemigroup = getIntersectionSemigroup;
/**
 * @category instances
 * @since 2.11.0
 */
var getDifferenceMagma = function (E) {
    var differenceE = difference(E);
    return {
        concat: function (first, second) { return differenceE(second)(first); }
    };
};
exports.getDifferenceMagma = getDifferenceMagma;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
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
 * @since 2.7.0
 */
exports.FunctorWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex
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
 * @since 2.5.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.5.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
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
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.chainFirst(() => ['a', 'b'])
 *   ),
 *   [1, 1, 2, 2, 3, 3]
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.chainFirst(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.5.0
 */
exports.chainFirst = 
/*#__PURE__*/ (0, Chain_1.chainFirst)(exports.Chain);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Unfoldable = {
    URI: exports.URI,
    unfold: exports.unfold
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
 * @since 2.7.0
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
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: _map,
    extend: _extend
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.7.0
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
 * @category instances
 * @since 2.7.0
 */
exports.FilterableWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.FoldableWithIndex = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.TraversableWithIndex = {
    URI: exports.URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverse: _traverse,
    sequence: exports.sequence,
    traverseWithIndex: _traverseWithIndex
};
/**
 * @category sequencing
 * @since 2.11.0
 */
var chainRecDepthFirst = function (f) {
    return function (a) {
        var todo = __spreadArray([], f(a), true);
        var out = [];
        while (todo.length > 0) {
            var e = todo.shift();
            if (_.isLeft(e)) {
                todo.unshift.apply(todo, f(e.left));
            }
            else {
                out.push(e.right);
            }
        }
        return out;
    };
};
exports.chainRecDepthFirst = chainRecDepthFirst;
/**
 * @category instances
 * @since 2.11.0
 */
exports.ChainRecDepthFirst = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap,
    chainRec: exports._chainRecDepthFirst
};
/**
 * @category sequencing
 * @since 2.11.0
 */
var chainRecBreadthFirst = function (f) {
    return function (a) {
        var initial = f(a);
        var todo = [];
        var out = [];
        function go(e) {
            if (_.isLeft(e)) {
                f(e.left).forEach(function (v) { return todo.push(v); });
            }
            else {
                out.push(e.right);
            }
        }
        for (var _i = 0, initial_1 = initial; _i < initial_1.length; _i++) {
            var e = initial_1[_i];
            go(e);
        }
        while (todo.length > 0) {
            go(todo.shift());
        }
        return out;
    };
};
exports.chainRecBreadthFirst = chainRecBreadthFirst;
/**
 * @category instances
 * @since 2.11.0
 */
exports.ChainRecBreadthFirst = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap,
    chainRec: exports._chainRecBreadthFirst
};
var _wither = /*#__PURE__*/ (0, Witherable_1.witherDefault)(exports.Traversable, exports.Compactable);
var _wilt = /*#__PURE__*/ (0, Witherable_1.wiltDefault)(exports.Traversable, exports.Compactable);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Witherable = {
    URI: exports.URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    wither: _wither,
    wilt: _wilt
};
/**
 * Filter values inside a context.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as T from 'fp-ts/Task'
 *
 * const filterE = RA.filterE(T.ApplicativePar)
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       [-1, 2, 3],
 *       filterE((n) => T.of(n > 0))
 *     )(),
 *     [2, 3]
 *   )
 * }
 * test()
 *
 * @since 2.11.0
 */
exports.filterE = (0, Witherable_1.filterE)(exports.Witherable);
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category lifting
 * @since 2.11.0
 */
exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
// -------------------------------------------------------------------------------------
// unsafe
// -------------------------------------------------------------------------------------
/**
 * @category unsafe
 * @since 2.5.0
 */
exports.unsafeInsertAt = RNEA.unsafeInsertAt;
/**
 * @category unsafe
 * @since 2.5.0
 */
var unsafeUpdateAt = function (i, a, as) {
    return (0, exports.isNonEmpty)(as) ? RNEA.unsafeUpdateAt(i, a, as) : as;
};
exports.unsafeUpdateAt = unsafeUpdateAt;
/**
 * @category unsafe
 * @since 2.5.0
 */
var unsafeDeleteAt = function (i, as) {
    var xs = as.slice();
    xs.splice(i, 1);
    return xs;
};
exports.unsafeDeleteAt = unsafeDeleteAt;
/**
 * @category conversions
 * @since 2.5.0
 */
var toArray = function (as) { return as.slice(); };
exports.toArray = toArray;
/**
 * @category conversions
 * @since 2.5.0
 */
var fromArray = function (as) { return ((0, exports.isEmpty)(as) ? exports.empty : as.slice()); };
exports.fromArray = fromArray;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * An empty array
 *
 * @since 2.5.0
 */
exports.empty = RNEA.empty;
function every(predicate) {
    return function (as) { return as.every(predicate); };
}
/**
 * Check if a predicate holds true for any array member.
 *
 * @example
 * import { some } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([-1, -2, 3], some(isPositive)), true)
 * assert.deepStrictEqual(pipe([-1, -2, -3], some(isPositive)), false)
 *
 * @since 2.9.0
 */
var some = function (predicate) {
    return function (as) {
        return as.some(predicate);
    };
};
exports.some = some;
/**
 * Alias of [`some`](#some)
 *
 * @since 2.11.0
 */
exports.exists = exports.some;
/**
 * Places an element in between members of a `ReadonlyArray`, then folds the results using the provided `Monoid`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
var intercalate = function (M) {
    var intercalateM = RNEA.intercalate(M);
    return function (middle) { return (0, exports.match)(function () { return M.empty; }, intercalateM(middle)); };
};
exports.intercalate = intercalate;
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
exports.bind = (0, Chain_1.bind)(exports.Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.5.0
 */
exports.chain = exports.flatMap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `ReadonlyNonEmptyArray` module instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.range = RNEA.range;
/**
 * Use [`prepend`](#prepend) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.cons = RNEA.cons;
/**
 * Use [`append`](#append) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.snoc = RNEA.snoc;
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
exports.prependToAll = exports.prependAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RA.Functor` instead of `RA.readonlyArray`
 * (where `RA` is from `import RA from 'fp-ts/ReadonlyArray'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.readonlyArray = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    mapWithIndex: _mapWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    alt: _alt,
    zero: exports.zero,
    unfold: exports.unfold,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    extend: _extend,
    wither: _wither,
    wilt: _wilt
};
