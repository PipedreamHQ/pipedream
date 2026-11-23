# Overview

Tinko is an omnichannel customer service platform. Companies use it to answer customers on WhatsApp, Instagram and website chat from one shared inbox, with attendants, departments and AI agents working side by side.

With the Tinko components on Pipedream you can send WhatsApp messages and templates, keep contacts, tags and notes in sync with your CRM or store, move and close chats, and react in real time when a customer writes, a chat starts or ends, or a channel loses its connection.

# Example Use Cases

- **Order updates on WhatsApp.** When an order ships in your store, use **Send Message** with an approved template to notify the customer from your official WhatsApp number.
- **Sync leads to your CRM.** Use **New Message Received** or **New Chat Created** to create or update the lead in your CRM, then use **Add Tag to Contact** to mark it in Tinko.
- **Escalate VIP customers.** When a message arrives from a contact with a VIP tag, use **Transfer Chat** to move the chat to your priority channel and attendant.
- **Monitor your channels.** Use **New Channel Status Change** to alert your team on Slack as soon as a WhatsApp number is disconnected.

# Getting Started

1. In Tinko, open `Configurações > API` and create an API token. API access depends on your Tinko plan.
2. In Pipedream, connect the Tinko app and paste the token.
3. Use **List Channels** to confirm the connection, then add **Send Message** or one of the instant sources to a workflow.

The instant sources create a webhook in your Tinko account when they are deployed and remove it when they are deleted. Every delivery is verified with an HMAC-SHA256 signature.

# Troubleshooting

- **401 Unauthorized.** The token is missing, invalid or was revoked. Create a new token in Tinko and reconnect the app.
- **403 with `upgrade_required`.** The current Tinko plan does not include API access.
- **409 `WINDOW_EXPIRED` when sending a message.** On official WhatsApp channels, only templates can be sent more than 24 hours after the last customer message. Use **Message Type** `template`.
- **429 Too Many Requests.** The API allows 60 reads and 30 writes per minute, and 20 messages per minute. Wait for the time given in `retry_after` and try again.
- **A source does not receive events.** Check that webhooks are enabled for your company in Tinko (`Configurações > Webhooks`) and that the webhook created by Pipedream is active.

See the [Tinko API documentation](https://docs.tinko.com.br) for details.
