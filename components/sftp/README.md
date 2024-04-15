# Overview

The SFTP (key-based auth) app on Pipedream allows you to securely transfer and manage files over a network. It uses SSH for data transfer and provides the same level of security as SSH, without requiring password authentication, making automation workflows more secure and less prone to human error. You can automate file uploads, downloads, synchronization tasks, and efficiently manage your remote files in a serverless environment. Integrating this with other Pipedream-supported apps enables you to craft powerful and secure data flow systems.

# Example Use Cases

- **Automated Data Backup**: Sync local data to a remote SFTP server on a schedule. Whenever files are added or updated in a specific local directory, Pipedream triggers a workflow that automatically uploads these files to a designated SFTP folder, ensuring off-site backups are always up-to-date.

- **Log File Aggregation**: Collect log files from multiple servers. Set up a Pipedream workflow that connects to various SFTP servers, downloads log files at regular intervals, and consolidates them into a single storage solution like Amazon S3 for analysis or long-term storage.

- **Web Content Deployment**: After a Git push to the master branch, automatically deploy web content to a production server. Using Pipedream triggers that respond to GitHub events, fetch the latest web assets from the repository and upload them to the SFTP server, automating the deployment process.
