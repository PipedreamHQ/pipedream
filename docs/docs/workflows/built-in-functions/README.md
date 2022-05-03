---
short_description: Use Pipedream built-in functions to filter, delay, and perform other common operations.
---

# Built-In Functions

Use Pipedream built-in functions to filter, delay, and perform other common operations.

[[toc]]

## Delay

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

### How invocations are charged for delayed invocations

Each time a workflow is resumed from a paused state, Pipedream charges another [invocation](/pricing/#invocations). For example, if you pause your workflow once, each incoming event will charge two invocations: one for the steps before the delay, and another for the steps that ran after the delay.

You are not charged [compute time](/limits/#compute-time-per-day) for the time your workflow is paused.

### Cancelling or resuming execution manually

The [**Delay** actions](#delay-actions) and [`$.flow.delay`](/code/nodejs/delay/) return two URLs each time they run:

![Cancel and resume URLs](https://res.cloudinary.com/pipedreamin/image/upload/v1651551860/docs/Screen_Shot_2022-05-02_at_9.16.11_PM_ahw7tu.png)

These URLs are specific to a single execution of your workflow. While the workflow is paused, you can load these in your browser or send an HTTP request to either:

- Hitting the `cancel_url` will immediately cancel that execution
- Hitting the `resume_url` will immediately resume that execution early

If you use [`$.flow.delay`](/code/nodejs/delay/), you can send these URLs to your own system to handle cancellation / resumption. You can even email your customers to let them cancel / resume workflows that run on their behalf.

## Filter

Using filters within your workflow allows you to only proceed when certain conditions are met. You can configure specific criteria that must be met, as well as whether you'd like to stop or proceed with your workflow. Filters are a simple yet powerful tool for customizing your workflow, and can be a few different ways:

1. One of the built-in **Filter** actions
2. `$.flow.exit` in code 

### Filter actions

To apply filters within your workflow without writing any code,

1. Click the **+** button below any step
2. Search for the **Filter** app
3. Select the action that makes sense for your use case

#### Continue or End Workflow on Condition

These actions let you configure the specific condition you'd like to evaluate:

- **Value type**: What type of input would you like to evaluate?
- **Condition**: Based on the value type, what is the condition to evaluate?
- **Value to evaluate**: The field you want to check (e.g., something like, "Name").
- **Value to compare against**: The value you want to compare the field against (e.g., something like, "Luke Skywalker").

![Filter step](https://res.cloudinary.com/pipedreamin/image/upload/v1651610369/docs/components/Screenshot_2022-05-03_at_1.31.57_PM_glsds4.png)

#### End Workflow on Custom Condition

This is a basic action that will immediately end your workflow. You can also add an optional prop that must evaluate to `true` (the most common use case here would be to evaluate the output of an earlier step within the workflow).

### Using `$.flow.exit` in code

If you need to extend the functionality even further and want to do this in code, [check out the docs](/code/nodejs/#ending-a-workflow-early) on `$.flow.exit()`.