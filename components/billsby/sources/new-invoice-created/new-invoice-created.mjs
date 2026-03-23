import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "billsby-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new company invoice is created. [See the documentation](https://support.billsby.com/reference/get-company-credit-notes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.billsby.listCompanyInvoices;
    },
    getParams() {
      return {
        orderByDescending: "createdOn",
      };
    },
    generateMeta(invoice) {
      return {
        id: invoice.invoiceId,
        summary: `New Invoice with ID ${invoice.invoiceId}`,
        ts: Date.parse(invoice.createdOn),
      };
    },
  },
};
