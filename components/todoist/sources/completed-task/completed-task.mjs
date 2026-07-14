import common from "../common-task.mjs";
import {
  OBJECT_EVENT_TYPE_ITEM_COMPLETED,
  ACTIVITY_LOG_DEFAULT_LIMIT,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "todoist-completed-task",
  name: "New Completed Task",
  description: "Emit new event for each completed Todoist task, including recurring task completions. Polls the Todoist v1 Activity Log endpoint (`GET /api/v1/activities`) filtered to `item:completed` events, which captures BOTH recurring and non-recurring completions - unlike `/api/v1/tasks/completed/by_completion_date`, which silently omits recurring completions (Todoist reschedules recurring tasks rather than marking them completed). Respects the Projects filter. [See the documentation](https://developer.todoist.com/api/v1/#tag/Activity/operation/get_activity_logs_api_v1_activities_get).",
  version: "1.0.5",
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
      const newDate = new Date().toISOString();
      this._nextDate = newDate;
      const baseParams = {
        object_event_types: JSON.stringify([
          OBJECT_EVENT_TYPE_ITEM_COMPLETED,
        ]),
        date_from: lastDate || newDate,
        date_to: newDate,
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

      return allResults;
    },
    async run() {
      const syncResult = await this.getSyncResult();
      const results = this.filterResults(syncResult);
      this.emitResults(results);
      this._setLastDate(this._nextDate);
    },
    filterResults(syncResult) {
      return syncResult.filter((element) =>
        this.todoist.isProjectInList(
          element.parent_project_id,
          this.selectProjects ?? [],
        ));
    },
    generateMeta(element) {
      const {
        id,
        object_id: objectId,
        event_date: eventDate,
      } = element;
      return {
        id,
        summary: `Completed task: ${objectId}`,
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
