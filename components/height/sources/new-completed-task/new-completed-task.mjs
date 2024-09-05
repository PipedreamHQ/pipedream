import common from "../common/tasks.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "height-new-completed-task",
  name: "New Completed Task",
  description: "Emit new event when a task is marked as complete.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "completedAt";
    },
    getSummary(task) {
      return `Task Completed: ${task.name}`;
    },
  },
  sampleEmit,
};
