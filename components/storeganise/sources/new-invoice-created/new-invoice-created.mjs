import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "storeganise-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created in Storeganise.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.storeganise.listInvoices;
    },
    getParams(lastCreated) {
      return {
        include: [
          "billing",
          "customFields",
        ],
        updatedAfter: lastCreated,
      };
    },
    generateMeta(invoice) {
      return {
        id: invoice.id,
        summary: `New Invoice Created: ${invoice.id}`,
        ts: Date.parse(invoice.created),
      };
    },
  },
  sampleEmit,
};
