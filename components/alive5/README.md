# Overview

Send and receive business SMS with Alive5. The connector provides Send SMS, New SMS Received, and List Channels and Users.

# Getting Started

Connect your Alive5 account with an API key from the Alive5 dashboard settings. The key is sent only to the Alive5 API using the `X-A5-APIKEY` header. See the [Alive5 API documentation](https://www.alive5.com/api).

For Send SMS, choose your business SMS number and a user assigned to that channel. Enter the recipient with a country code, such as `+14155550123`, and the message text.

For New SMS Received, select the business number. Activating the source registers its Pipedream URL with Alive5. Deactivating it removes only that source's webhook registration. Other integrations remain registered.

# Troubleshooting

An empty number list means the key has no visible SMS channels. A missing sending user means that user is not assigned to the chosen channel. Refresh the choices after changing channel assignments.

Alive5 webhooks make one delivery attempt, have no signatures, and omit image-only messages. Keep the source URL private. Pipedream deduplicates emitted events, but it cannot recover a webhook that Alive5 never delivered. These limitations come from Alive5's interceptor API.

A successful send result means Alive5 accepted the SMS, not that the carrier delivered it. After a timeout, check Alive5 conversation history before retrying to avoid a duplicate message.
