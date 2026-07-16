import common from "../common-task.mjs";
import {
  OBJECT_EVENT_TYPE_ITEM_COMPLETED,
  ACTIVITY_LOG_DEFAULT_LIMIT,
  FIRST_RUN_LOOKBACK_MS,
  POLL_SAFETY_BUFFER_MS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "todoist-completed-task",
  name: "New Completed Task",
  description: "Emit new event for each completed Todoist task, including recurring task completions. Polls the Todoist v1 Activity Log endpoint (`GET /api/v1/activities`) filtered to `item:completed` events - Todoist logs each occurrence of a recurring task's completion as its own `completed` activity entry, unlike `/tasks/completed/by_completion_date`, which omits recurring completions entirely (Todoist reschedules recurring tasks rather than marking them completed there). Respects the Projects filter. [See the documentation](https://developer.todoist.com/api/v1/#tag/Activity/operation/get_activity_logs_api_v1_activities_get).",
  version: "1.1.0",
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
    async getSyncResult() {
      const lastDate = this._getLastDate();
      const now = Date.now();
      // Never advance date_to/lastDate all the way to the exact current
      // instant - Todoist can take a moment to index a just-logged activity
      // event (recurring completions especially, since they write both a
      // completion snapshot and a due-date reschedule). Without this buffer,
      // an event that isn't indexed yet at poll time would have an event_date
      // already behind the next poll's date_from once it does appear, and
      // would be skipped permanently instead of being picked up next time.
      const effectiveNow = new Date(now - POLL_SAFETY_BUFFER_MS).toISOString();
      // On the first poll there's no lastDate yet; look back a bounded window
      // instead of starting from "now", otherwise date_from === date_to and
      // this (and the deploy-time test in the workflow builder) would always
      // see zero events even if a task was just completed.
      const firstRunDate = new Date(now - FIRST_RUN_LOOKBACK_MS).toISOString();
      const baseParams = {
        object_event_types: JSON.stringify([
          OBJECT_EVENT_TYPE_ITEM_COMPLETED,
        ]),
        date_from: lastDate || firstRunDate,
        date_to: effectiveNow,
        limit: ACTIVITY_LOG_DEFAULT_LIMIT,
      };

      const allResults = [];
      let cursor;
      do {
        const response = await this.todoist.getActivityLogs({
          params: {
            ...baseParams,
            ...(cursor && {
              cursor,
            }),
          },
        });
        const items = response.results ?? [];
        allResults.push(...items);
        cursor = response.next_cursor;
      } while (cursor);

      this._setLastDate(effectiveNow);

      return allResults;
    },
    filterResults(syncResult) {
      return syncResult
        .filter((element) =>
          this.todoist.isProjectInList(
            element.parent_project_id,
            this.selectProjects ?? [],
          ));
    },
    generateMeta(element) {
      const {
        object_id: objectId,
        event_date: eventDate,
        extra_data: extraData,
      } = element;
      // The Activity Log's numeric `id` can exceed Number.MAX_SAFE_INTEGER and
      // loses precision once JSON-parsed (observed values run ~38 digits), so
      // it can't be trusted as a unique dedupe key by itself. object_id +
      // event_date (microsecond precision) is unique per completion, including
      // each individual occurrence of a recurring task.
      return {
        id: `${objectId}-${eventDate}`,
        summary: `Completed task: ${extraData?.content ?? objectId}`,
        ts: Date.parse(eventDate),
      };
    },
    emitResults(results) {
      for (const element of results) {
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      }
    },
  },
};
