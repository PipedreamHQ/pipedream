# Airweave Integration for Pipedream

Airweave is an open-source platform that makes **any app searchable for your agent** by syncing data from various sources with minimal configuration for agentic search.

## What is Airweave?

Airweave serves as a bridge between your data sources and agents, transforming raw data into queryable knowledge. It can extract and process data from:

- API endpoints (REST)
- Productivity and collaboration tools
- Relational databases
- Document stores
- File systems and storage services

## Available Actions

### Collections
- **Search Collection** - Search across all data sources within a collection (semantic + keyword search)
- **List Collections** - Get all collections in your organization
- **Create Collection** - Create a new collection to group data sources
- **Get Collection** - Retrieve details of a specific collection
- **Delete Collection** - Permanently remove a collection and all associated data

### Sources
- **List Sources** - Get all available data source connectors
- **Trigger Sync** - Manually trigger a data sync for a source connection

## Setup

1. Sign up for an Airweave account at [airweave.ai](https://airweave.ai)
2. Get your API key from the Airweave dashboard (Settings → API Keys)
3. Connect your Airweave account in Pipedream by entering your API key

## Example Workflows

### Slack Q&A Bot
Slash command → Search Airweave collection → Reply with relevant information

### Support Automation
Form submission → Search documentation → Create support ticket with context

### Daily Digest
Cron schedule → Search recent updates → Send email summary

### GitHub Integration
New issue → Search codebase → Auto-comment with relevant code references

## Authentication

This integration uses API key authentication. You can find your API key in your Airweave dashboard under Settings → API Keys.

Optionally, you can specify a custom base URL if you're using a self-hosted Airweave instance.

## Links

- [Airweave Documentation](https://docs.airweave.ai)
- [Airweave GitHub](https://github.com/airweave-ai/airweave)
- [API Reference](https://docs.airweave.ai/api-reference)
- [Airweave TypeScript SDK](https://github.com/airweave-ai/typescript-sdk)

## Support

For issues or questions:
- Airweave Community: [GitHub Discussions](https://github.com/airweave-ai/airweave/discussions)
- Pipedream Support: [pipedream.com/support](https://pipedream.com/support)

