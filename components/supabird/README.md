# Overview

[SupaBird](https://supabird.io) is a social media growth agent. It finds viral content, writes in your voice and schedules posts across X, LinkedIn, Threads, Bluesky, Instagram and TikTok. With the SupaBird app in Pipedream you can schedule and cancel posts, read your drafts, saved ideas and published posts, generate post ideas and manage your posting slots from any workflow.

# Example Use Cases

- Schedule a post to X and LinkedIn whenever a new blog article is published (RSS or webhook source, then **Create Post**).
- Send every new published post, with its public URLs, to Slack or a Google Sheet (**New Published Post** source).
- Notify your team when a new idea lands in your Ideas Lab (**New Saved Idea** source).
- Generate a batch of post ideas every Monday and save them for review (**Generate Post Ideas** action on a schedule).

# Getting Started

1. In SupaBird, open **Profile → API & Apps** ([direct link](https://x.supabird.io/dashboard?tab=account&view=api)) and create an API key. A Pro or trial plan is needed.
2. In Pipedream, add a SupaBird step or source and click **Connect new account**.
3. Paste the key into the **API Key** field and save. Pipedream checks it against your SupaBird account.

The key is sent as `Authorization: Bearer <key>` to `https://api.supabird.io/v1`. See the [API documentation](https://api.supabird.io/v1/docs).

## Actions

- **Create Post**: schedule a post or thread (next free slot, a specific time, or now) to one or more networks.
- **Get Post**: get a post with its status and public URLs.
- **Unschedule Post**: cancel a scheduled post; it moves to Drafts.
- **Generate Post Ideas**: generate ideas in your own style or in the style of chosen X creators.
- **Add Posting Slot**: add a weekly posting slot.
- **List Social Sets**: list the social sets (brands) on your account.

## Sources

All sources poll SupaBird (every 15 minutes by default) because SupaBird has no webhooks.

- **New Scheduled Post**
- **New Published Post**
- **New Draft**
- **New Saved Idea**

# Troubleshooting

- **"SupaBird Pro or trial plan needed" (HTTP 402):** the API is only available on Pro and trial plans.
- **HTTP 429:** SupaBird allows 60 requests and 20 writes per minute per key. The app retries once after the `Retry-After` delay.
- **"social_set_required" (HTTP 409):** your account has several social sets. Choose one in the **Social Set** prop.
- **Instagram and TikTok posts** need media (**Media URLs**). TikTok also needs privacy settings that Create Post does not send yet.
- **Generate Post Ideas takes long:** it waits up to 2 minutes for the background job. Raise the workflow timeout to at least 150 seconds.
- **Writing style "My style" fails with "not enough posts":** the account needs published posts to learn from; use **Style of chosen creators** instead.
