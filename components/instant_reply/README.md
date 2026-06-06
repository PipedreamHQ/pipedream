# Instant Reply

[Instant Reply](https://www.instantreply.co) is a shared AI inbox for WhatsApp Business, Instagram DMs, and Facebook Messenger. Teams use it to qualify leads, automate replies, manage broadcasts, and sync conversations to their CRM.

## Actions

- **Send Message** — Send a free-form or template message to a contact via WhatsApp, Instagram, or Messenger
- **Create Contact** — Add a new contact to your Instant Reply inbox
- **Update Contact** — Update an existing contact's fields, tags, or custom data
- **Add Note to Conversation** — Attach an internal note to a conversation (not visible to the customer)

## Triggers

- **New Inbound Message** — Fires when a new message arrives from any channel (WhatsApp / Instagram / Messenger)
- **New Qualified Lead** — Fires when a conversation is marked as a qualified lead in your pipeline

## Authentication

Instant Reply uses API key authentication. Generate your key at [instantreply.co/dashboard/settings/api](https://www.instantreply.co/dashboard/settings/api).

## Example workflows

- **Form → WhatsApp message**: Typeform submission → Create Contact → Send Message
- **New lead → CRM**: New Qualified Lead → Create Deal in HubSpot/Pipedrive
- **New message → Slack alert**: New Inbound Message → Post to Slack channel
- **WhatsApp → Google Sheets**: New Inbound Message → Add Row to Sheet
