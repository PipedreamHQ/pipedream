# ⚠️ DEPRECATED - @pipedream/sdk v1.x

> **This package (v1.x) is deprecated and only receives critical security patches.**
>
> **Please upgrade to @pipedream/sdk v2.x or later.**
The latest SDK code lives in
[this](https://github.com/PipedreamHQ/pipedream-sdk-typescript)
repository.

---

TypeScript SDK for [Pipedream](https://pipedream.com). [See the
docs](https://pipedream.com/docs/connect) for usage instructions.

## Install

```bash
npm i @pipedream/sdk
```

## Quickstart

The [quickstart](https://pipedream.com/docs/connect/quickstart) is the easiest
way to get started with the SDK and Pipedream Connect.

## Usage

[See the SDK docs](https://pipedream.com/docs/connect) for full usage
instructions and examples for each method.

## Example App

Clone and run the [example
app](https://github.com/PipedreamHQ/pipedream-connect-examples/) to get started.

## Importing the Client

You can import the SDK from the root package name, and it will automatically
load the appropriate code depending on the environment (e.g. Node.js server,
browser, etc.).

### CommonJS Modules

```javascript
const { createClient } = require("@pipedream/sdk");
```

### ES Modules

```javascript
import { createClient } from "@pipedream/sdk";
```

### Browser

```javascript
import { createClient } from "@pipedream/sdk";
```
