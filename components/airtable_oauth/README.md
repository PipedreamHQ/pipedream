# Overview

The Airtable (OAuth) API allows you to interact with your Airtable data programmatically. Through Pipedream, you can leverage this API for a variety of automation tasks, such as syncing data between tables, triggering actions on row updates, or aggregating data for reporting. Pipedream provides a serverless platform where you can connect Airtable with other apps, set up event-driven workflows, and execute custom logic without managing infrastructure.

# Example Use Cases

- **Sync Airtable Records to Google Sheets**: Keep a Google Sheets spreadsheet updated with new Airtable record entries. When a new record is added to an Airtable base, the workflow triggers and appends the record to a specified Google Sheets document.
- **Automate Task Creation on Todoist for New Airtable Entries**: When a new entry is added to a specified Airtable view, a corresponding task is automatically created in Todoist. This is useful for managing task lists across platforms without manual entry.
- **Aggregate Airtable Data and Send Weekly Email Reports**: Compile a weekly report from Airtable records and send it via email. The workflow aggregates data from Airtable based on specified criteria and uses an email service like SendGrid to distribute the summary every week.
