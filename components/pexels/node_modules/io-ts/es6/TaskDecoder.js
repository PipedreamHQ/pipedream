import * as E from 'fp-ts/es6/Either';
import { identity } from 'fp-ts/es6/function';
import { pipe } from 'fp-ts/es6/pipeable';
import * as T from 'fp-ts/es6/Task';
import * as TE from 'fp-ts/es6/TaskEither';
import * as DE from './DecodeError';
import * as D from './Decoder';
import * as FS from './FreeSemigroup';
import * as K from './Kleisli';
// -------------------------------------------------------------------------------------
// Kleisli config
// -------------------------------------------------------------------------------------
var M = {
    URI: TE.URI,
    _E: undefined,
    map: function (fa, f) { return pipe(fa, TE.map(f)); },
    ap: function (fab, fa) {
        return pipe(pipe(fab, T.map(function (h) { return function (ga) { return D.ap(h, ga); }; })), T.ap(fa));
    },
    of: TE.right,
    chain: function (ma, f) { return pipe(ma, TE.chain(f)); },
    throwError: TE.left,
    bimap: function (fa, f, g) { return pipe(fa, TE.bimap(f, g)); },
    mapLeft: function (fa, f) { return pipe(fa, TE.mapLeft(f)); },
    alt: function (me, that) {
        return pipe(me, T.chain(function (e1) {
            return E.isRight(e1)
                ? T.of(e1)
                : pipe(that(), T.map(function (e2) { return (E.isLeft(e2) ? E.left(D.SE.concat(e1.left, e2.left)) : e2); }));
        }));
    }
};
/**
 * @category DecodeError
 * @since 2.2.7
 */
export var error = D.error;
/**
 * @category DecodeError
 * @since 2.2.7
 */
export var success = TE.right;
/**
 * @category DecodeError
 * @since 2.2.7
 */
