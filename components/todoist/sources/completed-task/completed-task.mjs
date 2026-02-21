import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-completed-task",
  name: "New Completed Task",
  description: "Emit new event for each completed task. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Overview/Read-resources)",
  version: "1.0.1",
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
      const params = {};
      if (lastDate) {
        params.since = lastDate;
      }
      const response = await this.todoist.getCompletedTasks({
        params,
      });

      const newDate = new Date().toISOString();
      this._setLastDate(newDate);

      return response.items ?? [];
    },
    filterResults(syncResult) {
      return syncResult
        .filter((element) =>
          this.todoist.isProjectInList(element.project_id, this.selectProjects ?? []));
    },
  },
};
