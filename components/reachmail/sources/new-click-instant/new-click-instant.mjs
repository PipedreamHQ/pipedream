import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "reachmail-new-click-instant",
  name: "New Click Instant",
  description: "Emit new event when a recipient clicks on an email.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "Click";
    },
    getSummary(body) {
      return `New click from ${body.Email}`;
    },
  },
  sampleEmit,
};
