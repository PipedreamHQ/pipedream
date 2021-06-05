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

### Example workflow - use `$checkpoint` to increment a number

Often, you'll want to track the count of events a workflow processes, or keep track of some incrementing ID that you can pass to other systems as a unique identifier for an event.

[This workflow](https://pipedream.com/@dylburger/increment-a-number-stored-in-checkpoint-p_aNCYbM/edit) stores an ID in `$checkpoint`, incrementing the ID each time the workflow is run. The first time the workflow runs, the value of `$checkpoint` will be `undefined`, so the workflow initializes the ID to a value of `1` on the first run. Subsequent runs of the workflow continue to increment the value of `$checkpoint`, saving the new value back to `$checkpoint` for the next invocation:

```javascript
// Immediately read the current value of $checkpoint and increment it
// If this is the first time you're running the workflow, $checkpoint
// will be undefined, so we initialize the value to 1.
const checkpoint = $checkpoint + 1 || 1;
console.log(checkpoint);

// Write the new value of checkpoint back to $checkpoint for the next workflow run
$checkpoint = checkpoint;
```

### Example workflow - dedupe incoming data

`$checkpoint` is frequently used to dedupe incoming data. For example, you might receive events via webhooks and encounter duplicate HTTP requests (tied to the same user taking the same action in the source system). You need a way to make sure you don't process the same request twice.

[This workflow](https://pipedream.com/@dylburger/dedupe-based-on-incoming-key-exit-early-if-we-ve-seen-this-key-before-p_brCyAy/edit) shows you how this works. It keeps track of `emails` seen so far, retrieved from `event.body.email` in the incoming HTTP request (here, the email address is a unique identifier we're using to dedupe requests, but you can use any identifier). If we've seen a particular email address before, we exit early:

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

## Resetting or changing the value of `$checkpoint`

If you'd like to remove all of the data for `$checkpoint` or a step-specific `$checkpoint` variable, or set `$checkpoint` to a specific value, you can do so through the UI, or using a Node.js code step.

### Resetting or changing `$checkpoint` from the UI

To reset the value of `$checkpoint`, visit your [workflow's Settings](/workflows/settings/), find your [Current checkpoint data](/workflows/settings/#current-checkpoint-values) and press the **Clear** button next to the variable whose data you'd like to clear:

<div>
<img alt="Clear $checkpoint data" src="./images/clear-checkpoint.png">
</div>

This will set the value of `$checkpoint` to `undefined`.

You can also add any JSON-serializable data to the `$checkpoint` editor, modifying or overwriting its current value.

### Resetting or changing `$checkpoint` from code

To reset the value of `$checkpoint`, [add a new Node.js code step](/workflows/steps/code/#adding-a-code-step) to your workflow, just below the trigger step. Then add the following code to that step:

```javascript
$checkpoint = undefined;
$end("Clearing $checkpoint");
```

This will set the value of `$checkpoint` to `undefined`, and then immediately end your workflow.

You can also set `$checkpoint` to any JSON-serializable value:

```javascript
$checkpoint = { test: "data" };
$end("Initializing $checkpoint");
```

## Limits

You can store up to 64KB of data in both `$checkpoint` and step-specific `this.$checkpoint` state.

<Footer />
