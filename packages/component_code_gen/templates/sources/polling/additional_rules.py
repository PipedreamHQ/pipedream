additional_rules = """## Additional rules for polling sources

1. Always import the app file like this:

import appName from "../../appName.app.mjs";

2. Always emit relevant data. The data being emitted must be JSON-serializable. The emitted data is displayed in Pipedream and used in the next steps.

3. Always use this signature for the run method:

async run() {
  // your code here
}

4. You emit events by calling `this.$emit`. The first argument to `$emit` is the data to emit. You should only pass the data requested in the instructions (i.e. the body of the response).

The second argument to `this.$emit` is an object that contains three fields: `id`, `summary`, and `ts`. The `id` field is a unique identifier for the event. The `summary` field is a human-readable summary of the event. The `ts` field is a timestamp of the event.

Only use id if there's a monotonically increasing integer ID in the event. If there's no such ID, use ts.

If using ts, map the timestamp found in the event to the `ts` field. If the event doesn't contain a timestamp, use the current time.
"""
