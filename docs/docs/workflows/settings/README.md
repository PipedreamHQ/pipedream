# Settings

You can control workflow-specific settings in your workflow's **Settings**:

1. Visit your workflow
2. Select the *...* menu at the top-right and click **Settings**:

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

## Execution Controls

### Execution Timeout Limit

Workflows have a default [execution limit](/limits/#time-per-execution), which defines the time workflows can run for a single invocation until they're timed out.

If your workflow times out, and needs to run for longer than the [default limit](/limits/#time-per-execution), you can change that limit here.

### Memory

By default, workflows run with `{{$site.themeConfig.MEMORY_LIMIT}}` of memory. If you're processing a lot of data in memory, you might need to raise that limit. Here, you can increase the memory of your workflow up to `{{$site.themeConfig.MEMORY_ABSOLUTE_LIMIT}}`.

**Pipedream charges invocations proportional to your memory configuration**. When you modify your memory settings, Pipedream will show you the number of invocations you'll be charged per execution. [Read more here](/pricing/#how-does-workflow-memory-affect-billable-invocations).

### Concurrency and Throttling

[Manage the concurrency and rate](/workflows/concurrency-and-throttling/) at which events from a source trigger your workflow code.

## Attachments

Sometimes, you'll need to reference static files in your workflow, like a CSV. Files uploaded in the **Attachments** section can be referenced in your workflow under the `steps.trigger.context.attachments` object.

For example, if you upload a file named `test.csv`, Pipedream will expose the _file path_ of the uploaded file at `steps.trigger.context.attachments["test.csv"]`. You can read the contents of the file using `fs.readFileSync`:

```javascript
import fs from "fs";

const fileData = fs.readFileSync(steps.trigger.context.attachments["test.csv"]).toString();
console.log(fileData);
```

<div>
<img alt="File attachment data" src="./images/attachment-file-data.png">
</div>

### Limits

Each attachment is limited to `10MB` in size. The total size of all attachments within a single workflow cannot exceed `200MB`.
