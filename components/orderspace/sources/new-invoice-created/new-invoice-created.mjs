import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-new-invoice-created",
  name: "New Invoice Created (Instant)",
  description: "Emit new event when an invoice is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "invoice.created",
      ];
    },
    generateMeta(data) {
      return {
        id: data.invoice.id,
        summary: `Invoice ${data.invoice.id} created`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
