# Overview

The Zoho Campaigns API opens up a world of possibilities for email marketing automation within Pipedream, allowing you to manage contacts, campaigns, and reports programmatically. You can connect Zoho Campaigns with other apps to create workflows that automate various tasks, such as synchronizing subscriber lists, triggering campaigns based on specific actions or events, and analyzing campaign performance with custom metrics.

# Example Use Cases

- **Sync New Users to Zoho Campaigns**: Automatically add new users from a CRM like Salesforce to a Zoho Campaigns mailing list whenever a new lead is captured. This ensures your marketing efforts reach all potential customers.

- **Trigger Email Campaigns after E-commerce Transactions**: Launch Zoho Campaigns email sequences when a customer completes a purchase in an e-commerce platform like Shopify. Use this workflow to send order confirmations, request reviews, or offer post-purchase discounts.

- **Dynamic Campaign Reporting**: Compile campaign performance data from Zoho Campaigns and send it to a Google Sheets spreadsheet for advanced analysis and visualization. This workflow can help you make data-driven decisions to optimize your email marketing campaigns.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).