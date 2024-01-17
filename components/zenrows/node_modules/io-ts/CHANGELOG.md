# Changelog

> **Tags:**
>
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]
> - [Deprecation]

**Note**: Gaps between patch versions are faulty/broken releases.
**Note**: A feature tagged as Experimental is in a high state of flux, you're at risk of it changing without notice.

# 2.2.21

- **Bug Fix**
  - Handle `record` keys outside `domain`, #705 (@tgfisher4)

# 2.2.20

- undeprecate `FunctionType`, `FunctionC`, `Function`
- undeprecate `NeverType`, `NeverC`, `never`
- undeprecate `AnyType`, `AnyC`, `any`
- undeprecate `RefinementC`, `refinement`, `Integer`
- add refinement overload to allow custom branding, closes #373

# 2.2.19

- **Bug Fix**
  - allow `Error` to be decoded with `UnknownRecord`, #664 (@mlegenhausen)

# 2.2.18

- **Bug Fix**
  - fix `typescript@4.8` errors, closes #656, closes #647 (@gcanti)

# 2.2.17

- **Bug Fix**
  - Don't throw a TypeError when trying to decode a sum value that contains a dangerous string, #650 (@thewilkybarkid)

# 2.2.16

Experimental modules require `fp-ts@^2.5.0`.

- **Experimental**
  - `Codec`
    - add `readonly` combinator (@gcanti)
  - `Encoder`
    - add `readonly` combinator (@gcanti)

# 2.2.15

- **Experimental**
  - `Schemable`
    - (\*) add `readonly` combinator (@gcanti)
    - (\*) add `struct` combinator (@gcanti)
  - deprecate `type` in favour of `struct` (@gcanti)
  - deprecate `fromType` in favour of `fromStruct` (@gcanti)

(\*) breaking change

# 2.2.14

- **Experimental**
  - `Guard`
    - relax `UnknownRecord` check, closes #559 (@waynevanson)

# 2.2.13

- **Bug Fix**
  - improve internal `mergeAll` function, closes #532 (@gcanti)

# 2.2.12

- **Experimental**
  - (\*) make `sum` safer, closes #523 (@gcanti)

(\*) breaking change

In case of non-`string` tag values, the respective key must be enclosed in brackets

```ts
export const MySum: D.Decoder<
  unknown,
  | {
      type: 1 // non-`string` tag value
      a: string
    }
  | {
      type: 2 // non-`string` tag value
      b: number
    }
> = D.sum('type')({
  [1]: D.type({ type: D.literal(1), a: D.string }),
  [2]: D.type({ type: D.literal(2), b: D.number })
})
```

# 2.2.11

- **Experimental**
  - `Decoder`
    - make `toForest` stack-safe, #520 (@safareli)

# 2.2.10

- **Polish**
  - expose modules without lib/es6 prefix, #507 (@osdiab)

# 2.2.9

- **Polish**
  - remove `Object.freeze` calls, closes #497 (@gcanti)
- **Experimental**
  - `DecodeError`
    - add `Wrap` member (@gcanti)
  - `Decoder`
    - add `withMessage` combinator (@gcanti)
  - `TaskDecoder`
    - add `withMessage` combinator (@gcanti)

# 2.2.8

