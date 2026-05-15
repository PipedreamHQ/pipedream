# Overview

New Render Webhook emits an event when a service sends a render callback payload to the generated webhook URL.

# Example Use Cases

- Trigger downstream steps after a render callback.
- Receive generic render notifications in one Pipedream source.
- Forward generated file URLs to storage, chat, or CMS tools.

# Getting Started

Create the source, copy the generated endpoint URL, and configure your service or workflow to send render callback payloads to it.

# Troubleshooting

Make sure the sender uses the generated webhook URL and sends a JSON payload. Include a stable `id` field when possible to make events easier to trace.
