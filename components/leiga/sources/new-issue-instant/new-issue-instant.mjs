import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "leiga-new-issue-instant",
  name: "New Issue (Instant)",
  description: "Emit new event when there is a new issue in Leiga for the specified project.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "create";
    },
    getSummary(body) {
      return `New issue created with Id: ${body.data.issue.id}`;
    },
  },
  sampleEmit,
};
