---
prev: false
next: false
---

# Plans and Pricing

We believe anyone should be able to run simple, low-volume workflows at no cost. We also hope that you share your [sources](/event-sources/), [workflows](/workflows/managing/#sharing-workflows), [actions](/workflows/steps/actions/#creating-your-own-actions), and other integration components so that other Pipedream users benefit from your work.

To support these goals, **Pipedream offers a [generous free tier](#developer-tier)**. You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](#professional-tier).

Read more about our plans and pricing options below.

[[toc]]

## Developer Tier

**The Developer tier is free**. You can run any number of sources and workflows, as long as they operate under [Pipedream platform limits](/limits/).

**To run any number of invocations, for any amount of time, [upgrade to the Professional tier](https://pipedream.com/pricing)**.

### Developer Tier Support options

Users on the Developer Tier have access to community support, on [our forum](https://pipedream.com/community) and Slack. [Visit out Support page](https://pipedream.com/support) for more information.

## Professional Tier

The Professional Tier includes all the features of the Developer Tier. It also comes with the following benefits:

- **You have no daily invocations or compute time cap. You can run any number of invocations, for any amount of time**.
- When using [concurrency and throttling controls](/workflows/events/concurrency-and-throttling/), you can increase a workflow's queue size up to {{$site.themeConfig.MAX_WORKFLOW_QUEUE_SIZE}} (free users are capped at a queue size of {{$site.themeConfig.DEFAULT_WORKFLOW_QUEUE_SIZE}}).

Pipedream will be adding more features to the Professional tier over time.

### Upgrading to the Professional Tier

You can upgrade to the Professional Plan by visiting your [Billing and Usage Settings](https://pipedream.com/settings/billing).

### Professional Tier Pricing

See [https://pipedream.com/pricing](https://pipedream.com/pricing) for pricing information.

### Professional Tier Support options

Users on the Professional Tier have access to community support, on [our forum](https://pipedream.com/community) and Slack. [Visit out Support page](https://pipedream.com/support) for more information.

## Team Plan

You can create as many [organizations](/orgs) as you'd like for free. But the quota for free orgs is set to {{$site.themeConfig.FREE_ORG_DAILY_INVOCATIONS_LIMIT}} invocations per day. To lift this limit, you can upgrade the org to the **Team Plan**.

Orgs are limited to {{$site.themeConfig.TEAM_MEMBER_LIMIT}} members. If you need more than {{$site.themeConfig.TEAM_MEMBER_LIMIT}} team members, please reach out about an [Enterprise Plan](#enterprise-plan).

The Team Plan also includes all of the features of the Professional Plan.

### Upgrading to the Team Plan

You can upgrade to the Team Plan by switching to your [org's context](/orgs/#switching-context) and visiting your [Billing and Usage Settings](https://pipedream.com/settings/billing).

### Team Tier Pricing

See [https://pipedream.com/pricing](https://pipedream.com/pricing) for pricing information.

### Team Tier Support options

Teams have access to support from the Pipedream team via email or a shared Slack channel between our organizations. [Visit out Support page](https://pipedream.com/support) for more information.

## Enterprise Plan

To discuss an Enterprise plan, please contact the Pipedream Sales Team [using the **Contact Sales** form on our Pricing page](https://pipedream.com/pricing).

## Definition of Terms

Pipedream uses a number of terms to describe platform metrics and details of our plans. See the definitions of key terms below.

### Invocations

Pipedream counts an **invocation** each time a workflow or event source is triggered by an incoming event.

Pipedream increments the count of invocations by one for each incoming event, regardless of the number of steps in your workflow. For example, if you send an HTTP request to a workflow with five steps, Pipedream will count that as one invocation.

Moreover, if you have a workflow triggered by a cron job running once a minute for the entire day, that will incur 1,440 invocations (60 minute \* 24 hours). For cron-triggered workflows or event sources, remember that you can always reduce the frequency to reduce your invocations.

If an event emitted by an event source triggers a single workflow, that will count as **two** invocations: one for the source, and one for the workflow. In other words, source and workflow execution is distinct: each counts invocations on its own.

Your workflow's [memory settings](/workflows/settings/#memory) also impact the number of invocations you're charged for each workflow execution. [Read more here](#how-does-workflow-memory-affect-billable-invocations).

### Compute Time

Pipedream calculates **compute time** as the total time your workflow or event source runs user code.

Pipedream records a minimum time of `100ms` per execution. For example, if your workflow runs for `50ms`, you'll incur `100ms` of time towards your [daily compute time quota](/limits/#compute-time-per-day).

### Billing Period

Many of the usage statistics for paid users are tied to a **billing period**. Your billing period starts when you sign up for a paid plan, and recurs roughly once a month for the duration of your subscription.

For example, if you sign up on Jan 1st, your first billing period will last one month, ending around Feb 1st, at which point you'll start a new billing period.

Your invoices are tied to your billing period. [Read more about invoicing / billing here](/#when-am-i-invoiced-billed).

### Base Invocations Quota

When you sign up for a paid plan, you pay a platform fee at the start of each [billing period](#billing-period). This minimum monthly charge grants you a base of invocations that you can use for the rest of your billing period (see your [Billing and Usage Settings](https://pipedream.com/settings/billing) for your exact quota). If you have been granted any additional invocation increases by Pipedream, that is added to the base quota. **This total is called the base invocations quota**.

### Additional Billable Invocations

Any invocations you run over your [base invocations quota](#base-invocations-quota) are called **additional billable invocations**. This usage is added to the invoice for your next [billing period](#billing-period), according to the [invoicing cycle described here](#when-am-i-invoiced-billed).

## FAQ

### What are invocations?

Pipedream counts an **invocation** each time a workflow or event source is triggered by an incoming event.

Pipedream increments the count of invocations by one for each incoming event, regardless of the number of steps in your workflow. For example, if you send an HTTP request to a workflow with five steps, Pipedream will count that as one invocation.

Moreover, if you have a workflow triggered by a cron job running once a minute for the entire day, that will incur 1,440 invocations (60 minute \* 24 hours). For cron-triggered workflows or event sources, remember that you can always reduce the frequency to reduce your invocations.

If an event emitted by an event source triggers a single workflow, that will count as **two** invocations: one for the source, and one for the workflow. In other words, source and workflow execution is distinct: each counts invocations on its own.

### How does workflow memory affect billable invocations?

Pipedream charges invocations proportional to the memory configuration. If you run your workflow at the default memory of `{{$site.themeConfig.MEMORY_LIMIT}}`, you are charged one invocation each time your workflow executes. But if you configure your workflow with `1024MB` of memory, for example, you're charged **four** invocations, since you're using `4x` the default memory.

### Are there any limits on paid tiers?

**You can run any number of invocations, for any amount of compute time**, on paid tiers. [Other platform limits](/limits/) apply.

### When am I invoiced / billed for paid plans?

When you upgrade to the Professional tier, Stripe will immediately charge your payment method on file for the platform fee tied to your plan (see [https://pipedream.com/pricing](https://pipedream.com/pricing))

If you accrue any [additional billable invocations](#additional-billable-invocations), that usage is reported to Stripe throughout the [billing period](/pricing/#billing-period). That overage, as well as the next platform fee, is charged at the start of the _next_ billing period.

### How does Pipedream secure my credit card data?

Pipedream stores no information on your payment method and uses Stripe as our payment processor. [See our security docs](/security/#payment-processor) for more information.

### Are unused invocations rolled over from one period to the next?

**No**. On the Developer tier, unused daily invocations (and compute time) under the daily limit are **not** rolled over to the next day.

On paid tiers, unused invocations included as a part of the base platform fee are also **not** rolled over to the next month.

### How do I change my billing payment method?

Please visit your [Stripe customer portal](https://pipedream.com/settings/billing?rtsbp=1) to change your payment method.

### How can I view my past invoices?

Invoices are emailed to your billing email address. You can also visit your [Stripe customer portal](https://pipedream.com/settings/billing?rtsbp=1) to view past invoices.

### Can I retrieve my billing information via API?

Yes. You can retrieve your usage and billing metadata from the [/users/me](/api/rest/#get-current-user-info) endpoint in the Pipedream REST API.

### How do I cancel my paid plan?

You can cancel your plan in your [Billing and Usage Settings](https://pipedream.com/settings/billing). You will have access to your paid plan through the end of your current billing period. Pipedream does not prorate plans cancelled within a billing period.

If you'd like to process your cancellation immediately, and downgrade to the free tier, please [reach out](/support).

### How do I change the billing email / company details tied to my invoice?

You can update your billing information in your [Stripe customer portal](https://pipedream.com/settings/billing?rtsbp=1).

### How do I contact the Pipedream team with other questions?

You can email **billing@pipedream.com** for any billing-related questions.
