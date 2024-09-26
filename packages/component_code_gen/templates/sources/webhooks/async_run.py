async_run = """## The run method

The run method is called when the component receives an event. The `event` param is passed as the first and only argument to the run method. 

`event` is a JSON object that contains the data from the webhook. 

You emit events by calling `this.$emit`. The first argument to `$emit` is the data to emit. You should only pass the data requested in the instructions. For example, usually only the event.body is relevant. Headers and others are used to validate the webhook, but shouldn't be emitted.

The second argument to `this.$emit` is an object that contains three fields: `id`, `summary`, and `ts`. The `id` field is a unique identifier for the event. The `summary` field is a human-readable summary of the event. The `ts` field is a timestamp of the event.

Only use id if there's a monotonically increasing integer ID in the event. If there's no such ID, use ts.

If using ts, map the timestamp found in the event to the `ts` field. If the event doesn't contain a timestamp, use the current time."""
