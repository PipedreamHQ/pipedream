# Scheduling future tasks

Pipedream includes an event source which exposes an HTTP API for scheduling one-time tasks. You can schedule tasks at any timestamp, with second-level precision, up to one year in the future. 

[Click here to create this source](https://pipedream.com/sources?action=create&key=pipedream-new-scheduled-tasks), or visit [https://pipedream.com/sources/new](https://pipedream.com/sources/new), select the **Pipedream** app, and the **New Scheduled Tasks** source.

To [schedule a new task](#scheduling-a-task), just send an HTTP `POST` request to your source's endpoint, at the `/schedule` path, with the following format:

```javascript
{
  "timestamp": "2020-08-21T04:29:00.951Z", // timestamp: an ISO 8601 timestamp
  "message": { "name": "Luke" } // message: any object or string
}
```

When the timestamp arrives and the task is invoked, the source will emit the payload passed in your original, scheduled request. This allows you to trigger [a Pipedream workflow](/workflows/) at the scheduled time, passing the `message` and `timestamp` to the workflow as an [incoming event](/workflows/events/).

You can also listen for these events in your own app / infra, by [subscribing to your source's SSE stream](/api/sse/). Each time a scheduled task is emitted from your Pipedream source, it also emits a message to that SSE stream. Any application (a Docker container, a Rails app, etc.) listening to that SSE stream can react to that message to run whatever code you'd like.

[[toc]]

## HTTP API

This source exposes an HTTP endpoint where you can send `POST` requests to schedule new tasks. Your endpoint URL should appear as the **Endpoint** in your source's details, in the **Events** tab.

### Scheduling a task

```
POST /schedule
```

#### Pipedream built-in action

Use the **Pipedream Task Scheduler - Schedule Task** Helper Functions action to schedule a new task.

#### Node.js

Use the following code in a Node.js code step:

```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  props: {
    numSeconds: {
      type: "integer",
      label: "Num Seconds",
      description: "How many seconds in the future would you like to schedule the task?",
    },
    secret: {
      type: "string",
      optional: true,
    },
    taskSchedulerURL: {
      type: "string",
      label: "Task Scheduler URL",
      description: "Enter the URL as it appears in the **Endpoint** field of your Task Scheduler source",
    },
    message: {
      type: "string",
      description: "The message / payload to send to your task scheduler. Can be any string or JavaScript object. This message will be emitted by the task scheduler at the specified number of seconds in the future.",
    },
  },
  async run({ $ }) {
    const timestamp = (new Date(+new Date() + (this.numSeconds * 1000))).toISOString()

    const headers = {
      "Content-Type": "application/json",
    };
    if (this.secret) {
      headers["x-pd-secret"] = this.secret;
    }

    return await axios($, {
      url: `${this.taskSchedulerURL}/schedule`,
      method: "POST",
      headers,
      data: {
        timestamp,
        message: this.message,
      },
    });
  },
})
```

#### `cURL`

To schedule a new task, `POST` a JSON object with an [ISO 8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) `timestamp` and a `message` to the **`/schedule` path** of your source's HTTP endpoint:

```javascript
{
  "timestamp": "2020-08-21T04:29:00.951Z", // timestamp: an ISO 8601 timestamp
  "message": { "name": "Luke" } // message can be any object or string
}
```

Optionally, if you configured a secret in your source, you'll need to pass that in the `x-pd-secret` header. For example:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'x-pd-secret: 123' \
  -d '{ "timestamp": "2020-09-18T04:40:59Z", "message": "foo" }' \
  https://endpoint.m.pipedream.net/schedule
```

Successful task schedule requests yield a `200 OK` response, noting the task was successfully scheduled.

### Cancelling a scheduled task

```
POST /cancel
```

When you schedule a task, you'll receive a unique ID assigned to that task in the `id` field of the HTTP response body. That `id` can be passed to the `/cancel` endpoint to cancel that task before its scheduled time arrives.

#### Node.js

Cancel tasks using the following code in a Node.js code step:

```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  props: {
    secret: {
      type: "string",
      optional: true,
    },
    taskSchedulerURL: {
      type: "string",
      label: "Task Scheduler URL",
      description: "Enter the URL as it appears in the **Endpoint** field of your Task Scheduler source",
    },
    taskId: {
      type: "string",
      description: "The ID of the task you'd like to cancel",
    },
  },
  async run({ $ }) {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.secret) {
      headers["x-pd-secret"] = this.secret;
    }

    return await axios($, {
      url: `${this.taskSchedulerURL}/cancel`,
      method: "DELETE",
      headers,
      data: {
        id: this.taskId,
      },
    });
  },
})
```

#### `cURL`

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'x-pd-secret: 123' \
  -d '{ "id": "8fceb45b-0241-4d04-9f3f-334679586370" }' \
  https://endpoint.m.pipedream.net/cancel
```

## Processing scheduled tasks

Scheduled tasks are emitted by the event source as events, which you can consume with

- [Pipedream workflows](/workflows/)
- [A source-specific SSE stream](/api/sse/)
- [The Pipedream REST API](/api/rest/)
- [The Pipedream CLI](/cli/reference/#installing-the-cli)

[See the docs on consuming events from sources](/sources/#consuming-events-from-sources) for more information.