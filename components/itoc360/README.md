# Overview

The ITOC360 API lets you push alerts into [ITOC360](https://www.itoc360.com), an
on-call alert management and incident response platform. With Pipedream, you can
route events from any of the 2,000+ integrated apps into ITOC360, where they are
turned into alerts and fed through your on-call schedules, escalation policies,
and incident workflows.

# Example Use Cases

1. **Forward errors into on-call** — When a new error is captured in your error
   tracker, send a `trigger` alert to ITOC360 so the right person is paged.
2. **Open and auto-resolve alerts** — Open an alert when a check fails and send a
   `resolve` event with the same Deduplication ID when it recovers.
3. **Centralize cross-tool signals** — Funnel signals from monitoring, CI/CD, and
   ticketing tools into a single ITOC360 incident pipeline.

# Getting Started

## Generating a Source Token

To authenticate requests, you need an ITOC360 source token:

1. Sign in to [ITOC360](https://www.itoc360.com).
2. Go to **Sources → Create Source** and choose a source type (for example,
   "Zapier").
3. Copy the generated token. You will paste it into the **Source Token** field on
   the action.

Each token is scoped to a single source, so you can create separate tokens for
separate Pipedream workflows.

# Troubleshooting

## "Source not found" / 404 response

This usually means the source token is invalid or has been deleted. Double-check
that you copied the full token from **Sources** in ITOC360 and that the source
still exists.

## Alerts not de-duplicating

Make sure you send the same **Deduplication ID** for the `trigger` and `resolve`
events that belong to the same alert. If no Deduplication ID is provided, the
title is used instead.