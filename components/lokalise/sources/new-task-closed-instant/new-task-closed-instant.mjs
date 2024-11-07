import lokalise from "../../lokalise.app.mjs";

export default {
  key: "lokalise-new-task-closed-instant",
  name: "New Task Closed (Instant)",
  description: "Emit new event when a task is closed in Lokalise",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lokalise,
    db: "$.service.db",
    taskId: {
      propDefinition: [
        lokalise,
        "taskId",
      ],
    },
    projectId: {
      propDefinition: [
        lokalise,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const task = await this.lokalise.closeTask({
        taskId: this.taskId,
      });
      this.$emit(task, {
        id: task.task_id,
        summary: `Task ${task.task_id} closed`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const task = await this.lokalise.closeTask({
      taskId: this.taskId,
    });
    this.$emit(task, {
      id: task.task_id,
      summary: `Task ${task.task_id} closed`,
      ts: Date.now(),
    });
  },
};
