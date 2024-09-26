# Overview

The ADP API provides access to a breadth of payroll and human capital management services. With Pipedream, you can automate workflows that bridge the gap between ADP and other apps, streamlining your HR processes. By leveraging Pipedream's serverless platform, you can orchestrate data flows, synchronize employee information, manage payroll events, and react to changes in ADP data in real-time without writing extensive code.

# Example Use Cases

- **Employee Onboarding Automation**: When a new employee is added in ADP, automatically send a welcome email using SendGrid, create accounts in necessary internal systems, and post a welcome message in Slack to announce their arrival.

- **Payroll Change Notifications**: Monitor changes in payroll data within ADP and trigger notifications in real-time. Whenever there's an update, you can send an alert via email, post a message to a specific Slack channel, or log the change in Google Sheets for further analysis and record-keeping.

- **Time-Off Synchronization**: Sync time-off requests from ADP to a Google Calendar to keep everyone informed. When an employee requests time off, a Pipedream workflow can automatically create a calendar event, and if needed, send a notification to their manager for approval via Twilio SMS or a Slack direct message.
