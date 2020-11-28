# Emit events

Like [event sources](/event-sources/), workflows can emit events. These events can trigger other workflows, or be consumed using Pipedream's [REST API](/api/rest/#get-workflow-emits).

[[toc]]

## Using `$send.emit()`

You can emit arbitrary events from any [Node.js code steps](/workflows/steps/code/) using `$send.emit()`.

```javascript
$send.emit({
  raw_event: {
    name,
  },
});
```

`$send.emit()` accepts an object with the following properties:

```javascript
$send.emit({
  raw_event, // An object that contains the event you'd like to emit
});
```

**Destination delivery is asynchronous**: emits are sent after your workflow finishes.

You can call `$send.emit()` multiple times within a workflow, for example: to iterate over an array of values and emit an event for each.

```javascript
const names = ["Luke", "Han", "Leia", "Obi Wan"];
for (const name of names) {
  $send.emit({
    raw_event: {
      name,
    },
  });
}
```

## Consuming emitted events via REST API

`$send.emit()` can emit any data you'd like. You can retrieve that data using Pipedream's REST API endpoint for [retrieving emitted events](/api/rest/#get-workflow-emits).

This can be helpful when you want a workflow to process data asynchronously using a workflow. You can save the results of your workflow with `$send.emit()`, and only retrieve the results in batch when you need to using the REST API.

## Emit logs / troubleshooting

Below your code step, you'll see both the data that was sent in the emit. If you ran `$send.emit()` multiple times within the same code step, you'll see the data that was emitted for each.

<Footer />
