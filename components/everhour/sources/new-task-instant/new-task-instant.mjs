import everhour from "../../everhour.app.mjs";

export default {
  key: "everhour-new-task-instant",
  name: "New Task Created",
  description: "Emit new event when a task is created. [See the documentation](https://everhour.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    everhour,
    db: "$.service.db",
    projectId: {
      propDefinition: [
        everhour,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.everhour.getProjectTasks(this.projectId);
      for (const task of tasks.slice(0, 50)) {
        this.$emit(task, {
          id: task.id,
          summary: `New task: ${task.name}`,
          ts: Date.parse(task.createdAt),
        });
      }
    },
    async activate() {
      await this.everhour.emitTaskCreatedEvent(this.projectId);
    },
    async deactivate() {
      // Implement deactivation if an API endpoint exists
    },
  },
  async run() {
    const tasks = await this.everhour.getProjectTasks(this.projectId);
    for (const task of tasks) {
      this.$emit(task, {
        id: task.id,
        summary: `New task: ${task.name}`,
        ts: Date.parse(task.createdAt),
      });
    }
  },
};
