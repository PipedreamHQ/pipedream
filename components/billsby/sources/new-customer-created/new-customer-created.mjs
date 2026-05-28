import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "billsby-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created. [See the documentation](https://support.billsby.com/reference/getting-started-with-your-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.billsby.listCustomers;
    },
    generateMeta(customer) {
      return {
        id: customer.customerUniqueId,
        summary: `New Customer with ID ${customer.customerUniqueId}`,
        ts: Date.parse(customer.createdOn),
      };
    },
  },
};
