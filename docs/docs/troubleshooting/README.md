# Troubleshooting Common Issues

This doc describes some common solutions for fixing issues with [pipedream.com](https://pipedream.com) or with a specific workflow.

[[toc]]

## A feature isn't working on pipedream.com

If you're seeing an issue with [pipedream.com](https://pipedream.com) (for example, the site won't load, or you think you've found a bug), try each of the following steps, checking to see if they fix the problem:

1. [Hard refresh](https://fabricdigital.co.nz/blog/how-to-hard-refresh-your-browser-and-clear-cache) pipedream.com in your browser.

2. Log out of your pipedream.com account, and log back in.

3. [Disable your browser extensions](https://www.computerhope.com/issues/ch001411.htm) or use features like [Chrome Guest mode](https://support.google.com/chrome/answer/6130773?hl=en&co=GENIE.Platform%3DAndroid) to browse pipedream.com without any existing extensions / cookies / cache.

If you're still seeing the issue after trying these steps, please [report a bug](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+).

## My workflow isn't working

If you're encountering a specific issue in a workflow, try the following steps, checking to see if they fix the problem:

1. Make a trivial change to your workflow, and **Deploy** your workflow again.

2. Try searching [the community](https://pipedream.com/support) or [the `pipedream` GitHub repo](https://github.com/PipedreamHQ/pipedream/issues) to see if anyone else has solved the same issue.

3. [Copy your workflow](/workflows/copy/) to see if the issue persists on the new workflow.

If you're still seeing the issue after trying these steps, please reach out in [the community](https://pipedream.com/support).

## Why is my trigger not emitting events?

Most Pipedream sources fall into one of two categories: webhook-based or timer-based.

### Webhook-based instant sources

- These sources will get triggered immediately. But because events come in in real-time, most will **not** automatically fetch historical events upon creation.
- To surface test events in your workflow while building, you'll need to generate an eligible event in the selected app.
- For example, if you've configured the "[Message Updates (Instant)](https://pipedream.com/apps/telegram-bot-api/triggers/message-updates) Telegram source, you'll need to send a message in the Telegram account you've selected in order for an event to appear.
  ![Select an event](https://res.cloudinary.com/pipedreamin/image/upload/v1653434586/docs/webhook-triggers-select-event_qj7nlp.png)
- Sources for apps like [Telegram](https://pipedream.com/apps/telegram-bot-api/triggers/message-updates) and [Google Sheets](https://pipedream.com/apps/google-sheets/triggers/new-row-added) use webhooks and get triggered immediately.

### Timer-based polling sources

- These sources will fetch new events on a regular interval, based on a schedule you specify in the trigger configuration.
  ![Configure polling timer](https://res.cloudinary.com/pipedreamin/image/upload/v1653434591/docs/polling-triggers-timer_ooz26c.png)
- In most cases, Pipedream will automatically fetch recent historical events to help enable easier workflow development.
- Sources for apps like [Twitter](https://pipedream.com/apps/twitter/triggers/search-mentions) and [Spotify](https://pipedream.com/apps/spotify/triggers/new-playlist) require we poll their endpoints in order to fetch new events.

## Where do I find my workflow's ID?

Open [https://pipedream.com](https://pipedream.com) and visit your workflow. Copy the URL that appears in your browser's address bar. For example:

```
https://pipedream.com/@dylburger/p_abc123/edit
```

Your workflow's ID is the value that starts with `p_`. In this example: `p_abc123`.

## Where do I find my event source's ID?

Open [https://pipedream.com/sources](https://pipedream.com/sources) and click on your event source. Copy the URL that appears in your browser's address bar. For example:

```
https://pipedream.com/sources/dc_abc123
```

Your source's ID is the value that starts with `dc_`. In this example: `dc_abc123`.

## Warnings

Pipedream displays warnings below steps in certain conditions. These warnings do not stop the execution of your workflow, but can signal an issue you should be aware of.

### This step was still trying to run code when the step ended. Make sure you await all Promises, or promisify callback functions.

See the reference on [running asynchronous code on Pipedream](/code/nodejs/async/).

## Pipedream Internal Errors

Pipedream sets [limits](/limits/) on runtime, memory, and other execution-related properties. If you exceed these limits, you'll receive one of the errors below. [See the limits doc](/limits/) for details on specific limits.

### Quota Exceeded

On the Free tier, Pipedream imposes a limit on the [daily credits](/limits/#daily-credits-limit) across all workflows and sources. If you hit this limit, you'll see a **Quota Exceeded** error.

Paid plans have no credit limit. [Upgrade here](https://pipedream.com/pricing).

### Runtime Quota Exceeded

You **do not** use credits testing workflows, but workspaces on the **Free** plan are limited to {{$site.themeConfig.DAILY_TESTING_LIMIT}} of test runtime per day. If you exceed this limit when testing in the builder, you'll see a **Runtime Quota Exceeded** error.

### Timeout

Event sources and workflows have a [default time limit on a given execution](/limits/#time-per-execution). If your code exceeds that limit, you may encounter a **Timeout** error.

To address timeouts, you'll either need to:

1. Figure out why your code is running for longer than expected. It's important to note that **timeouts are not an issue with Pipedream — they are specific to your workflow**. Often, you're making a request to a third party API that doesn't respond in the time you expect, or you're processing a large amount of data in your workflow, and it doesn't complete before you hit the execution limit.
2. If it's expected that your code is taking a long time to run, you can raise the execution limit of a workflow in your [workflow's settings](/workflows/settings/#execution-timeout-limit). If you need to change the execution limit for an event source, please [reach out to our team](https://pipedream.com/support/).

### Out of Memory

Pipedream [limits the default memory](/limits/#memory) available to workflows and event sources. If you exceed this memory, you'll see an **Out of Memory** error. **You can raise the memory of your workflow [in your workflow's Settings](/workflows/settings/#memory)**.

This can happen for two main reasons:

1. When you load a large file or object into the workflow's memory (e.g. when you save the content in a variable). Where possible, consider streaming the file to / from disk, instead of storing it in memory, using a [technique like this](/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory).
2. When you have many steps in your Pipedream workflow. When your workflow runs, Pipedream runs a separate process for each step in your workflow. That incurs some memory overhead. Typically this happens when you have more than 8-10 steps. When you see an OOM error on a workflow with many steps, try increasing the memory.

### Rate Limit Exceeded

Pipedream limits the number of events that can be processed by a given interface (e.g. HTTP endpoints) during a given interval. This limit is most commonly reached for HTTP interfaces - see the [QPS limits documentation](/limits/#qps-queries-per-second) for more information on that limit.

**This limit can be raised for HTTP endpoints**. [Reach out to our team](https://pipedream.com/support/) to request an increase.

### Request Entity Too Large

By default, Pipedream limits the size of incoming HTTP payloads. If you exceed this limit, you'll see a **Request Entity Too Large** error.

Pipedream supports two different ways to bypass this limit. Both of these interfaces support uploading data up to `5TB`, though you may encounter other [platform limits](/limits/).

- You can send large HTTP payloads by passing the `pipedream_upload_body=1` query string or an `x-pd-upload-body: 1` HTTP header in your HTTP request. [Read more here](/workflows/steps/triggers/#sending-large-payloads).
- You can upload multiple large files, like images and videos, using the [large file upload interface](/workflows/steps/triggers/#large-file-support).

### Function Payload Limit Exceeded

The total size of `console.log()` statements, [step exports](/workflows/steps/#step-exports), and the original event data sent to workflows and sources cannot exceed a combined size of `{{$site.themeConfig.FUNCTION_PAYLOAD_LIMIT}}`. If you produce logs or step exports larger than this - for example, passing around large API responses, CSVs, or other data - you may encounter a **Function Payload Limit Exceeded** in your workflow.

Often, this occurs when you pass large data between steps using [step exports](/workflows/steps/#step-exports). You can avoid this error by [writing that data to the `/tmp` directory](/code/nodejs/working-with-files/#writing-a-file-to-tmp) in one step, and [reading the data into another step](/code/nodejs/working-with-files/#reading-a-file-from-tmp), which avoids the use of step exports and should keep you under the payload limit.

Pipedream also compresses the function payload from your workflow, which can yield roughly a 2x-3x increase in payload size (somewhere between `12MB` and `18MB`), depending on the data.

### JSON Nested Property Limit Exceeded

Working with nested JavaScript objects that have more than 256 nested objects will trigger a **JSON Nested Property Limit Exceeded** error.

Often, objects with this many nested objects result from a programming error that explodes the object in an unexpected way. Please confirm the code you're using to convert data into an object is correctly parsing the object.

### Event Queue Full

Workflows have a maximum event queue size when using concurrency and throttling controls. If the number of unprocessed events exceeds the [maximum queue size](/workflows/concurrency-and-throttling/#increasing-the-queue-size-for-a-workflow), you may encounter an **Event Queue Full** error.

[Paid plans](https://pipedream.com/pricing) can [increase their queue size up to {{$site.themeConfig.MAX_WORKFLOW_QUEUE_SIZE}}](/workflows/concurrency-and-throttling/#increasing-the-queue-size-for-a-workflow) for a given workflow.

### Credit Budget Exceeded

Credit Budgets are configurable limits on your credit usage at the account or workspace level.

If you're receiving this warning on a source or workflow, this means your allocated Credit Budget has been reached for the defined period.

You can increase this limit at any time in the [billing area of your settings](https://pipedream.com/settings/billing).

## How do I contact Pipedream Support?

Start by filling out the request form at [https://pipedream.com/support](https://pipedream.com/support), providing detailed information about your issue.

### How do I share my workflow with Support?

First, navigate to your **Project Settings** and share your project with Pipedream Support.

If your workflow is _not_ part of a Project, go to the **Workflow Settings** to grant access to us.

When filling out the request form at [https://pipedream.com/support](https://pipedream.com/support), please provide detailed information along with the URL from your browser's address bar, which should look something like:

```
https://pipedream.com/@yourworkspace/projects/yourproject/test-workflow-pabc123
```

## Frequently-asked questions

### How do I resolve the error "Undeployed changes — You have made changes to this workflow. Deploy the latest version from the editor"

On workflows that are not [synced with GitHub](/projects/git/), you may notice the following warning at the top of your workflow:

> **Undeployed changes** — You have made changes to this workflow. Deploy the latest version from the editor

This means that you've made some changes to your workflow that you haven't yet deployed. To see a diff of what's changed, we recommend [enabling GitHub sync](/projects/git/), where you'll get a full commit history of changes made to your workflows, synced to your own GitHub repo.

### Is there a way to replay workflow events programmatically?

Not today. Please upvote and add your feedback to [this GitHub issue](https://github.com/PipedreamHQ/pipedream/issues/2784).

### How do I store and retrieve data across workflow executions?

If you operate your own database or data store, you can connect to it directly in Pipedream.

Pipedream also operates a [built-in key-value store](/data-stores/) that you can use to get and set data across workflow executions and different workflows.

### How do I delay the execution of a workflow?

Use Pipedream's [built-in Delay actions](/workflows/flow-control/#delay) to delay a workflow at any step.

### How can I save common functions as steps?

You can create your own custom triggers and actions ("components") on Pipedream using [the Component API](/components/api/). These components are private to your account and can be used in any workflow.

You can also publish common functions in your own package on a public registry like [npm](https://www.npmjs.com/) or [PyPI](https://pypi.org/).

### Is Puppeteer supported in Pipedream?

Yes, see [our Puppeteer docs](/code/nodejs/browser-automation/#puppeteer) for more detail.

### Is Playwright supported in Pipedream?

Yes, see [our Puppeteer docs](/code/nodejs/browser-automation/#playwright) for more detail.
