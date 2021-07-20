# User Settings

You can find important account details, text editor configuration, and more in your [Settings](https://pipedream.com/settings).

[[toc]]

## Account

You'll find your Pipedream username, email, and other basic account details in your [Account Settings](https://pipedream.com/settings/account).

### Username

Your Pipedream username functions as your user or org identity. If you've made any resources [public](/public-workflows/), these resources will appear on your public profile at:

```text
https://pipedream.com/@username
```

You can change your username at any time (see below).

### Changing your username

You can change your Pipedream username by editing the **Username** field in your Account Settings. 

Existing workflow URLs that contain your old username will continue to resolve to the correct workflow. However, links to your public profile with your old username (for example, [https://pipedream.com/@old-username](https://pipedream.com/@old-username)) will no longer resolve.

### Changing your email

Pipedream sends system emails to the email address tied to your Pipedream login - for example, [error notifications](/workflows/error-handling/global-error-workflow/) and emails sent using [`$send.email()`](/destinations/email/).

You can change the email address to which these emails are delivered by modifying the **Email** in your Account Settings. Once changed, an email will be delivered to the new address requesting you verify it.

Pipedream marketing emails may still be sent to the original email address you used when signing up for Pipedream. To change the email address tied to marketing emails, please [reach out to our team](/support).

### Pipedream API Key

Pipedream provides a [REST API](/api/overview/) for interacting with Pipedream programmatically. You'll find your API key here, which you use to [authorize requests to the API](/api/auth/).

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

[Invocations](/pricing/#invocations) are Pipedream's billable unit, and [free users](/pricing/#developer-tier) are limited on the number of daily invocations they can run. The **Usage** section displays a chart of the daily invocations across a historical range of time to provide insight into your usage patterns.

Hover over a specific column in the chart to see the number of invocations run for that specific day:

<div>
<img width="333" alt="Daily invocations tooltip" src="./images/daily-invocations-tooltip.png">
</div>

_Click_ on a specific column to see invocations for that day, broken out by workflow / source:

<div>
<img alt="Invocations broken out by workflow / source" src="./images/usage-by-resource.png">
</div>

[Developer (free) tier](/pricing/#developer-tier) users will see the last 30 days of usage in this chart. Users on [paid plans](https://pipedream.com/pricing) will see the cumulative usage tied to their current billing period.

### Limits

For users on the [Developer (free) tier](/pricing/#developer-tier), this section displays your usage towards your [invocations](/limits/#daily-invocations) and [compute time](/limits/#compute-time-per-day) quota for the current UTC day.

<Footer />
