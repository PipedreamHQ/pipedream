# Overview

The SSH (key-based auth) API on Pipedream allows you to securely manage and automate tasks on remote servers. Through Pipedream's serverless platform, you can execute shell commands, transfer files, and even orchestrate complex deployments with ease. Leveraging key-based authentication provides a more secure alternative to password-based logins, minimizing the risk of unauthorized access. Pipedream's integration enables you to trigger these SSH actions from a wide variety of events, from GitHub commits to scheduled cron jobs.

# Example Use Cases

- **Automated Backups to Cloud Storage**: Trigger an SSH command to create a backup of your server data and subsequently use Pipedream's built-in S3 app to upload that backup to an AWS S3 bucket. This ensures your backups are stored securely off-site and can be automated to run at regular intervals.

- **Continuous Deployment Pipeline**: Combine SSH with GitHub's app on Pipedream to detect new commits or releases. Upon such triggers, Pipedream can run SSH commands to pull the latest code changes and deploy them to your production or staging servers, automating your deployment process.

- **Database Maintenance Automation**: Schedule regular database maintenance tasks, such as optimizations or clean-ups, by triggering SSH commands from Pipedream's cron scheduler. Additionally, integrate with Slack to send notifications about the status of the maintenance tasks directly to your team's channel.
