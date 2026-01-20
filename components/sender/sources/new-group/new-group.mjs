import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sender-new-group",
  name: "New Group (Instant)",
  description: "Emit new event when a new group is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "groups/new";
    },
    getSummary(body) {
      return `New Group: ${body.title}`;
    },
  },
  sampleEmit,
};
