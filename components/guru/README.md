# Overview

The Guru API on Pipedream enables the automation of knowledge sharing and management tasks within your team or organization. Using this API, you can programmatically interact with Guru's knowledge base, including retrieving card details, creating new cards, and updating existing content. By leveraging Pipedream's serverless platform, you can craft workflows that trigger based on events from other services, process the data, and perform actions in Guru to keep your team's knowledge up to date and accessible.

# Example Use Cases

- **Sync Knowledge Base with Support Tickets**: When a new support ticket is solved in Zendesk, automatically create a Guru card summarizing the issue and resolution. This ensures that your support team's knowledge is continuously updated and available for future reference.

- **Content Approval Workflow**: Use Guru's API to flag content for review. When a new card is created in Guru, trigger a Pipedream workflow that sends a notification to a Slack channel for content approval. Once approved, update the card's status in Guru to reflect that it's ready for the team.

- **Weekly Knowledge Digest**: Set up a Pipedream workflow that runs weekly, collecting the most viewed or recently updated Guru cards. Compile this list into a digest and distribute it via email using SendGrid to keep the team informed of the latest knowledge entries and updates.
