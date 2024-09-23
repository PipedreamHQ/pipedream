import offlight from "../../offlight.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "offlight-new-task-done-instant",
  name: "New Task Done (Instant)",
  description: "Emit new event when a task is marked as complete.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    offlight,
    http: {
      type: "$.interface.http",
    },
    db: "$.service.db",
  },
  methods: {
    emitTask(task) {
      this.$emit(task, {
        id: task.id,
        summary: `Task ${task.name} marked as done`,
        ts: Date.parse(task.doneAt),
      });
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.offlight.getDoneTasks();
      for (const task of tasks) {
        this.emitTask(task);
      }
    },
    async activate() {
      await this.offlight.createWebhook({
        data: {
          purpose: "doneTask",
          hookUrl: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.offlight.deleteWebhook({
        data: {
          purpose: "doneTask",
          hookUrl: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {
    this.emitTask(body);
  },
  sampleEmit,
};
