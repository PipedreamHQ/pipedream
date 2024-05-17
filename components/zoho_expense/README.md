# Overview

The Zoho Expense API allows for streamlined management of expense reporting and tracking. With Pipedream, you can automate various tasks like submitting expenses, approving reports, or syncing expense data with other accounting tools. Pipedream's serverless platform enables you to create workflows that react to new expense submissions, scheduled report generation, and much more, without the hassle of managing infrastructure.

# Example Use Cases

- **Expense Approval Automation**: Create a workflow that triggers when a new expense report is submitted. Use Pipedream to automate the approval process based on custom criteria, such as expense limits or category checks. If approved, the workflow can send notifications to the finance team or update the report status in Zoho Expense.

- **Receipt Integration with Cloud Storage**: Set up a Pipedream workflow that detects newly uploaded receipts in Zoho Expense and backs them up to a cloud storage service like Google Drive or Dropbox. This ensures that all receipts are stored redundantly and can be accessed from different platforms for accounting purposes.

- **Expense Data Sync with Accounting Software**: Build a workflow on Pipedream that periodically fetches new expense entries from Zoho Expense and pushes them to accounting software like QuickBooks or Xero. This can help keep your books up to date automatically and reduce manual data entry errors.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).