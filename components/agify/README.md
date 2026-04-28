# Overview

The Agify API estimates the age of a person from their first name. With Pipedream, you can use it to enrich contact records, segment users, and tailor experiences without asking customers for their age directly. The response (`name`, `age`, `count`) plugs cleanly into CRMs, marketing tools, and analytics pipelines.

# Example Use Cases

- **Age-Based Marketing Segmentation**: When a new lead lands in your CRM, look up their estimated age via Agify and route them into the appropriate Mailchimp or HubSpot audience — different messaging for younger vs. older cohorts, no manual tagging required.

- **Customer Cohort Analysis**: Append estimated ages to rows in a Google Sheet or BigQuery table on a schedule, then build dashboards that bucket purchases or signups by generation. Useful for spotting which products skew toward which age groups.

- **Age-Aware UI Personalization**: On signup, send the user's first name through a Pipedream workflow to Agify, store the estimated age on the profile, and let your app surface different default settings, tutorials, or recommendations based on the result.

# Getting Started

Sign up for an [Agify API key](https://agify.io) and paste it into Pipedream when connecting the account. The same key also works with [Genderize](https://pipedream.com/apps/genderize) and [Nationalize](https://pipedream.com/apps/nationalize). Free tier: 2,500 names/month.

# Troubleshooting

- **`401 Unauthorized`**: the API key is missing, mistyped, or has been revoked. Reconnect the account in Pipedream.
- **`age` is `null`**: the name wasn't found in Agify's dataset. This is expected for very rare names — handle it gracefully in downstream steps.
- **`429 Too Many Requests`**: you've hit the monthly request limit. Upgrade the Agify plan, or throttle the workflow.
- **Batch action returns fewer results than names submitted**: requests are capped at 10 names; if you need more, split into chunks.
