# Overview

The New Relic API offers powerful capabilities for monitoring, alerting, and analyzing the performance of your web applications and infrastructure. By using the API within Pipedream, you can automate and orchestrate a vast array of operations that revolve around your application's health and data insights. This can range from triggering workflows based on New Relic alerts, to syncing performance data with other tools, or even automating responses to specific incidents.

# Available Actions

- **New Deployment**: Create a new deployment mark in New Relic. Useful for tracking releases and correlating them with application performance or incidents.
- **Query Logs**: Query logs from New Relic using NRQL (New Relic Query Language). This action allows you to fetch and analyze log data directly from New Relic, enabling advanced monitoring and troubleshooting workflows.

# Example Use Cases

- **Automated Incident Response**: When New Relic detects an anomaly or a performance issue, it can trigger a Pipedream workflow that automatically posts a message to a Slack channel, alerting the relevant team. The workflow could also create a ticket in Jira, ensuring that the incident is tracked and managed properly.

- **Performance Metrics to Data Warehouse**: Set up a Pipedream workflow that periodically fetches performance metrics from New Relic and inserts this data into a Google BigQuery data warehouse. This allows for advanced analysis alongside other business metrics, giving a more comprehensive view of how application performance impacts the overall business.

- **Dynamic Configuration Updates**: If New Relic reports that a service is experiencing high traffic, a Pipedream workflow can interact with other APIs, such as a feature flagging service like LaunchDarkly, to dynamically adjust application features or throttle user access to maintain service stability.

- **Log Analysis and Alerting**: Use the Query Logs action to search for error patterns or specific events in your New Relic logs. For example, you can run an NRQL query like `SELECT * FROM Log WHERE message LIKE '%error%' LIMIT 10` to find recent error logs and trigger downstream actions or notifications.

# Query Logs Action Usage

To use the Query Logs action, provide:
- **Account ID**: Your New Relic account ID.
- **NRQL Query**: The NRQL query to run against your logs (e.g., `SELECT * FROM Log WHERE message LIKE '%timeout%' LIMIT 5`).

The action will return the results of your query, which can be used in subsequent steps of your Pipedream workflow.

## NRQL Query Limitations & Best Practices

- **Query Time Limits**: NRQL queries have a maximum execution time (typically 60 seconds). Complex or unoptimized queries may time out. Break up large queries or use more specific filters to avoid timeouts.
- **Result Size Limits**: The maximum number of results returned per query is limited (e.g., 1,000 records per page). Use pagination (handled automatically by this action) to retrieve large result sets.
- **Data Retention**: Log data retention in New Relic depends on your account and plan. Queries outside the retention window will return no results.
- **Query Optimization Tips**:
  - Use `LIMIT` to restrict the number of results and improve performance.
  - Filter with `WHERE` clauses to narrow down the dataset (e.g., by log level, service, or time).
  - Use time windows (e.g., `SINCE 1 hour ago`) to avoid scanning unnecessary data.
  - Avoid `SELECT *` in production workflows; select only the fields you need.
  - Test your NRQL queries in the New Relic Query Builder before using them in automation.
- **API Rate Limits**: Excessive querying may be subject to New Relic API rate limits. Monitor your usage and optimize queries to avoid hitting these limits.
