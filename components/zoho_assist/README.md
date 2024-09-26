# Overview

The Zoho Assist API provides remote support and access functionalities, enabling automated session management, customer support, and IT operations. By integrating it with Pipedream, you can craft serverless workflows that respond to various triggers and perform actions like creating support sessions, fetching session details, or managing users. The API's versatility in Pipedream allows for streamlined coordination between support requests and responses, facilitating seamless IT support and management tasks.

# Example Use Cases

- **Automated Support Session Creation**: Automate the creation of support sessions in response to customer tickets from a helpdesk platform like Zendesk. When a new ticket is received, Pipedream can trigger a Zoho Assist session and link the session info back to the ticket for quick resolution.

- **Session Status Monitoring**: Monitor ongoing Zoho Assist sessions and log their status to a Google Sheet. Use this for reporting, auditing, or triggering follow-ups based on session outcomes, ensuring nothing falls through the cracks.

- **User Management Sync**: Sync user accounts between Zoho Assist and your internal systems, such as an HR platform. Whenever a new employee is onboarded, automatically create their Zoho Assist account to grant them the necessary access privileges.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).