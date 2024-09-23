import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_inventory-new-invoice",
  name: "New Invoice",
  description: "Emit new event each time a new invoice is created in Zoho Inventory",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoInventory.listInvoices.bind(this);
    },
    getResourceType() {
      return "invoices";
    },
    generateMeta(invoice) {
      return {
        id: invoice.invoice_id,
        summary: `New Invoice ${invoice.invoice_number}`,
        ts: Date.parse(invoice.created_time),
      };
    },
  },
};
