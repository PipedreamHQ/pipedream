# AWS Task Scheduler

This event source creates a service for scheduling one-time tasks, at any timestamp, up to one year in the future.

It exposes an [HTTP API](#api) for scheduling tasks. Just send a `POST` request to your source's `/schedule` path with the following format:

```json
{
  "timestamp": "2020-08-21T04:29:00.951Z", // timestamp: an ISO 8601 timestamp
  "message": { "name": "Luke" } // message can be any object or string
}
```

When the timestamp arrives and the task is invoked, the source will emit the `message` passed in your original, scheduled request. This allows you to trigger [a Pipedream workflow](https://docs.pipedream.com/workflows/) at the scheduled time, passing the `message` to the workflow as an [incoming event](https://docs.pipedream.com/workflows/events/).

You can also listen for these events in your own app / infra, by subscribing to your source's SSE stream. Each time a scheduled task is emitted from your Pipedream source, it also emits a message to that SSE stream. Any application (a Docker container, a Rails app, etc.) listening to that SSE stream can react to that message to run whatever code you'd like.

## Requirements

### An AWS account

This source requires an [AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

## How this works

- When you create the source, Pipedream spins up resources in your linked AWS account that are responsible for scheduling the task. You don't need to create these resources yourself - Pipedream handles that for you.
- Pipedream exposes an HTTP API that allows you to schedule new tasks. Just send an HTTP POST request to your source with the `timestamp` at which you'd like to schedule your task, and the `message` you'd like to receive when the task is invoked.
- When the `timestamp` arrives and the task is invoked, the source will emit the `message` you passed, triggering any listening workflows.

## AWS Resources

### Estimated Costs

## API

This source exposes an HTTP endpoint where you can send `POST` request to schedule new tasks. Your endpoint URL should appear as the **Endpoint** in your source's details, in the **Events** tab:

<img src="./images/source-endpoint-url.png" width="700px">

To schedule a new task, `POST` a JSON object with an [ISO 8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) `timestamp` and a `message` to the **`/schedule` path** of your source's HTTP endpoint:

```json
{
  "timestamp": "2020-08-21T04:29:00.951Z", // timestamp: an ISO 8601 timestamp
  "message": { "name": "Luke" } // message can be any object or string
}
```

## Example: Schedule a task 30 seconds in the future

You can use [this workflow](https://pipedream.com/@dylan/example-schedule-a-task-with-the-aws-task-scheduler-source-p_zAC2aK/edit) to schedule a new task N seconds in the future:

```javascript
// N seconds from now
this.ts = new Date(+new Date() + params.numSeconds * 1000).toISOString();

return await require("@pipedreamhq/platform").axios(this, {
  url: `${params.taskSchedulerURL}/schedule`,
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    timestamp: this.ts,
    message: {
      name: "Luke",
      title: "Jedi",
    },
  },
});
```

Or with `cURL`:

```bash
> curl -d '{ "timestamp": "2020-08-21T04:29:00.951Z", "message": { "name": "Luke" }}' \
  -H "Content-Type: application/json" \
  https://d00ca068fb5d375a3b95d0a70ba25e3f.m.pipedream.net/schedule

{"message":"Scheduled task at 2020-08-21T04:29:00.951Z"}
```

### Example: Run a workflow at sunrise and sunset

### IAM Policy

At a minimum, this policy needs the ability to create and delete Step Functions State Machines, IAM roles / policies, and SNS topics:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "sns:DeleteTopic",
        "iam:DeleteRolePolicy",
        "states:DeleteStateMachine",
        "sns:CreateTopic",
        "iam:CreateRole",
        "iam:DeleteRole",
        "states:StartExecution",
        "states:StopExecution",
        "sns:Subscribe",
        "iam:PutRolePolicy",
        "states:CreateStateMachine"
      ],
      "Resource": [
        "arn:aws:iam::[YOUR AWS ACCOUNT ID]:role/*",
        "arn:aws:states:*:*:execution:*:*",
        "arn:aws:states:*:*:stateMachine:*",
        "arn:aws:sns:*:*:*"
      ]
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": "sns:Unsubscribe",
      "Resource": "*"
    }
  ]
}
```
