import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "papersign-new-signer-signed-instant",
  name: "New Signer Signed (Instant)",
  description: "Emit new event when a signer signs a document.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "signer.signed",
      ];
    },
    getSummary({ data }) {
      return `Document signed by signer ${data.by.name}`;
    },
  },
  sampleEmit,
};
