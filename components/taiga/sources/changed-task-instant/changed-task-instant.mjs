import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "taiga-changed-task-instant",
  name: "Changed Task (Instant)",
  description: "Emit new event when a task is updated in the selected project. [See the documentation](https://docs.taiga.io/api.html#webhooks-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Changed Task: ${body.data.id}`;
    },
    filterEvent(body) {
      return body.type === "task" && body.action === "change" && !body.change.diff.status;
    },
  },
  sampleEmit,
};
