import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bunnydoc-new-signed-request-instant",
  name: "New Signed Request (Instant)",
  description: "Emit new event each time a signature request is signed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "signatureRequestSigned",
      ];
    },
  },
  sampleEmit,
};
