import base from "../common/base.mjs";

export default {
  ...base,
  key: "helpcrunch-new-customer",
  name: "New Customer",
  version: "0.0.1",
  description: "Emit new event when a new customer is created. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1/search-customers-v1)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.helpcrunch.searchCustomers;
    },
    getKey() {
      return "id";
    },
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `New Customer with ID ${customer.id}`,
        ts: Date.now(),
      };
    },
  },
};
