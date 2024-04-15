# Overview

The PostgreSQL API on Pipedream allows you to run SQL queries and operations against your PostgreSQL database directly from a serverless Pipedream workflow. This integration enables you to automate database tasks, sync data between apps, trigger actions based on database changes, and more, without the overhead of managing infrastructure. Leverage the power of PostgreSQL in conjunction with Pipedream’s multitude of app integrations for robust, automated workflows.

# Example Use Cases

- **Data Sync Between PostgreSQL and Google Sheets**: Sync new rows from a PostgreSQL database to a Google Sheet for easy sharing and analysis. Each time a new row is inserted into your database, trigger a workflow that appends the data to a specified Google Sheet.

- **Database Backup Notifications**: Run a scheduled workflow that backs up your PostgreSQL database and then sends a success or failure notification via Discord or Slack. This can be used to monitor regular backups and maintain database integrity.

- **Dynamic Content for Email Campaigns**: Generate personalized email content by retrieving user data from PostgreSQL before sending emails via SendGrid or another email service. Use this data to tailor content, ensuring more engaging and targeted email campaigns.
