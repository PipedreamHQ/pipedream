# Overview

The Zoho CRM API enables the manipulation and retrieval of data within Zoho CRM, a platform for managing your sales, marketing, support, and inventory in a single system. Leveraging this on Pipedream, you can automate tasks like syncing contacts, updating lead statuses, or creating custom CRM operations that trigger actions in other apps. Pipedream's serverless platform allows for real-time data processing, transforming, and orchestrating workflows that respond to events in Zoho CRM with minimal latency.

# Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com).
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Zoho CRM". This will display [actions](/components#actions) associated with the Zoho CRM app. You can choose to either "Run Node.js code with Zoho CRM" or select one of the prebuilt actions for performing common API operations.
5. Once you've added a step, press the **Connect Zoho CRM** button near the top. If this is your first time authorizing Pipedream's access to your Zoho CRM account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked a Zoho CRM account via Pipedream, pressing **Connect Zoho CRM** will list any existing accounts you've linked. 

Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.

# Example Use Cases

- **Lead Qualification and Assignment Workflow**: When a new lead is entered into Zoho CRM, Pipedream can automatically qualify the lead based on predefined criteria (like job title or company size) and assign it to the appropriate sales representative. This can be extended by notifying the assigned rep via Slack or email, ensuring prompt follow-ups.

- **Contact Sync Across Platforms**: Keep contact information in sync between Zoho CRM and other platforms such as Google Contacts, Mailchimp, or Shopify. Whenever a contact is updated in Zoho CRM, Pipedream can propagate those changes to the other platforms in real-time, maintaining consistency and accuracy across your sales and marketing tools.

- **Automated Support Ticket Creation**: Integrate Zoho CRM with a customer support platform like Zendesk. When a deal reaches a certain stage in Zoho CRM indicating potential issues, Pipedream can automatically generate a support ticket in Zendesk with the relevant deal and customer information, streamlining the support process and ensuring issues are addressed promptly.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).