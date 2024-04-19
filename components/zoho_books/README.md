# Overview

Zoho Books API unlocks the potential to automate and streamline accounting tasks by integrating with Pipedream's serverless platform. With this powerful combo, you can automate invoicing, manage your accounts, reconcile bank transactions, and handle contacts and items without manual input. By setting up event-driven workflows, you can ensure data consistency across platforms, trigger notifications, and generate reports, all while saving time and reducing human error.

# Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com). 
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Zoho Books". This will display [actions](/components#actions) associated with the Zoho Books app. You can choose to either "Run Node.js code with Zoho Books" or select one of the prebuilt actions for performing common API operations.
5. Once you've added a step, press the **Connect Zoho Books** button near the top. If this is your first time authorizing Pipedream's access to your Zoho Books account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked a Zoho Books account via Pipedream, pressing **Connect Zoho Books** will list any existing accounts you've linked.

Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.

# Example Use Cases

- **Invoice Automation**: Create or update invoices in Zoho Books whenever a new order is placed on your e-commerce platform like Shopify. This can trigger an email to the customer with the invoice attached, streamlining the billing process.

- **Expense Tracking**: Connect Zoho Books to your expense management app like Expensify. Whenever a new expense report is approved in Expensify, create a corresponding expense record in Zoho Books, keeping your accounts up to date.

- **Customer Synchronization**: Sync new customer data from a CRM like Salesforce to Zoho Books. When a new contact is added in Salesforce, automatically create or update the customer information in Zoho Books, ensuring accurate and consistent customer data across business tools.


# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).
