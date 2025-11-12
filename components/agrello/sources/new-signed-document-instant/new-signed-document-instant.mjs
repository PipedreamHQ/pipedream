import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agrello-new-signed-document-instant",
  name: "New Signed Document (Instant)",
  description: "Emit new event when a given document is signed by all parties.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "DOCUMENT_SIGNED";
    },
    getSummary(event) {
      return `Document signed: ${event.containerId}`;
    },
  },
  sampleEmit,
};
