# What are events?

Events trigger workflow executions. The event that triggers your workflow depends on the trigger you select for your workflow:

- [HTTP triggers](/workflows/steps/triggers/#http) execute your workflow on HTTP requests.

- [Cron triggers](/workflows/steps/triggers/#cron-scheduler) execute your workflow on a time schedule (e.g., on an interval).

- [Email triggers](/workflows/steps/triggers/#email) execute your workflow on inbound emails.

## Event format

When you send an event to your workflow, we take the trigger data — for example, the HTTP payload, headers, etc. — and add our own Pipedream metadata to it.

For all trigger types, this data is exposed as a JavaScript object you can reference in the rest of your workflow, using either of two variables:

- `event`
- `steps.trigger.event`

When you click on an event in the Inspector, we show you the contents of `steps.trigger.event` directly under your trigger step.

You can reference your event data in any [code](/workflows/steps/code/) or [action](/workflows/steps/actions/) step. See those docs or the general [docs on passing data between steps](/workflows/steps/) for more information.

The specific shape of `event` varies with the trigger type:

### HTTP

| Property             |                      Description                      |
| -------------------- | :---------------------------------------------------: |
| `body`               | A string or object representation of the HTTP payload |
| `client_ip`          |    IP address of the client that made the request     |
| `headers`            |        HTTP headers, represented as an object         |
| `inferred_body_type` |                  For example, `JSON`                  |
| `method`             |                      HTTP method                      |
| `url`                |                  Request host + path                  |

### Cron Scheduler

| Property       |                Description                |
| -------------- | :---------------------------------------: |
| `timer_config` |   String representation of the schedule   |
| `timestamp`    | The epoch timestamp when the workflow ran |

### Email

We use Amazon SES to receive emails for the email trigger. You can find the shape of the event in the [SES docs](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-notifications-contents.html).

### `raw_event`

In addition to the formatted object we expose in `event`, you have access to the raw, protocol-specific data from the event, as well.

You can access this data in `steps.trigger.raw_event`. The contents also vary with the trigger type:

- HTTP : scheme, URI, and base64-encoded raw payload.
- Cron Scheduler : same as `event`.
- Email : same as `event`.

## Event observability

Pipedream provides observability for the event that triggered your workflow, including into the trigger event and step-level workflow execution. Just [select an event from the inspector](/workflows/events/inspect/) to view its contents.

<Footer />
