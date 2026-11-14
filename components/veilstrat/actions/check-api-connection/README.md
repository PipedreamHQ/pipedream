# Overview

Check API Connection uses the [VeilStrat API](https://app.veilstrat.com/docs/api) to check API connectivity with an unmetered health request. Use **Get Account Usage** to check API eligibility and budgets.

# Getting Started

Connect your own VeilStrat team API key from Settings > API. An eligible Pro account and API Access add-on are required. Visit [VeilStrat](https://www.veilstrat.com/) for service details and the [developer overview](https://www.veilstrat.com/developers) for setup.

# Troubleshooting

Check **Get Account Usage** for quota and reset times. A 401 indicates an invalid key; 403 indicates missing API eligibility; 429 indicates a budget or rate limit. Avoid automatic workflow retries for quota errors. No credentials or company records are written to logs by this component; Pipedream may retain step results and HTTP request logs under your workspace settings.
