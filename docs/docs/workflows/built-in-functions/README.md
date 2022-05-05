---
short_description: Use Pipedream built-in functions to filter, delay, and perform other common operations.
---

# Built-In Functions

Use Pipedream built-in functions to filter, delay, and perform other common operations.

[[toc]]

## Delay

<VideoPlayer title="Delaying Workflow Steps" url="https://www.youtube.com/embed/IBORwBnIZ-k" />

Sometimes you need to wait a specific amount of time before the next step of your workflow proceeds. Pipedream supports this in one of two ways:

1. The built-in **Delay** actions
2. The `$.flow.delay` function in Node.js

{{$site.themeConfig.DELAY_MIN_MAX_TIME}}. For example, we at Pipedream use this functionality to delay welcome emails to our customers until they've had a chance to use the product.

### Delay actions

You can pause your workflow without writing code using the **Delay** actions:

1. Click the **+** button below any step
2. Search for the **Delay** app
3. Select the **Delay Workflow** action
4. Configure the action to delay any amount of time, up to one year

![Workflow delay step](https://res.cloudinary.com/pipedreamin/image/upload/v1651551140/docs/Screen_Shot_2022-05-02_at_8.26.46_PM_hfhil5.png)

### `$.flow.delay`

If you need to delay a workflow within Node.js code, or you need detailed control over how delays occur, [see the docs on `$.flow.delay`](/code/nodejs/delay/).

### The state of delayed executions

Delayed executions can hold one of three states:

- **Paused**: The execution is within the delay window, and the workflow is still paused
- **Resumed**: The workflow has been resumed at the end of its delay window automatically, or resumed manually
- **Cancelled**: The execution was cancelled manually

You'll see the current state of an execution by [viewing its event data](/workflows/events/inspect/).

### Cancelling or resuming execution manually

The [**Delay** actions](#delay-actions) and [`$.flow.delay`](/code/nodejs/delay/) return two URLs each time they run:

![Cancel and resume URLs](https://res.cloudinary.com/pipedreamin/image/upload/v1651551860/docs/Screen_Shot_2022-05-02_at_9.16.11_PM_ahw7tu.png)

These URLs are specific to a single execution of your workflow. While the workflow is paused, you can load these in your browser or send an HTTP request to either:

- Hitting the `cancel_url` will immediately cancel that execution
- Hitting the `resume_url` will immediately resume that execution early

If you use [`$.flow.delay`](/code/nodejs/delay/), you can send these URLs to your own system to handle cancellation / resumption. You can even email your customers to let them cancel / resume workflows that run on their behalf.

## Filter

<VideoPlayer title="Conditionally run Workflows" url="https://www.youtube.com/embed/sajgIH3dG58" />

Use the Filter action to quickly stop or continue workflows on certain conditions.

![Create a filter action](https://res.cloudinary.com/pipedreamin/image/upload/v1651603927/docs/animations/CleanShot_2022-05-03_at_13.51.17_za1skw.gif)

Add a filter action to your workflow by searching for the **Filter** app in a new step.

The **Filter** app includes several built-in actions: Continue Workflow on Condition, Exit Workflow on Condition and Exit Workflow on Custom Condition.

In each of these actions, the **Value** is the subject of the condition, and the **Condition** is the operand to compare the value against.

For example, to only process orders with a `status = ready`

### Continue Workflow on Condition

With this action, only when values that _pass_ a set condition will the workflow continue to execute steps after this filter.

