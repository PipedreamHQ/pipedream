import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "getaccept-document-viewed",
  name: "New Document Viewed (Instant)",
  description: "Emit new event when a document is opened.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "document.viewed";
    },
    getSummary(body) {
      const {
        document,
        recipient,
      } = body;
      return `The document ${document.name} was viewed by ${recipient.fullname}!`;
    },
  },
  sampleEmit,
};
