import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bunnydoc-new-completed-request-instant",
  name: "New Completed Signature Request (Instant)",
  description: "Emit new event each time a signature request is completed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "signatureRequestCompleted",
      ];
    },
  },
  sampleEmit,
};
