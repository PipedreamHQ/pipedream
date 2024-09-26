# Overview

The Microsoft Azure SQL Database API allows you to manage and interact with your SQL databases hosted on Azure directly from Pipedream. It provides a serverless way to run SQL queries, manage tables, and handle database management tasks. You can create, read, update, and delete database records, execute stored procedures, and perform a variety of other SQL operations. Leveraging this API on Pipedream enables you to automate workflows, respond to database events in real-time, and integrate with countless other apps and services.

# Example Use Cases

- **Automated Data Backups**: Create a workflow that triggers at regular intervals to back up specific tables or the entire database. Store the backups in Azure Blob Storage or integrate with another storage solution like Amazon S3.

- **Real-Time Data Synchronization**: Sync data between Azure SQL Database and third-party services like Salesforce, Shopify, or QuickBooks. Whenever a new record is inserted or updated in the Azure SQL Database, the corresponding data is automatically updated in the other service.

- **Event-Driven Notifications**: Set up a workflow that sends notifications via email, Slack, or SMS when specific database events occur, such as a new row being added to a table, or a particular threshold being reached on a key performance metric.