- **Experimental**
  - (\*) remove `KleisliDecoder` module (@gcanti)
  - (\*) remove `KleisliTaskDecoder` module (@gcanti)
  - (\*) remove `JsonCodec` module (@gcanti)
  - (\*) remove `JsonEncoder` module (@gcanti)
  - `Codec`
    - (\*) make `Codec` more general by adding a `I` type parameter (@gcanti)
    - add `fromType` function (@gcanti)
    - add `fromPartial` function (@gcanti)
    - add `fromArray` function (@gcanti)
    - add `fromRecord` function (@gcanti)
    - add `fromTuple` function (@gcanti)
    - add `fromSum` function (@gcanti)
    - add `compose` function (@gcanti)
  - `Decoder`
    - (\*) make `Decoder` more general by adding a `I` type parameter (@gcanti)
    - add `fromRefinement` function (@gcanti)
    - change `fromGuard` signature (@gcanti)
    - add `fromType` function (@gcanti)
    - add `fromPartial` function (@gcanti)
    - add `fromArray` function (@gcanti)
    - add `fromRecord` function (@gcanti)
    - add `fromTuple` function (@gcanti)
    - add `fromSum` function (@gcanti)
    - add `compose` function (@gcanti)
    - add `id` function (@gcanti)
    - (\*) rename `functorDecoder` instance to `Functor` (@gcanti)
    - (\*) rename `altDecoder` instance to `Alt` (@gcanti)
    - (\*) rename and split `schemableDecoder` (@gcanti)
    - add `Category` instance (@gcanti)
    - add `InputOf` type (@gcanti)
  - `TaskDecoder`
    - (\*) make `TaskDecoder` more general by adding a `I` type parameter (@gcanti)
    - add `fromRefinement` function (@gcanti)
    - change `fromDecoder` signature (@gcanti)
    - add `fromType` function (@gcanti)
    - add `fromPartial` function (@gcanti)
    - add `fromArray` function (@gcanti)
    - add `fromRecord` function (@gcanti)
    - add `fromTuple` function (@gcanti)
    - add `fromSum` function (@gcanti)
    - add `compose` function (@gcanti)
    - add `id` function (@gcanti)
    - (\*) rename `functorTaskDecoder` instance to `Functor` (@gcanti)
    - (\*) rename `altTaskDecoder` instance to `Alt` (@gcanti)
    - (\*) rename and split `schemableTaskDecoder` (@gcanti)
    - add `Category` instance (@gcanti)
    - add `InputOf` type (@gcanti)
  - `Guard`
    - (\*) make `Guard` more general by adding a `I` type parameter (@gcanti)
    - (\*) rename `schemableGuard` (@gcanti)
    - add `InputOf` type (@gcanti)
    - add `alt` function (@gcanti)
    - add `zero` function (@gcanti)
    - add `compose` function (@gcanti)
    - add `id` function (@gcanti)
  - `Codec`
    - (\*) rename `invariantCodec` to `Invariant` (@gcanti)
  - `Encoder`
    - (\*) rename `contravariantEncoder` to `Contravariant` (@gcanti)
    - (\*) rename `categoryEncoder` to `Category` (@gcanti)
  - `Eq`
    - (\*) rename and split `schemableEq` (@gcanti)
  - `Kleisli`
    - add `id` (@gcanti)
    - rename `type` to `fromType` (@gcanti)
    - rename `partial` to `fromPartial` (@gcanti)
    - rename `array` to `fromArray` (@gcanti)
    - rename `record` to `fromRecord` (@gcanti)
    - rename `tuple` to `fromTuple` (@gcanti)
    - rename `sum` to `fromSum` (@gcanti)
  - `Schemable`
    - add `Schemable2C`, `WithUnknownContainers2C`, `WithUnion2C`, `WithRefine2C` (@gcanti)
  - `Type`
    - (\*) rename and split `schemableType` (@gcanti)

(\*) breaking change

# 2.2.7

- **Experimental**
  - add `DecodeError` module (@gcanti)
  - add `FreeSemigroup` module (@gcanti)
  - add `TaskDecoder` module (@gcanti)
  - add `Kleisli` module (@gcanti)
  - add `KleisliDecoder` module (@gcanti)
  - add `KleisliTaskDecoder` module (@gcanti)
  - (\*) remove `NaN` from `number` instances (@gcanti)
  - (\*) remove `Tree` module (@gcanti)
  - (\*) make `Json` type immutable (@gcanti)
  - `Decoder`
    - (\*) remove `never` (@gcanti)
    - (\*) make `parse` pipeable and change its `parser` argument (@gcanti)
    - (\*) change `DecoderError` (@gcanti)
    - (\*) remove `withExpected` in favour of `mapLeftWithInput` (@gcanti)
  - `Guard`
    - (\*) remove `never` (@gcanti)
  - `Schemable`
    - (\*) better `literal` signature (@gcanti)
    - (\*) better `union` signature (@gcanti)
    - (\*) make intersections pipeables (@gcanti)
    - (\*) make refinements pipeables (@gcanti)

