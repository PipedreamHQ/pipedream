# Pipedream Source Component Guidelines

This document covers guidelines specific to source components (`type: "source"`). Read
`pipedream-component-guidelines.md` first for the foundational component model.

---

## Source Model Overview

Sources are long-lived components that emit events to trigger downstream workflows. Unlike
actions (which run on demand), sources are deployed once and continuously monitor for new
data.

There are three delivery patterns:

- **Polling** — A timer fires at an interval; the source fetches new data and emits items
- **Webhook** — The service pushes events to an HTTP endpoint; the source receives and emits
- **Hybrid** — Uses webhooks when admin permissions are available, falls back to polling

Sources emit events using `this.$emit()`. Events appear in connected workflows as trigger
data.

---

## The `$emit()` Contract

Every event emission must provide all three metadata fields:

```javascript
this.$emit(data, {
  id: "stable-unique-event-id",
  summary: "Human-readable description of this event",
  ts: 1704067200000,   // Unix timestamp in milliseconds
});
```

| Field | Purpose | Requirements |
|---|---|---|
| `id` | Deduplication key | Must be **stable** (same value for the same real-world event across multiple runs) and **unique** per distinct event |
| `summary` | Shown in the Pipedream UI | One line, describes what happened |
| `ts` | Event timestamp | Use the API-provided event timestamp when available; fall back to `Date.now()` only when the API provides no timestamp |

### Common `id` mistakes

**Wrong — causes duplicates on every poll:**
```javascript
this.$emit(item, { id: Date.now(), summary: "...", ts: Date.now() });
this.$emit(item, { id: Math.random(), summary: "...", ts: Date.now() });
```

**Wrong — not unique when the same record is updated:**
```javascript
this.$emit(item, { id: item.recordId, summary: "...", ts: Date.now() });
// Same record updated twice → same id → second update silently dropped
```

**Correct — stable and unique per real-world event:**
```javascript
// Native event ID from the service
this.$emit(item, { id: item.eventId, summary: "...", ts: Date.parse(item.occurredAt) });

// Composite: record ID + timestamp (for update events)
this.$emit(item, { id: `${item.id}-${item.updatedAt}`, summary: "...", ts: Date.parse(item.updatedAt) });
```

---

## Deduplication

```javascript
export default {
  dedupe: "unique",
  // ...
};
```

`dedupe: "unique"` is the standard strategy. Pipedream will not emit an event whose `id`
it has already seen for this source instance.

For deduplication to work correctly:
- The `id` must be unique per real-world event (not per poll execution)
- The `id` must be stable — if the source is paused and restarted, the same real-world
  event must produce the same `id`
- The `id` will only be deduplicated up to 64 characters

---

## State Management with `$.service.db`

Polling sources need persistent state between runs — typically to track the last-seen
timestamp, cursor, or set of already-emitted IDs.

Declare the store as a prop:

```javascript
props: {
  db: "$.service.db",
  // ...
},
```

**Encapsulate all db access in private methods.** Do not call `this.db.get()` or
`this.db.set()` directly from `run()` or event handlers:

```javascript
methods: {
  _getLastTimestamp() {
    return this.db.get("lastTimestamp");
  },
  _setLastTimestamp(ts) {
    this.db.set("lastTimestamp", ts);
  },
  _getSavedIds() {
    return this.db.get("savedIds") ?? [];
  },
  _setSavedIds(ids) {
    this.db.set("savedIds", ids);
  },
},
```

This keeps `run()` readable and makes the state schema easy to audit in one place.

---

## Polling Sources

### Timer prop

```javascript
props: {
  db: "$.service.db",
  timer: {
    type: "$.interface.timer",
    default: {
      intervalSeconds: 60 * 15,  // 15 minutes; or use DEFAULT_POLLING_SOURCE_TIMER_INTERVAL
    },
  },
},
```

### The polling `run()` pattern

```javascript
async run() {
  // no ts stored on first run, but must avoid fetching full history
  const lastTs = this._getLastTimestamp() ?? 0;

  const items = await this.app.getItems({ since: lastTs });

  if (!items.length) return;    // no new items — return silently, do not throw or emit

  let maxTs = lastTs;
  for (const item of items) {
    this.$emit(item, {
      id: item.id,
      summary: `New item: ${item.name}`,
      ts: Date.parse(item.createdAt),
    });
    if (Date.parse(item.createdAt) > maxTs) {
      maxTs = Date.parse(item.createdAt);
    }
  }

  this._setLastTimestamp(maxTs);  // update state after emitting
},
```

### Polling checklist

- **Handle "no new events" gracefully** — return early without errors or spurious emits
- **Update stored state after emitting**, not before — a partial failure should not
  silently skip events on the next run
- **Handle first run** (no stored state) gracefully — emit nothing, or a bounded initial
  window of recent items; never try to emit the full history (the amount of items emitted should be sliced to the most recent 25 if possible)
- **Paginate through all new items** when the API paginates; do not stop after the first page

### Pagination in polling

