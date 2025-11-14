# Overview

The Zoho People API lets you interface with Zoho People, a human resource management platform. With this API on Pipedream, you can automate HR processes, sync employee data across systems, manage leave records, and more. Use Pipedream's no-code platform to integrate Zoho People with 3,000+ other apps for custom workflows that fit your business needs.

# Example Use Cases

- **Employee Onboarding Automation**: Trigger a workflow in Pipedream when a new employee is added to Zoho People. The workflow can send a welcome email through SendGrid, create a new user in your Active Directory, and add the employee to relevant Slack channels automatically.

- **Leave Request Approval**: Set up a Pipedream workflow where leave requests in Zoho People trigger an approval process. The request can be pushed to a Slack channel for a manager's approval, and once approved, it can update the leave status in Zoho People and notify the employee via Twilio SMS.

- **Daily HR Report Generation**: Configure a daily scheduled workflow in Pipedream that fetches the previous day's employee activity from Zoho People, compiles a report, and then sends this report through Gmail to the HR department, providing insights into attendance, time-off, and other HR metrics.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).