import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-task-completed",
  name: "Task Completed",
  description: "Emit new event when a task is marked done, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "task.completed";
    },
    getPath() {
      return "/tasks";
    },
    getIdKey() {
      return "taskId";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Task Completed";
    },
  },
};
