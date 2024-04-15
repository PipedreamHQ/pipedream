# Overview

The SFTP (SSH File Transfer Protocol) with key-based authentication on Pipedream allows secure file operations over SSH. Using Pipedream's serverless platform, you can automate file transfers, integrate SFTP operations with other services, and trigger workflows based on file changes. Pipedream simplifies the process of connecting to SFTP servers by handling the connection process and authentication, letting you focus on the logic of your workflows.

# Example Use Cases

- **Automated Data Backup**: Sync files from your SFTP server to cloud storage like Google Drive or Dropbox. Whenever a new file is added or updated on your SFTP server, Pipedream can detect the change and copy the file to a cloud storage service, ensuring your data is backed up automatically.

- **Website Content Deployment**: Deploy static website content from a GitHub repository to your SFTP server. Set up a Pipedream workflow that triggers on a push to the master branch in your GitHub repo, then automatically transfers updated files to your SFTP server to update your website.

- **Database Export and Transfer**: Schedule regular database exports from a tool like Airtable or Google Sheets and transfer the exported files to an SFTP server for secure archiving or data sharing. Pipedream can handle the export process and move the data to SFTP at intervals you define.
