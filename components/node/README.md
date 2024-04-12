# Overview

The Node API in Pipedream allows you to run Node.js code within workflows. With this capability, you can execute custom logic, interact with databases or external APIs, transform data, and manage state between workflow invocations. This gives you the flexibility to implement complex operations that go beyond pre-built actions, creating tailored automation for your needs.

# Example Use Cases

- **Custom Data Processing:** Ingest data from a webhook, process it with a Node.js code step where you can perform validations, calculations, or formatting, and then send the processed data to Google Sheets for easy sharing and analysis.

- **Dynamic API Integration:** Retrieve data from an API using an HTTP request, manipulate the data in Node.js (like filtering or aggregating it), and then use Pipedream’s built-in tools to connect and send this data to Slack, alerting your team about the latest metrics.

- **Scheduled Database Cleanup:** Set up a cron job in Pipedream to trigger a Node.js function that connects to a MongoDB instance, identifies old or irrelevant records, and purges them, keeping your database lean and efficient.
