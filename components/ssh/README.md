# Overview

The SSH (key-based auth) API on Pipedream empowers you to execute commands on remote servers securely. Using SSH, you can automate a myriad of server management tasks, deploy applications, or run scripts and services remotely, all within the Pipedream ecosystem. It's a robust way to integrate server operations into your serverless workflows, tapping into the vast automation potential Pipedream offers.

# Example Use Cases

- **Remote Server Management**: Automate the process of managing servers by executing periodic maintenance commands or scripts via SSH. For instance, you could set up a workflow that checks disk space and cleans temporary files weekly.

- **Continuous Deployment**: Create a workflow that listens for GitHub push events and triggers a deployment script on your server using SSH. This enables a simple CI/CD pipeline that ensures your latest code is always deployed.

- **Database Backup**: Schedule and execute database backups by running the backup command on your database server via SSH. This workflow could store the backup file in a cloud service like AWS S3 for safekeeping.
