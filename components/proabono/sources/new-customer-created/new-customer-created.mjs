import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "proabono-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created. [See the documentation](https://docs.proabono.com/api/#list-customers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.proabono.listCustomers;
    },
    generateMeta(customer) {
      return {
        id: customer.Id,
        summary: `New Customer ${customer.Name || customer.Id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
