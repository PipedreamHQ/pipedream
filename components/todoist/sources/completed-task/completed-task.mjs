import { createHash } from "crypto";
import common from "../common-task.mjs";
import {
  OBJECT_EVENT_TYPE_ITEM_COMPLETED,
  ACTIVITY_LOG_DEFAULT_LIMIT,
  FIRST_RUN_LOOKBACK_MS,
  POLL_SAFETY_BUFFER_MS,
  MAX_RESULTS_PER_POLL,
} from "../../common/constants.mjs";

const MAX_DEDUPE_ID_LENGTH = 64;

// Builds a dedupe id guaranteed to stay within Pipedream's dedupe length
// limit (deduplication silently stops working past MAX_DEDUPE_ID_LENGTH
// characters - see pipedream-source-guidelines.md). Readable when the parts
// fit; falls back to a stable SHA-256 hex digest (exactly 64 characters) of
// the same parts when they don't, so a longer future ID format or a longer
// timestamp representation can never silently break deduplication.
function buildDedupeId(...parts) {
  const readableId = parts.join("-");
  if (readableId.length <= MAX_DEDUPE_ID_LENGTH) {
    return readableId;
  }
  return createHash("sha256").update(readableId)
    .digest("hex");
}

export default {
  ...common,
  key: "todoist-completed-task",
  name: "New Completed Task",
  description: "Emit new event for each completed Todoist task, including recurring task completions. Non-recurring completions are polled via `GET /tasks/completed/by_completion_date`. Recurring completions don't appear there - Todoist reschedules a recurring task instead of marking it completed there - so they're additionally polled via the v1 Activity Log (`GET /api/v1/activities`), detected as an `item:completed` event with `extra_data.is_recurring` set to `true`. **Accessing recurring task completions older than 7 days requires a Todoist premium/business plan**.  Respects the Projects filter. [See the documentation](https://developer.todoist.com/api/v1/#tag/Activity/operation/get_activity_logs_api_v1_activities_get).",
  version: "2.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(value) {
      this.db.set("lastDate", value);
    },
    async _getNonRecurringCompletions(dateFrom, dateTo) {
      const allTasks = [];
      let cursor;
      do {
        const response = await this.todoist.getCompletedTasks({
          params: {
            since: dateFrom,
            until: dateTo,
            ...(cursor && {
              cursor,
            }),
          },
        });
        allTasks.push(...(response.items ?? []));
        cursor = response.next_cursor;
      } while (cursor);

      return allTasks.map((task) => ({
        projectId: task.project_id,
        ts: Date.parse(task.completed_at),
        summary: `Completed task: ${task.content ?? task.id}`,
        // task.id alone isn't unique per real-world event: reopening and
        // re-completing the same task would produce the same id, and the
        // later completion would be silently dropped as a dedupe collision.
        // completed_at makes each individual completion distinct.
        dedupeId: buildDedupeId(task.id, task.completed_at),
        raw: task,
      }));
    },
    // Best-effort: Activity Log access is a premium-only Todoist feature
    // ("Premium only feature", error_code 32), so accounts without it get a
    // 403 here - caught and treated as "no recurring completions available
    // this poll", which never affects the non-recurring completions above.
    async _getRecurringCompletions(dateFrom, dateTo) {
      try {
        const allResults = [];
        let cursor;
        do {
          const response = await this.todoist.getActivityLogs({
            params: {
              object_event_types: JSON.stringify([
                OBJECT_EVENT_TYPE_ITEM_COMPLETED,
              ]),
              date_from: dateFrom,
              date_to: dateTo,
              limit: ACTIVITY_LOG_DEFAULT_LIMIT,
              ...(cursor && {
                cursor,
              }),
            },
          });
          allResults.push(...(response.results ?? []));
          cursor = response.next_cursor;
          // Always follow every page rather than stopping early once we have
          // "enough" - we can't assume which end of the date range an earlier
          // page represents, so stopping early risks capping to the wrong
          // (oldest) entries when there's a large backlog spanning many pages.
        } while (cursor);

        // Non-recurring completions are already covered by
        // _getNonRecurringCompletions above (and also appear here as plain
        // item:completed entries) - only keep entries Todoist marks as
        // belonging to a recurring task, to avoid emitting duplicates.
        return allResults
          .filter((entry) => entry.extra_data?.is_recurring === true)
          .map((entry) => ({
            projectId: entry.parent_project_id,
            ts: Date.parse(entry.event_date),
            summary: `Completed task: ${entry.extra_data?.content ?? entry.object_id}`,
            dedupeId: buildDedupeId(entry.object_id, entry.event_date),
            raw: entry,
          }));
      } catch (err) {
        if (err.response?.status === 403) {
          console.error("Activity Log unavailable (premium-only feature restriction) - skipping recurring task completions this poll", err);
          return [];
        }
        throw err;
      }
    },
    async getSyncResult() {
      const lastDate = this._getLastDate();
      const now = Date.now();
      // Never advance date_to all the way to the exact current instant -
      // Todoist can take a moment to index a just-logged activity event
      // (recurring completions especially, since they write both a
      // completion snapshot and a due-date reschedule). Without this buffer,
      // an event that isn't indexed yet at poll time would have an event_date
      // already behind the next poll's date_from once it does appear, and
      // would be skipped permanently instead of being picked up next time.
      const dateTo = new Date(now - POLL_SAFETY_BUFFER_MS).toISOString();
      // On the first poll there's no lastDate yet; look back a bounded window
      // instead of starting from "now", otherwise date_from === date_to and
      // this (and the deploy-time test in the workflow builder) would always
      // see zero events even if a task was just completed.
      const dateFrom = lastDate || new Date(now - FIRST_RUN_LOOKBACK_MS).toISOString();

      const [
        nonRecurring,
        recurring,
      ] = await Promise.all([
        this._getNonRecurringCompletions(dateFrom, dateTo),
        this._getRecurringCompletions(dateFrom, dateTo),
      ]);

      const allResults = [
        ...nonRecurring,
        ...recurring,
      ];
      // Sort oldest-first so that, when a window has more than
      // MAX_RESULTS_PER_POLL events, we keep the OLDEST unprocessed ones and
      // advance the watermark only past those - capping to the most recent
      // N would otherwise permanently skip everything older than the cut.
      allResults.sort((a, b) => a.ts - b.ts);
      const capped = allResults.slice(0, MAX_RESULTS_PER_POLL);

      // Don't persist the new watermark yet - state must only update after
      // emitResults() has successfully processed this batch, so a partial
      // failure while emitting can't silently skip events on the next run.
      // Storing it on `this` for emitResults() to pick up (both methods run
      // within the same run()/deploy() invocation).
      this._nextLastDate = capped.length
        ? new Date(capped[capped.length - 1].ts).toISOString()
        : dateTo;

      return capped;
    },
    filterResults(syncResult) {
      return syncResult
        .filter((element) =>
          this.todoist.isProjectInList(
            element.projectId,
            this.selectProjects ?? [],
          ));
    },
    generateMeta(element) {
      return {
        id: element.dedupeId,
        summary: element.summary,
        ts: element.ts,
      };
    },
    emitResults(results) {
      for (const element of results) {
        const meta = this.generateMeta(element);
        this.$emit(element.raw, meta);
      }
      // Only advance the watermark now that every event above has been
      // emitted successfully - see the comment in getSyncResult().
      if (this._nextLastDate) {
        this._setLastDate(this._nextLastDate);
      }
    },
  },
};
