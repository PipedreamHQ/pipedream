# Settings

You can control workflow-specific settings in the **Settings** header, just above your workflow's code.

<div>
<img alt="Workflow settings" src="./images/workflow-settings.png">
</div>

[[toc]]

## Errors

By default, any errors raised in a workflow are sent to your registered email address. You'll receive an email with the details of the error, once per error, per workflow, per 24-hour period. 

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

Sometimes, you'll need to reference static files in your workflow, like a CSV. Files uploaded in the **Attachments** section can be referenced in your workflow using the `$attachments` object.

For example, if you upload a file named `test.csv`, Pipedream will expose the _file path_ of the uploaded file at `$attachments["test.csv"]`. You can read the contents of the file using `fs.readFileSync`:

```javascript
import fs from "fs";

const fileData = fs.readFileSync($attachments["test.csv"]).toString();
console.log(fileData);
```

<div>
<img alt="File attachment data" src="./images/attachment-file-data.png">
</div>

### Limits

Each attachment is limited to `10MB` in size. The total size of all attachments within a single workflow cannot exceed `200MB`.
