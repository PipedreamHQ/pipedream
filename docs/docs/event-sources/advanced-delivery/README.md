# Event Queue Controls

Pipedream makes it easy to manage the concurrency and rate at which events from a source trigger your workflow code using event queue controls.

## Why Is It Important?

Workflows listen for events and execute code as soon as they are triggered. While this works for many use cases, this behavior can have unintended consequences:

- If multiple events occur over a short period of time, there is no guarantee that they will complete execution in the order in which they were triggered
- If you are trying to maintain state between executions (e.g., using $checkpoint) you can have race conditions
- When integrating with 3rd party APIs, you may hit rate limits or race conditions may cause data loss

Event queues help to solve these problems by giving you control over the concurrency and rate at which a workflow is triggered. 

## How It Works

Events emitted from a source to a workflow are placed in a queue, and Pipedream triggers your workflow with events from the queue based on your concurrency and rate limit settings. These settings may be customized per workflow (so the same events may be processed at different rates by different workflows).

**[IMAGE]**

The maximum number of events Pipedream will queue per workflow depends on your account type.

- Up to 100 events will be queued per workflow for free accounts
- Paid accounts will have higher limits
- Team/Enterprise accounts may have custom limits. If you need a larger queue size, please contact Pipedream.

If the number of events exceeds the cache size, events will be lost. If that happens, an error message will be displayed in the event list of your workflow and your global error queue will be triggered. 

For more context on this feature and technical details, check out our **engineering blog post [need to link]**.

## Where Do I Manage Event Queues?

Event queues can be managed in your workflow settings. Event queues are currently supported for any workflow that is triggered by an event source (event queues are not currently supported for native workflow triggers).

**[SCREENSHOT]**

## Managing Concurency

Concurrency controls define how many events can be executed in parallel. When you select an event source as a workflow trigger, Pipedream defaults the concurrency to `1` so only one event is processed by your workflow at a time. This guarantees that each event will only be processed once the execution for the previous event is complete. This is valuable when events must be executed in order, or when using `$checkpoint` for state management (in order execution prevents race conditions from events being executed in parallel).

To execute events in parallel increase the number of workers (the number of workers defines the maximum number of concurrent events that may be processed), or disable concurrency controls for unlimited parallelization.

To pause events from triggering a workflow, set the number of workers to `0`. To resume, set the number of workers to `1` or more. Pipedream will continue triggering the workflow starting with the oldest event from the queue.

## Managing Rate of Execution

- Pipedream guarantees that events will be executed by your workflow in the order they are emitted. 
- Settings may be customized per workflow. Therefore, workflows can execute events from the same source at two different rates. F
