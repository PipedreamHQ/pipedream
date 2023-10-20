---
short_description: How to delay a workflow's execution with Node.js.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646841376/docs/icons/icons8-time-96_kupxpi.png
---

# Delaying a workflow

<VideoPlayer title="Delaying Workflow Steps" url="https://www.youtube.com/embed/IBORwBnIZ-k" startAt="148" />

Use `$.flow.delay` to [delay a step in a workflow](/workflows/flow-control/#delay).

These docs show you how to write Node.js code to handle delays. If you don't need to write code, see [our built-in delay actions](/workflows/flow-control/#delay-actions).

[[toc]]

## Using `$.flow.delay`

`$.flow.delay` takes one argument: the number of **milliseconds** you'd like to pause your workflow until the next step executes. {{$site.themeConfig.DELAY_MIN_MAX_TIME}}. 

Note that [delays happen at the end of the step where they're called](#when-delays-happen).

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Delay a workflow for 60 seconds (60,000 ms)
    $.flow.delay(60 * 1000)

    // Delay a workflow for 15 minutes
    $.flow.delay(15 * 60 * 1000)

    // Delay a workflow based on the value of incoming event data,
    // or default to 60 seconds if that variable is undefined
    $.flow.delay(steps.trigger.event?.body?.delayMs ?? 60 * 1000)

    // Delay a workflow a random amount of time
    $.flow.delay(Math.floor(Math.random() * 1000))
  })
});
```

::: tip Paused workflow state

When `$.flow.delay` is executed in a Node.js step, the workflow itself will enter a **Paused** state.

While the workflow is paused, it will not incur any credits towards compute time. You can also [view all paused workflows in the Event History](/event-history/#filtering-by-status).

:::

### Credit usage

The length of time a workflow is delayed from `$.flow.delay` does _not_ impact your credit usage. For example, delaying a 256 megabyte workflow for five minutes will **not** incur ten credits.

However, using `$.flow.delay` in a workflow will incur two credits.

One credit is used to initially start the workflow, then the second credit is used when the workflow resumes after its pause period has ended.

## `cancel_url` and `resume_url`

Both the built-in **Delay** actions and `$.flow.delay` return a `cancel_url` and `resume_url` that lets you cancel or resume paused executions.

These URLs are specific to a single execution of your workflow. While the workflow is paused, you can load these in your browser or send an HTTP request to either:

- Hitting the `cancel_url` will immediately cancel that execution
- Hitting the `resume_url` will immediately resume that execution early

[Since Pipedream pauses your workflow at the _end_ of the step where you run call `$.flow.delay`](#when-delays-happen), you can send these URLs to third party systems, via email, or anywhere else you'd like to control the execution of your workflow.

```javascript
import axios from 'axios'

export default defineComponent({
  async run({ steps, $ }) {
    const { cancel_url, resume_url } = $.flow.delay(15 * 60 * 1000)

    // Send the URLs to a system you own
    await axios({
      method: "POST",
      url: `https://example.com`,
      data: { cancel_url, resume_url },
    });

    // Email yourself the URLs. Click on the links to cancel / resume
    $.send.email({
      subject: `Workflow execution ${steps.trigger.context.id}`,
      text: `Cancel your workflow here: ${cancel_url} . Resume early here: ${resume_url}`,
    });
  })
});

// Delay happens at the end of this step
```

## When delays happen

**Pipedream pauses your workflow at the _end_ of the step where you call `$.flow.delay`**. This lets you [send the `cancel_url` and `resume_url` to third-party systems](#cancel-url-and-resume-url).

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    const { cancel_url, resume_url } = $.flow.delay(15 * 60 * 1000)
    // ... run any code you want here
  })
});

// Delay happens at the end of this step
```

## Delays and HTTP responses

You cannot run `$.respond` after running `$.flow.delay`. Pipedream ends the original execution of the workflow when `$.flow.delay` is called and issues the following response to the client to indicate this state:

> $.respond() not called for this invocation

If you need to set a delay on an HTTP request triggered workflow, consider using [`setTimeout`](#settimeout) instead.

## `setTimeout`

Alternatively, you can use `setTimeout` instead of using `$.flow.delay` to delay individual workflow steps.

However, there are some drawbacks to using `setTimeout` instead of `$.flow.delay`. `setTimeout` will count towards your workflow's compute time, for example:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // delay this step for 30 seconds
    const delay = 30000;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('timer ended')
      }, delay)
    })
  }
});

```

The Node.js step above will hold the workflow's execution for this step for 30 seconds; however, 30 seconds will also _contribute_ to your credit usage. Also consider that workflows have a hard limit of {{$site.themeConfig.MAX_WORKFLOW_EXECUTION_LIMIT}} seconds.
