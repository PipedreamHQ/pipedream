# Overview

The Zoho Bigin API provides access to Zoho Bigin's CRM features, allowing you to manage contacts, deals, and tasks programmatically. With Pipedream, you can harness this API to create no-code, serverless workflows that automate tasks between Zoho Bigin and multiple other apps. You can sync data, respond to events in real-time, and augment the capabilities of Zoho Bigin by connecting to over 300 other apps supported by Pipedream.

# Example Use Cases

- **Sync New Bigin Contacts to Google Sheets**: When a new contact is added in Zoho Bigin, this workflow automatically appends the contact's details to a Google Sheets spreadsheet. This is useful for maintaining backup data on contacts or providing other teams with real-time access to contact information.

- **Create Bigin Contacts from Shopify Orders**: Whenever a new order is placed on Shopify, this workflow creates a corresponding contact in Zoho Bigin, ensuring your CRM is always up to date with customer information from your e-commerce platform.

- **Send Slack Notifications for New Bigin Deals**: Set up a workflow that listens for new deals in Zoho Bigin and sends a notification with the deal details to a designated Slack channel. This keeps your team informed immediately when potential revenue is on the horizon.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).