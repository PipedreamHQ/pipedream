# Overview

The Zoho Cliq API allows you to automate and integrate your team communication within Zoho Cliq. With this API, you can create bots to send messages, manage channels and users, and streamline notifications to your team about events from other applications or services. Using Pipedream, you can harness these capabilities to create powerful workflows that trigger actions within Zoho Cliq or react to events happening in Cliq to perform tasks in other apps.

# Example Use Cases

- **Automate Welcome Messages for New Users**: When a new user joins your organization on Zoho Cliq, you can set up a Pipedream workflow that automatically sends a personalized welcome message or onboarding instructions from a bot.

- **Sync Zoho Cliq Channels with External Tools**: Configure a workflow on Pipedream that listens to webhooks from apps like JIRA, GitHub, or Trello. Whenever a new issue, commit, or card is created, the workflow can post updates to a specific Zoho Cliq channel to keep your team in the loop.

- **Create Daily Summary Reports**: Build a Pipedream workflow that gathers data from various sources like sales figures from Zoho CRM, support ticket status from Zendesk, or website analytics from Google Analytics. Then, compile a daily summary report and post it in a Zoho Cliq channel every morning.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).