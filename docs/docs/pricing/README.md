---
prev: false
next: false
---

# Plans and Pricing

We believe anyone should be able to run simple, low-volume workflows at no cost. We also hope that you share your [sources](/components#sources), [workflows](/workflows), [actions](/components#actions), and other integration components so that other Pipedream users benefit from your work.

To support these goals, Pipedream offers a generous [free tier](#free-tier), and you can **[request a free trial of our Advanced or Business plan](https://pipedream.com/pricing)**. You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](#paid-tiers).

[Read more about our plans and pricing here](https://pipedream.com/pricing).

[[toc]]

## Free Tier

Free Tiers have access to all pre-built actions and triggers, and all of the workflow building capabilites as other paid tiers.

But Free account have a [daily limit of free credits](/limits#daily-credits-limit) that cannot be exceed. Standard [Pipedream platform limits](/limits/) apply to Free Accounts as well.

**To lift the daily credit limit and increase the number of workflows and connected accounts [upgrade to a paid tier](https://pipedream.com/pricing)**.

### Free Tier Connected Accounts

Free Tier accounts can connect up to 3 different service accounts like Twitter, Discord, Google Sheets, or any of the thousands of available connections.

### Free Tier Workflow Limitations

Free Tier accounts have a [daily credit limit](/limits#daily-credits-limit) and have limits on the number of active workflows. Upgrading to a [paid tier](https://pipedream.com/pricing) will increase the number of available active workflows and connected accounts.

### Free Tier Polling Interval Limitations

Free Tier account triggers powered by polling are limited to the longest interval. Paid tiers have an option to polling at a substantially higher frequency.

### Free Tier Support options

Users on the Free Tier have access to community support, on [our forum](https://pipedream.com/community) and Slack. [Visit out Support page](https://pipedream.com/support) for more information.

## Paid Tiers

[Visit our pricing page](https://pipedream.com/pricing) to learn more about our paid plans.

All paid plans vary features based on tier, but each paid plan option will:

- Remove the daily {{$site.themeConfig.DAILY_CREDITS_LIMIT}} [credits](#credits) limit
- Increase the number of active workflows available
- Increase the number of connected accounts

## Definition of Terms

Pipedream uses a number of terms to describe platform metrics and details of our plans. See the definitions of key terms below.

### Credits

Pipedream charges one credit per {{ $site.themeConfig.base_credits_price.seconds }} seconds of compute time at {{ $site.themeConfig.base_credits_price.memory }} megabytes of memory (the default) per workflow execution. Credits are also charged for [dedicated workers](/workflows/settings/#eliminate-cold-starts).

**Most workflow executions use a single credit**, regardless of the number of steps (unlike some other platforms, Pipedream does not charge for usage based on the number of steps).

Credits are not charged for workflows during development or testing.

Adding additional memory capacity to workflows will increase credit usage in intervals of 256 megabytes. For example, doubling the memory of a workflow from {{ $site.themeConfig.base_credits_price.memory }} to {{ $site.themeConfig.base_credits_price.memory * 2 }} will double the cost of credits in the same execution time.

#### Scenarios

::: details A workflow that executes once for less than 30 seconds total

This is the most common scenario. Regardless of the number of steps within the workflow, if it completes it's execution under 30 seconds then only one credit is incurred.

:::

::: details A workflow that executes 5 times with 1 second per run

5 credits are incurred, because the workflow ran for a total of 5 executions and under the {{ $site.themeConfig.base_credits_price.seconds }} seconds threshold (5 executions at 1 credit each).

:::

::: details A workflow that executes 2 times with {{ $site.themeConfig.base_credits_price.seconds + 5 }} seconds per run

4 credits are incurred, because each workflow execution exceeded 1 credit time limit of {{ $site.themeConfig.base_credits_price.seconds }} by 5 seconds.

:::

::: details Developing a workflow with test events in the Pipedream workflow builder

0 credits are incurred. Developing and testing your workflows is free.

Execution time used to develop a workflow in the builder does not count towards your credit usage.

:::

::: details An active standard workflow that isn't executed at all in a billing period

0 credits are incurred. Pipedream only charges credits for workflow executions.

:::

::: details A workflow with 512 megabytes of memory executing for 5 seconds

2 credits are incurred, because the workflow executed for a total of 5 seconds at 512 megabytes of memory.
:::

#### Source Credit Usage

When an [event source](/sources) triggers a workflow, **the source execution is included for free.** This includes workspaces on the [Free Tier](/pricing/#free-tier).

When a source is configured as a workflow trigger, the core value is in the workflow. You won't be charged for two credits (one to run the source, one to run the workflow) when the workflow contains the core logic.

::: tip

This free credit per execution **only** applies to sources from the [Pipedream public registry](/sources). If you deploy a private custom source to your account, then all computation time including the inital {{ $site.themeConfig.base_credits_price.seconds }} seconds for that private source counts toward credits.

:::

::: details A polling source finishing under {{ $site.themeConfig.base_credits_price.seconds }} seconds per execution

For example, a source that polls an API for new events like [Airtable - New Row Added](https://pipedream.com/apps/airtable/triggers/new-records) only takes ~5 seconds to poll and emit events to subscribing workflows.

This would result in **0 credits** per run because the **Airtable - New Row Added** source is a [publicly available component](https://pipedream.com/apps/airtable/triggers/new-records).

:::

::: details A polling source finishing over {{ $site.themeConfig.base_credits_price.seconds }} seconds per execution

Consider a source (like **RSS - New Item in Feed** for instance) that takes 60 seconds total to finish polling, per execution.

Each execution of this source would result in **0 credits** because the **RSS - New Item in Feed** source is a [publicly available component](https://pipedream.com/apps/rss/triggers/new-item-in-feed).

:::

::: details A custom source that finished under {{ $site.themeConfig.base_credits_price.seconds }} seconds per execution

This would result in **1 credit** per execution because the initial free credit only applies to Pipedream Public Registry sources attached to at least one workflow.

:::


### Billing Period

Many of the usage statistics for paid users are tied to a **billing period**. Your billing period starts when you sign up for a paid plan, and recurs roughly once a month for the duration of your subscription.

For example, if you sign up on Jan 1st, your first billing period will last one month, ending around Feb 1st, at which point you'll start a new billing period.

Your invoices are tied to your billing period. [Read more about invoicing / billing here](#when-am-i-invoiced-billed-for-paid-plans).

### Included Credits

When you sign up for a paid plan, you pay a platform fee at the start of each [billing period](#billing-period). This minimum monthly charge grants you a base of included credits that you can use for the rest of your billing period (see your [Billing and Usage Settings](https://pipedream.com/settings/billing) for your exact quota). If you have been granted any additional credit increases by Pipedream, that is added to the included credits.

### Additional Credits

Any credits you run over your [included credit](/limits/#daily-credits-limit) are called **additional credits**. This usage is added to the invoice for your next [billing period](#billing-period), according to the [invoicing cycle described here](#when-am-i-invoiced-billed-for-paid-plans).

### Data Store Keys

A Data Store key represents a single record in a Data Store.

In the example below, there are two records in the Data Store, and therefore there are two keys total.

![Example of a Data Store with two keys](https://res.cloudinary.com/pipedreamin/image/upload/v1673537163/docs/CleanShot_2023-01-12_at_10.25.25_z6yg8t.png)

## Managing my plan

To cancel, upgrade or downgrade your plan, open the [pricing page](https://pipedream.com/pricing).

To update your billing details, such as your VAT number, email address, etc. use the **Manage Billing Information** button in your [workspace billing settings](https://pipedream.com/settings/billing) to change your plan. Within this portal you can cancel, upgrade or downgrade your plan at any time.

### Upgrading behavior

Upgrading your subscription instantly activates the features available to your workspace. For example, if you upgrade your workspace from Free to Basic, that workspace will be able to activate more workflows and connected accounts.

### Downgrading behavior

Downgrades will apply at the end of your billing cycle, and any workflows that use features outside of the new billing plan will be automatically disabled.

For example, if your workspace downgrades from Advanced to Basic and a workflow uses an Advanced feature such as [auto-retries](/workflows/settings/#auto-retry-errors), then this workflow will be disabled because the workspace plan no longer qualifies for that feature.

Additionally, resource limits such as the number of active workflows and connected accounts will also be enforced at this same time.

### Cancellation behavior

To cancel your plan, open the [pricing page](https://pipedream.com/pricing) and click **Cancel** beneath your current plan.

Cancelling your subscription will apply at the end of your current billing period. Workflows, connected accounts and sources will be deactivated from newest to oldest until the Free limits have been reached.

## FAQ

### How does workflow memory affect credits?

Pipedream charges credits proportional to the memory configuration. If you run your workflow at the default memory of `{{$site.themeConfig.MEMORY_LIMIT}}`, you are charged one credit each time your workflow executes for {{ $site.themeConfig.base_credits_price.seconds }}. But if you configure your workflow with `1024MB` of memory, for example, you're charged **four** credits, since you're using `4x` the default memory.

### Are there any limits on paid tiers?

**You can run any number of credits for any amount of compute time** on any paid tier. [Other platform limits](/limits/) apply.

### When am I invoiced / billed for paid plans?

When you upgrade to a paid tier, Stripe will immediately charge your payment method on file for the platform fee tied to your plan (see [https://pipedream.com/pricing](https://pipedream.com/pricing))

If you accrue any [additional credits](#additional-credits), that usage is reported to Stripe throughout the [billing period](/pricing/#billing-period). That overage, as well as the next platform fee, is charged at the start of the _next_ billing period.

### Do any plans support payment by invoice, instead of credit / debit card?

Yes, Pipedream can issue invoices on the Enterprise Plan. Invoices are paid annually.

### How does Pipedream secure my credit card data?

Pipedream stores no information on your payment method and uses Stripe as our payment processor. [See our security docs](/privacy-and-security/#payment-processor) for more information.

### Are unused credits rolled over from one period to the next?

**No**. On the Free tier, unused included daily credits under the daily limit are **not** rolled over to the next day.

On paid tiers, unused included credits are also **not** rolled over to the next month.

### How do I change my billing payment method?

Please visit your [Stripe customer portal](https://pipedream.com/settings/billing?rtsbp=1) to change your payment method.

### How can I view my past invoices?

Invoices are emailed to your billing email address. You can also visit your [Stripe customer portal](https://pipedream.com/settings/billing?rtsbp=1) to view past invoices.

### Can I retrieve my billing information via API?

Yes. You can retrieve your usage and billing metadata from the [/users/me](/api/rest/#get-current-user-info) endpoint in the Pipedream REST API.

### How do I cancel my paid plan?

You can cancel your plan in your [Billing and Usage Settings](https://pipedream.com/settings/billing). You will have access to your paid plan through the end of your current billing period. Pipedream does not prorate plans cancelled within a billing period.

If you'd like to process your cancellation immediately, and downgrade to the free tier, please [reach out](https://pipedream.com/support).

### How do I change the billing email, VAT, or other company details tied to my invoice?

You can update your billing information in your [Stripe customer portal](https://pipedream.com/settings/billing?rtsbp=1).

### How do I contact the Pipedream team with other questions?

You can start a support ticket [on our support page](https://pipedream.com/support). Select the **Billing Issues** category to start a billing related ticket.
