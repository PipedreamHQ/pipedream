# Overview

Send and receive business SMS with Alive5. The connector provides Send SMS, New SMS Received, and List Channels and Users.

# Getting Started

Connect your Alive5 account with an API key from the Alive5 dashboard settings. The key is sent using the `X-A5-APIKEY` header to the Alive5 API, and transiently to the Alive5 relay at `https://alive5-connectors-relay.raghav-ojha-14122.workers.dev` for subscription management. See the [Alive5 API documentation](https://www.alive5.com/api).

For Send SMS, choose your business SMS number and a user assigned to that channel. Enter the recipient with a country code, such as `+14155550123`, and the message text.

For New SMS Received, select the business number. Activating the source creates a subscription on the Alive5 relay, which forwards inbound messages to the source's Pipedream URL. Each delivery carries a per-subscription token, and the source verifies it before emitting. Deactivating the source removes only that subscription. Other integrations remain registered.

# Troubleshooting

An empty number list means the key has no visible SMS channels. A missing sending user means that user is not assigned to the chosen channel. Refresh the choices after changing channel assignments.

Alive5 does not sign deliveries, so the relay cannot prove that an incoming event came from Alive5. The relay makes up to three forwarding attempts; retries keep the same event ID for Pipedream deduplication. Delivery is best effort, with no durable queue or exactly-once guarantee. Deactivating and reactivating the source creates a new upstream capability and delivery token. To change Pipedream's receiving URL, recreate the source.

A successful send result means Alive5 accepted the SMS, not that the carrier delivered it. After a timeout, check Alive5 conversation history before retrying to avoid a duplicate message.
