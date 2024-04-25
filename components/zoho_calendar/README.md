# Overview

Zoho Calendar API allows for the integration and manipulation of calendar events, giving you the power to automate workflows involving scheduling, reminders, and event management right within Pipedream. With this API, you can create, read, update, or delete events, and also respond to invites. By leveraging Pipedream's capabilities, you can connect Zoho Calendar with various other services to streamline your calendar management and synchronize events with other apps, or trigger actions based on calendar events.

# Example Use Cases

- **Sync Zoho Calendar Events with Google Sheets**: Automate the export of your Zoho Calendar events into a Google Sheet for advanced data analysis and record-keeping. Every time a new event is added to your Zoho Calendar, Pipedream triggers a workflow that appends the event details to a Google Sheet. This is great for reporting and archival purposes.

- **Create Slack Notifications for Upcoming Events**: Get timely reminders for upcoming events on your Zoho Calendar by setting up a workflow that sends notifications to a Slack channel. Whenever an event is about to start, Pipedream uses the Zoho Calendar API to fetch the event details and posts a message in Slack, ensuring you never miss an important meeting or appointment.

- **Trigger Email Campaigns from Event Sign-Ups**: Kick-off email campaigns whenever someone signs up for an event on your Zoho Calendar. Pipedream can detect new event attendees and automatically trigger an email sequence via an email marketing platform, like Mailchimp, providing them with event details, reminders, or related promotional content.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).