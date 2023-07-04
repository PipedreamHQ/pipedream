# Events

Events trigger workflow executions. The event that triggers your workflow depends on the trigger you select for your workflow:

- [HTTP triggers](/workflows/steps/triggers/#http) invoke your workflow on HTTP requests.
- [Cron triggers](/workflows/steps/triggers/#schedule) invoke your workflow on a time schedule (e.g., on an interval).
- [Email triggers](/workflows/steps/triggers/#email) invoke your workflow on inbound emails.
- [Event sources](/workflows/steps/triggers/#app-based-triggers) invoke your workflow on events from apps like Twitter, Google Calendar, and more.

---

[[toc]]

## Selecting a test event

When you test any step in your workflow, Pipedream passes the test event you select in the trigger step:

![Selecting a test event in the trigger](https://res.cloudinary.com/pipedreamin/image/upload/v1648758487/docs/components/CleanShot_2022-03-31_at_16.24.34_pb9jzt.png)

You can select any event you've previously sent to your trigger as your test event, or send a new one.

## Examining event data

When you select an event, you'll see [the incoming event data](#event-format) and the [event context](#steps-trigger-context) for that event:

![The event and context in a trigger initiation](https://res.cloudinary.com/pipedreamin/image/upload/v1648759141/docs/components/CleanShot_2022-03-31_at_16.30.37_jwwwdy.png)

Pipedream parses your incoming data and exposes it in the variable [`steps.trigger.event`](#event-format), which you can access in any [workflow step](/workflows/steps/).

## Copying references to event data

When you're [examining event data](#examining-event-data), you'll commonly want to copy the name of the variable that points to the data you need to reference in another step.

Hover over the property whose data you want to reference, and click the **Copy Path** button to its right:

![Copy an event path](https://res.cloudinary.com/pipedreamin/image/upload/v1648759215/docs/components/CleanShot_2022-03-31_at_16.39.56_lsus2o.gif)

## Copying the values of event data

You can also copy the value of specific properties of your event data. Hover over the property whose data you want to copy, and click the **Copy Value** button to its right:

![Copy event attribute value](https://res.cloudinary.com/pipedreamin/image/upload/v1648759275/docs/components/CleanShot_2022-03-31_at_16.41.02_xgzcsa.gif)

## Event format

When you send an event to your workflow, Pipedream takes the trigger data — for example, the HTTP payload, headers, etc. — and adds our own Pipedream metadata to it.

**This data is exposed in the `steps.trigger.event` variable. You can reference this variable in any step of your workflow**.

You can reference your event data in any [code](/code/) or [action](/components#actions) step. See those docs or the general [docs on passing data between steps](/workflows/steps/) for more information.

The specific shape of `steps.trigger.event` depends on the trigger type:

### HTTP

| Property    |                      Description                      |
| ----------- | :---------------------------------------------------: |
| `body`      | A string or object representation of the HTTP payload |
| `client_ip` |    IP address of the client that made the request     |
| `headers`   |        HTTP headers, represented as an object         |
| `method`    |                      HTTP method                      |
| `path`      |                   HTTP request path                   |
| `query`     |                     Query string                      |
| `url`       |                  Request host + path                  |

### Cron Scheduler

| Property              |                                           Description                                           |
| --------------------- | :---------------------------------------------------------------------------------------------: |
| `interval_seconds`    |                       The number of seconds between scheduled executions                        |
| `cron`                |                 When you've configured a custom cron schedule, the cron string                  |
| `timestamp`           |                            The epoch timestamp when the workflow ran                            |
| `timezone_configured` | An object with formatted datetime data for the given execution, tied to the schedule's timezone |
| `timezone_utc`        |    An object with formatted datetime data for the given execution, tied to the UTC timezone     |

### Email

We use Amazon SES to receive emails for the email trigger. You can find the shape of the event in the [SES docs](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-notifications-contents.html).

## `steps.trigger.context`

`steps.trigger.event` contain your event's **data**. `steps.trigger.context` contains _metadata_ about the workflow and the execution tied to this event.

You can use the data in `steps.trigger.context` to uniquely identify the Pipedream event ID, the timestamp at which the event invoked the workflow, and more:

| Property           |                                                    Description                                                    |
| ------------------ | :---------------------------------------------------------------------------------------------------------------: |
| `deployment_id`    |                     A globally-unique string representing the current version of the workflow                     |
| `id`               |                A unique, Pipedream-provided identifier for the event that triggered this workflow                 |
| `owner_id`         |      The Pipedream-assigned [workspace ID](/workspaces/#finding-your-workspace-s-id) that owns the workflow       |
| `platform_version` |                       The version of the Pipedream execution environment this event ran on                        |
| `replay`           |                               A boolean, whether the event was replayed via the UI                                |
| `trace_id`         | Holds the same value for all executions tied to an original event. [See below for more details](#id-vs-trace-id). |
| `ts`               |                          The ISO 8601 timestamp at which the event invoked the workflow                           |
| `workflow_id`      |                                                  The workflow ID                                                  |
| `workflow_name`    |                                                 The workflow name                                                 |

### `id` vs. `trace_id`

`steps.trigger.context.id` should be unique for every execution of a workflow.

`steps.trigger.context.trace_id` will hold the same value for all executions tied to the same original event, e.g. if you have auto-retry enabled and it retries a workflow three times, id will change, but trace_id will remain the same. For example, if you call `$.flow.suspend()` on a workflow, we run a new execution after the suspend, so you'd see two total executions: `id` will be unique before and after the suspend, but `trace_id` will be the same.

You may notice other properties in `context`. These are used internally by Pipedream, and are subject to change.

## Limits on events queue

On the Free and Basic plans, only the last 100 events are retained for each workflow. After 100 events have been processed, Pipedream will delete the oldest event data as new events arrive, keeping only the last 100 events.

The Advanced and Business tiers have an upgraded amount of events in the queue, [please see the pricing page](https://pipedream.com/pricing) for more details.

::: tip

For an extended history of events across all of your workflows, included processed events, with the ability to filter by status and time range, please see the [Event History](/event-history/).

:::

<Footer />
