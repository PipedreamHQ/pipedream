import offlight from "../../offlight.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "offlight-new-task-done-instant",
  name: "New Task Done Instant",
  description: "Emit new event when a task is marked as complete. [See the documentation](https://www.offlight.work/docs/zapeir-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    offlight: {
      type: "app",
      app: "offlight",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const tasks = await this.offlight.getDoneTasks({
        max: 50,
      });
      for (const task of tasks) {
        this.$emit(task, {
          id: task.id,
          summary: `Task ${task.name} marked as done`,
          ts: Date.parse(task.doneAt),
        });
      }
    },
    async activate() {
      // No specific activation for this component
    },
    async deactivate() {
      // No specific deactivation for this component
    },
  },
  async run(event) {
    const { body: task } = event;
    this.$emit(task, {
      id: task.id,
      summary: `Task ${task.name} marked as done`,
      ts: Date.parse(task.doneAt),
    });
  },
};
