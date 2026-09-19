# Overview

Algenta is a decision engine with governed execution: decisions are logged with their full context, executed under an enforceable execution policy, and recorded with execution receipts for audit. The Algenta API is available as Algenta Cloud or as a self-hosted engine on your own infrastructure.

The Algenta integration for Pipedream lets you execute logged decisions through the governed execution plane and fetch decision records for audit, directly from your workflows.

# Getting Started

You need an Algenta API key to connect your account:

1. Create an API key in your Algenta deployment (see [Authenticate a client](https://docs.algenta.ai) in the Algenta documentation).
2. In Pipedream, open the [Accounts](https://pipedream.com/accounts) section and connect the Algenta app with your API key.
3. If you run a self-hosted Algenta engine, also provide its base URL (for example, `https://engine.internal.example.com`). Leave it empty to use Algenta Cloud.

# Example Use Cases

- Execute a logged decision from a workflow and route the returned execution receipt to downstream steps based on its delivery status.
- Fetch a decision record by ID to attach its execution and audit fields to an incident ticket or a Slack message.
