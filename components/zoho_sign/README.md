# Overview

Zoho Sign API lets you automate document signing processes. Integrate with Pipedream to create or manage documents, send them for signatures, and track status updates in real-time. Sync data with other apps, trigger workflows based on document actions, or automate follow-ups once signatures are received.

# Example Use Cases

- **Automate Document Workflow**: Upon a new sale in your CRM, automatically generate a sales contract using Zoho Sign, send it to the customer for signing, and receive notifications when the document is signed.

- **Document Status Tracking**: Set up a workflow to monitor document status on Zoho Sign. When a document gets signed or declined, update the status in a Google Sheet and notify relevant team members via Slack.

- **Contract Renewal Reminders**: Use Zoho Sign to detect contracts nearing expiry. Trigger emails to customers with renewal links and pre-filled documents for hassle-free re-signing.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).