---
prev: false
next: false
---

# Plans and Pricing

We believe anyone should be able to run simple, low-volume workflows at no cost. We also hope that you share your [sources](/components#sources), [workflows](/workflows), [actions](/components#actions), and other integration components so that other Pipedream users benefit from your work.

To support these goals, **Pipedream offers a generous free tier**. You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](#paid-tiers).

[Read more about our plans and pricing here](https://pipedream.com/pricing).

[[toc]]

## Free Tier

Free Tiers have access to all pre-built actions and triggers, and all of the workflow building capabilites as other paid tiers.

But Free account have a [daily limit of free credits](/limits#daily-credits-limit) that cannot be exceed. Standard [Pipedream platform limits](/limits/) apply to Free Accounts as well.

**To lift the daily credit limit and increase the number of workflows and connected accounts [upgrade to a paid tier](https://pipedream.com/pricing)**.

### Free Tier Connected Accounts

Free Tier accounts can connect up to 3 different service accounts like Twitter, Discord, Google Sheets, or any of the thousands of available connections.

### Free Tier Workflow Limitations

Free Tier accounts have a [daily credit limit](/limits#daily-credits-limit) and have the lowest amount of active workflows available.

Upgrading to a [paid tier](https://pipedream.com/pricing) will increase the number of available active workflows and connected accounts.

### Free Tier Polling Interval Limitations

Free Tier account triggers powered by polling are limited to the longest interval. Paid tiers have an option to polling at a substantially higher frequency.

### Free Tier Support options

Users on the Developer Tier have access to community support, on [our forum](https://pipedream.com/community) and Slack. [Visit out Support page](https://pipedream.com/support) for more information.

## Paid Tiers

[Visit our pricing page](https://pipedream.com/pricing) to learn more about our paid plan options.

All paid plans vary features based on tier, but each paid plan option will:

- Lift the daily 100 credits limit
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

When an [event source](/sources) triggers a workflow, the first credit per source execution is included for free. This means that the first {{ $site.themeConfig.base_credits_price.seconds }} seconds of compute doesn't incur credits. This includes [Free Tier](/pricing/#free-tier) accounts.

When a source is configured as a workflow trigger, the core value is in the workflow. We don't want to charge you two credits (one to run the source, one to run the workflow) when the workflow contains the core logic. Sources that trigger workflows are called "dependent" sources.

On the other hand, sources that don't trigger workflows are "independent", since they run independently. Pipedream charges credits for all indepedent source executions.

::: tip

This free first credit per execution **only** applies to sources from the [Pipedream public registry](/sources).

If you deploy a private custom source to your account, then all computation time including the inital {{ $site.themeConfig.base_credits_price.seconds }} seconds for that private source counted toward credits.

:::

::: details A polling source finishing under {{ $site.themeConfig.base_credits_price.seconds }} seconds per execution

For example, a source that polls an API for new events like [Airtable - New Row Added](https://pipedream.com/apps/airtable/triggers/new-records) only takes ~5 seconds to poll and emit events to subscribing workflows.

This would result 0 credits per run because:

- The first {{ $site.themeConfig.base_credits_price.seconds }} of computation time per source execution is included.
- The **Airtable - New Row Added** source is a [publicly available component](https://pipedream.com/apps/airtable/triggers/new-records).

:::

::: details A polling source finishing over {{ $site.themeConfig.base_credits_price.seconds }} seconds per execution

Consider an a source (like **RSS - New Item in Feed** for instance) that takes 60 seconds total to finish polling, per execution.

Each execution of this source would result 1 credit because:

- The first {{ $site.themeConfig.base_credits_price.seconds }} of computation time per source execution is included.
- The **RSS - New Item in Feed** source is a [publicly available component](https://pipedream.com/apps/rss/triggers/new-item-in-feed).

:::

::: details A custom source that finised under {{ $site.themeConfig.base_credits_price.seconds }} seconds per execution

This would result in 1 credit per execution.

The initial free credit only applies to Pipedream Public Registry sources.

:::

::: details A source not connected to any workflow

A source that isn't connected to any workflow is called an [**Independent Source**](https://pipedream.com/docs/workflows/steps/triggers/#dependent-and-independent-sources). Independent sources do not incur credits.

Only when sources are attached to workflows and begin to trigger workflow executions do source execution credits incur.

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

You can email **billing@pipedream.com** for any billing-related questions.
