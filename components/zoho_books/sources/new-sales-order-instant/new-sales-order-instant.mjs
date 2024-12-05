import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-sales-order-instant",
  name: "New Sales Order (Instant)",
  description: "Emit new event when a new sales order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntity() {
      return "salesorder";
    },
    generateMeta({ salesorder }) {
      return {
        id: salesorder.salesorder_number,
        summary: `New Sales Order: ${salesorder.salesorder_number}`,
        ts: Date.parse(salesorder.created_time),
      };
    },
  },
  sampleEmit,
};
