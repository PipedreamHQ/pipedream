---
prev: false
---

# Common Errors

Pipedream [sources](/event-sources/) and [workflows](/workflows) can throw errors for a variety of reasons. In some cases, you'll encounter an error sending data to a third-party API; in other cases, Pipedream will raise an error related to platform limits you've exceeded, or other internal errors.

This doc reviews common errors you'll encounter, and how to troubleshoot them.

[[toc]]

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

Currently, you can raise the execution limit of a workflow in your [workflow's settings](/workflows/settings/#execution-timeout-limit). If you need to change the execution limit for an event source, please [reach out to our team](/support/).

### Out of Memory

Pipedream [limits the default memory](/limits/#memory) available to workflows and event sources. If you exceed this memory, you'll see an **Out of Memory** error.

This can happen for a variety of reasons. Normally, it can occur when you try to load a large file or object into a variable / memory. Where possible, consider streaming the file to / from disk, instead of storing it in memory, using a [technique like this](https://github.com/sindresorhus/got#streams).

**This limit can be raised**. [Reach out to our team](/support/) to request an increase.

### Rate Limit Exceeded

Pipedream limits the number of events that can be processed by a given interface (e.g. HTTP endpoints) during a given interval. This limit is most commonly reached for HTTP interfaces - see the [QPS limits documentation](/limits/#qps-queries-per-second) for more information on that limit.

**This limit can be raised for HTTP endpoints**. [Reach out to our team](/support/) to request an increase.

### Request Entity Too Large

Pipedream limits the size of certain incoming event payloads (for example, the size of [incoming HTTP payloads](/limits/#http-request-body-size) and [emails](/limits/#email-triggers)). If you exceed this interface-specific limit, you'll see a **Request Entity Too Large** error.

Pipedream supports a [large file upload interface](/workflows/steps/triggers/#large-file-support) that allows you to send data up to 5TB in size via `multipart/form-data` requests. If you control the source of the data and can send your data in this manner, it's an effective way to bypass the standard payload limits.

Otherwise, [reach out to our team](/support/) to tell us more about your use case - we're hoping to increase these payload limits in the future.

### Function Payload Limit Exceeded

The total size of `console.log()` statements, [step exports](/workflows/steps/#step-exports), and the original event data sent to workflows and sources cannot exceed a combined size of `{{$site.themeConfig.FUNCTION_PAYLOAD_LIMIT}}`. If you produce logs or step exports larger than this - for example, passing around large API responses, CSVs, or other data - you may encounter a **Function Payload Limit Exceeded** in your workflow.

Often, this occurs when you pass large data between steps using [step exports](/workflows/steps/#step-exports). You can avoid this error by [writing that data to the `/tmp` directory](/workflows/steps/code/nodejs/working-with-files/#writing-a-file-to-tmp) in one step, and [reading the data into another step](/workflows/steps/code/nodejs/working-with-files/#reading-a-file-from-tmp), which avoids the use of step exports and should keep you under the payload limit.

### JSON Nested Property Limit Exceeded

Working with nested JavaScript objects that have more than 256 nested objects will trigger a **JSON Nested Property Limit Exceeded** error.

Often, objects with this many nested objects result from a programming error that explodes the object in an unexpected way. Please confirm the code you're using to convert data into an object is correctly parsing the object.

<Footer />
