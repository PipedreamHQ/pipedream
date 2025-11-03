import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "taiga-changed-task-status-instant",
  name: "Changed Task Status (Instant)",
  description: "Emit new event when a task status is changed in the selected project. [See the documentation](https://docs.taiga.io/api.html#webhooks-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Changed Task Status: ${body.data.id}`;
    },
    filterEvent(body) {
      return body.type === "task" && body.action === "change" && body.change.diff.status;
    },
  },
  sampleEmit,
};
