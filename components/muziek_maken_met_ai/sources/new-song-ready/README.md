# New Song Ready

## Overview

Emits an event when a song generation succeeds, including the audio file URLs. Failed generations do not emit an event; use **Get Song** to inspect a specific generation.

The source registers your Pipedream endpoint as webhook on the MuziekMakenMetAI API and verifies the `x-mmai-signature` header of every incoming event with the signing secret returned at registration.

**Note:** the API supports a single webhook URL per API key. Activating this source replaces any webhook registered earlier with the same key (for example in another automation tool), and deactivating the source unregisters the webhook again.

# Example Use Cases

1. Post a message with the audio file to Slack or Discord the moment a song is ready.
2. Attach finished songs to a Google Drive folder and notify the requester by email.

# Getting Started

1. Connect the Muziek maken met AI app with an API key from the [developer portal](https://muziekmakenmetai.nl/developers/).
2. Deploy this source. On activation it registers the Pipedream endpoint as the webhook of your API key.
3. Start a generation with the **Generate Song** action (or any other client using the same API key) — the source emits an event when it succeeds.

# Troubleshooting

## No events arrive

- The webhook belongs to the API key, not to a workflow: events only arrive for generations started with the same API key.
- Activating another automation with the same key replaces the webhook. Re-deploy this source to register it again.
- Check the account with **Get Account**: `webhook_configured` shows whether a webhook is set.

## 401 responses in the endpoint log

The source rejects events with an invalid signature. This happens when the signing secret changed — for example after re-registering the webhook elsewhere. Re-activate the source so it stores the current signing secret.
