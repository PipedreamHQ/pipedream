# Overview

SignalRaven watches public LinkedIn activity around the clock and qualifies the people who engage against your ideal customer profile. Each qualified signal is a named person with their title and company, a strength score out of 10, why it matters, and talking points. The API also exposes your monitored sources, your ICP, person and account research reports, and workspace activity counts.

Create an API key at app.signalraven.ai (Settings, then API keys) to get a client id and secret. Docs: https://signalraven.ai/developers

# Example Use Cases

- **Route new signals to your CRM.** Trigger on New Signal, then create or update the person in HubSpot, Pipedrive or Attio with the opener and talking points attached.
- **Alert the owning rep.** Trigger on New Signal with a minimum strength, then post to Slack or send an email with the suggested opener.
- **Research before a call.** Run Account Intelligence on a company URL, then send the buying committee and openers to a Google Doc or Notion page.

# Getting Started

1. In SignalRaven, open Settings, then API keys, and create a key. Copy the client id and client secret.
2. Connect SignalRaven in Pipedream with those two values.
3. Add the New Signal trigger, or any action, to a workflow.

# Troubleshooting

- **Sample data instead of your workspace.** The key belongs to an account without an active workspace. Trial and paid workspaces return live data.
- **invalid_scope.** The key was created with a subset of scopes. The component retries with only the scope the call needs; if that fails, create a key with the read scopes plus `write:intelligence` for the Run actions.
