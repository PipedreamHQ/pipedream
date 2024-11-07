import lokalise from "../../lokalise.app.mjs";

export default {
  key: "lokalise-new-task-created-instant",
  name: "New Task Created in Lokalise (Instant)",
  description: "Emits an event when a new task is created in Lokalise",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lokalise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getTaskIds(tasks) {
      return tasks.map((task) => task.task_id);
    },
    _getNewTaskIds(taskIds, oldTaskIds) {
      return taskIds.filter((id) => !oldTaskIds.includes(id));
    },
  },
  async run() {
    const oldTaskIds = this.db.get("taskIds") || [];
    const { tasks } = await this.lokalise._makeRequest({
      method: "GET",
      path: `/projects/${this.lokalise.projectId}/tasks`,
    });
    const taskIds = this._getTaskIds(tasks);
    const newTaskIds = this._getNewTaskIds(taskIds, oldTaskIds);
    for (const taskId of newTaskIds) {
      const { tasks: newTasks } = await this.lokalise._makeRequest({
        method: "GET",
        path: `/projects/${this.lokalise.projectId}/tasks/${taskId}`,
      });
      this.$emit(newTasks[0], {
        id: newTasks[0].task_id,
        summary: `New Task: ${newTasks[0].title}`,
        ts: Date.parse(newTasks[0].created_at),
      });
    }
    this.db.set("taskIds", taskIds);
  },
};
