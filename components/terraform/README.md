# Overview

The Terraform API allows for the automation of infrastructure as code (IaC) management tasks. With Pipedream, you can orchestrate workflows that interact with Terraform to create, update, or destroy infrastructure programmatically. You can trigger workflows with webhooks, schedule them, or run them in response to events from other services. By integrating Terraform with Pipedream, you can streamline your DevOps processes, enforce compliance, and manage infrastructure changes with ease.

# Example Use Cases

- **Automated Infrastructure Deployment**: Trigger a Pipedream workflow to deploy new infrastructure as code changes are pushed to a GitHub repository. Use the GitHub app to listen for `push` events and then run Terraform plans and applies within Pipedream.

- **Scheduled Infrastructure Audits**: Create a workflow that runs on a schedule to perform Terraform `plan` operations against your current state files, ensuring that the actual infrastructure matches the desired state. Send the output to a Slack channel for review using the Slack app.

- **Infrastructure Change Notifications**: Set up a workflow that detects changes in Terraform state and sends notifications via email or messaging platforms. Use Pipedream’s built-in cron job feature to periodically check for state changes and alert your team using the Email by Pipedream or Twilio SMS app.
