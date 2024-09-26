# Overview

The Zoho Survey API enables you to integrate your surveys and their data with other applications, automating your workflows and allowing you to manage surveys and responses efficiently. Within Pipedream, you can harness this API to trigger workflows, process survey responses, create or update surveys, and sync your survey data with other services. This streamlined interaction facilitates real-time data collection and analysis, leading to informed decision-making and proactive engagement with your audience.

# Example Use Cases

- **Automate Response Collection to Google Sheets**: Collect survey responses in real-time and automatically add them to a Google Sheets spreadsheet. This is ideal for data analysis and sharing insights with teams who depend on quick access to fresh data.

- **Send Survey Invitations via Email or SMS**: Use Pipedream to trigger an action whenever a new contact is added to your CRM like Salesforce. The workflow would send an automated email or SMS invitation to participate in a Zoho Survey to the new contact, ensuring consistent engagement with prospective clients or stakeholders.

- **Sync Survey Data with Slack**: Set up a workflow where new survey responses are instantly posted to a Slack channel. This keeps your team updated on customer feedback or employee satisfaction without them needing to leave their communication hub.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).