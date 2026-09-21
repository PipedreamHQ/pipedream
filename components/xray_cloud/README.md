# Overview

[Xray Cloud](https://www.getxray.app/) is a test management tool for Jira Cloud. It enables teams to manage test cases, test plans, test executions, and test runs directly within Jira projects.

The Xray Cloud Pipedream integration lets you query test data via the Xray Cloud GraphQL API.

## Example Use Cases

1. **Retrieve test cases for a project** — Use the Get Tests action with a JQL filter to pull test cases matching specific criteria.
2. **Monitor test execution results** — Use the Get Test Executions action to fetch execution statuses and identify failing tests.
3. **Run custom queries** — Use the GraphQL Query action for advanced queries against the full Xray Cloud schema.

## Getting Started

To use the Xray Cloud integration, you need an API key:

1. Log in to your Jira Cloud instance with Xray Cloud installed
2. Navigate to **Xray** → **Global Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the **Client ID** and **Client Secret**
5. Use these credentials when connecting your Xray Cloud account in Pipedream

API keys do not expire. The bearer token generated from them expires after 24 hours and is refreshed automatically.

## Troubleshooting

### "Authentication failed" error
Verify your Client ID and Client Secret are correct. API keys are generated in Xray Global Settings (not Jira settings).

### No results returned
Xray Cloud uses Jira JQL for filtering. Ensure your JQL query is valid and matches existing issues. Test your query in Jira's search bar first.

### Rate limits
The Xray Cloud GraphQL API limits queries to 100 items per connection and 10,000 total items per call. Use the `limit` parameter to control page size.
