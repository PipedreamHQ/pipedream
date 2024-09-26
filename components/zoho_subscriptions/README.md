# Overview

The Zoho Subscriptions API allows you to manage various aspects of subscription-based billing services. With this API, you can automate tasks such as creating subscriptions, handling customer billing info, and managing invoices. In Pipedream, you can harness this API to build workflows that respond to events in Zoho Subscriptions or to perform actions based on triggers from other apps. This enables seamless automation of billing operations and integration with your broader app ecosystem.

# Example Use Cases

- **Automate Invoice Reminders**: Use Zoho Subscriptions to monitor subscription statuses and send invoice reminders to customers with pending payments. Combine this with an email service like SendGrid to automate the reminder process.

- **Sync New Subscribers to CRM**: When a new subscriber is added in Zoho Subscriptions, automatically add their details to a CRM system, like Salesforce or HubSpot, for sales follow-up and customer relationship management.

- **Create Slack Notifications for Subscription Changes**: Set up a workflow where any update to a subscription in Zoho Subscriptions triggers a notification in a designated Slack channel. This can keep your team informed about new sign-ups, cancellations, or payment issues.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).