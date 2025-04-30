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
import { identity } from 'fp-ts/es6/function';
import { pipe } from 'fp-ts/es6/pipeable';
import * as D from './Decoder';
import * as E from './Encoder';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.3
 */
export function make(decoder, encoder) {
    return {
        decode: decoder.decode,
        encode: encoder.encode
    };
}
/**
 * @category constructors
 * @since 2.2.3
 */
export function fromDecoder(decoder) {
    return {
        decode: decoder.decode,
        encode: identity
    };
}
/**
 * @category constructors
 * @since 2.2.3
 */
export function literal() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return fromDecoder(D.literal.apply(D, values));
}
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.3
 */
export var string = 
/*#__PURE__*/
fromDecoder(D.string);
/**
 * @category primitives
 * @since 2.2.3
 */
export var number = 
/*#__PURE__*/
fromDecoder(D.number);
/**
 * @category primitives
 * @since 2.2.3
 */
export var boolean = 
/*#__PURE__*/
fromDecoder(D.boolean);
/**
 * @category primitives
 * @since 2.2.3
 */
export var UnknownArray = 
/*#__PURE__*/
fromDecoder(D.UnknownArray);
/**
 * @category primitives
 * @since 2.2.3
 */
export var UnknownRecord = 
/*#__PURE__*/
fromDecoder(D.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.3
 */
export var mapLeftWithInput = function (f) {
    return function (codec) {
        return make(pipe(codec, D.mapLeftWithInput(f)), codec);
    };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export var refine = function (refinement, id) {
    var refine = D.refine(refinement, id);
    return function (from) { return make(refine(from), from); };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export function nullable(or) {
    return make(D.nullable(or), E.nullable(or));
}
/**
 * @category combinators
 * @since 2.2.15
 */
export function fromStruct(properties) {
    return make(D.fromStruct(properties), E.struct(properties));
}
/**
 * Use `fromStruct` instead.
 *
 * @category combinators
 * @since 2.2.8
 * @deprecated
 */
export var fromType = fromStruct;
/**
 * @category combinators
 * @since 2.2.15
 */
export function struct(properties) {
    return pipe(UnknownRecord, compose(fromStruct(properties)));
}
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.3
 * @deprecated
 */
export var type = struct;
/**
 * @category combinators
 * @since 2.2.8
 */
export function fromPartial(properties) {
    return make(D.fromPartial(properties), E.partial(properties));
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function partial(properties) {
    return pipe(UnknownRecord, compose(fromPartial(properties)));
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function fromArray(item) {
    return make(D.fromArray(item), E.array(item));
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function array(item) {
    return pipe(UnknownArray, compose(fromArray(item)));
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function fromRecord(codomain) {
    return make(D.fromRecord(codomain), E.record(codomain));
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function record(codomain) {
    return pipe(UnknownRecord, compose(fromRecord(codomain)));
}
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromTuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return make(D.fromTuple.apply(D, components), E.tuple.apply(E, components));
};
/**
 * @category combinators
 * @since 2.2.3
 */
export function tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return pipe(UnknownArray, compose(fromTuple.apply(void 0, components)));
}
/**
 * @category combinators
 * @since 2.2.3
 */
export var intersect = function (right) {
    var intersectD = D.intersect(right);
    var intersectE = E.intersect(right);
    return function (left) { return make(intersectD(left), intersectE(left)); };
};
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromSum = function (tag) {
    var decoder = D.fromSum(tag);
    var encoder = E.sum(tag);
    return function (members) { return make(decoder(members), encoder(members)); };
};
/**
 * @category combinators
 * @since 2.2.3
 */
export function sum(tag) {
    var sum = fromSum(tag);
    return function (members) { return pipe(UnknownRecord, compose(sum(members))); };
}
/**
 * @category combinators
 * @since 2.2.3
 */
export function lazy(id, f) {
    return make(D.lazy(id, f), E.lazy(f));
}
/**
 * @category combinators
 * @since 2.2.16
 */
export var readonly = identity;
/**
 * @category combinators
 * @since 2.2.8
 */
export var compose = function (to) {
    return function (from) {
        return make(D.compose(to)(from), E.compose(from)(to));
    };
};
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
export var imap = function (f, g) { return function (fa) {
    return imap_(fa, f, g);
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.3
 */
export var URI = 'io-ts/Codec';
/**
 * @category instances
 * @since 2.2.8
 */
export var Invariant = {
    URI: URI,
    imap: imap_
};
