# Destinations

**Destinations**, like [actions](/components/actions/), abstract the delivery and connection logic required to send events to services like Amazon S3, or targets like HTTP and email.

However, Destinations are different than actions in two ways:

- **Events are delivered to the Destinations asynchronously**, after your workflow completes. This means you don't wait for network I/O (e.g. for HTTP requests or connection overhead for data warehouses) within your workflow code, so you can process more events faster.
- In the case of data stores like S3, you typically don't want to send every event on its own. This can be costly and carries little benefit. **Instead, you typically want to batch a collection of events together, sending the batch at some frequency. Destinations handle that batching for relevant services**.

The docs below discuss features common to all Destinations. See the [docs for a given destination](#available-destinations) for information specific to those destinations.

[[toc]]

## Available Destinations

- [HTTP](/destinations/http/)
- [Email](/destinations/email/)
- [S3](/destinations/s3/)
- [Pipedream Data Warehouse](/destinations/sql/)
- [SSE](/destinations/sse/)

## Using destinations

### Using destinations in workflows

You can send data to Destinations in [Node.js code steps](/workflows/steps/code/), too, using `$.send` functions.

`$.send` is an object provided by Pipedream that exposes destination-specific functions like `$.send.http()`, `$.send.s3()`, and more. **This allows you to send data to destinations programmatically, if you need more control than the default actions provide**.

Let's use `$.send.http()` to send an HTTP POST request like we did in the Action example above. [Add a new Action](/components/actions/#adding-a-new-action), then search for "**Run Node.js code**":

[Create an endpoint URL](https://requestbin.com), adding the code below to your code step, with the URL you created:

```javascript
defineComponent({
  async run({ steps, $}) {
    $.send.http({
      method: "POST",
      url: "[YOUR URL HERE]",
      data: {
        name: "Luke Skywalker",
      },
    });
  }
})
```

See the docs for the [HTTP destination](/destinations/http/) to learn more about all the options you can pass to the `$.send.http()` function.

Again, it's important to remember that **Destination delivery is asynchronous**. If you iterate over an array of values and send an HTTP request for each:

```javascript
defineComponent({
  async run({ steps, $}) {
    const names = ["Luke", "Han", "Leia", "Obi Wan"];
    for (const name of names) {
      $.send.http({
        method: "POST",
        url: "[YOUR URL HERE]",
        data: {
          name,
        },
      });
    }
  }
})
```

you won't have to `await` the execution of the HTTP requests in your workflow. We'll collect every `$.send.http()` call and defer those HTTP requests, sending them after your workflow finishes.

### Using destinations in actions

If you're authoring a [component action](/components/actions/), you can deliver data to destinations, too. `$.send` isn't directly available to actions like it is for workflow code steps. **Instead, you use `$.send` to access the destination-specific functions**:

```javascript
export default {
  name: "Action Demo",
  key: "action_demo",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    $.send.http({
      method: "POST",
      url: "[YOUR URL HERE]",
      data: {
        name: "Luke Skywalker",
      },
    });
  }
}
```

[See the component action API docs](/components/api/#actions) for more details.

## Asynchronous Delivery

Events are delivered to destinations _asynchronously_ — that is, separate from the execution of your workflow. **This means you're not waiting for network or connection I/O in the middle of your function, which can be costly**.

Some destination payloads, like HTTP, are delivered within seconds. For other destinations, like S3 and SQL, we collect individual events into a batch and send the batch to the destination. See the [docs for a specific destination](#available-destinations) for the relevant batch delivery frequency.

<Footer />
