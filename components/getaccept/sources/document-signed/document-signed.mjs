import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "getaccept-document-signed",
  name: "New Document Signed (Instant)",
  description: "Emit new event when a document is signed.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "document.signed";
    },
    getSummary(body) {
      const {
        document,
        recipient,
      } = body;
      return `The document ${document.name} was signed by ${recipient.fullname}!`;
    },
  },
  sampleEmit,
};
