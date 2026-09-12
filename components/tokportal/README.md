# Overview

TokPortal is the managed social infrastructure API: real TikTok, Instagram and YouTube accounts created, warmed and operated by human account managers in 16+ countries — exposed as a REST API and an MCP server. On Pipedream you can create bundles (missions) that provision new managed accounts, schedule videos, carousels and stories on them, follow delivered accounts and bans, read credits and analytics, and react instantly to signed TokPortal webhooks — no OAuth per account and no app review.

# Example Use Cases

- **Launch accounts from a spreadsheet**: When a new row lands in Google Sheets or Airtable, call **Create Bundle** with the platform, country and number of video slots, then **Publish Bundle**. Store the returned bundle ID back in the row using `external_ref` as the correlation key.

- **Post content from your CMS or drive**: When a video is added to Google Drive, Dropbox or Notion, use **Configure Video** on the next free slot of the bundle (public `.mp4` URL, caption, publish date) and **Publish All Bundle Videos** so the account manager posts it.

- **Notify the team on delivery and bans**: Use the **New Account Delivered** and **New Account Banned** triggers to post to Slack or Discord, update your CRM, or open a support ticket, and **New Video Posted** to log the live `platform_url` of each post.

# Getting Started

1. Sign in to [app.tokportal.com](https://app.tokportal.com), open **Developer → API keys** and create a key (it starts with `sk_` and is shown once).
2. Connect your TokPortal account in Pipedream and paste the API key.

All requests are sent to `https://app.tokportal.com/api/ext` with the `X-API-Key` header. Documentation: [developers.tokportal.com](https://developers.tokportal.com).
