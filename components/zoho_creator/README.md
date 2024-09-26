# Overview

Zoho Creator is a low-code platform that enables the building of custom applications tailored to business needs without extensive coding knowledge. Via its API, you can automate processes, manage data, and integrate with other services. Pipedream amplifies this capability by offering a serverless platform where events from various apps trigger workflows. You can use Zoho Creator’s API on Pipedream to create, read, update, and delete records, automate data flows, and link your custom apps with a myriad of other services for efficient, automated workflows.

# Example Use Cases

- **Lead Capture Automation**: When a new lead is captured in Zoho Creator, trigger a Pipedream workflow to add the lead to a CRM like Salesforce, send a personalized welcome email through SendGrid, and notify the sales team on Slack. This workflow ensures timely engagement with potential customers and streamlines the lead nurture process.

- **Inventory Management**: Set up a workflow that monitors inventory levels in Zoho Creator. When stock for a particular item falls below a predefined threshold, Pipedream can automatically reorder the item from a supplier through an API like Supplier's API, update the inventory in Zoho Creator, and notify the inventory manager via an email or a message on Microsoft Teams. This keeps stock levels optimal with minimal manual intervention.

- **Customer Support Ticket Routing**: Whenever a new support ticket is created in Zoho Creator, use Pipedream to analyze the ticket content using a Natural Language Processing (NLP) service like Google Cloud Natural Language API. Based on the analysis, categorize and assign the ticket to the right department, update the ticket with the category in Zoho Creator, and post ticket details to a department-specific Trello board or channel in Teams. This ensures that tickets are addressed by the most suitable team, improving response times and customer satisfaction.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).