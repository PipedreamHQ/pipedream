# Overview

Emit an event when a text arrives on the selected Alive5 business number.

# Getting Started

Connect Alive5 and choose an SMS number. Activating the source creates a subscription on the Alive5 relay, which forwards inbound Alive5 messages to the source's Pipedream URL. Deactivating removes the subscription. Your API key travels to the relay only while creating that subscription.

Events contain the message, sender phone, business phone, channel ID, thread ID, direction, received-at timestamp, and media URL when present. Timestamps use ISO 8601. Every delivery from the relay carries a per-subscription token plus an event ID; the source checks the token before accepting, and Pipedream deduplicates on the event ID, so relay retries collapse into one emission. Events are limited to the fields listed here.

# Troubleshooting

Upstream Alive5 events carry no signature, so neither the relay nor the source can prove a message really came from Alive5. Forwarding makes up to three attempts. Delivery is best effort, and duplicates or missed messages remain possible; there is no durable queue or exactly-once guarantee. Image-only messages do not produce an event. If deactivation fails, retry cleanup before discarding the source; the subscription stays registered until the relay confirms the delete.
