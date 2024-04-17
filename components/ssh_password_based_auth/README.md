# Overview

The SSH (password-based auth) app on Pipedream facilitates the orchestration of commands and automations on remote servers securely. With it, you can execute shell commands, manage files, and run scripts on your server as part of Pipedream workflows. This unlocks the potential for a host of automations like deploying applications, monitoring system performance, or automating backups — all triggered by events from numerous apps supported on Pipedream.

# Example Use Cases

- **Automated Deployment on Git Push**: When a new commit is pushed to a specific branch on GitHub, trigger a Pipedream workflow that uses SSH to pull the latest code changes and restarts the application on a remote server. This streamlines deployment processes and ensures that the latest version is always running.

- **Scheduled Database Backups**: Set up a Pipedream workflow that triggers on a schedule (e.g., nightly) to SSH into your server and execute a database backup script. The workflow could then save the backup file to cloud storage like Google Drive or Dropbox, offering you both automation and offsite backup storage.

- **Real-time Server Monitoring and Alerts**: Create a Pipedream workflow that periodically runs diagnostics via SSH on your server. The results could be sent to a monitoring app like Datadog, or used to trigger alerts via email or Slack if certain metrics exceed predefined thresholds, ensuring prompt response to potential issues.
