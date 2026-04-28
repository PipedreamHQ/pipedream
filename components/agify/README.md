# Overview

The Agify API estimates the age of a person from their first name. With Pipedream, you can use it to enrich contact records, segment users, and tailor experiences without asking customers for their age directly. The response (`name`, `age`, `count`) plugs cleanly into CRMs, marketing tools, and analytics pipelines.

# Example Use Cases

- **Age Diversity Research**: Run names from a public dataset — conference speaker lists, paper authors, hiring rosters — through Agify to estimate age distribution at the cohort level. Useful for diversity audits, academic representation studies, and reporting on fields where self-reported data isn't available.

- **Customer Cohort Analytics**: Batch your customer or subscriber list through Agify and push aggregate age distributions to BigQuery, Snowflake, or your warehouse of choice. Build dashboards that show which products, channels, or campaigns skew which way at the population level.

- **CRM Aggregate Reporting**: When new records land in Salesforce or HubSpot, route a copy through Agify on a schedule and roll the results up into group-level summaries — age bands by segment, channel, or product line — for executive reports.

# Getting Started

Sign up for an [Agify API key](https://agify.io) and paste it into Pipedream when connecting the account. The same key also works with [Genderize](https://pipedream.com/apps/genderize) and [Nationalize](https://pipedream.com/apps/nationalize). Free tier: 2,500 names/month.

# Troubleshooting

- **`401 Unauthorized`**: the API key is missing, mistyped, or has been revoked. Reconnect the account in Pipedream.
- **`age` is `null`**: the name wasn't found in Agify's dataset. This is expected for very rare names — handle it gracefully in downstream steps.
- **`429 Too Many Requests`**: you've hit the monthly request limit. Upgrade the Agify plan, or throttle the workflow.
- **Batch action returns fewer results than names submitted**: requests are capped at 10 names; if you need more, split into chunks.
