# Overview

Enrich one HTTP or HTTPS URL with the connected isMalicious account. Returns the API response, including optional `riskScore`, `evidence`, `sources`, and lookup status, without inventing a benign verdict when no evidence is available.

# Example Use Cases

Add source evidence and risk context to a SOC alert or analyst ticket before a human or separately configured policy decides what to do.

# Getting Started

Connect your API key and API secret from https://ismalicious.com/app/account. Enter the indicator as it appears in your alert. The value is sent to the hosted isMalicious API; it is not visited by this action. Standard enrichment consumes one request from your account quota. See https://ismalicious.com/api-docs for availability and quota limits.

# Troubleshooting

401/403 means the connected credentials were rejected. 429 means a quota or burst limit was reached; inspect Retry-After before retrying. Missing sources or `malicious: false` do not establish that an indicator is safe. Unknown file hashes remain unknown. HTTP errors and timeouts are propagated and must not be treated as clean results.
