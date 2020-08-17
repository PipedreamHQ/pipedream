# Component API

**This API is in preview and subject to change without notice. We make a best effort to update this doc as we make changes to the API, but please raise an issue or PR in this repo if you notice something out-of-date.**

Pipedream components are Node.js modules that export an object with the following properties:

```javascript
module.exports = {
  name: "name", // required
  version: "0.0.1", // required
  props,
  methods,
  run(event) {
    console.log("Run any Node.js code here");
  }
};
```

The component API borrows concepts and structure from frontend components, like those in [Vue.js](https://vuejs.org/) or [React](https://reactjs.org/).

Components [run on Pipedream infrastructure](#how-components-run).

## Features

Component can:

- Accept input via [props](#props)
- Define [methods](#methods).
- [`require` any npm package](#using-npm-packages)
- Spin up Pipedream infrastructure, like HTTP servers and scheduled jobs, by declaring the correct [interfaces](#interfaces)
- Store and retrieve state using the [built-in key-value store](#servicedb)
- [Emit data](#thisemit) you process within the component, allowing you to access it outside of Pipedream via API.

## Reference

<!--ts-->

- [name](#name)
  - [Name slugs](#name-slugs)
- [version](#version)
- [run method](#run-method)
- [Referencing this](#referencing-this)
  - [Referencing props](#referencing-props)
  - [Referencing methods](#referencing-methods)
- [Interfaces](#interfaces)
  - [`$.interface.http`](#interfacehttp)
    - [Methods on the HTTP interface](#methods-on-the-http-interface)
  - [`$.interface.timer`](#interfacetimer)
- [props](#props)
  - [Example](#example)
- [methods](#methods)
- [`this.$emit`](#thisemit)
  - [How to emit events](#how-to-emit-events)
  - [Retrieving events programmatically](#retrieving-events-programmatically)
- [`$.service.db`](#servicedb)
  - [set method](#set-method)
  - [get method](#get-method)
- [Using npm packages](#using-npm-packages)
- [How components run](#how-components-run)

<!--te-->

## `name`

The name of the component, a **string** which identifies components deployed to users' accounts.

This name will show up in the Pipedream UI, in CLI output (for example, from `pd list` commands), etc.

### Name slugs

Each time a user deploys a component to their account, a **name slug** is also generated, based on the name provided. Name slugs are composed of shell-safe characters, so you can reference the component by name slug in the CLI and other environments.

For example, a name of `Hello, World!` will generate a name slug of `hello-world`.

The name, as provided in the `name` property of the component, still appears in the Pipedream UI for the component. This lets you declare a human-readable name with any special characters you'd like. The name slug is displayed beside the name, and you use the name slug to interact with the component programmatically.

If the user deploys a component to their account, but a component with that name slug already exists, the component will be named using an incrementing integer suffix. For example, if you deploy a component with the name `my-component` twice, the first deployed component will be named `my-component`, and the second deployed component will be named `my-component-1`.

## `version`

The version of a component, a **string**.

There are no constraints on the version, but consider using [semantic versioning](https://semver.org/).

## `run` method

Each time a component is [invoked](#how-components-run) (for example, via HTTP request), its `run` method is called.

The event that triggered the component is passed to `run`, so that you can access it within the method:

```javascript
async run(event) {
  console.log(event)
}
```

You can reference [`this`](#referencing-this) within the `run` method. `this` refers to the component, and provides access to [props](#props), [methods](#methods), and Pipedream-provided functions like [`this.$emit`](#thisemit).

You can view logs produced by the `run` method in the **LOGS** section of the Pipedream UI for the component, or using the `pd logs` CLI command:

```bash
pd logs <deployed-component-name>
```

If the `run` method emits events using `this.$emit`, you can access the events in the **EVENTS** section of the Pipedream UI for the component, or using the `pd events` CLI command:

```bash
pd events <deployed-component-name>
```

## Referencing `this`

`this` refers to the component, and provides access to [props](#props), [methods](#methods), and Pipedream-provided functions like [`this.$emit`](#thisemit).

### Referencing props

Props can be accessed using `this.<prop-name>`. For example, a `secret` prop:

```javascript
props: {
  secret: "string"
},
```

can be referenced using `this.secret`.

### Referencing methods

Methods can be accessed using `this.<method-name>`. For example, a `random` method:

```javascript
methods: {
  random() {
    return Math.random()
  },
}
```

can be run like so:

```javascript
const randomNum = this.random();
```

## Interfaces

Interfaces are infrastructure abstractions provided by the Pipedream platform. They declare how a component is invoked — via HTTP request, run on a schedule, etc. — and therefore define the shape of the events it processes.

Interfaces make it possible to work with HTTP servers or scheduled tasks using nothing more than props. Once you declare the interface for your component, Pipedream creates the infrastructure for that component when it's deployed. For example, if you deploy a component that uses the HTTP interface, Pipedream creates a unique HTTP endpoint URL for that component. HTTP requests to that endpoint invoke the component, executing its [`run` method](#run).

Interfaces can also provide methods. For example, the HTTP interface exposes a `respond` method that lets your component issue HTTP responses:

```javascript
// this.http references the HTTP interface for the component, as you'll see below
this.http.respond({
  status: 200,
  headers: {
    "X-My-Custom-Header": "test"
  },
  body: event // This can be any string, object, or Buffer
});
```

### `$.interface.http`

Interfaces are attached to components via [props](#props). To use the HTTP interface, declare a prop whose value is the string `$.interface.http`:

```javascript
props: {
  http: "$.interface.http"
},
```

Since you control the name of props in your component, you can name the prop anything you'd like. The example just uses the name `http` for clarity.

With this prop declaration, a unique HTTP endpoint URL will be created for this component on deploy.

#### Methods on the HTTP interface

The HTTP interface exposes a `respond` method that lets your component issue HTTP responses. Assuming the prop for your HTTP interface is named `http`:

```javascript
props: {
  http: "$.interface.http"
},
```

you can run `this.http.respond` to respond to the client:

```javascript
this.http.respond({
  status: 200,
  headers: {
    "X-My-Custom-Header": "test"
  },
  body: event // This can be any string, object, or Buffer
});
```

### `$.interface.timer`

Interfaces are attached to components via [props](#props). To use the timer interface, declare a prop whose value is the string `$.interface.timer`:

```javascript
props: {
  timer: {
    type: "$.interface.timer"
  }
},
```

Since you control the name of props in your component, you can name the prop anything you'd like. The example just uses the name `timer` for clarity.

On component deploy, you'll be prompted to select one of two schedule types, and asked to provide a value:

- `cron`, which accepts a [cron expression](https://crontab.guru/) (a string)
- `intervalSeconds`, which accepts the frequency of the job in seconds (an integer)

You can also specify the schedule type, and value, by explicitly including one of these params in the prop declaration:

```javascript
props: {
  timer: {
    type: "$.interface.timer"
    default: {
      cron: "0 0 * * *" // Run job once a day
    }
  }
},
```

```javascript
props: {
  timer: {
    type: "$.interface.timer"
    default: {
      intervalSeconds: 60 // Run job once a minute
    }
  }
},
```

## `props`

Props allow components to accept input at deploy time. When deploying a component, users will be prompted to enter values for these props, setting the behavior of the component accordingly. **Props make components reusable**.

Props can be accessed within the [`run` method](#run), or within any [methods](#methods) defined by the component.

Props can be accessed using `this.<prop-name>`. For example, a `secret` prop:

```javascript
props: {
  secret: "string"
},
```

can be referenced using `this.secret`.

### Example

See the [`http-require-secret`](https://github.com/PipedreamHQ/pipedream/blob/master/interfaces/http/examples/http-require-secret.js) component for an example of how to reference props. That component accepts a `secret` prop, which it uses in the `run` method to validate that HTTP requests contain that secret.

## `methods`

You can define helper functions within the `methods` property of your component. You have access to these functions within the [`run` method](#run), or within other methods.

Methods can be accessed using `this.<method-name>`. For example, a `random` method:

```javascript
methods: {
  random() {
    return Math.random()
  },
}
```

can be run like so:

```javascript
const randomNum = this.random();
```

## `this.$emit`

`this.$emit` is a Pipedream-provided function that allows you to **emit** data from your component. Emitted events appear in the **EVENTS** section of the UI for your source. You can also access these events programmatically, in your own app, using Pipedream APIs.

### How to emit events

Within your [`run` method](#run), pass the data you'd like to emit to the `this.$emit` function:

```javascript
this.$emit({
  name: "Luke Skywalker"
});
```

Each time you run `this.$emit()`, you emit the data as an **event**.

### Retrieving events programmatically

Events can be retrieved using the [REST API](https://docs.pipedream.com/api/rest/), [CLI](https://docs.pipedream.com/cli/reference/#pd-events), [or SSE stream tied to your component](https://docs.pipedream.com/api/sse/). For example, you can use the CLI to retrieve the last 10 events:

```bash
λ pd events -n 10 <source-name>
{ name: "Luke Skywalker" }
{ name: "Leia Organa" }
{ name: "Han Solo" }
```

This makes it easy to retrieve data processed by your component from another app. Typically, you'll want to use the [REST API](https://docs.pipedream.com/api/rest/) to retrieve events in batch, and connect to the [SSE stream](https://docs.pipedream.com/api/sse/) to process them in real time.

## `$.service.db`

`$.service.db` provides access to a simple, component-specific key-value store. It implements two methods: `set` and `get`.

Like with [interfaces](#interfaces), you attach `$.service.db` via [props](#props):

```javascript
props: {
  db: "$.service.db";
}
```

Then, within the [`run` handler](#run) and [`methods`](#methods), you have access to the `db` prop using `this.db`.

Since you control the name of props in your component, you can name the prop anything you'd like. The example here and below use the name `db` for clarity.

**The data you store in this DB is specific to your deployed component**.

### `set` method

```javascript
this.db.set("key", value);
```

Sets the value of a specific key.

### `get` method

```javascript
this.db.get("key");
```

Gets the value of a key. Returns `undefined` if the key doesn't exist.

## Using npm packages

To use an npm package in a component, just `require` it:

```javascript
const _ = require("lodash");
```

When you deploy a component, Pipedream downloads these packages and bundles them with your deployment. There's no need to include a `package.json` file with your component.

Some packages — for example, packages like [Puppeteer](https://pptr.dev/), which includes large dependencies like Chromium — may not work on Pipedream. Please [reach out](https://docs.pipedream.com/support/) if you encounter a specific issue.

## How components run

Components run on Pipedream infrastructure. You deploy components to Pipedream using the [Pipedream CLI](https://docs.pipedream.com/cli/reference/#pd-deploy), [API](https://docs.pipedream.com/api/rest/#overview), or [UI](https://pipedream.com/sources).

A component is triggered, or invoked, by events sent its [interface](#interfaces).

For example, a component configured to accept HTTP requests using [`$.interface.http`](#interfacehttp) runs on each HTTP request sent to its endpoint URL.

Each time a component is invoked, its [`run` method](#run) is called. You can view logs produced by this method in the **LOGS** section of the Pipedream UI for the component, or using the `pd logs` CLI command:

```bash
pd logs <deployed-component-name>
```

If the `run` method emits events using [`this.$emit`](#thisemit), you can access the events in the **EVENTS** section of the Pipedream UI for the component, or using the `pd events` CLI command:

```bash
pd events <deployed-component-name>
```
