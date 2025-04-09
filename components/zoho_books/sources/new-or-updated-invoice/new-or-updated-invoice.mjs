import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-or-updated-invoice",
  name: "New or Updated Invoice",
  description: "Emit new event when a new invoice is created or an existing invoice is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.zohoBooks.listInvoices;
    },
    getFieldName() {
      return "invoices";
    },
    getFieldId() {
      return "invoice_id";
    },
    getTsField() {
      return "last_modified_time";
    },
    getParams(lastDate) {
      return {
        last_modifed_time: this.formatTimestamp(lastDate),
      };
    },
    formatTimestamp(ts) {
      if (!ts) {
        return undefined;
      }
      const date = new Date(ts);
      const pad = (n) => n.toString().padStart(2, "0");
      const formattedUTC = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
      return formattedUTC;
    },
    getItemId(item) {
      return `${item.invoice_id}${Date.parse(item[this.getTsField()])}`;
    },
    getSummary(item) {
      const status = item.created_time === item.last_modified_time
        ? "New"
        : "Updated";
      return `${status} Invoice: ${item.invoice_id}`;
    },
  },
  sampleEmit,
};