(\*) breaking change

# 2.2.6

- **Experimental**
  - `Decoder`
    - add support for non-`string` tag values to `sum`, closes #481 (@gcanti)
    - `intersection` should accumulate all errors (@gcanti)

# 2.2.5

- **Experimental**
  - fix type information lost from nested decoder types, #479 (@gcanti)
  - `JsonEncoder`
    - change `id` signature (@gcanti)

# 2.2.4

- **Polish**
  - remove the dependency on the `either` instance as a mean of improving tree shaking (@gcanti)

# 2.2.3

- **Polish**
  - use the built-in `Readonly` type in `readonly` combinator, closes #472 (@gcanti)
- **Experimental**
  - split instances (@gcanti)
  - add `Type` experimental module, #464 (@gcanti)
  - restore the `O` type parameter to `Encoder`, #469 (@gcanti)
  - add the `O` type parameter to `Codec` (@gcanti)
  - add `JsonCodec` experimental module (@gcanti)
  - add `JsonEncoder` experimental module (@gcanti)
  - `Schemable`
    - rename `Schemable` interface to `Schemable1` (@gcanti)
    - rename `WithUnion` interface to `WithUnion1` (@gcanti)
    - add `Schemable` interface (@gcanti)
    - add `WithUnion` interface (@gcanti)
    - add `WithRefinement` / `WithRefinement1` interfaces (@gcanti)
    - add `WithUnknownContainers` / `WithUnknownContainers1` interfaces (@gcanti)
      - move `UnknownArray` and `UnknownRecord` to `WithUnknownContainers` (@gcanti)
  - `Schema`
    - refactoring with the new `Schemable` interface (@gcanti)
    - add `interpreter` function (@gcanti)
- **Internal**
  - upgrade to `typescript@3.9.3` (@gcanti)

# 2.2.2

- **Experimental**
  - add `Eq` module (@gcanti)
  - `Codec`
    - add `TypeOf` operator (@gcanti)
  - `Decoder`
    - add `DecodeError` interface (@gcanti)
  - `Encoder`
    - add `TypeOf` operator (@gcanti)
  - `Guard`
    - add `TypeOf` operator (@gcanti)

# 2.2.1

- **Experimental**
  - `Decoder`
    - collect all errors while decoding, closes #449 (@gcanti)

# 2.2.0

- **Experimental**
  - add `Codec`, `Decoder`, `Encoder`, `Guard`, `Schema`, `Schemable`, `Tree` modules (@gcanti)

# 2.1.3

- **Polish**
  - remove useless `hasOwnProperty` calls, closes #423 (@gcanti)

# 2.1.1

- **Bug Fix**
  - fix `record` domain handling, closes #391 (@gcanti)

# 2.1.0

- **New Feature**
  - add `bigint` codec (@mixedCase)

# 2.0.6

- **Bug Fix**
  - whitelist `window` in `UnknownRecord`, fix #413 (@gcanti)

# 2.0.5

- **Bug Fix**
  - `partial` shouldn't allow arrays, fix #407 (@gcanti)

# 2.0.4

- **Bug Fix**
  - remove getters, fix #404 (@gcanti)

# 2.0.3

- **Bug Fix**
  - rewrite es6 imports (@gcanti)

# 2.0.2

- **Bug Fix**
  - fix #397 (@gcanti)

# 2.0.1

- **Bug Fix**
  - fix `getTags` algorithm for mutually recursive codecs, closes #354 (@gcanti)

# 2.0.0

- **Breaking Change**
  - upgrade to `fp-ts@2.x` (@gcanti)
  - move `fp-ts` to `peerDependencies` (@gcanti)

# 1.10.4

