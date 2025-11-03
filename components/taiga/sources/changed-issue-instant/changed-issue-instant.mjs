import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "taiga-changed-issue-instant",
  name: "Changed Issue (Instant)",
  description: "Emit new event when an issue is updated in the selected project. [See the documentation](https://docs.taiga.io/api.html#webhooks-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Changed Issue: ${body.data.id}`;
    },
    filterEvent(body) {
      return body.type === "issue" && body.action === "change" && !body.change.diff.status;
    },
  },
  sampleEmit,
};
