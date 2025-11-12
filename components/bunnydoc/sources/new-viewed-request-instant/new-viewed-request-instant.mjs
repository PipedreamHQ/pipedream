import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bunnydoc-new-viewed-request-instant",
  name: "New Viewed Signature Request (Instant)",
  description: "Emit new event when a signature request is viewed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "signatureRequestViewed",
      ];
    },
  },
  sampleEmit,
};
