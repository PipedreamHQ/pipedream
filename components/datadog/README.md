# Overview

The Datadog API offers a range of possibilities for monitoring, alerting, and automating applications and infrastructure. Integrating Datadog with Pipedream allows you to craft custom workflows that trigger on Datadog alerts, pipe metrics to other services, or synchronize Datadog incidents with other monitoring tools. With Pipedream's serverless platform, you can react to events, transform data, and connect to hundreds of different APIs, enriching your monitoring stack and automating operations tasks.

# Example Use Cases

- **Automated Incident Response**: Automatically create a ticket in Jira when Datadog triggers an alert. Use Pipedream to capture the alert details from Datadog, format the information appropriately, and create an issue in Jira, tagging the relevant team for quick response.

- **Real-Time Notifications**: Send custom notifications to Slack or Microsoft Teams when a Datadog monitor detects an issue. With Pipedream, you can format the alert data from Datadog to suit your team's needs and push the notifications to your chosen communication platform, ensuring your team stays informed.

- **Synchronize Monitoring Data**: Sync Datadog metrics with a Google Sheet for reporting purposes. Each time Datadog generates a new metric, a workflow in Pipedream can add this data to a Google Sheet. This is ideal for creating custom reports or dashboards that live outside of Datadog's native interface.
