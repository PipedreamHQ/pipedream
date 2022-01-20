# REST API example: Workflow errors

Any time your workflow throws an error, that error is sent to the [global error workflow](/workflows/error-handling/global-error-workflow/). By default, the global error workflow sends you an email with a summary of the error, but you can modify this workflow in any way you'd like (for example, you can send all errors to Slack or Discord, instead of email). This is helpful for most error-handling cases, but you'll often encounter cases the global error workflow can't cover.

For example, you may want to handle errors from one workflow differently from errors in another. Or, you might want to operate on errors using the API, instead of with a workflow. This doc shows you how to handle both of these example scenarios.

Before you jump into the examples below, remember that all Pipedream workflows are just Node.js code. You might be able to handle your error within a specific step, using JavaScript's [`try / catch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).

---

[[toc]]

## List the last 100 errors from the REST API

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

## Forward errors for one workflow to another workflow

Forwarding errors for a workflow to another workflow can be helpful in two situations:

- You want to run code to handle errors _for a specific workflow_, distinct from the default code that runs in the [global error workflow](/workflows/error-handling/global-error-workflow/).
- You need access to more than the last 100 errors for a workflow. Sending each error to a workflow allows you to archive them (so you can replay the original event later, if necessary).

Let's walk through an end-to-end example:

1. Pick the workflow whose errors you'd like to manage and note its workflow ID. You can retrieve the ID of your workflow in your workflow's URL - it's the string `p_abc123` in `https://pipedream.com/@dylan/example-workflow-p_abc123/edit`.
2. [Create a new workflow](https://pipedream.com/new) with an [HTTP trigger](/workflows/steps/triggers/#http). This workflow will receive errors from the workflow in step #1. Note the ID for this workflow, as well.
3. A workflow can have multiple triggers. Here, you're going to add the errors from the workflow in step #1 as an additional trigger for the workflow you created in step #2. In other words, errors from workflow #1 will trigger workflow #2.

Make the following request to the Pipedream API, replacing the `emitter_id` with the ID of workflow #1, and the `listener_id` with the ID of workflow #2.

```bash
curl 'https://api.pipedream.com/v1/subscriptions?emitter_id=p_workflow1&listener_id=p_workflow2&event_name=$errors' \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

**You will not see this second, error trigger appear in the Pipedream UI for workflow #2**. The Pipedream UI only lists the original, HTTP trigger, but you can [list your subscriptions](/api/rest/#get-current-user-s-subscriptions) using the REST API.

4. Trigger an error from workflow #1. You can do this manually by adding a new Node.js code step and running: 

```javascript
throw new Error("test");
```

You'll see an event arrive in workflow #2 with the `error`, the `original_event`, and `original_context`.

**You can handle errors in any way you'd like within this workflow**. For example, you can save the error payload to a Google Sheet, or another data store, to store all errors for your workflow beyond the 100 returned by the Pipedream REST API.

<Footer />