- **Polish**
  - remove unneeded internal code (@gcanti)

# 1.10.3

- **Bug Fix**
  - revert `1.10.0` compatibility, fix #344 (@gcanti)

# 1.10.2

- **Bug Fix**
  - move `fp-ts` back to dependencies (@gcanti)

# 1.10.1

- **Bug Fix**
  - handle `strict`, `exact` and `refinement` codecs when optimizing tagged unions, fix #339 (@gcanti)

# 1.10.0

- **New Feature**
  - make `io-ts` compatible with both `fp-ts@1.x`, `fp-ts@2.x` (@gcanti)

# 1.9.0

- **New Feature**
  - `union` is now able to detect and optimize tagged unions (@gcanti)
- **Deprecation**
  - deprecate `taggedUnion` in favour of `union` (@gcanti)

# 1.8.6

output ES modules to better support tree-shaking, closes #326 (@gcanti)

# 1.8.5

- **Bug Fix**
  - change how types and output types are retrieved in `IntersectionC` and `TupleC`, fix #315 (@gcanti)

# 1.8.4

- **Polish**
  - autobind `decode` method (@gcanti)

# 1.8.3

- **Polish**
  - add `stripInternal` flag to `tsconfig.json` (@gcanti)
  - handle `NaN` in `PathReporter` (@gcanti)
  - throw if union encoding doesn't find a usable codec (@leemhenson)
- **Deprecation**
  - deprecate `NeverType` (@gcanti)
  - deprecate `FunctionType` (@gcanti)

# 1.8.2

- **Bug Fix**
  - align the runtime behavior of `Exact.is` with the type system, fix #288 (@gcanti)

# 1.8.1

- **New Feature**
  - add `brand` combinator (@gcanti, @lostintime)
  - add `Int` codec (@gcanti)
  - `exact` strips additional properties while decoding / encoding (@gcanti)
  - un-deprecate `strict` combinator, is now an alias of `exact(type(...))` (@gcanti)
- **Bug Fix**
  - fix wrong context keys for tagged unions (@gcanti)
- **Deprecation**
  - deprecate `refinement` combinator in favour of `brand` (@gcanti)
  - deprecate `Integer` codec in favour of `Int` (@gcanti)
  - deprecate `StrictType` class (@gcanti)
  - deprecate `StrictC` interface (@gcanti)
- **Polish**
  - modify the implementation of `intersection` in order to support combinators that strip additional properties (@gcanti)
  - do not validate the codomain of a key of a record if its domain in invalid (@gcanti)
  - normalize missing `message` field in `ValidationError` (@gcanti)
  - fix name of recursive codec definitions (@gcanti)
  - remove unexpected validation path from partial type, closes #195 (@gcanti)
  - do not leak taggedUnion implementation when tag validation fails (@gcanti)
  - add `actual` value to all context entries (@gcanti)
  - `exact` now bails out when the value is not an `UnknownRecord` (@gcanti)
  - `tuple` should not leak the implementation (`never` usage) (@gcanti)
  - `exact` should not leak the implementation (`never` usage) (@gcanti)
  - use `Number.isInteger` in `Integer` implementation (@gcanti)
  - use the Flow convention to name `exact` codecs (@gcanti)

# 1.7.1

- **Deprecation**
  - deprecate `any` (@gcanti)
  - deprecate `object` (@gcanti)
  - deprecate `Dictionary` in favour of `UnknownRecord` (@gcanti)
  - deprecate `Array` in favour of `UnknownArray` (@gcanti)
  - deprecate `dictionary` in favour of `record` (@gcanti)

# 1.7.0

- **New Feature**
  - better support for custom messages, closes #148 (@gcanti)
    - add optional message field to `ValidationError`
    - add `message` argument to `failure`
    - `PathReporter` should account for the new field
  - add `actual` optional field to `ContextEntry`, closes #194 (@gcanti)
- **Deprecation**
  - deprecate `getValidationError` (@gcanti)
  - deprecate `getDefaultContext` (@gcanti)

