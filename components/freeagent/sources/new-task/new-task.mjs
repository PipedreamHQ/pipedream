import { getId } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freeagent-new-task",
  name: "New Task",
  description: "Emit new event when a new task is created. [See the documentation](https://dev.freeagent.com/docs/tasks#list-all-tasks).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDataField() {
      return "tasks";
    },
    getFunction() {
      return this.freeagent.listTasks;
    },
    getSummary(item) {
      return `New Task: ${getId(item.url)}`;
    },
  },
  sampleEmit,
};
