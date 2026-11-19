import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-task",
  name: "New Task",
  description: "Emit new event when a task is added, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "task.created";
    },
    getPath() {
      return "/tasks";
    },
    getIdKey() {
      return "taskId";
    },
    getSummary() {
      return "New Task";
    },
  },
};
