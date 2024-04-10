# Overview

The Airplane API unlocks the ability to manage and automate tasks, runbooks, and workflows within their ecosystem. Pipedream acts as the perfect catalyst for these automations, allowing you to integrate the Airplane API with numerous other services and APIs. With Pipedream, you can react to events, schedule tasks, and orchestrate complex workflows, all while leveraging Airplane's capabilities to execute tasks or runbooks programmatically.

## Example Airplane Workflows on Pipedream

- **Automated Issue Resolution**: Create a Pipedream workflow that triggers when a new issue is reported in your bug tracking tool (like Jira). The workflow then calls the Airplane API to run a diagnostic runbook, and posts the results back to the Jira ticket.

- **Scheduled Database Maintenance**: Use Pipedream's cron job feature to schedule regular database clean-ups. The workflow could trigger an Airplane task that archives old records and optimizes database performance, with logs or a status report sent to a Slack channel upon completion.

- **Customer Support Automation**: When a high-priority support ticket is created in a tool like Zendesk, a Pipedream workflow is initiated. It calls an Airplane task to gather the customer's usage data and environment details, compiles a report, and attaches it to the support ticket to aid the support team's investigation.
