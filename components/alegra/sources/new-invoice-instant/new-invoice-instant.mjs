import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "alegra-new-invoice-instant",
  name: "New Invoice Created (Instant)",
  description: "Emit new event when a new invoice is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "new-invoice";
    },
    getSummary({ invoice }) {
      return `New invoice created: ${invoice.id}`;
    },
  },
  sampleEmit,
};
