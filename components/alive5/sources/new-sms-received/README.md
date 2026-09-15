# Overview

Emit an event when a text arrives on the selected Alive5 business number.

# Getting Started

Connect Alive5 and choose an SMS number. The source registers a dedicated webhook automatically and removes it on deactivation. No relay or extra credentials are required.

Events contain the message, sender phone, business phone, channel ID, thread ID, direction, received-at timestamp, and media URL when present. Timestamps use ISO 8601. Pipedream uses a stable event ID to deduplicate emissions.

# Troubleshooting

Alive5 sends webhooks once, without signing or retries. Image-only messages do not produce an event. Keep the source URL private. If deactivation fails, retry cleanup before discarding the source. A timed-out registration may require checking the Alive5 webhook list to reconcile it.
