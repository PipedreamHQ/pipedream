# Overview

The Zoho SalesIQ API offers a wealth of possibilities for engaging with customers and streamlining sales processes. By leveraging this API in Pipedream, you can craft automated workflows to react to events, manage visitors, and integrate customer interaction data with other services. This could range from triggering actions based on visitor activities to syncing chat transcripts with CRM tools. Pipedream's ability to connect with 3,000+ apps allows for creative and powerful automations that can save time and provide valuable insights.

# Example Use Cases

- **Visitor Activity to Slack Notification**: When a visitor performs a specific action on your website, such as viewing a pricing page, use Zoho SalesIQ to trigger a workflow that sends a custom alert to a designated Slack channel. This enables your sales team to respond promptly to potential leads.

- **Support Ticket Creation in Zendesk**: Upon ending a chat with a customer in Zoho SalesIQ, automatically create a support ticket in Zendesk with the chat transcript and customer details. This keeps support teams aligned and ensures follow-ups are timely and informed.

- **Syncing Chat Leads to Mailchimp**: Convert leads captured through Zoho SalesIQ chats into subscribers in your Mailchimp list. Set up a workflow that takes the email addresses collected from chats and adds them to a Mailchimp campaign, triggering a sequence of targeted emails.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).