---
prev: false
next: false
---

# Pricing and Paid Plans

The Pipedream team believes anyone should be able to run simple, low-volume workflows at no cost. We also hope that you share your [sources](/event-sources/), [workflows](/workflows/managing/#sharing-workflows), [actions](/workflows/steps/actions/#creating-your-own-actions), and other integration components so that other Pipedream users benefit from your work.

To support these goals, **Pipedream offers a [generous free tier](#developer-tier)**. You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](#professional-tier).

Read more about our plans and pricing options below.

[[toc]]

## Developer Tier

**The Developer tier is free**. You can run any number of sources and workflows, as long as they operate under the following limits:

- [{{$site.themeConfig.DAILY_INVOCATIONS_LIMIT}} invocations per day](/limits/#daily-invocations)
- [30 minutes (1,800,000 milliseconds) compute time per day](/limits/#compute-time-per-day)
- [Other default limits on execution time, memory, and disk usage](/limits)

On the Developer tier, your workflow code is public by default to encourage [sharing](/workflows/managing/#sharing-workflows). **Your workflow data, and the values of step parameters, remain private**. You can [make your workflow code private](/workflows/managing/#workflow-visibility) at any time. [Read more here](/public-workflows/).

## Professional Tier

The Professional tier includes all the features of the Developer tier. On the Professional tier,

The Professional tier also comes with the following benefits:

- **You can run any number of invocations, for any amount of compute time**.
- [Email Support](https://pipedream.com/support)
- All workflow code is **private** by default

### Professional Tier Pricing

Invocations on the Professional tier are priced at **\$0.0001 per invocation, with a minimum monthly charge of \$10/month**. In other words, when you upgrade to the Professional tier, you pay \$10 per month for an initial set of 100,000 invocations. If you use more than 100,000 invocations during that month, you'll be billed for \$0.0001 for each extra invocation.

For example, if you

## Team / Enterprise Tiers

To discuss team and enterprise plans, please contact the Pipedream Sales Team [using the **Contact Sales** form on our Pricing page](https://pipedream.com/pricing).

## Definition of Terms

### Invocations

### Compute Time

### Billing Period

### Base Invocations Quota

- Base + extra

### Invocations Overage

## FAQ

### What are invocations?

[See the definition here](#invocations).

### When am I invoiced / billed?

When you upgrade to the Professional tier, Stripe will immediately charge your payment method on file for \$10.

If you accrue any [invocations overage](/pricing/#invocations-overage), that usage is reported to Stripe throughout the [billing period](/pricing/#billing-period). That overage, as well as the next \$10 monthly minimum, is charged at the start of the _next_ billing period.

For example, if you sign up for a paid plan on January 1st, you're immediately charged \$10. If you run 300,000 invocations in January, you'd use the 100,000 invocations tied to this \$10 payment, and you'd accrue an invocations overage of 200,000 invocations, for a total cost of \$20. That \$20 charge would be added to your next invoice, around Feb 1st, along with the \$10 monthly minimum charge for the billing period starting Feb 1st.

### How does Pipedream secure my credit card data?

Pipedream stores no information on your payment method, and uses Stripe as our payment processor. [See our security docs](/security/#payment-processor) for more information.
