import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agiliron-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created in Agiliron.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return {
        date: "CreatedTime",
        id: "TaskId",
        ...constants.TYPE_FIELDS.Tasks,
      };
    },
    getFunction() {
      return this.agiliron.getTasks;
    },
    getSummary(task) {
      return `New task: ${task.Subject}`;
    },
  },
  sampleEmit,
};
