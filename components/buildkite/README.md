# Overview

The BuildKite API is a powerhouse for automating your continuous integration and delivery (CI/CD) pipelines. With it, you can trigger builds, get information on agents and artifacts, and manage your organization's setup programmatically. Pipedream leverages this API to connect BuildKite with a myriad of other services, allowing for customized workflows that go beyond the standard CI/CD process.

# Example Use Cases

- **Automated Deployment Notifications**: Trigger a Slack notification when a Buildkite build passes or fails, including a summary of which jobs succeeded and links to logs.

- **CI Failure Triage**: When a build fails, automatically fetch job logs and annotations, then post a structured summary to your team's channel with the relevant error context.

- **Artifact Collection**: After a successful build, list and download test result artifacts (JUnit XML, coverage reports) and feed them into a reporting dashboard or storage service.
