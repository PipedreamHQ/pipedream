import newTaskAdded from "../new-task-added/new-task-added.mjs";

export default {
  ...newTaskAdded,
  key: "google_tasks-new-task-updated",
  name: "New Task Updated",
  description: "Emit new event for each task added or updated to Google Tasks. [See the documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/list)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...newTaskAdded.props,
  },
  methods: {
    ...newTaskAdded.methods,
    generateMeta(event) {
      return {
        id: `${event.id}-${event.updated}`,
        summary: `Task update: ${event.title}`,
        ts: new Date(event.updated),
      };
    },
    getParams() {
      return {
        maxResults: this._maxQueryResults(),
        updatedMin: this._getLastUpdate(),
        showCompleted: true,
        showDeleted: true,
        showHidden: true,
      };
    },
  },
};
