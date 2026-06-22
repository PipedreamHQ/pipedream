# Overview

Social Fetch provides a read-only REST API for public social media and web data. Connect with an API key (`sfk_…`) and use consolidated workflow actions or a polling profile source.

## Example Use Cases

1. Monitor creator profiles for follower or bio changes
2. Enrich automation workflows with post, feed, or transcript data
3. Preflight credit balance before batch lookups

## Getting Started

### Generating an API Key

1. Sign in at [https://app.socialfetch.dev](https://app.socialfetch.dev)
2. Open [API Keys](https://app.socialfetch.dev/api-keys)
3. Create a key and copy the full `sfk_…` value (shown once)
4. In Pipedream, connect **Social Fetch** and paste the key when prompted

Connection test: `GET /v1/whoami` with header `x-api-key`.

## Troubleshooting

### Insufficient credits

Metered endpoints return HTTP 402 when your balance is exhausted. Use **Get Credit Balance** or visit the dashboard to top up.

### Handle vs profile URL

- TikTok, Instagram, Twitter/X, Threads: use **Handle** (username without `@`)
- Facebook, LinkedIn: use **Profile URL** (full browser URL)
