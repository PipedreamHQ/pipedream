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
exports.Invariant = exports.URI = exports.imap = exports.compose = exports.readonly = exports.lazy = exports.sum = exports.fromSum = exports.intersect = exports.tuple = exports.fromTuple = exports.record = exports.fromRecord = exports.array = exports.fromArray = exports.partial = exports.fromPartial = exports.type = exports.struct = exports.fromType = exports.fromStruct = exports.nullable = exports.refine = exports.mapLeftWithInput = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.literal = exports.fromDecoder = exports.make = void 0;
/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.3
 */
var function_1 = require("fp-ts/lib/function");
var pipeable_1 = require("fp-ts/lib/pipeable");
var D = __importStar(require("./Decoder"));
var E = __importStar(require("./Encoder"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.3
 */
function make(decoder, encoder) {
    return {
        decode: decoder.decode,
        encode: encoder.encode
    };
}
exports.make = make;
/**
 * @category constructors
 * @since 2.2.3
 */
function fromDecoder(decoder) {
    return {
        decode: decoder.decode,
        encode: function_1.identity
    };
}
exports.fromDecoder = fromDecoder;
/**
 * @category constructors
 * @since 2.2.3
 */
function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return fromDecoder(D.literal.apply(D, values));
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.3
 */
exports.string = 
/*#__PURE__*/
fromDecoder(D.string);
/**
 * @category primitives
 * @since 2.2.3
 */
exports.number = 
/*#__PURE__*/
fromDecoder(D.number);
/**
 * @category primitives
 * @since 2.2.3
 */
exports.boolean = 
/*#__PURE__*/
fromDecoder(D.boolean);
/**
 * @category primitives
 * @since 2.2.3
 */
exports.UnknownArray = 
/*#__PURE__*/
fromDecoder(D.UnknownArray);
/**
 * @category primitives
 * @since 2.2.3
 */
exports.UnknownRecord = 
/*#__PURE__*/
fromDecoder(D.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.3
 */
var mapLeftWithInput = function (f) {
    return function (codec) {
        return make((0, pipeable_1.pipe)(codec, D.mapLeftWithInput(f)), codec);
    };
};
exports.mapLeftWithInput = mapLeftWithInput;
/**
 * @category combinators
 * @since 2.2.3
 */
var refine = function (refinement, id) {
    var refine = D.refine(refinement, id);
    return function (from) { return make(refine(from), from); };
};
exports.refine = refine;
/**
 * @category combinators
 * @since 2.2.3
 */
function nullable(or) {
    return make(D.nullable(or), E.nullable(or));
}
exports.nullable = nullable;
/**
 * @category combinators
 * @since 2.2.15
 */
function fromStruct(properties) {
    return make(D.fromStruct(properties), E.struct(properties));
}
exports.fromStruct = fromStruct;
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
exports.fromType = fromStruct;
/**
 * @category combinators
 * @since 2.2.15
 */
function struct(properties) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)(fromStruct(properties)));
}
exports.struct = struct;
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.3
 * @deprecated
 */
exports.type = struct;
/**
 * @category combinators
 * @since 2.2.8
 */
function fromPartial(properties) {
    return make(D.fromPartial(properties), E.partial(properties));
}
exports.fromPartial = fromPartial;
/**
 * @category combinators
 * @since 2.2.3
 */
function partial(properties) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)(fromPartial(properties)));
}
exports.partial = partial;
/**
 * @category combinators
 * @since 2.2.3
 */
function fromArray(item) {
    return make(D.fromArray(item), E.array(item));
}
exports.fromArray = fromArray;
/**
 * @category combinators
 * @since 2.2.3
 */
function array(item) {
    return (0, pipeable_1.pipe)(exports.UnknownArray, (0, exports.compose)(fromArray(item)));
}
exports.array = array;
/**
 * @category combinators
 * @since 2.2.3
 */
function fromRecord(codomain) {
    return make(D.fromRecord(codomain), E.record(codomain));
}
exports.fromRecord = fromRecord;
/**
 * @category combinators
 * @since 2.2.3
 */
function record(codomain) {
    return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)(fromRecord(codomain)));
}
exports.record = record;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromTuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return make(D.fromTuple.apply(D, components), E.tuple.apply(E, components));
};
exports.fromTuple = fromTuple;
/**
 * @category combinators
 * @since 2.2.3
 */
function tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return (0, pipeable_1.pipe)(exports.UnknownArray, (0, exports.compose)(exports.fromTuple.apply(void 0, components)));
}
exports.tuple = tuple;
/**
 * @category combinators
 * @since 2.2.3
 */
var intersect = function (right) {
    var intersectD = D.intersect(right);
    var intersectE = E.intersect(right);
    return function (left) { return make(intersectD(left), intersectE(left)); };
};
exports.intersect = intersect;
/**
 * @category combinators
 * @since 2.2.8
 */
var fromSum = function (tag) {
    var decoder = D.fromSum(tag);
    var encoder = E.sum(tag);
    return function (members) { return make(decoder(members), encoder(members)); };
};
exports.fromSum = fromSum;
/**
 * @category combinators
 * @since 2.2.3
 */
function sum(tag) {
    var sum = (0, exports.fromSum)(tag);
    return function (members) { return (0, pipeable_1.pipe)(exports.UnknownRecord, (0, exports.compose)(sum(members))); };
}
exports.sum = sum;
/**
 * @category combinators
 * @since 2.2.3
 */
function lazy(id, f) {
    return make(D.lazy(id, f), E.lazy(f));
}
exports.lazy = lazy;
/**
 * @category combinators
 * @since 2.2.16
 */
exports.readonly = function_1.identity;
/**
 * @category combinators
 * @since 2.2.8
 */
var compose = function (to) {
    return function (from) {
        return make(D.compose(to)(from), E.compose(from)(to));
    };
};
exports.compose = compose;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var imap_ = function (fa, f, g) { return make(D.Functor.map(fa, f), E.Contravariant.contramap(fa, g)); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Invariant
 * @since 2.2.3
 */
var imap = function (f, g) { return function (fa) {
    return imap_(fa, f, g);
}; };
exports.imap = imap;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.3
 */
exports.URI = 'io-ts/Codec';
/**
 * @category instances
 * @since 2.2.8
 */
exports.Invariant = {
    URI: exports.URI,
    imap: imap_
};
