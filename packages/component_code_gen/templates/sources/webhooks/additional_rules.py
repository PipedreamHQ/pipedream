additional_rules = """<AdditionalRules>

1. Always import the app file like this:

```javascript
import appName from "../../appName.app.mjs";
```

and pass the app file as a prop to the component:

```javascript
export default {
  props: {
    appName,
  },
  // rest of the component ...
}
```

2. Always emit relevant data with the call to `this.$emit`. The data being emitted must be JSON-serializable. The emitted data is displayed in Pipedream and used in the next steps.

3. Always use this signature for the `run` method:

```javascript
async run() {
  // you must fill in the actual code here
}
```

4. You emit events by calling `this.$emit`. The first argument to `$emit` is the data to emit. You should only pass the data requested in the instructions (i.e. the body of the response).

The second argument to `this.$emit` is an object that contains three fields: `id`, `summary`, and `ts`. The `id` field is a unique identifier for the event. The `summary` field is a human-readable summary of the event. The `ts` field is a timestamp of the event.

Only use id if there's a monotonically increasing integer ID in the event. If there's no such ID, use ts.

If using ts, map the timestamp found in the event to the `ts` field. If the event doesn't contain a timestamp, use the current time.

<Examples>

When the response contains an ID and a timestamp:

```javascript
this.$emit(
  response, 
  { 
    id: response.id, 
    summary: `New event: ${response.name}`, // Use whatever summary information makes sense in context
    ts: response.timestamp 
  }
);
```

Here, there's no ID or timestamp in the event:

```javascript
this.$emit(
  response, { 
    summary: "Event summary", 
    ts: new Date() // if you don't see a timestamp in the event
  }
);
```

</AdditionalRules>
"""
