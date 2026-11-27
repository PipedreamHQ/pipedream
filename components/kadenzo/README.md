# Kadenzo

[Kadenzo](https://kadenzo.app) is a social media scheduling tool. These components
let you schedule posts to your connected accounts — X, Instagram, LinkedIn, TikTok,
Facebook, Threads, Bluesky, YouTube, Pinterest and more — from your Pipedream workflows.

## Getting Started

1. Generate an API key in Kadenzo: **Settings → API Keys**
   (`https://studio.kadenzo.app/dashboard/settings?section=api`). The key is shown once — copy it.
   The API is available on paid plans.
2. In Pipedream, connect your Kadenzo account by pasting the API key.
3. Add the **Schedule a Post** action: choose the account(s), write your content, set a
   future time (ISO 8601, e.g. `2026-07-01T09:00:00Z`), and optionally add media URLs.
   The post publishes automatically at that time.

Full API reference: https://studio.kadenzo.app/developers

## Troubleshooting

- **401 `invalid_key`** — the key is wrong or was revoked; generate a new one.
- **403 `plan_required`** — the API is available on paid plans only.
- **422** (`scheduled_for_past`, `over_char_limit`, `unknown_accounts`, `media_error`) — fix the
  field as described in the returned error message.
- **429** — you hit the rate limit (60/min) or your plan's monthly post quota.
