import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invoiced-invoice-fully-paid",
  name: "Invoice Fully Paid",
  description: "Emit new event when an invoice is paid in full. [See the documentation](https://developer.invoiced.com/api/invoices#list-all-invoices)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.invoiced.listInvoices;
    },
    getSummary(item) {
      return `Invoice Fully Paid: ${item.id}`;
    },
    getParams() {
      return {
        "filter[status]": "paid",
      };
    },
    getDateField() {
      return "updated_at";
    },
  },
  sampleEmit,
};
