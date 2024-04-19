# Overview

The Zoho Sheet API allows you to manipulate spreadsheet data programmatically. Imagine harnessing this functionality within Pipedream's ecosystem, where you can automate data flows, sync information across platforms, and generate reports with ease. With Pipedream, you can trigger workflows using events from numerous apps, fetch or push data to Zoho Sheet, analyze or transform this data, and even automate notifications based on the results.

# Example Use Cases

- **Automated Invoice Generation**: Trigger a workflow when a new sale is logged in your CRM (like Salesforce). The Zoho Sheet API adds sale details to a spreadsheet, calculates totals, and generates an invoice. Then, use an email service like SendGrid to send the invoice to the customer.

- **Marketing Campaign Tracking**: When a new campaign is launched, a workflow is triggered to create a new sheet for tracking. As campaign data flows in from platforms like Google Analytics or Facebook Ads, it's logged in the sheet. Use Pipedream to process this data and update the sheet with key performance metrics.

- **Inventory Management**: Set up a workflow that triggers on a schedule (e.g., daily). The workflow fetches inventory data from an e-commerce platform like Shopify, updates the Zoho Sheet with current stock levels, and applies conditional formatting to highlight items with low stock. Additionally, it could create purchase orders for items below threshold levels.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).