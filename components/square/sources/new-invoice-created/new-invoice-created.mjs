import base from "../common/base.mjs";

export default {
  ...base,
  key: "square-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event for every new invoice created",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving at most last 25...");
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "invoice.created",
      ];
    },
    getSummary(event) {
      return `Invoice created: ${event.data.id}`;
    },
  },
  getTimestamp(event) {
    return new Date(event.data.object.invoice_created.created_at);
  },
};
