# Overview

With the PostgreSQL API on Pipedream, you can interact with your PostgreSQL databases directly within your workflows. This integration lets you run SQL queries, insert, update, and delete rows, or listen for new rows in real-time. Pipedream’s serverless platform facilitates the automation of tasks involving database operations, data enrichment, and connecting PostgreSQL with hundreds of other apps.

# Example Use Cases

- **Real-time Data Sync with Google Sheets**: Use PostgreSQL triggers to listen for new rows added to your database. When a new row is inserted, automatically push that data to a Google Sheets spreadsheet. This workflow is ideal for creating real-time reports or sharing data across teams without database access.

- **Scheduled Data Backups**: Set up a recurring workflow on Pipedream that executes a SQL command to back up your PostgreSQL database at regular intervals. Store the backup files in a cloud storage service like Amazon S3, ensuring your data is safe and retrievable.

- **Slack Notifications for Database Changes**: Monitor specific tables in your PostgreSQL database for changes. When a row is updated, insert a new one, or delete one, trigger a workflow that sends a custom alert to a Slack channel. This can help teams stay informed of critical data changes instantly.
