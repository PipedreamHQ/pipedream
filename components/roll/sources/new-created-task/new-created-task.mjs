import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Created Task",
  key: "roll-new-created-task",
  description: "Emit new event when a task is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "TaskId";
    },
    getFieldResponse() {
      return "task";
    },
    getQuery() {
      return "listTasks";
    },
    getOrderField() {
      return "{\"TaskId\": \"DESC\"}";
    },
    getDataToEmit({
      TaskId,
      Created,
    }) {
      const dateTime = Created || new Date().getTime();
      return {
        id: TaskId,
        summary: `New task with TaskId ${TaskId} was successfully created!`,
        ts: dateTime,
      };
    },
  },
};

