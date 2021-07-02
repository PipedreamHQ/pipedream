# Changing how we reference `$event` and `$context`

## `$event` is now `event`

Historically, Pipedream provided data on the event that triggered your workflow in a variable called `$event`. `$event` was a JavaScript object. For HTTP-triggered workflows, for example, it contained properties like `body` to represent the body of the HTTP request, and `headers` for HTTP headers.

**Pipedream changed the name of this variable from `$event` to `event`**. Now, when you want to reference the HTTP payload, for example, you use `event.body` instead of `$event.body`. [Read about the full format of `event` here](/workflows/events/#event-format). 

`$event` was also mutable: you could add new properties or modify existing ones. This allowed you to add a property in one step and use that data in the next.

**`event` is _not_ mutable** — it's read-only. To share data across steps, [use step exports](/workflows/steps/#step-exports). For example, if you wanted to uppercase the `name` that arrived in the inbound HTTP request, you could do the following:

```javascript
console.log(event.body.name); // prints "Luke"
this.uppercasedName = event.body.name.toUpperCase();
```

If your step was named `steps.nodejs`, you can reference this data in another step using `steps.nodejs.uppercasedName`.

## `$context` is now `steps.trigger.context`

`$context` provided event-level metadata about the workflow execution: a unique event ID, the workflow ID, and more. **This data is now exposed in `steps.trigger.context`. You'll need to update any references to `$context` to use `steps.trigger.context`, instead**.

<Footer />
