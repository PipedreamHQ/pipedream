import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "taiga-new-issue-instant",
  name: "New Issue (Instant)",
  description: "Emit new event when an issue is created in the selected project. [See the documentation](https://docs.taiga.io/api.html#webhooks-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(body) {
      return `New Issue: ${body.data.id}`;
    },
    filterEvent(body) {
      return body.type === "issue" && body.action === "create";
    },
  },
  sampleEmit,
};