# 1.6.4

- **Bug Fix**
  - `getIndexRecord`: getIndexRecord: handle conflicting tags in different positions, ref #263 (@gcanti)
- **Experimental**
  - added a warning to the console if a tagged union cannot be created (@gcanti)
  - revert `union` optimization, needs more work to make it happen (@gcanti)

# 1.6.3

- **Bug Fix**
  - prevent maximum call stack size exceeded when indexing recursive codecs, closes #259 (@gcanti)

# 1.6.2

- **Polish**
  - make `isIndexableCodec` more strict (@gcanti)

# 1.6.1

- **Bug Fix**
  - `taggedUnion` should handle sub unions / tagged unions correctly, closes #257 (@gcanti)
- **Experimental**
  - optimize `union` with the same algorithm used in `taggedUnion` (@gcanti)

# 1.6.0

**Important**. This version requires `typescript@3.2.2+`

- **New Feature**
  - leverage `typescript@3.2.2` (@gcanti)
    - `TypeC`
    - `PartialC`
    - `RecordC`
    - `UnionC`
    - `ReadonlyC`
    - `StrictC`
    - `TaggedUnionC`

# 1.5.3

- **Bug Fix**
  - missing context info while decoding an intersection, fix #246 (@gcanti)
- **Experimental**
  - add intermediary interfaces, closes #165 (@gcanti)
    - `NullC`
    - `UndefinedC`
    - `VoidC`
    - `AnyC`
    - `UnknownC`
    - `NeverC`
    - `StringC`
    - `NumberC`
    - `BooleanC`
    - `UnknownArrayC`
    - `UnknownRecordC`
    - `ObjectC`
    - `FunctionC`
    - `RefinementC`
    - `LiteralC`
    - `KeyofC`
    - `ArrayC`
    - `TypeC`
    - `PartialC`
    - `RecordC`
    - `UnionC`
    - `IntersectionC`
    - `TupleC`
    - `ReadonlyC`
    - `ReadonlyArrayC`
    - `StrictC`
    - `TaggedUnionC`
    - `ExactC`
- **Polishs**
  - use rest elements in tuple types (`typescript@3.0.1` feature) (@gcanti)
  - `union` should handle zero types (@gcanti)
  - `intersection` should handle zero / one types (@gcanti)
- **Deprecation**
  - deprecate `clean` (@gcanti)
  - deprecate `alias` (@gcanti)
  - deprecate `PropsOf` type (@gcanti)
  - deprecate `Exact` type (@gcanti)

# 1.5.2

- **Deprecation**
  - deprecate `Compact` type (@gcanti)

# 1.5.1

- **Polish**
  - remove useless module augmentation of `Array` (@gcanti)

# 1.5.0

- **New Feature**
  - add `UnknownType`, closes #238 (@gcanti)
- **Deprecation**
  - `ThrowReporter` is now deprecated (@gcanti)

# 1.4.2

use `Compact` in `intersection` signatures as a workaround for #234 (@sledorze)

# 1.4.1

- **Polish**
  - `Type.prototype.pipe` now allows more types as input, #231 #232 (@sledorze)

# 1.4.0

- **New Feature**
  - use `unknown` as `mixed` (@gcanti)

# 1.3.4

- **Bug Fix**
  - should emit expected keys while decoding, fix #214 (@gcanti)

# 1.3.3

- **Bug Fix**
  - align `TaggedExact` definition with siblings, fix #223 (@gcanti)

# 1.3.2

- **Bug Fix**
  - dictionary type should not allow arrays, fix #218 (@gcanti)

# 1.3.1

- **Polish**
  - use interface instead of type alias (@gcanti)
    - `Context`
    - `Errors`
    - `Any`
    - `Mixed`

# 1.3.0

- **New Feature**
  - add `TaggedUnionType` (@gcanti)

# 1.2.1

- **Polish**
  - allow recursive types in tagged unions (@gcanti)

# 1.2.0

- **New Feature**
  - add `void` runtime type (@gcanti)

