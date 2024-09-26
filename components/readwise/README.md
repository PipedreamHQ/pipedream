# Overview

The Readwise API allows you to access and manipulate your Readwise data, which includes highlights, notes, and books from your reading list. With this API, you can automate the retrieval of your reading highlights, synchronize them across various platforms, or trigger custom actions based on new highlights added. Pipedream, as a serverless integration and compute platform, enables you to create workflows that leverage the Readwise API to build powerful automations, connecting your reading insights to countless other apps and services to enrich productivity and data management.

# Example Use Cases

- **Sync Highlights to Notion Database**: Automatically add new Readwise highlights to a Notion database. Upon detecting a new highlight via the Readwise API, Pipedream can trigger a workflow that creates or updates a corresponding page in Notion, allowing for seamless management and review of reading notes.

- **Create Weekly Reading Digest Email**: Compile a weekly digest of your Readwise highlights and send it via email. Pipedream schedules a weekly workflow that fetches the latest highlights and uses an email service, such as SendGrid, to craft and send a personalized reading digest.

- **Trigger Slack Notifications for New Highlights**: Receive immediate notifications in Slack whenever a new highlight is added to your Readwise account. Pipedream listens for new Readwise highlights and sends a formatted message to a specified Slack channel, keeping you and your team informed about new insights.
