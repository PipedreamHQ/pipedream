# Overview

The SSH (password-based auth) API on Pipedream enables you to run commands on remote servers securely using Secure Shell (SSH) with password authentication. This capability is especially powerful within Pipedream's serverless architecture, as you can automate tasks, manage systems, or provision resources without the need to manage infrastructure for connectivity. Use this to interact with any server that supports SSH and integrate with other Pipedream-supported apps and services for comprehensive workflow automation.

# Example Use Cases

- **Automated Server Maintenance**: Execute regular maintenance tasks on a server, such as updating packages, cleaning up temporary files, or syncing files to a backup location. Tie this into a schedule within Pipedream to run it at set intervals.

- **Continuous Deployment Workflow**: Combine SSH with GitHub triggers in Pipedream to create a continuous deployment pipeline. When new code is pushed to a repository, trigger a workflow that runs tests and deploys the code to production servers via SSH.

- **Database Backup Automation**: Use SSH to initiate database dumps on a remote server, then connect with the Dropbox or Google Drive Pipedream app to upload and store the backup files offsite, ensuring your database backups are regularly updated and securely stored.
