import { axios } from "@pipedream/platform";
import dart from "../../dart.app.mjs";

export default {
  key: "dart-new-task-created-instant",
  name: "New Task Created Instant",
  description: "Emit new event when a task is created. [See the documentation](https://app.itsdart.com/api/v0/docs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dart,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // get all tasks from all dartboards
      const dartboards = await this.dart._makeRequest({
        path: "/dartboards",
      });
      for (const dartboard of dartboards) {
        const tasks = await this.dart._makeRequest({
          path: `/dartboards/${dartboard.id}/tasks`,
        });
        for (const task of tasks) {
          this.$emit(task, {
            id: task.id,
            summary: `New Task: ${task.name}`,
            ts: Date.parse(task.created_at),
          });
        }
      }
    },
  },
  async run() {
    // get all tasks from all dartboards
    const dartboards = await this.dart._makeRequest({
      path: "/dartboards",
    });
    for (const dartboard of dartboards) {
      const tasks = await this.dart._makeRequest({
        path: `/dartboards/${dartboard.id}/tasks`,
      });
      for (const task of tasks) {
        this.$emit(task, {
          id: task.id,
          summary: `New Task: ${task.name}`,
          ts: Date.parse(task.created_at),
        });
      }
    }
  },
};
