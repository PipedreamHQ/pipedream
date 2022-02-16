# Writing Node.js in Steps

Pipedream supports [Node.js v{{$site.themeConfig.NODE_VERSION}}](https://nodejs.org/).



**Anything you can do with Node.js, you can do in a workflow**. This includes using most of [npm's 400,000+ packages](#using-npm-packages).



JavaScript is one of the [most used](https://insights.stackoverflow.com/survey/2019#technology-_-programming-scripting-and-markup-languages) [languages](https://github.blog/2018-11-15-state-of-the-octoverse-top-programming-languages/) in the world, with a thriving community and [extensive package ecosystem](https://www.npmjs.com). If you work on websites and know JavaScript well, Pipedream makes you a full stack engineer. If you've never used JavaScript, see the [resources below](#new-to-javascript).

::: tip
It's important to understand the core difference between Node.js and the JavaScript that runs in your web browser: **Node doesn't have access to some of the things a browser expects, like the HTML on the page, or its URL**. If you haven't used Node before, be aware of this limitation as you search for JavaScript examples on the web.
:::

## Adding a code step

1. Click the **+** button below any step of your workflow.
2. Select the option to **Run custom code**.
3. Select the `nodejs14.x` runtime.

You can add any Node.js code in the editor that appears. For example, try:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    console.log('This is Node.js code');
    $.export('test', 'Some test data');
    return 'Test data';
  }
});
```

Code steps use the same editor ([Monaco](https://microsoft.github.io/monaco-editor/)) used in Microsoft's [VS Code](https://code.visualstudio.com/), which supports syntax highlighting, automatic indentation, and more.

## Passing props to code steps

You can make code steps reusable by allowing them to accept props. Instead of hard-coding the values of variables within the code itself, you can pass them to the code step as arguments or parameters _entered in the workflow builder_.

For example, let's define a `firstName` prop. This will allow us to freely enter text from the workflow builder.

```javascript
export default defineComponent({
  props: {
    firstName: {
      type: 'string',
      label: 'Your first name',
      default: 'Dylan',
    }
  },
  async run({ steps, $ }) {
    console.log(`Hello ${this.firstName}, congrats on crafting your first prop!`);
  }
});
```

The workflow builder now can accept text input to populate the `firstName` to this particular step only:

<div>
  <img alt="Workflow builder displaying the input visually as a text input field" src="./images/user-input-props-example.png" width="740px" />
</div>

Accepting a single string is just one example, you can build a step to accept arrays of strings through a dropdown presented in the workflow builder.

[Read the props reference for the full list of options](/components/api/#props).

## How Pipedream Node.js components work

When you add a new Node.js code step or use the examples in this doc, you'll notice a common structure to the code:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
      // this Node.js code will execute when the step runs
  }
});
```

This defines [a Node.js component](/components/api/). Components let you:

