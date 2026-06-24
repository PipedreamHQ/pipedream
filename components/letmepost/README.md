# Overview

letmepost is an open-source social-media publishing API. It lets you publish and schedule a single post to up to 25 connected accounts across Bluesky, X, LinkedIn, Instagram, Threads, Facebook, Pinterest, and TikTok through one call. Every request runs through preflight validation that surfaces platform constraints before the upstream call, returns a transparent error envelope, and supports idempotency keys for safe retries.

With the letmepost components on Pipedream you can build workflows that fan content out to many platforms at once, react to posts as they change state over instant webhooks, and read back the post log and uploaded media without juggling per-platform SDKs.

# Example Use Cases

- **Cross-post on a schedule.** Trigger on a new row in a content calendar (Google Sheets, Airtable, Notion) and use Publish a Post to fan it out to every connected account, either immediately or at a future time.
- **Notify your team when a post goes live.** Use the New Webhook Event source to listen for `post.published` and post a message to Slack or Discord with the platform URL.
- **Catch and retry failures.** Listen for `post.failed` or `post.rejected` events, read the per-target error with Get a Post, and open a ticket or alert an on-call channel.
- **Reuse existing media.** List Media to find an already-uploaded asset and pass its `mediaId` into Publish a Post instead of re-uploading.

# Getting Started

1. Sign in to your letmepost dashboard and open the API keys section.
2. Mint a key (`lmp_live_…` for production or `lmp_test_…` for testing) and copy it. The plaintext key is shown only once.
3. In Pipedream, add the letmepost app and paste the key when prompted.
4. Use List Accounts to confirm your connected accounts resolve, then drop Publish a Post into a workflow.

Connecting social accounts (the OAuth and Bluesky credential flows) is done in the letmepost dashboard, not through these components. The API key authenticates against accounts that are already connected to your organization.

# Troubleshooting

- **`unauthenticated` errors.** The API key is missing, malformed, or revoked. Mint a fresh key in the dashboard and reconnect the app.
- **`preflight_failed` or `validation_failed`.** A platform constraint rejected the payload (for example, body length or media size). The error envelope carries `rule` and `remediation` describing exactly what to fix.
- **A `partial_failed` batch.** Some targets published and others did not. Inspect `results[]` in the response; each failed target carries its own `error` with a `code` and `remediation`.
- **Webhook events not arriving.** Confirm the source is enabled and the endpoint registered. Deliveries are signed with HMAC-SHA256 over the raw body in the `X-Letmepost-Signature` header; the source verifies this automatically and responds 401 to anything that fails verification.
