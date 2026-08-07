# Overview

The Kenjo API allows for automation and integration of HR tasks within an organization, connecting various HR processes like employee onboarding, leave management, and performance evaluations directly to Pipedream's serverless platform. Through Pipedream, users can automate workflows that trigger from Kenjo events, process data, and sync or push actions back to Kenjo or other connected apps. This enables HR teams to streamline operations, reduce manual work, and enhance data-driven decision-making.

# Example Use Cases

- **Automated Employee Onboarding**: Trigger a workflow in Pipedream when a new employee is added in Kenjo. This workflow could send a welcome email via SendGrid, create accounts in third-party services like Slack and Trello, and set reminders in Google Calendar for upcoming onboarding sessions.

- **Leave Request Approval System**: Set up a Pipedream workflow that initiates when an employee submits a leave request in Kenjo. The workflow can post the request details to a Slack channel where team leads can approve or deny the request directly. Upon decision, update the leave status in Kenjo and notify the employee via email.

- **Monthly Performance Digest**: Configure a workflow that runs monthly to fetch performance review data from Kenjo. This data can be processed to highlight top performers and areas needing improvement, then compile a report and distribute it via email using Mailgun, or present it in a more visually appealing format through a Google Sheets integration.
