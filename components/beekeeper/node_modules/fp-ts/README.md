<h3 align="center">
  <a href="https://gcanti.github.io/fp-ts/">
    <img src="./docs/fp-ts-logo.png">
  </a>
</h3>

<p align="center">
Functional programming in TypeScript
</p>

<p align="center">
  <a href="https://github.com/gcanti/fp-ts/actions">
    <img src="https://github.com/gcanti/fp-ts/actions/workflows/main.yml/badge.svg?branch=master" alt="build status" height="20">
  </a>
  <a href="https://www.npmjs.com/package/fp-ts">
    <img src="https://img.shields.io/npm/dm/fp-ts.svg" alt="npm downloads" height="20">
  </a>
</p>

**📢 Important Announcement: fp-ts is Joining the Effect-TS Ecosystem!**

We are excited to announce that the `fp-ts` project is officially merging with the Effect-TS ecosystem. This is a significant step forward in the functional programming landscape, bringing together two powerful libraries under one roof. Giulio Canti, the author of `fp-ts`, is being welcomed into the Effect organization, promising an exciting future with enhanced capabilities and support.

**What This Means for New Users:**

Effect-TS can be regarded as the successor to `fp-ts v2` and embodies what would be considered `fp-ts v3`. This merger marks a significant evolution in the library's capabilities, integrating more features and functionalities tailored towards robust, type-safe, and scalable functional programming.

For more details on this merger and what it entails, please refer to the official [announcement here](https://dev.to/effect/a-bright-future-for-effect-455m). Additionally, you can explore more about Effect-TS and its offerings on our [website and documentation](https://effect.website/).

# Introduction

`fp-ts` is a library for _typed functional programming_ in TypeScript.

`fp-ts` aims to allow developers to use _popular patterns and abstractions_ that are available in most functional languages. For this, it includes the most popular data types, type classes and abstractions such as [Option](https://gcanti.github.io/fp-ts/modules/Option.ts), [Either](https://gcanti.github.io/fp-ts/modules/Either.ts), [IO](https://gcanti.github.io/fp-ts/modules/IO.ts), [Task](https://gcanti.github.io/fp-ts/modules/Task.ts), [Functor](https://gcanti.github.io/fp-ts/modules/Functor.ts), [Applicative](https://gcanti.github.io/fp-ts/modules/Applicative.ts), [Monad](https://gcanti.github.io/fp-ts/modules/Monad.ts) to empower users to write pure FP apps and libraries built atop higher order abstractions.

A distinctive feature of `fp-ts` with respect to other functional libraries is its implementation of [Higher Kinded Types](<https://en.wikipedia.org/wiki/Kind_(type_theory)>), which TypeScript doesn't support natively.

**Inspired by**

- [Haskell](https://www.haskell.org)
- [PureScript](https://www.purescript.org)
- [Scala](https://www.scala-lang.org)

# Sponsors

<table>
  <tr>
    <td align="center">
      <a href="https://unsplash.com/">
        <img src="https://avatars.githubusercontent.com/u/9951955?s=200&v=4" width="200px;" alt="Unsplash" />
      </a>
      <br />
      <b>Unsplash</b>
      <br />
      <a href="https://unsplash.com/">https://unsplash.com/</a>
      <br />
      <p width="200px">
        The internet’s source for visuals.<br/>
        Powered by creators everywhere.
    </td>
  </tr>
</table>

# Installation

To install the stable version:

```
npm install fp-ts
```

Make sure to always have a single version of `fp-ts` installed in your project. Multiple versions are known to cause `tsc` to hang during compilation. You can check the versions currently installed using `npm ls fp-ts` (make sure there's a single version and all the others are marked as `deduped`).

## TypeScript compatibility

**Strictness** – This library is conceived, tested and is supposed to be consumed by TypeScript with the `strict` flag turned on.

| `fp-ts` version | required `typescript` version |
| --------------- | ----------------------------- |
| 2.0.x+          | 3.5+                          |
| 1.15.x+         | 3.1+                          |
| <= 1.14.4       | 2.8+ (\*)                     |

(\*) If you are running `< typescript@3.0.1` you have to polyfill the `unknown` type. You can use [unknown-ts](https://github.com/gcanti/unknown-ts) as a polyfill.

# Documentation

**Disclaimer**. Teaching functional programming is out of scope of this project, so the documentation assumes you already know what FP is.

- [Docs](https://gcanti.github.io/fp-ts)
- [Learning Resources](https://gcanti.github.io/fp-ts/learning-resources/)
- [Ecosystem](https://gcanti.github.io/fp-ts/ecosystem/)
- API Reference
  - [version 2.x (current)](https://gcanti.github.io/fp-ts/modules/)
  - [version 1.x](https://github.com/gcanti/fp-ts/tree/1.x/docs/modules/)

# Help

If you need help with `fp-ts` check out:

- this [Discord server](https://discord.gg/HVWmBBXM8A)
- the `#fp-ts` channel on [FP slack](https://fpslack.com/).

# Development

- [Code conventions](https://gcanti.github.io/fp-ts/guides/code-conventions)

# License

The MIT License (MIT)
