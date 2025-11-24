# Overview

The Metabase API opens a gateway to interact with Metabase programmatically, enabling you to automate reporting, dashboards, and data analysis operations. With Pipedream, you can harness this API to trigger workflows, manipulate data, and integrate with various other apps to create a seamless data ecosystem. Think of syncing Metabase insights with other tools, automating report generation, or reacting to events within your Metabase instance in real-time.

# Available Actions

This Metabase integration provides the following actions:

- **Run Query** - Execute a saved question/card and return the results
- **Export Query with Format** - Execute a saved question/card with parameters and export results in CSV, JSON, XLSX, or API format
- **Get Dashboard** - Retrieve dashboard information and its cards
- **Create Dashboard** - Create a new dashboard in Metabase
- **Get Database** - Retrieve database information and metadata

# Example Use Cases

- **Automated Reporting**: Use Pipedream to set up scheduled triggers that fetch reports from Metabase and send them via email or Slack. This workflow can help teams stay updated with the latest insights without manual intervention.

- **Dashboard Sync**: Create a workflow that listens for updates in a specific Metabase dashboard and synchronizes those changes with a Google Sheets document. This allows for easy sharing and collaboration on data insights with stakeholders who prefer working in spreadsheets.

- **Alerting on Metrics**: Set up a Pipedream workflow that monitors specific metrics within Metabase. If certain thresholds are crossed, actions can be taken automatically, like sending alerts through SMS using Twilio or creating a task in project management tools like Trello.

- **Data Pipeline Automation**: Automatically create new cards and dashboards when new data sources are added, or when specific business events occur.

- **Cross-Platform Integration**: Sync Metabase insights with CRM systems, marketing tools, or business intelligence platforms to create a unified view of your data across all systems.
