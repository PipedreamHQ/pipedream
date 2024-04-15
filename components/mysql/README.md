# Overview

With the MySQL API on Pipedream, you can easily connect to your MySQL databases to run queries, manage tables, and interact with your data in real-time. Pipedream's serverless platform allows you to create workflows that trigger on various events and perform actions on your database without managing infrastructure. You can use SQL to fetch, insert, update, or delete records, and integrate with hundreds of apps to automate your data flow.

# Example Use Cases

- **Dynamic Reporting**: Automate the generation of reports by fetching data from MySQL and sending it to Google Sheets. Each time the workflow runs, it can extract the latest data and update your reports in real-time.

- **Database Backup Notifications**: Set up a workflow that periodically runs a MySQL dump to back up your database and stores the output in cloud storage like AWS S3. Follow that with a notification via email or Slack, confirming the successful backup.

- **User Activity Tracking**: Track user actions from your web application in a MySQL database, then trigger a workflow that evaluates this data and sends personalized marketing emails through SendGrid when certain conditions are met.
