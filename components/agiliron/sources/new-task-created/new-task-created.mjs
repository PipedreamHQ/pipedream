import agiliron from "../../agiliron.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiliron-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created in Agiliron. [See the documentation](https://learn.agiliron.com/docs/getting-started)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agiliron,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const tasks = await this.agiliron.getEvents();
      for (const task of tasks.Events.Event.slice(-50)) {
        this.$emit(task, {
          id: task.EventId,
          summary: `New task: ${task.Subject}`,
          ts: new Date(task.CreatedTimeUTC).getTime(),
        });
      }
    },
    async activate() {},
    async deactivate() {},
  },
  async run() {
    const tasks = await this.agiliron.getEvents();
    for (const task of tasks.Events.Event) {
      this.$emit(task, {
        id: task.EventId,
        summary: `New task: ${task.Subject}`,
        ts: new Date(task.CreatedTimeUTC).getTime(),
      });
    }
  },
};
