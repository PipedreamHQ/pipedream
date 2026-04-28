# Overview

The Nationalize API predicts the likely nationality of a person from their first name and returns a ranked list of country probabilities. With Pipedream, you can use it to localize content, segment audiences by region, and route leads to the right team — all without asking customers for their location.

# Example Use Cases

- **Localize Marketing Copy**: When a subscriber joins your list, send their first name through Nationalize and pick the top-ranked country to choose a language and currency for the welcome email. Wire it into SendGrid or Customer.io with a single Pipedream workflow.

- **Regional Segmentation in CRMs**: Append a probable country code to every new lead in HubSpot or Salesforce so reports, dashboards, and audiences can slice by region without depending on self-reported data.

- **Sales Territory Mapping**: When a deal is created, look up the contact's likely nationality and assign the deal to the right regional rep automatically. Combine with your CRM's round-robin logic for territory routing that doesn't depend on form fields.

# Getting Started

Sign up for a [Nationalize API key](https://nationalize.io) and paste it into Pipedream when connecting the account. The same key also works with [Genderize](https://pipedream.com/apps/genderize) and [Agify](https://pipedream.com/apps/agify). Free tier: 2,500 names/month.

# Troubleshooting

- **`401 Unauthorized`**: the API key is missing, mistyped, or has been revoked. Reconnect the account in Pipedream.
- **`country` array is empty**: the name wasn't found in Nationalize's dataset. This is expected for very rare names — handle the empty case in downstream steps.
- **`429 Too Many Requests`**: you've hit the monthly request limit. Upgrade the Nationalize plan, or throttle the workflow.
- **Batch action returns fewer results than names submitted**: requests are capped at 10 names; if you need more, split into chunks.
