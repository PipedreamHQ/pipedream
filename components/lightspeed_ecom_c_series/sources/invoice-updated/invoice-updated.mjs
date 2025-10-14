import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-invoice-updated",
  name: "Invoice Updated (Instant)",
  description: "Emit new event when an invoice is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "invoices";
    },
    getItemAction() {
      return "updated";
    },
    generateMeta(body) {
      return {
        id: body.invoice.id,
        summary: `Invoice with ID ${body.invoice.id} updated`,
        ts: Date.parse(body.invoice.updatedAt),
      };
    },
  },
  sampleEmit,
};
