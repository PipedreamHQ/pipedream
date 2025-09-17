import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "taiga-deleted-task-instant",
  name: "Deleted Task (Instant)",
  description: "Emit new event when a task is deleted in the selected project. [See the documentation](https://docs.taiga.io/api.html#webhooks-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Deleted Task: ${body.data.id}`;
    },
    filterEvent(body) {
      return body.type === "task" && body.action === "delete";
    },
  },
  sampleEmit,
};
