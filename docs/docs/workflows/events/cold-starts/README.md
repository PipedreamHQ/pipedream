# Handling Cold Starts

If your workflow doesn't process an event for roughly 5 minutes, Pipedream turns off the execution environment that runs your code. When your workflow receives another event, Pipedream creates a new execution environment and process your event. **Initializing this environment takes a few seconds, which delays the execution of this first event**. This is common on serverless platforms, and is typically referred to as a "cold start". 

If your workflow needs to process data in a time-sensitive manner (for example, if you're issuing an HTTP response), you can implement the following workaround to keep your workflow "warm". 

### 1. Create a scheduled workflow that triggers your original workflow via an HTTP request

First, create a scheduled workflow that runs roughly every 5 minutes, making an HTTP request to your HTTP-triggered workflow on the `/warm` path.

Here's a Node.js example:

```javascript
import axios from "axios"

export default defineComponent({
  props: {
    url: {
      type: 'string',
      label: 'Webhook URL',
      description: 'The Webhook URL of workflow to keep warm',
    }
  },
  async run({ steps, $ }) {
    return (await axios(`${this.url}/warm`)).data
  },
})
```

### 2. End your original workflow on warming requests

Then, in your original workflow, add a step at the top that ends the workflow early if it receives a request on this `/warm` path. You can set this path to be whatever you'd like — `/warm` is just an example. On normal requests, that step won't run and your workflow will proceed as normal.

Here's a Node.js example:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const path = (new URL(steps.trigger.event.url)).pathname
    if (path === "/warm") {
      await $.respond({
        status: 200,
        body: {
          warmed: true,
        }
      });
      return $.flow.exit("Warming request, ending early");
    }
  },
}
```

::: tip

**Don't forget** to allow your webhook to return a custom response in the trigger settings.

This will allow the `/warm` endpoint to return a success message to our scheduled pinging workflow.

:::

We're tracking the ability to keep a workflow permanently warm [here](https://github.com/PipedreamHQ/pipedream/issues/318). Feel free to follow that issue to receive updates.

<Footer />
