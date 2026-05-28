import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "leiga-updated-issue-instant",
  name: "New Updated Issue (Instant)",
  description: "Emit new event when an existing issue is updated in Leiga.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "update";
    },
    getSummary(body) {
      return `New issue updated with Id: ${body.data.issue.id}`;
    },
  },
  sampleEmit,
};
