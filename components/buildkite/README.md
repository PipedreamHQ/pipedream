# Overview

The BuildKite API is a powerhouse for automating your continuous integration and delivery (CI/CD) pipelines. With it, you can trigger builds, get information on agents and artifacts, and manage your organization's setup programmatically. Pipedream leverages this API to connect BuildKite with a myriad of other services, allowing for customized workflows that go beyond the standard CI/CD process. You can automate notifications, synchronize with project management tools, or even gather analytics to optimize your build processes.

# Example Use Cases

- **Automated Deployment Notifications**: Create a workflow where Pipedream listens for BuildKite build completion events. Once a build succeeds, use the Slack app to send a notification to your team's channel with the build details and deployment status.

- **Issue Tracking Integration**: Automate the process of updating issues or tickets in tools like Jira whenever a build fails. Set up a Pipedream workflow that watches for failed build events, extracts the relevant error information, and uses the Jira API to create or update an issue, linking back to the failed build for quick access.

- **Performance Metrics Aggregation**: Gather build performance metrics over time by setting up a Pipedream workflow that triggers on every build completion. Use the workflow to extract timing and success rate data, feeding it into a Google Sheets document or a database connected via Pipedream, to track and analyze your CI/CD process efficiency.
