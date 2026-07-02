# Overview

Super Carl is an AI networking and relationship-search platform for finding people, companies, jobs, posts, warm paths, and approved outbound communications through a user's professional network.

Use Super Carl on Pipedream to build workflows that qualify people and companies, check network readiness before search, find jobs with warm paths, discover post or engagement signals, and create drafts or sends through Super Carl communication channels.

# Getting Started

Super Carl uses API-key authentication. In Super Carl, open **Integrations**, go to the **API / MCP** section, and create or purchase an API key with the `search` scope for search actions and the `communications` scope for communication actions. Paste that key into the Pipedream connected account when prompted.

# Example Use Cases

- **Get Network Summary** checks LinkedIn sync readiness and available network filters.
- **Search People** finds people by role, company history, expertise, location, network relationship, or recent activity.
- **Search Companies** finds companies by name, domain, funding, size, industry, location, growth, or technology.
- **Search Jobs** finds jobs and can include warm-path people at each hiring company.
- **Search Posts** finds posts, comments, likes, reactions, company mentions, and other public activity signals.
- **Check Communication Capabilities** determines whether Gmail, LinkedIn, X, Instagram, or Super Carl channels are ready for a target.
- **Create Communication Draft** saves a durable message draft without live delivery.
- **Send Communication** creates a dry run by default and can send after explicit configuration.
- **Get Communication**, **Get Communication History**, and **Cancel Communication** monitor or stop communication workflows.

# Troubleshooting

If authentication fails, confirm that the API key has the required scope and has not been revoked. If a search returns weaker network-aware results than expected, run **Get Network Summary** to confirm the relevant LinkedIn, Gmail, or Super Carl network data is synced. Before live communication sends, run **Check Communication Capabilities** and review the chosen target, channel, and Dry Run setting.

For detailed API usage, see [Super Carl documentation](https://supercarl.ai/docs).
