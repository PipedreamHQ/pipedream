# Emit events

Like [event sources](/event-sources/), workflows can emit events. These events can trigger other workflows, or be consumed using Pipedream's [REST API](/api/rest/#get-workflow-emits). 

[[toc]]

## Using `$send.emit()`

You can emit arbitrary events from any [Node.js code steps](/workflows/steps/code/) using `$send.emit()`.

```javascript
$send.emit({
  raw_event: {
    name: "Yoda",
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

## Trigger a workflow from emitted events

We call the events you emit from a workflow **emitted events**. Sometimes, you'll want emitted events to trigger another workflow. This can be helpful when:

- You process events from different workflows in the same way. For example, you want to log events from many workflows to Amazon S3 or a logging service. You can write one workflow that handles logging, then `$send.emit()` events from other workflows that are consumed by the single, logging workflow. This helps remove duplicate logic from the other workflows.
- Your workflow is complex and you want to separate it into multiple workflows to group logical functions together. You can `$send.emit()` events from one workflow to another to chain the workflows together.

Here's how to configure a workflow to listen for emitted events.

1. Currently, you can't select emitted events as a workflow trigger from the Pipedream UI. We'll show you how add the trigger via API. First, pick an existing workflow where you'd like to receive emitted events. **If you want to start with a [new workflow](https://pipedream.com/new), just select the HTTP / Webhook trigger**.
2. This workflow is called the **listener**. The workflow where you'll use `$send.emit()` is called the **emitter**. If you haven't created the emitter workflow yet, [do that now](https://pipedream.com/new).
3. Get the workflow IDs of both the listener and emitter workflows. **You'll find the workflow ID in the workflow's URL in your browser bar — it's the `p_abc123` in `https://pipedream.com/@username/p_abc123/`**.
4. You can use the Pipedream REST API to configure the listener to receive events from the emitter. We call this [creating a subscription](/api/rest/#listen-for-events-from-another-source-or-workflow). If your listener's ID is `p_abc123` and your emitter's ID is `p_def456`, you can run the following command to create this subscription:

```bash
curl "https://api.pipedream.com/v1/subscriptions?emitter_id=dc_def456&listener_id=p_abc123" \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

5. Run your emitter workflow, emitting an event using `$send.emit()`:

```javascript
$send.emit({
  raw_event: {
    name: "Yoda",
  },
});
```

This should trigger your listener, and you should see the same event in [the event inspector](/workflows/events/inspect/#the-inspector).

**Note**: since configuring this trigger happens via API, you also won't see the emitted event appear as the trigger for your your listener. Please upvote [this issue](https://github.com/PipedreamHQ/pipedream/issues/241) if you'd like to see UI support for that. Please upvote [this issue](https://github.com/PipedreamHQ/pipedream/issues/682) to see support for _adding_ emitted events as a workflow trigger in the UI.

## Consuming emitted events via REST API

`$send.emit()` can emit any data you'd like. You can retrieve that data using Pipedream's REST API endpoint for [retrieving emitted events](/api/rest/#get-workflow-emits).

This can be helpful when you want a workflow to process data asynchronously using a workflow. You can save the results of your workflow with `$send.emit()`, and only retrieve the results in batch when you need to using the REST API.

## Emit logs / troubleshooting

Below your code step, you'll see both the data that was sent in the emit. If you ran `$send.emit()` multiple times within the same code step, you'll see the data that was emitted for each.

<Footer />
