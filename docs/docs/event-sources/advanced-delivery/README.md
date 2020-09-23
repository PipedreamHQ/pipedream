# Advanced Delivery Controls

Pipedream's advanced delivery controls make it easy to manage the concurrency and rate at which events from a source trigger your workflow code.

## How It Works

Events emitted from a source to a workflow are placed in a queue, and Pipedream triggers your workflow with events from the queuea based on your concurrency and rate limit settings. These settings may be customized per workflow (so the same events may be processed at different rates by different workflows).

The maximum number of events Pipedream will queue per workflow depends on your account type.

- Up to 100 events will be queued per workflow for free accounts
- Paid accounts will have higher limits
- Team/Enterprise accounts may have custom limits. If you need a larger queue size, please contact Pipedream.

If the number of events exceeds the cache size, events will be lost. If that happens, and error message will be displayed in the event list of your workflow, your global error queue will be triggered. 

## Managing Concurency

Concurrency controls define how many events can be executed in parallel. When you select an event source as a workflow trigger, Pipedream defaults the concurrency to `1` so only one event is processed by your workflow at a time. This guarantees that each event will only be processed once the execution for the previous event is complete. This is valuable when events must be executed in order, or when using `$checkpoint` for state management (in order execution prevents race conditions from events being executed in parallel).

To execute events in parallel increase the number of workers (the number of workers defines the maximum number of concurrent events that may be processed), or disable concurrency controls for unlimited parallelization.

To pause events from triggering a workflow, set the number of workers to `0`. To resume, set the number of workers to `1` or more. Pipedream will continue triggering the workflow starting with the oldest event from the queue.

## Managing Rate of Execution



- Pipedream guarantees that events will be executed by your workflow in the order they are emitted. 
- Settings may be customized per workflow. Therefore, workflows can execute events from the same source at two different rates. F

## Examples

We're review two examples to explain the benefits of concurrency and rate limit controls.

### Sending Data to Google Sheets

Sending data to Google Sheets is a common use case on Pipedream.

 

- By default, Pipedream will enforce single concurrent executions and a rate limit of one event per second. However, you have full control to customize these settings.
- These settings   
- Pipedream will cache up to 100 events per 



All emits (from any attached emitters) go into a single queue that can be rate limited and/or linearized In the case of the multiple emitters, they can be interleavedThat queue is capped, meaning we will drop any new events when it reaches capacity.Rate limiting and in order delivery can be used concurrently (e.g., execute events in order and send to workflow at a max rate of 1 EPS)As a user, I am notified if events are being dropped because I hit my queue limit via the error workflowMVP Constraints This feature will only work for event sources (not native triggers)Only EPS or configurable windows -- e.g., N seconds, N minutes, etc?The cap size will not be configurable by user for the MVP (e.g., this could be something we want for premium accounts in the future). Cap size for MVP tbd?Rate limiting for consumption via the event source SSE API is out of scope for the MVP (pravin to do product work on API consumption)



[Like events](/event-sources/), logs can also be consumed programmatically:



\- Connecting to the [SSE stream](/api/sse/) directly

\- Using the [`pd logs`](#pd-logs) CLI command