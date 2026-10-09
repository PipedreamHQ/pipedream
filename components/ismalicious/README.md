# Overview

isMalicious supplies threat intelligence for SOC and security automation workflows. These read-only actions enrich IP addresses, domains, URLs and file hashes through the hosted API and return its evidence without setting an automatic-block policy.

# Example Use Cases

Add source-attributed indicator evidence to an alert, ticket or investigation. Distinguish unknown lookups from an explicit server verdict. Compare risk, source agreement, freshness and contradictory signals before taking action.

# Getting Started

Create a key pair at https://ismalicious.com/app/account and connect both API key and API secret as secret authentication fields. Requests use `X-API-KEY: base64(apiKey:apiSecret)`. The app registration should name these fields `api_key` and `api_secret`; both must be secret. No key is embedded in these components.

API reference: https://ismalicious.com/api-docs . Free checks have account quotas; TAXII feeds require the appropriate subscription. Indicator values are sent to the hosted API. The app does not fetch the queried target.

# Troubleshooting

Check credentials for 401/403, quota and Retry-After for 429, and API availability for server errors. Unknown or absent evidence is not a safe verdict. The actions return `riskScore.score` separately from nullable `confidence`; top-level `sources`, `blocklistHits` and `blocklistListed` remain in their original shape.
