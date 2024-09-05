import common from "../common/tasks.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "height-new-updated-task",
  name: "New or Updated Task",
  description: "Emit new event whenever a task is created or updated in Height.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "lastActivityAt";
    },
    getSummary(task) {
      return `Task Updated: ${task.name}`;
    },
  },
  sampleEmit,
};
