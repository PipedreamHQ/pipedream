# Overview

The Zoho Analytics API lets you harness the power of your data by automating complex analytics tasks. With this API, you can create, access, and manage reports, dashboards, and KPI widgets programmatically. Integrate with Pipedream's serverless platform to trigger actions based on events, sync data across apps, and automate workflows without managing servers. Whether it's updating datasets in real-time or sending reports to your team, the possibilities stretch as wide as your data does.

# Example Use Cases

- **Sync New Leads to Zoho Analytics**: Whenever a new lead is added to your CRM, like Salesforce, use Pipedream to automatically push this data into Zoho Analytics. This keeps your datasets fresh and your insights accurate.

- **Automate Weekly Sales Reports**: Schedule a weekly event in Pipedream to fetch sales data from Zoho Analytics, format it, and send a well-crafted report via Gmail or Slack to keep your team informed.

- **Track Social Media Campaign Performance**: Connect your social media platforms, like Facebook Ads, to Zoho Analytics through Pipedream. Analyze campaign data and automatically adjust bids or budgets based on performance metrics.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).