# 1.1.5

- **Bug Fix**
  - partial combinator should preserve additional properties while encoding, fixes #179 (@gcanti)
- **Polish**
  - use `useIdentity` when possible (@gcanti)

# 1.1.4

- **Internal**
  - fix broken build with `typescript@2.9.1`, closes #174 (@gcanti)

# 1.1.3

- **Internal**
  - upgrade to `typings-checker@2.0.0` (@gcanti)

# 1.1.2

- **Bug Fix**
  - fix `alias` implementation (@gcanti)
  - handle exact types in `isTagged` (@gcanti)

# 1.1.1

- **Experimental**
  - add `clean` / `alias` functions, closes #149 (@gcanti)
  - add `exact` combinator (@gcanti)
    - the `strict` combinator is deprecated
  - remove `optional` combinator (@gcanti)
    - it doesn't play well with advanced combinators, see [here](https://github.com/gcanti/io-ts/issues/140) for a discussion

# 1.0.6

- **Bug Fix**
  - `taggedUnion` fails to decode when tag values are not string literals, fix #161 (@gcanti)

# 1.0.5

- **Bug Fix**
  - workaround for upstream TypeScript bug 14041 (wrong generated declarations) (@gcanti)
- **Internal**
  - optimize InterfaceType.encode (@gcanti)
  - use definite assignment assertion for phantom fields (@gcanti)

# 1.0.4

- **Bug Fix**
  - make `Context` readonly (@gcanti)
- **Internal**
  - optimizations, #137 (@gcanti, @sledorze)

# 1.0.3

- **Internal**
  - optimizations, #134 (@gcanti, @sledorze)

# 1.0.2

- **Bug Fix**
  - fix `OutputOfPartialProps` name (@gcanti)

# 1.0.1

- **Bug Fix**
  - fix `AnyType` by extending `Type<any>` (@gcanti)

# 1.0.0

- **Breaking Change**
  - upgrade to `fp-ts@1.0.0`
  - see https://github.com/gcanti/io-ts/pull/112 (@gcanti)

# 0.9.8

- **New Feature**
  - add decode and deprecate top level validate (@gcanti)
- **Internal**
  - when checking validations use methods instead of top level functions (@gcanti)

# 0.9.7

- **New Feature**
  - add `taggedUnion` combinator (@gcanti, @sledorze)

# 0.9.6

- **New Feature**
  - `recursive` combinator
    - add support for mutually recursive types, closes #114 (@gcanti)
    - make it safer: `RT` now must extend `Type<mixed, A>` (@gcanti)

# 0.9.5

- **New Feature**
  - add `mixed` type (@gcanti)
  - replace `any` with `mixed` in all input type parameters (@gcanti)
    ```diff
    -export class StringType extends Type<any, string> {
    +export class StringType extends Type<mixed, string> {
    }
    ```

# 0.9.4

- **Bug Fix**
  - strict: should succeed validating an undefined field, closes #106 (@gcanti)

# 0.9.3

- **Bug Fix**
  - revert 37c74a5e2038de063a950f9ba8d18b1f132ef450, closes #8 (@gcanti)

# 0.9.2

- **New Feature**
  - add `Decoder` / `Encoder` interfaces (@sledorze, @gcanti)
- **Internal**
  - perf optimizations (@sledorze, @gcanti)

# 0.9.1

- **Bug Fix**
  - make all classes "dumb", fix #95 (@gcanti)

# 0.9.0