- Pass input to steps using [props](/code/nodejs/#passing-props-to-code-steps)
- [Connect an account to a step](/connected-accounts/#from-a-code-step)
- [Issue HTTP responses](/workflows/steps/triggers/#customizing-the-http-response)
- Perform workflow-level flow control, like [ending a workflow early](#ending-a-workflow-early)

When the step runs, Pipedream executes the `run` method:

- Any asynchronous code within a code step [**must** be run synchronously](/workflows/steps/code/async/), using the `await` keyword or with a Promise chain, using `.then()`, `.catch()`, and related methods.
- Pipedream passes the `steps` variable to the run method. `steps` is also an object, and contains the [data exported from previous steps](/workflows/steps/#step-exports) in your workflow.
- You also have access to the `$` variable, which gives you access to methods like `$.respond`, `$.export`, [and more](/components/api/#actions).

If you're using [props](/code/nodejs/#passing-props-to-code-steps) or [connect an account to a step](/connected-accounts/#from-a-code-step), the component exposes them in the variable `this`, which refers to the current step:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // `this` refers to the running component. Props, connected accounts, etc. are exposed here
    console.log(this)
  }
});
```

When you [connect an account to a step](/connected-accounts/#from-a-code-step), Pipedream exposes the auth info in the variable [`this.appName.$auth`](/workflows/steps/code/auth/#the-auths-object).

## Logs

You can call `console.log` or `console.error` to add logs to the execution of a code step. 

These logs will appear just below the associated step. `console.log` messages appear in black, `console.error` in red.

### `console.dir`

If you need to print the contents of JavaScript objects, use `console.dir`:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    console.dir({
      name: "Luke"
    })
  }
});
```

## Syntax errors

Pipedream will attempt to catch syntax errors when you're writing code, highlighting the lines where the error occurred in red.

::: warning
While you can save a workflow with syntax errors, it's unlikely to run correctly on new events. Make sure to fix syntax errors before running your workflow.
:::

## Using `npm` packages

[npm](https://www.npmjs.com/) hosts JavaScript packages: bits of code someone else has written and packaged for others to use. npm has over 400,000 packages and counting. You can use most of those on Pipedream.

### Just `import` it

To use an npm package in a code step, simply `import` it:

```javascript
import axios from "axios";
```

If a package only supports the [CommonJS module format](https://nodejs.org/api/modules.html), you may have to `require` it:

```javascript
const axios = require("axios");
```

**Within a single step, you can only use `import` or `require` statements, not both**. See [this section](#require-is-not-defined) for more details.

When Pipedream runs your workflow, we download the associated npm package for you before running your code steps.

If you've used Node before, you'll notice there's no `package.json` file to upload or edit. We want to make package management simple, so just `import` or `require` the module like you would in your code, after package installation, and get to work.

The core limitation of packages is one we described above: some packages require access to a web browser to run, and don't work with Node. Often this limitation is documented on the package `README`, but often it's not. If you're not sure and need to use it, we recommend just trying to `import` or `require` it.

Moreover, packages that require access to large binaries — for example, how [Puppeteer](https://pptr.dev) requires Chromium — may not work on Pipedream. If you're seeing any issues with a specific package, please [let us know](https://pipedream.com/support/).

### CommonJS vs. ESM imports

In Node.js, you may be used to importing third-party packages using the `require` statement:

```javascript
const axios = require("axios");
```

In this example, we're including the `axios` [CommonJS module](https://nodejs.org/api/modules.html) published to npm. You import CommonJS modules using the `require` statement.

But you may encounter this error in workflows:

`Error Must use import to load ES Module`

This means that the package you're trying to `require` uses a different format to export their code, called [ECMAScript modules](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules) (**ESM**, or **ES modules**, for short). With ES modules, you instead need to `import` the package:

```javascript
import got from 'got';
```

Most package publish both CommonJS and ESM versions, so **if you always use `import`, you're less likely to have problems**. In general, refer to the documentation for your package for instructions on importing it correctly.

### `require` is not defined

This error means that you cannot use CommonJS and ESM imports in the same step. For example, if you run code like this:

```javascript
import fetch from 'node-fetch';
const axios = require("axios")
```

your workflow will throw a `require is not defined` error. There are two solutions:

1. Try converting your CommonJS `require` statement into an ESM `import` statement. For example, convert this:

```javascript
const axios = require("axios")
```

to this:

```javascript
import axios from "axios"
```

2. If the `import` syntax fails to work, separate your imports into different steps, using only CommonJS requires in one step, and only ESM imports in another.

## Variable scope

Any variables you create within a step are scoped to that step. That is, they cannot be referenced in any other step.

Within a step, the [normal rules of JavaScript variable scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) apply.

**When you need to share data across steps, use [step exports](/workflows/steps/).**

## Making HTTP requests from your workflow

There are two ways to make HTTP requests in code steps:

- Use any HTTP client that works with Node.js. [See this example guide for how to use `axios` to make HTTP requests](/workflows/steps/code/nodejs/http-requests/).
- [Use `$send.http()`](/destinations/http/#using-send-http-in-workflows), a Pipedream-provided method for making asynchronous HTTP requests.

In general, if you just need to make an HTTP request but don't care about the response, [use `$send.http()`](/destinations/http/#using-send-http-in-workflows). If you need to operate on the data in the HTTP response in the rest of your workflow, [use `axios`](/workflows/steps/code/nodejs/http-requests/).

## Returning HTTP responses

You can return HTTP responses from [HTTP-triggered workflows](/workflows/steps/triggers/#http) using the [`$.respond()` function](/workflows/steps/triggers/#customizing-the-http-response).

## Managing state

In Node.js (Javascript) code steps, you can also store and retrieve data in code steps.

This is very useful for tracking data between runs of a particular workflow.

:::warning
This functionality (`$.service.db`) is limited to only Node.js code steps at this time.

Other step languages like [Python](/code/python/), [Bash](/code/bash/) and [Go](/code/go/) do not have this feature available yet.

For more information on what functionality is available for those languages, please refer to their documentation.
:::

### Injecting the database

By default, Node.js steps don't have access to the database service. It needs to be injected by defining it as a `prop`. 

```javascript
export default defineComponent({
  props: {
    // Define that the "db" variable in our component is a database
    db: "$.service.db",
  },
  async run({ steps, $ }) {
    // Now we can access the database at "this.db"
    this.db.set("name", "Dylan")
  }
});
```

:::tip
`props` injects variables under `this` scope in components.

In the above example we essentially instructed that this step needs the database injected into the `this.db` prop. 
:::

### Using the database

Once you inject the database into the component, you can use it to both store (`set`) and retrieve (`get`) data.

### Saving data

You can save data with the in-step database using the `set` method.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    // Store a timestamp each time this step is executed in the workflow
    this.db.set('lastRanAt', new Date());
  },
})
```

### Retrieving data

You can retrieve data with the in-step database using the `get` method.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    // Retrieve the timestamp representing last time this step executed
    const lastRanAt = this.db.get('lastRanAt'); 
  },
})
```

### Workflow counter example

For example, if you'd like to set up a counter to count the number of times the workflow executes.

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    // By default, all database entries are undefined.
    // It's wise to set a default value so our code as an initial value to work with
    const counter = this.db.get('counter') ?? 0;
    
    // On the first run "counter" will be 0 and we'll increment it to 1
    // The next run will increment the counter to 2, and so forth
    this.db.set('counter', counter + 1);
  },
})
```

### Dedupe data example

This database is also useful for storing data from prior runs to prevent acting on duplicate data, or data that's been seen before.

For example, this workflow's trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:

```javascript
export default defineComponent({
  props: {
    "db": "$.service.db",
  },
  async run({ steps, $ }) {
    const email = steps.trigger.body.new_customer_email;
    // Retrieve the past recorded emails from other runs
    const emails = this.db.get('emails') ?? [];

    // If the current email being passed from our webhook is already in our list, exit early
    if(emails.includes(email)) {
      return $.flow.exit('Already welcomed this user');
    }

    // Add the current email to the list of past emails so we can detect it in the future runs
    this.db.set('emails', [...emails, email]);
  },
})
```

### `$.service.db` limitations

The `$.service.db` is only currently available in Node.js code steps. It is not yet available in other languages like Go, bash or Python.

In addition, `$.service.db` can hold up to {{ $site.themeConfig.SERVICE_DB_SIZE_LIMIT }} per step.


## Ending a workflow early

Sometimes you want to end your workflow early, or otherwise stop or cancel the execution or a workflow under certain conditions. For example:

- You may want to end your workflow early if you don't receive all the fields you expect in the event data.
- You only want to run your workflow for 5% of all events sent to your source.
- You only want to run your workflow for users in the United States. If you receive a request from outside the U.S., you don't want the rest of the code in your workflow to run.
- You may use the `user_id` contained in the event to look up information in an external API. If you can't find data in the API tied to that user, you don't want to proceed.

**In any code step, calling `return $.flow.exit()` will end the execution of the workflow immediately.** No remaining code in that step, and no code or destination steps below, will run for the current event.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    return $.flow.exit();
    console.log("This code will not run, since $.flow.exit() was called above it");
  }
});
```

You can pass any string as an argument to `$.flow.exit()`:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    return $.flow.exit("End message");
  }
});
```

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Flip a coin, running $.flow.exit() for 50% of events
    if (Math.random() > 0.5) {
      return $.flow.exit();
    }
    console.log("This code will only run 50% of the time");
  }
});
```

