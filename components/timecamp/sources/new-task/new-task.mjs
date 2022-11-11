import timecamp from "../../timecamp.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Task",
  version: "0.0.2",
  key: "timecamp-new-task",
  description: "Emit new event on each created task.",
  type: "source",
  dedupe: "unique",
  props: {
    timecamp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.task_id,
        summary: `New task with id ${data.task_id}`,
        ts: Date.parse(data.add_date),
      });
    },
    async emitAllTasks() {
      const tasks = await this.timecamp.getTasks({});

      tasks.reverse().forEach(this.emitEvent);
    },
  },
  hooks: {
    async deploy() {
      await this.emitAllTasks();
    },
  },
  async run() {
    await this.emitAllTasks();
  },
};