- **Breaking Change**
  - remove `t.map` and `t.mapWithName` (in general doesn't look serializable, needs more investigation)
  - remove `t.prism` (in general doesn't look serializable, needs more investigation)
  - change `Type` from interface to class and add `S` type parameter
    - remove `t._A`
  - add `Type#serialize`
  - add `Type#is` (in order to serialize unions and while we're at it, looks useful anyway)
  - remove `t.is` (now that there's `Type#is` is misleading)
- **Experimental**
  - add Flowtype support (@gcanti)

# 0.8.2

- **New Feature**
  - add `object` type, closes #86 (@gcanti)

# 0.8.1

- **New Feature**
  - add `strict` combinator, closes #84 (@phiresky, @gcanti)

# 0.8.0

- **Breaking Change**
  - upgrade `fp-ts` dependency (@gcanti)

# 0.7.2

- **Bug Fix**
  - tag recursive types, fix #80 (@gcanti)

# 0.7.1

- **Bug Fix**
  - incorrect compile time type for dictionary, fix #75 (@gcanti)

# 0.7.0

- **Breaking Change**
  - upgrade to latest fp-ts (0.5.1) (@gcanti)

# 0.6.2

- **New Feature**
  - add aliases for `null` and `interface`, closes #63 (@gcanti)

# 0.6.1

- **Internal**
  - handle latest fp-ts (0.4.3) (@gcanti)

# 0.6.0

- **Breaking Change**
  - upgrade to latest fp-ts (0.4.0) (@gcanti)
- **Internal**
  - allow for infinite unions (@gcanti)

# 0.5.1

- **Bug Fix**
  - export and rename `interfaceType` to `_interface`, fix #57 (@gcanti)

# 0.5.0

- **Breaking Change**
  - `Type` is now an interface
  - types no more own a `is` method, use `t.is` instead
  - unions no more own a `fold` method
  - `Reporter`, `PathReporter`, `ThrowReporter` are now top level modules

# 0.4.0

- **Breaking Change**
  - upgrade to latest `fp-ts` (`io-ts` APIs are not changed though) (@gcanti)
  - drop `lib-jsnext` folder

# 0.3.2

- **Bug Fix**
  - remove excess overloadings, fix #43 (@gcanti)

# 0.3.1

- **New Feature**
  - add mapWithName and Functor instance, fix #37 (@gcanti)
  - add prism combinator, fix #41 (@gcanti)

# 0.3.0

This is a breaking change _only_ if you are using fp-ts APIs

- **Breaking Change**
  - upgrade to latest fp-ts v0.2 (@gcanti)

# 0.2.3

- **Internal**
  - upgrade to fp-ts v0.1 (@gcanti)

# 0.2.2

- **New Feature**
  - add `partial` combinator (makes optional props possible)
  - add `readonly` combinator (values are not frozen in production)
  - add `readonlyArray` combinator (values are not frozen in production)
  - add `never` type
- **Breaking Changes**
  - remove `maybe` combinator, can be defined in userland as
    ```ts
    export function maybe<RT extends t.Any>(
      type: RT,
      name?: string
    ): t.UnionType<[RT, typeof t.null], t.TypeOf<RT> | null> {
      return t.union([type, t.null], name)
    }
    ```
- **Polish**
  - export `pathReporterFailure` function from default reporters
- **Bug Fix**
  - revert pruning excess properties (see https://github.com/gcanti/io-ts/pull/27 for context)
  - revert `intersection` combinator accepting only `InterfaceType`s
- **Experimental**
  - Pattern matching / catamorphism for unions

# 0.1.0

- **New Feature**

  - add support for jsnext
  - add `Integer` type

- **Breaking Changes**
  - `t.Object` type. Renamed to `t.Dictionary`, now accepts arrays so is fully equivalent to `{ [key: string]: any }`.
  - `t.instanceOf` combinator. Removed.
  - `t.object` combinator. Renamed to `t.interface`. `ObjectType` to `InterfaceType`. Excess properties are now pruned.
  - `mapping` combinator. Renamed to `dictionary`. `MappingType` to `DictionaryType`.
  - `intersection` combinator. Due to the new excess property pruning in `t.interface` now only accept `InterfaceType`s.
  - API `isSuccess` removed, use `either.isRight` instead
  - API `isFailure` removed, use `either.isLeft` instead
  - API `fromValidation` removed

# 0.0.2

- **Bug Fix**
  - reverse overloading definitions for unions, intersections and tuples, fix inference bug

# 0.0.1

Initial release
