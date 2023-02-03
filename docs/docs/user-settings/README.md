# User Settings

You can find important account details, text editor configuration, and more in your [Settings](https://pipedream.com/settings).

[[toc]]

## Account

You'll find your Pipedream username, email, and other basic account details in your [Account Settings](https://pipedream.com/settings/account).

### Username

Your Pipedream username functions as your user or org identity. If you've made any resources public, these resources will appear on your public profile at:

```text
https://pipedream.com/@username
```

You can change your username at any time (see below).

### Changing your username

You can change your Pipedream username by editing the **Username** field in your Account Settings. 

Existing workflow URLs that contain your old username will continue to resolve to the correct workflow. However, links to your public profile with your old username (for example, [https://pipedream.com/@old-username](https://pipedream.com/@old-username)) will no longer resolve.

### Changing your email

Pipedream sends system emails to the email address tied to your Pipedream login. You can change the email address to which these emails are delivered by modifying the **Email** in your Account Settings. Once changed, an email will be delivered to the new address requesting you verify it.

Pipedream marketing emails may still be sent to the original email address you used when signing up for Pipedream. To change the email address tied to marketing emails, please [reach out to our team](https://pipedream.com/support).

### Pipedream API Key

Pipedream provides a [REST API](/api/) for interacting with Pipedream programmatically. You'll find your API key here, which you use to [authorize requests to the API](/api/auth/).

You can revoke and regenerate your API key from here at any time.

### Delete Account

You can delete your Pipedream account at any time by visiting your Account Settings and pressing the **Delete your Account** button. Account deletion is immediately and irreversible.

## Application

You can change how the Pipedream app displays data, and basic text editor config, in your [Application Settings](https://pipedream.com/settings/app).

For example, you can:

- Change the clock format to 12-hour or 24-hour mode
- Enable Vim keyboard shortcuts in the Pipedream text editor, or enable word wrap
- Set the number of spaces that will be added in the editor when pressing `Tab`

## Environment Variables

Environment variables allow you to securely store secrets or other config values that you can access in Pipedream workflows via `process.env`. [Read more about environment variables here](/environment-variables/).

## Billing and Usage

You'll find information on your usage data (for specific [Pipedream limits](/limits/)) in your [Billing Settings](https://pipedream.com/settings/billing). You can also upgrade to [paid plans](https://pipedream.com/pricing) from this page.

### Subscription

You can upgrade to [paid plans](https://pipedream.com/pricing) from this section.

If you've already upgraded, you'll see an option to **Manage Subscription** here, which directs you to your personal Stripe portal. Here, you can change your payment method, review the details of previous invoices, and more.

### Usage

[Credits](/pricing/#credits) are Pipedream's billable unit, and [free users](/pricing/#developer-tier) are limited on the number of daily free credits allocated. The **Usage** section displays a chart of the daily credits across a historical range of time to provide insight into your usage patterns.

Hover over a specific column in the chart to see the number of credits run for that specific day:

<div>
<img width="333" alt="Daily budy tooltip" src="./images/daily-invocations-tooltip.png">
</div>

_Click_ on a specific column to see credits for that day, broken out by workflow / source:

<div>
<img alt="Credits broken out by workflow / source" src="./images/usage-by-resource.png">
</div>

[Developer (free) tier](/pricing/#developer-tier) users will see the last 30 days of usage in this chart. Users on [paid plans](https://pipedream.com/pricing) will see the cumulative usage tied to their current billing period.


### Credits Budget

Control the maximum number of credits permitted on your account with an *Credit Budget*.

This will restrict your account usage to a certain allocation of [credits](/pricing/#credits) on a monthly or daily basis.

To enable this feature, _click_ on the toggle and define your maximum number of credits in the period.

![Enabling the Credit Budget feature](https://res.cloudinary.com/pipedreamin/image/upload/v1662555731/docs/components/image_12_hledxh.png)

::: tip

Due to how credits are accrued, there may be cases where your credit usage may go over the cap _slightly_.

In an example scenario, with cap set at 20 credits and long running workflow that uses 10 credits per run; it's possible that two concurrent events trigger the workflow, and the cap will won't apply until after the concurrent events are processed.

:::

### Limits

For users on the [Free tier](/pricing/#free-tier), this section displays your usage towards your [credits quota](/limits/#daily-credits) for the current UTC day.

<Footer />
