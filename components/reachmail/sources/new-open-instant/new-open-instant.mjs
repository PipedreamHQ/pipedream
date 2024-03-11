import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "reachmail-new-open-instant",
  name: "New Email Open Instant",
  description: "Emit new event when a recipient opens an email.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "Open";
    },
    getSummary(body) {
      return `Email opened by ${body.Email}`;
    },
  },
  sampleEmit,
};
