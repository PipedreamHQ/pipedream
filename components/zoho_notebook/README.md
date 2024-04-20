# Overview

The Zoho Notebook API allows for the creation, management, and retrieval of digital notes within the Zoho Notebook service. On Pipedream, you can harness this API to automate your note-taking processes, synchronize content across different platforms, and trigger actions based on updates to your notes. With Pipedream's capability to integrate various apps, you can connect Zoho Notebook with other services to streamline workflows and increase productivity.

# Example Use Cases

- **Automated Note Syncing with Google Drive**: Whenever you create a new note in Zoho Notebook, a Pipedream workflow can automatically replicate the note to a designated folder in Google Drive. This ensures that your notes are backed up and accessible from the cloud storage service of your choice.

- **Task Creation in Project Management Tools from Notes**: When a note containing specific keywords or tags (like "TODO" or "#ProjectX") is added to Zoho Notebook, Pipedream can parse the note and create corresponding tasks in a project management app such as Trello or Asana, linking back to the original note for reference.

- **Email Digest of Daily Notes**: Compile a daily digest email of all new notes created in Zoho Notebook during the day. Using Pipedream's scheduled triggers, you can collate notes and send a summary to yourself or your team to keep everyone informed and aligned.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).