# Overview

The MySQL application on Pipedream enables direct interaction with your MySQL databases, allowing you to perform CRUD operations—create, read, update, delete—on your data with ease. You can leverage these capabilities to automate data synchronization, report generation, and event-based triggers that kick off workflows in other apps. With Pipedream's serverless platform, you can connect MySQL to hundreds of other services without managing infrastructure, crafting complex code, or handling authentication.

# Example Use Cases

- **Automated Data Backup Workflow**: Automatically back up specific tables or datasets from MySQL to cloud storage services like Google Drive or Amazon S3 at regular intervals. This flow can be set up to trigger on a schedule, ensuring your data is consistently backed up without manual intervention.

- **Real-time Customer Data Sync**: Sync new customer information from a CRM platform like Salesforce or HubSpot to your MySQL database in real time. Whenever a new contact is added to the CRM, the workflow triggers and inserts or updates the corresponding record in MySQL, keeping your customer data aligned across systems.

- **Email Alerts on Database Changes**: Monitor specific tables in your MySQL database for changes, such as new entries or updates to existing records. Use this trigger to send email notifications through SendGrid or another email service whenever there's a significant database modification, keeping relevant stakeholders informed.
