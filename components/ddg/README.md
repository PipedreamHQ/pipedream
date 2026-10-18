# Overview

[DDG Agent Services](https://agents.daedalusdevelopmentgroup.com) is a catalog of pay-per-call APIs for AI agents: 376 HTTP routes priced in USDC on Base over the x402 protocol. No account, no API key, no KYC. Many routes grant one free call per agent per day, and a stable agent identity travels in the **Agent ID** value.

These actions talk to the DDG remote MCP server over Streamable HTTP. Nothing is installed locally, and no credentials are needed to start:

- **Search Services**: find agent-callable services matching a natural-language need. Free.
- **List Services**: list the live DDG service groups and a compact catalog summary. Free.
- **Call Service**: invoke a service by `service_id` or `/v1/` path. Free and free-tier routes return results directly; priced routes return the x402 payment challenge as data.

# Example Use Cases

- **Route work to paid agent APIs**: when a workflow step needs web search, a price feed, a site audit or similar, run **Search Services** and then **Call Service** with the returned `service_id`.
- **Inspect a paid route before settling**: use **Call Service** on a priced route to view the x402 challenge (price, network, recipient) before settling it with an x402 client.
- **Discover what is new in the catalog**: run **List Services** on a schedule and post new service groups to Slack.

# Getting Started

1. Add any DDG action to a workflow. No account connection is needed.
2. Optionally set **Agent ID** to a stable value (e.g. `my-research-agent`) so the DDG per-agent free tier and order scoping stay consistent across runs.
3. Test the step. The full catalog is documented at [the agent-readable docs](https://agents.daedalusdevelopmentgroup.com/llms.txt), and the OpenAPI spec is at [the OpenAPI specification](https://agents.daedalusdevelopmentgroup.com/openapi.json).

# Payment

Paid routes answer `402` with an x402 challenge (price, asset, network `eip155:8453`, recipient). **Call Service** returns that challenge as data; settle it with any x402 client and replay the route with the `PAYMENT-SIGNATURE` / `X-PAYMENT` header. Amounts are atomic USDC (6 decimals): `10000` is $0.01.

# Troubleshooting

- **402 instead of a result**: the route is priced and no free-tier call was left for this **Agent ID**. Inspect the challenge and settle it, or reuse the same **Agent ID** to keep the free tier.
- **Empty search results**: loosen the **Need** text; it is matched semantically, not by keyword.
- **Unknown service id**: run **Search Services** first; valid ids look like `chains_gas` and paths look like `/v1/web-search`.
