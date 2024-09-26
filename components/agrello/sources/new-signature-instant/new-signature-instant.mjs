import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agrello-new-signature-instant",
  name: "New Signature Added to Document (Instant)",
  description: "Emit new event when a signature is added to a container.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "DOCUMENT_SIGNATURE_ADDED";
    },
    getSummary(event) {
      return `New signature added to container: ${event.containerId}`;
    },
  },
  sampleEmit,
};
