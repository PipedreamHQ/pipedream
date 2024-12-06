import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-customer",
  name: "New Customer",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.zohoBooks.listContacts;
    },
    getFieldName() {
      return "contacts";
    },
    getFieldId() {
      return "contact_id";
    },
    getSummary(item) {
      return `New Customer: ${item.contact_name}`;
    },
  },
  sampleEmit,
};
