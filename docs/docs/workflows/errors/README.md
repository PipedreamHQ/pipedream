# Handling errors

By default, [Pipedream sends an email](#default-system-emails) when a workflow throws an unhandled error. But what if you want to:

- Send error notifications to Slack
- Handle errors from one workflow in a specific way
- Fetch errors asynchronously using the REST API, instead of handling the event in real-time

These docs describe the default error behavior, and how to handle custom use cases like these.

Before you jump into the examples below, remember that all Pipedream workflows are just code. You can always use the built-in error handling logic native to your programming language, for example: using JavaScript's [`try / catch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch). In the future, Pipedream plans to support this kind of error-handling for built-in actions, as well.

[[toc]]

## Default system emails

Any time your workflow throws an unhandled error, you'll receive an email like this:

<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1656630943/docs/Screen_Shot_2022-06-29_at_6.20.42_PM_kmsjbr.png" alt="Example error email">

This email includes a link to the error so you can see the data and logs associated with the run. When you inspect the data in the Pipedream UI, you'll see details on the error below the step that threw the error, e.g. the full stack trace.

### Duplicate errors do not trigger duplicate emails

High-volume errors can lead to lots of notifications, so Pipedream only sends at most one email, per error, per workflow, per 24 hour period.

For example, if your workflow throws a `TypeError`, we'll send you an email, but if it continues to throw that same `TypeError`, we won't email you about the duplicate errors until the next day. If a different workflow throws a `TypeError`, you **will** receive an email about that.

## Test mode vs. live mode

When you're editing and testing your workflow, any unhandled errors will **not** raise errors as emails, nor are they forwarded to [error listeners](#process-errors-with-custom-logic-instead-of-email). Error notifications are only sent when a deployed workflow encounters an error on a live event.

## Process errors with custom logic, instead of email

Pipedream exposes a global stream of all errors, raised from all workflows. You can subscribe to this stream, triggering a workflow on every event. This lets you handle errors in a custom way. Instead of sending all errors to email, you can send them to Slack, Discord, AWS, or any other service, and handle them in any custom way.

Watch this video to learn more, or check out the step-by-step docs below.

<VideoPlayer src="https://www.youtube.com/embed/7qVLEys_swg" title="Sending Pipedream workflow errors to Cloudwatch"/>

<br />

1. [Create a new workflow](https://pipedream.com/@/new/build?v=2). You do not need to add a trigger, since the workflow will be triggered on errors, which we'll configure next.
2. Create a subscription with the following configuration:

- `emitter_id`: your org ID, found in your [Account Settings](https://pipedream.com/settings/account).
- `listener_id`: The [workflow ID](/troubleshooting/#where-do-i-find-my-workflow-s-id) from step #1
- `event_name`: `$errors`

For example, you can make this request with your Pipedream API key using `cURL`:

```bash
curl -X POST \
  'https://api.pipedream.com/v1/subscriptions?emitter_id=o_abc123&event_name=$errors&listener_id=p_abc123' \
  -H "Authorization: Bearer <api_key>"
```

3. Generate an error in a live version of any workflow (errors raised while you're testing your workflow [do not send errors to the `$errors` stream](#test-mode-vs-live-mode)). You should see this error trigger the workflow in step #1. From there, you can build any logic you want to handle errors across workflows.

### Duplicate errors _do_ trigger duplicate error events on custom workflows

Unlike [the default system emails](#duplicate-errors-do-not-trigger-duplicate-emails), duplicate errors are sent to any workflow listening to the `$errors` stream.

## Handle errors for one workflow using custom logic

Every time a workflow throws an error, it emits an event to the `$errors` stream for that workflow. You can create [a subscription](/api/rest/#listen-for-events-from-another-source-or-workflow) that delivers these errors to a Pipedream workflow, webhook, and more.

Let's walk through an end-to-end example:

1. Pick the workflow whose errors you'd like to handle and note its [workflow ID](/troubleshooting/#where-do-i-find-my-workflow-s-id).
1. [Create a new workflow](https://pipedream.com/@/new/build?v=2). You do not need to add a trigger, since the workflow will be triggered on errors, which we'll configure next. Note the ID for this workflow, as well.
3. Here, you're going to add the errors from the workflow in step #1 as a trigger for the workflow you created in step #2. In other words, errors from workflow #1 will trigger workflow #2.

Make the following request to the Pipedream API, replacing the `emitter_id` with the ID of workflow #1, and the `listener_id` with the ID of workflow #2.

```bash
curl 'https://api.pipedream.com/v1/subscriptions?emitter_id=p_workflow1&listener_id=p_workflow2&event_name=$errors' \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

4. Generate an error in a live version of any workflow (errors raised while you're testing your workflow [do not send errors to the `$errors` stream](#test-mode-vs-live-mode)). You should see this error trigger the workflow in step #1. From there, you can build any logic you want to handle errors across workflows.

## Poll the REST API for workflow errors

Pipedream provides a REST API endpoint to [list the most recent 100 workflow errors](/api/rest/#get-workflow-errors) for any given workflow. For example, to list the errors from workflow `p_abc123`, run:

```bash
curl 'https://api.pipedream.com/v1/workflows/p_abc123/$errors/event_summaries?expand=event' \
  -H 'Authorization: Bearer <api_key>'
```

By including the `expand=event` query string param, Pipedream will return the full error data, along with the original event that triggered your workflow:

```json
{
  "page_info": {
    "total_count": 100,
    "start_cursor": "1606370816223-0",
    "end_cursor": "1606370816223-0",
    "count": 1
  },
  "data": [
    {
      "id": "1606370816223-0",
      "indexed_at_ms": 1606370816223,
      "event": {
        "original_event": {
          "name": "Luke",
          "title": "Jedi"
        },
        "original_context": {
          "id": "1kodJIW7jVnKfvB2yp1OoPrtbFk",
          "ts": "2020-11-26T06:06:44.652Z",
          "workflow_id": "p_abc123",
          "deployment_id": "d_abc123",
          "source_type": "SDK",
          "verified": false,
          "owner_id": "u_abc123",
          "platform_version": "3.1.20"
        },
        "error": {
          "code": "InternalFailure",
          "cellId": "c_abc123",
          "ts": "2020-11-26T06:06:56.077Z",
          "stack": "    at Request.extractError ..."
        }
      },
      "metadata": {
        "emitter_id": "p_abc123",
        "emit_id": "1kodKnAdWGeJyhqYbqyW6lEXVAo",
        "name": "$errors"
      }
    }
  ]
}
```

By listing these errors, you may be able to replay them against your workflow programmatically. For example, if your workflow is triggered by HTTP requests, you can send an HTTP request with the data found in `event.original_event` (see the example above) for every event that errored.