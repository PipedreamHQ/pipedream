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

## Error Reruns

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

If the step fails on all 8 retries, it throws the final error, and you should receive [an error notification](/workflows/errors/) through your standard notification channel.

## Execution Controls

### Execution Timeout Limit

Workflows have a default [execution limit](/limits/#time-per-execution), which defines the time the workflow can run for a single execution until it's timed out.

If your workflow times out, and needs to run for longer than the [default limit](/limits/#time-per-execution), you can change that limit here.

### Memory

By default, workflows run with `{{$site.themeConfig.MEMORY_LIMIT}}` of memory. If you're processing a lot of data in memory, you might need to raise that limit. Here, you can increase the memory of your workflow up to `{{$site.themeConfig.MEMORY_ABSOLUTE_LIMIT}}`.

**Pipedream charges credits proportional to your memory configuration**. When you modify your memory settings, Pipedream will show you the number of credits you'll be charged per execution. [Read more here](/pricing/#how-does-workflow-memory-affect-credits).

### Concurrency and Throttling

[Manage the concurrency and rate](/workflows/concurrency-and-throttling/) at which events from a source trigger your workflow code.

## Attachments

Sometimes, you'll need to reference static files in your workflow, like a CSV. Files uploaded in the **Attachments** section can be referenced in your workflow under the `steps.trigger.context.attachments` object.

For example, if you upload a file named `test.csv`, Pipedream will expose the _file path_ of the uploaded file at `steps.trigger.context.attachments["test.csv"]`. You can read the contents of the file using `fs.readFileSync`:

```javascript
import fs from "fs";

const fileData = fs
  .readFileSync(steps.trigger.context.attachments["test.csv"])
  .toString();
console.log(fileData);
```

<div>
<img alt="File attachment data" src="./images/attachment-file-data.png">
</div>

### Limits

Each attachment is limited to `25MB` in size. The total size of all attachments within a single workflow cannot exceed `200MB`.
