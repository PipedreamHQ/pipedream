# Overview

The Zoho Recruit API lets you access the Zoho Recruit ATS functionalities programmatically, enabling integrations with other services, automation of tasks, and enhancement of the recruitment process. With this API in Pipedream, you can trigger workflows based on events in Zoho Recruit, manipulate candidate data, post jobs, schedule interviews, and automate communication. The seamless connection between Zoho Recruit and other apps through Pipedream creates a powerful ecosystem to streamline your hiring workflows.

# Example Use Cases

- **Automate Candidate Follow-Up Emails**: When a candidate's status changes in Zoho Recruit, automatically send personalized follow-up emails using Gmail or another email service. This keeps candidates engaged and informed throughout the recruitment process.

- **Sync New Candidates with HR Software**: Whenever a new candidate is added to Zoho Recruit, add their info to your HR software, like BambooHR, to maintain an updated database across platforms. This ensures all teams have access to the latest candidate information without manual data entry.

- **Post Jobs to Social Media**: Automatically share new job openings from Zoho Recruit to your company's LinkedIn and Facebook pages. This increases visibility of your job postings and attracts a broader range of applicants.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).