# Overview

The Zoho Mail API equips you with the ability to automate actions on emails, manage mailboxes, and interact with your Zoho Mail account programmatically. With Pipedream, you can trigger workflows on new emails, send emails automatically, and connect Zoho Mail to thousands of other services, streamlining communication processes, enhancing productivity, and enabling efficient data management.

# Example Use Cases

- **Email to Task Conversion**: Create tasks in project management tools like Trello or Asana when receiving emails with specific keywords or from certain senders. This can automate the process of tracking important requests or action items coming through your email.

- **Support Ticket Generation**: On receiving an email with a support query or issue report, instantly generate a ticket in a customer support platform like Zendesk or Freshdesk. This helps in ensuring that customer issues are addressed promptly and not lost in the shuffle of an inbox.

- **Email Campaign Analytics**: After sending out a marketing campaign, you might want to track responses and engagement. Use the API to tag and categorize responses, then send this data to analytics tools like Google Sheets or a BI platform to measure campaign effectiveness.

# Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com).
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Zoho Mail". This will display [actions](/components#actions) associated with the Zoho Mail app. You can choose to either "Run Node.js code with Zoho Mail" or select one of the prebuilt actions for performing common API operations.
5. Once you've added a step, press the **Connect Zoho Mail** button near the top. If this is your first time authorizing Pipedream's access to your Zoho Mail account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked a Zoho Mail account via Pipedream, pressing **Connect Zoho Mail** will list any existing accounts you've linked. 

Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).