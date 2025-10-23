import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dart-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a task is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dart.listTasks;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(task) {
      return {
        id: task.duid,
        summary: `New Task: ${task.duid}`,
        ts: Date.parse(task.createdAt),
      };
    },
  },
  sampleEmit,
};
