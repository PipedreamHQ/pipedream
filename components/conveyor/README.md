# Overview

The Conveyor API facilitates automated management of continuous delivery for your applications, allowing you to build, test, and deploy code with ease. By leveraging Pipedream's integration capabilities, you can connect the Conveyor API with a multitude of apps to streamline your CI/CD pipeline, automate deployment tasks, and synchronize your development workflow with other services such as version control, project management, and notification systems.

# Example Use Cases

- **Automate Deployment Notifications**: Use Pipedream to trigger a workflow every time Conveyor successfully deploys a new version of your application. This workflow could send a message to a Slack channel or Discord server, informing your team about the deployment details and status.

- **Sync Deployment Status with Project Management Tools**: Create a workflow on Pipedream that updates a ticket in Jira, Trello, or Asana with the latest deployment status from Conveyor. This provides real-time visibility into which features or bug fixes have been deployed to your staging or production environments.

- **Automated Rollback on Failure**: Design a workflow that listens for failed deployment events from Conveyor. On detecting a failure, the workflow could automatically trigger a rollback to the previous stable version of the application and post an incident report to an incident management tool like PagerDuty or Opsgenie.