export var failure = function (actual, message) {
    return TE.left(D.error(actual, message));
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
export var fromDecoder = function (decoder) { return ({
    decode: TE.fromEitherK(decoder.decode)
}); };
/**
 * @category constructors
 * @since 2.2.8
 */
export var fromRefinement = function (refinement, expected) {
    return fromDecoder(D.fromRefinement(refinement, expected));
};
/**
 * @category constructors
 * @since 2.2.7
 */
export var fromGuard = function (guard, expected) {
    return fromRefinement(guard.is, expected);
};
/**
 * @category constructors
 * @since 2.2.7
 */
export var literal = 
/*#__PURE__*/
K.literal(M)(function (u, values) { return error(u, values.map(function (value) { return JSON.stringify(value); }).join(' | ')); });
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.7
 */
export var string = 
/*#__PURE__*/
fromDecoder(D.string);
/**
 * @category primitives
 * @since 2.2.7
 */
export var number = 
/*#__PURE__*/
fromDecoder(D.number);
/**
 * @category primitives
 * @since 2.2.7
 */
export var boolean = 
/*#__PURE__*/
fromDecoder(D.boolean);
/**
 * @category primitives
 * @since 2.2.7
 */
export var UnknownArray = 
/*#__PURE__*/
fromDecoder(D.UnknownArray);
/**
 * @category primitives
 * @since 2.2.7
 */
export var UnknownRecord = 
/*#__PURE__*/
fromDecoder(D.UnknownRecord);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
export var mapLeftWithInput = 
/*#__PURE__*/
K.mapLeftWithInput(M);
/**
 * @category combinators
 * @since 2.2.9
 */
export var withMessage = function (message) {
    return mapLeftWithInput(function (input, e) { return FS.of(DE.wrap(message(input, e), e)); });
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var refine = function (refinement, id) { return K.refine(M)(refinement, function (a) { return error(a, id); }); };
/**
 * @category combinators
 * @since 2.2.7
 */
export var parse = 
/*#__PURE__*/
K.parse(M);
/**
 * @category combinators
 * @since 2.2.7
 */
export var nullable = 
/*#__PURE__*/
K.nullable(M)(function (u, e) { return FS.concat(FS.of(DE.member(0, error(u, 'null'))), FS.of(DE.member(1, e))); });
/**
 * @category combinators
 * @since 2.2.15
 */
export var fromStruct = function (properties) {
    return K.fromStruct(M)(function (k, e) { return FS.of(DE.key(k, DE.required, e)); })(properties);
};
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
export var struct = function (properties) { return pipe(UnknownRecord, compose(fromStruct(properties))); };
/**
 * Use `struct` instead.
 *
 * @category combinators
 * @since 2.2.7
 * @deprecated
 */
export var type = struct;
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromPartial = function (properties) {
    return K.fromPartial(M)(function (k, e) { return FS.of(DE.key(k, DE.optional, e)); })(properties);
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var partial = function (properties) { return pipe(UnknownRecord, compose(fromPartial(properties))); };
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromArray = function (item) {
    return K.fromArray(M)(function (i, e) { return FS.of(DE.index(i, DE.optional, e)); })(item);
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var array = function (item) {
    return pipe(UnknownArray, compose(fromArray(item)));
};
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromRecord = function (codomain) {
    return K.fromRecord(M)(function (k, e) { return FS.of(DE.key(k, DE.optional, e)); })(codomain);
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var record = function (codomain) {
    return pipe(UnknownRecord, compose(fromRecord(codomain)));
};
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromTuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return K.fromTuple(M)(function (i, e) { return FS.of(DE.index(i, DE.required, e)); }).apply(void 0, components);
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return pipe(UnknownArray, compose(fromTuple.apply(void 0, components)));
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var union = 
/*#__PURE__*/
K.union(M)(function (i, e) { return FS.of(DE.member(i, e)); });
/**
 * @category combinators
 * @since 2.2.7
 */
export var intersect = 
/*#__PURE__*/
K.intersect(M);
/**
 * @category combinators
 * @since 2.2.8
 */
export var fromSum = function (tag) {
    return function (members) {
        return K.fromSum(M)(function (tag, value, keys) {
            return FS.of(DE.key(tag, DE.required, error(value, keys.length === 0 ? 'never' : keys.map(function (k) { return JSON.stringify(k); }).join(' | '))));
        })(tag)(members);
    };
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var sum = function (tag) {
    return function (members) {
        return pipe(UnknownRecord, compose(fromSum(tag)(members)));
    };
};
/**
 * @category combinators
 * @since 2.2.7
 */
export var lazy = 
/*#__PURE__*/
K.lazy(M)(function (id, e) { return FS.of(DE.lazy(id, e)); });
/**
 * @category combinators
 * @since 2.2.15
 */
export var readonly = identity;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var map_ = function (fa, f) { return pipe(fa, map(f)); };
var alt_ = function (me, that) { return pipe(me, alt(that)); };
var compose_ = function (ab, la) { return pipe(la, compose(ab)); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 2.2.7
 */
export var map = 
/*#__PURE__*/
K.map(M);
/**
 * @category Alt
 * @since 2.2.7
 */
export var alt = 
/*#__PURE__*/
K.alt(M);
/**
 * @category Semigroupoid
 * @since 2.2.8
 */
export var compose = 
/*#__PURE__*/
K.compose(M);
/**
 * @category Category
 * @since 2.2.8
 */
export var id = 
/*#__PURE__*/
K.id(M);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.7
 */
export var URI = 'io-ts/TaskDecoder';
/**
 * @category instances
 * @since 2.2.8
 */
export var Functor = {
    URI: URI,
    map: map_
};
/**
 * @category instances
 * @since 2.2.8
 */
export var Alt = {
    URI: URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 2.2.8
 */
export var Category = {
    URI: URI,
    compose: compose_,
    id: id
};
/**
 * @category instances
 * @since 2.2.8
 */
export var Schemable = {
    URI: URI,
    literal: literal,
    string: string,
    number: number,
    boolean: boolean,
    nullable: nullable,
    type: type,
    struct: struct,
    partial: partial,
    record: record,
    array: array,
    tuple: tuple,
    intersect: intersect,
    sum: sum,
    lazy: lazy,
    readonly: readonly
};
/**
 * @category instances
 * @since 2.2.8
 */
export var WithUnknownContainers = {
    UnknownArray: UnknownArray,
    UnknownRecord: UnknownRecord
};
/**
 * @category instances
 * @since 2.2.8
 */
export var WithUnion = {
    union: union
};
/**
 * @category instances
 * @since 2.2.8
 */
export var WithRefine = {
    refine: refine
};
/**
 * @since 2.2.7
 */
export var draw = D.draw;
/**
 * @internal
 */
export var stringify = TE.fold(function (e) { return T.of(draw(e)); }, function (a) { return T.of(JSON.stringify(a, null, 2)); });
