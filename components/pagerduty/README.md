# Overview

The PagerDuty API on Pipedream lets you automate incident management and alerting workflows. By leveraging this API, you can create incidents, update statuses, and trigger notifications in PagerDuty, directly from Pipedream's serverless platform. This seamless integration allows you to connect PagerDuty with other apps and services to streamline your operations, manage on-call schedules, and respond quickly to critical issues.

# Example Use Cases

- **Automated Incident Creation for Monitoring Alerts**: Trigger an incident in PagerDuty when a monitoring system like Datadog or New Relic detects an anomaly or an outage in your services. By connecting monitoring alerts to PagerDuty, you can ensure the right team is notified instantly.

- **Scheduled On-Call Rotation Notifications**: Use Pipedream's cron job feature to send out reminders or updates about on-call rotations. This workflow can automatically fetch the current on-call schedule from PagerDuty and send a summary via email or a platform like Slack to the relevant team members.

- **Customer Support Ticket Escalation**: Escalate a high-priority support ticket from a system like Zendesk to PagerDuty. When a ticket meets certain criteria, such as being marked as 'Urgent', the workflow creates an incident in PagerDuty to alert the on-call engineer, ensuring a swift response to critical customer issues.
