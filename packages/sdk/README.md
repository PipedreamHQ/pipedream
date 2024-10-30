# `@pipedream/sdk`

TypeScript SDK for [Pipedream](https://pipedream.com). [See the docs](https://pipedream.com/docs/connect) for usage instructions.

## Install

```bash
npm i @pipedream/sdk
```

## Quickstart

The [quickstart](https://pipedream.com/docs/connect/quickstart) is the easiest way to get started with the SDK and Pipedream Connect.

## Usage

[See the SDK docs](https://pipedream.com/docs/connect) for full usage instructions and examples for each method.

## Example app

Clone and run the [example app](https://github.com/PipedreamHQ/pipedream-connect-examples/) to get started.

## Importing the clients in different environments

You can import the SDK from the root package name, and it will automatically load the appropriate code depending on the environment (Node.js or browser).

For CommonJS modules:

```javascript
const { createClient } = require("@pipedream/sdk");
```

For ES modules:

```javascript
import { createClient } from "@pipedream/sdk";
```

In browser environments:

```javascript
import { createClient } from "@pipedream/sdk";
```
