---
prev: false
next: false
---

# Plans and Pricing

We believe anyone should be able to run simple, low-volume workflows at no cost. We also hope that you share your [sources](/components#sources), [workflows](/workflows), [actions](/components#actions), and other integration components so that other Pipedream users benefit from your work.

To support these goals, **Pipedream offers a [generous free tier](#developer-tier)**. You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](#professional-tier).

[Read more about our plans and pricing here](https://pipedream.com/pricing).

## Free Tier

You can run up to 3 workflows and add up to 3 connected accounts for up to 100 credits a day for free, as long as they operate under [Pipedream platform limits](/limits/).

**To lift the 100 credit limit and increase the number of workflows and connected accounts [upgrade to a paid tier](https://pipedream.com/pricing)**.

### Free Tier Connected Accounts

Free Tier accounts can connect up to 3 different service accounts like Twitter, Discord, Google Sheets, or any of the thousands of available connections.

### Free Tier Workflow Limitations

Free Tier account workflows are limited to using a maximum of 100 credits per day and a maximum of 3 active workflows.

Additionally, the event history for Free Tier workflows is limited to only the past 100 events.

Upgrading to a paid tier will increase this event history tracking substantially.

### Free Tier Polling Interval Limitations

Free Tier account triggers powered by polling are limited to 5 minute intervals. Paid tiers have an option to polling at a substantially higher frequency. 

### Free Tier Support options

Users on the Developer Tier have access to community support, on [our forum](https://pipedream.com/community) and Slack. [Visit out Support page](https://pipedream.com/support) for more information.

## Professional Tier

The Professional Tier includes all the features of the Developer Tier. It also comes with the following benefits:

- **You have no daily invocations or compute time cap. You can run any number of invocations, for any amount of time**.
- Your event history per workflow increases from {{$site.themeConfig.limits.event_histories.FREE}} to 
{{$site.themeConfig.limits.event_histories.PRO}}.
- You can increase the [max time per execution](/limits/#time-per-execution) to {{$site.themeConfig.limits.compute_time_per_invocation.PRO}} (up from {{$site.themeConfig.limits.compute_time_per_invocation.FREE}} on the Free Tier).
- You can request [QPS increases](/limits/#qps-queries-per-second) for specific HTTP endpoints.
- When using [concurrency and throttling controls](/workflows/concurrency-and-throttling/), you can increase a workflow's queue size up to {{$site.themeConfig.limits.workflow_queue_size.PRO}} (free users are capped at a queue size of {{$site.themeConfig.limits.workflow_queue_size.FREE}}).

### Upgrading to the Professional Tier

You can upgrade to the Professional Plan by visiting your [Billing and Usage Settings](https://pipedream.com/settings/billing).

### Professional Tier Pricing

See [https://pipedream.com/pricing](https://pipedream.com/pricing) for pricing information.

### Professional Tier Support options

Users on the Professional Tier have access to community support, on [our forum](https://pipedream.com/community) and Slack. [Visit out Support page](https://pipedream.com/support) for more information.

## Team Plan

You can create as many [organizations](/orgs/) as you'd like for free. But the quota for free orgs is set to {{$site.themeConfig.FREE_ORG_DAILY_INVOCATIONS_LIMIT}} invocations per day. To lift this limit, you can upgrade the org to the **Team Plan**.

Orgs are limited to {{$site.themeConfig.TEAM_MEMBER_LIMIT}} members. If you need more than {{$site.themeConfig.TEAM_MEMBER_LIMIT}} team members, please [reach out](https://pipedream.com/support).

The Team Plan includes all of the features of the Professional Plan. Additionally, you have access to a [Pipedream-provided HTTP proxy](/code/nodejs/http-requests/#use-an-http-proxy-to-proxy-requests-through-another-host).

### Upgrading to the Team Plan

You can upgrade to the Team Plan by switching to your [org's context](/orgs/#switching-context) and visiting your [Billing and Usage Settings](https://pipedream.com/settings/billing).

### Team Tier Pricing

See [https://pipedream.com/pricing](https://pipedream.com/pricing) for pricing information.

### Team Tier Support options

Teams have access to support from the Pipedream team via email or a shared Slack channel between our organizations. [Visit out Support page](https://pipedream.com/support) for more information.

## Enterprise Plan

Enterprise plans are great for larger organizations or teams that have specific requirements, like SSO support or an SLA. 

Enterprise plans are custom to each customer, but typically include:

- Custom invocations, users, and orgs
- SSO support (GSuite and [Okta](/orgs/sso/okta/))
- [A 99.95% uptime SLA](https://pipedream.com/sla)
- Support for multiple orgs. For example, you might want to separate workflows owned by different teams.
- Premium support: onboarding, ongoing training, and anything your team needs to be successful
- Custom, prioritized [component](https://pipedream.com/docs/components/) development. If you need new sources or actions, The Pipedream team will develop them for you and prioritize that work on our [component backlog](https://github.com/PipedreamHQ/pipedream/projects/1).

To discuss an Enterprise plan, please contact the Pipedream Sales Team [using the **Contact Sales** form on our Pricing page](https://pipedream.com/pricing).

## Definition of Terms

Pipedream uses a number of terms to describe platform metrics and details of our plans. See the definitions of key terms below.

### Credit

Pipedream counts your usage in terms of _credits_ of total compute time across all workflows in the billing period.

One credit is {{ $site.themeConfig.base_credits_price.seconds }} seconds of compute time at {{ $site.themeConfig.base_credits_price.memory }} megabytes of memory.

Regardless of the number of steps in your workflow, if your workflow run runs for {{ $site.themeConfig.base_credits_price.seconds }} or less seconds then that run only costs 1 credit.

Adding additional memory capacity to workflows will increase credit usage in intervals of 256 megabytes. For example, doubling the memory of a workflow from {{ $site.themeConfig.base_credits_price.memory }} to {{ $site.themeConfig.base_credits_price.memory * 2 }} will double the cost of credits in the same execution time.

#### Scenarios

::: details A standard workflow that runs 5 times with one second per run

Only 1 credit is incurred, because the workflow ran for a total of 5 seconds (5 runs at 1 second each = 5 total seconds of compute time)

:::

::: details Developing a workflow with test events in the Pipedream workflow builder

0 credits are incurred. Developing your workflows is free. Execution time used to develop a workflow in the builder does not count towards your credit usage.

:::

::: details An active standard workflow that isn't triggered at all in a billing period

0 credits are incurred. You only pay for execution time.

:::

::: details An upgraded workflow with 512 megabytes of memory running for 5 seconds

2 credit are incurred, because the workflow ran for a total of 5 seconds (5 runs at 1 second each = 5 total seconds of compute time)

:::

### Billing Period

Many of the usage statistics for paid users are tied to a **billing period**. Your billing period starts when you sign up for a paid plan, and recurs roughly once a month for the duration of your subscription.

For example, if you sign up on Jan 1st, your first billing period will last one month, ending around Feb 1st, at which point you'll start a new billing period.

Your invoices are tied to your billing period. [Read more about invoicing / billing here](#when-am-i-invoiced-billed-for-paid-plans).

### Included Credits

When you sign up for a paid plan, you pay a platform fee at the start of each [billing period](#billing-period). This minimum monthly charge grants you a base of credits that you can use for the rest of your billing period (see your [Billing and Usage Settings](https://pipedream.com/settings/billing) for your exact quota). If you have been granted any additional credit increases by Pipedream, that is added to the base quota. **This total is called the included credits quota**.

### Additional Credits

Any credits you run over your [included credit](#included-credits) are called **additional credits**. This usage is added to the invoice for your next [billing period](#billing-period), according to the [invoicing cycle described here](#when-am-i-invoiced-billed-for-paid-plans).

### Data Store Keys

A Data Store key represents a single record in a Data Store.

In the example below, there are two records in the Data Store, and therefore there are two keys total.

![Example of a Data Store with two keys](https://res.cloudinary.com/pipedreamin/image/upload/v1673537163/docs/CleanShot_2023-01-12_at_10.25.25_z6yg8t.png)

## FAQ

### How does workflow memory affect credits?

Pipedream charges credits proportional to the memory configuration. If you run your workflow at the default memory of `{{$site.themeConfig.MEMORY_LIMIT}}`, you are charged one credit each time your workflow executes for {{ $site.themeConfig.base_credits_price.seconds }}. But if you configure your workflow with `1024MB` of memory, for example, you're charged **four** invocations, since you're using `4x` the default memory.

### Are there any limits on paid tiers?

**You can run any number of , for any amount of compute time**, on paid tiers. [Other platform limits](/limits/) apply.

### When am I invoiced / billed for paid plans?

When you upgrade to a paid teir, Stripe will immediately charge your payment method on file for the platform fee tied to your plan (see [https://pipedream.com/pricing](https://pipedream.com/pricing))

If you accrue any [additional credits](#additional-credits), that usage is reported to Stripe throughout the [billing period](/pricing/#billing-period). That overage, as well as the next platform fee, is charged at the start of the _next_ billing period.

### Do any plans support payment by invoice, instead of credit / debit card?

Yes, Pipedream can issue invoices on the Enterprise Plan. Invoices are paid annually.

### How does Pipedream secure my credit card data?

Pipedream stores no information on your payment method and uses Stripe as our payment processor. [See our security docs](/privacy-and-security/#payment-processor) for more information.

### Are unused credits rolled over from one period to the next?

**No**. On the Free tier, unused daily credits under the daily limit are **not** rolled over to the next day.

On paid tiers, unused credits included as a part of the base platform fee are also **not** rolled over to the next month.

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
