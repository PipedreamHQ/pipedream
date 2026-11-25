# Overview

[LogBrew](https://logbrew.co) is error tracking and log management for your apps, with a free tier. LogBrew groups errors into issues, keeps your logs and traces, and fires alerts when something breaks. With the LogBrew components in Pipedream you can start a workflow when a new issue shows up or an alert fires, send logs from any workflow, and resolve issues when a fix ships.

# Example Use Cases

- **Post new issues to chat.** Use the New Issue source to send each new error to Slack or Discord with its severity and a link to the issue in LogBrew.
- **Open a ticket when an alert fires.** Use the New Alert source to create a Linear or Jira ticket for the on-call engineer.
- **Log workflow results.** Add the Send Log action at the end of a workflow to keep a record of each run in LogBrew, with your own attributes such as an order ID.
- **Resolve issues on deploy.** Run the Resolve Issue action from a deploy webhook when a release fixes a known issue.

# Getting Started

1. Sign up at [logbrew.co](https://logbrew.co) and create a project.
2. In LogBrew, open **Settings**, then **API Tokens**, and create a token with **Projects** read, **Telemetry** read & write, and **Alerts** read access.
3. If you plan to use Send Log, open **API Keys** in your LogBrew project and create an ingest key.
4. In Pipedream, connect your LogBrew account. Paste the API token, and the ingest key if you have one. Keep the default API URL `https://api.logbrew.co` unless you run LogBrew on your own host.

# Troubleshooting

- **401 Invalid or expired token.** Create a new API token in LogBrew and update the connection.
- **403 Insufficient permissions.** The token or your project role does not allow the call. New Alert needs the Alerts read scope, and Resolve Issue needs permission to manage issues in the project.
- **Ingest key missing.** Send Log uses the project ingest key, not the API token. Add the ingest key to your LogBrew connection.
- **No events on the first run.** The sources only emit issues and alerts that come after you deploy them, plus up to 10 recent ones as a sample.
