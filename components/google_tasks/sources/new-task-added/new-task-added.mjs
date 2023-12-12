import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_tasks-new-task-added",
  name: "New Task Added",
  description: "Emit new event for each task added to Google Tasks. [See the documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/list)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    taskListId: {
      propDefinition: [
        common.props.googleTasks,
        "taskListId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvents(tasks) {
      const sortedTasks = tasks.sort((t1, t2) => ((new Date(t1.updated)) - (new Date(t2.updated))));
      for (const task of sortedTasks) {
        this.$emit(task, this.generateMeta(task));
      }
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New task: ${event.title}`,
        ts: new Date(event.updated),
      };
    },
    getParams() {
      return {
        maxResults: this._maxQueryResults(),
        updatedMin: this._getLastUpdate(),
      };
    },
  },
  async run() {
    const tasks = await this.googleTasks.paginate(
      this.googleTasks.getTasks.bind(this),
      this.getParams(),
      this.taskListId,
    );
    const maxDate = new Date(Math.max(...tasks.map((task) => new Date(task.updated))));
    this._setLastUpdate(maxDate);
    this.emitEvents(tasks);
  },
};
