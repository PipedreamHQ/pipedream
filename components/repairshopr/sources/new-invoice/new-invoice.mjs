import common from "../common/source.mjs";

export default {
  ...common,
  key: "repairshopr-new-invoice",
  type: "source",
  name: "New Invoice",
  description: "Emit new event when a new invoice is created.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getData() {
      return this.app.listInvoices;
    },
    getAgregatorProp() {
      return "invoices";
    },
    getParams() {
      return {
        since_updated_at: this.getLastEmittedDate(),
      };
    },
    getSummary(event) {
      return {
        id: event.id,
        summary: event.customer_business_then_name || event.number || event.id,
        ts: event.created_at || Date.now(),
      };
    },
  },
};
