# `$event`

When you select an event from the [Inspector](/workflows/events/inspect/), you can see its contents in the **`$event`** tab attached to your source.

`$event` ("dollar event") is a JavaScript object that contains the event that triggered your workflow, formatted here for easy inspection.

For [HTTP sources](/workflows/steps/triggers/#http), `$event` contains data from the HTTP request and Pipedream-provided metadata. For example, `$event.body` contains the HTTP payload; `$event.headers` contains the HTTP request headers.

For [Cron triggers](/workflows/steps/triggers/#cron-scheduler), `$event` contains the schedule of your cron job and the time the current job was triggered.

**You can save any data in the `$event` object in a code or an action. This allows you to share data across the steps of your workflow.** [Just save the data as a new property of `$event`](https://docs.pipedream.com/notebook/dollar-event/#modifying-event), or change the value of an existing property, referencing it in a later step.

`$event` is a global variable. You can access or mutate it in any [code](/workflows/steps/code/) or [action](/workflows/steps/actions/) steps of your workflow.

[[toc]]

## Referencing `$event` in code steps

In Node.js code steps, **`$event` is a [JavaScript object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics#Object_basics)**. This is just a collection of key-value pairs surrounded by curly braces — {} — like so:

```
{
    age: 50,
    name: {
        first: "Luke",
        last: "Skywalker",
    }
}
```

Every key — for example `age` — has an associated value (here, the number 50). In JavaScript, the value of a key can be an object itself, like `name` above.

Within a code cell, you can reference the data in `$event` like you would any other JavaScript object, using [dot-notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties).

```javascript
// Prints "Luke"
console.log($event.name.first);
// Prints "Skywalker"
console.log($event.name.last);
```

## Shape / Contents

The initial contents of `$event` differ depending on the source you've chosen for your workflow.

Clicking on an event in the Inspector reveals the contents of `$event` for that workflow execution under the [source](/workflows/steps/triggers/) to the right:

<div>
<img alt="Dollar event under source" src="./images/complex-dollar-event.png">
</div>

## Copying the dot-notation path to a specific value

When you send an event with a complex shape to a workflow, it can be difficult to construct the correct dot-notation to access a specific value from `$event`. For example, in this example below:

<div>
<img alt="Complex dollar event" src="./images/complex-dollar-event.png">
</div>

if I want to get the name of the homeworld of the person, I've got to scan down many levels of nested objects to construct `$event.body.person.homeworld.name`.

**Instead, I can find the property I'm interested in, hold the `Cmd` or `Windows` key, and click. This will copy the dot-notation path to that property to my clipboard.**

<div>
<img alt="Cmd click to get dot-notation" src="./images/cmd-click-to-get-path.png">
</div>

## Modifying `$event`

Any changes you make to `$event` persist across code steps. Typically, we scope variables to the step they were created in, so you wouldn't have access to a variable outside of that step. **Any data you need to use across steps should be stored in properties of `$event`**.

You can add, delete, or update the value of any key in `$event`:

```javascript
// Add a new key-value pair
$event.currentTimestamp = +new Date();
// Delete a key-value pair
delete $event.url;
// Update a value of an existing key
$event.body.person.job = "Retired Jedi";
```

If you modify `$event`, we'll also display the changes you made clearly below the step, under the **Diff** header:

<div>
<img alt="Dollar event diff" width="450" src="./images/diff.png">
</div>

## Restrictions

You cannot completely re-assign the value of the `$event` variable. That is, you cannot do this:

```javascript
$event = { prop: "value" };
```

<Footer />
