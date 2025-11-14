# Overview

Zoho Sprints is a versatile agile project management tool that enables teams to plan, track, and iterate their work in sprints. With the Zoho Sprints API, you can automate your agile workflows, sync projects across different platforms, and create custom dashboards to monitor progress. Using Pipedream, you can connect Zoho Sprints with 3,000+ apps to streamline processes, trigger actions based on sprint changes, and manipulate sprint data programmatically.

# Example Use Cases

- **Automated Sprint Reporting**: Generate sprint reports automatically by connecting Zoho Sprints to a data visualization tool like Google Sheets. Whenever a sprint ends, Pipedream can trigger a workflow that compiles key metrics and populates them into a predefined Google Sheets template, giving stakeholders real-time insights.

- **Sprint Change Notifications**: Stay updated with sprint changes by creating a workflow that sends real-time notifications. When a sprint is updated in Zoho Sprints, Pipedream can trigger a notification to be sent through Slack or email, ensuring that team members are always informed about the latest sprint developments.

- **Issue Tracking Integration**: Integrate Zoho Sprints with an external issue tracking system like Jira. When a new issue is created in Jira, Pipedream can automate the creation of a corresponding work item in Zoho Sprints, keeping your backlogs synchronized and making cross-platform collaboration seamless.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).