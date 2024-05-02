# Overview

Zoho Catalyst is a cloud-based backend for building and hosting serverless applications. With its API, you can create, read, update, and delete records in Catalyst Data Store, run Catalyst Functions, manage files in Catalyst File Store, and orchestrate various backend processes. Integrating Zoho Catalyst with Pipedream allows you to seamlessly connect these backend operations with other services and automate workflows. For example, you can trigger a function when you receive an email, process data from webhooks, or sync information between Zoho Catalyst and other platforms.

# Example Use Cases

- **Sync New Users to a Mailing List**: When new users sign up in a Zoho Catalyst app, you can automatically add their contact information to a mailing list in Mailchimp. This keeps your marketing efforts in sync and ensures that you're reaching out to the latest users of your app.

- **Automate File Backup to Cloud Storage**: Whenever a new file is uploaded to Zoho Catalyst File Store, you can create a workflow that automatically backs up the file to Google Drive, Dropbox, or another cloud storage service. This redundancy ensures that you always have a backup of critical files.

- **Process Payments and Update Inventory**: After a payment is processed via a platform like Stripe, you can use Pipedream to call Zoho Catalyst Functions that update inventory counts and generate a sales record in the Catalyst Data Store. This automation streamlines order fulfillment and inventory management.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).