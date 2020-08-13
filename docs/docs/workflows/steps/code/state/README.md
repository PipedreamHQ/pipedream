# Workflow state

Sometimes you need to save state in one invocation of a workflow and read it the next time your workflow runs. For example, you might need to keep track of the last ID of the item you processed, or the last timestamp you ran a job, so you can pull new data the next time.

On Pipedream, you can save and read state in two ways:

- On a **workflow-level**, using `$checkpoint`
- On a **step-level**, using `this.$checkpoint`

If you need to manage state _across_ workflows, we recommend you use a database or key-value store like [KVdb](https://kvdb.io).

[[toc]]

## Workflow-level state: `$checkpoint`

The `$checkpoint` variable allows you to store and access any data within a specific workflow. You can store any [JSON-serializable](https://stackoverflow.com/a/3316779/10795955) data in `$checkpoint`, like so:

```javascript
$checkpoint = {
  lastExecutionTime: "2019-10-06T20:07:39.293Z",
  lastObjectProcessed: {
    id: 123,
  },
};
```

You don't need to store data in an object — numbers, strings, and other JavaScript native types are JSON-serializable, as well. If you just need to keep track of a single ID in `$checkpoint`, store its value directly in `$checkpoint`:

```javascript
$checkpoint = 1;
```

This will store the number `1`, as a value of type `Number`. To store IDs as a strings, set the value to a string:

```javascript
$checkpoint = "1";
```

You can read data previously saved in `$checkpoint` like so:

```javascript
if ($checkpoint) {
  console.log($checkpoint);
}
```

### Example workflow

`$checkpoint` is frequently used to dedupe incoming data. For example, you might receive events via webhooks and encounter duplicate HTTP requests (tied to the same user taking the same action in the source system). You need a way to make sure you don't process the same request twice.

[This workflow](https://pipedream.com/@dylburger/dedupe-based-on-incoming-key-exit-early-if-we-ve-seen-this-key-before-p_brCyAy/edit) shows you how this works. It keeps track of `emails` seen so far, retrieved from `event.body.email` in the incoming HTTP request (here, the email address is a unique identifer we're using to dedupe requests, but you can use any identifier). If we've seen a particular email address before, we exit early:

```javascript
const get = require("lodash.get");
const includes = require("lodash.includes");
const MAX_LENGTH = 10000;

// Retrieve emails stored in $checkpoint
const emails = get($checkpoint, "emails", []);

// and grab the key to dedupe in, from the event body
const { email } = event.body;

if (includes(emails, email)) {
  $end("Email already seen. Exiting early");
}
```

Otherwise, we store the new email address in `$checkpoint.emails` and move on:

```javascript
// Store new emails back in $checkpoint
emails.push(email);
$checkpoint = {
  emails,
};
```

Note that this workflow also includes code to trim the array of emails we've stored in `$checkpoint.emails`, ensuring we only store the last 10,000 emails seen. This ensures we keep `$checkpoint` under the [size limits](#limits).

### Errors you might encounter

**`$checkpoint` holds a value of `undefined` when you first create a workflow**. If you try to run code like this:

```javascript
$checkpoint.test = "value";
```

you'll encounter an error — `TypeError: Cannot set property 'test' of undefined` — because you cannot set a property on an `undefined` value.

This means **you'll need to initialize `$checkpoint` before you can use it, and handle the case where `$checkpoint` is undefined in your code**.

### Other Notes

`$checkpoint` is a global variable, accessible in any code or action step.

`$checkpoint` is scoped to a workflow. Any data you save in `$checkpoint` is specific to that workflow. Saving data to `$checkpoint` in one workflow will not affect the data saved in `$checkpoint` in another.

## Step-level state: `this.$checkpoint`

Often, a specific step needs to maintain state that isn't relevant for the rest of the workflow. If you're writing a code step that pulls tweets from Twitter, and want to keep track of the last tweet ID you processed, you can store that state within a step, instead of using the global `$checkpoint` variable. This can make state easier to manage, and introduce fewer bugs.

Within a step, you can store any [JSON-serializable](https://stackoverflow.com/a/3316779/10795955) data in `this.$checkpoint`:

```javascript
this.$checkpoint = {
  lastExecutionTime: "2019-10-06T20:07:39.293Z",
  lastObjectProcessed: {
    id: 123,
  },
};
```

`this.$checkpoint` is scoped to a step, and `$checkpoint` is scoped to a workflow. But their programming API is equivalent: they both start out with values of `undefined`, they both store JSON-serializable data, etc.

## Limits

You can store up to 64KB of data in both `$checkpoint` and step-specific `this.$checkpoint` state.

<Footer />