## Errors

[Errors](https://nodejs.org/dist/latest-v10.x/docs/api/errors.html#errors_errors) raised in a code step will stop the execution of code or destinations that follow.

## Using secrets in code

Workflow code is private. Still, we recommend you don't include secrets — API keys, tokens, or other sensitive values — directly in code steps.

Pipedream supports [environment variables](/environment-variables/) for keeping secrets separate from code. Once you create an environment variable in Pipedream, you can reference it in any workflow using `process.env.VARIABLE_NAME`. The values of environment variables are private.

See the [Environment Variables](/environment-variables/) docs for more information.

## Limitations of code steps

Code steps operate within the [general constraints on workflows](/limits/#workflows). As long as you stay within those limits and abide by our [acceptable use policy](/limits/#acceptable-use), you can add any number of code steps in a workflow to do virtually anything you'd be able to do in Node.js.

If you're trying to run code that doesn't work or you have questions about any limits on code steps, [please reach out](https://pipedream.com/support/).

## Editor settings

We use the [Monaco Editor](https://microsoft.github.io/monaco-editor/), which powers VS Code and other web-based editors.

We also let you customize the editor. For example, you can enable Vim mode, and change the default tab size for indented code. Visit your [**Settings**](https://pipedream.com/settings) to modify these settings.

## Keyboard Shortcuts

We use the [Monaco Editor](https://microsoft.github.io/monaco-editor/), which powers VS Code. As a result, many of the VS Code [keyboard shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings) should work in the context of the editor.

For example, you can use shortcuts to search for text, format code, and more.

## New to JavaScript?

We understand many of you might be new to JavaScript, and provide resources for you to learn the language below.

When you're searching for how to do something in JavaScript, some of the code you try might not work in Pipedream. This could be because the code expects to run in a browser, not a Node.js environment. The same goes for [npm packages](#using-npm-packages).

### I'm new to programming

Many of the most basic JavaScript tutorials are geared towards writing code for a web browser to run. This is great for learning — a webpage is one of the coolest things you can build with code. We recommend starting with these general JavaScript tutorials and trying the code you learn on Pipedream:

- [JavaScript For Cats](http://jsforcats.com/)
- [Mozilla - JavaScript First Steps](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps)
- [StackOverflow](https://stackoverflow.com/) operates a programming Q&A site that typically has the first Google result when you're searching for something specific. It's a great place to find answers to common questions.

### I know how to code, but don't know JavaScript

- [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [MDN language overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Eloquent Javascript](https://eloquentjavascript.net/)
- [Node School](https://nodeschool.io/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
