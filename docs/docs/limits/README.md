---
prev: false
next: false
---

# Limits

Pipedream imposes limits on source and workflow execution, the events you send to Pipedream, and other properties. You'll receive an error if you encounter these limits. See our [troubleshooting guide](/troubleshooting/) for more information on these specific errors.

Some of these limits apply only on the free tier. For example, Pipedream limits the daily number of credits and active workflows you can use on the free tier. **On paid tiers, you can run an unlimited number of credits per day, for any amount of execution time**.

Other limits apply across the free and paid tiers. Please see the details on each limit below.

**These limits are subject to change at any time**.

[[toc]]

## Number of Workflows

The limit of active workflows depends on your current plan. [See our pricing page](https://pipedream.com/pricing) for more details.

## Number of Event Sources

**You can run an unlimited number of event sources**, as long as each operates under the limits below.

## Daily Credits Limit

Free Pipedream accounts are limited to {{$site.themeConfig.DAILY_CREDITS_LIMIT}} [credits](/pricing/#credits) per day. Paid plans do not have a daily credit limit.

You can view your credits usage at the bottom-left of [the Pipedream UI](https://pipedream.com).

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1702249243/docs/Screenshot_2023-12-10_at_3.00.21_PM_kcs9dk.png" width="300px" />
</div>

You can also see more detailed usage in [Billing and Usage Settings](https://pipedream.com/settings/billing). Here you'll find your usage for the last 30 days, broken out by day, by resource (e.g. your source / workflow).

Your included credits count is reset daily at 00:00 (midnight) UTC.

### Included Credits Usage Notifications

|    Tier    |                                                                    Notifications                                                                    |
| :--------: | :-------------------------------------------------------------------------------------------------------------------------------------------------: |
| Free tiers |                                          You'll receive an email when you reach 100% of your daily usage.                                           |
| Paid tiers | You'll receive an email at 80% and 100% of your [included credits](/pricing/#included-credits) for your [billing period](/pricing/#billing-period). |

## Daily workflow testing limit

You **do not** use credits testing workflows, but workspaces on the **Free** plan are limited to {{$site.themeConfig.DAILY_TESTING_LIMIT}} of test runtime per day. If you exceed this limit when testing in the builder, you'll see a **Runtime Quota Exceeded** error.

## Data stores

Depending on your plan, Pipedream sets limits on:

1. The total number of data stores
2. The total number of keys across all data stores
3. The total storage used across all data stores

You'll find your workspace's limits in the **Data Stores** section of usage dashboard in the bottom-left of [the Pipedream UI](https://pipedream.com).

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1702248992/docs/Screenshot_2023-12-10_at_2.56.28_PM_xmwqbq.png" width="300px" />
</div>

## HTTP Triggers

The following limits apply to [HTTP triggers](/workflows/steps/triggers/#http).

### HTTP Request Body Size

By default, the body of HTTP requests sent to a source or workflow is limited to `{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}`.

Your endpoint will issue a `413 Payload Too Large` status code when the body of your request exceeds `{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}`.

**Pipedream supports two different ways to bypass this limit**. Both of these interfaces support uploading data up to `5TB`, though you may encounter other platform limits.

- You can send large HTTP payloads by passing the `pipedream_upload_body=1` query string or an `x-pd-upload-body: 1` HTTP header in your HTTP request. [Read more here](/workflows/steps/triggers/#sending-large-payloads).
- You can upload multiple large files, like images and videos, using the [large file upload interface](/workflows/steps/triggers/#large-file-support).

### QPS (Queries Per Second)

Generally the rate of HTTP requests sent to an endpoint is quantified by QPS, or _queries per second_. A query refers to an HTTP request.

**You can send an average of 10 requests per second to your HTTP trigger**. Any requests that exceed that threshold may trigger rate limiting. If you're rate limited, we'll return a `429 Too Many Requests` response. If you control the application sending requests, you should retry the request with [exponential backoff](https://cloud.google.com/storage/docs/exponential-backoff) or a similar technique.

We'll also accept short bursts of traffic, as long as you remain close to an average of 10 QPS (e.g. sending a batch of 50 requests every 30 seconds should not trigger rate limiting).

**This limit can be raised for paying customers**. To request an increase, [reach out to our Support team](https://pipedream.com/support/) with the HTTP endpoint whose QPS you'd like to increase, with the new, desired limit.

## Email Triggers

Currently, most of the [limits that apply to HTTP triggers](#http-triggers) also apply to [email triggers](/workflows/steps/triggers/#email).

The only limit that differs between email and HTTP triggers is the payload size: the total size of an email sent to a workflow - its body, headers, and attachments - is limited to `{{$site.themeConfig.EMAIL_PAYLOAD_SIZE_LIMIT}}`.

## Memory

By default, workflows run with `{{$site.themeConfig.MEMORY_LIMIT}}` of memory. You can modify a workflow's memory [in your workflow's Settings](/workflows/settings/#memory), up to `{{$site.themeConfig.MEMORY_ABSOLUTE_LIMIT}}`.

Increasing your workflow's memory gives you a proportional increase in CPU. If your workflow is limited by memory or compute, increasing your workflow's memory can reduce its overall runtime and make it more performant.

**Pipedream charges credits proportional to your memory configuration**. [Read more here](/pricing/#how-does-workflow-memory-affect-credits).

## Disk

Your code, or a third party library, may need access to disk during the execution of your workflow or event source. **You have access to `{{$site.themeConfig.TMP_SIZE_LIMIT}}` of disk in the `/tmp` directory**.

This limit cannot be raised.

## Workflows

### Time per execution

Every event sent to a workflow triggers a new execution of that workflow. Workflows have a default execution limit that varies with the trigger type:

- HTTP and Email-triggered workflows default to **30 seconds** per execution.
- Cron-triggered workflows default to **60 seconds** per execution.

If your code exceeds your workflow-level limit, we'll throw a **Timeout** error and stop your workflow. Any partial logs and observability associated with code cells that ran successfully before the timeout will be attached to the event in the UI, so you can examine the state of your workflow and troubleshoot where it may have failed.

You can increase the timeout limit, up to a max value set by your plan:

|    Tier    | Maximum time per execution |
| :--------: | :------------------------: |
| Free tiers |    300 seconds (5 min)     |
| Paid tiers |   750 seconds (12.5 min)   |

Events that trigger a **Timeout** error will appear in red in the [Inspector](/workflows/events/inspect/). You'll see the timeout error, also in red, in the cell at which the code timed out.

### Event / Execution History

The [Inspector](/workflows/events/inspect/#the-inspector) shows the execution history for a given workflow. We retain up to {{$site.themeConfig.PAID_INSPECTOR_EVENT_LIMIT}} per workflow:

|    Tier    |                           Events retained per workflow                           |
| :--------: | :------------------------------------------------------------------------------: |
| Free tiers |                 {{$site.themeConfig.FREE_INSPECTOR_EVENT_LIMIT}}                 |
| Paid tiers | [View breakdown of events history per paid plan](https://pipedream.com/pricing/) |

The execution details for a specific event also expires after {{$site.themeConfig.INSPECTOR_EVENT_EXPIRY_DAYS}} days.

### Logs, Step Exports, and other observability

The total size of `console.log()` statements, [step exports](/workflows/steps/#step-exports), and the original event data sent to the workflow cannot exceed a combined size of `{{$site.themeConfig.FUNCTION_PAYLOAD_LIMIT}}`. If you produce logs or step exports larger than this - for example, passing around large API responses, CSVs, or other data - you may encounter a **Function Payload Limit Exceeded** in your workflow.

This limit cannot be raised.

## Acceptable Use

We ask that you abide by our [Acceptable Use](https://pipedream.com/terms/#b-acceptable-use) policy. In short this means: don't use Pipedream to break the law; don't abuse the platform; and don't use the platform to harm others.

<Footer />
