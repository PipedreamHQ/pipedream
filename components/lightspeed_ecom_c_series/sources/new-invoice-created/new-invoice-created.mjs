import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-invoice-created",
  name: "New Invoice Created (Instant)",
  description: "Emit new event when an invoice is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "invoices";
    },
    getItemAction() {
      return "created";
    },
    generateMeta(body) {
      return {
        id: body.invoice.id,
        summary: this.getSummary(`Invoice with ID ${body.invoice.id} created`),
        ts: Date.parse(body.invoice.createdAt),
      };
    },
  },
  sampleEmit,
};
