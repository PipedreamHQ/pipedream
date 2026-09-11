# New Reliable Webhook Event (Instant)

## Overview

Emits a Pipedream event for **each reliable webhook delivery** from
[EventDock](https://eventdock.app). Instead of pointing a provider's webhook
directly at a Pipedream HTTP trigger (where a brief outage or error loses the
event), you point it at EventDock. EventDock buffers, retries with exponential
backoff, de-duplicates, and parks permanent failures in a Dead Letter Queue —
then delivers a clean event into this source.

## Example use cases

- **Stripe → Pipedream** without losing payment events during a deploy or error.
- **Shopify order webhooks** that must never be dropped, with automatic retries.
- **GitHub webhooks** with edge signature verification and de-duplication.
- Any **generic** webhook source you want to make durable.

## Getting started

1. Add this source to a workflow and connect your **EventDock** account
   (API key from the EventDock dashboard → Settings → API Keys;
   [free tier](https://eventdock.app) = 5,000 events/month).
2. Pick a **Provider** (`generic`, or `stripe`/`shopify`/`github`/`twilio` to
   unlock signature verification + provider-aware de-dup). Optionally add the
   **Signing Secret** for a known provider.
3. Deploy the source. It creates an EventDock endpoint and **logs the ingest
   URL** (e.g. `https://api.eventdock.app/in/<endpointId>`).
4. Configure that **ingest URL** in your provider's webhook settings.
5. Each reliable delivery now triggers your workflow. The original payload is in
   `event.body`; EventDock metadata (event id, attempt, `isRetry`) is in
   `event.eventdock`.

## Troubleshooting

- **No events arriving?** Confirm your provider is pointed at the EventDock
  **ingest URL** (logged on deploy), not at the old Pipedream URL.
- **Endpoint limit reached** on create: the EventDock free tier allows 3
  endpoints. Remove unused endpoints or upgrade.
- **Signature rejected**: for a known provider, ensure the **Signing Secret**
  matches the one your provider is signing with, or switch to `generic`.
