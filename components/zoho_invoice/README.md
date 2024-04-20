# Overview

The Zoho Invoice API offers a suite of tools to automate the invoicing and billing processes. With this API, you can create and manage customers, invoices, and payments. On Pipedream, you can harness these capabilities to build workflows that trigger on specific events, such as new invoice creation, or scheduled tasks that could, for example, follow up on unpaid invoices. Due to its serverless architecture, Pipedream ensures each step of your workflow runs only when needed, saving resources and time.

# Example Use Cases

- **Automate Invoice Creation for New CRM Leads**: When a new lead is added to a CRM like Salesforce, automatically create a customer and a draft invoice in Zoho Invoice, ensuring the billing process begins as soon as a sales opportunity is identified.

- **Slack Notifications for Overdue Invoices**: Set up a workflow that checks for overdue invoices daily and sends a summary message to a designated Slack channel, keeping the team informed and ready to take action on outstanding payments.

- **Sync Invoices with Accounting Software**: Automatically export new and updated invoices from Zoho Invoice to accounting software like QuickBooks. This ensures your financial records are always in sync, reducing manual data entry and the chance of errors.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).