# EventDock

[EventDock](https://eventdock.app) is a webhook reliability layer. It receives
your incoming webhooks at a stable ingest URL, **retries** failed deliveries with
exponential backoff (up to 7 attempts over several hours), **de-duplicates**
repeats, parks permanent failures in a **Dead Letter Queue**, and forwards
successful events to a destination you configure.

These Pipedream components let you put EventDock in front of your workflows so a
brief outage, deploy, or error never means a **lost** webhook.

> **Free tier: 5,000 events/month.** [Sign up at eventdock.app](https://eventdock.app).

## Components

| Component | Type | What it does |
|---|---|---|
| **New Reliable Webhook Event (Instant)** | source | Creates an EventDock endpoint pointing at this source's Pipedream URL, then emits one event per reliable delivery. Point your provider at the EventDock ingest URL. |
| **Reliable HTTP Forward** | action | Sends a payload to a destination URL *through* EventDock so the delivery is buffered, retried, and DLQ'd on permanent failure. |

## Authentication

Both components use an **EventDock API key** (starts with `evdk_`), created in
the EventDock dashboard under **Settings → API Keys**. Pipedream sends it as a
Bearer token. The default API base URL is `https://api.eventdock.app`; override
with the `EVENTDOCK_BASE_URL` environment variable only for self-hosted/staging.

## How the source works

```
Provider ──▶ EventDock ingest URL ──▶ (buffer · retry · de-dupe · DLQ) ──▶ Pipedream source URL ──▶ your workflow
```

On deploy the source calls `POST /v1/endpoints` with `upstream_url` set to its
own `$.interface.http` endpoint, and logs the **ingest URL** to configure in your
provider. On teardown it soft-deletes the endpoint (`DELETE /v1/endpoints/:id`).
The EventDock event id is used as the **dedupe key**, so a retried delivery of
the same event never double-fires your workflow.

## Local development & tests

```bash
# from this repo root (ed-pipedream/)
node --import ./tests/register-stubs.mjs --test tests/components.test.mjs
```

The tests import the real component modules and assert on the exact API request
shapes and the emit/dedupe logic, with `@pipedream/platform` resolved to an
offline stub (see `tests/`).

## Contributing this to Pipedream

These components follow the
[PipedreamHQ/pipedream](https://github.com/PipedreamHQ/pipedream) monorepo
format and live under `components/eventdock/`. To submit (a human step — opens a
PR under the contributor's GitHub identity):

```bash
# in a clone of PipedreamHQ/pipedream, with components/eventdock/ copied in:
pnpm install
npx eslint components/eventdock --fix
# then open a PR to PipedreamHQ/pipedream
```

Pipedream's CI runs lint and component checks on the PR.
