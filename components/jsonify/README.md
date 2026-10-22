# Overview

Jsonify keeps datasets from the live web current. A pipeline runs on a schedule, repairs itself when a source changes, and publishes the result as a dataset. Every dataset has a serve URL that returns its latest rows as JSON, so a Pipedream workflow reads maintained data instead of scraping at run time.

# Example Use Cases

**Competitor price feed into a sheet**

- Trigger on new rows in a Jsonify dataset of competitor prices and append each row to a Google Sheet.

**Alert when a dataset republishes**

- Trigger on a new dataset version and post the dataset name, version and update time to Slack.

**Enrich records from a maintained table**

- In any workflow, fetch rows filtered by a column value and merge them into the payload.

# Getting Started

Open a dataset in Jsonify, go to Integrations, choose REST API, and copy the serve URL. The URL is the only credential; keep it secret.
