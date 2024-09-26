# Overview

The Opsgenie API enables automated incident management and alerting to streamline response actions. It allows you to create, update, and manage alerts, as well as configure and query users, schedules, and on-call rotations. Integrating Opsgenie with Pipedream opens up possibilities for orchestrating complex workflows, such as incident triggering from various sources, auto-update of tickets, synchronization with other tools, and much more, all in a serverless environment.

# Example Use Cases

- **Incident Alerting from Monitoring Tools**: Trigger an Opsgenie alert in Pipedream when a monitoring tool like Datadog or Prometheus detects an anomaly. This workflow can automatically escalate and notify the right teams based on the alert severity.

- **Scheduled On-Call Rotations Sync**: Use Pipedream to sync Opsgenie's on-call schedules with Google Calendar. This ensures that any changes in Opsgenie are reflected on the team's calendars, keeping everyone informed of their on-call periods without manual updates.

- **Auto-Resolution of Incidents**: Configure a workflow in Pipedream to watch for status updates from a linked ticketing system, such as Jira. When an incident is marked as resolved in Jira, automatically close the corresponding alert in Opsgenie.
