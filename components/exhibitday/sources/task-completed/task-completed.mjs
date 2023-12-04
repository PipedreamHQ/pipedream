import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-task-completed",
  name: "Task Completed",
  description: "Emit new event when a task is marked as complete in ExhibitDay",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    exhibitday,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    userName: {
      type: "string",
      label: "User",
      description: "The user who completed the task",
    },
  },
  methods: {
    _getTaskId() {
      return this.db.get("taskId") ?? null;
    },
    _setTaskId(taskId) {
      this.db.set("taskId", taskId);
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.exhibitday.getTaskCompleted();
      if (tasks.length > 0) {
        const { id } = tasks[0];
        this._setTaskId(id);
      }
    },
  },
  async run() {
    const tasks = await this.exhibitday.getTaskCompleted();
    const lastTaskId = this._getTaskId();
    for (const task of tasks) {
      if (task.id === lastTaskId) break;
      if (task.name === this.taskName && task.completedBy === this.userName) {
        this.$emit(task, {
          id: task.id,
          summary: `Task ${task.name} completed by ${task.completedBy}`,
          ts: Date.parse(task.completedAt),
        });
      }
    }
    if (tasks.length > 0) {
      this._setTaskId(tasks[0].id);
    }
  },
};
