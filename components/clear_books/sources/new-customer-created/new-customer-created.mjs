import common from "../common/base.mjs";

export default {
  ...common,
  key: "clear_books-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is added to the system.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFn() {
      return this.clearBooks.listCustomers;
    },
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `New Customer with ID: ${customer.id}`,
        ts: Date.now(),
      };
    },
  },
};
