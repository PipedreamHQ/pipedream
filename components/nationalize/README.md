# Overview

The Nationalize API predicts the likely nationality of a person from their first name and returns a ranked list of country probabilities. With Pipedream, you can use it to localize content, segment audiences by region, and route leads to the right team — all without asking customers for their location.

# Example Use Cases

- **Nationality Diversity Research**: Run names from a public dataset — conference speaker lists, paper authors, hiring rosters — through Nationalize to estimate national distribution at the cohort level. Useful for diversity audits, academic representation studies, and reporting on fields where self-reported data isn't available.

- **Customer Cohort Analytics**: Batch your customer or subscriber list through Nationalize and push aggregate country distributions to BigQuery, Snowflake, or your warehouse of choice. Build dashboards that show which products, channels, or campaigns skew which way at the population level.

- **CRM Aggregate Reporting**: When new records land in Salesforce or HubSpot, route a copy through Nationalize on a schedule and roll the results up into group-level summaries — country splits by segment, channel, or product line — for executive reports.

# Getting Started

Sign up for a [Nationalize API key](https://nationalize.io) and paste it into Pipedream when connecting the account. The same key also works with [Genderize](https://pipedream.com/apps/genderize) and [Agify](https://pipedream.com/apps/agify). Free tier: 2,500 names/month.

# Troubleshooting

- **`401 Unauthorized`**: the API key is missing, mistyped, or has been revoked. Reconnect the account in Pipedream.
- **`country` array is empty**: the name wasn't found in Nationalize's dataset. This is expected for very rare names — handle the empty case in downstream steps.
- **`429 Too Many Requests`**: you've hit the monthly request limit. Upgrade the Nationalize plan, or throttle the workflow.
- **Batch action returns fewer results than names submitted**: requests are capped at 10 names; if you need more, split into chunks.
