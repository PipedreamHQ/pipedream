# Overview

With Pipedream's SFTP (key-based auth) API, you can automate file transfers to and from secure servers. This is immensely useful for workflows involving secure data exchange, backup routines, or synchronizing files across different environments. By leveraging key-based authentication, you ensure secure and easy access without the constant need for password input. Within Pipedream, you can integrate SFTP with a multitude of other apps to create robust data pipelines and automate repetitive tasks.

# Example Use Cases

- **Automated Data Backup to SFTP Server**: Sync local or cloud storage files to your SFTP server on a schedule. Use Pipedream's built-in cron job feature to regularly transfer important files from a source like Google Drive, ensuring that your backups are always up to date.

- **Website Content Deployment**: Deploy static website content to your hosting server via SFTP. Combine Pipedream's HTTP trigger with SFTP actions to push code changes whenever a new commit is pushed to your Git repository, such as GitHub or Bitbucket.

- **Log File Aggregation and Analysis**: Collect and transfer log files from multiple servers to a central SFTP server. Then, use Pipedream to pipe these logs into data analysis tools such as Google BigQuery for advanced querying and reporting, providing insights into system performance and user behavior.
