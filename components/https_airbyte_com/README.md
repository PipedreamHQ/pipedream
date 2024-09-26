# Overview

The Airbyte API allows for creating and managing data integration pipelines between various sources and destinations, automating data synchronization tasks, and monitoring the status of those pipelines. On Pipedream, you can leverage the Airbyte API to build intricate workflows that react to data events, manipulate and store data, and connect to other services to create rich, automated data pipelines.

# Example Use Cases

- **Sync New Database Entries to CRM**: Trigger a workflow whenever new entries are added to a Postgres database; use the Airbyte API to sync this new data to a CRM platform like Salesforce, keeping sales data updated in real-time.

- **Automated Reporting Pipeline**: Combine data from multiple sources, like Google Analytics and advertising platforms, via Airbyte at regular intervals. Then, process and send the aggregated data to Google Sheets for easy access and automated reporting.

- **Real-time Data Backup**: Set up a workflow that uses Airbyte to replicate data from primary databases to secondary storage solutions, such as Amazon S3, ensuring real-time or scheduled backups for disaster recovery purposes.
