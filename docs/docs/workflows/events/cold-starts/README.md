# Cold Starts

If your workflow doesn't process an event for roughly 5 minutes, Pipedream turns off the execution environment that runs your code. When your workflow receives another event, Pipedream creates a new execution environment and process your event. **Initializing this environment takes a few seconds, which delays the execution of this first event**. This is common on serverless platforms, and is typically referred to as a "cold start". 

If your workflow needs to process data in a time-sensitive manner (for example, if you're issuing an HTTP response), you can implement the following workaround to keep your workflow "warm". 

### 1. Create a scheduled workflow that triggers your original workflow via HTTP request

First, create a scheduled workflow that runs roughly every 5 minutes, making an HTTP request to your HTTP-triggered workflow on the `/warm` path.

Here's a Node.js example:

```javascript
import got from "got"

export default defineComponent({
  async run({ steps, $ }) {
    return (await got(`${params.url}/warm`)).body
  },
})
```

### 2. End your original workflow on warming requests

Then, in your original workflow, add a step at the top that ends the workflow early if it receives a request on this `/warm` path. You can set this path to be whatever you'd like — `/warm` is just an example. On normal requests, that step won't run and your workflow will proceed as normal.

Here's a Node.js example:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const path = (new URL(event.url)).pathname
    if (path === "/warm") {
      $.respond({
        status: 200,
        body: {
          warmed: true,
        }
      })
      return $.flow.exit("Warming request, ending early")
    }
  },
})
```

We're tracking the ability to keep a workflow permanently warm [here](https://github.com/PipedreamHQ/pipedream/issues/318). Feel free to follow that issue to receive updates.

<Footer />
