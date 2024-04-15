# Overview

The PostgreSQL API on Pipedream allows you to seamlessly integrate your database operations into serverless workflows. Connect to your PostgreSQL database to execute queries, update tables, insert data, and react to database events. With a host of triggers and actions that you can tie to other services, Pipedream makes it simple to automate tasks, sync data across applications, or trigger processes based on database changes.

# Example Use Cases

- **Automated Data Backup**: Set up a recurring workflow to export data from PostgreSQL and store it in a cloud storage service like Google Drive or Dropbox. This ensures regular backups of your database without manual intervention.

- **Data Synchronization**: Keep your PostgreSQL database in sync with other data sources. For example, whenever a new row is added to a Google Sheets document, insert corresponding data into your PostgreSQL table, keeping both systems up-to-date.

- **Event-Driven Notifications**: Create a workflow that sends Slack notifications when specific changes occur in your database. For instance, get alerted when a new row is added to a critical table, or when certain values in a table exceed predefined thresholds.
