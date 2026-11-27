# Muziek maken met AI

[Muziek maken met AI](https://muziekmakenmetai.nl) generates full songs from a text prompt — in Dutch or any other language — with optional custom mode for full lyrics, style control and personas. API keys and API documentation are available in the [developer portal](https://muziekmakenmetai.nl/developers/).

This Pipedream component package includes:

| Action | Purpose |
| --- | --- |
| `generate-song` | Start a song generation (costs 1 credit) and optionally wait for the audio files. |
| `get-song` | Fetch one generation, its status and its audio files. |
| `get-account` | Fetch the credit balance and rate limits of the account. |

| Source | Purpose |
| --- | --- |
| `new-song-ready` | Emit an event when a song generation succeeds, via a signed webhook. |

## Links

| Resource | URL |
| --- | --- |
| Muziek maken met AI | https://muziekmakenmetai.nl |
| Developer portal | https://muziekmakenmetai.nl/developers/ |

Use these actions when a workflow needs to generate audio — for example turning blog posts into jingles, producing radio spots from a form submission, or batch-generating personalized songs.

## Webhook note

The **New Song Ready** source registers a webhook URL on your API key. The API supports a single webhook per key, so activating this source replaces any webhook registered earlier with the same key, and deactivating the source unregisters it.
