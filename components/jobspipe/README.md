# Overview

[JobsPipe](https://jobspipe.dev) is a unified data API over public job and technographic sources — every job posting, one API. Authenticate with an API key from the [JobsPipe dashboard](https://jobspipe.dev) and call live endpoints such as job search (`POST /v1/jobs/search`) documented in the [OpenAPI spec](https://jobspipe.dev/openapi.json) and [docs](https://docs.jobspipe.dev/).

This component wraps the JobsPipe Search Jobs endpoint so you can filter normalized live postings by title, skills, location, company, remote status, salary, and more inside Pipedream workflows.

# Getting Started

1. Create a free account at [jobspipe.dev](https://jobspipe.dev).
2. Generate an API key from the dashboard (`jp_live_…`).
3. Connect the JobsPipe app in Pipedream and paste the key (sent as a Bearer token).

# Example Use Cases

1. **Daily recruiting digest** — Schedule a search for target titles and skills, then post matches to Slack or email.
2. **CRM enrichment** — When a new lead lands in HubSpot or Salesforce, search JobsPipe for open roles at that company and attach results.
3. **Competitor hiring alerts** — Poll for new postings at competitor company names and create Linear/Jira issues when hiring accelerates.

# Useful Links

- [JobsPipe](https://jobspipe.dev)
- [API docs](https://docs.jobspipe.dev/)
- [OpenAPI](https://jobspipe.dev/openapi.json)
- [MCP server](https://mcp.jobspipe.dev/mcp)
