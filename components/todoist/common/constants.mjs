// object_event_types filter value (passed as a JSON-stringified array).
// Todoist logs each occurrence of a recurring task's completion as its own
// `item:completed` activity entry (distinguished by event_date), same as a
// non-recurring completion - there's no separate event type for it.
export const OBJECT_EVENT_TYPE_ITEM_COMPLETED = "item:completed";

// Activity log page size (API max is 200; using the max minimizes round trips)
export const ACTIVITY_LOG_DEFAULT_LIMIT = 200;

// On the very first poll (no stored lastDate yet), look back this far instead
// of starting from "now" - otherwise date_from === date_to and the deploy-time
// test in the workflow builder would always see zero events.
export const FIRST_RUN_LOOKBACK_MS = 24 * 60 * 60 * 1000;

// Never advance the polling watermark all the way to the exact current
// instant - Todoist can take a moment to index a just-logged activity event
// (recurring completions especially, since they write both a completion
// snapshot and a due-date reschedule). This buffer is also subtracted behind
// the stored watermark on every subsequent poll, so each poll deliberately
// re-scans a small overlap with the previous one: if an event was still
// indexing at the moment of the previous poll, it gets a second chance
// instead of being permanently stranded behind an ever-advancing,
// non-overlapping watermark. dedupe: "unique" (keyed on object_id +
// event_date) safely filters out anything in that overlap already emitted.
export const POLL_SAFETY_BUFFER_MS = 60 * 1000;

// Matches the 20-item cap hooks.deploy() applies before emitting (see
// sources/common.mjs). The polling watermark is only ever advanced past what
// a poll actually returns, so it stays in sync with that cap - whether a
// given call originated from deploy() or a regular scheduled run(). Without
// this, deploy()'s downstream slice(0, 20) could silently strand any
// completions beyond the first 20 in the lookback window, since the
// watermark would already have advanced past them.
export const MAX_RESULTS_PER_POLL = 20;
