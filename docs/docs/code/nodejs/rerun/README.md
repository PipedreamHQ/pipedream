---
short_description: How to rerun a step execution in Node.js
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646841376/docs/icons/icons8-time-96_kupxpi.png
---

# Pause, resume, and rerun a workflow

You can use `$.flow.suspend` and `$.flow.rerun` to pause a workflow and resume it later. 

This is useful when you want to:

- Pause a workflow until someone manually approves it
- Poll an external API until some job completes, and proceed with the workflow when it's done
- Trigger an external API to start a job, pause the workflow, and resume it when the external API sends an HTTP callback

We'll cover all of these examples below.

[[toc]]

## `$.flow.suspend`

Use `$.flow.suspend` when you want to pause a workflow and proceed with the remaining steps only when manually approved or cancelled.

For example, you can suspend a workflow and send yourself a link to manually resume or cancel the rest of the workflow:

```javascript
export default defineComponent({
  async run({ $ }) {
    const { resume_url, cancel_url } = $.flow.suspend()
    $.send.email({
      subject: "Please approve this important workflow",
      text: `Click here to approve the workflow: ${resume_url}, and cancel here: ${cancel_url}`,
    })
    // Pipedream suspends your workflow at the end of the step
  },
})
```

You'll receive an email like this:

<div>
  <img src="https://res.cloudinary.com/pipedreamin/image/upload/v1655272047/docs/approve-workflow_oc06k3.png" alt="approve this workflow" width="100%"/>
</div>

And can resume or cancel the rest of the workflow by clicking on the appropriate link.

### `resume_url` and `cancel_url`

In general, calling `$.flow.suspend` returns a `cancel_url` and `resume_url` that lets you cancel or resume paused executions. Since Pipedream pauses your workflow at the _end_ of the step, you can pass these URLs to any external service before the workflow pauses. If that service accepts a callback URL, it can trigger the `resume_url` when its work is complete.

These URLs are specific to a single execution of your workflow. While the workflow is paused, you can load these in your browser or send any HTTP request to them:

- Sending an HTTP request to the `cancel_url` will cancel that execution
- Sending an HTTP request to the `resume_url` will resume that execution

If you resume a workflow, any data sent in the HTTP request is passed to the workflow and returned in the `$resume_data` [step export](/workflows/steps/#step-exports) of the suspended step. For example, if you call `$.flow.suspend` within a step named `code`, the `$resume_data` export should contain the data sent in the `resume_url` request:

<div>
  <img src="https://res.cloudinary.com/pipedreamin/image/upload/v1655271815/docs/resume_data_lafhxr.png" alt="resume data step export" width="350px"/>
</div>

### Default timeout of 24 hours 

By default, `$.flow.suspend` will automatically resume the workflow after 24 hours. You can set your own timeout (in milliseconds) as the first argument:

```javascript
export default defineComponent({
  async run({ $ }) {
    // 7 days
    const TIMEOUT = 1000 * 60 * 60 * 24 * 7
    $.flow.suspend(TIMEOUT)
  },
})
```

## `$.flow.rerun`

<VideoPlayer src="https://www.youtube.com/embed/Fz_hjbza6Yo" title="Rerunning a Node.js code step with $.rerun"/>

Use `$.flow.rerun` when you want to run a specific step of a workflow multiple times. This is useful when you need to start a job in an external API and poll for its completion, or have the service call back to the step and let you process the HTTP request within the step.

### Polling for the status of an external job

Sometimes you need to poll for the status of an external job until it completes. `$.flow.rerun` lets you rerun a specific step multiple times:

```javascript
import axios from 'axios'

export default defineComponent({
  async run({ $ }) {
    const MAX_RETRIES = 3
    // 10 seconds
    const DELAY = 1000 * 10
    const { run } = $.context
    // $.context.run.runs starts at 1 and increments when the step is rerun
    if (run.runs === 1) {
      // $.flow.rerun(delay, context (discussed below), max retries)
      $.flow.rerun(DELAY, null, MAX_RETRIES)
    }
    else if (run.runs === MAX_RETRIES + 1) {
      throw new Error("Max retries exceeded")
    }
    else {
      // Poll external API for status
      const { data } = await axios({
        method: "GET",
        url: "https://example.com/status"
      })
      // If we're done, continue with the rest of the workflow
      if (data.status === "DONE") return data

      // Else retry later
      $.flow.rerun(DELAY, null, MAX_RETRIES)
    }
  },
})
```

`$.flow.rerun` accepts the following arguments:

```javascript
$.flow.rerun(
  delay, // The number of milliseconds until the step will be rerun
  context, // JSON-serializable data you need to pass between runs
  maxRetries, // The total number of times the step will rerun. Defaults to 10
)
```

### Accept an HTTP callback from an external service

When you trigger a job in an external service, and that service can send back data in an HTTP callback to Pipedream, you can process that data within the same step using `$.flow.retry`:

```javascript
import axios from 'axios'

export default defineComponent({
  async run({ steps, $ }) {
    const TIMEOUT = 86400 * 1000
    const { run } = $.context
    // $.context.run.runs starts at 1 and increments when the step is rerun
    if (run.runs === 1) {
      const { cancel_url, resume_url } = $.flow.rerun(TIMEOUT, null, 1)

      // Send resume_url to external service
      await axios({
        method: "POST",
        url: "your callback URL",
        data: {
          resume_url,
          cancel_url,
        }
      })
    }
    else if (run.runs === 2) {
      throw new Error("External service never completed job")
    }
    // When the external service calls back into the resume_url, you have access to 
    // the callback data within $.context.run.callback_request
    else {
      const { callback_request } = run
      return callback_request
    }
  },
})
```

### Passing `context` to `$.flow.rerun`

Within a Node.js code step, `$.context.run.context` contains the `context` passed from the prior call to `rerun`. This lets you pass data from one run to another. For example, if you call:

```javascript
$.flow.rerun(1000, { hello: "world" })
```

`$.context.run.context` will contain:

<div>
  <img src="https://res.cloudinary.com/pipedreamin/image/upload/v1655274732/docs/Screen_Shot_2022-06-14_at_11.32.06_PM_dmzgkh.png" alt="resume data step export" width="250px"/>
</div>

### `maxRetries`

By default, `maxRetries` is **10**.

When you exceed `maxRetries`, the workflow proceeds to the next step. If you need to handle this case with an exception, `throw` an error from the step:

```javascript
export default defineComponent({
  async run({ $ }) {
    const MAX_RETRIES = 3
    const { run } = $.context
    if (run.runs === 1) {
      $.flow.rerun(1000, null, MAX_RETRIES)
    }
    else if (run.runs === MAX_RETRIES + 1) {
      throw new Error("Max retries exceeded")
    }
  },
})
```

## Behavior when testing

When you're building a workflow and test a step with `$.flow.suspend` or `$.flow.rerun`, it will not suspend the workflow, and you'll see a message like the following:

> Workflow execution canceled — this may be due to `$.flow.suspend()` usage (not supported in test)

These functions will only suspend and resume when run in production.

## Invocations when using `suspend` / `rerun`

Each time workflows are resumed, Pipedream charges [an invocation](/pricing/#invocations). For example, when you call `$.flow.suspend`, you're charged an invocation for the initial event data, and another invocation when you resume the request.