# Overview

The [Linkly URL Shortener API](https://linklyhq.com) lets you create branded short links, track click analytics in real time, and trigger workflows on every click via webhooks.

By integrating Linkly with Pipedream, you can:

- Create, update, and delete short links from any workflow
- Trigger real-time workflows on every click via webhooks, with full click metadata (location, device, browser, referrer)
- Sync click data to a CRM, data warehouse, or spreadsheet
- Combine Linkly with thousands of other apps Pipedream supports

# Authentication

You'll need a Linkly API key and workspace ID. Generate an API key under **Settings → API Keys** in your [Linkly](https://linklyhq.com) dashboard, and grab your workspace ID from the URL or via the **List Workspaces** action.

# Example Use Cases

- **Automated Link Creation for Social Media Posts** — Use the **Create Link** action whenever new content is published in your CMS. Linkly returns a branded short URL you can post to Twitter, LinkedIn, or Buffer.

- **Real-Time Click Analytics Pipeline** — Use the **New Link Clicked (Instant)** source to receive a webhook event for every click — with location, device, browser, and referrer — and forward it to BigQuery, PostgreSQL, or any data destination.

- **Affiliate Link Tracking** — Auto-shorten affiliate URLs via **Create Link**, then use **New Link Clicked (Instant)** to attribute each click to a specific campaign in Mailchimp or your CRM.

- **Slack Click Alerts** — Subscribe to the workspace webhook and post a Slack message every time a high-value link is clicked. Real-time, no polling.

- **Bulk Link Management** — Use **List Links**, **Update Link**, and **Delete Link** to programmatically manage thousands of tracking links.

# Components

| Component | Type | Description |
|---|---|---|
| Create Link | Action | Create a new short link |
| Get Link | Action | Fetch a link by ID with full metadata |
| List Links | Action | List all links in the workspace |
| Update Link | Action | Update destination, slug, or name of an existing link |
| Delete Link | Action | Permanently delete a link |
| List Domains | Action | List custom domains in the workspace |
| List Workspaces | Action | List workspaces the API key has access to |
| New Link Clicked (Instant) | Source | Webhook-based — fires on every click with full metadata |
| New Link Created | Source | Polling — fires when a new link is added to the workspace |
