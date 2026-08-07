# Instant Reply

[Instant Reply](https://www.instantreply.co) is a shared AI inbox for WhatsApp Business, Instagram DMs, and Facebook Messenger. Teams use it to qualify leads, automate replies, manage broadcasts, sync conversations to their CRM, and run WhatsApp journey sequences.

## Actions

- **Send Message** — Send a free-form or template message to a contact via WhatsApp, Instagram, or Messenger
- **Create Contact** — Add a new contact to your Instant Reply inbox
- **Update Contact** — Update an existing contact's fields, tags, or custom data
- **Add Note to Conversation** — Attach an internal note to a conversation (not visible to the customer)
- **Get Conversation** — Retrieve a conversation by ID including status, assignee, and last message
- **List Conversations** — Return a paginated list of conversations, filtered by status or channel
- **Create Broadcast Campaign** — Create and send (or schedule) a WhatsApp broadcast campaign to a tagged audience segment
- **Update Lead Stage** — Move a pipeline lead to a different stage and update score, value, or notes
- **Trigger WhatsApp Journey** — Enroll a phone number into a WhatsApp automation sequence by trigger name or journey ID

## Triggers

- **New Inbound Message** — Fires when a new message arrives from any channel (WhatsApp / Instagram / Messenger)
- **New Qualified Lead** — Fires when a conversation is marked as a qualified lead in your pipeline
- **New Comment Received** — Fires when a new comment is posted on one of your Instagram or Facebook posts
- **Campaign Completed** — Fires when a broadcast campaign finishes sending

## Authentication

Instant Reply uses API key authentication. Generate your key at [instantreply.co/dashboard/settings/api](https://www.instantreply.co/dashboard/settings/api).

## Example workflows

- **Form → WhatsApp message**: Typeform submission → Create Contact → Send Message
- **New lead → CRM**: New Qualified Lead → Create Deal in HubSpot/Pipedrive
- **New message → Slack alert**: New Inbound Message → Post to Slack channel
- **WhatsApp → Google Sheets**: New Inbound Message → Add Row to Sheet
- **Comment → DM**: New Comment Received → Send Message (reply in DM)
- **Shopify order → WhatsApp journey**: New Shopify Order → Trigger WhatsApp Journey
- **Campaign done → Google Analytics**: Campaign Completed → Create GA4 event
- **Lead stage change → HubSpot deal**: Update Lead Stage → Update HubSpot Deal Stage
- **CRM contact → broadcast**: New HubSpot Contact → Create Broadcast Campaign
