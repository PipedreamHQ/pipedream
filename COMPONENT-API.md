## Component API

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

### `name`

The name of the component, a **string** which identifies components deployed to user's accounts.

This name will show up in the Pipedream UI, in CLI output (for example, from `pd list` commands), etc.

If the user deploys a component to their account, but a component with that name already exists, the component will be named using an incrementing integer suffix. For example, if you deploy a component with the name `my-component` twice, the second deployed component will be named `my-component-1`.

#### Constraints

Names of components should match the following pattern:

```text
[a-zA-Z0-9-_]+
```

For example, `my-awesome-component` and `my_2nd_great_component` are valid names, but `Hello, World!` is not.

Names that don't match this pattern will be "slugified" when a user deploys the component, replacing invalid characters to fit the pattern's constraints. Users will see the slugified name when listing components deployed to their account. For example, a name of `Hello, World!` will get converted to `hello-world`.

### `version`

The version of a component, a **string**.

There are no constraints on the version, but consider using [semantic versioning](https://semver.org/).

### `run` method

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

### Referencing `this`

`this` refers to the component, and provides access to [props](#props), [methods](#methods), and Pipedream-provided functions like `this.$emit`.

#### Referencing props

Props can be accessed using `this.<prop-name>`. For example, a `secret` prop:

```javascript
props: {
  secret: "string"
},
```

can be referenced using `this.secret`

#### Referencing methods

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

### Interfaces

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

#### `$.interface.http`

Interfaces are **attached** to components via props. To use the HTTP interface, declare a prop whose value is the string `$.interface.http`:

```javascript
props: {
  http: "$.interface.http"
},
```

Since you control the name of props in your component, you can name the prop anything you'd like. The example just uses the name `http` for clarity.

With this prop declaration, a unique HTTP endpoint URL will be created for this component on deploy.

##### Methods on the HTTP interface

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

#### `$.interface.timer`

### `props`

### `methods`

### `this.$emit`

### `$.service.db`

#### `set` method

#### `get` method

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
