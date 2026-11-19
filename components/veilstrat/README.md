# Overview

[VeilStrat](https://www.veilstrat.com/) provides company funding, AI hiring and technology-adoption signals for company research and sales workflows. These six actions search one page of companies, retrieve a company dossier, search filtered signal slices, inspect the filter catalog, inspect API usage and check API health.

Company Search Page preserves the original response envelope and pagination metadata. It makes one request per run, with 1–50 records and an offset below 500. It does not automatically retrieve additional pages. This deliberate bound helps users control metered record and page-turn budgets. Hiring signals indicate hiring demand rather than confirmed production deployment; scores prioritize research and do not predict purchases.

# Getting Started

Create an account at [VeilStrat](https://www.veilstrat.com/) and generate a team API key in Settings > API. API access requires Pro and the API Access add-on. Connect that key using the VeilStrat account connection. The API uses bearer authentication at the fixed HTTPS origin `app.veilstrat.com`.

Start with Get Account Usage and Get Filter Catalog, then try Search Companies Page with `signal:hiring:30d`, one country code and a page size of 10. Feed a returned company UUID into Get Company Dossier. Search Signal Slices requires a current slice identifier and at least one country or minimum score.

[API overview](https://www.veilstrat.com/developers) · [Quickstart](https://app.veilstrat.com/docs/api) · [Endpoint reference](https://app.veilstrat.com/docs/api/endpoints) · [Rate limits](https://app.veilstrat.com/docs/api/rate-limits)

# Troubleshooting

401: verify the team API key. 403: verify your API-access plan. 422: inspect the filter catalog and query syntax. 429: stop and inspect account usage and reset times before retrying. HTTP errors retain their status code with credential-safe explanations; raw error bodies and request configurations are not exported. The components add no retry or pagination loop. Health and usage requests are exempt from VeilStrat's request budget.

Your key, search filters and identifiers are sent to VeilStrat. Results are returned as workflow step data, where Pipedream workspace retention applies. Do not place credentials in ordinary props or workflow logs. Contact [VeilStrat support](mailto:support@veilstrat.com) for API questions.
