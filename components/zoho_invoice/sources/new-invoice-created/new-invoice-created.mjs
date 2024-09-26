import common from "../common/polling.mjs";

export default {
  ...common,
  key: "zoho_invoice-new-invoice-created",
  name: "New Invoice Created",
  description: "Triggers when a new invoice is created in Zoho Invoice. [See the documentation](https://www.zoho.com/invoice/api/v3/invoices/#list-invoices).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "invoices";
    },
    getResourceFn() {
      return this.app.listInvoices;
    },
    generateMeta(resource) {
      return {
        id: resource.invoice_id,
        summary: `New Invoice: ${resource.invoice_id}`,
        ts: Date.parse(resource.created_time),
      };
    },
  },
};
