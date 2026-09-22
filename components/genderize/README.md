# Overview

The Genderize API lets you predict the gender of a name. With Pipedream, you can integrate this API to enrich and automate data flows that involve personal names. For instance, you can customize marketing messages, analyze demographics, or manage user data more inclusively. The API's simple structure (providing name, gender, probability, and count) makes it immensely useful for applications in CRM systems, marketing tools, and user interface personalizations.

# Example Use Cases

- **Gender Diversity Research**: Run names from a public dataset — conference speaker lists, paper authors, hiring rosters — through Genderize to estimate gender distribution at the cohort level. Useful for diversity audits, academic representation studies, and reporting on fields where self-reported data isn't available.

- **Customer Cohort Analytics**: Batch your customer or subscriber list through Genderize and push aggregate gender splits to BigQuery, Snowflake, or your warehouse of choice. Build dashboards that show which products, channels, or campaigns skew which way at the population level.

- **CRM Aggregate Reporting**: When new records land in Salesforce or HubSpot, route a copy through Genderize on a schedule and roll the results up into group-level summaries — gender splits by segment, channel, or product line — for executive reports.

# Getting Started

Sign up for a [Genderize API key](https://genderize.io) and paste it into Pipedream when connecting the account. The same key also works with [Agify](https://pipedream.com/apps/agify) and [Nationalize](https://pipedream.com/apps/nationalize). Free tier: 2,500 names/month.

# Troubleshooting

- **`401 Unauthorized`**: the API key is missing, mistyped, or has been revoked. Reconnect the account in Pipedream.
- **`gender` is `null`**: the name wasn't found in Genderize's dataset. This is expected for very rare names — handle it gracefully in downstream steps.
- **`429 Too Many Requests`**: you've hit the monthly request limit. Upgrade the Genderize plan, or throttle the workflow.
- **Batch action returns fewer results than names submitted**: requests are capped at 10 names; if you need more, split into chunks.
