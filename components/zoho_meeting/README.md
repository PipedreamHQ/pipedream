# Overview

The Zoho Meeting API lets you automate various aspects of managing online meetings and webinars. You can create, update, or cancel sessions, list all your meetings, fetch details of specific meetings, and more. Integrating the Zoho Meeting API with Pipedream enables you to connect your meeting management flow with other apps and services, streamlining your workflow and automating repetitive tasks.

# Example Use Cases

- **Automate Meeting Creation and Notifications**: Create meetings automatically in Zoho Meeting based on triggers from other apps, such as new event bookings in Calendly. Then use Pipedream to send custom email invites or Slack messages to the participants with the meeting details.

- **Sync Meetings with Google Calendar**: Whenever a new meeting is scheduled in Zoho Meeting, use Pipedream to create a corresponding event in Google Calendar, and vice versa, ensuring your schedule is always up-to-date across platforms.

- **Meeting Insights with Data Processing**: After a meeting ends, use Pipedream to fetch the meeting details and attendance report from Zoho Meeting. Process this data to gain insights or update CRM records in Salesforce, and finally, store the processed data in a Google Sheets document for record-keeping and further analysis.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).