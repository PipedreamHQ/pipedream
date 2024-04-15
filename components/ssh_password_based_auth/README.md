# Overview

The SSH (password-based auth) API on Pipedream allows you to run commands on remote servers securely. Through Pipedream's serverless platform, you can execute tasks, manage files, and orchestrate workflows on any server accessible via SSH using password authentication. This integration provides a powerful way to automate server management, data extraction, and deploy applications, as part of Pipedream's workflows.

# Example Use Cases

- **Automated Backup Workflow**: Trigger a workflow on Pipedream to perform a regular backup of your server's critical data. Set up a cron job that SSHs into your server, compresses relevant directories, and securely transfers them to a cloud storage service like Amazon S3 or Google Cloud Storage for safekeeping.

- **Continuous Deployment Pipeline**: Create a workflow that listens for GitHub webhook events signaling a new commit. Once a commit is detected, use the SSH (password-based auth) action to SSH into your production server, pull the latest code from your repository, run build scripts, and restart your application, achieving continuous deployment with minimal downtime.

- **Server Health Check Monitor**: Set up Pipedream to periodically run diagnostics and check the health of your server. Execute system commands via SSH to monitor CPU usage, disk space, and running services. If any metrics exceed your thresholds, use Pipedream to send alerts through email, Slack, or another communication platform to notify your team.
