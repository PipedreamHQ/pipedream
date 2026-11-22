# Overview

[anymail](https://anymail.watch) is a cold email platform that groups prospects by company. This app connects a Pipedream workflow to an anymail workspace through the [REST API](https://developers.anymail.watch/) and [webhook subscriptions](https://developers.anymail.watch/webhook-subscriptions/).

# Example Use Cases

- Post to Slack or open a CRM deal when a prospect is interested.
- Add a prospect to a campaign when a form is submitted or a CRM lead changes stage.
- Suppress an address everywhere when a customer is created in your billing tool.

# Getting Started

In anymail open **Settings**, **Integrations**, **API keys** and create a key with the `read` and `write` scopes. It starts with `sgn_`. Paste it when Pipedream asks you to connect the account. One key belongs to one workspace.

Sources are instant. When a workflow is deployed, Pipedream subscribes its URL to the event, and removes the subscription when the workflow is turned off.
