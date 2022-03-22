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

See the reference on [running asynchronous code on Pipedream](/workflows/steps/code/async/).

## Pipedream Internal Errors

Pipedream sets [limits](/limits/) on runtime, memory, and other execution-related properties. If you exceed these limits, you'll receive one of the errors below. [See the limits doc](/limits/) for details on specific limits.

### Invocations Quota Exceeded

On the [Developer (free) tier](/pricing/#developer-tier), Pipedream imposes a limit on the [daily invocations](/limits/#daily-invocations) across all workflows and sources. If you hit this limit, you'll see an **Invocations Quota Exceeded** error.

Paid plans, like the [Professional Tier](#professional-tier), have no invocations limit. [Upgrade here](https://pipedream.com/pricing). 

### Runtime Quota Exceeded

On the [Developer (free) tier](/pricing/#developer-tier), Pipedream imposes a limit on the [daily compute time](/limits/#compute-time-per-day) across all workflows and sources. If you hit this limit, you'll see a **Runtime Quota Exceeded** error.

Paid plans, like the [Professional Tier](#professional-tier), have no compute time limit. [Upgrade here](https://pipedream.com/pricing).

### Timeout

Event sources and workflows have a [default time limit on a given execution](/limits/#time-per-execution). If your code exceeds that limit, you may encounter a **Timeout** error.

To address timeouts, you'll either need to:

1. Figure out why your code is running for longer than expected. It's important to note that **timeouts are not an issue with Pipedream — they are specific to your workflow**. Often, you're making a request to a third party API doesn't respond in the time you expect, or you're processing a large amount of data in your workflow, and it doesn't complete before you hit the execution limit.
2. If it's expected that your code is taking a long time to run, you can raise the execution limit of a workflow in your [workflow's settings](/workflows/settings/#execution-timeout-limit). If you need to change the execution limit for an event source, please [reach out to our team](https://pipedream.com/support/).

### Out of Memory

Pipedream [limits the default memory](/limits/#memory) available to workflows and event sources. If you exceed this memory, you'll see an **Out of Memory** error.

This can happen for a variety of reasons. Normally, it can occur when you try to load a large file or object into a variable / memory. Where possible, consider streaming the file to / from disk, instead of storing it in memory, using a [technique like this](/workflows/steps/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory).

**You can raise the memory of your workflow [in your workflow's Settings](/workflows/settings/#memory)**.

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

Often, this occurs when you pass large data between steps using [step exports](/workflows/steps/#step-exports). You can avoid this error by [writing that data to the `/tmp` directory](/workflows/steps/code/nodejs/working-with-files/#writing-a-file-to-tmp) in one step, and [reading the data into another step](/workflows/steps/code/nodejs/working-with-files/#reading-a-file-from-tmp), which avoids the use of step exports and should keep you under the payload limit.

Pipedream also compresses the function payload from your workflow, which can yield roughly a 2x-3x increase in payload size (somewhere between `12MB` and `18MB`), depending on the data.

### JSON Nested Property Limit Exceeded

Working with nested JavaScript objects that have more than 256 nested objects will trigger a **JSON Nested Property Limit Exceeded** error.

Often, objects with this many nested objects result from a programming error that explodes the object in an unexpected way. Please confirm the code you're using to convert data into an object is correctly parsing the object.

### Event Queue Full

Workflows have a maximum event queue size when using concurrency and throttling controls. If the number of unprocessed events exceeds the [maximum queue size](/workflows/events/concurrency-and-throttling/#increasing-the-queue-size-for-a-workflow), you may encounter an **Event Queue Full** error.

[Paid plans](https://pipedream.com/pricing) can [increase their queue size up to {{$site.themeConfig.MAX_WORKFLOW_QUEUE_SIZE}}](/workflows/events/concurrency-and-throttling/#increasing-the-queue-size-for-a-workflow) for a given workflow.