```javascript
async run() {
  const lastTs = this._getLastTimestamp() ?? 0;
  let cursor;
  let maxTs = lastTs;

  do {
    const { items, nextCursor } = await this.app.getItems({ since: lastTs, cursor });

    for (const item of items) {
      this.$emit(item, {
        id: item.id,
        summary: `New item: ${item.name}`,
        ts: Date.parse(item.createdAt),
      });
      if (Date.parse(item.createdAt) > maxTs) {
        maxTs = Date.parse(item.createdAt);
      }
    }

    cursor = nextCursor;
  } while (cursor);

  if (maxTs > lastTs) this._setLastTimestamp(maxTs);
},
```

---

## Webhook Sources

Webhook sources use an HTTP endpoint to receive real-time push events from the service.

### HTTP prop

```javascript
props: {
  http: "$.interface.http",
},
```

`this.http.endpoint` provides the unique webhook URL for this deployed source instance.

### Lifecycle methods

Webhook sources are responsible for registering their endpoint with the service on deploy
and deregistering it when the source is deleted. The `activate()` and `deactivate()`
lifecycle methods belong in the top-level `hooks` object, **not** in `methods`. Private
db helpers stay in `methods` as usual:

```javascript
methods: {
  _getHookId() {
    return this.db.get("hookId");
  },
  _setHookId(id) {
    this.db.set("hookId", id);
  },
},

hooks: {
  async activate() {
    // Called on deploy — register the endpoint with the service
    const hook = await this.app.createWebhook({
      url: this.http.endpoint,
      events: ["created", "updated"],
    });
    this._setHookId(hook.id);
  },

  async deactivate() {
    // Called on delete — clean up the registration
    const hookId = this._getHookId();
    if (hookId) {
      await this.app.deleteWebhook({ hookId });
    }
  },
},

async run(event) {
  // Called for each incoming webhook payload
  const { body, headers } = event;

  this.$emit(body, {
    // id field must exist and match the event schema
    id: headers["x-request-id"] ?? body.id,
    summary: `${body.type} event`,
    ts: body.occurredAt ? Date.parse(body.occurredAt) : Date.now(),
  });
},
```

### Webhook checklist

- Both `activate()` (register) and `deactivate()` (clean up) must be present when the
  source creates webhook registrations
- The webhook registration ID must be persisted in `db` so `deactivate()` can clean up
  even if the source is deleted immediately after deploy
- `deactivate()` must handle the case where no hook ID is stored (source was deployed
  but registration failed — do not throw in that case)
- The `run()` method receives the full HTTP event object `{ body, headers, query,
  method, rawBody }` — verify the implementation reads from the correct fields

---

## Hybrid Sources (Webhook + Polling Fallback)

Some services support webhooks but require admin permissions to register them. Hybrid
sources detect the permission level at deploy time and choose the delivery mechanism:

```javascript
hooks: {
  async activate() {
    const isAdmin = await this.app.checkAdminAccess();
    if (isAdmin) {
      // Register webhook
      const hook = await this.app.createWebhook({ url: this.http.endpoint });
      this._setHookId(hook.id);
      this._setDeliveryMode("webhook");
    } else {
      // Fall back to polling
      this._setDeliveryMode("polling");
    }
  },
},

async run(event) {
  const mode = this._getDeliveryMode();
  if (mode === "webhook") {
    // Handle HTTP event
    const { body } = event;
    this.$emit(body, { id: body.id, summary: "...", ts: Date.parse(body.createdAt) });
  } else {
    // Handle timer event (polling)
    const items = await this.app.getItems({ since: this._getLastTimestamp() });
    for (const item of items) {
      this.$emit(item, { id: item.id, summary: "...", ts: Date.parse(item.createdAt) });
    }
    // update stored timestamp
  }
},
```

### Hybrid checklist

- Both execution paths (webhook handler and polling handler) must be correctly implemented
  in `run()`
- The delivery mode must be persisted in `db` so `run()` knows which path to take
- The polling fallback must follow all polling checklist requirements (state, pagination,
  empty result handling)
- `deactivate()` should only attempt webhook cleanup when the webhook path was used

---

## Common Source Types

### "New [Object]" sources

Emits once for each new record created in the service. The most common source type.

Checklist:
- Uses `dedupe: "unique"` with the record's native ID as the emit `id`
- Stores the last-seen timestamp or cursor in `db` to avoid re-emitting on restart
- Handles first run without stored state (emit nothing, or a bounded recent window)
- Fetches all pages of new items, not just the first page

### "Updated [Object]" sources

Triggers on modifications to existing records. Harder to deduplicate correctly because
the same record can be updated many times.

Checklist:
- The `id` must not be reused across updates of the same record — combine the record ID
  with the `updated_at` timestamp, or use the service's native event/audit ID
- The source must not re-emit unchanged records or full history on every poll
- If the API provides a dedicated activity or event log endpoint, prefer that over
  polling the record list and comparing `updated_at`

### "New Event" sources (activity streams, audit logs, webhooks)

Emits from a stream of structured events rather than a record list.

Checklist:
- Use the service's native event ID as the `$emit` `id`
- Use the event's own timestamp for `ts`
- If the stream supports a cursor or offset, store it in `db` rather than a timestamp
  (cursor-based pagination is less prone to missed events during the poll interval)
