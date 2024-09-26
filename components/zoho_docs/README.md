# Overview

The Zoho Docs API unlocks the power to seamlessly manage documents in the cloud by integrating with Pipedream. With Pipedream's serverless platform, you can automate document sharing, conversions, and syncing files with other apps or databases. By connecting Zoho Docs to other services, you can streamline workflows, simplify collaboration, and maintain document organization with minimal manual intervention.

# Example Use Cases

- **Automated Document Backups**: Create a workflow that triggers at regular intervals to back up important documents from Zoho Docs to a cloud storage service like Google Drive or Dropbox. This ensures your files are safely archived without manual effort.

- **Team Collaboration Enhancer**: Set up an automation that watches for new files or updates in a Zoho Docs folder and notifies team members via Slack or sends an email through Gmail. Keep everyone in sync without the need to check for updates manually.

- **CRM Sync**: Whenever a new contract or customer document is added to Zoho Docs, use Pipedream to add a corresponding record in a CRM like Salesforce or HubSpot. This maintains consistency across business platforms and saves time on data entry.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).