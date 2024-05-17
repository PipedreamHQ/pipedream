# Overview

The Zoho WorkDrive API interacts with Zoho's cloud-based file management system, enabling automated file and folder operations, team management, and content collaboration. With Pipedream, you can harness this API to create workflows that trigger on specific events, manipulate files and folders, and integrate with other services for a seamless productivity boost.

# Example Use Cases

- **Automated Data Backup**: Use Pipedream to monitor a specific folder in Zoho WorkDrive for new files. When a new file is detected, automatically back it up to an external storage service like Dropbox or Google Drive, ensuring redundancy and data safety.

- **Content Approval Pipeline**: Create a workflow where documents uploaded to a 'Pending Approval' folder in WorkDrive trigger an approval request in Slack to designated team members. Once approved, move the document to an 'Approved' folder and notify the team via email through a service like SendGrid.

- **Team Onboarding**: Set up an onboarding workflow that creates a new folder structure in Zoho WorkDrive for each new team member added in an HR platform like BambooHR. Populate the folders with necessary onboarding documents and share access with the new member, streamlining the onboarding process.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).