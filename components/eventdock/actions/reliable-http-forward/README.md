# Reliable HTTP Forward

## Overview

Sends a payload to a destination URL **through [EventDock](https://eventdock.app)**
so the delivery is buffered, **retried** with exponential backoff, and parked in a
**Dead Letter Queue** if the destination stays down. Use it anywhere you'd
normally do an HTTP POST but can't afford to silently lose the request.

On the first run for a given destination URL it creates a reusable EventDock
endpoint; subsequent runs reuse it.

## Example use cases

- Forward processed data to a **flaky internal API** with automatic retries.
- Fan results out to a partner webhook that occasionally returns 5xx.
- Replace a bare `$.send.http(...)` with a delivery you can **replay** from the
  EventDock dashboard if it permanently fails.

## Getting started

1. Add this action to a workflow step and connect your **EventDock** account
   ([free tier](https://eventdock.app) = 5,000 events/month).
2. Set the **Destination URL** (where the payload should ultimately land) and the
   **Payload** (the JSON body to deliver).
3. Run it. The action ensures an EventDock endpoint exists for that destination,
   POSTs the payload to EventDock's ingest URL, and returns the **endpoint id**
   and **event id**. EventDock then handles reliable delivery to your
   destination.

## Troubleshooting

- **Endpoint limit reached**: the free tier allows 3 endpoints; this action
  creates one per distinct destination URL. Reuse destinations or upgrade.
- **Delivery not arriving at the destination?** Check the event in the EventDock
  dashboard — if it failed all retries it's in the DLQ and can be replayed.
- **Invalid upstream URL**: the destination must be a valid absolute URL.
