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

// Never advance date_to (and therefore the next poll's date_from, since it's
// carried over as the stored watermark) all the way to the exact current
// instant - Todoist can take a moment to index a just-logged activity event
// (recurring completions especially, since they write both a completion
// snapshot and a due-date reschedule). This buffer only applies to date_to;
// date_from is the previous poll's date_to as-is, with no additional overlap
// subtracted from it. Continuity across polls comes from that carry-over
// (each poll's window picks up exactly where the last one's left off), not
// from re-scanning a deliberate overlap - an event still indexing when a
// poll's (buffered) date_to is computed will simply fall after that
// boundary and be picked up on the next poll instead.
export const POLL_SAFETY_BUFFER_MS = 60 * 1000;

// Matches the 20-item cap hooks.deploy() applies before emitting (see
// sources/common.mjs). The polling watermark is only ever advanced past what
// a poll actually returns, so it stays in sync with that cap - whether a
// given call originated from deploy() or a regular scheduled run(). Without
// this, deploy()'s downstream slice(0, 20) could silently strand any
// completions beyond the first 20 in the lookback window, since the
// watermark would already have advanced past them.
export const MAX_RESULTS_PER_POLL = 20;
