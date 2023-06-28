# Settings

You can control workflow-specific settings in your workflow's **Settings**:

1. Visit your workflow
2. Select the _..._ menu at the top-right and click **Settings**:

<br />
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1656632132/docs/2022-06-30_16.35.17_g13fag.gif" alt="Click on the ... menu at the top-right and select Settings" width="300px">
<br />

[[toc]]

## Enable Workflow

If you'd like to pause your workflow from executing completely, you can disable it or reenable it here.

## Error Handling

By default, you'll receive notifications when your workflow throws an unhandled error. See the [error docs](/workflows/errors/) for more detail on these notifications.

You can disable these notifications for your workflow by disabling the **Notify me on errors** toggle:

<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1656631849/docs/Screen_Shot_2022-06-30_at_4.30.44_PM_oauty4.png" width="200px" alt="Notify me on errors toggle">

## Auto-retry Errors

Customers on the [**Advanced** Plan](https://pipedream.com/pricing) can automatically retry workflows on errors. If any step in your workflow throws an error, Pipedream will retry the workflow from that failed step, re-rerunning the step up to 8 times over a 10 hour span with an [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) strategy.

On error, the step will export a `$summary` property that tells you how many times the step has been retried, and an `$attempt` object with the following properties:

1. `error` — All the details of the error the step threw — the error, the stack, etc.
2. `cancel_url` — You can call this URL to cancel the retry
3. `rerun_url` — You can call this URL to proceed with the execution immediately
4. `resume_ts` — An ISO 8601 timestamp that tells you the timestamp of the next retry

<div>
  <img src="https://res.cloudinary.com/pipedreamin/image/upload/v1677119396/docs/Screen_Shot_2023-02-22_at_6.29.08_PM_ssnzsi.png" alt="Step exports for failed auto-retry">
</div>

If the step execution succeeds during any retry, the execution will proceed to the next step of the workflow.

If the step fails on all 8 retries and throws a final error, you'll receive [an error notification](/workflows/errors/) through your standard notification channel.

### Send error notifications on the first error

By default, if a step fails on all 8 retries, and throws a final error, you'll receive [an error notification](/workflows/errors/) through your standard notification channel. But sometimes you need to investigate errors as soon as they happen. If you're connecting to your database, and receive an error that the DB is down, you may want to investigate that immediately.

On any workflow with auto-retry enabled, you can optionally choose to **Send notification on first error**. This is disabled by default so you don't get emails for transient errors, but you can enable for critical workflows where you want visibility into all errors.

For custom control over error handling, you can implement error logic in code steps (e.g. `try` / `catch` statements in Node.js code), or [create your own custom error workflow](/workflows/errors/#process-errors-with-custom-logic-instead-of-email).

## Execution Controls

### Execution Timeout Limit

Workflows have a default [execution limit](/limits/#time-per-execution), which defines the time the workflow can run for a single execution until it's timed out.

If your workflow times out, and needs to run for longer than the [default limit](/limits/#time-per-execution), you can change that limit here.

### Memory

By default, workflows run with `{{$site.themeConfig.MEMORY_LIMIT}}` of memory. If you're processing a lot of data in memory, you might need to raise that limit. Here, you can increase the memory of your workflow up to `{{$site.themeConfig.MEMORY_ABSOLUTE_LIMIT}}`.

**Pipedream charges credits proportional to your memory configuration**. When you modify your memory settings, Pipedream will show you the number of credits you'll be charged per execution. [Read more here](/pricing/#how-does-workflow-memory-affect-credits).

### Concurrency and Throttling

[Manage the concurrency and rate](/workflows/concurrency-and-throttling/) at which events from a source trigger your workflow code.

## Eliminate cold starts

A **cold start** refers to the delay between the invocation of workflow and the execution of the workflow code. Cold starts happen when Pipedream spins up a new [execution environment](/privacy-and-security/#execution-environment) to handle incoming requests.

Specifically, cold starts occur on the first request to your workflow after a period of inactivity (roughly 5 minutes), or if your initial worker is already busy and a new worker needs to be initialized. In these cases, Pipedream creates a new execution environment to process your event. **Initializing this environment takes a few seconds, which delays the execution of this first event**.

You can reduce cold starts by configuring a number of dedicated **workers**:

1. Visit your workflow's **Settings**
2. Under **Execution Controls**, select the toggle to **Eliminate cold starts**
3. Configure [the appropriate number of workers](#how-many-workers-should-i-configure) for your use case

<br />
<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1686079534/docs/Screenshot_2023-06-06_at_12.24.03_PM_zctp50.png" alt="Warm workers configuration" />
</div>

When you configure workers for a specific workflow, Pipedream initializes dedicated workers — virtual machines that run Pipedream's [execution environment](/privacy-and-security/#execution-environment). [It can take a few minutes](#how-long-does-it-take-to-spin-up-a-dedicated-worker) for new dedicated workers to deploy. Once deployed, these workers are available at all times to respond to workflow executions, with no cold starts.

::: warning

You may need to configure [multiple dedicated workers](#how-many-workers-should-i-configure) to handle multiple, concurrent requests.

Pipedream also performs some initialization operations on new workflow runs, so you may still observe a small startup time (typically around 50ms per workflow step) on dedicated workers.

:::

### When should I configure dedicated workers?

You should configure dedicated workers when you need to process requests as soon as possible, with no latency.

For example, you may build an HTTP-triggered workflow that returns a synchronous HTTP response to a user, without delay. Or you may be building a Slack bot and need to respond to Slack's webhook within a few seconds. Since these workflows need to respond quickly, they're good cases to use dedicated workers.

### How many workers should I configure?

Incoming requests are handled by a single worker, one at a time. If you only receive one request a minute, and the workflow finishes execution in a few seconds, you may only need one worker.

But you might have a higher-volume app that receives two concurrent requests. In that case, Pipedream spins up **two** workers to handle each request.

For many user-facing (even internal) applications, the number of requests over time can be modeled with a [Poisson distrubution](https://en.wikipedia.org/wiki/Poisson_distribution). You can use that distribution to estimate the number of workers you need at an average time, or set it higher if you want to ensure a specific percentage of requests hit a dedicated worker. You can also save a record of all workflow runs to your own database, with the timestamp they ran ([see `steps.trigger.context.ts`](/workflows/events/#steps-trigger-context)), and look at your own pattern of requests, to compute the optimal number of workers.

### Do compute budgets apply to dedicated workers?

No, compute budgets do not apply to dedicated workers, they only apply to credits incurred by compute from running workflows, sources, etc.

### How long does it take to spin up a dedicated worker?

It can take 5-10 minutes for Pipedream to fully configure a new dedicated worker. Before that time, you may still observe cold starts with new incoming requests.

### Pricing for dedicated workers

You're charged {{$site.themeConfig.WARM_WORKERS_CREDITS_PER_INTERVAL}} credits for every {{$site.themeConfig.WARM_WORKERS_INTERVAL}} a dedicated worker is live, per worker, per {{$site.themeConfig.MEMORY_LIMIT}} memory. You can view the credits used by dedicated workers [in your billing settings](https://pipedream.com/settings/billing):

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1686015101/docs/Screenshot_2023-06-05_at_6.26.53_PM_stlljl.png" alt="Warm workers credit usage in billing" />
</div>

For example, if you run a single dedicated worker for 24 hours, that would cost 720 credits:

```
5 credits per 10 min
* 6 10-min periods per hour
* 24 hours
= 720 credits
```

{{$site.themeConfig.WARM_WORKERS_INTERVAL}} is the _minimum_ interval that Pipedream charges for usage. If you have a dedicated worker live for 1 minute, Pipedream will still charge {{$site.themeConfig.WARM_WORKERS_CREDITS_PER_INTERVAL}} credits.

Additionally, any change to dedicated worker configuration, (including worklow deploys) will result in an extra {{$site.themeConfig.WARM_WORKERS_CREDITS_PER_INTERVAL}} credits of usage.

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1686079387/docs/Screenshot_2023-06-06_at_12.23.03_PM_mpsqek.png" alt="Dedicated worker overlap" />
</div>

## Attachments

Sometimes, you'll need to reference static files in your workflow, like a CSV. Files uploaded in the **Attachments** section can be referenced in your workflow under the `steps.trigger.context.attachments` object.

For example, if you upload a file named `test.csv`, Pipedream will expose the _file path_ of the uploaded file at `steps.trigger.context.attachments["test.csv"]`. You can read the contents of the file using `fs.readFileSync`:

```javascript
import fs from "fs";

export default defineComponent({
  async run({ steps, $ }) {
    const fileData = fs
      .readFileSync(steps.trigger.context.attachments["test.csv"])
      .toString();
    console.log(fileData);
  },
})
```

<div>
<img alt="File attachment data" src="./images/attachment-file-data.png">
</div>

### Limits

Each attachment is limited to `25MB` in size. The total size of all attachments within a single workflow cannot exceed `200MB`.
