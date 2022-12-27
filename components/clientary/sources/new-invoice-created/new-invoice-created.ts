import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new events when a new invoice was created. [See the docs](https://www.clientary.com/api/invoices)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getInvoices",
        resourceName: "invoices",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New invoice ${item.number} ID(${item.id})`;
    },
  },
});
