import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "taiga-changed-issue-status-instant",
  name: "Changed Issue Status (Instant)",
  description: "Emit new event when an issue status is changed in the selected project. [See the documentation](https://docs.taiga.io/api.html#webhooks-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Changed Issue Status: ${body.data.id}`;
    },
    filterEvent(body) {
      return body.type === "issue" && body.action === "change" && body.change.diff.status;
    },
  },
  sampleEmit,
};
