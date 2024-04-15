# Overview

The SFTP (Password-Based Auth) API on Pipedream allows you to interact with remote servers using the SSH File Transfer Protocol to manage files securely. This API enables you to automate a variety of tasks, such as uploading or downloading files, synchronizing directories, or simply accessing data stored on an SFTP server. By utilizing password-based authentication, you can establish a secure connection to perform these operations programmatically within your Pipedream workflows, integrating seamlessly with various other services and APIs.

# Example Use Cases

- **Automated Data Backup**: Use the SFTP API on Pipedream to create a workflow that periodically backs up critical data from your web applications to a remote server. Set up a cron-triggered event that gathers data from your app, compresses it, and uploads the archive to a designated folder on the SFTP server.

- **Sync Inventory Files**: Connect Pipedream's SFTP API to your e-commerce platform to maintain synchronized inventory levels. When inventory updates occur, trigger a workflow that compiles the new inventory data and securely transfers the updated file to your supplier's SFTP server, ensuring accurate and timely updates.

- **Collect and Process Logs**: Build a Pipedream workflow that connects to your server via the SFTP API to download logs at regular intervals. Once the logs are retrieved, use Pipedream's built-in data transformation capabilities to parse and analyze the log data, then send insights or alerts to monitoring tools like Datadog or Slack.
