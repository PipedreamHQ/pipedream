# Component API

**This API is in preview and subject to change without notice. We make a best effort to update this doc as we make changes to the API, but please raise an issue or PR in this repo if you notice something out-of-date.**

The component API borrows concepts and structure from frontend components, like those in [Vue.js](https://vuejs.org/) or [React](https://reactjs.org/).

Components are Node.js modules that export an object with the following properties:

```javascript
module.exports = {
  name: "cronjob", // required
  version: "0.0.1", // required
  props,
  methods,
  run(event) {
    console.log("Run any Node.js code here");
  }
};
```

Components accept input via [props](#props), and can define [methods](#methods).

## `name`

The name of the component, a **string** which identifies components deployed to user's accounts.

This name will show up in the Pipedream UI, in CLI output (for example, from `pd list` commands), etc.

### Name slugs

Each time a user deploys a component to their account, a **name slug** is also generated, based on the name provided. Name slugs are composed of shell-safe characters, so you can reference the component by name slug in the CLI and other environments.

For example, a name of `Hello, World!` will generate a name slug of `hello-world`.

The name, as provided in the `name` property of the component, still appears in the Pipedream UI for the component. This lets you provide a human-readable name with any special characters you'd like. The name slug is displayed beside the name, which you can use to interact with the component programmatically.

If the user deploys a component to their account, but a component with that name slug already exists, the component will be named using an incrementing integer suffix. For example, if you deploy a component with the name `my-component` twice, the second deployed component will be named `my-component-1`.

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

You can reference `this` within the `run` method. `this` refers to the component, and provides access to [props](#props), [methods](#methods), and Pipedream-provided functions like `this.$emit`.

You can view logs produced by the `run` method in the **LOGS** section of the Pipedream UI for the component, or using the `pd logs` CLI command:

```bash
pd logs <deployed-component-name>
```

If the `run` method emits events using `this.$emit`, you can access the events in the **EVENTS** section of the Pipedream UI for the component, or using the `pd events` CLI command:

```bash
pd events <deployed-component-name>
```

## Referencing `this`

`this` refers to the component, and provides access to [props](#props), [methods](#methods), and Pipedream-provided functions like `this.$emit`.

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

Interfaces make it possible to work with HTTP servers or scheduled tasks using nothing more than props. Once you declare the interface for your component, Pipedream creates the infrastructure for that component when it's deployed. For example, if you deploy a component that uses the HTTP interface, Pipedream creates a unique HTTP endpoint URL for that component. HTTP requests to that endpoint invoke the component, executing its `run` method.

Interfaces also provide methods. For example, the HTTP interface exposes a `respond` method that lets your component issue HTTP responses:

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

You'll see how to declare the props for each interface, and how to use their methods, below.

### `$.interface.http`

Interfaces are **attached** to components via [props](#props). To use the HTTP interface, declare a prop whose value is the string `$.interface.http`:

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

## `props`

Props allow components to accept input at deploy time. When deploying a component, users will be prompted to enter values for these props, setting the behavior of the component accordingly. **Props make components reusable**.

Props can be accessed within the `run` method, or within any [methods](#methods) defined by the component.

Props can be accessed using `this.<prop-name>`. For example, a `secret` prop:

```javascript
props: {
  secret: "string"
},
```

can be referenced using `this.secret`.

### Example

See the [`http-require-secret`](https://github.com/PipedreamHQ/pipedream/blob/master/apps/http/http-require-secret.js) component for an example of how to reference props. That component accepts a `secret` prop, which it uses in the `run` method to validate that HTTP requests contain that secret.

## `methods`

You can define helper functions within the `methods` property of your component. You have access to these functions within the `run` method, or within other methods.

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

Within your `run` function, pass the data you'd like to emit to the `this.$emit` function:

```javascript
this.$emit({
  name: "Luke Skywalker"
});
```

Each time you run `this.$emit()`, you emit the data as an **event**.

### Retrieving events programmatically

Events can be retrieved using the [REST API](https://docs.pipedream.com/api/reference/#get-source-events), [CLI](https://docs.pipedream.com/cli/reference/#pd-events), [or SSE stream tied to your cron job](https://docs.pipedream.com/event-sources/consuming-events/#sse). For example, you can use the CLI to retrieve the last 10 events:

```bash
λ pd events -n 10 <source-name>
{ name: "Luke Skywalker" }
{ name: "Leia Organa" }
{ name: "Han Solo" }
```

This makes it easy to retrieve data processed by your component from another app. Typically, you'll want to use the [REST API](https://docs.pipedream.com/api/reference/#get-source-events) to retrieve events in batch, and connect to the [SSE stream](https://docs.pipedream.com/event-sources/consuming-events/#sse) to process them in real time.

## `$.service.db`

`$.service.db` provides access to a simple, workflow-specific key-value store.

Like with [interfaces](#interfaces), you attach `$.service.db` via props:

```javascript
props: {
  db: "$.service.db";
}
```

Then, within the `run` handler and `methods`, you have access to the `db` prop using `this.db`.

Since you control the name of props in your component, you can name the prop anything you'd like. The example here and below use the name `db` for clarity.

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

## How components run

A component is triggered, or invoked, by events sent its interface.

For example, a component configured to accept HTTP requests using `$.interface.http` runs on each HTTP request sent to its endpoint URL.

A component using `$.interface.timer` runs according to its schedule.

Each time a component is invoked, its `run` method is called. You can view logs produced by this method in the **LOGS** section of the Pipedream UI for the component, or using the `pd logs` CLI command:

```bash
pd logs <deployed-component-name>
```

If the `run` method emits events using `this.$emit`, you can access the events in the **EVENTS** section of the Pipedream UI for the component, or using the `pd events` CLI command:

```bash
pd events <deployed-component-name>
```
