import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ticktick-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(task) {
      return `New Task Created ID: ${task.id}`;
    },
  },
  async run() {
    const tasks = await this.ticktick.listTasks({
      projectId: this.projectId,
    });
    for (const task of tasks) {
      const meta = this.generateMeta(task);
      this.$emit(task, meta);
    }
  },
  sampleEmit,
};
