import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nifty-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a task is created in a project.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "taskCreated",
      ];
    },
    getSummary({ data }) {
      return `New task created with Id: ${data.id}`;
    },
  },
  sampleEmit,
};
