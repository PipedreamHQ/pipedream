---
short_description: How to delay a workflow's execution with Python.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646841376/docs/icons/icons8-time-96_kupxpi.png
---

# Delaying a workflow

Use `pd.flow.delay` to [delay a step in a workflow](/workflows/flow-control/#delay).

These docs show you how to write Python code to handle delays. If you don't need to write code, see [our built-in delay actions](/workflows/flow-control/#delay-actions).

[[toc]]

## Using `pd.flow.delay`

`pd.flow.delay` takes one argument: the number of **milliseconds** you'd like to pause your workflow until the next step executes. {{$site.themeConfig.DELAY_MIN_MAX_TIME}}.

Note that [delays happen at the end of the step where they're called](#when-delays-happen).

```python
import random

def handler(pd: 'pipedream'):
    # Delay a workflow for 60 seconds (60,000 ms)
    pd.flow.delay(60 * 1000)

    # Delay a workflow for 15 minutes
    pd.flow.delay(15 * 60 * 1000)

    # Delay a workflow based on the value of incoming event data,
    # or default to 60 seconds if that variable is undefined
    default = 60 * 1000
    delayMs = pd.steps["trigger"].get("event", {}).get("body", {}).get("delayMs", default)
    pd.flow.delay(delayMs)

    # Delay a workflow a random amount of time
    pd.flow.delay(random.randint(0, 999))
```

::: tip Paused workflow state

When `pd.flow.delay` is executed in a Python step, the workflow itself will enter a **Paused** state.

While the workflow is paused, it will not incur any credits towards compute time. You can also [view all paused workflows in the Event History](/event-history/#filtering-by-status).

:::

### Credit usage

The length of time a workflow is delayed from `pd.flow.delay` does _not_ impact your credit usage. For example, delaying a 256 megabyte workflow for five minutes will **not** incur ten credits.

However, using `pd.flow.delay` in a workflow will incur two credits.

One credit is used to initially start the workflow, then the second credit is used when the workflow resumes after its pause period has ended.

::: tip Exact credit usage depends on duration and memory configuration

If your workflow's [execution timeout limit](/workflows/settings/#execution-timeout-limit) is set to longer than [default limit](/limits/#time-per-execution), it may incur more than two [credits](/pricing/#credits) when using `pd.flow.delay`.

:::

## `cancel_url` and `resume_url`

Both the built-in **Delay** actions and `pd.flow.delay` return a `cancel_url` and `resume_url` that lets you cancel or resume paused executions.

These URLs are specific to a single execution of your workflow. While the workflow is paused, you can load these in your browser or send an HTTP request to either:

- Hitting the `cancel_url` will immediately cancel that execution
- Hitting the `resume_url` will immediately resume that execution early

[Since Pipedream pauses your workflow at the _end_ of the step where you run call `pd.flow.delay`](#when-delays-happen), you can send these URLs to third party systems, via email, or anywhere else you'd like to control the execution of your workflow.

```python
import requests

def handler(pd: 'pipedream'):
  links = pd.flow.delay(15 * 60 * 1000)
  # links contains a dictionary with two entries: resume_url and cancel_url

  # Send the URLs to a system you own
  requests.post("https://example.com", json=links)

  # Email yourself the URLs. Click on the links to cancel / resume
  pd.send.email(
    subject=f"Workflow execution {pd.steps['trigger']['context']['id']}",
    text=f"Cancel your workflow here: {links['cancel_url']} . Resume early here: {links['resume_url']}",
    html=None
  )

  # Delay happens at the end of this step
```

::: warning

In `pd.send.email`, the `html` argument defaults to `""`, so it overrides the email `text` unless explicitly set to `None`.

:::

## When delays happen

**Pipedream pauses your workflow at the _end_ of the step where you call `pd.flow.delay`**. This lets you [send the `cancel_url` and `resume_url` to third-party systems](#cancel-url-and-resume-url).

```python
def handler(pd: 'pipedream'):
  urls = pd.flow.delay(15 * 60 * 1000)
  cancel_url, resume_url = urls["cancel_url"], urls["resume_url"]
  # ... run any code you want here

  # Delay happens at the end of this step
```

## Delays and HTTP responses

You cannot run `pd.respond` after running `pd.flow.delay`. Pipedream ends the original execution of the workflow when `pd.flow.delay` is called and issues the following response to the client to indicate this state:

> $.respond() not called for this invocation

If you need to set a delay on an HTTP request triggered workflow, consider using [`time.sleep`](#time-sleep) instead.

## `time.sleep`

Alternatively, you can use `time.sleep` instead of using `pd.flow.delay` to delay individual workflow steps.

However, there are some drawbacks to using `time.sleep` instead of `pd.flow.delay`. `time.sleep` will count towards your workflow's compute time, for example:

```python
import time

def handler(pd: 'pipedream'):
  # delay this step for 30 seconds
  delay = 30
  
  time.sleep(delay)
```

The Python step above will hold the workflow's execution for this step for 30 seconds; however, 30 seconds will also _contribute_ to your credit usage. Also consider that workflows have a hard limit of {{$site.themeConfig.MAX_WORKFLOW_EXECUTION_LIMIT}} seconds.
