import height from "../../height.app.mjs";

export default {
  key: "height-new-updated-task-instant",
  name: "New or Updated Task Instant",
  description: "Emit an event whenever a task is created or updated in Height. [See the documentation](https://docs.height.app)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    height,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at, updated_at,
      } = data;
      const ts = new Date(updated_at || created_at).getTime();
      return {
        id,
        summary: `Task ID: ${id} updated`,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.height.searchTasks("");
      for (const task of tasks) {
        this.$emit(task, this.generateMeta(task));
      }
    },
  },
  async run() {
    const tasks = await this.height.searchTasks("");
    for (const task of tasks) {
      const lastEmittedTask = this.db.get(task.id);
      if (!lastEmittedTask || new Date(lastEmittedTask.updated_at) < new Date(task.updated_at)) {
        this.$emit(task, this.generateMeta(task));
        this.db.set(task.id, task);
      }
    }
  },
};
