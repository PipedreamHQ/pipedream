import { axios } from "@pipedream/platform";
import height from "../../height.app.mjs";

export default {
  key: "height-new-task-added-instant",
  name: "New Task Added (Instant)",
  description: "Emits an event when a new task is added to a list in Height",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    height,
    list: {
      propDefinition: [
        height,
        "list",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(task) {
      const {
        id, name, created_at,
      } = task;
      return {
        id,
        summary: `New task added: ${name}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.timestamp;
    const tasks = await this.height.searchTasks(this.list);
    const newTasks = tasks.filter((task) => Date.parse(task.created_at) > lastRun);
    newTasks.forEach((task) => {
      const {
        id, summary, ts,
      } = this.generateMeta(task);
      this.$emit(task, {
        id,
        summary,
        ts,
      });
    });
    this.db.set("lastRun", this.timer.timestamp);
  },
};
