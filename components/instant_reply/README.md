# Instant Reply for Pipedream

[Instant Reply](https://www.instantreply.co) is a connected sales inbox for WhatsApp Business, Instagram DMs, and Messenger. The Pipedream component uses the Instant Reply public API.

## Actions

- **Send Message** — Send free-form text in an existing conversation, with the API's required idempotency key. Messaging windows and channel permissions still apply.
- **Get Conversation** — Read one conversation.
- **List Conversations** — List and filter conversations; the API returns a cursor for another page.
- **Update Contact** — Change a contact's name, email, lead stage, or lead temperature.
- **Create Broadcast Campaign** — Create a campaign for a tagged opted-in audience, with an optional immediate send.
- **Update Lead Stage** — Change a pipeline lead's stage, score, value, or notes.
- **Trigger WhatsApp Journey** — Enroll an opted-in phone number by journey ID or configured trigger name.

## Authentication and access

Create a scoped API key at [Instant Reply API keys](https://www.instantreply.co/dashboard/settings/api-keys). Grant only the scopes required for the actions you use. The component sends the key as a Bearer token to `https://api.instantreply.co/v1`.

The public API currently has no contact-create, conversation-note, or general `/v1/events` endpoint. Those actions and polling sources are intentionally absent until matching API support exists. See the [API reference](https://www.instantreply.co/api-reference) for current operations.

Pipedream must register the Instant Reply app authentication integration before it can review and publish these components.
